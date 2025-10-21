/**
 * 用户 Store 模块导出
 * 提供清晰的 API 接口
 */

// 导出类型
export type { UserState, UserStoreOptions, UserSummary } from './types'

// 导出 Store
export { useUserStore, createUserStore } from './user.store'

// 导出组合式函数
export { useAuth, useAuthState } from './useAuth'

// 导出类型
export type { AuthState } from './useAuth'