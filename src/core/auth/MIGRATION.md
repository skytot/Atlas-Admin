# 认证模块迁移指南

## 📋 从v1.0到v2.0的变更

### 🏗️ 架构变更

**v1.0 - 分层架构 + 桥接模式**
```
AuthService → AuthBridge → UserStore → PersistenceAdapter
```

**v2.0 - 单一数据源架构**
```
Auth模块（唯一数据源） → AuthPersistenceAdapter → Storage
UserStore（纯消费端） ← Auth模块（通过AuthBridge）
```

### 🔄 API变更

#### 导入方式变更

**v1.0:**
```typescript
import { authService } from '@/core/auth'
```

**v2.0:**
```typescript
import { auth } from '@/core/auth'
```

#### 使用方式变更

**v1.0:**
```typescript
// 需要手动初始化
const userStore = useUserStore()
await userStore.restoreFromAuth()

// 使用authService
await authService.login(credentials)
```

**v2.0:**
```typescript
// 自动初始化，无需手动调用
// 直接使用auth
await auth.login(credentials)
```

### 📦 新增功能

1. **自动初始化**
   - 应用启动时自动恢复认证状态
   - 自动同步到UserStore

2. **单一数据源**
   - Auth模块作为唯一数据源
   - UserStore作为纯消费端
   - 消除数据同步问题

3. **简化API**
   - 移除复杂的AuthService依赖
   - 直接使用auth对象

### 🚀 迁移步骤

#### 1. 更新导入

```typescript
// 旧代码
import { authService } from '@/core/auth'

// 新代码
import { auth } from '@/core/auth'
```

#### 2. 更新方法调用

```typescript
// 旧代码
await authService.login(credentials)
authService.logout()
authService.hasPermission('admin')

// 新代码
await auth.login(credentials)
auth.logout()
auth.hasPermission('admin')
```

#### 3. 移除手动初始化

```typescript
// 旧代码 - 需要手动初始化
const userStore = useUserStore()
await userStore.restoreFromAuth()

// 新代码 - 自动初始化，无需手动调用
const userStore = useUserStore()
// 状态已自动同步
```

#### 4. 更新组件代码

```vue
<!-- 旧代码 -->
<script setup>
import { authService } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

const handleLogin = async () => {
  await authService.login(credentials)
}
</script>

<!-- 新代码 -->
<script setup>
import { auth } from '@/core/auth'
import { useUserStore } from '@/core/store/modules/user'

const userStore = useUserStore()

const handleLogin = async () => {
  await auth.login(credentials)
}
</script>
```

### ⚠️ 注意事项

1. **向后兼容性**
   - 大部分API保持不变
   - 只需要更新导入方式

2. **自动初始化**
   - 无需手动调用初始化方法
   - 应用启动时自动处理

3. **单一数据源**
   - Auth模块是唯一数据源
   - UserStore不独立存储数据
   - 所有状态变更都通过Auth模块

### 🔧 高级用法

如果需要自定义认证服务：

```typescript
// v2.0 支持
import { AuthService } from '@/core/auth'
import { localAuthPersistence } from '@/core/auth'

const customAuthService = new AuthService(localAuthPersistence)
```

### 📊 性能对比

| 特性 | v1.0 | v2.0 |
|------|------|------|
| **初始化** | 手动 | 自动 |
| **存储冲突** | 存在 | 无 |
| **数据同步** | 手动 | 自动 |
| **数据源** | 多个 | 单一 |
| **UserStore角色** | 独立存储 | 纯消费端 |
| **API复杂度** | 高 | 低 |
| **维护成本** | 高 | 低 |

### 🎯 迁移建议

1. **渐进式迁移**
   - 先更新导入方式
   - 再更新方法调用
   - 最后移除手动初始化

2. **测试验证**
   - 确保登录/登出功能正常
   - 验证状态同步正确
   - 检查权限控制有效

3. **文档更新**
   - 更新团队文档
   - 培训开发人员
   - 更新代码示例
