# 测试问题排查

## 常见问题

### 1. 模块导入错误
**问题**: 测试中无法正确导入模块
**解决方案**:
- 检查 `tests/tsconfig.json` 配置
- 确保路径别名正确设置
- 验证模块路径是否正确

### 2. Mock 不生效
**问题**: Mock 函数或对象没有按预期工作
**解决方案**:
- 检查 `vi.mock` 位置（应在文件顶部）
- 确认 mock 变量作用域
- 验证 mock 配置是否正确

### 3. 异步测试失败
**问题**: 异步操作测试不稳定
**解决方案**:
- 使用 `await` 等待异步操作
- 检查 Promise 是否正确处理
- 增加适当的超时时间

### 4. 存储测试问题
**问题**: localStorage 或 sessionStorage 测试失败
**解决方案**:
- 确保使用真实的存储 API
- 在测试间清理存储状态
- 检查存储权限设置

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

## 性能问题

### 1. 测试执行缓慢
- 检查是否有不必要的等待
- 优化测试数据大小
- 使用并行执行

### 2. 内存泄漏
- 清理测试后的状态
- 避免循环引用
- 监控内存使用

## 环境问题

### 1. 依赖版本冲突
- 检查 package.json 版本
- 更新过时的依赖
- 使用 lock 文件锁定版本

### 2. 环境变量问题
- 检查测试环境配置
- 确保必要的环境变量设置
- 使用测试专用的配置文件

---

*最后更新: 2024年10月*
