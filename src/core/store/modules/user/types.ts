/**
 * 用户 store 的核心状态结构。
 */
export interface UserState {
  name: string
  token: string
  permissions: string[]
  roles?: string[]
  lastLoginTime?: number
}

/**
 * 设置用户信息时使用的载荷结构。
 */
export interface UserPayload {
  name: string
  token: string
  permissions: string[]
  roles?: string[]
  lastLoginTime?: number
}

/**
 * 用于序列化/持久化的状态快照。
 */
export type UserStateSnapshot = Pick<UserState, 'name' | 'token' | 'permissions' | 'roles' | 'lastLoginTime'>

/**
 * 用户状态持久化选项。
 */
export interface UserPersistenceOptions {
  key?: string
  storageType?: 'localStorage' | 'sessionStorage'
  serialize?: boolean
}

/**
 * 用户状态持久化适配器定义。
 */
export interface UserPersistenceAdapter {
  save(state: UserStateSnapshot): void
  load(): UserStateSnapshot | null
  clear(): void
}

