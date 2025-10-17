# 认证模块

## 概述

认证模块采用**统一持久化架构**设计，通过独立的持久化适配器作为唯一的存储访问点，让auth和userStore共享数据，实现真正的统一状态管理。

## 🏗️ 架构设计

### 统一持久化架构

```
┌─────────────────────────────────────────┐
│                组件层                    │
│  (通过 useUserStore 访问状态)            │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│                状态层                    │
│           (Store - Pinia)               │
│  - 用户信息状态                          │
│  - 认证状态                              │
│  - 权限状态                              │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│                业务层                    │
│            (Auth Module)                │
│  - 登录/登出逻辑                         │
│  - 权限检查逻辑                          │
│  - 令牌管理逻辑                          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│              持久化层                    │
│        (AuthPersistenceAdapter)         │
│  - 统一存储访问                          │
│  - 数据序列化                            │
│  - 状态恢复                              │
└─────────────────────────────────────────┘
```

## 🚀 快速开始

### 基本使用（推荐）

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
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleLogout = () => {
  auth.logout()
}
</script>
```

### 高级用法（按需导入）

```typescript
import { AuthService } from '@/core/auth'
import { localAuthPersistence } from '@/core/auth'

// 创建自定义认证服务
const customAuthService = new AuthService(localAuthPersistence)
```

## 📚 API参考

### Auth API

#### 认证操作

```typescript
// 用户登录
await auth.login(credentials: LoginCredentials): Promise<AuthResponse>

// 用户登出
auth.logout(): void

// 检查认证状态
auth.isAuthenticated(): boolean

// 检查认证状态（自动刷新令牌）
await auth.checkAuth(): Promise<boolean>
```

#### 权限管理

```typescript
// 检查权限
auth.hasPermission(permission: string): boolean

// 检查角色
auth.hasRole(role: string): boolean

// 获取用户信息
auth.getUser(): UserInfo | null
```

### UserStore API

#### 状态访问

```typescript
const userStore = useUserStore()

// 认证状态
userStore.isAuthenticated: boolean

// 用户信息
userStore.userInfo: {
  name: string
  permissions: string[]
  roles: string[]
  lastLoginTime?: number
}
```

#### 权限检查

```typescript
// 检查权限
userStore.hasPermission(permission: string): boolean

// 检查角色
userStore.hasRole(role: string): boolean
```

## 🎯 最佳实践

### 1. 状态管理

```typescript
// ✅ 推荐：通过Store访问状态
const userStore = useUserStore()
console.log(userStore.isAuthenticated)

// ❌ 避免：直接调用AuthService获取状态
console.log(authService.isAuthenticated())
```

### 2. 业务逻辑

```typescript
// ✅ 推荐：通过AuthService处理业务逻辑
await authService.login(credentials)

// ❌ 避免：直接操作Store
userStore.setUser(userData)
```

### 3. 权限控制

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

### 4. 路由守卫

```typescript
// router/index.ts
import { authService } from '@/core/auth'

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authService.checkAuth()
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
```

## 🔧 高级用法

### 自定义认证服务

```typescript
import { AuthService } from '@/core/auth'
import { createAuthBridge } from '@/core/store/modules/user/integrations'

// 创建自定义认证服务
const customAuthService = new AuthService(createAuthBridge(), {
  tokenKey: 'CUSTOM_TOKEN',
  refreshTokenKey: 'CUSTOM_REFRESH_TOKEN',
  userKey: 'CUSTOM_USER'
})
```

### 监听状态变化

```typescript
import { watch } from 'vue'
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

watch(
  () => userStore.isAuthenticated,
  (isAuthenticated) => {
    console.log('认证状态变化:', isAuthenticated)
  }
)
```

## 📊 架构优势

| 特性 | 分层架构 | 单一模块 |
|------|----------|----------|
| **职责分离** | ✅ 清晰 | ❌ 混乱 |
| **可测试性** | ✅ 高 | ❌ 低 |
| **可维护性** | ✅ 高 | ❌ 低 |
| **可扩展性** | ✅ 高 | ❌ 低 |
| **状态一致性** | ✅ 保证 | ❌ 可能冲突 |

## 📝 设计原则

1. **单一数据源**：Store作为唯一的状态管理
2. **职责分离**：AuthService专注业务逻辑，Store专注状态管理
3. **按需导入**：无需插件挂载，按需使用
4. **向后兼容**：保持原有API接口不变
5. **桥接解耦**：通过AuthBridge连接逻辑和状态

## 🔄 数据流

```
用户操作 → AuthService → AuthBridge → UserStore → 组件更新
    ↓           ↓           ↓          ↓
  业务逻辑    数据同步    状态管理    响应式更新
```

## 📖 相关文档

- [架构文档](./ARCHITECTURE.md) - 详细的架构设计说明
- [使用指南](./USAGE.md) - 完整的使用示例和最佳实践
- [类型定义](./types.ts) - 完整的TypeScript类型定义

## 🛠️ 故障排除

### 常见问题

1. **状态不同步**
   - 确保通过AuthService处理业务逻辑
   - 检查AuthBridge是否正确连接

2. **权限检查失败**
   - 确保用户信息包含正确的权限数据
   - 检查权限标识是否正确

3. **令牌过期问题**
   - 使用 `authService.checkAuth()` 自动处理令牌刷新
   - 监听认证事件处理令牌过期

### 调试技巧

```typescript
// 使用Vue DevTools查看Store状态
// Vue DevTools → Pinia → user store

// 监听状态变化
watch(() => userStore.isAuthenticated, (isAuthenticated) => {
  console.log('认证状态变化:', isAuthenticated)
})
```

## 更新日志

### v2.0.0
- 🏗️ 重构为分层架构设计
- 🔗 引入AuthBridge桥接模式
- 📦 支持按需导入，无需插件挂载
- 🔄 保持向后兼容的API接口
- 📚 完善文档和示例

### v1.0.0
- 初始版本
- 基础认证功能
- 权限管理
- 令牌管理
- 事件系统