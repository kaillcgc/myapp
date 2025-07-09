// store/user.js
import { defineStore } from "pinia"
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,       
    token: null       
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    userRole: (state) => state.user?.role || 'guest'
  },
  
  actions: {
    // 登录方法：接收用户名和密码，返回登录结果
    async login(username, password) {
      // 管理员验证
      if (username === 'admin' && password === '123') { // 密码改为123
        this.user = {
          id: 1,
          username: 'admin',
          role: 'admin',
          name: '系统管理员'
        }
        this.token = 'admin-token-' + Date.now()
        return true
      }
      
      // 普通用户（示例逻辑，可扩展）
      if (password) { // 只要密码非空就登录为普通用户
        this.user = {
          id: 2,
          username,
          role: 'user',
          name: username
        }
        this.token = 'user-token-' + Date.now()
        return true
      }
      
      return false
    },
    
    logout() {
      this.user = null
      this.token = null
    }
  }
})