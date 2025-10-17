# 状态管理

状态管理模块基于Pinia，采用单一数据源架构，UserStore作为纯消费端，从Auth模块获取状态数据。

## 模块概述

状态管理模块位于 `src/core/store/` 目录下，主要提供：
- 用户状态管理（`useUserStore`）- 纯消费端
- 全局应用状态装配（`setupStore` 与 Pinia 实例管理）
- 从Auth模块获取状态数据
- 响应式状态展示
- 不独立存储数据

## 核心功能

### 用户状态管理

#### `useUserStore`
用户相关的状态管理，作为纯消费端从Auth模块获取数据。

```vue
<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      欢迎，{{ userStore.userInfo.name }}
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()
</script>
```

**状态结构：**
- `name`: 用户名称
- `token`: 认证令牌
- `permissions`: 用户权限列表
- `roles`: 用户角色列表
- `lastLoginTime`: 最后登录时间

## 使用示例

### 基础状态操作

```vue
<template>
  <div>
    <div v-if="userStore.isAuthenticated">
      用户：{{ userStore.userInfo.name }}
    </div>
    <div v-else>
      未登录
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

// 状态会自动从认证模块同步，无需手动设置
</script>
```

### 单一数据源架构

UserStore作为纯消费端，从Auth模块获取状态：

#### 数据流向
```
Auth模块 (唯一数据源) → AuthBridge (桥梁) → UserStore (消费端)
```

#### 状态获取机制

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
  await auth.login(credentials)
  // UserStore状态会自动更新
}

const handleLogout = () => {
  auth.logout()
  // UserStore状态会自动清除
}
</script>
```

### 状态持久化

```typescript
// 使用内置适配器为 user store 启用可配置持久化
import {
  createUserStore,
  createUserPersistenceAdapter
} from '@/core/store'

export const usePersistentUserStore = createUserStore({
  persistence: createUserPersistenceAdapter({
    key: 'user-state',
    storageType: 'sessionStorage',
    serialize: true
  })
})

// 在组件中使用
const userStore = usePersistentUserStore()
```

> `createUserPersistenceAdapter` 基于核心 `storage` 模块实现，支持自定义键名、存储类型（`localStorage` / `sessionStorage`）以及是否序列化。

## 扩展功能

### 应用状态管理

```typescript
// 应用全局状态
export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    theme: 'light',
    language: 'zh-CN',
    sidebarCollapsed: false,
    notifications: [] as Notification[]
  }),
  
  getters: {
    isDarkTheme: state => state.theme === 'dark',
    unreadNotifications: state => 
      state.notifications.filter(n => !n.read)
  },
  
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    
    setLanguage(language: string) {
      this.language = language
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
      this.notifications.push({
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString()
      })
    },
    
    markNotificationAsRead(id: number) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    }
  }
})
```

### 数据缓存管理

```typescript
// 数据缓存状态
export const useCacheStore = defineStore('cache', {
  state: () => ({
    cache: new Map<string, CacheItem>(),
    maxSize: 100
  }),
  
  actions: {
    set(key: string, data: any, ttl = 5 * 60 * 1000) {
      // 检查缓存大小
      if (this.cache.size >= this.maxSize) {
        this.clearOldest()
      }
      
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })
    },
    
    get(key: string) {
      const item = this.cache.get(key)
      if (!item) return null
      
      // 检查是否过期
      if (Date.now() - item.timestamp > item.ttl) {
        this.cache.delete(key)
        return null
      }
      
      return item.data
    },
    
    clear(key?: string) {
      if (key) {
        this.cache.delete(key)
      } else {
        this.cache.clear()
      }
    },
    
    clearOldest() {
      let oldestKey = ''
      let oldestTime = Date.now()
      
      for (const [key, item] of this.cache) {
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp
          oldestKey = key
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
  }
})

