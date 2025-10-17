/**
 * 统一存储管理模块。
 * 提供 localStorage、sessionStorage 的统一管理接口
 */

import type {
  StorageAction,
  StorageChangeCallback,
  StorageItem,
  StorageOptions,
  StorageType
} from './types'

/**
 * 统一存储管理器。
 */
export class StorageManager {
  private prefix: string
  private storage: Storage

  constructor(prefix: string = 'VE_', type: StorageType = 'localStorage') {
    if (!isNonEmptyString(prefix)) {
      throw new StorageError('存储前缀必须为非空字符串', '[config]')
    }

    if (!isSupportedStorageType(type)) {
      throw new StorageError('不支持的存储类型', '[config]')
    }

    this.prefix = prefix
    this.storage = type === 'localStorage' ? localStorage : sessionStorage
  }

  /**
   * 获取完整的键名。
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * 智能序列化：根据选项和数据类型决定存储格式
   * @param value 要存储的值
   * @param options 存储选项
   * @returns 序列化后的字符串
   */
  private serializeValue(value: unknown, options: StorageOptions): string {
    // 如果明确指定不序列化，直接转换为字符串（不添加标识符，保持向后兼容）
    if (options.serialize === false) {
      return ensureString(value)
    }

    // 如果明确指定序列化，使用 StorageItem 格式
    if (options.serialize === true) {
      const storageItem: StorageItem = {
        key: this.getFullKey(''), // 临时键名，实际使用时会替换
        value,
        timestamp: Date.now(),
        type: options.type || 'localStorage'
      }
      return `__SERIALIZED__${JSON.stringify(storageItem)}`
    }

    // 智能判断：根据数据类型决定序列化方式
    if (typeof value === 'string') {
      // 字符串直接存储，添加原始数据标识
      return `__RAW__${value}`
    }

    if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
      // 基本类型直接存储，添加原始数据标识和类型信息
      return `__RAW__${String(value)}__TYPE__${typeof value}`
    }

