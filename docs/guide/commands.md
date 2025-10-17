# 命令说明

本文档详细说明了项目中 `package.json` 中定义的所有脚本命令的使用方法和用途。

## 开发相关命令

### `dev`
```bash
pnpm dev
```
启动 Vite 开发服务器，用于本地开发调试。

**用途：**
- 启动热重载的开发环境
- 支持 Vue 3 + TypeScript 开发
- 自动打开浏览器访问应用

### `dev:all`
```bash
pnpm dev:all
```
同时启动应用和文档开发服务器。

**用途：**
- 使用 concurrently 同时运行应用和文档服务器
- 提供带标签的输出，便于区分不同服务
- 任一服务失败时自动停止所有服务

### `dev:both`
```bash
pnpm dev:both
```
使用指定端口同时启动应用和文档服务器。

**用途：**
- 应用服务器运行在端口 3000
- 文档服务器运行在端口 3001
- 避免端口冲突问题

### `dev:smart`
```bash
pnpm dev:smart
```
使用智能启动脚本同时启动应用和文档服务器。

**用途：**
- 提供更好的用户体验和输出格式
- 自动检测服务启动状态
- 支持优雅关闭和错误处理

### `build`
```bash
pnpm build
```
构建生产版本的应用。

**用途：**
- 执行 TypeScript 类型检查 (`vue-tsc`)
- 使用 Vite 构建优化的生产版本
- 生成静态资源文件到 `dist` 目录

### `preview`
```bash
pnpm preview
```
预览构建后的生产版本。

**用途：**
- 本地预览构建后的应用
- 验证生产构建的正确性
- 测试部署前的最终效果

## 文档相关命令

### `docs:dev`
```bash
pnpm docs:dev
```
启动 VitePress 文档开发服务器。

**用途：**
- 开发 VitePress 文档
- 支持热重载的文档编辑
- 实时预览文档效果

### `docs:build`
```bash
pnpm docs:build
```
构建 VitePress 文档为静态站点。

**用途：**
- 生成静态文档站点
- 用于部署到 GitHub Pages 或其他静态托管服务

### `docs:preview`
```bash
pnpm docs:preview
```
预览构建后的文档站点。

**用途：**
- 预览构建后的文档效果
- 验证文档部署前的最终状态

## 代码质量命令

### `lint`
```bash
pnpm lint
```
运行 ESLint 并自动修复可修复的问题。

**用途：**
- 检查代码风格和潜在问题
- 自动修复简单的代码问题
- 支持 Vue、TypeScript、JavaScript 文件

### `lint:check`
```bash
pnpm lint:check
```
仅检查代码问题，不进行自动修复。

**用途：**
- CI/CD 环境中的代码检查
- 验证代码质量
- 不修改源文件

### `format`
```bash
pnpm format
```
使用 Prettier 格式化所有代码文件。

**用途：**
- 统一代码格式风格
- 自动格式化所有支持的文件类型
- 提高代码可读性

### `format:check`
```bash
pnpm format:check
```
检查代码格式是否符合 Prettier 规范。

**用途：**
- 验证代码格式
- CI/CD 环境中的格式检查
- 不修改源文件

### `type-check`
```bash
pnpm type-check
```
运行 TypeScript 类型检查。

**用途：**
- 验证 TypeScript 类型定义
- 检查类型错误
- 不生成输出文件

## 测试相关命令

### 基础测试命令

#### `test`
```bash
pnpm test
```
启动 Vitest 测试运行器（监听模式）。

**用途：**
- 运行单元测试
- 支持热重载的测试开发
- 实时查看测试结果

#### `test:watch`
```bash
pnpm test:watch
```
启动 Vitest 测试运行器（监听模式）。

**用途：**
- 文件变化时自动重新运行测试
- 开发过程中的快速反馈
- 支持测试调试


### 优化测试命令

#### `test:quick`
```bash
pnpm test:quick
```
运行快速测试（核心模块）。

**用途：**
- 快速验证核心功能
- 包含 auth、storage、error 模块
- 适合开发过程中的快速检查

