# 📚 文档部署指南

本文档介绍如何配置和使用 GitHub Actions 自动部署文档到 GitHub Pages。

## 🚀 部署方案

项目提供了两种文档部署方案：

### 方案一：GitHub Pages Actions（推荐）

使用 `.github/workflows/docs.yml` 文件，这是 GitHub 官方推荐的部署方式。

**特点：**
- ✅ 使用 GitHub Pages Actions
- ✅ 支持自定义域名
- ✅ 更好的安全性
- ✅ 官方支持

**配置步骤：**

1. **启用 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **设置权限**
   - 进入 Settings → Actions → General
   - 在 "Workflow permissions" 部分选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"

3. **推送代码**
   ```bash
   git add .
   git commit -m "feat: add docs deployment workflow"
   git push origin main
   ```

### 方案二：gh-pages 分支部署

使用 `.github/workflows/docs-gh-pages.yml` 文件，传统的部署方式。

**特点：**
- ✅ 兼容性好
- ✅ 支持自定义域名
- ✅ 使用 gh-pages 分支

**配置步骤：**

1. **启用 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"

2. **推送代码**
   ```bash
   git add .
   git commit -m "feat: add docs deployment workflow"
   git push origin main
   ```

## 🔧 工作流配置

### 触发条件

文档部署会在以下情况下自动触发：

- 推送到 `main` 或 `develop` 分支
- 修改 `docs/` 目录下的文件
- 修改工作流配置文件
- 手动触发（workflow_dispatch）

### 构建过程

1. **环境准备**
   - 使用 Ubuntu 最新版本
   - Node.js 20.x
   - pnpm 8.x

2. **依赖安装**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **文档构建**
   ```bash
   cd docs
   pnpm build
   ```

4. **部署到 GitHub Pages**
   - 使用官方 GitHub Pages Actions
   - 或使用 peaceiris/actions-gh-pages

## 🌐 访问文档

部署成功后，文档将在以下地址访问：

- **GitHub Pages**: `https://your-username.github.io/your-repo-name`
- **自定义域名**: `https://docs.your-domain.com`（如果配置了 CNAME）

## 🔍 故障排除

### 常见问题

1. **权限不足**
   - 检查仓库的 Actions 权限设置
   - 确保有 Pages 写入权限

2. **构建失败**
   - 检查 `docs/` 目录是否存在
   - 确认 VitePress 配置正确
   - 查看构建日志

3. **部署失败**
   - 检查 GitHub Pages 设置
   - 确认分支和目录配置正确

### 调试步骤

1. **查看工作流日志**
   - 进入 Actions 标签页
   - 点击最新的工作流运行
   - 查看详细日志

2. **本地测试**
   ```bash
   cd docs
   pnpm build
   # 检查 dist 目录是否生成
   ```

3. **手动触发**
   - 进入 Actions 标签页
   - 选择 "Deploy Documentation" 工作流
   - 点击 "Run workflow"

## 📝 自定义配置

### 自定义域名

在仓库根目录创建 `CNAME` 文件：
```
docs.your-domain.com
```

### 环境变量

可以在工作流中添加环境变量：
```yaml
env:
  NODE_ENV: production
  VITE_APP_TITLE: "Your App Title"
```

### 构建优化

```yaml
- name: 🏗️ Build documentation
  run: |
    cd docs
    pnpm build
  env:
    NODE_ENV: production
    VITE_APP_VERSION: ${{ github.ref_name }}
```

## 🎯 最佳实践

1. **分支策略**
   - 主分支：`main`（生产环境）
   - 开发分支：`develop`（测试环境）

2. **文件监控**
   - 只监控 `docs/` 目录变化
   - 避免不必要的构建

3. **缓存优化**
   - 使用 pnpm 缓存
   - 缓存 node_modules

4. **安全考虑**
   - 使用最小权限原则
   - 定期更新 Actions 版本

## 📚 相关文档

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [VitePress 部署指南](https://vitepress.dev/guide/deploy)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
