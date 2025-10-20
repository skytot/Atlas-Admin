/**
 * 统一认证管理模块
 * 提供完整的认证功能接口，使用统一的持久化适配器
 * 
 * @fileoverview 认证模块主入口，提供登录、登出、权限检查等功能
 * @author Vue Enterprise Template
 * @version 2.0.0
 */

import { localAuthPersistence } from './persistence'
import type {
  AuthState,
  UserInfo,
  LoginCredentials,
  AuthResponse
} from './types'

// 导出AuthService类，供按需使用
export { AuthService } from './auth-service'
export { localAuthPersistence } from './persistence'
export type { AuthPersistenceAdapter } from './persistence'

/**
 * 认证状态
 * @private
 */
let state: AuthState = {
  token: '',
  user: null
}

/**
 * 统一认证管理对象
 * 使用统一的持久化适配器，提供完整的认证功能
 * 
 * @namespace auth
 * @example
 * ```typescript
 * import { auth } from '@/core/auth'
 * 
 * // 检查认证状态
 * if (auth.isAuthenticated()) {
 *   console.log('用户已登录')
 * }
 * 
 * // 用户登录
 * await auth.login({ username: 'user', password: 'pass' })
 * 
 * // 权限检查
 * if (auth.hasPermission('admin')) {
 *   console.log('用户有管理员权限')
 * }
 * ```
 */
