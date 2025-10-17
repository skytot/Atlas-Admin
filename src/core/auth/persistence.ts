/**
 * 统一认证持久化适配器
 * 作为唯一的存储访问点，让 auth 和 userStore 共享
 */

import { storage } from '@/core/storage'
import type { UserInfo } from './types'

/**
 * 认证状态数据结构
 */
export interface AuthState {
  token: string
  refreshToken?: string
  user: UserInfo | null
  lastLoginTime?: number
}

/**
 * 统一认证持久化适配器接口
 */
export interface AuthPersistenceAdapter {
  save(data: AuthState): void
  load(): AuthState | null
  clear(): void
}

/**
 * 基于 storage 模块的本地认证持久化适配器
 */
export const localAuthPersistence: AuthPersistenceAdapter = {
  save(data: AuthState) {
    storage.set('auth_state', data, {
      type: 'localStorage',
      serialize: true
    })
  },

  load(): AuthState | null {
    return storage.get<AuthState>('auth_state', {
      type: 'localStorage',
      serialize: true,
      defaultValue: null
    })
  },

  clear() {
    storage.remove('auth_state')
  }
}

/**
 * 创建自定义认证持久化适配器
 * @param options 持久化选项
 */
export function createAuthPersistenceAdapter(options: {
  key?: string
  storageType?: 'localStorage' | 'sessionStorage'
} = {}): AuthPersistenceAdapter {
  const { key = 'auth_state', storageType = 'localStorage' } = options

  return {
    save(data: AuthState) {
      storage.set(key, data, {
        type: storageType,
        serialize: true
      })
    },

    load(): AuthState | null {
      return storage.get<AuthState>(key, {
        type: storageType,
        serialize: true,
        defaultValue: null
      })
    },

    clear() {
      storage.remove(key)
    }
  }
}
