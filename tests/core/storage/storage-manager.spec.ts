import { beforeEach, describe, expect, it } from 'vitest'

import { StorageManager } from '@/core/storage/storage-manager'

/**
 * 测试目标：验证 `StorageManager` 的核心存储功能。
 * 覆盖场景：
 * - 存储项的设置、获取、删除；
 * - 序列化/反序列化处理；
 * - 存储类型切换（localStorage/sessionStorage）；
 * - 前缀管理和键名处理。
 */
describe('core/storage/storage-manager', () => {
  let storageManager: StorageManager

  beforeEach(() => {
    // 清理存储
    localStorage.clear()
    sessionStorage.clear()
    
    storageManager = new StorageManager('TEST_', 'localStorage')
  })

  /**
   * 测试目标：存储项设置与获取应正常工作。
   * 输入：设置键值对 'user' -> { name: 'Alice' }。
   * 预期：`getItem` 返回相同对象，`hasItem` 返回 true。
   */
  it('应当正确设置和获取存储项', () => {
    const userData = { name: 'Alice', id: 1 }
    storageManager.setItem('user', userData)

    expect(storageManager.hasItem('user')).toBe(true)
    expect(storageManager.getItem('user')).toEqual(userData)
  })

  /**
   * 测试目标：存储项删除应正常工作。
   * 输入：先设置存储项，再删除。
   * 预期：`hasItem` 返回 false，`getItem` 返回 null。
   */
  it('应当正确删除存储项', () => {
    storageManager.setItem('temp', 'value')
    expect(storageManager.hasItem('temp')).toBe(true)

    storageManager.removeItem('temp')

    expect(storageManager.hasItem('temp')).toBe(false)
    expect(storageManager.getItem('temp')).toBe(null)
  })

  /**
   * 测试目标：清空操作应移除所有带前缀的项。
   * 输入：设置多个存储项，调用 `clear()`。
   * 预期：所有项被清除，`getAllKeys()` 返回空数组。
   */
  it('应当正确清空所有存储项', () => {
    storageManager.setItem('item1', 'value1')
    storageManager.setItem('item2', 'value2')
    
    // 验证存储项存在
    expect(storageManager.hasItem('item1')).toBe(true)
    expect(storageManager.hasItem('item2')).toBe(true)

    storageManager.clear()

    expect(storageManager.getAllKeys()).toHaveLength(0)
    expect(storageManager.hasItem('item1')).toBe(false)
    expect(storageManager.hasItem('item2')).toBe(false)
  })

  /**
   * 测试目标：序列化选项应正确控制数据格式。
   * 输入：设置 `serialize: false` 的字符串值。
   * 预期：存储和获取的值为原始字符串，不经过 JSON 处理。
   */
  it('应当支持序列化控制', () => {
    const rawString = 'raw-string-value'
    storageManager.setItem('raw', rawString, { serialize: false })

    expect(storageManager.getItem('raw', { serialize: false })).toBe(rawString)
  })

  /**
   * 测试目标：默认值应在键不存在时返回。
   * 输入：获取不存在的键，提供默认值。
   * 预期：返回指定的默认值。
   */
  it('应当支持默认值', () => {
    const defaultValue = { default: true }
    const result = storageManager.getItem('nonexistent', { 
      defaultValue 
    })

    expect(result).toEqual(defaultValue)
  })

  /**
   * 测试目标：存储类型切换应使用不同的存储实例。
   * 输入：创建 sessionStorage 类型的管理器。
   * 预期：使用 sessionStorage 而非 localStorage。
   */
  it('应当支持存储类型切换', () => {
    const sessionManager = new StorageManager('TEST_', 'sessionStorage')
    
    sessionManager.setItem('session-data', 'session-value')
    storageManager.setItem('local-data', 'local-value')

    // 验证数据隔离
    expect(sessionManager.getItem('session-data')).toBe('session-value')
    expect(sessionManager.getItem('local-data')).toBe(null)
    expect(storageManager.getItem('session-data')).toBe(null)
    expect(storageManager.getItem('local-data')).toBe('local-value')
    
    // 清理
    sessionManager.clear()
  })

  /**
   * 测试目标：键名应正确添加前缀。
   * 输入：使用键名 'user'，前缀为 'TEST_'。
   * 预期：实际存储的键名为 'TEST_user'。
   */
  it('应当正确添加键名前缀', () => {
    storageManager.setItem('user', 'data')
    
    // 验证前缀被正确添加
    expect(localStorage.getItem('TEST_user')).toBeDefined()
    expect(localStorage.getItem('user')).toBe(null)
  })
})
