# 错误模块结构说明

## 模块架构

```
src/core/error/
├── error-handler.ts   # 全局错误捕获与上报
├── reporter.ts        # 错误上报器，可扩展第三方服务
├── types.ts           # 类型定义（ErrorPayload、ErrorLevel 等）
├── utils.ts           # 错误归一化与工具函数
└── STRUCTURE.md       # 模块说明（本文件）
```

## 设计原则

1. **单一职责**：捕获、归一化、上报分离，方便定制
2. **默认可用**：内置默认上报器，初始即可记录错误
3. **可扩展**：提供 `configureErrorReporter`，接入 Sentry、数据埋点等
4. **类型一致**：所有结构统一由 `types.ts` 定义，便于维护

## 基本使用

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

自定义上报器：

```typescript
import { configureErrorReporter } from '@/core/error/reporter'

configureErrorReporter({
  logToConsole: false,
  tags: ['sentry']
})
```

## TODO

- [ ] 集成第三方服务示例（Sentry、Rollbar 等）
- [ ] 提供服务端/SSR 环境适配
- [ ] 增加错误采样与分级策略
