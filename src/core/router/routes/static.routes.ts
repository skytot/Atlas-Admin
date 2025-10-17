/**
 * 核心静态路由配置，供应用基础页面使用。
 */
export const staticRoutes = [
  { path: '/login', component: () => import('@/features/user/views/UserLogin.vue') },
  { path: '/', component: () => import('@/features/dashboard/views/Dashboard.vue') }
]
