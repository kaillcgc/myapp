import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8080/api'

// 根据用户名查询用户信息（后端返回角色字段为`js`）
export function getUserByUsername(yhm) {
  return axios.get(`${API_BASE_URL}/user/${yhm}`)
    .then(response => response.data)
    .catch(error => {
      console.error('获取用户信息失败:', error)
      throw error
    })
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,       // 当前用户信息（包含`js`角色字段）
    token: null,      // 认证令牌
    userId: null, 
    autologin: false  
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,  
    // 角色字段改为`js`（与后端一致）
    userRole: (state) => state.user?.js || 'user',  
    // 判断是否为管理员（角色值为`admin`）
    isAdmin: (state) => state.user?.js === 'admin'  
  },
  
  actions: {
    // 登录方法（角色字段使用`js`）
    async login(username, password) {
      // 管理员登录（角色设为`admin`，字段为`js`）
      if (username === 'admin' && password === '123') {
        this.user = {
          id: 1,
          username: 'admin',
          js: 'admin',  // 核心：角色字段为`js`，值为`admin`
          name: '系统管理员'
        }
        this.token = 'admin-token-' + Date.now()
        return true
      }
      
      // 普通用户登录（角色设为`user`，字段为`js`）
      if (password) {
        this.user = {
          id: 2,
          username,
          js: 'user',  // 角色字段为`js`，值为`user`
          name: username
        }
        this.token = 'user-token-' + Date.now()
        return true
      }
      
      return false
    },
    
    // 设置用户信息（确保`js`字段被正确存储）
    setUser(userData) {
      this.user = userData  // userData包含`js`角色字段
    },
    
    initialize() {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        this.user = JSON.parse(savedUser)  // 从本地存储加载时包含`js`
      }
    },
    
    setToken(tokenValue) {
      this.token = tokenValue
    },
    
    logout() {
      this.user = null
      this.token = null
      this.autologin = false
    }
  }
})