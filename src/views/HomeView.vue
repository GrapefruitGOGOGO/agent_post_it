<script setup lang="ts">
import { BubbleList } from 'ant-design-x-vue';
import { handleSubmit, inputModel, isLoading, messages, roles } from '@/hooks/chat.tsx';

</script>

<template>
  <div class="page-container">
    <AXWelcome v-if="!messages?.length"
      style="background-image: linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%); border-start-start-radius: 4px;"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="您好，欢迎使用物品便利贴！" description="我可以帮你记录家用物品的位置，存放时间，过期时间，并给与过期提醒等功能~" />
    <template v-else>
      <BubbleList autoScroll :items="messages" :roles style="padding-bottom: 180px;" />
    </template>
    <div class="sender-container">
      <div class="sender-container-bg"></div>
      <AXSender v-model:value="inputModel" :loading="isLoading" placeholder="输入信息记录或查找..." class="sender"
        @submit="handleSubmit" />
    </div>
  </div>
</template>

<style scoped>
.sender-container {
  position: fixed;
  bottom: 0px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  width: 45vw;
  min-width: 800px;
  padding-bottom: 80px;
  background-color: #fff;
}

.sender-container-bg {
  position: absolute;
  top: -40px;
  left: 0px;
  width: 100%;
  height: 40px;
  background: linear-gradient(180deg, #ffffff00 0%, #ffffff 100%);
}
</style>
