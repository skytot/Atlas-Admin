# 快速开始

## 克隆仓库

```bash
git clone https://github.com/your-org/vue-enterprise-template.git
cd vue-enterprise-template
pnpm install
```

## 运行开发环境

```bash
# 应用开发服务器
pnpm dev

# 文档站（VitePress）
pnpm docs:dev
```

访问 `http://localhost:5173/` 查看文档，默认会展示指南首页。

## 生成业务模块

```bash
# 创建新模块 skeleton
pnpm create:module dashboard
```

执行后将在 `src/features/dashboard` 下生成 `api`、`components`、`composables`、`stores`、`views` 等子目录，便于快速扩展业务。

## 常用命令

### 开发命令
- `pnpm dev`：启动开发服务器
- `pnpm dev:all`：同时启动应用和文档服务器
- `pnpm dev:smart`：使用智能启动脚本

### 构建命令
- `pnpm build`：构建生产版本
- `pnpm preview`：预览构建结果

### 测试命令
- `pnpm test`：运行单元测试（监听模式）
- `pnpm test:quick`：快速测试（核心模块）
- `pnpm test:full`：完整测试（所有模块）
- `pnpm test:html`：生成HTML测试报告
- `pnpm test:ui`：启动测试UI界面

### 代码质量
- `pnpm lint`：执行 ESLint 自动修复
- `pnpm format`：使用 Prettier 格式化
- `pnpm type-check`：TypeScript 类型检查

### 文档命令
- `pnpm docs:build`：构建静态文档站点
- `pnpm docs:preview`：本地预览构建后的文档站


