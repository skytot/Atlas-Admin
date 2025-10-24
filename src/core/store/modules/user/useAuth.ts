/**
 * 认证组合式函数
 * 提供响应式的认证状态和操作
 */

import { ref, computed, readonly, onMounted, onUnmounted } from 'vue'
import { auth } from '@/core/auth'
import type { LoginCredentials, UserInfo } from '@/core/auth/types'

/**
 * 认证状态接口
 */
export interface AuthState {
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * 认证组合式函数
 * 提供响应式的认证状态管理
 */
export function useAuth() {
  // 响应式状态
  const state = ref<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  // 计算属性
  const displayName = computed(() => state.value.user?.name || '未知用户')
  const permissions = computed(() => state.value.user?.permissions || [])
  const roles = computed(() => state.value.user?.roles || [])

  // 权限检查函数
  const hasPermission = (permission: string) => 
    state.value.user?.permissions?.includes(permission) || false

  const hasRole = (role: string) => 
    state.value.user?.roles?.includes(role) || false

  // 认证操作
  const login = async (credentials: LoginCredentials) => {
    try {
      state.value.isLoading = true
      state.value.error = null
      
      const response = await auth.login(credentials)
      // 状态会自动通过事件同步更新
      
      return response
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : '登录失败'
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  const logout = () => {
    auth.logout()
    // 状态会自动通过事件同步更新
  }

  const updatePermissions = (permissions: string[]) => {
    auth.updatePermissions(permissions)
    // 状态会自动通过事件同步更新
  }

  // 同步状态函数
  const syncFromAuth = () => {
    state.value.user = auth.getUser()
    state.value.isAuthenticated = auth.isAuthenticated()
  }

  // 事件监听器管理
  const unsubscribe = ref<(() => void) | null>(null)

  const startAuthSync = () => {
    // 清理之前的监听器
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
    
    // 初始同步
    syncFromAuth()
    
    // 监听认证事件
    unsubscribe.value = auth.onAuthEvent((event, data) => {
      switch (event) {
        case 'login-success':
        case 'user-changed':
          syncFromAuth()
          break
        case 'logout':
        case 'user-cleared':
          state.value.user = null
          state.value.isAuthenticated = false
          break
        case 'token-changed':
        case 'token-refreshed':
          syncFromAuth()
          break
        case 'login-error':
        case 'token-refresh-error':
          state.value.error = data?.error?.message || '认证错误'
          break
      }
    })
    
    // 返回取消订阅函数
    return () => {
      if (unsubscribe.value) {
        unsubscribe.value()
        unsubscribe.value = null
      }
    }
  }

  const stopAuthSync = () => {
    if (unsubscribe.value) {
      try {
        unsubscribe.value()
        unsubscribe.value = null
      } catch (error) {
        throw new Error(`停止认证同步失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
  }

  // 生命周期管理 - 添加备用清理机制
  onMounted(() => {
    startAuthSync()
  })

  onBeforeUnmount(() => {
    stopAuthSync()
  })

  onUnmounted(() => {
    stopAuthSync()
  })

  return {
    // 状态
    state: readonly(state),
    
    // 计算属性
    displayName,
    permissions,
    roles,
    
    // 方法
    hasPermission,
    hasRole,
    login,
    logout,
    updatePermissions,
    
    // 工具方法
    syncFromAuth,
    startAuthSync,
    stopAuthSync
  }
}

/**
 * 简化的认证 Hook - 只提供状态，不提供操作
 * 适用于只需要读取认证状态的场景
 */
export function useAuthState() {
  const { state, displayName, permissions, roles, hasPermission, hasRole } = useAuth()
  
  return {
    state,
    displayName,
    permissions,
    roles,
    hasPermission,
    hasRole
  }
}
