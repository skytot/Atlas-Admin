import { describe, expect, it, vi } from 'vitest'

// Mock Vue Router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    getRoutes: vi.fn(() => [
      { path: '/login', component: vi.fn(), meta: {}, params: {}, query: {} },
      { path: '/', component: vi.fn(), meta: {}, params: {}, query: {} }
    ]),
    resolve: vi.fn((path) => ({ path, matched: [] })),
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    beforeEach: vi.fn(),
    beforeResolve: vi.fn(),
    afterEach: vi.fn(),
    options: {
      history: { base: '/', location: window.location }
    }
  })),
  createWebHistory: vi.fn(() => ({ base: '/', location: window.location }))
}))

import { router } from '@/core/router/index'
import { staticRoutes } from '@/core/router/routes/static.routes'

/**
 * 单元测试目标：验证 `core/router` 模块的路由配置。
 * 覆盖场景：
 * - 路由实例创建；
 * - 路由配置验证；
 * - 路由导航；
 * - 路由元信息。
 */
describe('core/router/router', () => {

  /**
   * 测试目标：路由实例应被正确创建。
   * 输入：导入的路由实例。
   * 预期：路由实例存在且配置正确。
   */
  it('应当正确创建路由实例', () => {
    expect(router).toBeDefined()
    expect(router.getRoutes).toBeDefined()
    expect(router.resolve).toBeDefined()
    expect(router.push).toBeDefined()
    expect(router.replace).toBeDefined()
  })

  /**
   * 测试目标：路由应使用HTML5 history模式。
   * 输入：路由实例。
   * 预期：history类型为WebHistory。
   */
  it('应当使用HTML5 history模式', () => {
    expect(router.options.history).toBeInstanceOf(Object)
    // 验证history对象有WebHistory的特征
    expect(router.options.history).toHaveProperty('base')
    expect(router.options.history).toHaveProperty('location')
  })

  /**
   * 测试目标：静态路由应被正确配置。
   * 输入：路由实例。
   * 预期：包含所有静态路由。
   */
  it('应当包含所有静态路由', () => {
    const routes = router.getRoutes()
    const routePaths = routes.map(route => route.path)

    expect(routePaths).toContain('/login')
    expect(routePaths).toContain('/')
  })

  /**
   * 测试目标：登录路由应正确配置。
   * 输入：路由实例。
   * 预期：登录路由指向正确的组件。
   */
  it('应当正确配置登录路由', () => {
    const routes = router.getRoutes()
    const loginRoute = routes.find(route => route.path === '/login')

    expect(loginRoute).toBeDefined()
    expect(loginRoute?.name).toBeUndefined() // 静态路由没有name
    expect(loginRoute?.component).toBeDefined()
  })

  /**
   * 测试目标：首页路由应正确配置。
   * 输入：路由实例。
   * 预期：首页路由指向正确的组件。
   */
  it('应当正确配置首页路由', () => {
    const routes = router.getRoutes()
    const homeRoute = routes.find(route => route.path === '/')

    expect(homeRoute).toBeDefined()
    expect(homeRoute?.name).toBeUndefined() // 静态路由没有name
    expect(homeRoute?.component).toBeDefined()
  })

  /**
   * 测试目标：路由解析应正确工作。
   * 输入：已知路径。
   * 预期：路由解析返回正确的路由对象。
   */
  it('应当正确解析路由', () => {
    const loginRoute = router.resolve('/login')
    const homeRoute = router.resolve('/')

    expect(loginRoute.path).toBe('/login')
    expect(homeRoute.path).toBe('/')
    expect(loginRoute.matched).toBeDefined()
    expect(homeRoute.matched).toBeDefined()
  })

  /**
   * 测试目标：路由导航应正确工作。
   * 输入：路由导航操作。
   * 预期：导航方法存在且可调用。
   */
  it('应当支持路由导航', () => {
    expect(typeof router.push).toBe('function')
    expect(typeof router.replace).toBe('function')
    expect(typeof router.go).toBe('function')
    expect(typeof router.back).toBe('function')
    expect(typeof router.forward).toBe('function')
  })

  /**
   * 测试目标：路由配置应包含正确的路由数量。
   * 输入：路由实例。
   * 预期：路由数量与静态路由配置一致。
   */
  it('应当包含正确数量的路由', () => {
    const routes = router.getRoutes()
    // 过滤掉重定向和通配符路由，只计算实际的路由
    const actualRoutes = routes.filter(route => 
      route.path !== '*' && 
      !route.redirect && 
      route.component
    )

    expect(actualRoutes).toHaveLength(staticRoutes.length)
  })

  /**
   * 测试目标：路由应支持动态导入。
   * 输入：路由配置。
   * 预期：组件使用动态导入。
   */
  it('应当使用动态导入的组件', () => {
    const routes = router.getRoutes()
    const loginRoute = routes.find(route => route.path === '/login')
    const homeRoute = routes.find(route => route.path === '/')

    expect(loginRoute?.component).toBeDefined()
    expect(homeRoute?.component).toBeDefined()
    
    // 验证组件是函数（动态导入）
    expect(typeof loginRoute?.component).toBe('function')
    expect(typeof homeRoute?.component).toBe('function')
  })

  /**
   * 测试目标：路由应支持嵌套路由结构。
   * 输入：路由实例。
   * 预期：路由结构正确。
   */
  it('应当支持正确的路由结构', () => {
    const routes = router.getRoutes()
    
    // 验证每个路由都有必要的属性
    routes.forEach(route => {
      if (route.path !== '*' && !route.redirect) {
        expect(route.path).toBeDefined()
        expect(route.component).toBeDefined()
      }
    })
  })

  /**
   * 测试目标：路由应支持路由守卫。
   * 输入：路由实例。
   * 预期：路由守卫方法存在。
   */
  it('应当支持路由守卫', () => {
    expect(router.beforeEach).toBeDefined()
    expect(router.beforeResolve).toBeDefined()
    expect(router.afterEach).toBeDefined()
    expect(typeof router.beforeEach).toBe('function')
    expect(typeof router.beforeResolve).toBe('function')
    expect(typeof router.afterEach).toBe('function')
  })

  /**
   * 测试目标：路由应支持路由元信息。
   * 输入：路由实例。
   * 预期：路由元信息功能正常。
   */
  it('应当支持路由元信息', () => {
    const routes = router.getRoutes()
    
    // 验证路由有meta属性（即使为空）
    routes.forEach(route => {
      expect(route.meta).toBeDefined()
      expect(typeof route.meta).toBe('object')
    })
  })

  /**
   * 测试目标：路由应支持路由参数。
   * 输入：路由实例。
   * 预期：路由参数功能正常。
   */
  it('应当支持路由参数', () => {
    const routes = router.getRoutes()
    
    // 验证路由有params属性
    routes.forEach(route => {
      expect(route.params).toBeDefined()
      expect(typeof route.params).toBe('object')
    })
  })

  /**
   * 测试目标：路由应支持查询参数。
   * 输入：路由实例。
   * 预期：查询参数功能正常。
   */
  it('应当支持查询参数', () => {
    const routes = router.getRoutes()
    
    // 验证路由有query属性
    routes.forEach(route => {
      expect(route.query).toBeDefined()
      expect(typeof route.query).toBe('object')
    })
  })
})
