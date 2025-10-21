# 用户 Store 模块

## 🎯 设计理念

全新的用户 Store 模块，专注于**响应式状态管理**，确保架构清晰、准确、响应式。

## 📋 核心特性

- ✅ **纯响应式** - 只做状态管理，不做数据修改
- ✅ **自动同步** - 自动同步 Auth 模块状态变化
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **性能优化** - 最小化重渲染和内存使用
- ✅ **易于使用** - 简洁的 API 设计

## 🏗️ 架构设计

```
Auth 模块 (数据源)
    ↓
User Store (响应式状态)
    ↓
Vue 组件 (UI 展示)
```

### 职责分工

- **Auth 模块** - 数据修改和持久化
- **User Store** - 响应式状态管理
- **Vue 组件** - UI 展示和用户交互

## 📦 模块结构

```
user/
├── types.ts          # 类型定义
├── user.store.ts     # Store 实现
├── useAuth.ts        # 组合式函数
├── index.ts          # 模块导出
├── examples.ts       # 使用示例
├── test-store.ts     # 测试文件
└── README.md         # 文档
```

## 🚀 快速开始

### 1. 使用 Store

```typescript
import { useUserStore } from '@/core/store'

export default {
  setup() {
    const userStore = useUserStore()
    
    // 启动认证同步
    const unsubscribe = userStore.startAuthSync()
    
    return {
      user: computed(() => userStore.user),
      isAuthenticated: computed(() => userStore.isAuthenticated),
      displayName: computed(() => userStore.displayName),
      hasPermission: userStore.hasPermission,
      
      onUnmounted: unsubscribe
    }
  }
}
```

### 2. 使用组合式函数

```typescript
import { useAuth } from '@/core/store'

export default {
  setup() {
    const { state, displayName, hasPermission, login, logout } = useAuth()
    
    return {
      user: computed(() => state.value.user),
      displayName,
      hasPermission,
      login,
      logout
    }
  }
}
```

## 📚 API 参考

### Store API

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `syncFromAuth()` | 从 Auth 模块同步状态 | `void` |
| `startAuthSync()` | 启动认证状态同步 | `() => void` |
| `refresh()` | 强制刷新状态 | `Promise<void>` |
| `setLoading(loading)` | 设置加载状态 | `void` |
| `setError(error)` | 设置错误信息 | `void` |

### Getters

| 属性 | 描述 | 类型 |
|------|------|------|
| `user` | 用户信息 | `UserInfo \| null` |
| `isAuthenticated` | 认证状态 | `boolean` |
| `displayName` | 显示名称 | `string` |
| `permissions` | 权限列表 | `string[]` |
| `roles` | 角色列表 | `string[]` |
| `hasPermission(permission)` | 权限检查 | `boolean` |
| `hasRole(role)` | 角色检查 | `boolean` |

### 组合式函数 API

| 函数 | 描述 | 返回值 |
|------|------|--------|
| `useAuth()` | 完整认证功能 | `AuthComposable` |
| `useAuthState()` | 只读认证状态 | `AuthStateComposable` |

## 🔄 数据流向

```
用户操作 → Auth 模块 → 事件通知 → User Store → Vue 组件
```

1. 用户在组件中调用认证操作
2. Auth 模块处理数据修改
3. Auth 模块触发事件通知
4. User Store 监听事件并更新状态
5. Vue 组件响应式更新

### 自动同步机制

- **组合式函数** - 自动管理生命周期，无需手动调用
- **Store 直接使用** - 需要手动调用 `startAuthSync()` 和清理函数
- **测试环境** - 需要手动调用 `syncFromAuth()` 确保状态同步

## ⚡ 性能优化

- **最小化重渲染** - 只更新必要的状态
- **事件驱动** - 避免轮询和定时器
- **内存优化** - 及时清理事件监听器
- **类型安全** - 编译时错误检查

## 🧪 测试

```typescript
import { runAllTests } from './test-store'

// 运行所有测试
runAllTests()
```

## 📝 最佳实践

### 1. 生命周期管理

#### 使用组合式函数（推荐）
```typescript
export default {
  setup() {
    const { state, login, logout } = useAuth()
    // 自动管理生命周期，无需手动调用
    
    return {
      user: computed(() => state.value.user),
      isAuthenticated: computed(() => state.value.isAuthenticated),
      login,
      logout
    }
  }
}
```

#### 使用 Store 直接调用
```typescript
export default {
  setup() {
    const userStore = useUserStore()
    const unsubscribe = userStore.startAuthSync()
    
    onUnmounted(() => {
      unsubscribe()
    })
    
    return {
      user: computed(() => userStore.user),
      isAuthenticated: computed(() => userStore.isAuthenticated)
    }
  }
}
```

### 2. 错误处理

```typescript
const { state, login } = useAuth()

const handleLogin = async (credentials) => {
  try {
    await login(credentials)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 3. 权限控制

```typescript
const { hasPermission } = useAuthState()

const canEdit = computed(() => hasPermission('edit'))
const canDelete = computed(() => hasPermission('delete'))
```

## 🔧 配置选项

```typescript
import { createUserStore } from '@/core/store'

// 创建自定义配置的 Store
const userStore = createUserStore({
  autoSync: true,        // 自动同步
  syncInterval: 60000   // 同步间隔（毫秒）
})

// 使用 Store
const unsubscribe = userStore.startAuthSync()

// 清理资源
onUnmounted(() => {
  unsubscribe()
})
```

## 🧪 测试环境

在测试环境中，需要手动触发同步：

```typescript
// 测试示例
it('测试认证状态', () => {
  const userStore = useUserStore()
  
  // 设置认证状态
  auth.setUser(userInfo)
  
  // 手动触发同步
  userStore.syncFromAuth()
  
  // 验证结果
  expect(userStore.user).toBeTruthy()
})
```

## 🎯 总结

新的 Store 模块提供了：

- **清晰的职责分工** - Store 只做响应式状态管理
- **简化的 API** - 易于理解和使用
- **高性能** - 优化的响应式更新
- **类型安全** - 完整的 TypeScript 支持

这个设计确保了架构的清晰性、准确性和响应式特性。
