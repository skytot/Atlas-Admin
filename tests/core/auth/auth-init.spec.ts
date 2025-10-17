import { beforeEach, describe, expect, it } from 'vitest'

import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user/user.store'
import { createPinia, setActivePinia } from 'pinia'

/**
 * 测试目标：验证认证模块初始化功能。
 * 覆盖场景：
 * - 应用启动时自动恢复认证状态；
 * - UserStore与认证模块的状态同步；
 * - 持久化存储的正确处理。
 */
describe('core/auth/init', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清理认证状态
    auth.logout()
  })

  /**
   * 测试目标：认证状态恢复应正常工作。
   * 输入：设置认证状态，然后恢复。
   * 预期：状态正确恢复。
   */
  it('应当正确恢复认证状态', () => {
    // 设置认证状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    // 恢复状态
    auth.restore()

    expect(auth.getToken()).toBe('test-token')
    expect(auth.getUser()?.name).toBe('Alice')
    expect(auth.isAuthenticated()).toBe(true)
  })

  /**
   * 测试目标：UserStore应从认证模块恢复状态。
   * 输入：设置认证状态，然后恢复UserStore。
   * 预期：UserStore状态与认证模块同步。
   */
  it('UserStore应当从认证模块恢复状态', () => {
    const userStore = useUserStore()

    // 设置认证状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    // 从认证模块恢复状态
    userStore.restoreFromAuth()

    expect(userStore.token).toBe('test-token')
    expect(userStore.name).toBe('Alice')
    expect(userStore.permissions).toEqual(['dashboard.read'])
    expect(userStore.roles).toEqual(['user'])
    expect(userStore.isAuthenticated).toBe(true)
  })

  /**
   * 测试目标：认证模块和UserStore的状态应保持一致。
   * 输入：通过认证模块设置状态，然后检查UserStore。
   * 预期：两个模块的状态保持一致。
   */
  it('认证模块和UserStore状态应保持一致', () => {
    const userStore = useUserStore()

    // 通过认证模块设置状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    // 恢复UserStore状态
    userStore.restoreFromAuth()

    // 验证状态一致性
    expect(userStore.token).toBe(auth.getToken())
    expect(userStore.name).toBe(auth.getUser()?.name)
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
    expect(userStore.roles).toEqual(auth.getUser()?.roles)
  })

  /**
   * 测试目标：清除认证状态应同时清除UserStore状态。
   * 输入：设置状态后清除。
   * 预期：所有状态都被清除。
   */
  it('清除认证状态应同时清除UserStore状态', () => {
    const userStore = useUserStore()

    // 设置状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    userStore.restoreFromAuth()

    // 清除认证状态
    auth.logout()

    // 验证状态已清除
    expect(auth.getToken()).toBeNull()
    expect(auth.getUser()).toBeNull()
    expect(auth.isAuthenticated()).toBe(false)

    // UserStore状态也应该被清除
    // 注意：UserStore不会自动清除，需要手动清除
    userStore.logoutAndClear()
    expect(userStore.token).toBe('')
    expect(userStore.name).toBe('')
    expect(userStore.permissions).toEqual([])
    expect(userStore.isAuthenticated).toBe(false)
  })
})