#### `test:full`
```bash
pnpm test:full
```
运行完整测试（所有模块）。

**用途：**
- 全面的测试验证
- 包含所有测试用例
- 适合发布前的完整检查

#### `test:http`
```bash
pnpm test:http
```
运行 HTTP 模块测试。

**用途：**
- 专门测试 HTTP 相关功能
- 包含请求处理、错误标准化、重试机制
- 适合 HTTP 模块开发调试

#### `test:storage`
```bash
pnpm test:storage
```
运行存储模块测试。

**用途：**
- 专门测试存储相关功能
- 包含智能序列化、数据管理、类型安全
- 适合存储模块开发调试

### 测试报告命令

#### `test:json`
```bash
pnpm test:json
```
生成 JSON 格式的测试报告。

**用途：**
- 机器可读的测试结果
- CI/CD 集成
- 自动化分析


#### `test:report`
```bash
pnpm test:report
```
运行测试报告工具。

**用途：**
- 交互式测试模式选择
- 多种报告格式支持
- 智能测试分组


### 一次性测试命令

#### `test:run`
```bash
pnpm test:run
```
运行一次测试（非监听模式）。

**用途：**
- CI/CD 环境中的测试执行
- 一次性测试运行
- 不保持监听状态

## 工具脚本命令

### `build:routes`
```bash
pnpm build:routes
```
运行路由构建脚本。

**用途：**
- 自动生成路由配置
- 基于文件结构生成路由
- 简化路由管理

### `create:module`
```bash
pnpm create:module <模块名称>
```
运行模块创建脚本。

**参数：**
- `<模块名称>` - 要创建的功能模块名称，对应 `src/features/` 目录下的文件夹

**用途：**
- 快速创建新的功能模块
- 生成标准化的模块结构（api、views、components、composables、stores、constants 目录）
- 提高开发效率

**示例：**
```bash
pnpm create:module user-management
# 将在 src/features/user-management/ 下创建标准目录结构
```

### `generate:icons`
```bash
pnpm generate:icons
```
运行图标生成脚本。

**用途：**
- 自动生成图标组件
- 优化图标资源管理
- 支持 SVG 图标转换

## Git 钩子命令

### `prepare`
```bash
pnpm prepare
```
安装 Husky Git 钩子。

**用途：**
- 自动安装 Git 钩子
- 配置代码提交前的检查
- 确保代码质量

## 常用命令组合

### 开发前准备
```bash
# 安装依赖
pnpm install

# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint:check

# 启动开发服务器（仅应用）
pnpm dev

# 启动开发服务器（应用+文档）
pnpm dev:all
```

### 提交前检查
```bash
# 格式化代码
pnpm format

# 运行代码检查
pnpm lint

# 运行测试
pnpm test:run

# 类型检查
pnpm type-check
```

### 构建部署
```bash
# 构建应用
pnpm build

# 构建文档
pnpm docs:build

# 预览构建结果
pnpm preview
```

## 环境要求

- **Node.js**: >= 20.19.0
- **pnpm**: >= 8.0.0
- **包管理器**: pnpm@8.15.0

## 注意事项

1. 所有命令都使用 `pnpm` 作为包管理器
2. 开发环境建议使用 `pnpm dev` 启动
3. 提交代码前建议运行完整的检查流程
4. 生产构建前确保所有测试通过
5. 文档开发使用 `pnpm docs:dev` 启动

## 故障排除

### 常见问题

**Q: 运行 `pnpm dev` 时出现端口占用错误**
A: 可以修改 `vite.config.ts` 中的端口配置，或使用 `pnpm dev --port 3001` 指定其他端口

**Q: TypeScript 类型检查失败**
A: 运行 `pnpm type-check` 查看具体错误，通常是由于类型定义不匹配导致

**Q: ESLint 检查失败**
A: 运行 `pnpm lint` 自动修复可修复的问题，或手动修复剩余问题

**Q: 测试运行失败**
A: 检查测试文件语法，确保测试环境配置正确
