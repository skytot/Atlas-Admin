# 日志模块

日志模块提供统一的日志记录能力，支持多 Transport 输出、上下文注入以及与错误上报模块联动。

## 模块结构

```
src/core/logger/
├── logger.ts                 # 核心 Logger 实现
├── types.ts                  # 类型定义
└── transports/
    ├── console.transport.ts  # 默认控制台输出
    └── error-transport.ts    # 错误级别日志同步到错误上报模块
```

## 快速开始

```typescript
import { logger } from '@/core/logger/logger'

logger.info('应用启动')
logger.debug('请求参数', { module: 'api', action: 'fetchUser' }, userId)

try {
  await riskyAction()
} catch (error) {
  logger.error('执行 riskyAction 失败', { module: 'service' }, error)
}
```

## 创建自定义 Logger

```typescript
import { createLogger } from '@/core/logger/logger'
import { consoleTransport } from '@/core/logger/transports/console.transport'

const customLogger = createLogger({
  level: 'debug',
  transports: [consoleTransport],
  context: { module: 'custom' },
  tags: ['front-end']
})

customLogger.debug('自定义日志')
```

## 最小实例与工具

```ts
import { logger, createLogger, withContext, toErrorContext } from '@/core/logger'

// 默认实例（仅 console 输出）
logger.info('应用启动', { module: 'app' })

// 自定义实例
const appLogger = createLogger({ level: 'debug', context: { module: 'user' } })
appLogger.debug('加载用户列表')

// 纯函数工具：合并上下文
const ctx = withContext({ module: 'api' }, { action: 'fetch' })
logger.info('请求开始', ctx)

// 从错误提取上下文
try {
  throw new Error('网络异常')
} catch (e) {
  logger.error('请求失败', toErrorContext(e))
}
```

## 配置说明

### LoggerOptions

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `level` | `'info'` | 当前 Logger 的最低输出级别 |
| `transports` | `[consoleTransport, errorTransport]` | 输出目标列表 |
| `context` | `{}` | 全局上下文，自动合并到每条日志 |
| `tags` | `[]` | 全局标签 |
| `enabled` | `true` | 是否启用日志（可通过 `logger.enable()` / `logger.disable()` 切换） |

### LogContext

可在调用时传入，用于描述当前场景：

```typescript
logger.info('用户登录', {
  module: 'auth',
  userId: '123',
  extra: { role: 'admin' }
})
```

### Transport

自定义 Transport 只需实现 `log(payload: LogPayload)` 即可：

```typescript
import type { LogPayload, LogTransport } from '@/core/logger/types'

const remoteTransport: LogTransport = {
  async log(payload: LogPayload) {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
}

logger.addTransport(remoteTransport)
```

### 启用/禁用日志

```typescript
import { logger } from '@/core/logger/logger'

logger.disable() // 全局禁用日志
logger.enable()  // 重新启用

// 或者：logger.setEnabled(import.meta.env.DEV)
```

### 动态调整输出级别与 Transport

```typescript
logger.setLevel('warn')
logger.removeTransport(consoleTransport)
logger.addTransport(remoteTransport)
```

## 与错误模块联动

- 默认 `error` 级别日志会通过 `errorTransport` 自动调用 `reportError`
- 可结合 `setupErrorHandler` 实现统一错误捕获与日志记录

## TODO

- [ ] 提供远程 Transport 示例（如发送到日志服务器）
- [ ] 自动注入请求 ID/Trace ID
- [ ] 与 Performance API 整合，记录慢操作
