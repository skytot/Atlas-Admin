/* 统一存储模块类型定义 */

export type StorageType = 'localStorage' | 'sessionStorage'

export type StorageAction = 'set' | 'remove' | 'clear'

export interface StorageOptions {
  /** 存储类型，默认为 localStorage */
  type?: StorageType
  /** 是否自动序列化/反序列化 JSON 数据，默认为 true */
  serialize?: boolean
  /** 默认值 */
  defaultValue?: unknown
  /** 存储前缀，用于避免键名冲突 */
  prefix?: string
}

export interface StorageItem {
  key: string
  value: unknown
  timestamp: number
  type: StorageType
}

export type StorageChangeCallback = (key: string, value: unknown, action: StorageAction) => void
