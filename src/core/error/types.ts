/**
 * 错误模块类型定义
 */

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical'

export interface ErrorContext {
  componentName?: string
  props?: Record<string, unknown>
  lifecycleHook?: string
  route?: string
  user?: Record<string, unknown>
  extra?: Record<string, unknown>
  info?: string
}

export interface ErrorPayload {
  message: string
  stack?: string
  name?: string
  level: ErrorLevel
  cause?: unknown
  timestamp: number
  context?: ErrorContext
  tags?: string[]
}

export interface ErrorReporter {
  report: (payload: ErrorPayload) => Promise<void> | void
}

export interface ErrorReporterOptions {
  /** 是否在控制台打印错误，默认 true */
  logToConsole?: boolean
  /** 自定义标签，会自动追加到 payload.tags */
  tags?: string[]
}

export interface NormalizedError {
  message: string
  name: string
  stack?: string
  cause?: unknown
}

