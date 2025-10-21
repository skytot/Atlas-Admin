# Atlas Admin Starter

Atlas Admin Starter 是一个基于 Vue 3 + TypeScript + Pinia + Vite 的大型管理平台脚手架，集成现代化开发工具链与企业级最佳实践。

## 📖 命名由来

**Atlas Admin Starter** 的命名寓意：

- **Atlas** - 源自希腊神话中的泰坦神阿特拉斯（Atlas），他肩负着支撑天空的重任，象征着项目的稳定性和可靠性，寓意着为开发者提供坚实的技术基础支撑
- **Admin** - 明确表示这是一个管理后台系统模板，专注于企业级管理平台开发
- **Starter** - 表示这是一个快速启动模板，为开发者提供开箱即用的项目基础架构

整体寓意：**Atlas Admin Starter** 就像神话中的阿特拉斯一样，为现代管理平台开发提供坚实可靠的技术基础，让开发者能够快速构建高质量的企业级应用。

> 🎯 **精简依赖**: 项目采用精简的依赖策略，只包含核心必需的依赖，支持按需扩展。所有依赖版本均为最新稳定版本。

## ✨ 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API
- 📘 **TypeScript** - 完整的 TypeScript 支持
- 🍍 **Pinia** - 现代化的状态管理
- ⚡ **Vite** - 极速的开发体验
- 🌐 **Vue Router** - 官方路由管理
- 📡 **Axios** - HTTP 请求库
- 📱 **响应式设计** - 支持多端适配
- 🎯 **代码规范** - ESLint + Prettier
- 🧪 **测试支持** - Vitest + Vue Test Utils
- 🔧 **开发工具** - 自动导入、热更新等
- 🚀 **CI/CD** - GitHub Actions 集成
- 📦 **模块化架构** - 功能模块化组织
- 🎨 **可扩展UI** - 支持按需添加UI组件库

## 🛠️ 技术栈

### 核心框架

- Vue 3.5.13+
- TypeScript 5.6.3+
- Vite 7.1.9+
- Pinia 3.0.3+
- Vue Router 4.4.5+

### HTTP 请求

- Axios 1.12.2+

### 开发工具

- ESLint 9.12.0 + Prettier 3.3.3
- Husky 9.1.6 + lint-staged 15.2.10
- Vitest 3.2.4 + Vue Test Utils 2.4.6
- Auto Import + Vue Components
- TypeScript 5.6.3

### 构建工具

- Vite 7.1.9
- Terser (代码压缩)
- SCSS 1.77.8

## 📁 项目结构

```
src/
├── core/                    # 核心模块
│   ├── auth/               # 认证相关
│   ├── config/             # 配置管理
│   ├── error/              # 错误处理
│   ├── http/               # HTTP 请求
│   ├── logger/             # 日志系统
│   ├── plugins/            # 插件配置
│   ├── router/             # 路由配置
│   └── store/              # 状态管理
├── features/               # 功能模块
│   ├── dashboard/          # 仪表板
│   ├── gov/               # 政府相关功能
│   └── user/              # 用户管理
├── scripts/               # 构建脚本
├── styles/                # 样式文件
├── test/                  # 测试文件
├── App.vue                # 根组件
└── main.ts                # 入口文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.19.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

开发服务器将在 `http://localhost:3000` 启动，并自动打开浏览器。

### 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 代码检查

```bash
# 运行 ESLint 检查
pnpm lint:check

# 自动修复 ESLint 问题
pnpm lint

# 运行 Prettier 格式化
pnpm format

# 检查 Prettier 格式
pnpm format:check

# TypeScript 类型检查
pnpm type-check
```

### 测试

```bash
# 基础测试命令
pnpm test                    # 运行测试（监听模式）
pnpm test:watch             # 监听模式运行测试
pnpm test:ui                # 打开 Vitest UI 调试
pnpm test:coverage          # 运行测试并生成覆盖率报告

# 优化测试命令
pnpm test:quick             # 快速测试（核心模块）
pnpm test:full             # 完整测试（所有模块）
pnpm test:http             # HTTP模块测试
pnpm test:storage          # 存储模块测试

# 测试报告
pnpm test:analyze          # 基础分析报告
pnpm test:enhanced         # 增强版详细报告（包含具体测试用例）
pnpm test:json             # 生成JSON格式报告
pnpm test:report           # 交互式测试报告工具
```

## 🧰 实用脚本

- `pnpm build:routes`：执行 `src/scripts/build-routes.js`，根据模块结构生成最新的路由定义，可在新增页面后运行以确保路由同步。
- `pnpm create:module <name>`：执行 `src/scripts/create-module.js`，在 `src/features/` 下生成完整模块骨架（包含 `api`、`views`、`components`、`composables`、`stores`、`constants` 目录）。示例：

```bash
# 创建名为 dashboard 的业务模块
pnpm create:module dashboard
```

