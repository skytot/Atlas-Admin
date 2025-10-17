/**
 * 认证管理使用示例
 * 展示如何使用统一的 auth 对象进行认证管理
 */

import { auth } from './index'
import type { LoginCredentials, UserInfo } from './types'

// ===== 基础认证操作示例 =====

// 1. 基础认证状态检查
export function basicAuthExample() {
  // 检查是否已认证
  if (auth.isAuthenticated()) {
    console.log('用户已登录')
  } else {
    console.log('用户未登录')
  }

  // 获取完整认证状态
  const authState = auth.getState()
  console.log('认证状态:', authState)

  // 获取用户信息
  const user = auth.getUser()
  if (user) {
    console.log('用户信息:', user)
  }
}

// ===== 令牌管理示例 =====

// 2. 令牌管理
export function tokenManagementExample() {
  // 设置令牌
  auth.setToken('jwt-token-123')
  
  // 获取令牌
  const token = auth.getToken()
  console.log('当前令牌:', token)

  // 检查令牌是否存在
  if (auth.hasToken()) {
    console.log('令牌存在')
  }

  // 检查令牌是否过期
  if (auth.isTokenExpired()) {
    console.log('令牌已过期')
  }

  // 设置带过期时间的令牌（30分钟后过期）
  auth.setTokenWithExpiry('jwt-token-123', 30)
  
  // 获取带过期检查的令牌
  const validToken = auth.getTokenWithExpiry()
  if (validToken) {
    console.log('令牌有效:', validToken)
  } else {
    console.log('令牌已过期或不存在')
  }
}

// ===== 用户信息管理示例 =====

// 3. 用户信息管理
export function userManagementExample() {
  // 设置用户信息
  const userInfo: UserInfo = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    permissions: ['read', 'write', 'admin'],
    roles: ['user', 'admin']
  }
  
  auth.setUser(userInfo)
  console.log('用户信息已设置')

  // 获取用户信息
  const user = auth.getUser()
  console.log('当前用户:', user)

  // 检查权限
  if (auth.hasPermission('admin')) {
    console.log('用户有管理员权限')
  }

  if (auth.hasRole('admin')) {
    console.log('用户是管理员')
  }

  // 更新权限
  auth.updatePermissions(['read', 'write'])
  console.log('权限已更新')
}

// ===== 认证操作示例 =====

