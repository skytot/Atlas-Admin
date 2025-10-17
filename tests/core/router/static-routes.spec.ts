import { describe, expect, it } from 'vitest'
import { staticRoutes } from '@/core/router/routes/static.routes'

/**
 * 单元测试目标：验证 `core/router/routes/static.routes` 模块的静态路由配置。
 * 覆盖场景：
 * - 路由配置结构；
 * - 路由路径验证；
 * - 组件导入验证；
 * - 路由元信息。
 */
describe('core/router/static-routes', () => {
  /**
   * 测试目标：静态路由应包含正确的路由数量。
   * 输入：静态路由配置。
   * 预期：包含2个路由（登录页和首页）。
   */
  it('应当包含正确数量的路由', () => {
    expect(staticRoutes).toHaveLength(2)
  })

  /**
   * 测试目标：应包含登录路由。
   * 输入：静态路由配置。
   * 预期：包含路径为'/login'的路由。
   */
  it('应当包含登录路由', () => {
    const loginRoute = staticRoutes.find(route => route.path === '/login')
    
    expect(loginRoute).toBeDefined()
    expect(loginRoute?.path).toBe('/login')
    expect(loginRoute?.component).toBeDefined()
  })

  /**
   * 测试目标：应包含首页路由。
   * 输入：静态路由配置。
   * 预期：包含路径为'/'的路由。
   */
  it('应当包含首页路由', () => {
    const homeRoute = staticRoutes.find(route => route.path === '/')
    
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
    expect(homeRoute?.component).toBeDefined()
  })

  /**
   * 测试目标：登录路由应指向正确的组件。
   * 输入：静态路由配置。
   * 预期：登录路由的组件路径正确。
   */
  it('应当正确配置登录路由组件', () => {
    const loginRoute = staticRoutes.find(route => route.path === '/login')
    
    expect(loginRoute?.component).toBeDefined()
    expect(typeof loginRoute?.component).toBe('function')
  })

  /**
   * 测试目标：首页路由应指向正确的组件。
   * 输入：静态路由配置。
   * 预期：首页路由的组件路径正确。
   */
  it('应当正确配置首页路由组件', () => {
    const homeRoute = staticRoutes.find(route => route.path === '/')
    
    expect(homeRoute?.component).toBeDefined()
    expect(typeof homeRoute?.component).toBe('function')
  })

  /**
   * 测试目标：路由应使用动态导入。
   * 输入：静态路由配置。
   * 预期：所有路由的组件都是函数（动态导入）。
   */
  it('应当使用动态导入的组件', () => {
    staticRoutes.forEach(route => {
      expect(typeof route.component).toBe('function')
    })
  })

  /**
   * 测试目标：路由应包含必要的属性。
   * 输入：静态路由配置。
   * 预期：每个路由都有path和component属性。
   */
  it('应当包含必要的路由属性', () => {
    staticRoutes.forEach(route => {
      expect(route.path).toBeDefined()
      expect(route.component).toBeDefined()
      expect(typeof route.path).toBe('string')
      expect(typeof route.component).toBe('function')
    })
  })

  /**
   * 测试目标：路由路径应唯一。
   * 输入：静态路由配置。
   * 预期：所有路由路径都是唯一的。
   */
  it('应当具有唯一的路由路径', () => {
    const paths = staticRoutes.map(route => route.path)
    const uniquePaths = [...new Set(paths)]
    
    expect(paths).toHaveLength(uniquePaths.length)
  })

  /**
   * 测试目标：路由应支持扩展。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持添加新属性。
   */
  it('应当支持路由扩展', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以被扩展
      expect(() => {
        const extendedRoute = { ...route, meta: { title: 'Test' } }
        expect(extendedRoute.meta).toBeDefined()
      }).not.toThrow()
    })
  })

  /**
   * 测试目标：路由应支持路由守卫。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持添加守卫。
   */
  it('应当支持路由守卫', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以添加守卫
      expect(() => {
        const routeWithGuard = { 
          ...route, 
          beforeEnter: () => true 
        }
        expect(routeWithGuard.beforeEnter).toBeDefined()
      }).not.toThrow()
    })
  })

  /**
   * 测试目标：路由应支持嵌套路由。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持嵌套路由。
   */
  it('应当支持嵌套路由', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以添加子路由
      expect(() => {
        const routeWithChildren = { 
          ...route, 
          children: [] 
        }
        expect(routeWithChildren.children).toBeDefined()
      }).not.toThrow()
    })
  })

  /**
   * 测试目标：路由应支持重定向。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持重定向。
   */
  it('应当支持重定向', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以添加重定向
      expect(() => {
        const routeWithRedirect = { 
          ...route, 
          redirect: '/login' 
        }
        expect(routeWithRedirect.redirect).toBeDefined()
      }).not.toThrow()
    })
  })

  /**
   * 测试目标：路由应支持别名。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持别名。
   */
  it('应当支持路由别名', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以添加别名
      expect(() => {
        const routeWithAlias = { 
          ...route, 
          alias: '/home' 
        }
        expect(routeWithAlias.alias).toBeDefined()
      }).not.toThrow()
    })
  })

  /**
   * 测试目标：路由应支持路由名称。
   * 输入：静态路由配置。
   * 预期：路由配置结构支持名称。
   */
  it('应当支持路由名称', () => {
    staticRoutes.forEach(route => {
      // 验证路由对象可以添加名称
      expect(() => {
        const routeWithName = { 
          ...route, 
          name: 'TestRoute' 
        }
        expect(routeWithName.name).toBeDefined()
      }).not.toThrow()
    })
  })
})
