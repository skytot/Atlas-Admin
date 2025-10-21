/**
 * 新 Store 模块使用示例
 * 展示如何使用重构后的 Store
 * 
 * 注意：
 * - 组合式函数自动管理生命周期
 * - Store 直接使用需要手动管理生命周期
 * - 自动测试环境需要手动触发同步
 */

import { computed, onUnmounted } from 'vue'
import { useUserStore } from './user.store'
import { useAuth, useAuthState } from './useAuth'
import type { LoginCredentials } from '@/core/auth/types'

// ===== 方案一：使用 Store =====

/**
 * 在 Vue 组件中使用 Store
 * 注意：需要手动管理生命周期
 */
export function useStoreExample() {
  const userStore = useUserStore()
  
  // 启动认证同步
  const unsubscribe = userStore.startAuthSync()
  
  // 组件卸载时清理
  onUnmounted(() => {
    unsubscribe()
  })
  
  return {
    // 响应式状态
    user: computed(() => userStore.user),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    displayName: computed(() => userStore.displayName),
    permissions: computed(() => userStore.permissions),
    
    // 权限检查
    hasPermission: userStore.hasPermission,
    hasRole: userStore.hasRole,
    
    // 工具方法
    refresh: userStore.refresh
  }
}

// ===== 方案二：使用组合式函数 =====

/**
 * 在 Vue 组件中使用认证组合式函数
 * 注意：自动管理生命周期，推荐使用
 */
export function useAuthExample() {
  const {
    state,
    displayName,
    permissions,
    hasPermission,
    login,
    logout
  } = useAuth()
  
  return {
    // 响应式状态
    user: computed(() => state.value.user),
    isAuthenticated: computed(() => state.value.isAuthenticated),
    displayName,
    permissions,
    
    // 方法
    hasPermission,
    login,
    logout
  }
}

/**
 * 只读认证状态示例
 */
export function useReadOnlyAuthExample() {
  const { state, displayName, hasPermission } = useAuthState()
  
  return {
    user: computed(() => state.value.user),
    displayName,
    hasPermission
  }
}

// ===== 实际组件使用示例 =====

/**
 * 登录组件示例
 */
export function LoginComponentExample() {
  const { login, state } = useAuth()
  
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials)
      // 登录成功，自动跳转
    } catch (error) {
      console.error('登录失败:', error)
    }
  }
  
  return {
    handleLogin,
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error)
  }
}

/**
 * 用户信息组件示例
 */
export function UserInfoComponentExample() {
  const userStore = useUserStore()
  
  return {
    user: computed(() => userStore.user),
    displayName: computed(() => userStore.displayName),
    permissions: computed(() => userStore.permissions),
    hasPermission: userStore.hasPermission
  }
}

/**
 * 权限控制组件示例
 */
export function PermissionComponentExample() {
  const { hasPermission } = useAuthState()
  
  return {
    canEdit: computed(() => hasPermission('edit')),
    canDelete: computed(() => hasPermission('delete')),
    canAdmin: computed(() => hasPermission('admin'))
  }
}

/**
 * 导航栏组件示例
 */
export function NavbarComponentExample() {
  const userStore = useUserStore()
  
  const handleLogout = () => {
    // 直接调用 auth 模块
    const { auth } = require('@/core/auth')
    auth.logout()
  }
  
  return {
    user: computed(() => userStore.user),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    displayName: computed(() => userStore.displayName),
    handleLogout
  }
}

// ===== 测试环境示例 =====

/**
 * 测试环境使用示例
 * 注意：测试中需要手动触发同步
 */
export function testEnvironmentExample() {
  const userStore = useUserStore()
  
  // 设置认证状态
  const { auth } = require('@/core/auth')
  auth.setToken('test-token')
  auth.setUser({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    permissions: ['read', 'write']
  })
  
  // 手动触发同步
  userStore.syncFromAuth()
  
  // 验证状态
  console.log('User:', userStore.user)
  console.log('Is Authenticated:', userStore.isAuthenticated)
  console.log('Has Permission:', userStore.hasPermission('read'))
}
