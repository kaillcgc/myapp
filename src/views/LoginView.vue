<template>
  <div class="login-container">
    <h1>用户登录</h1>
    <!-- 仅使用原生form和input，不依赖Element组件 -->
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="autologin"> 自动登录
        </label>
      </div>
      <button type="submit" class="login-button">登录</button>
    </form>
    <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

// 移除Element Plus的ElMessage依赖，改用原生alert（避免样式干扰）
const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const autologin = ref(false)

const handleLogin = async () => {
  const success = await userStore.login(username.value, password.value)
  if (success) {
    // 登录成功跳转
    if (userStore.userRole === 'admin') {
      router.push('/admin/news')
    } else {
      // 普通用户跳转到个人资料页，并带上用户名参数
      router.push(`/user/profile/${username.value}`)
    }
  } else {
    // 原生提示，不依赖Element
    alert('登录失败，请检查用户名和密码！')
  }
}
</script>

<style scoped>
/* 恢复原有完整CSS，确保样式独立 */
.login-container {
  max-width: 400px;
  margin: 100px auto; /* 居中显示，距离顶部有一定距离 */
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); /* 轻微阴影增强层次感 */
}

h1 {
  text-align: center;
  color: #cc1c1c; /* 保持系统主色 */
  margin-bottom: 25px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #cc1c1c; /* 聚焦时主色边框 */
  outline: none;
}

input[type="checkbox"] {
  margin-right: 8px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #cc1c1c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #a51818; /* 深色 hover 效果 */
}

p {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

router-link {
  color: #cc1c1c;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>