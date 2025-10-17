import type { NormalizedError } from './types'

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

