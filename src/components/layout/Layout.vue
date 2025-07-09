<!-- src/components/Layout.vue -->
<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <TopCon />

    <!-- 主体内容区（左侧栏 + 主内容） -->
    <div class="main-container">
      <!-- 左侧栏 -->
      <Left class="sidebar" />

      <!-- 主内容（路由页面在这里显示） -->
      <div class="content">
        <router-view />
      </div>
    </div>

    <!-- 页脚区域 -->
    <BottomCon />
  </div>
</template>

<script setup>
// 导入现有组件
import TopCon from './TopCon.vue' // 假设头部组件文件名是TopCon.vue
import Left from './Left.vue'
import BottomCon from './BottomCon.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主体内容区：左侧栏 + 主内容并排 */
.main-container {
  display: flex;
  flex: 1; /* 占满剩余空间 */
  margin: 20px auto;
  width: 1440px; /* 和头部宽度一致 */
  gap: 20px; /* 左侧栏和主内容间距 */
}

/* 左侧栏样式 */
.sidebar {
  width: 280px; /* 固定宽度 */
  flex-shrink: 0; /* 不收缩 */
}

/* 主内容区样式 */
.content {
  flex: 1; /* 占满剩余宽度 */
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style>