    // 对象和数组使用序列化格式
    const storageItem: StorageItem = {
      key: this.getFullKey(''), // 临时键名，实际使用时会替换
      value,
      timestamp: Date.now(),
      type: options.type || 'localStorage'
    }
    return `__SERIALIZED__${JSON.stringify(storageItem)}`
  }

  /**
   * 智能反序列化：根据数据标识符自动判断处理方式
   * @param rawValue 原始存储值
   * @param options 存储选项
   * @returns 反序列化后的值
   */
  private deserializeValue<T>(rawValue: string, options: StorageOptions): T | null {
    // 如果明确指定不序列化，直接返回原始值（不处理标识符）
    if (options.serialize === false) {
      return rawValue as unknown as T
    }

    // 检查数据标识符
    if (rawValue.startsWith('__RAW__')) {
      // 原始数据格式，处理类型信息
      const value = rawValue.substring(7) // 移除 '__RAW__' 前缀
      
      // 只有在用户明确指定类型转换时才进行转换
      // 对于 JSON-like 字符串，保持原始字符串格式
      if (options.serialize === false) {
        // 用户明确指定不序列化，保持原始字符串
        return value as T
      }
      
      // 检查是否有类型信息
      const typeMatch = value.match(/^(.+)__TYPE__(.+)$/)
      if (typeMatch) {
        const [, actualValue, type] = typeMatch
        // 根据存储时的类型信息进行转换
        if (type === 'number') {
          return Number(actualValue) as T
        }
        if (type === 'boolean') {
          return (actualValue === 'true') as T
        }
        if (type === 'object' && actualValue === 'null') {
          return null as T
        }
      }
      
      // 默认返回字符串（包括 JSON-like 字符串）
      return value as T
    }

    if (rawValue.startsWith('__SERIALIZED__')) {
      // 序列化数据格式，解析 JSON
      const jsonStr = rawValue.substring(14) // 移除 '__SERIALIZED__' 前缀
      const parsedValue = safeJsonParse(jsonStr)
      
      if (parsedValue === undefined) {
        return rawValue as unknown as T
      }

      if (isStorageItem(parsedValue)) {
        return resolveNullableValue<T>(parsedValue.value, options.defaultValue)
      }

      return parsedValue as T
    }

    // 兼容旧数据：尝试 JSON 解析
    const parsedValue = safeJsonParse(rawValue)
    if (parsedValue !== undefined) {
      if (isStorageItem(parsedValue)) {
        return resolveNullableValue<T>(parsedValue.value, options.defaultValue)
      }
      return parsedValue as T
    }

    // 如果解析失败，按原始数据处理
    return rawValue as unknown as T
  }

  /**
   * 设置存储项。
   * @param {string} key 存储键名
   * @param {unknown} value 存储值
   * @param {StorageOptions} [options] 存储选项
   */
  setItem(key: string, value: unknown, options: StorageOptions = {}): void {
    this.ensureValidKey(key)
    this.ensureValidOptions(key, options)

    try {
      const fullKey = this.getFullKey(key)
      const storageItem: StorageItem = {
        key: fullKey,
        value,
        timestamp: Date.now(),
        type: options.type || 'localStorage'
      }

      // 智能序列化：根据选项和数据类型决定存储格式
      const serializedValue = this.serializeValue(value, options)

      this.storage.setItem(fullKey, serializedValue)

      // 触发自定义事件
      this.dispatchStorageEvent(key, value, 'set')
    } catch (error) {
      throw new StorageError('存储设置失败', key, error)
    }
  }

  /**
   * 获取存储项。
   * @param {string} key 存储键名
   * @param {StorageOptions} [options] 存储选项
   * @returns {T | null} 存储值或默认值
   */
  getItem<T = unknown>(key: string, options: StorageOptions = {}): T | null {
    this.ensureValidKey(key)
    this.ensureValidOptions(key, options)

    try {
      const fullKey = this.getFullKey(key)
      const rawValue = this.storage.getItem(fullKey)

      if (rawValue === null) {
        return resolveDefaultOrNull<T>(options.defaultValue)
      }

      // 智能反序列化：根据数据标识符自动判断处理方式
      return this.deserializeValue<T>(rawValue, options)
    } catch (error) {
      throw new StorageError('存储获取失败', key, error)
    }
  }

  /**
   * 删除存储项。
   * @param {string} key 存储键名
   */
  removeItem(key: string): void {
    this.ensureValidKey(key)

    try {
      const fullKey = this.getFullKey(key)
      // 获取原始值用于事件触发，不进行 JSON 解析
      const rawValue = this.storage.getItem(fullKey)
      this.storage.removeItem(fullKey)

      // 触发自定义事件
      this.dispatchStorageEvent(key, rawValue, 'remove')
    } catch (error) {
      throw new StorageError('存储删除失败', key, error)
    }
  }

  /**
   * 清空所有带前缀的存储项。
   */
  clear(): void {
    try {
      // 使用正确的方法遍历 localStorage/sessionStorage
      const keys: string[] = []
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keys.push(key)
        }
      }
      
      keys.forEach(key => {
        this.storage.removeItem(key)
      })

      // 触发清空事件
      this.dispatchStorageEvent('*', null, 'clear')
    } catch (error) {
      throw new StorageError('存储清空失败', '*', error)
    }
  }

  /**
   * 检查存储项是否存在。
   * @param {string} key 存储键名
   * @returns {boolean} 是否存在
   */
  hasItem(key: string): boolean {
    this.ensureValidKey(key)

    const fullKey = this.getFullKey(key)
    return this.storage.getItem(fullKey) !== null
  }

  /**
   * 获取所有存储项的键名。
   * @returns {string[]} 键名列表
   */
  getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length))
      }
    }
    return keys
  }

  /**
   * 获取存储项信息。
   * @param {string} key 存储键名
   * @returns {StorageItem | null} 存储详情
   */
  getItemInfo(key: string): StorageItem | null {
    this.ensureValidKey(key)

    try {
      const fullKey = this.getFullKey(key)
      const item = this.storage.getItem(fullKey)

      if (!item) return null

      const storageItem: StorageItem = JSON.parse(item)
      return storageItem.timestamp ? storageItem : null
    } catch (error) {
      throw new StorageError('存储信息获取失败', key, error)
    }
  }

  /**
   * 监听存储变化。
   * @param {StorageChangeCallback} callback 变化回调
   * @returns {() => void} 取消监听函数
   */
  onStorageChange(callback: StorageChangeCallback): () => void {
    const handler = (
      event: CustomEvent<{ key: string; value: unknown; action: StorageAction }>
    ) => {
      const { key, value, action } = event.detail
      callback(key, value, action)
    }

    window.addEventListener('ve-storage-change', handler as EventListener)

    // 返回取消监听的函数
    return () => {
      window.removeEventListener('ve-storage-change', handler as EventListener)
    }
  }

  /**
   * 触发存储变化事件。
   * @param {string} key 存储键名
   * @param {unknown} value 存储值
   * @param {StorageAction} action 变化动作
   */
  private dispatchStorageEvent(key: string, value: unknown, action: StorageAction): void {
    const event = new CustomEvent<{ key: string; value: unknown; action: StorageAction }>(
      've-storage-change',
      {
        detail: { key, value, action }
      }
    )
    window.dispatchEvent(event)
  }

  /**
   * 设置带过期时间的存储项。
   * @param {string} key 存储键名
   * @param {unknown} value 存储值
   * @param {number} expiryMinutes 过期时间（分钟）
   * @param {StorageOptions} [options] 存储选项
   */
  setItemWithExpiry(
    key: string,
    value: unknown,
    expiryMinutes: number,
    options: StorageOptions = {}
  ): void {
    this.ensureValidKey(key)
    this.ensurePositiveExpiry(expiryMinutes, key)
    this.ensureValidOptions(key, options)

    const expiryTime = Date.now() + expiryMinutes * 60 * 1000
    const itemWithExpiry = {
      value,
      expiry: expiryTime
    }

    this.setItem(key, itemWithExpiry, options)
  }

  /**
   * 获取带过期时间的存储项。
   * @param {string} key 存储键名
   * @param {StorageOptions} [options] 存储选项
   * @returns {T | null} 检查过期后的值
   */
  getItemWithExpiry<T = unknown>(key: string, options: StorageOptions = {}): T | null {
    this.ensureValidKey(key)
    this.ensureValidOptions(key, options)

    const item = this.getItem<{ value: T; expiry: number } | T>(key, options)

    if (item === null) {
      return resolveDefaultOrNull<T>(options.defaultValue)
    }

    if (!isExpiryWrapper<T>(item)) {
      return item as T
    }

    if (Date.now() > item.expiry) {
      this.removeItem(key)
      return resolveDefaultOrNull<T>(options.defaultValue)
    }

    return resolveNullableValue<T>(item.value, options.defaultValue)
  }

  private ensureValidKey(key: string): void {
    if (!isNonEmptyString(key)) {
      throw new StorageError('存储键必须为非空字符串', key)
    }
  }

  private ensurePositiveExpiry(expiryMinutes: number, key: string): void {
    if (!Number.isFinite(expiryMinutes) || expiryMinutes <= 0) {
      throw new StorageError('过期时间必须为大于 0 的有限数字', key)
    }
  }

  private ensureValidOptions(key: string, options: StorageOptions): void {
    if (options === null || typeof options !== 'object') {
      throw new StorageError('存储选项必须为对象', key)
    }

    if (options.prefix !== undefined && !isNonEmptyString(options.prefix)) {
      throw new StorageError('存储选项中的前缀必须为非空字符串', key)
    }

    if (options.type !== undefined && !isSupportedStorageType(options.type)) {
      throw new StorageError('存储选项中的类型不受支持', key)
    }
  }
}

