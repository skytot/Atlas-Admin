# Auth模块使用指南

## 🚀 快速开始

### 基本使用

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

#### 令牌管理

```typescript
// 获取令牌
authService.getToken(): string | null

// 检查令牌是否过期
authService.isTokenExpired(token?: string): boolean

// 刷新令牌
await authService.refreshToken(): Promise<string>
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

## 🔧 高级用法

### 权限控制组件

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

### 路由守卫

```typescript
// router/index.ts
import { authService } from '@/core/auth'

router.beforeEach(async (to, from, next) => {
  // 检查认证状态
  const isAuthenticated = await authService.checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

### 权限守卫

```typescript
// router/index.ts
import { useUserStore } from '@/core/store/modules/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查权限
  if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
    next('/403')
  } else {
    next()
  }
})
```

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

// 使用自定义服务
await customAuthService.login(credentials)
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

### 3. 权限检查

```typescript
// ✅ 推荐：在模板中使用Store
<template>
  <div v-if="userStore.hasPermission('admin')">
    管理员功能
  </div>
</template>

// ✅ 推荐：在逻辑中使用AuthService
if (authService.hasPermission('admin')) {
  // 执行管理员操作
}
```

### 4. 错误处理

```typescript
try {
  await authService.login(credentials)
} catch (error) {
  // 处理登录错误
  console.error('登录失败:', error)
}
```

## 🔄 数据流示例

```typescript
// 1. 用户登录
await authService.login(credentials)
    ↓
// 2. AuthService调用AuthBridge
authBridge.syncUser(userData)
    ↓
// 3. AuthBridge更新Store状态
userStore.setUser(userData)
    ↓
// 4. Store状态变化，组件自动更新
userStore.isAuthenticated // true
```

## 🛠️ 调试技巧

### 1. 使用Vue DevTools

```typescript
// 在浏览器中查看Store状态
// Vue DevTools → Pinia → user store
```

### 2. 监听状态变化

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

### 3. 调试认证流程

```typescript
// 在AuthService中添加日志
console.log('登录请求:', credentials)
console.log('登录响应:', response)
console.log('状态更新:', userStore.userInfo)
```

## 📝 常见问题

### Q: 如何自定义认证API？

A: 继承AuthService类并重写API方法：

```typescript
class CustomAuthService extends AuthService {
  protected async callLoginAPI(credentials: LoginCredentials) {
    // 自定义登录API调用
    return await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }).then(res => res.json())
  }
}
```

### Q: 如何处理令牌过期？

A: 使用checkAuth方法自动处理：

```typescript
// 在应用启动时检查认证状态
await authService.checkAuth()
```

### Q: 如何实现单点登录？

A: 在AuthService中添加单点登录逻辑：

```typescript
// 检查其他标签页的认证状态
window.addEventListener('storage', (e) => {
  if (e.key === 'AUTH_TOKEN') {
    // 同步认证状态
    authService.checkAuth()
  }
})
```
