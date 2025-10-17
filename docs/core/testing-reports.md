# 测试报告优化指南

## 概述

本文档介绍如何优化测试结果输出报告，提供更好的测试体验和结果分析。

## 快速开始

### 基本测试命令

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 测试UI界面
npm run test:ui
```

### 优化后的测试命令

```bash
# 快速测试 - 核心模块
npm run test:quick

# 完整测试 - 所有模块
npm run test:full

# 特定模块测试
npm run test:http
npm run test:storage

# 不同格式报告
npm run test:json    # JSON格式报告
npm run test:html    # HTML格式报告
```

## 测试模式

### 1. 快速模式 (quick)
- **目标**: 核心模块测试
- **包含**: auth, storage, error 模块
- **用途**: 开发过程中的快速验证

### 2. 完整模式 (full)
- **目标**: 所有模块测试
- **包含**: 所有测试文件
- **用途**: 完整的测试验证

### 3. 模块模式
- **HTTP模块**: `npm run test:http`
- **存储模块**: `npm run test:storage`
- **认证模块**: `npm run test:auth`

## 报告格式

### 1. 控制台报告
- **verbose**: 详细输出，显示每个测试的详细信息
- **basic**: 基础输出，显示测试摘要
- **dot**: 点状输出，简洁显示测试进度

### 2. 文件报告
- **JSON**: 机器可读的测试结果
- **HTML**: 可视化的测试报告

### 3. 多格式报告
同时生成多种格式的报告文件

## 测试结果分析

### 运行分析脚本

```bash
# 分析测试结果
node scripts/analyze-test-results.js
```

### 分析内容

1. **基本统计**
   - 总测试数
   - 通过率
   - 失败率
   - 跳过率
   - 执行时间

2. **文件级别分析**
   - 每个测试文件的执行情况
   - 通过/失败数量
   - 执行时间

3. **失败测试详情**
   - 失败测试列表
   - 错误信息
   - 修复建议

4. **性能分析**
   - 最慢的测试用例
   - 性能优化建议

## 配置说明

### Vitest 配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // 报告器配置
    reporter: ['verbose', 'json', 'html'],
    
    // 输出目录
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html'
    },
    
    // 测试超时配置
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // 重试配置
    retry: 2,
    
    // 并发配置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  }
})
```

### 测试分组配置

```javascript
// tests/test-groups.config.js
export const testGroups = {
  core: {
    name: '核心模块',
    pattern: 'tests/core/**/*.spec.ts',
    description: '核心功能模块测试',
    priority: 'high'
  },
  // ... 其他分组
}
```

## 最佳实践

### 1. 测试组织
- 按模块分组测试
- 使用描述性的测试名称
- 添加适当的测试标签

### 2. 性能优化
- 使用并行测试
- 优化慢速测试
- 合理设置超时时间

### 3. 报告优化
- 选择合适的报告格式
- 定期分析测试结果
- 关注测试覆盖率

### 4. 持续集成
- 在CI中使用JSON报告
- 设置测试失败通知
- 监控测试性能趋势

## 故障排除

### 常见问题

1. **测试超时**
   - 增加 `testTimeout` 配置
   - 检查测试中的异步操作

2. **内存不足**
   - 减少并发测试数量
   - 优化测试代码

3. **报告文件过大**
   - 使用压缩格式
   - 定期清理旧报告

### 调试技巧

1. **详细日志**
   ```bash
   npm run test:full -- --reporter=verbose
   ```

2. **特定测试**
   ```bash
   npm run test -- --grep "特定测试名称"
   ```

3. **调试模式**
   ```bash
   npm run test -- --inspect-brk
   ```

## 总结

通过以上优化，你可以获得：

- ✅ 更好的测试组织和管理
- ✅ 多种格式的测试报告
- ✅ 详细的测试结果分析
- ✅ 性能优化建议
- ✅ 更好的开发体验

这些优化都是基于Vitest内置功能，无需引入第三方依赖，保持了项目的简洁性。
