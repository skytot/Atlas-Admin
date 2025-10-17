import { beforeEach, describe, expect, it } from 'vitest'

import { auth } from '@/core/auth'
import type { UserInfo } from '@/core/auth/types'


/**
 * 测试目标：验证 `auth` 模块的核心认证功能。
 * 覆盖场景：
 * - 令牌管理（设置/获取/清除/过期检查）；
 * - 用户信息管理（设置/获取/权限检查）；
 * - 认证状态查询与事件分发。
 */
describe('core/auth', () => {
  beforeEach(() => {
    // 清理所有认证状态
    if (auth.clearToken) auth.clearToken()
    if (auth.clearUser) auth.clearUser()
  })

  /**
   * 测试目标：令牌设置与获取应正常工作。
   * 输入：设置令牌 'test-token-123'。
   * 预期：`getToken()` 返回该令牌，`hasToken()` 返回 true，`isAuthenticated()` 返回 true。
   */
  it('应当正确设置和获取令牌', () => {
    const token = 'test-token-123'
    auth.setToken(token)

    expect(auth.getToken()).toBe(token)
    expect(auth.hasToken()).toBe(true)
    expect(auth.isAuthenticated()).toBe(true)
  })

  /**
   * 测试目标：清除令牌后状态应重置。
   * 输入：先设置令牌，再调用 `clearToken()`。
   * 预期：令牌为 null，认证状态为 false。
   */
  it('应当正确清除令牌', () => {
    auth.setToken('test-token')
    expect(auth.isAuthenticated()).toBe(true)

    auth.clearToken()

    expect(auth.getToken()).toBe(null)
    expect(auth.hasToken()).toBe(false)
    expect(auth.isAuthenticated()).toBe(false)
  })

  /**
   * 测试目标：用户信息设置与获取应正常工作。
   * 输入：设置包含权限的用户信息。
   * 预期：`getUser()` 返回用户对象，权限检查正确。
   */
  it('应当正确设置和获取用户信息', () => {
    const userInfo: UserInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin.write'],
      roles: ['user', 'admin']
    }

    auth.setUser(userInfo)

    expect(auth.getUser()).toEqual(userInfo)
    expect(auth.hasPermission('dashboard.read')).toBe(true)
    expect(auth.hasPermission('admin.write')).toBe(true)
    expect(auth.hasPermission('nonexistent')).toBe(false)
    expect(auth.hasRole('admin')).toBe(true)
    expect(auth.hasRole('guest')).toBe(false)
  })

  /**
   * 测试目标：认证状态应正确反映当前状态。
   * 输入：设置令牌和用户信息。
   * 预期：`getState()` 返回完整的认证状态对象。
   */
  it('应当返回正确的认证状态', () => {
    const token = 'test-token'
    const userInfo: UserInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read']
    }

    auth.setToken(token)
    auth.setUser(userInfo)

    const state = auth.getState()

    expect(state.token).toBe(token)
    expect(state.user).toEqual(userInfo)
    expect(auth.isAuthenticated()).toBe(true)
  })

  /**
   * 测试目标：权限更新应正确反映在用户信息中。
   * 输入：先设置用户，再更新权限。
   * 预期：用户权限数组更新，权限检查返回新值。
   */
  it('应当正确更新用户权限', () => {
    const userInfo: UserInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read']
    }

    auth.setUser(userInfo)
    auth.updatePermissions(['dashboard.read', 'admin.write', 'reports.view'])

    const updatedUser = auth.getUser()
    expect(updatedUser?.permissions).toEqual(['dashboard.read', 'admin.write', 'reports.view'])
    expect(auth.hasPermission('admin.write')).toBe(true)
    expect(auth.hasPermission('reports.view')).toBe(true)
  })
})
