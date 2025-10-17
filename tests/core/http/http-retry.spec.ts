import { describe, expect, it, beforeEach } from 'vitest'
import { handleRetry } from '@/core/http/retry'
import type { HttpErrorLike, HttpInternalRequestConfig, RetryStrategy } from '@/core/http/types'

/**
 * 单元测试目标：验证 `core/http/retry` 模块的重试逻辑。
 * 覆盖场景：
 * - 重试策略解析；
 * - 重试条件判断；
 * - 延迟计算；
 * - 重试次数限制；
 * - 自定义重试逻辑。
 */
describe('core/http/http-retry', () => {
  let mockConfig: HttpInternalRequestConfig
  let mockError: HttpErrorLike

  beforeEach(() => {
    mockConfig = {
      url: '/test',
      method: 'get',
      headers: {} as any
    }

    mockError = {
      name: 'HttpError',
      message: 'Test error',
      status: 500,
      isNetworkError: false,
      isCancelled: false,
      silent: false,
      config: mockConfig,
      response: undefined,
      originalError: new Error('Test error')
    }
  })

  /**
   * 测试目标：默认重试策略应被正确应用。
   * 输入：500错误和默认重试策略。
   * 预期：返回重试配置。
   */
  it('应当应用默认重试策略', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      retryOnStatus: [500]
    }

    mockConfig.defaultRetry = retryStrategy

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
  })

  /**
   * 测试目标：请求级别的重试策略应覆盖默认策略。
   * 输入：请求配置包含重试策略。
   * 预期：使用请求级别的重试策略。
   */
  it('应当使用请求级别重试策略', async () => {
    const requestRetry: RetryStrategy = {
      retries: 1,
      delay: 50,
      retryOnStatus: [500]
    }

    const defaultRetry: RetryStrategy = {
      retries: 3,
      delay: 200,
      retryOnStatus: [500]
    }

    mockConfig.retry = requestRetry
    mockConfig.defaultRetry = defaultRetry

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
  })

  /**
   * 测试目标：重试次数超限时应返回null。
   * 输入：重试次数超过限制。
   * 预期：返回null。
   */
  it('应当处理重试次数超限', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: 100,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy
    mockConfig.__retryCount = 1 // 已达到重试限制

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：网络错误应触发重试。
   * 输入：网络错误（无状态码）。
   * 预期：返回重试配置。
   */
  it('应当重试网络错误', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      retryOnStatus: [] // 不基于状态码重试
    }

    mockError.isNetworkError = true
    mockError.status = undefined
    mockConfig.retry = retryStrategy

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
  })

  /**
   * 测试目标：取消的请求不应重试。
   * 输入：取消的请求。
   * 预期：返回null。
   */
  it('应当跳过已取消请求的重试', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      retryOnStatus: [500]
    }

    mockError.isCancelled = true
    mockConfig.retry = retryStrategy

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：自定义重试条件应被正确应用。
   * 输入：自定义shouldRetry函数。
   * 预期：重试逻辑按自定义条件执行。
   */
  it('应当支持自定义重试条件', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      shouldRetry: (error) => {
        return error.status === 429
      }
    }

    mockError.status = 429
    mockConfig.retry = retryStrategy

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
  })

  /**
   * 测试目标：自定义重试条件返回false时应不重试。
   * 输入：自定义shouldRetry函数返回false。
   * 预期：返回null。
   */
  it('应当支持自定义重试条件拒绝', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      shouldRetry: () => false
    }

    mockConfig.retry = retryStrategy

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：固定延迟应被正确应用。
   * 输入：固定延迟值。
   * 预期：延迟时间正确。
   */
  it('应当支持固定延迟', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: 200,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy

    const startTime = Date.now()
    const result = await handleRetry(mockError, mockConfig)
    const endTime = Date.now()

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
    expect(endTime - startTime).toBeGreaterThanOrEqual(200)
  })

  /**
   * 测试目标：指数退避延迟应被正确计算。
   * 输入：配置了backoffMultiplier的重试策略。
   * 预期：延迟时间按指数增长。
   */
  it('应当支持指数退避延迟', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      backoffMultiplier: 2,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy
    mockConfig.__retryCount = 1 // 第二次重试

    const startTime = Date.now()
    const result = await handleRetry(mockError, mockConfig)
    const endTime = Date.now()

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 2
    })
    expect(endTime - startTime).toBeGreaterThanOrEqual(200) // 100 * 2^1 = 200
  })

  /**
   * 测试目标：自定义延迟函数应被正确调用。
   * 输入：自定义delay函数。
   * 预期：延迟时间按自定义函数计算。
   */
  it('应当支持自定义延迟函数', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: (attempt, error) => {
        return error.status === 429 ? 300 : 100
      },
      retryOnStatus: [429]
    }

    mockError.status = 429
    mockConfig.retry = retryStrategy

    const startTime = Date.now()
    const result = await handleRetry(mockError, mockConfig)
    const endTime = Date.now()

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
    expect(endTime - startTime).toBeGreaterThanOrEqual(300)
  })

  /**
   * 测试目标：跳过重试的请求不应触发重试逻辑。
   * 输入：配置了__skipRetry的请求。
   * 预期：返回null。
   */
  it('应当支持跳过重试', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 2,
      delay: 100,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy
    mockConfig.__skipRetry = true

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：禁用重试的请求不应触发重试逻辑。
   * 输入：配置了retry: false的请求。
   * 预期：返回null。
   */
  it('应当支持禁用重试', async () => {
    mockConfig.retry = false

    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：无重试策略时应返回null。
   * 输入：无重试配置的请求。
   * 预期：返回null。
   */
  it('应当处理无重试策略', async () => {
    const result = await handleRetry(mockError, mockConfig)

    expect(result).toBeNull()
  })

  /**
   * 测试目标：零延迟应被正确处理。
   * 输入：delay为0的重试策略。
   * 预期：立即返回重试配置。
   */
  it('应当处理零延迟', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: 0,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy

    const startTime = Date.now()
    const result = await handleRetry(mockError, mockConfig)
    const endTime = Date.now()

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
    expect(endTime - startTime).toBeLessThan(10) // 应该立即返回
  })

  /**
   * 测试目标：负延迟应被正确处理。
   * 输入：delay为负数的重试策略。
   * 预期：立即返回重试配置。
   */
  it('应当处理负延迟', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: -100,
      retryOnStatus: [500]
    }

    mockConfig.retry = retryStrategy

    const startTime = Date.now()
    const result = await handleRetry(mockError, mockConfig)
    const endTime = Date.now()

    expect(result).toEqual({
      ...mockConfig,
      __retryCount: 1
    })
    expect(endTime - startTime).toBeLessThan(10) // 应该立即返回
  })
})
