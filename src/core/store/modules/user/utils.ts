import type { UserPayload, UserState, UserStateSnapshot } from './types'

/**
 * 构建用户状态的默认初始值。
 * @returns {UserState} 默认状态
 */
export function createInitialUserState(): UserState {
  return {
    name: '',
    token: '',
    permissions: [],
    lastLoginTime: undefined
  }
}

/**
 * 标准化用户载荷，补充时间戳并拷贝权限数组。
 * @param {UserPayload} payload 用户载荷
 * @returns {UserPayload} 规范化载荷
 */
export function normalizeUserPayload(payload: UserPayload): UserPayload {
  return {
    ...payload,
    permissions: [...payload.permissions],
    lastLoginTime: payload.lastLoginTime ?? Date.now()
  }
}

/**
 * 将载荷数据写入状态实例。
 * @param {UserState} state 目标状态
 * @param {UserPayload} payload 用户载荷
 */
export function applyUserPayload(state: UserState, payload: UserPayload): void {
  state.name = payload.name
  state.token = payload.token
  state.permissions = [...payload.permissions]
  state.roles = payload.roles ? [...payload.roles] : undefined
  state.lastLoginTime = payload.lastLoginTime
}

/**
 * 导出状态快照用于持久化。
 * @param {UserState} state 当前状态
 * @returns {UserStateSnapshot} 状态快照
 */
export function toUserStateSnapshot(state: UserState): UserStateSnapshot {
  return {
    name: state.name,
    token: state.token,
    permissions: [...state.permissions],
    roles: state.roles ? [...state.roles] : undefined,
    lastLoginTime: state.lastLoginTime
  }
}

/**
 * 从持久化快照恢复状态。
 * @param {UserStateSnapshot} snapshot 状态快照
 * @returns {UserState} 恢复后的状态
 */
export function fromUserStateSnapshot(snapshot: UserStateSnapshot): UserState {
  return {
    name: snapshot.name,
    token: snapshot.token,
    permissions: [...snapshot.permissions],
    roles: snapshot.roles ? [...snapshot.roles] : undefined,
    lastLoginTime: snapshot.lastLoginTime
  }
}

