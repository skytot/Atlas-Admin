# 认证模块测试指南

## 概述

本文档介绍认证模块的测试策略、测试用例和最佳实践，涵盖单一数据源架构下的认证功能测试。

## 测试架构

### 测试文件结构

```
tests/core/auth/
├── auth.spec.ts              # 认证核心功能测试
├── auth-init.spec.ts         # 认证初始化测试
└── persistence-simple.spec.ts # 持久化测试
```

### 测试覆盖范围

| 测试文件 | 覆盖功能 | 测试用例数 | 状态 |
|----------|----------|------------|------|
| `auth.spec.ts` | 令牌管理、用户信息、权限检查 | 5个 | ✅ 通过 |
| `auth-init.spec.ts` | 状态恢复、模块集成 | 4个 | ✅ 通过 |
| `persistence-simple.spec.ts` | 持久化存储 | 3个 | ✅ 通过 |
| `data-consistency.spec.ts` | 数据一致性验证 | 6个 | ✅ 通过 |
| `single-source-architecture.spec.ts` | 单一数据源架构 | 4个 | ✅ 通过 |

## 测试用例详解

### 1. 认证核心功能测试 (auth.spec.ts)

#### 测试目标
验证认证模块的核心功能，包括令牌管理、用户信息管理、权限检查等。

#### 主要测试用例

```typescript
describe('core/auth', () => {
  // 令牌管理测试
  it('应当正确设置和获取令牌', () => {
    const token = 'test-token-123'
    auth.setToken(token)
    expect(auth.getToken()).toBe(token)
    expect(auth.hasToken()).toBe(true)
    expect(auth.isAuthenticated()).toBe(true)
  })

  // 用户信息管理测试
  it('应当正确设置和获取用户信息', () => {
    const userInfo: UserInfo = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin.write'],
      roles: ['user', 'admin']
    }
    auth.setUser(userInfo)
    expect(auth.getUser()).toEqual(userInfo)
    expect(auth.hasPermission('dashboard.read')).toBe(true)
    expect(auth.hasRole('admin')).toBe(true)
  })
})
```

### 2. 认证初始化测试 (auth-init.spec.ts)

#### 测试目标
验证认证模块的初始化功能，包括状态恢复、模块集成、状态一致性等。

#### 主要测试用例

```typescript
describe('core/auth/init', () => {
  // 状态恢复测试
  it('应当正确恢复认证状态', () => {
    auth.setToken('test-token')
    auth.setUser(userInfo)
    auth.restore()
    expect(auth.getToken()).toBe('test-token')
    expect(auth.getUser()?.name).toBe('Alice')
  })

  // 模块集成测试
  it('UserStore应当从认证模块恢复状态', () => {
    const userStore = useUserStore()
    auth.setToken('test-token')
    auth.setUser(userInfo)
    userStore.restoreFromAuth()
    expect(userStore.token).toBe('test-token')
    expect(userStore.name).toBe('Alice')
  })
})
```

### 3. 持久化测试 (persistence-simple.spec.ts)

#### 测试目标
验证持久化存储的基本功能，包括数据保存、加载、清除等。

#### 主要测试用例

```typescript
describe('core/auth/persistence (简化测试)', () => {
  // localStorage基本操作测试
  it('localStorage基本操作应正常工作', () => {
    const testData = { token: 'test-token', user: userInfo }
    localStorage.setItem('auth_state', JSON.stringify(testData))
    const saved = localStorage.getItem('auth_state')
    expect(saved).toBeTruthy()
    const parsed = JSON.parse(saved!)
    expect(parsed.token).toBe('test-token')
  })
})
```

### 5. 单一数据源架构测试 (single-source-architecture.spec.ts)

验证Auth模块作为唯一数据源，UserStore作为纯消费端的架构设计。

#### 主要测试用例

