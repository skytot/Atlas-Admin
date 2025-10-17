import { logger } from '@/core/logger/logger'
import { reportError } from '@/core/error/reporter'
import type { HttpErrorLike } from './types'

/**
 * 默认 HTTP 错误处理：记录日志并按需上报。
 * @param {HttpErrorLike} error 标准化 HTTP 错误
 */
export async function handleHttpError(error: HttpErrorLike): Promise<void> {
  logger.error('HTTP 请求失败', {
    module: 'http',
    extra: {
      status: error.status,
      url: error.config.url,
      method: error.config.method,
      code: error.code
    }
  })

  if (!error.silent) {
    await reportError({
      message: error.message,
      name: error.name,
      stack: error.stack,
      level: 'error',
      timestamp: Date.now(),
      context: {
        route: window.location.pathname,
        extra: {
          status: error.status,
          code: error.code,
          url: error.config.url,
          method: error.config.method,
          data: error.config.data
        }
      },
      tags: ['http']
    })
  }
}

