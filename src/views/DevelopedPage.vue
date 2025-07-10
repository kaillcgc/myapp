<template>
  <div class="bodybackground">
    <div class="news-container">
      
      <div class="container" style="text-align: center">
        <!-- 开发中提示内容 -->
         <h2 style="margin-top: 40px; text-align: center; margin-bottom: 0">
        —— &nbsp;系统提示&nbsp; ——
        </h2>
        <div class="construction-content" style="margin-top: 65px;">
          <h3 style="font-size: 24px; color: #666; margin-bottom: 20px">
            此网页正在开发中
          </h3>
          <p style="font-size: 16px; color: #999">
            敬请期待...
          </p>
          <router-link 
            to="/" 
            style="
              display: inline-block;
              margin-top: 30px;
              padding: 8px 20px;
              background: #42b983;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            "
          >
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以保留基础配置
import '@/assets/css/zxxx.css'
import { onMounted } from 'vue';
  onMounted(()=>{
    document.title='开发页面 - 四川非遗新闻发布系统';
  })
</script>

<style scoped>
/* 添加专门的开发中页面样式 */
.construction-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .construction-content {
    padding: 20px;
  }
}
</style>