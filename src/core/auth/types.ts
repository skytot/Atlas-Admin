/**
 * 认证模块类型定义
 */

// 认证状态接口
export interface AuthState {
  token: string
  refreshToken?: string
  user: UserInfo | null
  lastLoginTime?: number
}

// 用户信息接口
export interface UserInfo {
  id: string | number
  name: string
  email: string
  avatar?: string
  permissions: string[]
  roles?: string[]
  lastLoginTime?: number
}

// 登录凭据接口
export interface LoginCredentials {
  username: string
  password: string
  remember?: boolean
}

// 认证响应接口
export interface AuthResponse {
  token: string
  refreshToken?: string
  user: UserInfo
  expiresIn?: number
}

// 认证事件类型
export type AuthEventType = 
  | 'login-success'
  | 'login-error'
  | 'logout'
  | 'token-changed'
  | 'token-cleared'
  | 'token-refreshed'
  | 'token-refresh-error'
  | 'user-changed'
  | 'user-cleared'

// 认证事件数据接口
export interface AuthEventData {
  type: AuthEventType
  data?: any
}

// 认证事件回调接口
export type AuthEventCallback = (eventType: AuthEventType, data?: any) => void
