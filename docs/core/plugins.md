# 插件体系

插件体系模块负责Vue应用的插件注册和初始化，提供统一的插件管理机制。

## 模块概述

插件体系模块位于 `src/core/plugins/` 目录下，主要提供：
- Vue插件统一注册
- 插件初始化管理
- 插件配置和依赖管理
- 插件生命周期控制

## 核心功能

### 插件注册器

#### `setupPlugins(app: App)`
统一注册所有Vue插件到应用实例。

```typescript
import { setupPlugins } from '@/core/plugins'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 设置所有插件
setupPlugins(app)

app.mount('#app')
```

**已注册的插件：**
- **Pinia**: 状态管理
- **Vue Router**: 路由管理
- **错误处理器**: 全局错误处理

## 使用示例

### 基础插件注册

```typescript
// 在main.ts中使用
import { createApp } from 'vue'
import { setupPlugins } from '@/core/plugins'
import App from './App.vue'

const app = createApp(App)

// 注册所有核心插件
setupPlugins(app)

app.mount('#app')
```

### 自定义插件注册

```typescript
// 扩展插件注册器
export function setupPlugins(app: App): void {
  // 核心插件
  app.use(createPinia())
  app.use(router)
  setupErrorHandler(app)
  
  // 自定义插件
  app.use(createI18n())
  app.use(createToast())
  app.use(createLoading())
}
```

## 扩展功能

### 插件管理器

```typescript
// 插件管理器
export class PluginManager {
  private plugins: Plugin[] = []
  private app: App | null = null
  
  register(plugin: Plugin) {
    this.plugins.push(plugin)
  }
  
  install(app: App) {
    this.app = app
    
    // 按优先级排序插件
    this.plugins.sort((a, b) => (a.priority || 0) - (b.priority || 0))
    
    // 安装插件
    this.plugins.forEach(plugin => {
      try {
        plugin.install(app)
        console.log(`插件 ${plugin.name} 安装成功`)
      } catch (error) {
        console.error(`插件 ${plugin.name} 安装失败:`, error)
      }
    })
  }
  
  uninstall(pluginName: string) {
    const plugin = this.plugins.find(p => p.name === pluginName)
    if (plugin && plugin.uninstall) {
      plugin.uninstall(this.app!)
    }
  }
}

export const pluginManager = new PluginManager()
```

### 插件接口定义

```typescript
// 插件接口
export interface Plugin {
  name: string
  version?: string
  priority?: number
  dependencies?: string[]
  install(app: App): void
  uninstall?(app: App): void
}

// 示例插件
export const i18nPlugin: Plugin = {
  name: 'i18n',
  version: '1.0.0',
  priority: 1,
  install(app: App) {
    const i18n = createI18n({
      locale: 'zh-CN',
      messages: {
        'zh-CN': zhCN,
        'en-US': enUS
      }
    })
    
    app.use(i18n)
  }
}

export const toastPlugin: Plugin = {
  name: 'toast',
  version: '1.0.0',
  priority: 2,
  install(app: App) {
    app.config.globalProperties.$toast = {
      success: (message: string) => showToast(message, 'success'),
      error: (message: string) => showToast(message, 'error'),
      warning: (message: string) => showToast(message, 'warning'),
      info: (message: string) => showToast(message, 'info')
    }
  }
}
```

### 条件插件加载

```typescript
// 条件插件加载
export function setupConditionalPlugins(app: App) {
  // 开发环境插件
  if (import.meta.env.DEV) {
    app.use(createDevtools())
  }
  
  // 生产环境插件
  if (import.meta.env.PROD) {
    app.use(createAnalytics())
  }
  
  // 功能开关插件
  if (appConfig.enableLogging) {
    app.use(createLogger())
  }
  
  if (appConfig.enablePWA) {
    app.use(createPWA())
  }
}
```

## 常用插件

### 国际化插件

```typescript
// 国际化插件
export function createI18nPlugin() {
  return {
    name: 'i18n',
    install(app: App) {
      const i18n = createI18n({
        locale: localStorage.getItem('locale') || 'zh-CN',
        fallbackLocale: 'en-US',
        messages: {
          'zh-CN': zhCN,
          'en-US': enUS
        }
      })
      
      app.use(i18n)
      
      // 全局属性
      app.config.globalProperties.$t = i18n.global.t
    }
  }
}
```

### 主题插件

```typescript
// 主题插件
export function createThemePlugin() {
  return {
    name: 'theme',
    install(app: App) {
      const theme = reactive({
        mode: localStorage.getItem('theme') || 'light',
        colors: {
          primary: '#409EFF',
          success: '#67C23A',
          warning: '#E6A23C',
          danger: '#F56C6C'
        }
      })
      
      // 应用主题
      const applyTheme = (mode: string) => {
        document.documentElement.setAttribute('data-theme', mode)
        localStorage.setItem('theme', mode)
      }
      
      // 切换主题
      const toggleTheme = () => {
        theme.mode = theme.mode === 'light' ? 'dark' : 'light'
        applyTheme(theme.mode)
      }
      
      // 全局属性
      app.config.globalProperties.$theme = theme
      app.config.globalProperties.$toggleTheme = toggleTheme
      
      // 初始化主题
      applyTheme(theme.mode)
    }
  }
}
```

