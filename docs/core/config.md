# 配置管理

配置管理模块负责统一管理应用配置、环境变量和运行时设置。提供类型安全的配置访问和动态配置更新能力。

## 模块概述

配置管理模块位于 `src/core/config/` 目录下，主要提供：
- 应用基础配置
- 环境变量管理
- 配置类型安全
- 运行时配置访问

## 核心功能

### 应用配置

#### `appConfig`
应用的核心配置对象，包含应用名称、日志开关、API基础URL等。

```typescript
import { appConfig } from '@/core/config/app-config'

console.log('应用名称:', appConfig.appName)
console.log('API地址:', appConfig.apiBaseUrl)
console.log('日志开关:', appConfig.enableLogging)
```

**配置项说明：**

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `appName` | `string` | `'Atlas Admin'` | 应用名称 |
| `enableLogging` | `boolean` | 环境变量决定 | 是否启用日志 |
| `apiBaseUrl` | `string` | `'/api'` | API基础URL |

## 使用示例

### 基础配置访问

```typescript
// 在组件中使用配置
import { appConfig } from '@/core/config/app-config'

export default {
  setup() {
    // 获取API基础URL
    const apiUrl = appConfig.apiBaseUrl
    
    // 检查日志是否启用
    if (appConfig.enableLogging) {
      console.log('日志功能已启用')
    }
    
    return {
      appName: appConfig.appName
    }
  }
}
```

### HTTP客户端配置

```typescript
// 在HTTP客户端中使用配置
import axios from 'axios'
import { appConfig } from '@/core/config/app-config'

export const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000
})
```

### 日志系统配置

```typescript
// 在日志系统中使用配置
import { appConfig } from '@/core/config/app-config'

export const logger = {
  log: (message: string) => {
    if (appConfig.enableLogging) {
      console.log(message)
    }
  }
}
```

## 环境变量配置

### 环境变量映射

配置模块会自动读取以下环境变量：

| 环境变量 | 配置项 | 说明 |
|----------|--------|------|
| `VITE_ENABLE_LOGGING` | `enableLogging` | 是否启用日志功能 |
| `VITE_API_BASE_URL` | `apiBaseUrl` | API服务器地址 |

### 环境变量设置

#### 开发环境 (`.env.development`)

```bash
# 开发环境配置
VITE_ENABLE_LOGGING=true
VITE_API_BASE_URL=http://localhost:3000/api
```

#### 生产环境 (`.env.production`)

```bash
# 生产环境配置
VITE_ENABLE_LOGGING=false
VITE_API_BASE_URL=https://api.yourdomain.com
```

#### 测试环境 (`.env.test`)

```bash
# 测试环境配置
VITE_ENABLE_LOGGING=true
VITE_API_BASE_URL=http://test-api.yourdomain.com
```

## 扩展配置

### 添加新的配置项

```typescript
// 扩展 app-config.ts
export const appConfig = {
  appName: 'Atlas Admin',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 新增配置项
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  theme: import.meta.env.VITE_THEME || 'light',
  maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000
} as const
```

### 类型安全的配置

```typescript
// 定义配置类型
interface AppConfig {
  readonly appName: string
  readonly enableLogging: boolean
  readonly apiBaseUrl: string
  readonly version: string
  readonly theme: 'light' | 'dark'
  readonly maxFileSize: number
  readonly timeout: number
}

export const appConfig: AppConfig = {
  // ... 配置项
}
```

### 动态配置更新

```typescript
// 支持运行时配置更新
class ConfigManager {
  private config = { ...appConfig }
  
  updateConfig(newConfig: Partial<AppConfig>) {
    this.config = { ...this.config, ...newConfig }
  }
  
  getConfig() {
    return { ...this.config }
  }
}

export const configManager = new ConfigManager()
```

## 配置验证

### 环境变量验证

```typescript
// 验证必需的环境变量
function validateEnvironment() {
  const requiredVars = ['VITE_API_BASE_URL']
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      throw new Error(`缺少必需的环境变量: ${varName}`)
    }
  }
}

// 在应用启动时验证
validateEnvironment()
```

### 配置类型检查

```typescript
// 运行时配置检查
function validateConfig(config: any): config is AppConfig {
  return (
    typeof config.appName === 'string' &&
    typeof config.enableLogging === 'boolean' &&
    typeof config.apiBaseUrl === 'string'
  )
}

if (!validateConfig(appConfig)) {
  throw new Error('应用配置验证失败')
}
```

## 最佳实践

### 1. 配置分离

```typescript
// 按功能分离配置
export const apiConfig = {
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
  retries: 3
}

export const uiConfig = {
  theme: appConfig.theme,
  language: 'zh-CN',
  pageSize: 20
}
```

### 2. 配置缓存

```typescript
// 缓存配置避免重复读取
let cachedConfig: AppConfig | null = null

export function getAppConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = { ...appConfig }
  }
  return cachedConfig
}
```

### 3. 配置热更新

```typescript
// 支持配置热更新
export function updateConfig(newConfig: Partial<AppConfig>) {
  Object.assign(appConfig, newConfig)
  
  // 通知其他模块配置已更新
  window.dispatchEvent(new CustomEvent('config-updated', {
    detail: newConfig
  }))
}
```

## 常见问题

### Q: 如何在不同环境中使用不同的配置？
A: 通过环境变量文件（`.env.development`、`.env.production`等）设置不同的环境变量值。

### Q: 配置项可以动态修改吗？
A: 当前配置是只读的，如需动态修改，建议使用配置管理器模式。

### Q: 如何添加新的环境变量？
A: 在环境变量文件中添加以 `VITE_` 开头的变量，然后在配置模块中读取。

### Q: 配置验证失败怎么办？
A: 检查环境变量是否正确设置，确保所有必需变量都已配置。

## 相关模块

- [HTTP客户端](./http.md) - 使用API配置
- [日志系统](./logger.md) - 使用日志配置
- [错误处理](./error.md) - 错误处理配置
