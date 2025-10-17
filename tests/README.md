# 🧪 测试目录

本目录包含项目的所有测试文件，提供完整的测试覆盖和文档支持。

## 📁 目录结构

```
tests/
├── core/                    # 核心模块测试
│   ├── auth/               # 认证模块测试
│   ├── error/              # 错误处理测试
│   ├── http/               # HTTP模块测试
│   ├── storage/            # 存储模块测试
│   ├── store/              # 状态管理测试
│   ├── router/             # 路由模块测试
│   └── logger/             # 日志模块测试
├── utils/                   # 测试工具
│   ├── http.ts             # HTTP测试工具
│   └── storage.ts          # 存储测试工具
├── test-groups.config.js    # 测试分组配置
└── README.md               # 本文件
```

## 🚀 快速开始

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

## 📊 测试覆盖情况

### ✅ 已完成模块
- **HTTP模块** - 请求处理、错误标准化、重试机制
- **存储模块** - 智能序列化、数据管理、类型安全
- **认证模块** - 令牌管理、用户信息、权限控制
- **错误处理** - Vue错误捕获、Promise拒绝处理
- **用户状态** - Pinia状态管理、数据持久化

### 🔄 进行中模块
- **路由模块** - 路由配置、导航守卫
- **日志模块** - 日志记录、传输器

### 📋 待开发模块
- **配置模块** - 环境配置、参数管理
- **插件模块** - 插件系统、扩展机制

## 🛠️ 测试工具

### 内置工具
- **Vitest** - 测试框架
- **@vue/test-utils** - Vue组件测试
- **jsdom** - DOM环境模拟

### 自定义工具
- **测试工具集** - `tests/utils/` 目录
- **Mock工具** - HTTP、存储、认证模拟
- **测试脚本** - 自动化测试运行

## 📈 测试统计

### 当前状态
- **测试用例总数**: 35+ 个
- **模块覆盖率**: 7/9 个模块
- **测试通过率**: 100%
- **平均执行时间**: < 5秒

### 性能指标
- **快速测试**: < 2秒
- **完整测试**: < 10秒
- **并行执行**: 支持
- **内存使用**: 优化

## 📚 相关文档

### 核心文档
- [📋 测试计划](../docs/core/testing-plan.md) - 完整的测试规划与实施路线图
- [📖 测试指南](../docs/core/testing-guide.md) - 详细的测试编写与维护指南
- [📊 测试报告](../docs/core/testing-reports.md) - 测试结果输出与报告优化
- [🔧 问题排查](../docs/core/testing-troubleshooting.md) - 常见测试问题解决方案
- [📈 测试总结](../docs/core/testing-summary.md) - 当前测试实施状态总结

### 快速导航
- [🧪 测试文档中心](../docs/testing.md) - 测试文档快速导航
- [📚 测试索引](../docs/core/testing-index.md) - 测试文档索引

## 🎯 最佳实践

### 1. 测试编写
- 使用描述性的测试名称
- 遵循 AAA 模式（Arrange, Act, Assert）
- 添加适当的测试标签
- 保持测试的独立性

### 2. 测试组织
- 按模块分组测试
- 使用统一的命名规范
- 合理使用测试工具
- 定期清理测试数据

### 3. 性能优化
- 使用并行测试
- 优化慢速测试
- 合理设置超时时间
- 监控测试性能

## 🔍 故障排除

### 常见问题
1. **模块导入错误** - 检查路径别名配置
2. **测试超时** - 增加超时时间或优化测试
3. **Mock失败** - 检查Mock配置和依赖
4. **环境问题** - 检查测试环境设置

### 获取帮助
- 查看 [问题排查指南](../docs/core/testing-troubleshooting.md)
- 检查测试日志和错误信息
- 参考现有测试用例
- 查看测试工具文档

---

## 🎉 开始测试

准备好开始测试了吗？选择适合你的方式：

### 🚀 快速体验
```bash
npm run test:quick
```

### 📊 详细报告
```bash
npm run test:html
```

### 🔍 问题排查
查看 [问题排查指南](../docs/core/testing-troubleshooting.md)

---

*最后更新: 2024年10月*