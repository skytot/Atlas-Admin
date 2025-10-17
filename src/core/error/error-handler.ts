import type { App, ComponentPublicInstance } from 'vue'
import { reportError } from './reporter'
import { normalizeError } from './utils'
import type { ErrorContext, ErrorLevel } from './types'

/**
 * 错误处理器配置项。
 */
interface ErrorHandlerOptions {
  /** 默认错误级别 */
  defaultLevel?: ErrorLevel
  /** 是否捕获全局未处理的 Promise 拒绝 */
  captureUnhandledRejection?: boolean
}

const DEFAULT_HANDLER_OPTIONS: Required<ErrorHandlerOptions> = {
  defaultLevel: 'error',
  captureUnhandledRejection: true
}

/**
 * 安装全局错误处理器，将 Vue 错误输出到错误上报器。
 * @param {App} app 当前 Vue 应用实例
 * @param {ErrorHandlerOptions} [options] 错误处理器配置
 */
export function setupErrorHandler(app: App, options: ErrorHandlerOptions = {}): void {
  const mergedOptions: Required<ErrorHandlerOptions> = {
    ...DEFAULT_HANDLER_OPTIONS,
    ...options
  }

  app.config.errorHandler = async (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => {
    const context: ErrorContext = {
      componentName: instance?.$options?.name,
      props: instance?.$props,
      lifecycleHook: info
    }

    await reportError(createPayload(err, mergedOptions.defaultLevel, context))
  }

  if (mergedOptions.captureUnhandledRejection) {
    window.addEventListener('unhandledrejection', async (event: PromiseRejectionEvent) => {
      await reportError(
        createPayload(event.reason, mergedOptions.defaultLevel, {
          lifecycleHook: 'unhandledrejection'
        })
      )
    })
  }
}

/**
 * 构建标准化的错误上报载荷。
 * @param {unknown} err 捕获的错误对象
 * @param {ErrorLevel} level 错误级别
 * @param {ErrorContext} [context] 错误上下文信息
 * @returns 包含错误详情的 payload
 */
function createPayload(err: unknown, level: ErrorLevel, context?: ErrorContext) {
  const normalized = normalizeError(err)

  return {
    message: normalized.message,
    name: normalized.name,
    stack: normalized.stack,
    cause: normalized.cause,
    level,
    timestamp: Date.now(),
    context
  }
}
