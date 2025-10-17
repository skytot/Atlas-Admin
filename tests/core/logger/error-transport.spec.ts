import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { LogPayload } from '@/core/logger/types'

// Mock reportError before importing errorTransport
vi.mock('@/core/error/reporter', () => ({
  reportError: vi.fn()
}))

import { errorTransport } from '@/core/logger/transports/error-transport'

/**
 * 单元测试目标：验证 `core/logger/transports/error-transport` 模块。
 * 覆盖场景：
 * - 错误级别过滤；
 * - 错误上报格式；
 * - 上下文传递；
 * - 异步处理。
 */
describe('core/logger/error-transport', () => {
  let mockReportError: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    const { reportError } = await import('@/core/error/reporter')
    mockReportError = reportError as ReturnType<typeof vi.fn>
    mockReportError.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 测试目标：error级别日志应被上报。
   * 输入：error级别的日志载荷。
   * 预期：reportError被调用，包含正确的错误信息。
   */
  it('应当上报error级别日志', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Critical error occurred',
      timestamp: Date.now(),
      args: ['error-details'],
      context: {
        module: 'payment',
        action: 'process',
        userId: 'user-123'
      }
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Critical error occurred',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: ['error-details'],
          loggerContext: {
            module: 'payment',
            action: 'process',
            userId: 'user-123'
          }
        }
      }
    })
  })

  /**
   * 测试目标：非error级别日志应被忽略。
   * 输入：debug、info、warn级别的日志载荷。
   * 预期：reportError不被调用。
   */
  it('应当忽略非error级别日志', async () => {
    const payloads: LogPayload[] = [
      {
        level: 'debug',
        message: 'Debug message',
        timestamp: Date.now()
      },
      {
        level: 'info',
        message: 'Info message',
        timestamp: Date.now()
      },
      {
        level: 'warn',
        message: 'Warning message',
        timestamp: Date.now()
      }
    ]

    for (const payload of payloads) {
      await errorTransport.log(payload)
    }

    expect(mockReportError).not.toHaveBeenCalled()
  })

  /**
   * 测试目标：应正确处理无参数的error日志。
   * 输入：不包含args和context的error日志。
   * 预期：reportError被调用，参数为undefined。
   */
  it('应当处理无参数的error日志', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Simple error',
      timestamp: Date.now()
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Simple error',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: undefined,
          loggerContext: undefined
        }
      }
    })
  })

  /**
   * 测试目标：应正确处理只有args的error日志。
   * 输入：包含args但不包含context的error日志。
   * 预期：args被正确传递，loggerContext为undefined。
   */
  it('应当处理只有args的error日志', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Error with args',
      timestamp: Date.now(),
      args: ['arg1', 'arg2', { key: 'value' }]
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Error with args',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: ['arg1', 'arg2', { key: 'value' }],
          loggerContext: undefined
        }
      }
    })
  })

  /**
   * 测试目标：应正确处理只有context的error日志。
   * 输入：包含context但不包含args的error日志。
   * 预期：context被正确传递，args为undefined。
   */
  it('应当处理只有context的error日志', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Error with context',
      timestamp: Date.now(),
      context: {
        module: 'auth',
        action: 'login',
        requestId: 'req-456',
        userId: 'user-789',
        extra: {
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Error with context',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: undefined,
          loggerContext: {
            module: 'auth',
            action: 'login',
            requestId: 'req-456',
            userId: 'user-789',
            extra: {
              ip: '192.168.1.1',
              userAgent: 'Mozilla/5.0'
            }
          }
        }
      }
    })
  })

  /**
   * 测试目标：应正确处理复杂error日志。
   * 输入：包含所有字段的error日志。
   * 预期：所有信息被正确传递。
   */
  it('应当处理复杂error日志', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Complex error occurred',
      timestamp: Date.now(),
      args: [
        'error-details',
        { stack: 'Error stack trace' },
        ['nested', 'array']
      ],
      context: {
        module: 'database',
        action: 'query',
        requestId: 'req-789',
        userId: 'user-456',
        extra: {
          query: 'SELECT * FROM users',
          params: ['param1', 'param2'],
          connectionId: 'conn-123'
        }
      },
      tags: ['database', 'error', 'critical']
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Complex error occurred',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: [
            'error-details',
            { stack: 'Error stack trace' },
            ['nested', 'array']
          ],
          loggerContext: {
            module: 'database',
            action: 'query',
            requestId: 'req-789',
            userId: 'user-456',
            extra: {
              query: 'SELECT * FROM users',
              params: ['param1', 'param2'],
              connectionId: 'conn-123'
            }
          }
        }
      }
    })
  })

  /**
   * 测试目标：应正确处理空数组和空对象。
   * 输入：包含空数组和空对象的error日志。
   * 预期：空值被正确传递。
   */
  it('应当处理空数组和空对象', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Error with empty values',
      timestamp: Date.now(),
      args: [],
      context: {},
      tags: []
    }

    await errorTransport.log(payload)

    expect(mockReportError).toHaveBeenCalledWith({
      message: 'Error with empty values',
      level: 'error',
      timestamp: payload.timestamp,
      context: {
        extra: {
          args: [],
          loggerContext: {}
        }
      }
    })
  })

  /**
   * 测试目标：应正确处理异步操作。
   * 输入：异步的error日志处理。
   * 预期：Promise被正确返回。
   */
  it('应当正确处理异步操作', async () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Async error',
      timestamp: Date.now()
    }

    const result = errorTransport.log(payload)

    expect(result).toBeInstanceOf(Promise)
    await result

    expect(mockReportError).toHaveBeenCalled()
  })

  /**
   * 测试目标：应正确处理reportError异常。
   * 输入：reportError抛出异常。
   * 预期：异常被正确传播。
   */
  it('应当正确处理reportError异常', async () => {
    const error = new Error('Report error failed')
    mockReportError.mockRejectedValue(error)

    const payload: LogPayload = {
      level: 'error',
      message: 'Error that causes report failure',
      timestamp: Date.now()
    }

    await expect(errorTransport.log(payload)).rejects.toThrow('Report error failed')
  })
})
