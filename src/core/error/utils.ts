import type { NormalizedError } from './types'
import type { AxiosError } from 'axios'

/**
 * 将未知错误标准化为 NormalizedError 结构。
 * @param {unknown} error 捕获的原始错误
 * @returns {NormalizedError} 标准化后的错误对象
 */
export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof Error) {
    return {
      message: error.message || 'Unknown error',
      name: error.name || 'Error',
      stack: error.stack,
      cause: (error as { cause?: unknown }).cause
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
      name: 'Error'
    }
  }

  if (typeof error === 'object' && error !== null) {
    const serialized = safeStringify(error)
    return {
      message: serialized || Object.prototype.toString.call(error),
      name: 'Error'
    }
  }

  return {
    message: String(error),
    name: 'Error'
  }
}

/**
 * 将未知错误分类为基础维度（网络/超时/HTTP 状态）。
 * 不改变原始错误形态，便于日志与上报。
 */
export function classifyError(error: unknown): {
  isAxios: boolean
  isNetwork: boolean
  isTimeout: boolean
  status?: number
  code?: string
} {
  const ax = error as AxiosError | undefined
  const isAxios = Boolean(ax && (ax as any).isAxiosError)
  const status = (ax?.response?.status as number | undefined) ?? undefined
  const code = (ax?.code as string | undefined) ?? undefined
  const isNetwork = isAxios && !status
  const isTimeout = code === 'ECONNABORTED'
  return { isAxios, isNetwork, isTimeout, status, code }
}

/**
 * 将错误转换为用户可读的信息（UI 友好提示）。
 * 不抛出异常，仅返回字符串。
 */
export function toUserMessage(error: unknown): string {
  const n = normalizeError(error)
  const { isAxios, isNetwork, isTimeout, status } = classifyError(error)
  if (isAxios) {
    if (isTimeout) return '请求超时，请稍后重试'
    if (isNetwork) return '网络异常，请检查连接'
    if (status && status >= 500) return '服务暂时不可用，请稍后再试'
  }
  return n.message || '发生未知错误'
}

/**
 * 安全序列化对象，避免循环引用导致的异常。
 * @param {unknown} value 任意待序列化值
 * @returns {string | undefined} 成功时返回 JSON 字符串
 */
export function safeStringify(value: unknown): string | undefined {
  try {
    return JSON.stringify(value)
  } catch {
    return undefined
  }
}

