import { describe, it, expect } from 'vitest'
import { useAuthGuard } from '@/core/router/guard'

describe('core/router/guard', () => {
  it('未登录访问受保护路由应跳转登录', async () => {
    const vr = await vi.importActual<typeof import('vue-router')>('vue-router')
    const router = vr.createRouter({
      history: vr.createMemoryHistory(),
      routes: [
        { path: '/login', name: 'login', component: { render: () => null } },
        { path: '/protected', name: 'protected', meta: { requiresAuth: true }, component: { render: () => null } }
      ]
    })
    useAuthGuard(router as any, () => null)
    await router.push('/protected')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('login')
  })
})