interface CacheItem {
  data: any
  timestamp: number
  ttl: number
}
```

### 状态同步

```typescript
// 状态同步管理
export class StateSync {
  private stores: any[] = []
  
  registerStore(store: any) {
    this.stores.push(store)
  }
  
  syncToServer() {
    const state = this.collectState()
    return this.sendToServer(state)
  }
  
  syncFromServer(serverState: any) {
    this.applyState(serverState)
  }
  
  private collectState() {
    const state: any = {}
    this.stores.forEach(store => {
      state[store.$id] = store.$state
    })
    return state
  }
  
  private applyState(serverState: any) {
    Object.keys(serverState).forEach(storeId => {
      const store = this.stores.find(s => s.$id === storeId)
      if (store) {
        store.$patch(serverState[storeId])
      }
    })
  }
  
  private async sendToServer(state: any) {
    try {
      await fetch('/api/sync-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
      })
    } catch (error) {
      console.error('状态同步失败:', error)
    }
  }
}

export const stateSync = new StateSync()
```

## 状态管理最佳实践

### 1. 模块化状态

```typescript
// 按功能模块组织状态
export const useUserStore = defineStore('user', {
  // 用户相关状态
})

export const useProductStore = defineStore('product', {
  // 产品相关状态
})

export const useOrderStore = defineStore('order', {
  // 订单相关状态
})
```

### 2. 状态验证

```typescript
// 状态验证
export const useValidatedStore = defineStore('validated', {
  state: () => ({
    data: null as any
  }),
  
  actions: {
    setData(data: any) {
      // 验证数据
      if (!this.validateData(data)) {
        throw new Error('数据验证失败')
      }
      
      this.data = data
    },
    
    validateData(data: any): boolean {
      // 实现数据验证逻辑
      return data && typeof data === 'object'
    }
  }
})
```

### 3. 状态订阅

```typescript
// 状态变化订阅
export function subscribeToStore(store: any, callback: (state: any) => void) {
  store.$subscribe((mutation: any, state: any) => {
    callback(state)
  })
}

// 使用示例
const userStore = useUserStore()
subscribeToStore(userStore, (state) => {
  console.log('用户状态变化:', state)
})
```

## 性能优化

### 1. 状态分片

```typescript
// 大状态分片管理
export const useLargeDataStore = defineStore('large-data', {
  state: () => ({
    items: new Map<string, any>(),
    loading: false
  }),
  
  getters: {
    getItem: state => (id: string) => state.items.get(id),
    getItems: state => (ids: string[]) => 
      ids.map(id => state.items.get(id)).filter(Boolean)
  },
  
  actions: {
    async loadItem(id: string) {
      if (this.items.has(id)) return
      
      this.loading = true
      try {
        const item = await fetchItem(id)
        this.items.set(id, item)
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 2. 状态缓存

```typescript
// 状态缓存策略
export const useCachedStore = defineStore('cached', {
  state: () => ({
    cache: new Map<string, { data: any, timestamp: number }>()
  }),
  
  actions: {
    async getCachedData(key: string, fetcher: () => Promise<any>, ttl = 5 * 60 * 1000) {
      const cached = this.cache.get(key)
      
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data
      }
      
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      })
      
      return data
    }
  }
})
```

## 常见问题

### Q: 如何处理状态持久化？
A: 使用 `createUserStore` 配合 `createUserPersistenceAdapter`，或实现自定义适配器接入现有存储模块，实现按需持久化。

### Q: 如何实现状态同步？
A: 使用$subscribe监听状态变化，通过API同步到服务器。

### Q: 如何优化大状态性能？
A: 使用状态分片、懒加载和缓存策略，避免一次性加载大量数据。

### Q: 如何处理状态冲突？
A: 实现状态版本控制和冲突解决机制，使用时间戳或版本号。

## 相关模块

- [认证模块](./auth.md) - 用户认证状态
- [路由管理](./router.md) - 路由状态管理
- [HTTP客户端](./http.md) - 数据获取和同步
