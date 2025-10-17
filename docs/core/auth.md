---
head:
  - - link
    - rel: icon
    - type: image/x-icon
    - href: /favicon.ico
---

# 认证管理

认证管理模块采用**单一数据源架构**设计，作为唯一的用户状态数据源和持久化层，通过独立的持久化适配器实现统一状态管理。提供完整的用户认证功能，包括登录、登出、令牌管理、权限检查等。

## 模块概述

认证管理模块位于 `src/core/auth/` 目录下，作为**唯一数据源**，主要提供：
- 统一的认证接口
- 单一数据源管理
- 统一持久化存储
- 状态同步机制
- 令牌管理
- 用户信息管理
- 权限和角色检查
- 认证状态管理

### 模块结构

```
src/core/auth/
├── index.ts              # 主入口，统一认证API
├── persistence.ts         # 持久化适配器
├── auth-service.ts        # AuthService类（可选）
├── init.ts               # 初始化模块
├── types.ts              # 类型定义
├── README.md             # 使用文档
├── USAGE.md              # 使用指南
├── ARCHITECTURE.md       # 架构文档
└── MIGRATION.md          # 迁移指南
```

### 导入方式

```typescript
// 基本使用（推荐）
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

// 高级用法（按需导入）
import { AuthService, localAuthPersistence } from '@/core/auth'

// 导入类型定义
import type { UserInfo, LoginCredentials, AuthState } from '@/core/auth/types'
```

### 自动初始化

应用启动时会自动初始化认证系统，作为唯一数据源：

```typescript
// main.ts 中自动初始化
import { initAuth } from '@/core/auth/init'
// 系统自动初始化Auth模块作为数据源
// UserStore会自动从Auth获取状态
```

## 核心功能

### 单一数据源管理

#### `auth` 对象（唯一数据源）

```typescript
import { auth } from '@/core/auth'

// 检查认证状态
if (auth.isAuthenticated()) {
  console.log('用户已登录')
}

// 获取认证状态（唯一数据源）
const state = auth.getState()
console.log('认证状态:', state)

// Auth模块作为唯一数据源，所有状态变更都通过这里
auth.setToken('jwt-token')
auth.setUser(userInfo)
```

### 令牌管理

#### 基础令牌操作

```typescript
// 设置令牌
auth.setToken('jwt-token')

// 获取令牌
const token = auth.getToken()

// 检查令牌是否存在
if (auth.hasToken()) {
  console.log('令牌存在')
}

// 清除令牌
auth.clearToken()
```

#### 令牌过期管理

```typescript
// 设置带过期时间的令牌
auth.setTokenWithExpiry('jwt-token', 60) // 60分钟后过期

// 获取带过期检查的令牌
const token = auth.getTokenWithExpiry()
if (token) {
  console.log('令牌有效:', token)
} else {
  console.log('令牌已过期')
}

// 检查令牌是否过期
if (auth.isTokenExpired()) {
  console.log('令牌已过期')
}
```

### 用户信息管理

#### 用户信息操作

```typescript
// 设置用户信息
auth.setUser({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  permissions: ['read', 'write'],
  roles: ['user']
})

// 获取用户信息
const user = auth.getUser()
console.log('用户信息:', user)

// 清除用户信息
auth.clearUser()
```

#### 权限和角色检查

```typescript
// 检查用户权限
if (auth.hasPermission('admin')) {
  console.log('用户有管理员权限')
}

// 检查用户角色
if (auth.hasRole('user')) {
  console.log('用户是普通用户')
}

// 更新用户权限
auth.updatePermissions(['read', 'write', 'admin'])
```

### 认证操作

#### 登录

```typescript
// 用户登录（需要实现实际的登录 API）
try {
  const response = await auth.login({
    username: 'john',
    password: 'password',
    remember: true
  })
  
  console.log('登录成功:', response.user)
} catch (error) {
  console.error('登录失败:', error)
}
```

#### 登出

```typescript
// 用户登出
auth.logout()
console.log('用户已登出')
```

#### 令牌刷新

```typescript
// 刷新令牌（需要实现实际的刷新令牌 API）
try {
  const newToken = await auth.refreshToken()
  console.log('令牌刷新成功:', newToken)
} catch (error) {
  console.error('令牌刷新失败:', error)
}
```

#### 认证状态检查

```typescript
// 检查认证状态并自动刷新（依赖刷新令牌功能）
const isValid = await auth.checkAuth()
if (isValid) {
  console.log('认证有效')
} else {
  console.log('认证无效，需要重新登录')
}
```

### 事件监听

#### 认证事件监听

