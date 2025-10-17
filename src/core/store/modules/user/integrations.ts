import { storage } from '@/core/storage'
import { auth } from '@/core/auth'
import { useUserStore } from './user.store'
import type {
  UserPayload,
  UserPersistenceAdapter,
  UserPersistenceOptions,
  UserStateSnapshot
} from './types'

/**
 * 将用户 store 与认证模块解耦的桥接接口。
 */
export interface AuthBridge {
  syncUser(payload: UserPayload): void
  clearUser(): void
  syncPermissions(permissions: string[]): void
  syncName(name: string): void
  syncToken(token: string): void
  clearToken(): void
}

/**
 * 创建默认的认证桥接器。
 * 连接认证模块和用户状态管理。
 * UserStore作为纯消费端，只从Auth获取数据。
 */
export function createAuthBridge(): AuthBridge {
  return {
    syncUser: (payload: UserPayload) => {
      // UserStore作为消费端，通过Auth模块设置用户信息
      const userStore = useUserStore()
      // 构造UserInfo对象并设置到Auth
      const userInfo = {
        id: '1', // 从payload获取或生成
        name: payload.name,
        email: '', // 从payload获取
        permissions: payload.permissions,
        roles: payload.roles,
        lastLoginTime: payload.lastLoginTime
      }
      // 通过Auth模块设置
      auth.setUser(userInfo)
      auth.setToken(payload.token)
      // 从Auth恢复状态到UserStore
      userStore.restoreFromAuth()
    },
    
    clearUser: () => {
      // 通过Auth模块清除
      auth.logout()
      // UserStore会自动从Auth获取最新状态（空状态）
      const userStore = useUserStore()
      userStore.restoreFromAuth()
    },
    
    syncPermissions: (permissions: string[]) => {
      // 通过Auth模块更新权限
      auth.updatePermissions(permissions)
      // UserStore从Auth获取最新状态
      const userStore = useUserStore()
      userStore.restoreFromAuth()
    },
    
    syncName: (name: string) => {
      // 通过Auth模块更新用户信息
      const user = auth.getUser()
      if (user) {
        auth.setUser({ ...user, name })
        // UserStore从Auth获取最新状态
        const userStore = useUserStore()
        userStore.restoreFromAuth()
      }
    },
    
    syncToken: (token: string) => {
      // 通过Auth模块设置token
      auth.setToken(token)
      // UserStore从Auth获取最新状态
      const userStore = useUserStore()
      userStore.restoreFromAuth()
    },
    
    clearToken: () => {
      // 通过Auth模块清除token
      auth.clearToken()
      // UserStore从Auth获取最新状态
      const userStore = useUserStore()
      userStore.restoreFromAuth()
    }
  }
}

/**
 * 创建基于核心 storage 模块的用户状态持久化适配器。
 * @param {UserPersistenceOptions} [options] 持久化配置
 * @returns {UserPersistenceAdapter} 用户持久化适配器
 */
export function createUserPersistenceAdapter(
  options: UserPersistenceOptions = {}
): UserPersistenceAdapter {
  const {
    key = 'user-state',
    storageType = 'localStorage',
    serialize = true
  } = options

  return {
    save(state: UserStateSnapshot) {
      storage.set(key, state, {
        type: storageType,
        serialize
      })
    },
    load(): UserStateSnapshot | null {
      return storage.get<UserStateSnapshot>(key, {
        type: storageType,
        serialize,
        defaultValue: null
      })
    },
    clear() {
      storage.remove(key)
    }
  }
}

