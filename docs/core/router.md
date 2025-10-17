# 路由管理

路由管理模块基于Vue Router 4，提供应用的路由配置、导航守卫和动态路由管理功能。

## 模块概述

路由管理模块位于 `src/core/router/` 目录下，主要提供：
- 静态路由配置
- 路由守卫和权限控制
- 动态路由加载
- 路由元信息管理

## 核心功能

### 模块结构更新

- 路由实例 `router` 在 `src/core/router/index.ts` 中创建并导出。
- 静态路由表 `staticRoutes` 已迁移至 `src/core/router/routes/static.routes.ts`，便于拆分与维护。
- 可通过 `import { router } from '@/core/router'` 与 `import { staticRoutes } from '@/core/router/routes/static.routes'` 获取。

### 路由实例

#### `router`
Vue Router实例，配置了历史模式和基础路由。

```typescript
import { router } from '@/core/router'

// 编程式导航
router.push('/dashboard')
router.replace('/login')
router.go(-1)
```

**配置说明：**
- **history模式**: 使用HTML5 History API
- **基础路由**: 包含登录页和仪表板路由
- **懒加载**: 路由组件使用动态导入

## 使用示例

### 基础路由配置

```typescript
// 静态路由配置
export const staticRoutes = [
  { 
    path: '/login', 
    component: () => import('@/features/user/views/UserLogin.vue'),
    meta: { 
      title: '登录',
      requiresAuth: false 
    }
  },
  { 
    path: '/', 
    component: () => import('@/features/dashboard/views/Dashboard.vue'),
    meta: { 
      title: '仪表板',
      requiresAuth: true 
    }
  }
]
```

### 路由守卫

```typescript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  const requiresAuth = to.meta.requiresAuth
  
  // 检查是否需要认证
  if (requiresAuth && !token) {
    next('/login')
    return
  }
  
  // 已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Atlas Admin`
  }
  
  // 记录页面访问
  logger.info('页面访问', {
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  })
})
```

### 动态路由

```typescript
// 动态路由配置
export const dynamicRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'users',
        component: () => import('@/features/admin/views/UserManagement.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'settings',
        component: () => import('@/features/admin/views/Settings.vue'),
        meta: { title: '系统设置' }
      }
    ]
  }
]

// 动态添加路由
export function addDynamicRoutes() {
  dynamicRoutes.forEach(route => {
    router.addRoute(route)
  })
}
```

## 扩展功能

### 权限路由

```typescript
// 权限路由配置
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
}

// 权限检查路由守卫
router.beforeEach((to, from, next) => {
  const user = useUserStore()
  const meta = to.meta as RouteMeta
  
  // 检查角色权限
  if (meta.roles && meta.roles.length > 0) {
    const hasRole = meta.roles.some(role => user.roles.includes(role))
    if (!hasRole) {
      next('/403')
      return
    }
  }
  
  // 检查具体权限
  if (meta.permissions && meta.permissions.length > 0) {
    const hasPermission = meta.permissions.some(permission => 
      user.permissions.includes(permission)
    )
    if (!hasPermission) {
      next('/403')
      return
    }
  }
  
  next()
})
```

### 路由缓存

```typescript
// 路由缓存管理
export class RouteCache {
  private cache = new Map<string, any>()
  
  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  get(key: string, ttl = 5 * 60 * 1000) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    return null
  }
  
  clear() {
    this.cache.clear()
  }
}

export const routeCache = new RouteCache()

// 在路由守卫中使用缓存
router.beforeEach((to, from, next) => {
  const cacheKey = `route-${to.path}`
  const cachedData = routeCache.get(cacheKey)
  
  if (cachedData) {
    // 使用缓存数据
    to.meta.cachedData = cachedData
  }
  
  next()
})
```

### 面包屑导航

```typescript
// 面包屑配置
export interface BreadcrumbItem {
  title: string
  path?: string
  icon?: string
}

export function generateBreadcrumbs(route: any): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  
  // 添加首页
  breadcrumbs.push({
    title: '首页',
    path: '/',
    icon: 'home'
  })
  
  // 根据路由生成面包屑
  if (route.path !== '/') {
    const pathSegments = route.path.split('/').filter(Boolean)
    let currentPath = ''
    
    pathSegments.forEach((segment: string, index: number) => {
      currentPath += `/${segment}`
      
      // 从路由配置中获取标题
      const routeConfig = router.resolve(currentPath)
      const title = routeConfig.meta?.title || segment
      
      breadcrumbs.push({
        title,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      })
    })
  }
  
  return breadcrumbs
}
```

## 路由配置

### 路由元信息

```typescript
// 扩展路由元信息
export interface ExtendedRouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
  keepAlive?: boolean
  icon?: string
  hidden?: boolean
  affix?: boolean
}

// 路由配置示例
export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      title: '管理后台',
      requiresAuth: true,
      roles: ['admin'],
      icon: 'admin'
    } as ExtendedRouteMeta,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/features/admin/views/Dashboard.vue'),
        meta: {
          title: '仪表板',
          keepAlive: true,
          affix: true
        } as ExtendedRouteMeta
      }
    ]
  }
]
```

### 路由懒加载

```typescript
// 路由组件懒加载
export const lazyLoad = (view: string) => {
  return () => import(`@/views/${view}.vue`)
}

// 使用示例
export const routes = [
  {
    path: '/users',
    component: lazyLoad('UserList'),
    meta: { title: '用户列表' }
  }
]
```

## 最佳实践

### 1. 路由模块化

```typescript
// 按功能模块组织路由
export const userRoutes = [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('@/features/user/views/Profile.vue'),
        meta: { title: '个人资料' }
      }
    ]
  }
]

export const adminRoutes = [
  // 管理员路由
]

// 合并所有路由
export const allRoutes = [
  ...staticRoutes,
  ...userRoutes,
  ...adminRoutes
]
```

### 2. 路由守卫优化

```typescript
// 优化路由守卫性能
const routeGuards = {
  auth: (to: any, from: any, next: any) => {
    const token = getToken()
    if (to.meta.requiresAuth && !token) {
      next('/login')
    } else {
      next()
    }
  },
  
  permission: (to: any, from: any, next: any) => {
    const user = useUserStore()
    const meta = to.meta as ExtendedRouteMeta
    
    if (meta.roles && !meta.roles.some(role => user.roles.includes(role))) {
      next('/403')
    } else {
      next()
    }
  }
}

// 按需应用守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    routeGuards.auth(to, from, next)
  } else {
    next()
  }
})
```

### 3. 路由错误处理

```typescript
// 路由错误处理
router.onError((error) => {
  logger.error('路由错误', {
    error: error.message,
    stack: error.stack,
    url: window.location.href
  })
  
  // 跳转到错误页面
  router.push('/error')
})

// 404页面处理
router.addRoute({
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/NotFound.vue'),
  meta: { title: '页面未找到' }
})
```

## 常见问题

### Q: 如何处理路由权限？
A: 在路由元信息中定义权限要求，在路由守卫中检查用户权限。

### Q: 如何实现路由缓存？
A: 使用Vue的keep-alive组件，结合路由元信息控制缓存。

### Q: 如何处理动态路由？
A: 根据用户权限动态添加路由，使用router.addRoute方法。

### Q: 如何优化路由加载性能？
A: 使用路由懒加载，将组件按需加载，减少初始包大小。

## 相关模块

- [认证模块](./auth.md) - 路由权限控制
- [状态管理](./store.md) - 用户状态和权限
- [错误处理](./error.md) - 路由错误处理