function isStorageItem(value: unknown): value is StorageItem {
  return Boolean(value && typeof value === 'object' && 'timestamp' in value && 'value' in value)
}

function isExpiryWrapper<T>(value: unknown): value is { value: T; expiry: number } {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'value' in value &&
      'expiry' in value &&
      typeof (value as { expiry: unknown }).expiry === 'number'
  )
}

function resolveDefaultOrNull<T>(defaultValue: unknown): T | null {
  return defaultValue === undefined || defaultValue === null ? null : (defaultValue as T)
}

function resolveNullableValue<T>(value: unknown, defaultValue: unknown): T | null {
  if (value === undefined || value === null) {
    return resolveDefaultOrNull<T>(defaultValue)
  }

  return value as T
}

function safeJsonParse(value: string): unknown | undefined {
  try {
    return JSON.parse(value) as unknown
  } catch (error) {
    console.warn('存储数据解析失败，返回原始值:', error)
    return undefined
  }
}

function ensureString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return '[object Object]'
    }
  }

  return String(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isSupportedStorageType(value: unknown): value is StorageType {
  return value === 'localStorage' || value === 'sessionStorage'
}

// 创建默认实例
export const storageManager = new StorageManager()

// 创建便捷的全局方法
export const storage = {
  /**
   * 设置存储项。
   */
  set: (key: string, value: unknown, options?: StorageOptions): void => {
    storageManager.setItem(key, value, options)
  },

  /**
   * 获取存储项。
   */
  get: <T = unknown>(key: string, options?: StorageOptions): T | null => {
    return storageManager.getItem<T>(key, options)
  },

  /**
   * 删除存储项。
   */
  remove: (key: string): void => {
    storageManager.removeItem(key)
  },

  /**
   * 清空存储。
   */
  clear: (): void => {
    storageManager.clear()
  },

  /**
   * 检查存储项是否存在。
   */
  has: (key: string): boolean => {
    return storageManager.hasItem(key)
  },

  /**
   * 获取所有键名。
   */
  keys: (): string[] => {
    return storageManager.getAllKeys()
  },

  /**
   * 监听存储变化。
   */
  onChange: (callback: StorageChangeCallback): (() => void) => {
    return storageManager.onStorageChange(callback)
  },

  /**
   * 设置带过期时间的存储项。
   */
  setWithExpiry: (
    key: string,
    value: unknown,
    expiryMinutes: number,
    options?: StorageOptions
  ): void => {
    return storageManager.setItemWithExpiry(key, value, expiryMinutes, options)
  },

  /**
   * 获取带过期检查的存储项。
   */
  getWithExpiry: <T = unknown>(key: string, options?: StorageOptions): T | null => {
    return storageManager.getItemWithExpiry<T>(key, options)
  }
}

class StorageError extends Error {
  constructor(message: string, public readonly key: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'StorageError'
  }
}
