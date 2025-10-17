import { describe, expect, it, beforeEach } from 'vitest'
import { StorageManager } from '@/core/storage/storage-manager'

/**
 * 测试目标：验证智能序列化功能。
 * 覆盖场景：
 * - 自动识别数据类型并选择合适的序列化方式
 * - 标识符正确区分序列化和非序列化数据
 * - 向后兼容旧数据格式
 * - 基本类型和复杂类型的正确处理
 */
describe('core/storage/smart-serialization', () => {
  let storageManager: StorageManager

  beforeEach(() => {
    // 清理存储
    localStorage.clear()
    sessionStorage.clear()
    
    storageManager = new StorageManager('TEST_', 'localStorage')
  })

  /**
   * 测试目标：字符串数据应使用原始格式存储。
   * 输入：存储字符串 'hello world'。
   * 预期：存储格式为 '__RAW__hello world'，读取时返回原始字符串。
   */
  it('应当智能识别字符串为原始数据', () => {
    const value = 'hello world'
    storageManager.setItem('string', value)

    // 验证存储格式
    const rawValue = localStorage.getItem('TEST_string')
    expect(rawValue).toBe('__RAW__hello world')

    // 验证读取结果
    expect(storageManager.getItem('string')).toBe(value)
  })

  /**
   * 测试目标：数字和布尔值应使用原始格式存储。
   * 输入：存储数字 42 和布尔值 true。
   * 预期：存储格式带 '__RAW__' 前缀，读取时返回正确类型。
   */
  it('应当智能识别基本类型为原始数据', () => {
    storageManager.setItem('number', 42)
    storageManager.setItem('boolean', true)
    storageManager.setItem('null', null)

    // 验证存储格式
    expect(localStorage.getItem('TEST_number')).toBe('__RAW__42__TYPE__number')
    expect(localStorage.getItem('TEST_boolean')).toBe('__RAW__true__TYPE__boolean')
    expect(localStorage.getItem('TEST_null')).toBe('__RAW__null__TYPE__object')

    // 验证读取结果和类型
    expect(storageManager.getItem('number')).toBe(42)
    expect(storageManager.getItem('boolean')).toBe(true)
    expect(storageManager.getItem('null')).toBe(null)
  })

  /**
   * 测试目标：对象和数组应使用序列化格式存储。
   * 输入：存储对象 { name: 'Alice', age: 30 } 和数组 [1, 2, 3]。
   * 预期：存储格式带 '__SERIALIZED__' 前缀，读取时返回完整对象。
   */
  it('应当智能识别复杂类型为序列化数据', () => {
    const object = { name: 'Alice', age: 30 }
    const array = [1, 2, 3]
    
    storageManager.setItem('object', object)
    storageManager.setItem('array', array)

    // 验证存储格式
    const objectRaw = localStorage.getItem('TEST_object')
    const arrayRaw = localStorage.getItem('TEST_array')
    
    expect(objectRaw).toMatch(/^__SERIALIZED__/)
    expect(arrayRaw).toMatch(/^__SERIALIZED__/)

    // 验证读取结果
    expect(storageManager.getItem('object')).toEqual(object)
    expect(storageManager.getItem('array')).toEqual(array)
  })

  /**
   * 测试目标：明确指定序列化选项应覆盖智能判断。
   * 输入：字符串 'test' 但指定 serialize: true。
   * 预期：使用序列化格式存储，读取时返回完整 StorageItem 结构。
   */
  it('应当支持明确指定序列化选项', () => {
    const value = 'test'
    storageManager.setItem('forced-serialized', value, { serialize: true })

    // 验证存储格式
    const rawValue = localStorage.getItem('TEST_forced-serialized')
    expect(rawValue).toMatch(/^__SERIALIZED__/)

    // 验证读取结果
    const result = storageManager.getItem('forced-serialized')
    expect(result).toEqual(value)
  })

  /**
   * 测试目标：明确指定非序列化选项应覆盖智能判断。
   * 输入：对象 { data: 'test' } 但指定 serialize: false。
   * 预期：使用原始格式存储（不添加标识符），读取时返回字符串。
   */
  it('应当支持明确指定非序列化选项', () => {
    const value = { data: 'test' }
    storageManager.setItem('forced-raw', value, { serialize: false })

    // 验证存储格式（不添加标识符，保持向后兼容）
    const rawValue = localStorage.getItem('TEST_forced-raw')
    expect(rawValue).toBe('{"data":"test"}')

    // 验证读取结果
    const result = storageManager.getItem('forced-raw', { serialize: false })
    expect(result).toBe('{"data":"test"}') // ensureString 对对象进行 JSON 序列化
  })

  /**
   * 测试目标：向后兼容旧数据格式。
   * 输入：手动存储旧格式的 JSON 数据。
   * 预期：能够正确解析并返回数据。
   */
  it('应当向后兼容旧数据格式', () => {
    // 模拟旧格式数据
    const oldFormatData = JSON.stringify({
      key: 'TEST_legacy',
      value: { name: 'Legacy' },
      timestamp: Date.now(),
      type: 'localStorage'
    })
    
    localStorage.setItem('TEST_legacy', oldFormatData)

    // 验证读取结果
    const result = storageManager.getItem('legacy')
    expect(result).toEqual({ name: 'Legacy' })
  })

  /**
   * 测试目标：混合数据类型的智能处理。
   * 输入：存储多种类型的数据。
   * 预期：每种类型都使用合适的存储格式。
   */
  it('应当正确处理混合数据类型', () => {
    const testData = {
      string: 'hello',
      number: 42,
      boolean: true,
      null: null,
      object: { nested: true },
      array: [1, 2, 3]
    }

    // 存储所有数据
    Object.entries(testData).forEach(([key, value]) => {
      storageManager.setItem(key, value)
    })

    // 验证存储格式
    expect(localStorage.getItem('TEST_string')).toBe('__RAW__hello')
    expect(localStorage.getItem('TEST_number')).toBe('__RAW__42__TYPE__number')
    expect(localStorage.getItem('TEST_boolean')).toBe('__RAW__true__TYPE__boolean')
    expect(localStorage.getItem('TEST_null')).toBe('__RAW__null__TYPE__object')
    expect(localStorage.getItem('TEST_object')).toMatch(/^__SERIALIZED__/)
    expect(localStorage.getItem('TEST_array')).toMatch(/^__SERIALIZED__/)

    // 验证读取结果
    expect(storageManager.getItem('string')).toBe('hello')
    expect(storageManager.getItem('number')).toBe(42)
    expect(storageManager.getItem('boolean')).toBe(true)
    expect(storageManager.getItem('null')).toBe(null)
    expect(storageManager.getItem('object')).toEqual({ nested: true })
    expect(storageManager.getItem('array')).toEqual([1, 2, 3])
  })
})