export const auth = {
  // ===== 基础认证状态 =====
  
  /**
   * 获取当前认证状态。
   * @returns {AuthState} 当前认证状态对象
   */
  getState(): AuthState {
    return {
      token: state.token,
      refreshToken: state.refreshToken,
      user: state.user,
      lastLoginTime: state.lastLoginTime
    }
  },

  /**
   * 检查当前用户是否已认证。
   * @returns {boolean} 若存在有效令牌则返回 true
   */
  isAuthenticated(): boolean {
    return Boolean(state.token)
  },

  // ===== 令牌管理 =====

  /**
   * 设置认证令牌并触发令牌变化事件。
   * @param {string} token 要保存的访问令牌
   */
  setToken(token: string): void {
    state.token = token
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('token-changed', { token })
  },

  /**
   * 获取当前保存的认证令牌（契约约束：不抛错，返回“最新值”或空）。
   *
   * 设计说明：
   * - 不得抛出异常；读取失败或无令牌时返回 null。
   * - 应返回“当前最新”的可用值（避免返回过期/旧值）。
   * - 与 `withAuth` 协同：当返回 null 时，`withAuth` 不注入 Authorization 头。
   *
   * @returns {string | null} 令牌字符串；不存在或不可用时为 null
   */
  getToken(): string | null {
    return state.token || null
  },

  /**
   * 清除认证令牌并通知监听方。
   * @returns {void}
   */
  clearToken(): void {
    state.token = ''
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('token-cleared')
  },

  /**
   * 检查本地是否持有认证令牌。
   * @returns {boolean} 若令牌存在返回 true
   */
  hasToken(): boolean {
    return Boolean(this.getToken())
  },

  /**
   * 检查指定令牌是否已过期。
   * @param {string} [token] 待检查的令牌，不传时默认读取当前令牌
   * @returns {boolean} 若令牌无效或过期返回 true
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
  },

  /**
   * 设置带过期时间的认证令牌。
   * @param {string} token 要保存的令牌
   * @param {number} expiryMinutes 过期时间（分钟）
   */
  setTokenWithExpiry(token: string, expiryMinutes: number): void {
    state.token = token
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('token-changed', { token, expiryMinutes })
  },

  /**
   * 获取带过期检查的令牌值。
   * @returns {string | null} 若令牌存在且未过期则返回字符串
   */
  getTokenWithExpiry(): string | null {
    const token = this.getToken()
    return this.isTokenExpired(token || undefined) ? null : token
  },

  // ===== 用户信息管理 =====

  /**
   * 设置当前用户信息。
   * @param {UserInfo} user 用户信息对象
   */
  setUser(user: UserInfo): void {
    state.user = user
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('user-changed', { user })
  },

  /**
   * 获取当前用户信息。
   * @returns {UserInfo | null} 若已登录则返回用户对象
   */
  getUser(): UserInfo | null {
    return state.user
  },

  /**
   * 清除用户信息并触发相关事件。
   */
  clearUser(): void {
    state.user = null
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('user-cleared')
  },

  /**
   * 更新已登录用户的权限列表。
   * @param {string[]} permissions 权限标识集合
   */
  updatePermissions(permissions: string[]): void {
    const user = this.getUser()
    if (user) {
      const updatedUser = { ...user, permissions }
      this.setUser(updatedUser)
      
      // 通过AuthBridge同步权限到UserStore
      try {
        const { createAuthBridge } = require('@/core/store/modules/user/integrations')
        const authBridge = createAuthBridge()
        authBridge.syncPermissions(permissions)
      } catch (error) {
        // AuthBridge可能未初始化，忽略错误
      }
    }
  },

  /**
   * 检查当前用户是否拥有指定权限。
   * @param {string} permission 权限标识
   * @returns {boolean} 若权限存在返回 true
   */
  hasPermission(permission: string): boolean {
    const user = this.getUser()
    return user?.permissions?.includes(permission) || false
  },

  /**
   * 检查当前用户是否拥有指定角色。
   * @param {string} role 角色标识
   * @returns {boolean} 若角色存在返回 true
   */
  hasRole(role: string): boolean {
    const user = this.getUser()
    return user?.roles?.includes(role) || false
  },

  // ===== 刷新令牌管理 =====

  /**
   * 设置刷新令牌。
   * @param {string} refreshToken 刷新令牌字符串
   */
  setRefreshToken(refreshToken: string): void {
    state.refreshToken = refreshToken
    localAuthPersistence.save(state)
  },

  /**
   * 获取当前保存的刷新令牌。
   * @returns {string | null} 刷新令牌字符串或 null
   */
  getRefreshToken(): string | null {
    return state.refreshToken || null
  },

  /**
   * 清除现有刷新令牌。
   */
  clearRefreshToken(): void {
    state.refreshToken = undefined
    localAuthPersistence.save(state)
  },

  // ===== 认证操作 =====

  /**
   * 调用登录逻辑并同步认证信息。
   * @param {LoginCredentials} credentials 登录凭证
   * @returns {Promise<AuthResponse>} 登录响应数据
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // 这里应该调用实际的登录API
      const response: AuthResponse = await this.callLoginAPI(credentials)
      
      // 更新状态并持久化
      state.token = response.token
      state.user = response.user
      state.refreshToken = response.refreshToken
      state.lastLoginTime = Date.now()
      localAuthPersistence.save(state)
      
      this.dispatchAuthEvent('login-success', { user: response.user })
      return response
    } catch (error) {
      this.dispatchAuthEvent('login-error', { error })
      throw error
    }
  },

  /**
   * 清除所有认证相关数据并触发登出事件。
   *
   * 不变量（登出后必须满足）：
   * - state.token === ''
   * - state.user === null
   * - state.refreshToken === undefined
   * - state.lastLoginTime === undefined
   * - 持久化存储被清空
   */
  logout(): void {
    state = {
      token: '',
      user: null,
      refreshToken: undefined,
      lastLoginTime: undefined
    } as AuthState
    // 先清空持久化，再写入当前空状态，确保外部读取一致
    localAuthPersistence.clear()
    localAuthPersistence.save(state)
    this.dispatchAuthEvent('logout')
  },

  /**
   * 刷新访问令牌并同步存储。
   * @returns {Promise<string>} 新的访问令牌
   * @throws {Error} 当刷新失败或缺少刷新令牌时抛出错误
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('没有刷新令牌')
      }

      // 这里应该调用实际的刷新令牌API
      const response = await this.callRefreshTokenAPI(refreshToken)
      
      // 写入最新令牌并持久化
      this.setToken(response.token)
      if (response.refreshToken) this.setRefreshToken(response.refreshToken)
      
      this.dispatchAuthEvent('token-refreshed', { token: response.token })
      return response.token
    } catch (error) {
      // 失败时清理状态，避免脏 token 持续存在
      this.logout()
      this.dispatchAuthEvent('token-refresh-error', { error })
      throw error
    }
  },

  /**
   * 检查当前认证状态，必要时自动尝试刷新令牌。
   * @returns {Promise<boolean>} 若认证状态有效返回 true
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
  },

  // ===== 状态恢复 =====

  /**
   * 从持久化存储中恢复认证状态
   */
  restore(): void {
    const saved = localAuthPersistence.load()
    if (saved) {
      state = saved
    }
  },

  // ===== API调用方法 =====

  /**
   * 调用登录API
   * @param credentials 登录凭证
   * @returns 认证响应
   */
  async callLoginAPI(credentials: LoginCredentials): Promise<AuthResponse> {
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
            roles: ['user'],
            lastLoginTime: Date.now()
          },
          expiresIn: 3600
        })
      }, 1000)
    })
  },

  /**
   * 调用刷新令牌API
   * @param refreshToken 刷新令牌
   * @returns 新的令牌信息
   */
  async callRefreshTokenAPI(_refreshToken: string): Promise<{ token: string; refreshToken?: string }> {
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
  },

  // ===== 事件管理 =====

  /**
   * 注册认证事件回调。
   * @param {(event: string, data?: any) => void} callback 事件处理函数
   * @returns {() => void} 取消监听的函数
   */
  onAuthEvent(callback: (event: string, data?: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      const { type, detail } = event
      callback(type, detail)
    }

    window.addEventListener('ve-auth-event', handler as EventListener)
    
    return () => {
      window.removeEventListener('ve-auth-event', handler as EventListener)
    }
  },

  /**
   * 向全局广播认证事件。
   * @param {string} eventType 事件类型
   * @param {any} [data] 附带的数据
   */
  dispatchAuthEvent(eventType: string, data?: any): void {
    const event = new CustomEvent('ve-auth-event', {
      detail: { type: eventType, data }
    })
    window.dispatchEvent(event)
  }
}

