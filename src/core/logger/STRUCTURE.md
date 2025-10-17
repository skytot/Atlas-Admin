# 日志模块结构说明

## 模块架构

```
src/core/logger/
├── logger.ts                 # 核心 Logger 实现与工厂
├── types.ts                  # 类型定义
└── transports/
    ├── console.transport.ts  # 默认控制台输出
    └── error-transport.ts    # 与错误上报模块联动
```

## 设计原则

1. **可扩展**：通过 `addTransport` / `removeTransport` 扩展日志输出方式
2. **灵活控制**：支持运行时调整级别、启用/禁用日志与 Transport
3. **类型安全**：统一的 `LogPayload`、`LogLevel` 等类型保证一致性
4. **上下文友好**：支持追加上下文（如模块名、用户信息）与标签

## 使用示例

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

创建定制 Logger：

```typescript
import { createLogger } from '@/core/logger/logger'
import { consoleTransport } from '@/core/logger/transports/console.transport'

const customLogger = createLogger({
  level: 'debug',
  transports: [consoleTransport],
  context: { module: 'custom' }
})

customLogger.debug('自定义日志')
```

## TODO

- [ ] 支持文件/远程存储 Transport 示例
- [ ] 提供请求 ID 自动注入方案
- [ ] 与性能监控（Performance API）打通