```typescript
// 监听认证事件
const unsubscribe = auth.onAuthEvent((eventType, data) => {
  switch (eventType) {
    case 'login-success':
      console.log('登录成功:', data.user)
      break
    case 'logout':
      console.log('用户登出')
      break
    case 'token-refreshed':
      console.log('令牌已刷新:', data.token)
      break
    case 'token-refresh-error':
      console.log('令牌刷新失败:', data.error)
      break
  }
})

// 取消监听
unsubscribe()
```

## 使用示例

### 完整的登录流程

```vue
<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      欢迎，{{ userStore.userInfo.name }}
    </div>
    <div v-else>
      请登录
    </div>
    
    <button @click="handleLogin">登录</button>
    <button @click="handleLogout">登出</button>
  </div>
</template>

<script setup>
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

const handleLogin = async () => {
  try {
    await auth.login({ 
      username: 'user', 
      password: 'password' 
    })
    // 状态会自动同步到UserStore
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleLogout = () => {
  auth.logout()
  // UserStore状态会自动清除
}
</script>
```

### 权限守卫

```typescript
// 路由守卫
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated) {
      // 检查权限
      if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
        next('/403') // 权限不足
        return
      }
      next()
    } else {
      next('/login') // 未登录
    }
  } else {
    next()
  }
})
```

### 组件权限控制

```vue
<template>
  <div>
    <!-- 基于权限显示内容 -->
    <div v-if="userStore.hasPermission('admin')">
      管理员功能
    </div>
    
    <!-- 基于角色显示内容 -->
    <div v-if="userStore.hasRole('editor')">
      编辑功能
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()
</script>
```

### 自动令牌刷新

```typescript
// 应用初始化时自动处理，无需手动设置
// 系统会自动检查认证状态并刷新令牌

// 如果需要手动检查认证状态
import { auth } from '@/core/auth'

const checkAuthStatus = async () => {
  const isValid = await auth.checkAuth()
  if (!isValid) {
    // 认证无效，系统会自动清除状态
    console.log('认证无效，需要重新登录')
  }
}
```

## 与状态管理集成

### 单一数据源架构

Auth模块作为唯一数据源，UserStore作为纯消费端：

#### 数据流向
```
Auth模块 (数据源) → AuthBridge (桥梁) → UserStore (消费端)
```

#### 状态同步机制

```vue
<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      欢迎，{{ userStore.userInfo.name }}
    </div>
  </div>
</template>

<script setup>
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

// 登录时状态会自动同步
const handleLogin = async () => {
  await auth.login(credentials)
  // UserStore状态会自动更新
}
</script>
```

### 手动状态同步（高级用法）

```typescript
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

// 从Auth模块恢复状态
userStore.restoreFromAuth()

// 设置用户信息并同步到Auth
userStore.setUserAndSync(userData)

// 登出并清除状态
userStore.logoutAndClear()
```

## 最佳实践

### 1. 错误处理

```typescript
// 统一的错误处理
try {
  await auth.login(credentials)
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    // 处理凭据错误
  } else if (error.message.includes('Network error')) {
    // 处理网络错误
  } else {
    // 处理其他错误
  }
}
```

### 2. 状态管理最佳实践

```typescript
// 推荐：使用UserStore访问状态
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

// 检查认证状态
if (userStore.isAuthenticated) {
  // 用户已登录
}

// 检查权限
if (userStore.hasPermission('admin')) {
  // 有管理员权限
}
```

### 3. 类型安全

```typescript
// 使用类型安全的接口
interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

const login = async (form: LoginForm) => {
  return auth.login(form)
}
```

### 4. 安全考虑

```typescript
// 敏感操作前检查认证状态
const performSensitiveAction = async () => {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    throw new Error('需要登录')
  }

  // 检查权限
  if (!userStore.hasPermission('sensitive-action')) {
    throw new Error('权限不足')
  }

  // 执行敏感操作
}
```

## 常见问题

### Q: 如何处理令牌过期？
A: 系统会自动处理令牌过期，使用 `auth.checkAuth()` 方法会自动检查并刷新令牌。

### Q: 如何实现记住登录状态？
A: 系统使用统一的持久化适配器自动处理，无需手动设置。

### Q: 如何实现自动登出？
A: 系统会自动处理令牌刷新失败的情况，无需手动监听事件。

### Q: 如何访问用户状态？
A: 推荐使用 `useUserStore()` 访问响应式状态，而不是直接使用 `auth` 对象。

### Q: 如何自定义认证服务？
A: 可以使用 `AuthService` 类和 `localAuthPersistence` 创建自定义认证服务。


## 相关模块

- [存储管理](./storage.md) - 底层存储管理
- [状态管理](./store.md) - 全局状态管理
- [路由管理](./router.md) - 路由守卫和权限控制