// 4. 登录流程
export async function loginExample() {
  const credentials: LoginCredentials = {
    username: 'john',
    password: 'password123',
    remember: true
  }

  try {
    // 执行登录
    const response = await auth.login(credentials)
    console.log('登录成功:', response)
    
    // 登录成功后的处理
    console.log('用户信息:', response.user)
    console.log('令牌:', response.token)
    
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 5. 登出流程
export function logoutExample() {
  // 执行登出
  auth.logout()
  console.log('用户已登出')
  
  // 验证登出状态
  if (!auth.isAuthenticated()) {
    console.log('确认用户已登出')
  }
}

// 6. 令牌刷新
export async function tokenRefreshExample() {
  try {
    // 刷新令牌
    const newToken = await auth.refreshToken()
    console.log('令牌刷新成功:', newToken)
    
  } catch (error) {
    console.error('令牌刷新失败:', error)
    // 刷新失败，可能需要重新登录
    auth.logout()
  }
}

// 7. 认证状态检查
export async function authCheckExample() {
  // 检查认证状态并自动刷新
  const isValid = await auth.checkAuth()
  
  if (isValid) {
    console.log('认证状态有效')
  } else {
    console.log('认证状态无效，需要重新登录')
  }
}

// ===== 事件监听示例 =====

// 8. 认证事件监听
export function authEventExample() {
  // 监听认证事件
  const unsubscribe = auth.onAuthEvent((eventType, data) => {
    console.log('认证事件:', eventType, data)
    
    switch (eventType) {
      case 'login-success':
        console.log('登录成功事件:', data.user)
        break
        
      case 'logout':
        console.log('登出事件')
        break
        
      case 'token-changed':
        console.log('令牌变化事件:', data.token)
        break
        
      case 'token-refreshed':
        console.log('令牌刷新事件:', data.token)
        break
        
      case 'token-refresh-error':
        console.log('令牌刷新失败事件:', data.error)
        break
        
      case 'user-changed':
        console.log('用户信息变化事件:', data.user)
        break
    }
  })

  // 模拟一些认证操作
  auth.setToken('test-token')
  auth.setUser({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    permissions: ['read']
  })

  // 取消监听
  unsubscribe()
}

// ===== 实际应用场景示例 =====

// 9. 路由守卫示例
export function routeGuardExample() {
  // 模拟路由守卫逻辑
  const checkRouteAccess = (route: any) => {
    // 检查是否需要认证
    if (route.meta?.requiresAuth) {
      if (!auth.isAuthenticated()) {
        console.log('需要登录才能访问此路由')
        return false
      }

      // 检查权限
      if (route.meta?.permission && !auth.hasPermission(route.meta.permission)) {
        console.log('权限不足，无法访问此路由')
        return false
      }

      // 检查角色
      if (route.meta?.role && !auth.hasRole(route.meta.role)) {
        console.log('角色不匹配，无法访问此路由')
        return false
      }
    }

    return true
  }

  // 测试不同路由
  const adminRoute = { meta: { requiresAuth: true, permission: 'admin' } }
  const userRoute = { meta: { requiresAuth: true, role: 'user' } }
  const publicRoute = {}

  console.log('管理员路由访问:', checkRouteAccess(adminRoute))
  console.log('用户路由访问:', checkRouteAccess(userRoute))
  console.log('公开路由访问:', checkRouteAccess(publicRoute))
}

// 10. 组件权限控制示例
export function componentPermissionExample() {
  // 模拟组件权限控制
  const hasComponentPermission = (component: string) => {
    switch (component) {
      case 'admin-panel':
        return auth.hasPermission('admin')
      case 'user-settings':
        return auth.hasPermission('user-settings')
      case 'reports':
        return auth.hasPermission('reports') || auth.hasRole('admin')
      default:
        return true
    }
  }

  // 测试组件权限
  console.log('管理员面板权限:', hasComponentPermission('admin-panel'))
  console.log('用户设置权限:', hasComponentPermission('user-settings'))
  console.log('报告权限:', hasComponentPermission('reports'))
}

// 11. 自动令牌刷新示例
export function autoTokenRefreshExample() {
  // 设置自动令牌刷新
  const setupAutoRefresh = () => {
    setInterval(async () => {
      if (auth.isAuthenticated()) {
        try {
          // 检查令牌是否即将过期（提前5分钟刷新）
          const token = auth.getToken()
          if (token && auth.isTokenExpired(token)) {
            console.log('令牌即将过期，自动刷新...')
            await auth.refreshToken()
            console.log('令牌自动刷新成功')
          }
        } catch (error) {
          console.error('自动刷新令牌失败:', error)
          // 刷新失败，清除认证状态
          auth.logout()
        }
      }
    }, 5 * 60 * 1000) // 每5分钟检查一次
  }

  setupAutoRefresh()
  console.log('自动令牌刷新已设置')
}

// 12. 完整的认证流程示例
export async function completeAuthFlowExample() {
  console.log('=== 完整认证流程示例 ===')

  // 1. 初始状态检查
  console.log('1. 初始认证状态:', auth.isAuthenticated())

  // 2. 用户登录
  console.log('2. 执行登录...')
  try {
    const loginResponse = await auth.login({
      username: 'john',
      password: 'password123',
      remember: true
    })
    console.log('登录成功:', loginResponse.user.name)
  } catch (error) {
    console.error('登录失败:', error)
    return
  }

  // 3. 检查认证状态
  console.log('3. 登录后认证状态:', auth.isAuthenticated())
  console.log('用户信息:', auth.getUser())
  console.log('令牌:', auth.getToken())

  // 4. 权限检查
  console.log('4. 权限检查:')
  console.log('- 是否有管理员权限:', auth.hasPermission('admin'))
  console.log('- 是否有用户权限:', auth.hasPermission('user'))

  // 5. 模拟令牌即将过期
  console.log('5. 模拟令牌过期...')
  auth.setTokenWithExpiry('expired-token', 0.1) // 6秒后过期
  
  // 6. 检查令牌状态
  setTimeout(async () => {
    console.log('6. 检查令牌状态...')
    const validToken = auth.getTokenWithExpiry()
    if (validToken) {
      console.log('令牌仍然有效:', validToken)
    } else {
      console.log('令牌已过期')
    }
  }, 7000)

  // 7. 用户登出
  setTimeout(() => {
    console.log('7. 执行登出...')
    auth.logout()
    console.log('登出后认证状态:', auth.isAuthenticated())
  }, 10000)
}
