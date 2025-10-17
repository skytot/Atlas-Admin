# 测试问题排查指南

## 常见问题及解决方案

### 1. 模块导入问题

#### 问题：`Cannot find module '@/core/xxx'`
**原因**：路径别名在测试环境中未正确配置

**解决方案**：
1. 检查 `tests/tsconfig.json` 是否正确继承根配置
2. 确认 `vitest.config.ts` 中的 alias 配置
3. 重启 TypeScript 服务

```json
// tests/tsconfig.json
{
  "extends": "../tsconfig.app.json",
  "include": [
    "../env.d.ts",
    "../auto-imports.d.ts", 
    "../components.d.ts",
    "./**/*.ts",
    "./**/*.tsx"
  ],
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### 2. Mock 配置问题

#### 问题：`mockReporter is not defined`
**原因**：`vi.mock` 在 `beforeEach` 中调用，但 mock 会被提升到文件顶部

**解决方案**：将 mock 移到文件顶部
```typescript
// ❌ 错误做法
beforeEach(() => {
  vi.mock('@/core/error/reporter', () => ({
    reportError: mockReporter
  }))
})

// ✅ 正确做法
const mockReporter = vi.fn()
vi.mock('@/core/error/reporter', () => ({
  reportError: mockReporter
}))
```

#### 问题：Mock 函数不生效
**原因**：全局 mock 覆盖了真实模块

**解决方案**：移除不必要的全局 mock
```typescript
// ❌ 错误做法 - 在 setup.ts 中全局 mock auth
vi.mock('@/core/auth', () => ({
  auth: { /* mock methods */ }
}))

// ✅ 正确做法 - 让测试使用真实模块
// 移除全局 mock，在需要时局部 mock
```

### 3. 存储测试问题

#### 问题：`Object.keys(localStorage)` 不工作
**原因**：`Object.keys(localStorage)` 返回方法名而非存储键

**解决方案**：使用正确的遍历方法
```typescript
// ❌ 错误做法
Object.keys(localStorage).filter(key => key.startsWith(prefix))

// ✅ 正确做法
const keys = []
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && key.startsWith(prefix)) {
    keys.push(key)
  }
}
```

#### 问题：测试间状态污染
**原因**：存储状态在测试间未清理

**解决方案**：在 `beforeEach` 中清理状态
```typescript
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
```

### 4. 异步测试问题

#### 问题：异步操作未等待完成
**原因**：忘记使用 `await` 或 `async`

**解决方案**：
```typescript
// ❌ 错误做法
it('异步测试', () => {
  const result = asyncOperation()
  expect(result).toBe(expected) // result 是 Promise
})

// ✅ 正确做法
it('异步测试', async () => {
  const result = await asyncOperation()
  expect(result).toBe(expected)
})
```

#### 问题：Promise 拒绝未处理
**原因**：未正确处理 Promise 错误

**解决方案**：
```typescript
// 测试 Promise 拒绝
await expect(asyncOperation()).rejects.toThrow('Error message')

// 测试 Promise 解析
await expect(asyncOperation()).resolves.toBe(expectedValue)
```

### 5. 断言问题

#### 问题：对象比较失败
**原因**：使用 `toBe` 比较对象

**解决方案**：
```typescript
// ❌ 错误做法
expect(result).toBe(expectedObject)

// ✅ 正确做法
expect(result).toEqual(expectedObject)
expect(result).toMatchObject({ key: 'value' })
```

#### 问题：数组包含检查
**原因**：使用错误的断言方法

**解决方案**：
```typescript
// 检查数组包含元素
expect(array).toContain(element)
expect(array).toContainEqual({ key: 'value' })

// 检查数组长度
expect(array).toHaveLength(3)
```

### 6. 环境配置问题

#### 问题：`localStorage is not defined`
**原因**：测试环境未正确配置

**解决方案**：检查 `vitest.config.ts`
```typescript
export default defineConfig({
  test: {
    environment: 'jsdom', // 确保使用 jsdom 环境
    setupFiles: ['./src/test/setup.ts']
  }
})
```

#### 问题：Vue 组件测试失败
**原因**：Vue 测试工具未正确配置

**解决方案**：安装并配置 `@vue/test-utils`
```bash
pnpm add -D @vue/test-utils
```

### 7. 性能问题

#### 问题：测试运行缓慢
**原因**：不必要的 mock 或同步操作

**解决方案**：
1. 使用并行测试
2. 减少不必要的 mock
3. 优化测试数据

```typescript
// 使用 vi.hoisted 提升 mock
const mockFunction = vi.hoisted(() => vi.fn())
```

## 调试技巧

### 1. 使用 console.log
```typescript
it('调试测试', () => {
  console.log('变量值:', variable)
  console.log('对象结构:', JSON.stringify(object, null, 2))
  expect(result).toBe(expected)
})
```

### 2. 使用 verbose 报告
```bash
npx vitest run --reporter=verbose
```

### 3. 检查 mock 调用
```typescript
// 检查 mock 是否被调用
expect(mockFunction).toHaveBeenCalled()
expect(mockFunction).toHaveBeenCalledTimes(1)
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)
```

### 4. 使用调试器
```typescript
it('调试测试', () => {
  debugger // 在浏览器中打开调试器
  expect(result).toBe(expected)
})
```

## 最佳实践

### 1. 测试隔离
- 每个测试独立运行
- 清理测试间状态
- 避免测试间依赖

### 2. 描述性命名
- 使用中文描述测试目的
- 说明测试的输入和预期
- 避免模糊的测试名称

### 3. 合理的断言
- 使用最具体的断言
- 避免过度断言
- 测试行为而非实现

### 4. 错误处理
- 测试正常流程
- 测试错误情况
- 测试边界条件

## 工具推荐

### 1. 测试运行器
- Vitest：快速、现代
- Jest：成熟、稳定

### 2. 断言库
- Vitest 内置：简单易用
- Chai：功能丰富

### 3. Mock 工具
- Vitest vi：内置 mock
- MSW：API mock

### 4. 覆盖率工具
- @vitest/coverage-v8：V8 覆盖率
- @vitest/coverage-c8：C8 覆盖率

## 相关资源

- [Vitest 文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)
