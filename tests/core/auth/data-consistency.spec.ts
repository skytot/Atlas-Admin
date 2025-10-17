import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user/user.store'

/**
 * 测试目标：验证auth模块和UserStore之间的数据统一性和状态一致性。
 * 覆盖场景：
 * - 数据源统一性
 * - 状态同步一致性
 * - 权限检查一致性
 * - 数据持久化一致性
 */
describe('core/auth data consistency', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清理认证状态
    auth.logout()
  })

  /**
   * 测试目标：验证auth和UserStore的数据源统一性。
   * 输入：设置认证状态，然后同步到UserStore。
   * 预期：两个模块的数据应该一致。
   */
  it('auth和UserStore数据源应该统一', () => {
    const userStore = useUserStore()
    
    // 设置认证状态
    const userInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin.write'],
      roles: ['user', 'admin'],
      lastLoginTime: Date.now()
    }
    
    auth.setToken('test-token')
    auth.setUser(userInfo)
    
    // 同步到UserStore
    userStore.restoreFromAuth()
    
    // 验证数据一致性
    expect(userStore.token).toBe(auth.getToken())
    expect(userStore.name).toBe(auth.getUser()?.name)
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
    expect(userStore.roles).toEqual(auth.getUser()?.roles)
  })

  /**
   * 测试目标：验证权限检查的一致性。
   * 输入：设置用户权限，然后分别通过auth和UserStore检查。
   * 预期：两个模块的权限检查结果应该一致。
   */
  it('权限检查结果应该一致', () => {
    const userStore = useUserStore()
    
    // 设置认证状态
    const userInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin.write'],
      roles: ['user', 'admin']
    }
    
    auth.setUser(userInfo)
    userStore.restoreFromAuth()
    
    // 验证权限检查一致性
    expect(auth.hasPermission('dashboard.read')).toBe(userStore.hasPermission('dashboard.read'))
    expect(auth.hasPermission('admin.write')).toBe(userStore.hasPermission('admin.write'))
    expect(auth.hasPermission('nonexistent')).toBe(userStore.hasPermission('nonexistent'))
    
    // 验证角色检查一致性
    expect(auth.hasRole('admin')).toBe(userStore.hasRole('admin'))
    expect(auth.hasRole('user')).toBe(userStore.hasRole('user'))
    expect(auth.hasRole('guest')).toBe(userStore.hasRole('guest'))
  })

  /**
   * 测试目标：验证状态同步的一致性。
   * 输入：通过UserStore设置用户信息并同步到auth。
   * 预期：两个模块的状态应该保持同步。
   */
  it('状态同步应该保持一致', () => {
    const userStore = useUserStore()
    
    // 通过UserStore设置用户信息
    userStore.setUserAndSync({
      name: 'Bob',
      token: 'bob-token',
      permissions: ['user.read'],
      roles: ['user']
    })
    
    // 验证auth模块状态已同步
    expect(auth.getToken()).toBe('bob-token')
    expect(auth.getUser()?.name).toBe('Bob')
    expect(auth.getUser()?.permissions).toEqual(['user.read'])
    expect(auth.getUser()?.roles).toEqual(['user'])
    
    // 验证UserStore状态
    expect(userStore.token).toBe('bob-token')
    expect(userStore.name).toBe('Bob')
    expect(userStore.permissions).toEqual(['user.read'])
    expect(userStore.roles).toEqual(['user'])
  })

  /**
   * 测试目标：验证登出时状态清除的一致性。
   * 输入：设置用户状态，然后登出。
   * 预期：两个模块的状态都应该被清除。
   */
  it('登出时状态清除应该一致', () => {
    const userStore = useUserStore()
    
    // 设置用户状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['admin'],
      roles: ['admin']
    })
    userStore.restoreFromAuth()
    
    // 验证初始状态
    expect(auth.isAuthenticated()).toBe(true)
    expect(userStore.isAuthenticated).toBe(true)
    
    // 登出
    auth.logout()
    
    // 验证auth模块状态已清除
    expect(auth.getToken()).toBeNull()
    expect(auth.getUser()).toBeNull()
    expect(auth.isAuthenticated()).toBe(false)
    
    // UserStore状态也应该被清除（通过logoutAndClear）
    userStore.logoutAndClear()
    expect(userStore.token).toBe('')
    expect(userStore.name).toBe('')
    expect(userStore.permissions).toEqual([])
    expect(userStore.isAuthenticated).toBe(false)
  })

  /**
   * 测试目标：验证数据持久化的一致性。
   * 输入：设置认证状态，然后恢复。
   * 预期：持久化数据应该一致。
   */
  it('数据持久化应该一致', () => {
    const userStore = useUserStore()
    
    // 设置认证状态
    const userInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    }
    
    auth.setToken('test-token')
    auth.setUser(userInfo)
    
    // 恢复认证状态
    auth.restore()
    userStore.restoreFromAuth()
    
    // 验证恢复后的状态一致性
    expect(auth.getToken()).toBe('test-token')
    expect(auth.getUser()?.name).toBe('Alice')
    expect(userStore.token).toBe('test-token')
    expect(userStore.name).toBe('Alice')
  })

  /**
   * 测试目标：验证权限更新的一致性。
   * 输入：更新用户权限。
   * 预期：两个模块的权限都应该更新。
   */
  it('权限更新应该一致', () => {
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
    
    // 更新权限
    auth.updatePermissions(['user.read', 'admin.write'])
    
    // 验证权限更新
    expect(auth.hasPermission('admin.write')).toBe(true)
    expect(auth.getUser()?.permissions).toEqual(['user.read', 'admin.write'])
    
    // UserStore需要重新同步
    userStore.restoreFromAuth()
    expect(userStore.hasPermission('admin.write')).toBe(true)
    expect(userStore.permissions).toEqual(['user.read', 'admin.write'])
  })
})
