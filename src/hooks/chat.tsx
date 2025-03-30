import type { BubbleListProps } from 'ant-design-x-vue'
import { ref } from 'vue'
import OpenAI from 'openai'
import markdownit from 'markdown-it'
import { Space, Spin, Typography } from 'ant-design-vue'
import { tools } from './itemFunctions'
import type {
  ChatCompletionTool,
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageToolCall,
} from 'openai/resources'
import { itemTools } from './itemFunctions'
import dayjs from 'dayjs'

/* 解析markdown */
const md = markdownit({ html: true, breaks: true })

// 消息类型定义
type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

interface BaseMessage {
  key: number
  role: MessageRole
  content: string
}

interface UserMessage extends BaseMessage {
  role: 'user'
}

interface AssistantMessage extends BaseMessage {
  role: 'assistant'
  tool_calls?: ChatCompletionMessageToolCall[]
}

interface SystemMessage extends BaseMessage {
  role: 'system'
}

interface FunctionMessage extends BaseMessage {
  role: 'tool'
  name: string
  tool_call_id?: string
}

type Message = UserMessage | AssistantMessage | SystemMessage | FunctionMessage

type ShowMessage = Message & { loading?: boolean }

type MessageOptions = {
  name?: string
  tool_call_id?: string
  tool_calls?: ChatCompletionMessageToolCall[]
}

// UI 配置
const loadingText = ref('智能体运行中...')
export const roles: BubbleListProps['roles'] = {
  assistant: {
    placement: 'start',
    header: <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.3)' }}>物品便利贴：</span>,
    avatar: {
      icon: (
        <img src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" />
      ),
      style: {
        background: 'none',
      },
    },
    typing: { step: 2, interval: 50 },
    messageRender: (content) => {
      return (
        <Typography>
          <div v-html={md.render(content)} />
        </Typography>
      )
    },
    loadingRender: () => (
      <Space>
        <Spin size="small" />
        {loadingText.value}
      </Space>
    ),
    variant: 'outlined',
    styles: {
      content: {
        fontSize: '16px',
        maxWidth: '90%',
      },
    },
  },
  user: {
    placement: 'end',
    color: '#165DFF',
    styles: {
      avatar: {
        display: 'none',
      },
      content: {
        backgroundColor: '#eff6ff',
        maxWidth: '90%',
        fontSize: '16px',
      },
    },
  },
}

// OpenAI 客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// 消息管理
class MessageManager {
  private messages: Message[] = []
  private readonly maxHistoryLength = 30

  // 添加消息
  addMessage(message: Message) {
    this.messages.push(message)
  }

  // 获取最近的消息历史
  getRecentHistory(): Message[] {
    return this.messages.slice(-this.maxHistoryLength)
  }

  // 转换为 OpenAI 消息格式
  toOpenAIMessages(): ChatCompletionMessageParam[] {
    return this.getRecentHistory().map((msg) => {
      switch (msg.role) {
        case 'tool':
          return {
            role: 'tool',
            name: msg.name,
            content: msg.content,
            tool_call_id: msg.tool_call_id,
          } as ChatCompletionToolMessageParam
        case 'user':
          return {
            role: 'user',
            content: msg.content,
          } as ChatCompletionUserMessageParam
        case 'assistant':
          return {
            role: 'assistant',
            content: msg.content,
            tool_calls: msg.tool_calls,
          } as ChatCompletionAssistantMessageParam
        case 'system':
          return {
            role: 'system',
            content: msg.content,
          } as ChatCompletionSystemMessageParam
      }
    })
  }

  // 清空消息
  clear() {
    this.messages = []
  }
}

// 状态管理
const messageManager = new MessageManager() // 消息管理
export const messages = ref<ShowMessage[]>([]) // 消息列表
export const inputModel = ref('') // 输入框内容
export const isTyping = ref(false) // 是否正在输入
export const isLoading = ref(false) // 是否正在加载

// 创建消息
const createMessage = (
  role: MessageRole,
  content: string,
  options: MessageOptions = {},
): Message => {
  const baseMessage: BaseMessage = {
    key: Date.now(),
    role,
    content,
  }

  switch (role) {
    case 'tool':
      if (!options.name) throw new Error('Function messages must have a name')
      return {
        ...baseMessage,
        role: 'tool',
        name: options.name,
        tool_call_id: options.tool_call_id,
      } as FunctionMessage
    case 'assistant':
      return {
        ...baseMessage,
        role: 'assistant',
        tool_calls: options.tool_calls,
      } as AssistantMessage
    default:
      return baseMessage as Message
  }
}

