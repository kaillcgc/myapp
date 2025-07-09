// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user' // 导入Pinia Store
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetailView.vue')
  },
  {
    path: '/user/profile/:yhm',
    name: 'UserProfile',
    component: () => import('@/views/user/profile.vue'),
    meta: { requiresAuth: true } // 需要登录才能访问
  },
  // 管理员新闻管理路由（需权限）
  {
    path: '/admin/news',
    name: 'NewsManage',
    component: () => import('@/views/admin/NewsManageView.vue'),
    meta: { requiresAuth: true, role: 'admin' } // 标记需登录+管理员角色
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫：控制权限
router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // 获取用户Store

  // 需认证的路由
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 未登录，跳转到登录页
      next('/login')
    } else if (to.meta.role && userStore.userRole !== to.meta.role) {
      // 角色不符，跳转到首页
      next('/')
      ElMessage.warning('无权限访问该页面！')
    } else {
      next()
    }
  } else {
    next()
  }
  if (to.meta.role && userStore.userRole !== to.meta.role) {
    ElMessage.warning('无权限访问该页面！') // 现在可正常调用
    next('/')
  }
})

export default router