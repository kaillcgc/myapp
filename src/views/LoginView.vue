<template>
  <div class="bodybackground">
    <div class="login-container">
      <h1>用户登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="loginData.yhm" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="loginData.mm" required>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="autologin"> 自动登录
          </label>
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>
      <p>还没有账号？<router-link to="/register">立即注册</router-link></p>

      <!-- 错误消息显示 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import '@/assets/css/zxxx.css'
import { useUserStore } from '@/store/user' // 引入 Pinia store

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore() // 使用 Pinia store

    const loginData = ref({
      yhm: '',
      mm: ''
    })
    const autologin = ref(false)
    const errorMessage = ref('')

    const handleLogin = async () => {
      if (!loginData.value.yhm || !loginData.value.mm) {
        errorMessage.value = '用户名和密码不能为空'
        return
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8080/login',
          loginData.value
        )

        if (response.data.success) {
          // 1. 更新 Pinia store
          userStore.setUser(response.data.user)

          // 2. 更新 token（如果有）
          if (response.data.token) {
            userStore.setToken(response.data.token)
          }

          // 3. 根据角色跳转
          if (response.data.user.js === 'admin') {
            router.push('/admin/news')
          } else {
            router.push('/')
          }
        } else {
          errorMessage.value = response.data.message || '登录失败'
        }
      } catch (error) {
        if (error.response) {
          errorMessage.value = error.response.data.message || '登录失败'
        } else if (error.request) {
          errorMessage.value = '无法连接到服务器'
        } else {
          errorMessage.value = '登录过程中发生错误'
        }
      }
    }

    return {
      loginData,
      autologin,
      errorMessage,
      handleLogin
    }
  },

  mounted(){
    document.title='用户登录 - 四川非遗新闻发布系统';
  }
}
</script>
<style scoped>
/* 原有样式保持不变 */

/* 添加错误消息样式 */
.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: #cc1c1c;
  border-radius: 4px;
  text-align: center;
}

.login-container {
  width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1 {
  text-align: center;
  color: #cc1c1c;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-right: 5px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #cc1c1c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #a51818;
}
</style>