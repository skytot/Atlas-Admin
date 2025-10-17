export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  /** 触发日志的业务模块 */
  module?: string
  /** 当前操作名称 */
  action?: string
  /** 请求唯一标识 */
  requestId?: string
  /** 当前用户标识 */
  userId?: string
  /** 额外扩展上下文 */
  extra?: Record<string, unknown>
}

export interface LogPayload {
  /** 日志级别 */
  level: LogLevel
  /** 主体内容 */
  message: string
  /** 附加参数 */
  args?: unknown[]
  /** 输出时间戳 */
  timestamp: number
  /** 上下文信息 */
  context?: LogContext
  /** 自定义标签 */
  tags?: string[]
}

export interface LogTransport {
  log: (payload: LogPayload) => Promise<void> | void
}

export interface LoggerOptions {
  /** 默认日志级别 */
  level?: LogLevel
  /** 自定义传输器 */
  transports?: LogTransport[]
  /** 全局上下文 */
  context?: LogContext
  /** 全局标签 */
  tags?: string[]
  /** 是否启用日志 */
  enabled?: boolean
}

export interface Logger {
  debug: (message: string, context?: LogContext, ...args: unknown[]) => Promise<void> | void
  info: (message: string, context?: LogContext, ...args: unknown[]) => Promise<void> | void
  warn: (message: string, context?: LogContext, ...args: unknown[]) => Promise<void> | void
  error: (message: string, context?: LogContext, ...args: unknown[]) => Promise<void> | void
  setLevel: (level: LogLevel) => void
  setEnabled: (enabled: boolean) => void
  enable: () => void
  disable: () => void
  addTransport: (transport: LogTransport) => void
  removeTransport: (transport: LogTransport) => void
}

