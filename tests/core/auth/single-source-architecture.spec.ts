import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user/user.store'

/**
 * 测试目标：验证单一数据源架构。
 * 覆盖场景：
 * - Auth模块作为唯一数据源
 * - UserStore作为纯消费端
 * - 数据一致性保证
 * - 持久化统一性
 */
describe('single source architecture', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    auth.logout()
  })

  /**
   * 测试目标：验证Auth模块是唯一数据源。
   * 输入：通过Auth模块设置数据。
   * 预期：UserStore从Auth获取数据，不自己存储。
   */
  it('Auth模块应该是唯一数据源', () => {
    const userStore = useUserStore()
    
    const userInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin.write'],
      roles: ['user', 'admin']
    }
    
    // 通过Auth模块设置数据
    auth.setToken('test-token')
    auth.setUser(userInfo)
    
    // UserStore从Auth获取数据
    userStore.restoreFromAuth()
    
    // 验证数据一致性
    expect(auth.getToken()).toBe(userStore.token)
    expect(auth.getUser()?.name).toBe(userStore.name)
    expect(auth.getUser()?.permissions).toEqual(userStore.permissions)
    expect(auth.getUser()?.roles).toEqual(userStore.roles)
  })

  /**
   * 测试目标：验证UserStore作为纯消费端。
   * 输入：通过UserStore更新权限。
   * 预期：UserStore通过Auth模块更新，然后从Auth获取最新状态。
   */
  it('UserStore应该作为纯消费端', () => {
    const userStore = useUserStore()
    
    // 设置初始状态
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['user.read'],
      roles: ['user']
    })
    userStore.restoreFromAuth()
    
    // 通过UserStore更新权限（应该通过Auth模块）
    userStore.updatePermissions(['user.read', 'admin.write'])
    
    // 验证Auth模块状态已更新
    expect(auth.getUser()?.permissions).toEqual(['user.read', 'admin.write'])
    
    // 验证UserStore状态与Auth一致
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
    expect(userStore.hasPermission('admin.write')).toBe(true)
    expect(auth.hasPermission('admin.write')).toBe(true)
  })

  /**
   * 测试目标：验证持久化统一性。
   * 输入：设置认证状态，然后恢复。
   * 预期：只有Auth模块进行持久化，UserStore从Auth恢复。
   */
  it('持久化应该统一通过Auth模块', () => {
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
    
    // 恢复认证状态
    auth.restore()
    userStore.restoreFromAuth()
    
    // 验证状态一致性
    expect(auth.getToken()).toBe('test-token')
    expect(auth.getUser()?.name).toBe('Alice')
    expect(userStore.token).toBe('test-token')
    expect(userStore.name).toBe('Alice')
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
  })

  /**
   * 测试目标：验证数据源单一性。
   * 输入：检查Auth模块的状态管理。
   * 预期：Auth模块管理所有状态，UserStore不独立存储。
   */
  it('应该只有Auth模块管理状态', () => {
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
    
    // 验证Auth模块有完整状态
    expect(auth.getToken()).toBe('test-token')
    expect(auth.getUser()?.name).toBe('Alice')
    expect(auth.getUser()?.permissions).toEqual(['dashboard.read'])
    
    // UserStore从Auth获取状态
    userStore.restoreFromAuth()
    
    // 验证UserStore状态与Auth一致
    expect(userStore.token).toBe(auth.getToken())
    expect(userStore.name).toBe(auth.getUser()?.name)
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
    
    // 验证UserStore不独立存储（通过检查状态变化）
    const originalToken = userStore.token
    auth.setToken('new-token')
    
    // UserStore状态不会自动更新（需要手动调用restoreFromAuth）
    expect(userStore.token).toBe(originalToken)
    
    // 手动同步后应该更新
    userStore.restoreFromAuth()
    expect(userStore.token).toBe('new-token')
  })
})
