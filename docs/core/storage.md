# 存储管理

存储管理模块提供统一的本地存储管理功能，支持 localStorage 和 sessionStorage，并提供了丰富的存储操作和监听功能。

## 模块概述

存储管理模块位于 `src/core/storage/` 目录下，主要提供：
- 统一的存储接口
- 自动序列化/反序列化
- 存储变化监听
- 过期时间管理
- 存储项信息追踪

### 模块结构

```
src/core/storage/
├── index.ts            # 模块入口，仅暴露 storage 与 StorageManager
├── storage-manager.ts  # 核心实现，依赖浏览器 Storage API
├── types.ts            # 类型定义
└── example.ts          # 使用示例
```

> TODO：如需支持 SSR，需要在外部注入 Storage 实例，避免直接依赖 `window`

## 核心功能

### 基础存储操作

#### 设置存储项

```typescript
import { storage } from '@/core/storage'

// 基础设置
storage.set('key', 'value')

// 带选项的设置
storage.set('user', { name: 'John', age: 30 }, {
  type: 'localStorage',    // 存储类型
  serialize: true,         // 是否序列化
  prefix: 'APP_'          // 键名前缀
})
```

#### 获取存储项

```typescript
// 基础获取
const value = storage.get('key')

// 带类型和默认值的获取
const user = storage.get<User>('user', {
  type: 'localStorage',
  defaultValue: null
})
```

#### 删除存储项

```typescript
// 删除单个项
storage.remove('key')

// 清空所有存储
storage.clear()
```

### 高级功能

#### 存储变化监听

```typescript
// 监听存储变化
const unsubscribe = storage.onChange((key, value, action) => {
  console.log(`存储项 ${key} 发生了 ${action} 操作，新值为:`, value)
})

// 取消监听
unsubscribe()
```

#### 过期时间管理

```typescript
// 设置带过期时间的存储项
storage.setWithExpiry('token', 'abc123', 30) // 30分钟后过期

// 获取带过期检查的存储项
const token = storage.getWithExpiry('token')
if (token === null) {
  console.log('令牌已过期')
}
```

#### 存储项信息查询

```typescript
// 检查存储项是否存在
const exists = storage.has('key')

// 获取所有键名
const keys = storage.keys()

// 获取存储项详细信息
const info = storage.getItemInfo('key')
console.log('存储时间:', new Date(info.timestamp))
```

## 使用示例

### 用户认证管理

```typescript
import { storage } from '@/core/storage'

// 登录时保存用户信息
function login(userInfo: UserInfo) {
  storage.set('user', userInfo, {
    type: 'localStorage',
    serialize: true
  })
  
  // 设置令牌过期时间
  storage.setWithExpiry('token', userInfo.token, 60) // 1小时
}

// 检查登录状态
function checkAuth(): boolean {
  const token = storage.getWithExpiry('token')
  const user = storage.get('user')
  
  return !!(token && user)
}

// 登出时清除数据
function logout() {
  storage.remove('user')
  storage.remove('token')
}
```

### 应用配置管理

```typescript
// 保存用户偏好设置
function saveUserPreferences(preferences: UserPreferences) {
  storage.set('preferences', preferences, {
    type: 'localStorage',
    serialize: true
  })
}

// 获取用户偏好设置
function getUserPreferences(): UserPreferences {
  return storage.get('preferences', {
    type: 'localStorage',
    defaultValue: getDefaultPreferences()
  })
}
```

### 会话数据管理

```typescript
// 临时数据使用 sessionStorage
function setTempData(data: any) {
  storage.set('temp', data, {
    type: 'sessionStorage',
    serialize: true
  })
}

// 页面刷新后数据仍然存在，但关闭标签页后清除
const tempData = storage.get('temp', {
  type: 'sessionStorage'
})
```

## 存储管理器类

### StorageManager

如果需要更精细的控制，可以直接使用 `StorageManager` 类：

```typescript
import { StorageManager } from '@/core/storage'

// 创建自定义存储管理器
const customStorage = new StorageManager('MY_APP_', 'localStorage')

// 使用自定义管理器
customStorage.setItem('config', { theme: 'dark' })
const config = customStorage.getItem('config')
```

