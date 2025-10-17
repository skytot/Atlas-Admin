/**
 * 存储管理使用示例
 * 展示如何使用统一的存储管理功能
 */

import { storage, StorageManager } from '@/core/storage'

// ===== 基础使用示例 =====

// 1. 基础存储操作
export function basicStorageExample() {
  // 设置存储项
  storage.set('username', 'john_doe')
  storage.set('user-preferences', {
    theme: 'dark',
    language: 'zh-CN',
    notifications: true
  })

  // 获取存储项
  const username = storage.get('username')
  const preferences = storage.get('user-preferences')
  
  console.log('用户名:', username)
  console.log('用户偏好:', preferences)

  // 检查存储项是否存在
  const hasUsername = storage.has('username')
  console.log('是否有用户名:', hasUsername)

  // 删除存储项
  storage.remove('username')
}

// ===== 高级功能示例 =====

// 2. 存储变化监听
export function storageChangeExample() {
  // 监听所有存储变化
  const unsubscribe = storage.onChange((key, value, action) => {
    console.log(`存储项 "${key}" 发生了 "${action}" 操作`)
    console.log('新值:', value)
  })

  // 模拟存储变化
  storage.set('test-key', 'test-value')
  storage.remove('test-key')

  // 取消监听
  unsubscribe()
}

// 3. 过期时间管理
export function expiryExample() {
  // 设置带过期时间的存储项（5分钟后过期）
  storage.setWithExpiry('session-data', { userId: 123, sessionId: 'abc' }, 5)
  
  // 获取带过期检查的存储项
  const sessionData = storage.getWithExpiry('session-data')
  
  if (sessionData) {
    console.log('会话数据有效:', sessionData)
  } else {
    console.log('会话数据已过期或不存在')
  }
}

// ===== 自定义存储管理器示例 =====

// 4. 创建自定义存储管理器
export function customStorageExample() {
  // 创建带自定义前缀的存储管理器
  const appStorage = new StorageManager('MY_APP_', 'localStorage')
  
  // 使用自定义管理器
  appStorage.setItem('config', { version: '1.0.0' })
  const config = appStorage.getItem('config')
  
  console.log('应用配置:', config)
}

// ===== 实际应用场景示例 =====

// 5. 用户认证管理
export function authStorageExample() {
  // 登录时保存用户信息
  const loginUser = (userInfo: any) => {
    storage.set('user', userInfo, {
      type: 'localStorage',
      serialize: true
    })
    
    // 设置令牌过期时间（1小时）
    storage.setWithExpiry('token', userInfo.token, 60)
  }

  // 检查登录状态
  const checkAuth = () => {
    const token = storage.getWithExpiry('token')
    const user = storage.get('user')
    
    return !!(token && user)
  }

  // 登出时清除数据
  const logout = () => {
    storage.remove('user')
    storage.remove('token')
  }

  return { loginUser, checkAuth, logout }
}

// 6. 应用配置管理
export function configStorageExample() {
  interface AppConfig {
    theme: 'light' | 'dark'
    language: string
    fontSize: number
  }

  const defaultConfig: AppConfig = {
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14
  }

  // 保存配置
  const saveConfig = (config: Partial<AppConfig>) => {
    const currentConfig = getConfig()
    const newConfig = { ...currentConfig, ...config }
    
    storage.set('app-config', newConfig, {
      type: 'localStorage',
      serialize: true
    })
  }

  // 获取配置
  const getConfig = (): AppConfig => {
    return storage.get<AppConfig>('app-config', {
      type: 'localStorage',
      serialize: true,
      defaultValue: defaultConfig
    })
  }

  return { saveConfig, getConfig }
}

// 7. 缓存管理
export function cacheStorageExample() {
  // 设置缓存数据
  const setCache = (key: string, data: any, expiryMinutes: number = 30) => {
    storage.setWithExpiry(`cache_${key}`, {
      data,
      timestamp: Date.now()
    }, expiryMinutes)
  }

  // 获取缓存数据
  const getCache = (key: string) => {
    const cached = storage.getWithExpiry(`cache_${key}`)
    return cached?.data || null
  }

  // 清除过期缓存
  const clearExpiredCache = () => {
    const keys = storage.keys().filter(key => key.startsWith('cache_'))
    keys.forEach(key => {
      const cached = storage.getWithExpiry(key)
      if (!cached) {
        storage.remove(key)
      }
    })
  }

  return { setCache, getCache, clearExpiredCache }
}

// ===== 错误处理示例 =====

// 8. 存储错误处理
export function errorHandlingExample() {
  try {
    // 尝试存储大量数据
    const largeData = new Array(1000000).fill('data')
    storage.set('large-data', largeData)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('存储空间不足，清理旧数据')
      storage.clear()
      // 重新尝试存储
      storage.set('large-data', largeData)
    } else {
      console.error('存储操作失败:', error)
    }
  }
}

// ===== 类型安全示例 =====

// 9. 类型安全的存储操作
export function typeSafeExample() {
  interface UserProfile {
    id: number
    name: string
    email: string
    avatar?: string
  }

  // 类型安全的存储操作
  const saveUserProfile = (profile: UserProfile) => {
    storage.set('user-profile', profile, {
      type: 'localStorage',
      serialize: true
    })
  }

  const getUserProfile = (): UserProfile | null => {
    return storage.get<UserProfile>('user-profile', {
      type: 'localStorage',
      serialize: true,
      defaultValue: null
    })
  }

  return { saveUserProfile, getUserProfile }
}
