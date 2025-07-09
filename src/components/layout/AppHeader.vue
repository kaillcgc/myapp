<!-- src/components/TopCon.vue -->
<template>
  <div class="background">
    <div class="topcon">
      <div class="top0-con" style="width: 1400px;height: 30px;margin: 0 auto;">
        <div class="top0">
          <template v-if="!userStore.isLoggedIn">
            <router-link to="/login">用户登录</router-link>
          </template>
          <template v-else>
            <!-- 修复：用户信息在user对象中 -->
            当前用户：{{ userStore.user?.username }} | 
            <a v-if="userStore.autologin" href="#" @click.prevent="removeAutologin">取消自动登录</a>
            <a v-else href="#" @click.prevent="logout">退出登录</a>
          </template>
        </div>
        
        <div class="gnul">
          <ul>
            <!-- 修复：使用isAdmin的getter（需在userStore中定义） -->
            <template v-if="userStore.isAdmin">
              <li><router-link to="/admin/activity">活动管理</router-link></li> |
              <li><router-link to="/admin/news">新闻管理</router-link></li> |
              <li><router-link to="/admin/comments">评论管理</router-link></li> |
              <li><router-link to="/admin/users">用户管理</router-link></li>
            </template>
            <template v-else-if="userStore.isLoggedIn">
              <li><router-link to="/user/comments">评论管理</router-link></li> |
              <li><router-link to="/user/profile">用户管理</router-link></li>
            </template>
          </ul>
        </div>
      </div>

      <div class="top">
        <h1>四川非遗新闻发布系统</h1>
        <h2>Sichuan Intangible Cultural Heritage News Release System</h2>
        <div class="logo">
          <img src="@/assets/img/安逸四川.png" alt="logo图标" width="180px" height="100px">
        </div>
        <div class="timecon">
          <span>{{ currentTime }}</span>
        </div>
        <div class="fo" style="padding-bottom: 15px;">
          <form @submit.prevent="searchNews">
            <div class="search-box">
              <div class="search">
                <img src="@/assets/img/search.png" alt="search" width="20px" height="20px">
                <input type="text" placeholder="请输入关键字" v-model="searchKeyword" size="50">
              </div>
              <input class="sea-but" type="submit" value="搜一下">
            </div>
          </form>
        </div>
      </div>
      
      <div class="navcon">
        <div class="nav">
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/heritage">非遗概览</router-link></li> <!-- 改为router-link -->
            <li>
              <a href="#">非遗项目</a>
              <div class="subnav">
                <ul>
                  <li><router-link to="/projects/literature">民间文学</router-link></li>
                  <li><router-link to="/projects/art">传统美艺</router-link></li>
                </ul>
              </div>
            </li>
            <li><router-link to="/inheritors">传承人风采</router-link></li>
            <li><router-link to="/protection">非遗保护与传承</router-link></li>
            <li>
              <a href="#">非遗资源与下载</a>
              <div class="subnav">
                <ul>
                  <li><router-link to="/resources/books">相关书籍</router-link></li>
                  <li><router-link to="/resources/videos">影音资料</router-link></li>
                  <li><router-link to="/resources/reports">研究报告</router-link></li>
                </ul>
              </div>
            </li>
            <li><router-link to="/about">关于我们</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const searchKeyword = ref('')
const currentTime = ref('')

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const removeAutologin = () => {
  userStore.autologin = false // 需在userStore的state中添加autologin
}

const searchNews = () => {
  if (searchKeyword.value.trim()) {
    // 跳转到搜索结果页（需创建对应页面）
    router.push({ path: '/search', query: { keyword: searchKeyword.value } })
  }
}

// 更新时间
onMounted(() => {
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString()
  }
  updateTime() // 初始化
  const timer = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>