import type { Router } from 'vue-router'

/**
 * 显式注册基于 token 的认证守卫。
 * - 未取到 token 时阻止进入受保护路由（meta.requiresAuth === true）
 * - 对于无需鉴权路由直接放行
 */
export function useAuthGuard(router: Router, getToken: () => string | null | undefined): void {
  router.beforeEach((to) => {
    if (to.meta && (to.meta as any).requiresAuth) {
      const token = getToken()
      if (!token) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
    }
    return true
  })
}


