import { describe, expect, it, beforeEach } from 'vitest'
import { StorageManager } from '@/core/storage/storage-manager'

/**
 * 测试目标：验证 JSON-like 字符串的兼容性。
 * 覆盖场景：
 * - JSON-like 字符串的存储和读取
 * - 与普通字符串的区别
 * - 与真实 JSON 对象的区别
 * - 边界情况的处理
 */
describe('core/storage/json-like-string', () => {
  let storageManager: StorageManager

  beforeEach(() => {
    // 清理存储
    localStorage.clear()
    sessionStorage.clear()
    
    storageManager = new StorageManager('TEST_', 'localStorage')
  })

  /**
   * 测试目标：JSON-like 字符串应作为原始字符串存储。
   * 输入：存储 JSON-like 字符串 '{"a":1}'。
   * 预期：使用 __RAW__ 前缀存储，读取时返回原始字符串。
   */
  it('应当将 JSON-like 字符串作为原始字符串处理', () => {
    const jsonLikeString = '{"a":1}'
    storageManager.setItem('json-like', jsonLikeString)

    // 验证存储格式
    const rawValue = localStorage.getItem('TEST_json-like')
    expect(rawValue).toBe('__RAW__{"a":1}')

    // 验证读取结果
    const result = storageManager.getItem('json-like')
    expect(result).toBe('{"a":1}')
    expect(typeof result).toBe('string')
  })

  /**
   * 测试目标：真实 JSON 对象应使用序列化格式存储。
   * 输入：存储真实对象 { a: 1 }。
   * 预期：使用 __SERIALIZED__ 前缀存储，读取时返回对象。
   */
  it('应当将真实 JSON 对象使用序列化格式处理', () => {
    const realObject = { a: 1 }
    storageManager.setItem('real-object', realObject)

    // 验证存储格式
    const rawValue = localStorage.getItem('TEST_real-object')
    expect(rawValue).toMatch(/^__SERIALIZED__/)

    // 验证读取结果
    const result = storageManager.getItem('real-object')
    expect(result).toEqual({ a: 1 })
    expect(typeof result).toBe('object')
  })

  /**
   * 测试目标：区分 JSON-like 字符串和真实对象。
   * 输入：同时存储 JSON-like 字符串和对应的真实对象。
   * 预期：使用不同的存储格式，读取时返回不同类型。
   */
  it('应当正确区分 JSON-like 字符串和真实对象', () => {
    const jsonLikeString = '{"name":"Alice","age":30}'
    const realObject = { name: 'Alice', age: 30 }

    storageManager.setItem('json-string', jsonLikeString)
    storageManager.setItem('real-object', realObject)

    // 验证存储格式不同
    const stringRaw = localStorage.getItem('TEST_json-string')
    const objectRaw = localStorage.getItem('TEST_real-object')
    
    expect(stringRaw).toBe('__RAW__{"name":"Alice","age":30}')
    expect(objectRaw).toMatch(/^__SERIALIZED__/)

    // 验证读取结果类型不同
    const stringResult = storageManager.getItem('json-string')
    const objectResult = storageManager.getItem('real-object')

    expect(stringResult).toBe('{"name":"Alice","age":30}')
    expect(typeof stringResult).toBe('string')

    expect(objectResult).toEqual({ name: 'Alice', age: 30 })
    expect(typeof objectResult).toBe('object')
  })

  /**
   * 测试目标：处理各种 JSON-like 字符串格式。
   * 输入：存储多种 JSON-like 字符串。
   * 预期：都作为原始字符串处理。
   */
  it('应当正确处理各种 JSON-like 字符串格式', () => {
    const testCases = [
      '{"a":1}',
      '{"name":"test","value":123}',
      '[1,2,3]',
      '{"nested":{"key":"value"}}',
      'null',
      'true',
      'false',
      '123',
      'invalid json {',
      '{"incomplete":'
    ]

    testCases.forEach((jsonLike, index) => {
      storageManager.setItem(`test-${index}`, jsonLike)
      
      // 验证存储格式
      const rawValue = localStorage.getItem(`TEST_test-${index}`)
      expect(rawValue).toBe(`__RAW__${jsonLike}`)

      // 验证读取结果
      const result = storageManager.getItem(`test-${index}`)
      expect(result).toBe(jsonLike)
      expect(typeof result).toBe('string')
    })
  })

  /**
   * 测试目标：边界情况处理。
   * 输入：存储空字符串、纯数字字符串、布尔字符串等。
   * 预期：正确处理各种边界情况。
   */
  it('应当正确处理边界情况', () => {
    const edgeCases = [
      { value: '', expected: '' },
      { value: '0', expected: '0' },
      { value: '1', expected: '1' },
      { value: 'true', expected: 'true' },
      { value: 'false', expected: 'false' },
      { value: 'null', expected: 'null' },
      { value: 'undefined', expected: 'undefined' }
    ]

    edgeCases.forEach(({ value, expected }, index) => {
      storageManager.setItem(`edge-${index}`, value)
      
      const result = storageManager.getItem(`edge-${index}`)
      expect(result).toBe(expected)
    })
  })

  /**
   * 测试目标：验证与旧数据格式的兼容性。
   * 输入：手动存储旧格式的 JSON 数据。
   * 预期：能够正确解析并返回数据。
   */
  it('应当兼容旧数据格式', () => {
    // 模拟旧格式数据（没有标识符）
    const oldFormatData = JSON.stringify({
      key: 'TEST_legacy-json',
      value: { legacy: true },
      timestamp: Date.now(),
      type: 'localStorage'
    })
    
    localStorage.setItem('TEST_legacy-json', oldFormatData)

    // 验证读取结果
    const result = storageManager.getItem('legacy-json')
    expect(result).toEqual({ legacy: true })
  })

  /**
   * 测试目标：验证混合数据类型的处理。
   * 输入：存储 JSON-like 字符串、真实对象、基本类型。
   * 预期：每种类型都使用合适的存储格式。
   */
  it('应当正确处理混合数据类型', () => {
    const mixedData = {
      'json-string': '{"type":"string"}',
      'real-object': { type: 'object' },
      'number': 42,
      'boolean': true,
      'null': null,
      'array-string': '[1,2,3]',
      'real-array': [1, 2, 3]
    }

    // 存储所有数据
    Object.entries(mixedData).forEach(([key, value]) => {
      storageManager.setItem(key, value)
    })

    // 验证存储格式
    expect(localStorage.getItem('TEST_json-string')).toBe('__RAW__{"type":"string"}')
    expect(localStorage.getItem('TEST_real-object')).toMatch(/^__SERIALIZED__/)
    expect(localStorage.getItem('TEST_number')).toBe('__RAW__42__TYPE__number')
    expect(localStorage.getItem('TEST_boolean')).toBe('__RAW__true__TYPE__boolean')
    expect(localStorage.getItem('TEST_null')).toBe('__RAW__null__TYPE__object')
    expect(localStorage.getItem('TEST_array-string')).toBe('__RAW__[1,2,3]')
    expect(localStorage.getItem('TEST_real-array')).toMatch(/^__SERIALIZED__/)

    // 验证读取结果
    expect(storageManager.getItem('json-string')).toBe('{"type":"string"}')
    expect(storageManager.getItem('real-object')).toEqual({ type: 'object' })
    expect(storageManager.getItem('number')).toBe(42)
    expect(storageManager.getItem('boolean')).toBe(true)
    expect(storageManager.getItem('null')).toBe(null)
    expect(storageManager.getItem('array-string')).toBe('[1,2,3]')
    expect(storageManager.getItem('real-array')).toEqual([1, 2, 3])
  })
})
