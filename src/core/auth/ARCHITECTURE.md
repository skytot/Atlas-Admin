# Auth模块架构文档

## 🏗️ 架构概述

Auth模块采用**单一数据源架构**设计，作为唯一的用户状态数据源和持久化层，通过独立的持久化适配器实现统一状态管理。

### 架构层次

```
┌─────────────────────────────────────────┐
│                组件层                    │
│  (通过 useUserStore 访问状态)            │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│                消费端                    │
│           (UserStore - Pinia)            │
│  - 响应式状态展示                        │
│  - 不独立存储数据                        │
│  - 从Auth获取状态                        │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│                桥梁层                    │
│            (AuthBridge)                 │
│  - 数据同步桥梁                          │
│  - 状态传递机制                          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│                数据源                    │
│            (Auth Module)                │
│  - 唯一数据源                            │
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

## 📁 文件结构

```
src/core/auth/
├── index.ts              # 主入口，统一认证API
├── persistence.ts         # 持久化适配器
├── auth-service.ts        # AuthService类（可选）
├── init.ts               # 初始化模块
├── types.ts              # 类型定义
├── README.md             # 使用文档
├── USAGE.md              # 使用指南
└── ARCHITECTURE.md       # 架构文档

src/core/store/modules/user/
├── user.store.ts         # 用户状态管理
├── integrations.ts       # 集成模块（已简化）
├── types.ts              # 用户状态类型
└── ...
```

## 🚀 使用方式

### 1. 基本使用（推荐）

```typescript
// 导入认证模块
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

// 在组件中使用
const userStore = useUserStore()

// 业务逻辑
await auth.login(credentials)

// 状态访问
console.log(userStore.isAuthenticated)
```

### 2. 高级用法（按需导入）

```typescript
// 创建自定义认证服务
import { AuthService } from '@/core/auth'
import { localAuthPersistence } from '@/core/auth'

const customAuthService = new AuthService(localAuthPersistence)
```

## 🔧 核心组件

### Auth模块（唯一数据源）

```typescript
export const auth = {
  // 登录（数据源操作）
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  
  // 登出（数据源操作）
  logout(): void
  
  // 权限检查（数据源查询）
  hasPermission(permission: string): boolean
  hasRole(role: string): boolean
  
  // 令牌管理
  getToken(): string | null
  isTokenExpired(token?: string): boolean
  async refreshToken(): Promise<string>
  
  // 状态恢复
  restore(): void
}
```

### UserStore（消费端）

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    token: '',
    permissions: [],
    roles: [],
    lastLoginTime: undefined
  }),
  
  getters: {
    isAuthenticated: state => Boolean(state.token),
    hasPermission: state => (permission: string) => 
      state.permissions.includes(permission),
    hasRole: state => (role: string) => 
      state.roles?.includes(role) || false
  },
  
  actions: {
    // 从Auth模块获取状态（消费端操作）
    restoreFromAuth(): void
    // 通过Auth模块更新权限（不直接修改）
    updatePermissions(permissions: string[]): void
  }
})
```

### AuthPersistenceAdapter（持久化层）

```typescript
export interface AuthPersistenceAdapter {
  save(data: AuthState): void
  load(): AuthState | null
  clear(): void
}

export const localAuthPersistence: AuthPersistenceAdapter = {
  save(data: AuthState) {
    storage.set('auth_state', data, { type: 'localStorage', serialize: true })
  },
  load(): AuthState | null {
    return storage.get<AuthState>('auth_state', { type: 'localStorage', serialize: true })
  },
  clear() {
    storage.remove('auth_state')
  }
}
```

## 📊 架构优势

| 特性 | 统一持久化架构 | 分层架构 | 单一模块 |
|------|----------------|----------|----------|
| **职责分离** | ✅ 清晰 | ✅ 清晰 | ❌ 混乱 |
| **可测试性** | ✅ 高 | ✅ 高 | ❌ 低 |
| **可维护性** | ✅ 高 | ✅ 高 | ❌ 低 |
| **可扩展性** | ✅ 高 | ✅ 高 | ❌ 低 |
| **状态一致性** | ✅ 保证 | ✅ 保证 | ❌ 可能冲突 |
| **存储冲突** | ✅ 无 | ❌ 存在 | ❌ 存在 |
| **数据同步** | ✅ 自动 | ❌ 手动 | ❌ 手动 |
| **初始化** | ✅ 自动 | ❌ 手动 | ❌ 手动 |

## 🎯 设计原则

1. **统一持久化**：AuthPersistenceAdapter作为唯一的存储访问点
2. **单一数据源**：Auth模块作为唯一的状态管理
3. **自动同步**：UserStore从Auth模块自动恢复状态
4. **按需导入**：无需插件挂载，按需使用
5. **向后兼容**：保持原有API接口不变

## 🔄 数据流

```
用户操作 → Auth模块 → AuthPersistenceAdapter → Storage
    ↓           ↓              ↓
  业务逻辑    状态管理      持久化存储
    ↓
UserStore → 组件更新
    ↓
响应式更新
```

## 🛠️ 扩展指南

### 添加新的认证逻辑

1. 在`AuthService`中添加方法
2. 通过`AuthBridge`更新状态
3. 在`UserStore`中添加相应的getter

### 添加新的状态字段

1. 更新`UserState`类型
2. 更新`UserPayload`类型
3. 在`AuthBridge`中添加同步方法
4. 在`AuthService`中添加业务逻辑

## 📝 最佳实践

1. **使用AuthService处理业务逻辑**
2. **通过UserStore访问状态**
3. **避免直接操作storage**
4. **利用响应式特性自动更新UI**
5. **保持API的一致性**