- `pnpm generate:icons`：执行 `src/scripts/generate-icons.js`，从 `src/assets/icons/` 读取 SVG 并输出为可直接引入的 Vue 组件。
- `pnpm prepare`：初始化 Husky Git hooks，确保提交前自动执行 lint-staged。

## 🔧 配置

### 环境变量

复制 `.env.example` 为 `.env` 并根据需要修改配置：

```bash
cp .env.example .env
```

主要配置项：

- `VITE_APP_TITLE` - 应用标题
- `VITE_API_BASE_URL` - API 基础地址
- `VITE_API_TIMEOUT` - API 请求超时时间
- `VITE_ENABLE_DEVTOOLS` - 是否启用开发工具
- `VITE_ENABLE_MOCK` - 是否启用Mock数据

### 路径别名

项目配置了以下路径别名：

- `@` - `src/`
- `@core` - `src/core/`
- `@features` - `src/features/`
- `@styles` - `src/styles/`

## 📝 开发规范

### 代码规范

项目使用 ESLint + Prettier 进行代码规范检查：

- 使用 2 空格缩进
- 使用单引号
- 不使用分号
- 行尾不添加逗号

### 提交规范

使用 Husky 进行 Git hooks 检查：

- 提交前自动运行 lint-staged
- 自动格式化代码
- 检查代码规范

### 模块化开发

- 按功能模块组织代码
- 每个模块包含：`api/`、`components/`、`composables/`、`stores/`、`views/`
- 使用 TypeScript 进行类型约束

## 🧪 测试

### 测试框架

- **Vitest** - 测试运行器
- **Vue Test Utils** - Vue 组件测试工具
- **jsdom** - DOM 环境模拟

### 测试文件

测试文件应放在 `tests/` 目录下，按模块组织：
```
tests/
├── core/              # 核心模块测试
│   ├── auth/         # 认证模块测试
│   ├── http/         # HTTP模块测试
│   ├── storage/      # 存储模块测试
│   └── ...
├── utils/             # 测试工具
└── README.md          # 测试说明
```

### 运行测试

```bash
# 基础测试命令
pnpm test                    # 运行测试（监听模式）
pnpm test:watch             # 监听模式运行测试
pnpm test:ui                # 打开 Vitest UI 调试
pnpm test:coverage          # 生成覆盖率报告

# 优化测试命令
pnpm test:quick             # 快速测试（核心模块）
pnpm test:full             # 完整测试（所有模块）
pnpm test:http             # HTTP模块测试
pnpm test:storage          # 存储模块测试

# 测试报告
pnpm test:analyze          # 基础分析报告
pnpm test:enhanced         # 增强版详细报告（包含具体测试用例）
pnpm test:json             # 生成JSON格式报告
pnpm test:report           # 交互式测试报告工具
```

### 测试覆盖情况

- **HTTP模块** - 请求处理、错误标准化、重试机制
- **存储模块** - 智能序列化、数据管理、类型安全
- **认证模块** - 令牌管理、用户信息、权限控制
- **错误处理** - Vue错误捕获、Promise拒绝处理
- **用户状态** - Pinia状态管理、数据持久化

### 测试文档

- [📋 测试计划](./docs/core/testing-plan.md) - 完整的测试规划
- [📖 测试指南](./docs/core/testing-guide.md) - 详细的测试编写指南
- [📊 测试报告](./docs/core/testing-reports.md) - 测试结果输出优化
- [🔧 问题排查](./docs/core/testing-troubleshooting.md) - 常见问题解决方案

## 🚀 部署

### 构建优化

生产构建包含以下优化：

- 代码分割
- 资源压缩
- Tree Shaking
- 移除 console 和 debugger

### CI/CD

项目配置了 GitHub Actions：

- **CI** - 代码检查、测试、构建
- **Release** - 自动发布
- **Deploy** - 自动部署到 GitHub Pages

## 🔧 依赖管理

### 精简依赖

项目采用精简的依赖策略，只包含核心必需的依赖：

- **生产依赖**: Vue 3、Vue Router、Pinia、Axios
- **开发依赖**: TypeScript、Vite、ESLint、Prettier、测试工具

### 按需扩展

当需要额外功能时，可以按需添加：

```bash
# 添加UI组件库
pnpm add element-plus @element-plus/icons-vue

# 添加国际化
pnpm add vue-i18n

# 添加日期处理
pnpm add dayjs

# 添加工具库
pnpm add lodash-es
```

### 依赖检查

定期检查无用依赖：

```bash
# 安装依赖检查工具
pnpm add -g depcheck

# 检查无用依赖
depcheck

# 更新依赖到最新版本
pnpm update --latest
```

## 📚 文档

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Axios 文档](https://axios-http.com/)
- [Vitest 文档](https://vitest.dev/)

## 🤝 贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/)
