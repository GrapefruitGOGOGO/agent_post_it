# 家庭物品管理器

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-3.x-0170FE?logo=ant-design)](https://antdv.com/)
[![Ant Design X Vue](https://img.shields.io/badge/Ant%20Design%20X%20Vue-1.x-0170FE?logo=ant-design)](https://antd-design-x-vue.netlify.app/)

一个基于 Vue 3 和 TypeScript 开发的智能家庭物品管理系统，具有 AI 驱动的对话界面。

## ⚠️ 安全警告

本项目目前在前端直接使用 OpenAI API，这种方式**不建议在生产环境中使用**。API 密钥暴露在前端代码中可能导致：

- API 密钥被未授权使用
- 可能产生意外的 API 费用
- 安全漏洞

对于生产环境，我们强烈建议：

1. 部署后端服务来处理 API 调用
2. 将 API 密钥存储在服务器的环境变量中
3. 实现适当的身份验证和速率限制
4. 使用 API 密钥轮换和监控机制

更多详细信息请参见 [SECURITY.md](SECURITY.md)。

## 功能特点

- 🤖 AI 驱动的自然语言对话界面
- 📦 完整的物品管理（增删改查）
- 🏷️ 智能分类和标签管理
- ⏰ 过期日期追踪和提醒
- 📊 库存不足预警
- 💾 本地存储数据持久化
- 📱 响应式设计
- 🌐 多语言支持

## 技术栈

- Vue 3
- TypeScript
- OpenAI API
- UI 框架：
  - [Ant Design Vue](https://antdv.com/) - 企业级 UI 设计语言和 Vue UI 组件库
  - [Ant Design X Vue](https://antd-design-x-vue.netlify.app/) - 专注于 AI 的 Vue UI 组件库
- Day.js
- Markdown-it

## 快速开始

### 环境要求

- Node.js (v18 或更高版本)
- pnpm（推荐）或 npm
- OpenAI API 密钥

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/home-item-manager.git
cd home-item-manager
```

2. 安装依赖：

```bash
pnpm install
```

3. 在项目根目录创建 `.env` 文件：

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

4. 启动开发服务器：

```bash
pnpm dev
```

### 开发命令

```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建
pnpm build
```

## 项目结构

```
src/
├── components/     # Vue 组件
├── hooks/         # Vue composition API hooks
├── router/        # Vue 路由配置
├── views/         # 页面组件
└── App.vue        # 根组件
```

## 贡献指南

欢迎提交 Pull Request 来改进项目！

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- [Vue.js](https://vuejs.org/)
- [OpenAI](https://openai.com/)
- [Ant Design Vue](https://antdv.com/)
- [Day.js](https://day.js.org/)
