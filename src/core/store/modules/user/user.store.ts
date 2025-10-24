/**
 * 全新的用户 Store
 * 职责：纯响应式状态管理，不进行任何数据修改
 */

import { defineStore } from 'pinia'
import { auth } from '@/core/auth'
import type { UserState, UserStoreOptions, UserSummary } from './types'

/**
 * 用户 Store
 * 职责：
 * 1. 提供响应式状态给 Vue 组件
 * 2. 自动同步 Auth 模块的状态变化
 * 3. 不进行任何数据修改操作
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * 获取用户显示名称
     */
    displayName: (state): string => {
      return state.user?.name || '未知用户'
    },

    /**
     * 获取用户权限列表
     */
    permissions: (state): string[] => {
      return state.user?.permissions || []
    },

    /**
     * 获取用户角色列表
     */
    roles: (state): string[] => {
      return state.user?.roles || []
    },

    /**
     * 检查是否有指定权限
     */
    hasPermission: (state) => (permission: string): boolean => {
      return state.user?.permissions?.includes(permission) || false
    },

    /**
     * 检查是否有指定角色
     */
    hasRole: (state) => (role: string): boolean => {
      return state.user?.roles?.includes(role) || false
    },

    /**
     * 获取用户信息摘要
     */
    userSummary: (state): UserSummary | null => {
      if (!state.user) return null
      
      return {
        name: state.user.name,
        email: state.user.email,
        permissions: state.user.permissions,
        roles: state.user.roles || [],
        lastLoginTime: state.user.lastLoginTime
      }
    },

    /**
     * 检查是否已登录
     */
    isLoggedIn: (state): boolean => {
      return state.isAuthenticated && !!state.user
    }
  },

  actions: {
    /**
     * 从 Auth 模块同步状态
     * 这是唯一的数据来源
     */
    syncFromAuth(): void {
      this.user = auth.getUser()
      this.isAuthenticated = auth.isAuthenticated()
      this.error = null
    },

    /**
     * 设置加载状态
     */
    setLoading(loading: boolean): void {
      this.isLoading = loading
    },

    /**
     * 设置错误信息
     */
    setError(error: string | null): void {
      this.error = error
    },

    /**
     * 清除错误信息
     */
    clearError(): void {
      this.error = null
    },

    /**
     * 启动认证状态同步
     * 返回取消同步的函数
     */
    startAuthSync(): () => void {
      // 初始同步
      this.syncFromAuth()
      
      // 监听认证事件
      const unsubscribe = auth.onAuthEvent((event, data) => {
        switch (event) {
          case 'login-success':
          case 'user-changed':
          case 'token-changed':
          case 'token-refreshed':
            this.syncFromAuth()
            break
            
          case 'logout':
          case 'user-cleared':
            this.user = null
            this.isAuthenticated = false
            this.error = null
            break
            
          case 'login-error':
          case 'token-refresh-error':
            this.setError(data?.error?.message || '认证错误')
            break
        }
      })

      return unsubscribe
    },

    /**
     * 强制刷新状态
     */
    async refresh(): Promise<void> {
      this.setLoading(true)
      this.clearError()
      
      try {
        // 检查认证状态
        const isValid = await auth.checkAuth()
        if (!isValid) {
          this.user = null
          this.isAuthenticated = false
        } else {
          this.syncFromAuth()
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '刷新失败')
      } finally {
        this.setLoading(false)
      }
    }
  }
})

/**
 * 创建用户 Store 实例
 * 支持自定义配置
 */
export function createUserStore(options: UserStoreOptions = {}) {
  const { autoSync = true, syncInterval = 30000 } = options
  
  const store = useUserStore()
  
  // 资源管理
  let intervalId: NodeJS.Timeout | null = null
  let unsubscribe: (() => void) | null = null
  
  if (autoSync) {
    try {
      // 启动自动同步
      unsubscribe = store.startAuthSync()
      
      // 设置定时同步
      intervalId = setInterval(() => {
        try {
          store.syncFromAuth()
        } catch (error) {
          throw new Error(`定时同步失败: ${error instanceof Error ? error.message : '未知错误'}`)
        }
      }, syncInterval)
    } catch (error) {
      throw new Error(`启动用户Store同步失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  // 返回清理函数
  return {
    store,
    cleanup: () => {
      try {
        if (unsubscribe) {
          unsubscribe()
          unsubscribe = null
        }
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      } catch (error) {
        throw new Error(`清理用户Store资源失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
  }
}
