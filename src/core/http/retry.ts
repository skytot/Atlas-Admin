import { logger } from '@/core/logger/logger'
import type { HttpErrorLike, HttpInternalRequestConfig, RetryStrategy } from './types'

const DEFAULT_RETRY_STATUS = [408, 429, 500, 502, 503, 504]

/**
 * 根据重试策略决定是否重发请求，返回新的配置或 null。
 * @param {HttpErrorLike<T>} error 当前错误信息
 * @param {HttpInternalRequestConfig<T>} config 请求配置
 * @returns {Promise<HttpInternalRequestConfig<T> | null>} 下一次请求配置
 */
export async function handleRetry<T>(
  error: HttpErrorLike<T>,
  config: HttpInternalRequestConfig<T>
): Promise<HttpInternalRequestConfig<T> | null> {
  const strategy = resolveRetryStrategy(config)
  if (!strategy) return null

  const attempt = (config.__retryCount ?? 0) + 1
  if (attempt > strategy.retries) return null

  if (!shouldRetry(error, strategy, attempt)) return null

  const delay = resolveDelay(strategy, attempt, error)
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  logger.warn('触发 HTTP 重试', {
    module: 'http',
    extra: {
      attempt,
      url: config.url,
      method: config.method,
      status: error.status,
      delay
    }
  })

  return {
    ...config,
    __retryCount: attempt
  }
}

function resolveRetryStrategy<T>(config: HttpInternalRequestConfig<T>): RetryStrategy | null {
  if (config.__skipRetry) return null
  if (config.retry === false) return null
  if (config.retry) return config.retry
  return config.defaultRetry ?? null
}

function shouldRetry<T>(
  error: HttpErrorLike<T>,
  strategy: RetryStrategy,
  attempt: number
): boolean {
  if (error.isCancelled) return false

  if (strategy.shouldRetry) {
    return strategy.shouldRetry(error, attempt)
  }

  const status = error.status ?? 0
  const retryStatuses = strategy.retryOnStatus ?? DEFAULT_RETRY_STATUS
  if (status && retryStatuses.includes(status)) return true

  return error.isNetworkError
}

function resolveDelay<T>(
  strategy: RetryStrategy,
  attempt: number,
  error: HttpErrorLike<T>
): number {
  if (typeof strategy.delay === 'function') {
    return strategy.delay(attempt, error)
  }

  const baseDelay = strategy.delay ?? 0
  if (baseDelay <= 0) return 0

  const multiplier = strategy.backoffMultiplier ?? 1
  return baseDelay * Math.pow(multiplier, attempt - 1)
}

