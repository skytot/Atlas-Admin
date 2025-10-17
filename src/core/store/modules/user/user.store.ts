import { defineStore } from 'pinia'
import { auth } from '@/core/auth'
import type { AuthBridge } from './integrations'
import type { UserState, UserPayload, UserPersistenceAdapter } from './types'
import { UNKNOWN_USER_NAME } from './constants'
import {
  applyUserPayload,
  createInitialUserState,
  normalizeUserPayload,
  toUserStateSnapshot,
  fromUserStateSnapshot
} from './utils'

/**
 * 用户 store 构建选项。
 */
export interface UserStoreOptions {
  authBridge?: AuthBridge
  persistence?: UserPersistenceAdapter
}

/**
 * 基于注入的桥接器构建用户 store 动作集合。
 */
function createUserStoreActions(authBridge?: AuthBridge, persistence?: UserPersistenceAdapter) {
  return {
    /**
     * 设置用户信息并触发同步。
     */
    setUser(this: UserState, payload: UserPayload) {
      const normalized = normalizeUserPayload(payload)
      applyUserPayload(this, normalized)

      authBridge?.syncUser(normalized)
      persistence?.save(toUserStateSnapshot(this))
    },

    /**
     * 清理用户信息。
     */
    clearUser(this: UserState) {
      applyUserPayload(this, {
        name: '',
        token: '',
        permissions: [],
        lastLoginTime: undefined
      })

      authBridge?.clearUser()
      persistence?.clear()
    },

    /**
     * 更新权限列表。
     * UserStore作为消费端，通过Auth模块更新权限
     */
    updatePermissions(this: UserState, permissions: string[]) {
      // 通过Auth模块更新权限
      auth.updatePermissions(permissions)
      // 从Auth重新获取最新状态
      this.restoreFromAuth()
    },

    /**
     * 更新用户名称。
     */
    updateName(this: UserState, name: string) {
      this.name = name

      authBridge?.syncName(name)
      persistence?.save(toUserStateSnapshot(this))
    },

    /**
     * 获取用于展示的名称。
     */
    getDisplayName(this: UserState): string {
      return this.name || UNKNOWN_USER_NAME
    },

    /**
     * 从auth模块恢复用户状态
     * UserStore作为纯消费端，只从Auth获取数据
     */
    restoreFromAuth(this: UserState): void {
      const user = auth.getUser()
      const token = auth.getToken()
      
      // 只要有用户信息就同步，token可以为空
      if (user) {
        this.token = token || ''
        this.name = user.name
        this.permissions = user.permissions || []
        this.roles = user.roles
        this.lastLoginTime = user.lastLoginTime
      }
    },

    /**
     * 同步权限到Auth模块
     * UserStore不直接修改权限，而是通过Auth模块
     */
    syncPermissionsToAuth(this: UserState, permissions: string[]) {
      auth.updatePermissions(permissions)
      // 然后从Auth重新获取最新状态
      this.restoreFromAuth()
    },

    /**
     * 设置用户信息并同步到auth
     */
    setUserAndSync(this: UserState, payload: UserPayload): void {
      const normalized = normalizeUserPayload(payload)
      applyUserPayload(this, normalized)
      
      // 同步到auth模块 - 构造UserInfo对象
      const userInfo = {
        id: '1', // 这里应该从payload中获取或生成
        name: normalized.name,
        email: '', // 这里应该从payload中获取
        permissions: normalized.permissions,
        roles: normalized.roles,
        lastLoginTime: normalized.lastLoginTime
      }
      
      auth.setUser(userInfo)
      auth.setToken(normalized.token)
    },

    /**
     * 登出并清除所有状态
     */
    logoutAndClear(this: UserState): void {
      // 重置状态
      this.name = ''
      this.token = ''
      this.permissions = []
      this.roles = undefined
      this.lastLoginTime = undefined
      
      // 调用auth登出
      auth.logout()
    }
  }
}

/**
 * 创建用户 store，支持自定义认证桥接与持久化策略。
 * @param {UserStoreOptions} [options] 用户 store 选项
 */
export function createUserStore(options: UserStoreOptions = {}) {
  const { authBridge, persistence } = options
  const actions = createUserStoreActions(authBridge, persistence)

  return defineStore('user', {
    state: (): UserState => {
      // UserStore作为消费端，不自己持久化，只从Auth获取初始状态
      return createInitialUserState()
    },

    getters: {
      isAuthenticated: state => Boolean(state.token),
      hasPermission: state => (permission: string) =>
        state.permissions.includes(permission),
      hasRole: state => (role: string) =>
        state.roles?.includes(role) || false,
      userInfo: state => ({
        name: state.name,
        permissions: state.permissions,
        roles: state.roles,
        lastLoginTime: state.lastLoginTime
      })
    },

    actions
  })
}

export const useUserStore = createUserStore()