### 权限插件

```typescript
// 权限插件
export function createPermissionPlugin() {
  return {
    name: 'permission',
    install(app: App) {
      const permission = {
        hasRole: (role: string) => {
          const userStore = useUserStore()
          return userStore.roles.includes(role)
        },
        
        hasPermission: (permission: string) => {
          const userStore = useUserStore()
          return userStore.permissions.includes(permission)
        },
        
        hasAnyRole: (roles: string[]) => {
          const userStore = useUserStore()
          return roles.some(role => userStore.roles.includes(role))
        },
        
        hasAllRoles: (roles: string[]) => {
          const userStore = useUserStore()
          return roles.every(role => userStore.roles.includes(role))
        }
      }
      
      // 全局属性
      app.config.globalProperties.$permission = permission
      
      // 全局指令
      app.directive('permission', {
        mounted(el, binding) {
          const { value } = binding
          if (!permission.hasPermission(value)) {
            el.style.display = 'none'
          }
        }
      })
    }
  }
}
```

## 插件配置

### 插件配置文件

```typescript
// 插件配置
export const pluginConfig = {
  // 核心插件
  core: {
    pinia: { enabled: true },
    router: { enabled: true },
    errorHandler: { enabled: true }
  },
  
  // 功能插件
  features: {
    i18n: { enabled: true, defaultLocale: 'zh-CN' },
    theme: { enabled: true, defaultTheme: 'light' },
    permission: { enabled: true },
    toast: { enabled: true, duration: 3000 }
  },
  
  // 开发插件
  development: {
    devtools: { enabled: import.meta.env.DEV },
    logger: { enabled: import.meta.env.DEV }
  }
}
```

### 动态插件加载

```typescript
// 动态插件加载
export async function loadPlugin(pluginName: string) {
  try {
    const plugin = await import(`@/plugins/${pluginName}`)
    return plugin.default
  } catch (error) {
    console.error(`加载插件 ${pluginName} 失败:`, error)
    return null
  }
}

// 按需加载插件
export async function setupDynamicPlugins(app: App) {
  const enabledPlugins = Object.entries(pluginConfig.features)
    .filter(([_, config]) => config.enabled)
    .map(([name, _]) => name)
  
  for (const pluginName of enabledPlugins) {
    const plugin = await loadPlugin(pluginName)
    if (plugin) {
      app.use(plugin)
    }
  }
}
```

## 最佳实践

### 1. 插件命名规范

```typescript
// 插件命名规范
export const pluginNaming = {
  // 使用描述性名称
  'user-management': createUserManagementPlugin(),
  'data-visualization': createDataVisualizationPlugin(),
  
  // 使用版本号
  'api-client-v2': createApiClientPlugin(),
  
  // 使用功能前缀
  'core-auth': createAuthPlugin(),
  'core-logger': createLoggerPlugin()
}
```

### 2. 插件依赖管理

```typescript
// 插件依赖管理
export function resolvePluginDependencies(plugins: Plugin[]) {
  const resolved: Plugin[] = []
  const visited = new Set<string>()
  
  const resolve = (plugin: Plugin) => {
    if (visited.has(plugin.name)) return
    
    // 解析依赖
    if (plugin.dependencies) {
      plugin.dependencies.forEach(depName => {
        const dep = plugins.find(p => p.name === depName)
        if (dep) {
          resolve(dep)
        }
      })
    }
    
    visited.add(plugin.name)
    resolved.push(plugin)
  }
  
  plugins.forEach(resolve)
  return resolved
}
```

### 3. 插件错误处理

```typescript
// 插件错误处理
export function safePluginInstall(app: App, plugin: Plugin) {
  try {
    plugin.install(app)
    console.log(`插件 ${plugin.name} 安装成功`)
  } catch (error) {
    console.error(`插件 ${plugin.name} 安装失败:`, error)
    
    // 错误上报
    if (appConfig.enableErrorReporting) {
      reportError({
        type: 'plugin-install-error',
        plugin: plugin.name,
        error: error.message
      })
    }
  }
}
```

## 常见问题

### Q: 如何添加新的插件？
A: 实现Plugin接口，在setupPlugins函数中注册，或使用插件管理器动态注册。

### Q: 如何处理插件依赖？
A: 在插件定义中声明dependencies，使用依赖解析器按正确顺序安装。

### Q: 如何实现插件热更新？
A: 使用插件管理器的uninstall和install方法，支持运行时插件更新。

### Q: 如何调试插件问题？
A: 启用插件安装日志，使用开发工具检查插件状态和依赖关系。

## 相关模块

- [配置管理](./config.md) - 插件配置选项
- [错误处理](./error.md) - 插件错误处理
- [状态管理](./store.md) - 插件状态管理
