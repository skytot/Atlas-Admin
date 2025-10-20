import type { LogContext } from './types'

/**
 * 合并日志上下文（纯函数）。
 * - 不修改入参，返回新对象
 * - 会合并 nested 的 extra 字段
 */
export function withContext(base?: LogContext, extra?: LogContext): LogContext {
  return {
    ...(base ?? {}),
    ...(extra ?? {}),
    extra: {
      ...(base?.extra ?? {}),
      ...(extra?.extra ?? {})
    }
  }
}

/**
 * 从错误对象提取可用的上下文信息（纯函数）。
 * 仅读取字段，不做转换或上报。
 */
export function toErrorContext(error: unknown): LogContext {
  if (error && typeof error === 'object') {
    const e = error as any
    return {
      module: 'error',
      action: e.name || 'Error',
      extra: {
        message: e.message,
        stack: e.stack,
        code: e.code,
        status: e.response?.status,
        responseData: e.response?.data
      }
    }
  }
  return { module: 'error', action: 'Unknown', extra: { value: String(error) } }
}


