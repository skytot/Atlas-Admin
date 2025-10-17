import { consoleTransport } from './transports/console.transport'
import { errorTransport } from './transports/error-transport'
import type { LogLevel, Logger, LoggerOptions, LogTransport, LogPayload, LogContext } from './types'

/**
 * 日志级别优先级（数值越大，优先级越高）。
 */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
}

// Logger 默认配置
/**
 * Logger 默认配置，提供级别、上下文与默认 Transport。
 */
const DEFAULT_OPTIONS: Required<Omit<LoggerOptions, 'transports'>> & { transports: LogTransport[] } = {
  level: 'info',
  context: {} as LogContext,
  tags: [],
  transports: [consoleTransport, errorTransport],
  enabled: true
}

/**
 * 内部 Logger 实现。
 * - 支持动态设置级别、开关
 * - 允许运行时增删 Transport
 */
class InternalLogger implements Logger {
  private level: LogLevel
  private transports: Set<LogTransport>
  private baseContext: LogContext
  private baseTags: string[]
  private enabled: boolean

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? DEFAULT_OPTIONS.level
    this.baseContext = mergeContext(DEFAULT_OPTIONS.context, options.context)
    this.baseTags = [...new Set([...(options.tags ?? []), ...DEFAULT_OPTIONS.tags])]
    this.transports = new Set(options.transports ?? DEFAULT_OPTIONS.transports)
    this.enabled = options.enabled ?? DEFAULT_OPTIONS.enabled
  }

  /** 输出 debug 日志。 */
  debug(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('debug', message, context, args)
  }

  /** 输出 info 日志。 */
  info(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('info', message, context, args)
  }

  /** 输出 warn 日志。 */
  warn(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('warn', message, context, args)
  }

  /** 输出 error 日志。 */
  error(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('error', message, context, args)
  }

  /** 设置日志输出级别。 */
  setLevel(level: LogLevel): void {
    this.level = level
  }

  /** 设置日志开关。 */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /** 启用日志输出。 */
  enable(): void {
    this.setEnabled(true)
  }

  /** 禁用日志输出。 */
  disable(): void {
    this.setEnabled(false)
  }

  /** 增加自定义 Transport。 */
  addTransport(transport: LogTransport): void {
    this.transports.add(transport)
  }

  /** 移除自定义 Transport。 */
  removeTransport(transport: LogTransport): void {
    this.transports.delete(transport)
  }

  /**
   * 核心日志输出逻辑。
   * - 根据级别/开关判断是否输出
   * - 构建标准化 payload
   * - 调用全部 transport
   */
  private async log(level: LogLevel, message: string, context?: LogContext, args?: unknown[]): Promise<void> {
    if (!this.enabled || !this.shouldLog(level)) return

    const payload: LogPayload = {
      level,
      message,
      args,
      timestamp: Date.now(),
      context: mergeContext(this.baseContext, context),
      tags: this.baseTags
    }

    await Promise.all(Array.from(this.transports).map(transport => transport.log(payload)))
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level]
  }
}

export const logger: Logger = new InternalLogger()

/** 创建独立的 Logger 实例。 */
export function createLogger(options?: LoggerOptions): Logger {
    return new InternalLogger(options)
}

/** 合并全局与局部上下文。 */
function mergeContext(base?: LogContext, extra?: LogContext): LogContext {
  return {
    ...(base ?? {}),
    ...(extra ?? {}),
    extra: {
      ...(base?.extra ?? {}),
      ...(extra?.extra ?? {})
    }
  }
}