// 处理工具调用
const handleToolCall = async (toolCall: ChatCompletionMessageToolCall, toolCallContent: string) => {
  try {
    console.log('🚀 ~ handleToolCall ~ toolCall.function.name:', toolCall.function.name)
    const functionName = toolCall.function.name
    console.log('🚀 ~ handleToolCall ~ functionName:', functionName)
    const args = JSON.parse(toolCallContent)

    const tool = itemTools[functionName as keyof typeof itemTools]
    if (!tool) {
      throw new Error(`未知的函数: ${functionName}`)
    }
    loadingText.value = tool.beforeLoadingText
    const result = await tool.func(args)
    loadingText.value = tool.afterLoadingText

    return createMessage('tool', JSON.stringify(result), {
      name: toolCall.function.name,
      tool_call_id: toolCall.id,
    })
  } catch (error: unknown) {
    console.error('工具调用失败:', error)
    return createMessage(
      'tool',
      `工具调用失败: ${error instanceof Error ? error.message : '未知错误'}`,
      {
        name: toolCall.function.name,
        tool_call_id: toolCall.id,
      },
    )
  }
}

// 获取 AI 响应
const getResponse = async (isToolCall: boolean = false) => {
  const msgList: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        '你是一个友好的智能助手，可以回答用户的问题，并给出友好的建议。\n' +
        '你可以帮助用户管理家庭物品，包括添加、查询、更新和删除物品信息。\n' +
        '你在执行任务时，需要以当前时间作为参考，' +
        '当前时间：' +
        dayjs().format('YYYY-MM-DD HH:mm:ss') +
        '\n识别用户意图时，当你无法确认是否符合你的工作内容时，可以先调用合理的tools来判断，如果确认用户意图非物品管理相关，请简要说明自己的职责并礼貌拒绝，不要提供任何额外的建议。',
    } as ChatCompletionSystemMessageParam,
    ...messageManager.toOpenAIMessages(),
  ]

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: msgList,
    tools: tools as ChatCompletionTool[],
    tool_choice: 'auto',
    stream: true,
  })

  // 创建新的助手消息
  const assistantMessage = createMessage('assistant', '')

  if (!isToolCall) {
    // 新增消息
    messages.value.push({ ...assistantMessage, loading: true })
  }

  let currentToolCall: ChatCompletionMessageToolCall | null = null
  let toolCallContent = ''

  for await (const chunk of response) {
    const delta = chunk.choices[0]?.delta

    // 处理工具调用
    if (delta?.tool_calls) {
      const toolCall = delta.tool_calls[0]
      if (toolCall?.id) {
        currentToolCall = toolCall as ChatCompletionMessageToolCall
        toolCallContent = ''
        if (assistantMessage.role === 'assistant') {
          assistantMessage.tool_calls = delta.tool_calls.map((tc) => ({
            ...tc,
          })) as unknown as ChatCompletionMessageToolCall[]
        }
      }
      if (toolCall?.function?.arguments) {
        toolCallContent += toolCall.function.arguments
      }
    }

    // 处理消息内容
    if (delta?.content) {
      assistantMessage.content += delta.content
      // 同步更新消息
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage) {
        lastMessage.content = assistantMessage.content
        loadingText.value = '智能体运行中...'
        lastMessage.loading = false
      }
    }
  }

  // 添加消息记录
  messageManager.addMessage(assistantMessage)

  if (currentToolCall && toolCallContent) {
    console.log('🚀 ~ getResponse ~ currentToolCall:', currentToolCall)
    // 处理工具调用
    const functionMessage = await handleToolCall(currentToolCall, toolCallContent)
    // 添加工具调用消息记录
    messageManager.addMessage(functionMessage)
    // 继续获取 AI 响应
    await getResponse(true)
  }

  isTyping.value = false
  isLoading.value = false
}

// 处理用户提交
export const handleSubmit = async () => {
  if (!inputModel.value.trim() || isLoading.value) return

  const userMessage = createMessage('user', inputModel.value)
  messageManager.addMessage(userMessage)
  messages.value.push({ ...userMessage })

  inputModel.value = ''
  isLoading.value = true
  isTyping.value = true

  await getResponse()
}
