import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useUserStore } from '@/core/store/modules/user/user.store'
import { auth } from '@/core/auth'

/**
 * 测试目标：验证 `useUserStore` 与认证模块的集成。
 * 覆盖场景：
 * - 状态自动同步；
 * - 权限和角色检查；
 * - 状态恢复和清除。
 */
describe('core/store/modules/user/user.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清理认证状态
    auth.logout()
  })

  /**
   * 测试目标：从认证模块恢复状态应正常工作。
   * 输入：设置认证状态，然后恢复。
   * 预期：UserStore状态与认证模块同步。
   */
  it('应当从认证模块恢复状态', () => {
    const store = useUserStore()
    
    // 设置认证状态
    auth.setToken('token-123')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    // 从认证模块恢复状态
    store.restoreFromAuth()

    expect(store.token).toBe('token-123')
    expect(store.name).toBe('Alice')
    expect(store.permissions).toEqual(['dashboard.read'])
    expect(store.roles).toEqual(['user'])
  })

  /**
   * 测试目标：设置用户信息并同步到认证模块应正常工作。
   * 输入：设置用户信息并同步。
   * 预期：状态更新成功，认证模块状态同步。
   */
  it('应当设置用户信息并同步到认证模块', () => {
    const store = useUserStore()

    store.setUserAndSync({
      name: 'Alice',
      token: 'token-123',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    expect(store.name).toBe('Alice')
    expect(store.token).toBe('token-123')
    expect(store.permissions).toEqual(['dashboard.read'])
    expect(store.roles).toEqual(['user'])

    // 验证认证模块状态已同步
    expect(auth.getToken()).toBe('token-123')
    expect(auth.getUser()?.name).toBe('Alice')
  })

  /**
   * 测试目标：派生 getter 正确反映状态。
   * 输入：默认状态与设置用户后状态比较。
   * 预期：`isAuthenticated`、`hasPermission`、`userInfo` 按期望变化。
   */
  it('getter 应反映当前状态', () => {
    const store = useUserStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.hasPermission('dashboard.read')).toBe(false)
    expect(store.userInfo).toEqual({ 
      name: '', 
      permissions: [], 
      roles: undefined,
      lastLoginTime: undefined 
    })

    store.setUser({
      name: 'Alice',
      token: 'token-123',
      permissions: ['dashboard.read'],
      roles: ['user'],
      lastLoginTime: 123456
    })

    expect(store.isAuthenticated).toBe(true)
    expect(store.hasPermission('dashboard.read')).toBe(true)
    expect(store.hasRole('user')).toBe(true)
    expect(store.userInfo).toEqual({ 
      name: 'Alice', 
      permissions: ['dashboard.read'], 
      roles: ['user'],
      lastLoginTime: 123456 
    })
  })

  /**
   * 测试目标：登出并清除状态应正常工作。
   * 输入：设置用户状态，然后登出。
   * 预期：状态清空，认证模块状态也清空。
   */
  it('应当登出并清除所有状态', () => {
    const store = useUserStore()

    // 设置用户状态
    store.setUser({
      name: 'Alice',
      token: 'token-123',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    expect(store.isAuthenticated).toBe(true)

    // 登出并清除状态
    store.logoutAndClear()

    expect(store.name).toBe('')
    expect(store.token).toBe('')
    expect(store.permissions).toEqual([])
    expect(store.roles).toBeUndefined()
    expect(store.isAuthenticated).toBe(false)

    // 验证认证模块状态也已清空
    expect(auth.getToken()).toBeNull()
    expect(auth.getUser()).toBeNull()
  })
})