### 存储选项

```typescript
interface StorageOptions {
  type?: 'localStorage' | 'sessionStorage'  // 存储类型
  serialize?: boolean                       // 是否序列化
  defaultValue?: any                        // 默认值
  prefix?: string                          // 键名前缀
}
```

## 最佳实践

### 1. 键名管理

```typescript
// 使用常量管理键名
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  PREFERENCES: 'preferences',
  CACHE: 'cache'
} as const

// 使用常量
storage.set(STORAGE_KEYS.USER, userData)
```

### 2. 类型安全

```typescript
// 定义存储数据类型
interface UserData {
  name: string
  email: string
  permissions: string[]
}

// 使用类型安全的获取
const user = storage.get<UserData>('user', {
  defaultValue: { name: '', email: '', permissions: [] }
})
```

### 3. 错误处理

```typescript
try {
  const data = storage.get('important-data')
  if (!data) {
    throw new Error('重要数据不存在')
  }
} catch (error) {
  console.error('存储操作失败:', error)
  // 处理错误情况
}
```

### 4. 存储监听

```typescript
// 在应用初始化时设置监听
const unsubscribe = storage.onChange((key, value, action) => {
  if (key === 'user' && action === 'remove') {
    // 用户数据被清除，跳转到登录页
    router.push('/login')
  }
})

// 在组件销毁时取消监听
onUnmounted(() => {
  unsubscribe()
})
```

## 与现有模块集成

### 统一认证管理

现在推荐使用统一的 `auth` 对象进行认证管理：

```typescript
import { auth } from '@/core/auth'

// 登录
await auth.login({
  username: 'john',
  password: 'password',
  remember: true
})

// 检查认证状态
if (auth.isAuthenticated()) {
  console.log('用户已登录')
}

// 获取用户信息
const user = auth.getUser()
const token = auth.getToken()

// 检查权限
if (auth.hasPermission('admin')) {
  console.log('用户有管理员权限')
}

// 登出
auth.logout()
```

### 认证管理集成

认证功能已完全集成到 `auth` 对象中：

```typescript
import { auth } from '@/core/auth'

// 所有认证操作都通过 auth 对象
auth.setToken('new-token')
const token = auth.getToken()
auth.clearToken()

// 完整的认证流程
await auth.login({ username: 'john', password: 'password' })
if (auth.isAuthenticated()) {
  const user = auth.getUser()
  const permissions = auth.hasPermission('admin')
}
auth.logout()
```

### 状态管理集成

用户状态管理已集成 `auth` 对象：

```typescript
import { useUserStore } from '@/core/store/modules/user.store'

const userStore = useUserStore()

// 初始化用户状态（从 auth 对象同步）
await userStore.initialize()

// 设置用户信息（自动同步到 auth 对象）
userStore.setUser({
  name: 'John',
  token: 'abc123',
  permissions: ['read', 'write']
})

// 检查权限（使用 auth 对象）
if (userStore.hasPermission('admin')) {
  console.log('用户有管理员权限')
}
```

## 常见问题

### Q: 如何选择 localStorage 还是 sessionStorage？
A: 
- localStorage：数据持久化，关闭浏览器后仍然保留
- sessionStorage：会话级别，关闭标签页后清除

### Q: 如何处理存储空间不足？
A: 存储管理器会自动捕获错误，建议实现错误处理逻辑：

```typescript
try {
  storage.set('large-data', data)
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // 存储空间不足，清理旧数据
    storage.clear()
    storage.set('large-data', data)
  }
}
```

### Q: 如何实现存储数据加密？
A: 可以在存储前加密，获取后解密：

```typescript
function setEncryptedData(key: string, data: any) {
  const encrypted = encrypt(JSON.stringify(data))
  storage.set(key, encrypted, { serialize: false })
}

function getEncryptedData(key: string) {
  const encrypted = storage.get(key, { serialize: false })
  return encrypted ? JSON.parse(decrypt(encrypted)) : null
}
```

## 相关模块

- [认证管理](./auth.md) - 令牌和认证状态管理
- [状态管理](./store.md) - 全局状态管理
- [配置管理](./config.md) - 应用配置管理
