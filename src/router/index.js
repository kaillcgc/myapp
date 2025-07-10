// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user' // 导入Pinia Store
import { ElMessage } from 'element-plus'
import ReleseNews from "@/views/admin/ReleseNews.vue"
import GuestManage from "@/views/user/GuestManage.vue"
import NewsManageView from '@/views/admin/NewsManageView.vue'
import DevelopedPage from "@/views/DevelopedPage.vue"
import UserManageView from '@/views/admin/UserManageView.vue'
import RegistPage from '@/views/RegistPage.vue'
import MoreNews from '@/views/MoreNews.vue'
import ActivityManage from '@/views/admin/ActivityManage.vue'
import ReleseActivity from '@/views/admin/ReleseActivity.vue'
import modiActivity from '@/views/admin/modiActivity.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/ReleseNews',
    name: 'ReleseNews',
    component: ReleseNews
  },
  {
    path: '/ReleseActivity',
    name: 'ReleseActivity',
    component: ReleseActivity
  },
  {
    path: '/modiActivity/:id',
    name: 'modiActivity',
    component: modiActivity
  },
  {
    path: '/ActivityManage',
    name: 'ActivityManage',
    component: ActivityManage
  },
  {
    path: '/MoreNews',
    name: 'MoreNews',
    component: MoreNews
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
   {
    path: '/register',
    name: 'Regist',
    component: RegistPage
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetailView.vue')
  },
  // 管理员新闻管理路由（需权限）
  {
    path: '/admin/news',
    name: 'NewsManage',
    component: NewsManageView,
    meta: { requiresAuth: true, role: 'admin' } // 标记需登录+管理员角色
  },
  {
    path: '/admin/users', // 管理员用户管理路径
    name: 'UserManage',
    component: () => import('@/views/admin/UserManageView.vue'), // 组件路径
    meta: { requiresAuth: true, role: 'admin' } // 仅管理员可访问
  },

  {
    path: '/DevelopedPage',
    name: 'DevelopedPage',
    component: DevelopedPage
  },
  {
    path: '/GuestManage',
    name: 'GuestManage',
    component: GuestManage
  },
  // 管理员路由
  {
    path: '/admin/news',
    name: 'NewsManage',
    component: NewsManageView,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'UserManage',
    component: UserManageView,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/modi/:id',
    name: 'ModiNews',
    component: () => import('@/views/admin/modiNews.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/modi/:id',
    name: 'ModiActivity',
    component: () => import('@/views/admin/modiActivity.vue'),
    meta: { requiresAuth: true }
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