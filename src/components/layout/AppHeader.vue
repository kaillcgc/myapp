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
            <!-- 修复1: 使用 userStore.user?.yhm 而不是 username -->
            当前用户：{{ userStore.user?.yhm }} | 
            <!-- 修复2: 添加角色显示 -->
            <span class="user-role">({{ userStore.userRole }})</span> |
            
            <!-- 修复3: 添加退出登录功能 -->
            <a href="#" @click.prevent="logout">退出登录</a>
          </template>
        </div>

        <div class="gnul">
          <ul>
            <!-- 修复4: 使用 userStore.isAdmin 判断管理员权限 -->
            <template v-if="userStore.isAdmin">
              <li><router-link to="/admin/news">新闻管理</router-link></li> |
              <li><router-link to="/ActivityManage">活动管理</router-link></li> |
              <li><router-link to="/admin/users">用户管理</router-link></li>
              
            </template>
            <template v-else-if="userStore.isLoggedIn">
              <!-- 修复5: 使用正确的路由路径 -->
              <li><router-link to="/GuestManage">用户管理</router-link></li>
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
            <li><router-link to="/DevelopedPage">非遗概览</router-link></li> <!-- 改为router-link -->
            <li> <router-link to="/DevelopedPage">非遗项目</router-link></li>
            <li><router-link to="/DevelopedPage">传承人风采</router-link></li>
            <li><router-link to="/DevelopedPage">非遗保护与传承</router-link></li>
            <li><router-link to="/DevelopedPage">非遗资源与下载</router-link></li>
            <li><router-link to="/DevelopedPage">关于我们</router-link></li>
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

// 修复6: 添加退出登录方法
const logout = () => {
  userStore.logout()
  router.push('/login')
}

// 修复7: 添加移除自动登录方法
// const removeAutologin = () => {
//   userStore.autologin = false
//   // 实际应用中可能需要调用API取消自动登录
// }

// 修复8: 添加搜索方法
const searchNews = () => {
  if (searchKeyword.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { keyword: searchKeyword.value } 
    })
  }
}

// 更新时间
onMounted(() => {
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString()
  }
  updateTime()
  const timer = setInterval(updateTime, 1000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>
<style scoped>
/* 添加用户角色样式 */
.user-role {
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
}

/* 其余样式保持不变 */
</style>
