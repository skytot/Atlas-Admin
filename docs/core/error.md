# 错误处理

错误模块提供统一的错误捕获、归一化与上报能力，确保在不同场景中一致地记录与处理异常。

## 模块结构

```
src/core/error/
├── error-handler.ts   # 全局错误处理入口
├── reporter.ts        # 错误上报器
├── types.ts           # 类型定义
├── utils.ts           # 工具函数（归一化等）
└── STRUCTURE.md       # 模块说明
```

## 快速开始

```typescript
import { createApp } from 'vue'
import { setupErrorHandler } from '@/core/error/error-handler'

const app = createApp(App)

setupErrorHandler(app, {
  defaultLevel: 'error',
  captureUnhandledRejection: true
})

app.mount('#app')
```

### 自定义上报

```typescript
import { configureErrorReporter } from '@/core/error/reporter'

configureErrorReporter({
  logToConsole: false,
  tags: ['sentry']
})
```

## 核心功能

### 全局错误捕获
- Vue runtime 错误（`app.config.errorHandler`）
- 未捕获的 Promise 拒绝事件（`unhandledrejection`）
- 自定义错误上报入口（`reportError`）

### 错误归一化
- 对 `Error`、字符串、对象等不同类型统一转换为 `ErrorPayload`
- 自动记录 message、stack、name、cause、timestamp 等信息
- 支持附加 `context`（组件、props、路由、用户等）

### 可扩展上报
- 默认将错误输出到控制台
- 暴露 `configureErrorReporter` 接口，接入第三方服务
- 可通过 `tags` 区分不同来源或环境

## 配置项

### `setupErrorHandler` 选项

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `defaultLevel` | `'error'` | 默认错误等级 |
| `captureUnhandledRejection` | `true` | 是否捕获 `unhandledrejection` |

### `configureErrorReporter` 选项

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `logToConsole` | `true` | 是否在控制台输出错误 |
| `tags` | `[]` | 追加的标签，用于区分来源 |

## 高级用法

### 接入第三方服务

```typescript
import { configureErrorReporter } from '@/core/error/reporter'
import type { ErrorPayload } from '@/core/error/types'

configureErrorReporter({
  logToConsole: false
})

// 自定义 reporter
const customReporter = {
  async report(payload: ErrorPayload) {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
}
```

### 手动上报

```typescript
import { reportError } from '@/core/error/reporter'

try {
  await riskyOperation()
} catch (err) {
  await reportError({
    message: '自定义错误',
    level: 'warning',
    timestamp: Date.now(),
    context: {
      extra: { action: 'riskyOperation' }
    }
  })
}
```

## TODO

- [ ] 集成第三方服务示例（Sentry、Rollbar 等）
- [ ] 提供服务端/SSR 环境适配
- [ ] 增加错误采样与分级策略
