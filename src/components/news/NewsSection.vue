<template>
<div class="bodybackground">
  <div class="news-container">
    <div class="container">
      <h2 style="margin-top: 25px;text-align: center;margin-bottom: 0">—— &nbsp;最新消息&nbsp; ——</h2>
      <div class="conleft">
        <NewsCarousel />
      </div>
      <div class="conright">
        <div class="news">
          <ul class="newsul">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-indicator">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              加载中...
            </div>
            
            <!-- 错误提示 -->
            <div v-if="error" class="error-message">
              {{ error }}
              <el-button type="text" @click="fetchNews">重试</el-button>
            </div>
            
            <!-- 空数据提示 -->
            <div v-if="!loading && !error && newsList.length === 0" class="empty-message">
              暂无最新消息
            </div>
            
            <!-- 新闻列表 -->
            <li v-for="news in newsList" :key="news.id">
              <router-link :to="`/news/${news.id}`" style="text-decoration: none">{{ news.title }}</router-link>
            </li>
            
            <div class="more-title">
              <div class="line">
                <img src="@/assets/img/gdt.png" alt="fgx">
                <router-link to="MoreNews" style="color: #9F9F9F;font-size: 15px;text-decoration: none;padding-left: 8px;">
                  更多新闻
                </router-link>
              </div>
            </div>
          </ul>
        </div>
        <div class="news">
          <ul class="newsul">
            <li><a href="#">评论区开发中，敬请期待...</a></li>
            <div class="more-title">
              <div class="line">
                <img src="@/assets/img/gdt.png" alt="fgx">
                <a href="#" style="color: #9F9F9F;font-size: 15px;text-decoration: none;padding-left: 8px;">更多评论</a>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import NewsCarousel from '@/components/news/NewsCarousel.vue'
import '@/assets/css/zxxx.css'

// 响应式数据
const newsList = ref([])
const loading = ref(false)
const error = ref(null)

// 获取新闻数据
const fetchNews = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('http://127.0.0.1:8080/news')
    
    // 检查响应状态
    if (response.status >= 200 && response.status < 300) {
      // 将后端数据映射到前端需要的格式
      newsList.value = response.data.map(item => ({
        id: item.id,
        title: item.title
      }))
    } else {
      error.value = '请求失败: ' + response.statusText
      ElMessage.error(error.value)
    }
  } catch (err) {
    console.error('获取新闻列表失败:', err)
    error.value = '获取新闻列表失败: ' + (err.response?.data?.message || err.message)
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchNews()
})
</script>