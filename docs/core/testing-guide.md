# Core 模块测试使用指南

## 概述

本文档介绍如何使用已建立的测试基础设施编写和维护 core 模块测试。

## 测试基础设施

### 目录结构
```
tests/
├── core/                    # core 模块测试集合
│   ├── auth/               # 认证模块测试
│   │   ├── auth.spec.ts           # 认证核心功能测试
│   │   ├── auth-init.spec.ts      # 认证初始化测试
│   │   └── persistence-simple.spec.ts # 持久化测试
│   ├── error/              # 错误处理测试
│   ├── http/               # HTTP 客户端测试
│   ├── storage/            # 存储管理测试
│   └── store/              # 状态管理测试
│       └── user.store.spec.ts    # 用户状态管理测试
├── utils/                  # 公共测试工具
│   ├── http.ts            # HTTP mock 工具
│   └── storage.ts         # 存储 mock 工具
└── README.md              # 测试规范说明
```

### 配置文件
- `vitest.config.ts` - Vitest 配置，包含路径别名和测试环境
- `tests/tsconfig.json` - 测试专用 TypeScript 配置
- `src/test/setup.ts` - 全局测试设置和 mock

## 编写测试用例

### 基本模板

```typescript
import { describe, expect, it, beforeEach } from 'vitest'
import { targetModule } from '@/core/target-module'

/**
 * 测试目标：验证模块的核心功能。
 * 覆盖场景：
 * - 功能点1描述
 * - 功能点2描述
 * - 功能点3描述
 */
describe('core/target-module', () => {
  beforeEach(() => {
    // 测试前清理和初始化
  })

  /**
   * 测试目标：具体测试目的。
   * 输入：测试输入条件。
   * 预期：期望的输出或行为。
   */
  it('应当正确执行某个功能', () => {
    // 测试实现
    expect(result).toBe(expected)
  })
})
```

### 注释规范

#### 文件级注释
- 在 `describe` 前说明测试目标、覆盖场景、依赖关系
- 描述测试的整体策略和关注点

#### 用例级注释
- 每个 `it` 前说明：
  - **测试目标**：这个用例要验证什么
  - **输入**：测试的输入条件或前置状态
  - **预期**：期望的输出、行为或副作用

### 命名规范

- **文件命名**：`<功能>.spec.ts`（单元测试）、`<场景>.int.spec.ts`（集成测试）
- **用例命名**：使用中文描述，如 `应当正确设置用户信息`
- **变量命名**：使用有意义的英文名称

## 公共工具使用

### HTTP Mock 工具

```typescript
import { createHttpResponse, createHttpError, mockAxiosInstance } from '../../utils/http'

// 创建成功响应
const response = createHttpResponse({ 
  data: { success: true }, 
  status: 200 
})

// 创建错误响应
const error = createHttpError('Network error', 500)

// 创建 axios mock
const axiosMock = mockAxiosInstance()
```

### 存储 Mock 工具

```typescript
import { createMemoryStorage, stubStorageGlobals } from '../../utils/storage'

// 创建内存存储
const mockStorage = createMemoryStorage()

// 挂载到全局（在 setup 中已配置）
stubStorageGlobals()
```

## 测试类型

### 单元测试
- 测试单个函数或方法
- 使用 mock 隔离依赖
- 验证输入输出关系

### 集成测试
- 测试模块间交互
- 使用真实依赖（如 localStorage）
- 验证完整流程

### 快照测试
- 用于结构稳定的输出
- 如路由配置、日志格式
- 使用 `expect().toMatchSnapshot()`

## 最佳实践

### 1. 测试隔离
```typescript
beforeEach(() => {
  // 清理状态
  localStorage.clear()
  sessionStorage.clear()
})
```

### 2. 描述性断言
```typescript
// 好的做法
expect(user.isAuthenticated).toBe(true)
expect(permissions).toContain('admin')

// 避免
expect(result).toBeTruthy()
```

### 3. 错误测试
```typescript
it('应当正确处理错误情况', async () => {
  const error = createHttpError('Server error', 500)
  axiosMock.request.mockRejectedValue(error)

  await expect(apiCall()).rejects.toMatchObject({
    message: 'Server error',
    status: 500
  })
})
```

### 4. 异步测试
```typescript
it('应当正确处理异步操作', async () => {
  const promise = asyncOperation()
  
  // 等待异步操作完成
  await expect(promise).resolves.toBe(expectedValue)
})
```

## 运行测试

### 运行所有测试
```bash
npx vitest run
```

### 运行特定模块
```bash
# 认证模块测试
npx vitest run tests/core/auth

# 用户状态管理测试
npx vitest run tests/core/store/user.store.spec.ts

# 认证和状态管理集成测试
npx vitest run tests/core/auth/ tests/core/store/user.store.spec.ts
```

### 运行特定文件
```bash
npx vitest run tests/core/auth/auth.spec.ts
```

### 监听模式
```bash
npx vitest
```

### 覆盖率报告
```bash
npx vitest run --coverage
```

## 调试技巧

### 1. 使用 console.log
```typescript
it('调试用例', () => {
  console.log('调试信息:', variable)
  expect(result).toBe(expected)
})
```

### 2. 使用 verbose 报告
```bash
npx vitest run --reporter=verbose
```

### 3. 检查 mock 调用
```typescript
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)
expect(mockFunction).toHaveBeenCalledTimes(1)
```

## 常见问题

### 1. 路径别名不工作
- 检查 `tests/tsconfig.json` 配置
- 确保继承正确的 tsconfig

### 2. Mock 不生效
- 检查 `vi.mock` 位置（应在文件顶部）
- 确认 mock 变量作用域

### 3. 异步测试失败
- 使用 `await` 等待异步操作
- 检查 Promise 是否正确处理

### 4. 存储测试问题
- 确保使用真实的 localStorage
- 在测试间清理存储状态

## 持续改进

### 1. 定期审查测试
- 检查测试覆盖率
- 移除过时的测试
- 更新测试用例

### 2. 性能优化
- 避免不必要的 mock
- 使用并行测试
- 优化测试数据

### 3. 文档维护
- 更新测试文档
- 记录测试策略变更
- 分享最佳实践

## 相关文档

- [测试计划](./testing-plan.md) - 原始测试规划
- [测试总结](./testing-summary.md) - 当前实施状态
- [测试规范](../../tests/README.md) - 测试目录说明
