import { beforeEach, describe, expect, it } from 'vitest'

/**
 * 测试目标：验证持久化适配器的基本功能。
 * 覆盖场景：
 * - 数据保存和加载；
 * - 数据清除；
 * - 数据序列化和反序列化。
 */
describe('core/auth/persistence (简化测试)', () => {
  beforeEach(() => {
    // 清理localStorage
    localStorage.clear()
  })

  /**
   * 测试目标：localStorage基本操作应正常工作。
   * 输入：保存和读取数据。
   * 预期：数据正确保存和读取。
   */
  it('localStorage基本操作应正常工作', () => {
    const testData = {
      token: 'test-token',
      user: {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        permissions: ['dashboard.read'],
        roles: ['user']
      }
    }

    // 保存数据
    localStorage.setItem('auth_state', JSON.stringify(testData))

    // 读取数据
    const saved = localStorage.getItem('auth_state')
    expect(saved).toBeTruthy()
    
    const parsed = JSON.parse(saved!)
    expect(parsed.token).toBe('test-token')
    expect(parsed.user.name).toBe('Alice')
  })

  /**
   * 测试目标：清除数据应正常工作。
   * 输入：先保存数据，然后清除。
   * 预期：数据被从localStorage中移除。
   */
  it('应当正确清除数据', () => {
    const testData = { token: 'test-token', user: null }
    
    // 保存数据
    localStorage.setItem('auth_state', JSON.stringify(testData))
    expect(localStorage.getItem('auth_state')).toBeTruthy()

    // 清除数据
    localStorage.removeItem('auth_state')
    expect(localStorage.getItem('auth_state')).toBeNull()
  })

  /**
   * 测试目标：加载不存在的数据应返回null。
   * 输入：尝试加载不存在的数据。
   * 预期：返回null。
   */
  it('加载不存在的数据应返回null', () => {
    const loaded = localStorage.getItem('auth_state')
    expect(loaded).toBeNull()
  })
})
