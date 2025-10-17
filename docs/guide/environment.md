# 开发环境

## 必备依赖

- **Node.js**: >= 20.19.0
- **pnpm**: >= 8.0.0
- **包管理器**: pnpm@8.15.0

建议使用 Volta、nvm 或 asdf 管理多版本 Node。

## 快速开始

### 方式一：使用 pnpm 命令（推荐）

```bash
# 安装依赖
pnpm install

# 同时启动应用和文档服务器
pnpm dev:all
```

启动后访问：
- 📱 **应用地址**: http://localhost:3000
- 📚 **文档地址**: http://localhost:5173

### 方式二：使用智能启动脚本

```bash
# 使用智能启动脚本
pnpm dev:smart
```

这个脚本提供：
- 🎨 彩色输出和进度提示
- 🔍 自动检测服务启动状态
- 🛑 优雅关闭和错误处理
- 📊 清晰的服务状态显示

### 方式三：使用平台特定脚本

#### Windows 用户
```bash
# 双击运行或在命令行执行
scripts/start-dev.bat
```

#### Linux/macOS 用户
```bash
# 给脚本执行权限
chmod +x scripts/start-dev.sh

# 运行脚本
./scripts/start-dev.sh
```

## 开发命令详解

### 基础命令

| 命令 | 说明 | 端口 |
|------|------|------|
| `pnpm dev` | 仅启动应用服务器 | 3000 |
| `pnpm docs:dev` | 仅启动文档服务器 | 5173 |
| `pnpm dev:all` | 同时启动应用和文档 | 3000 + 5173 |
| `pnpm dev:both` | 使用不同端口启动 | 3000 + 3001 |
| `pnpm dev:smart` | 智能启动脚本 | 3000 + 5173 |

### 端口配置

默认端口分配：
- **应用服务器**: 3000 (Vite默认端口)
- **文档服务器**: 5173/docs (VitePress默认路径)

使用 `dev:both` 命令时的端口分配：
- **应用服务器**: 3000
- **文档服务器**: 3001

## 开发工作流

### 1. 日常开发

```bash
# 启动完整开发环境
pnpm dev:all

# 在浏览器中打开两个标签页
# - http://localhost:3000 (应用)
# - http://localhost:5173 (文档)
```

### 2. 仅开发应用

```bash
# 只启动应用服务器
pnpm dev
```

### 3. 仅开发文档

```bash
# 只启动文档服务器
pnpm docs:dev
```

### 4. 避免端口冲突

```bash
# 使用不同端口
pnpm dev:both
# 应用: http://localhost:3000
# 文档: http://localhost:3001
```

## 推荐 VS Code 插件

- **ESLint** / **Prettier** - 代码质量和格式化
- **Vue - Official（Volar）** - Vue 3 支持
- **TypeScript Vue Plugin** - TypeScript 支持
- **i18n Ally** - 国际化支持
- **Auto Rename Tag** - 自动重命名标签
- **Bracket Pair Colorizer** - 括号配对着色
- **GitLens** - Git 增强功能

## VS Code 配置

在 `.vscode/launch.json` 中添加调试配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch App",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "name": "Launch Docs",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/docs"
    }
  ]
}
```

## 浏览器书签

建议在浏览器中创建以下书签：
- 📱 **Atlas Admin App**: http://localhost:3000
- 📚 **Atlas Admin Docs**: http://localhost:5173

## 提交前检查

```bash
# 格式化代码
pnpm format

# 运行代码检查
pnpm lint

# 运行测试
pnpm test:run

# 快速测试（核心模块）
pnpm test:quick

# 完整测试（所有模块）
pnpm test:full

# 生成测试报告
pnpm test:html

# 类型检查
pnpm type-check
```

## 故障排除

### 常见问题

**Q: 端口被占用怎么办？**
A: 使用 `pnpm dev:both` 命令，它会使用不同的端口（3000和3001）。

**Q: 如何停止所有服务？**
A: 在终端中按 `Ctrl+C`，所有服务会同时停止。

**Q: 文档服务器启动失败？**
A: 检查 `docs` 目录是否存在，确保已安装 VitePress 依赖。

**Q: 应用服务器启动失败？**
A: 检查端口是否被占用，尝试使用 `pnpm dev:both` 使用不同端口。

### 日志查看

使用 `pnpm dev:all` 时，输出会带有标签：
```
[APP] Local: http://localhost:3000/
[DOCS] Local: http://localhost:5173/
```

使用 `pnpm dev:smart` 时，会有彩色输出：
```
🚀 Atlas Admin 开发环境启动器
[APP] 启动应用开发服务器...
[DOCS] 启动文档开发服务器...
✅ 开发环境启动成功！
```

## 性能优化

### 开发环境优化

1. **使用 SSD 硬盘**：提高文件监听和热重载性能
2. **关闭不必要的应用**：释放系统资源
3. **使用现代浏览器**：获得更好的开发工具支持

### 网络优化

1. **使用本地网络**：避免网络延迟影响开发体验
2. **配置代理**：如果需要访问外部API，配置适当的代理设置

## 最佳实践

### 1. 开发习惯

- 使用 `pnpm dev:all` 进行日常开发
- 定期查看文档确保API使用正确
- 使用浏览器开发者工具调试

### 2. 代码组织

- 应用代码放在 `src/` 目录
- 文档代码放在 `docs/` 目录
- 保持两个目录的同步更新

### 3. 版本控制

- 同时提交应用和文档的更改
- 使用有意义的提交信息
- 定期更新文档以反映代码变化


