/**
 * 认证服务类 - 业务逻辑层
 * 负责处理认证相关的业务逻辑，通过AuthBridge与状态层交互
 */

import { storage } from '@/core/storage'
import type { AuthBridge } from '@/core/store/modules/user/integrations'
import type { LoginCredentials, AuthResponse, UserInfo } from './types'

/**
 * 认证服务配置选项
 */
export interface AuthServiceOptions {
  /** 令牌存储键名 */
  tokenKey?: string
  /** 刷新令牌存储键名 */
  refreshTokenKey?: string
  /** 用户信息存储键名 */
  userKey?: string
}

/**
 * 认证服务类
 * 提供完整的认证业务逻辑，通过AuthBridge与状态层交互
 */
export class AuthService {
  public authBridge: AuthBridge
  private options: Required<AuthServiceOptions>

  constructor(authBridge: AuthBridge, options: AuthServiceOptions = {}) {
    this.authBridge = authBridge
    this.options = {
      tokenKey: 'AUTH_TOKEN',
      refreshTokenKey: 'AUTH_REFRESH_TOKEN',
      userKey: 'AUTH_USER',
      ...options
    }
  }

  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 认证响应
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.callLoginAPI(credentials)
      
      // 通过AuthBridge更新状态，而不是直接操作storage
      this.authBridge.syncToken(response.token)
      this.authBridge.syncUser({
        name: response.user.name,
        token: response.token,
        permissions: response.user.permissions,
        roles: response.user.roles,
        lastLoginTime: Date.now()
      })
      
      // 保存刷新令牌
      if (response.refreshToken) {
        storage.set(this.options.refreshTokenKey, response.refreshToken, {
          type: 'localStorage',
          serialize: false
        })
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * 用户登出
   */
  logout(): void {
    this.authBridge.clearUser()
    this.authBridge.clearToken()
    storage.remove(this.options.refreshTokenKey)
  }

  /**
   * 检查用户是否已认证
   * @returns 是否已认证
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    return Boolean(token && !this.isTokenExpired(token))
  }

  /**
   * 获取当前令牌
   * @returns 令牌字符串或null
   */
  getToken(): string | null {
    return storage.get<string>(this.options.tokenKey, {
      type: 'localStorage',
      serialize: false,
      defaultValue: null
    })
  }

  /**
   * 检查令牌是否过期
   * @param token 令牌字符串
   * @returns 是否过期
   */
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken()
    if (!tokenToCheck) return true

    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  /**
   * 刷新访问令牌
   * @returns 新的访问令牌
   */
  async refreshToken(): Promise<string> {
    const refreshToken = storage.get<string>(this.options.refreshTokenKey, {
      type: 'localStorage',
      serialize: false,
      defaultValue: null
    })

    if (!refreshToken) {
      throw new Error('没有刷新令牌')
    }

    try {
      const response = await this.callRefreshTokenAPI(refreshToken)
      this.authBridge.syncToken(response.token)
      
      if (response.refreshToken) {
        storage.set(this.options.refreshTokenKey, response.refreshToken, {
          type: 'localStorage',
          serialize: false
        })
      }
      
      return response.token
    } catch (error) {
      this.logout()
      throw error
    }
  }

  /**
   * 检查认证状态，必要时自动刷新令牌
   * @returns 认证状态是否有效
   */
  async checkAuth(): Promise<boolean> {
    const token = this.getToken()
    if (!token) return false

    if (this.isTokenExpired(token)) {
      try {
        await this.refreshToken()
        return true
      } catch {
        this.logout()
        return false
      }
    }

    return true
  }

  /**
   * 检查用户权限
   * @param permission 权限标识
   * @returns 是否拥有权限
   */
  hasPermission(permission: string): boolean {
    const { useUserStore } = require('@/core/store/modules/user')
    const userStore = useUserStore()
    return userStore.hasPermission(permission)
  }

  /**
   * 检查用户角色
   * @param role 角色标识
   * @returns 是否拥有角色
   */
  hasRole(role: string): boolean {
    const { useUserStore } = require('@/core/store/modules/user')
    const userStore = useUserStore()
    return userStore.hasRole(role)
  }

  /**
   * 获取当前用户信息
   * @returns 用户信息或null
   */
  getUser(): UserInfo | null {
    const { useUserStore } = require('@/core/store/modules/user')
    const userStore = useUserStore()
    return userStore.userInfo
  }

  /**
   * 更新用户权限
   * @param permissions 权限列表
   */
  updatePermissions(permissions: string[]): void {
    this.authBridge.syncPermissions(permissions)
  }

  /**
   * 更新用户名称
   * @param name 用户名称
   */
  updateName(name: string): void {
    this.authBridge.syncName(name)
  }

  // ===== 私有方法 =====

  /**
   * 调用登录API
   * @param credentials 登录凭证
   * @returns 认证响应
   */
  private async callLoginAPI(credentials: LoginCredentials): Promise<AuthResponse> {
    // 这里应该实现实际的登录API调用
    // 示例实现
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            name: credentials.username,
            email: `${credentials.username}@example.com`,
            permissions: ['read', 'write'],
            roles: ['user']
          },
          expiresIn: 3600
        })
      }, 1000)
    })
  }

  /**
   * 调用刷新令牌API
   * @param refreshToken 刷新令牌
   * @returns 新的令牌信息
   */
  private async callRefreshTokenAPI(_refreshToken: string): Promise<{ token: string; refreshToken?: string }> {
    // 这里应该实现实际的刷新令牌API调用
    // 示例实现
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token'
        })
      }, 500)
    })
  }
}
