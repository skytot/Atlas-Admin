/**
 * 用户 Store 类型定义
 * 简洁、清晰、响应式
 */

import type { UserInfo } from '@/core/auth/types'

/**
 * 用户 Store 状态
 */
export interface UserState {
  // 用户信息
  user: UserInfo | null
  // 认证状态
  isAuthenticated: boolean
  // 加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
}

/**
 * 用户 Store 选项
 */
export interface UserStoreOptions {
  // 是否自动同步认证状态
  autoSync?: boolean
  // 同步间隔（毫秒）
  syncInterval?: number
}

/**
 * 用户信息摘要
 */
export interface UserSummary {
  name: string
  email: string
  permissions: string[]
  roles: string[]
  lastLoginTime?: number
}