```typescript
describe('single source architecture', () => {
  // Auth模块作为唯一数据源
  it('Auth模块应该是唯一数据源', () => {
    const userStore = useUserStore()
    
    // 通过Auth模块设置数据
    auth.setToken('test-token')
    auth.setUser(userInfo)
    
    // UserStore从Auth获取数据
    userStore.restoreFromAuth()
    
    // 验证数据一致性
    expect(auth.getToken()).toBe(userStore.token)
    expect(auth.getUser()?.name).toBe(userStore.name)
  })
  
  // UserStore作为纯消费端
  it('UserStore应该作为纯消费端', () => {
    const userStore = useUserStore()
    
    // 通过UserStore更新权限（应该通过Auth模块）
    userStore.updatePermissions(['user.read', 'admin.write'])
    
    // 验证Auth模块状态已更新
    expect(auth.getUser()?.permissions).toEqual(['user.read', 'admin.write'])
    expect(userStore.permissions).toEqual(auth.getUser()?.permissions)
  })
})
```

## 测试最佳实践

### 1. 测试隔离

```typescript
beforeEach(() => {
  // 清理认证状态
  auth.logout()
  // 清理localStorage
  localStorage.clear()
})
```

### 2. 状态管理测试

```typescript
// 测试状态同步
it('认证模块和UserStore状态应保持一致', () => {
  auth.setToken('test-token')
  auth.setUser(userInfo)
  userStore.restoreFromAuth()
  
  expect(userStore.token).toBe(auth.getToken())
  expect(userStore.name).toBe(auth.getUser()?.name)
})
```

### 3. 权限和角色测试

```typescript
// 测试权限检查
it('应当正确检查用户权限', () => {
  auth.setUser({ ...userInfo, permissions: ['admin'] })
  expect(auth.hasPermission('admin')).toBe(true)
  expect(auth.hasPermission('user')).toBe(false)
})

// 测试角色检查
it('应当正确检查用户角色', () => {
  auth.setUser({ ...userInfo, roles: ['admin'] })
  expect(auth.hasRole('admin')).toBe(true)
  expect(auth.hasRole('user')).toBe(false)
})
```

## 运行测试

### 运行所有认证测试

```bash
# 运行所有认证相关测试
npm test -- --run tests/core/auth/

# 运行特定测试文件
npm test -- --run tests/core/auth/auth.spec.ts
npm test -- --run tests/core/auth/auth-init.spec.ts
npm test -- --run tests/core/auth/persistence-simple.spec.ts
```

### 运行认证和状态管理集成测试

```bash
# 运行认证和用户状态管理测试
npm test -- --run tests/core/auth/ tests/core/store/user.store.spec.ts
```

## 测试数据

### 测试用户数据

```typescript
const testUser: UserInfo = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  permissions: ['dashboard.read', 'admin.write'],
  roles: ['user', 'admin'],
  lastLoginTime: Date.now()
}
```

### 测试令牌数据

```typescript
const testToken = 'test-jwt-token-123'
const testRefreshToken = 'test-refresh-token-456'
```

## 故障排除

### 常见问题

1. **状态不同步**
   - 确保在测试前调用 `auth.logout()` 清理状态
   - 检查 `userStore.restoreFromAuth()` 是否正确调用

2. **权限检查失败**
   - 确保用户信息包含正确的 `permissions` 和 `roles` 字段
   - 检查权限字符串是否完全匹配

3. **持久化测试失败**
   - 确保在测试前清理 `localStorage`
   - 检查数据序列化和反序列化是否正确

### 调试技巧

```typescript
// 添加调试日志
it('调试测试用例', () => {
  console.log('当前认证状态:', auth.getState())
  console.log('当前用户信息:', auth.getUser())
  console.log('localStorage内容:', localStorage.getItem('auth_state'))
})
```

## 测试覆盖率

### 当前覆盖率

- **认证核心功能**: 100%
- **状态管理集成**: 100%
- **持久化存储**: 100%
- **权限和角色**: 100%

### 覆盖率目标

- **整体覆盖率**: > 95%
- **关键功能覆盖率**: 100%
- **边界情况覆盖率**: > 90%

## 持续改进

### 1. 测试用例扩展

- 添加更多边界情况测试
- 增加错误处理测试
- 添加性能测试

### 2. 测试工具优化

- 创建认证测试工具函数
- 优化测试数据生成
- 改进测试报告

### 3. 集成测试

- 添加端到端测试
- 测试与其他模块的集成
- 添加用户场景测试

## 相关文档

- [认证模块文档](./auth.md) - 认证模块使用指南
- [状态管理文档](./store.md) - 状态管理使用指南
- [测试指南](../testing/guide.md) - 通用测试编写指南
- [测试总结](../testing/summary.md) - 测试实施总结
