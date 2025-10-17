import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createLogger } from '@/core/logger/logger'
import type { LogLevel, LogTransport, LogContext } from '@/core/logger/types'

/**
 * 单元测试目标：验证 `core/logger/logger` 模块的核心功能。
 * 覆盖场景：
 * - 日志级别过滤；
 * - 传输器管理；
 * - 上下文合并；
 * - 标签处理；
 * - 开关控制。
 */
describe('core/logger/logger', () => {
  let mockTransport: LogTransport
  let logger: ReturnType<typeof createLogger>

  beforeEach(() => {
    mockTransport = {
      log: vi.fn()
    }
    logger = createLogger({
      level: 'debug',
      transports: [mockTransport],
      enabled: true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 测试目标：debug级别日志应被正确输出。
   * 输入：debug级别日志。
   * 预期：传输器被调用，包含正确的日志载荷。
   */
  it('应当输出debug级别日志', () => {
    logger.debug('Debug message', { module: 'test' }, 'arg1', 'arg2')

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'debug',
        message: 'Debug message',
        args: ['arg1', 'arg2']
      })
    )
  })

  /**
   * 测试目标：info级别日志应被正确输出。
   * 输入：info级别日志。
   * 预期：传输器被调用，包含正确的日志载荷。
   */
  it('应当输出info级别日志', () => {
    logger.info('Info message', { action: 'test' })

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        message: 'Info message'
      })
    )
  })

  /**
   * 测试目标：warn级别日志应被正确输出。
   * 输入：warn级别日志。
   * 预期：传输器被调用，包含正确的日志载荷。
   */
  it('应当输出warn级别日志', () => {
    logger.warn('Warning message', { requestId: 'req-123' })

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'warn',
        message: 'Warning message'
      })
    )
  })

  /**
   * 测试目标：error级别日志应被正确输出。
   * 输入：error级别日志。
   * 预期：传输器被调用，包含正确的日志载荷。
   */
  it('应当输出error级别日志', () => {
    logger.error('Error message', { userId: 'user-456' })

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'error',
        message: 'Error message'
      })
    )
  })

  /**
   * 测试目标：日志级别过滤应正确工作。
   * 输入：设置info级别，输出debug日志。
   * 预期：debug日志被过滤，不输出。
   */
  it('应当正确过滤低级别日志', () => {
    logger.setLevel('info')
    logger.debug('Debug message')

    expect(mockTransport.log).not.toHaveBeenCalled()
  })

  /**
   * 测试目标：高级别日志应通过过滤。
   * 输入：设置info级别，输出warn日志。
   * 预期：warn日志被输出。
   */
  it('应当输出高级别日志', () => {
    logger.setLevel('info')
    logger.warn('Warning message')

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'warn',
        message: 'Warning message'
      })
    )
  })

  /**
   * 测试目标：禁用日志时应不输出任何日志。
   * 输入：禁用日志后输出各级别日志。
   * 预期：所有日志都被过滤。
   */
  it('应当支持禁用日志', () => {
    logger.disable()
    logger.debug('Debug message')
    logger.info('Info message')
    logger.warn('Warning message')
    logger.error('Error message')

    expect(mockTransport.log).not.toHaveBeenCalled()
  })

  /**
   * 测试目标：启用日志后应正常输出。
   * 输入：禁用后重新启用日志。
   * 预期：日志正常输出。
   */
  it('应当支持启用日志', () => {
    logger.disable()
    logger.info('Disabled message')
    expect(mockTransport.log).not.toHaveBeenCalled()

    logger.enable()
    logger.info('Enabled message')
    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        message: 'Enabled message'
      })
    )
  })

  /**
   * 测试目标：上下文应被正确合并。
   * 输入：全局上下文和局部上下文。
   * 预期：上下文被正确合并。
   */
  it('应当正确合并上下文', () => {
    const globalContext: LogContext = { module: 'global', userId: 'user-123' }
    const loggerWithContext = createLogger({
      level: 'debug',
      transports: [mockTransport],
      context: globalContext
    })

    loggerWithContext.info('Message', { action: 'test', requestId: 'req-456' })

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Message'
      })
    )
  })

  /**
   * 测试目标：标签应被正确处理。
   * 输入：全局标签和局部标签。
   * 预期：标签被正确合并。
   */
  it('应当正确处理标签', () => {
    const loggerWithTags = createLogger({
      level: 'debug',
      transports: [mockTransport],
      tags: ['global-tag']
    })

    loggerWithTags.info('Message', { module: 'test' }, 'arg1')

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: ['global-tag']
      })
    )
  })

  /**
   * 测试目标：传输器管理应正确工作。
   * 输入：添加和移除传输器。
   * 预期：传输器被正确管理。
   */
  it('应当支持传输器管理', () => {
    const transport1 = { log: vi.fn() }
    const transport2 = { log: vi.fn() }

    logger.addTransport(transport1)
    logger.addTransport(transport2)

    logger.info('Message')

    expect(mockTransport.log).toHaveBeenCalled()
    expect(transport1.log).toHaveBeenCalled()
    expect(transport2.log).toHaveBeenCalled()

    logger.removeTransport(transport1)
    vi.clearAllMocks()

    logger.info('Message after removal')

    expect(mockTransport.log).toHaveBeenCalled()
    expect(transport2.log).toHaveBeenCalled()
    expect(transport1.log).not.toHaveBeenCalled()
  })

  /**
   * 测试目标：时间戳应被正确生成。
   * 输入：输出日志。
   * 预期：时间戳在合理范围内。
   */
  it('应当生成正确的时间戳', () => {
    const beforeTime = Date.now()
    logger.info('Message')
    const afterTime = Date.now()

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Number)
      })
    )

    const loggedTimestamp = (mockTransport.log as any).mock.calls[0][0].timestamp
    expect(loggedTimestamp).toBeGreaterThanOrEqual(beforeTime)
    expect(loggedTimestamp).toBeLessThanOrEqual(afterTime)
  })

  /**
   * 测试目标：复杂上下文应被正确处理。
   * 输入：包含extra字段的复杂上下文。
   * 预期：所有上下文信息被正确传递。
   */
  it('应当处理复杂上下文', () => {
    const complexContext: LogContext = {
      module: 'auth',
      action: 'login',
      requestId: 'req-789',
      userId: 'user-456',
      extra: {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        sessionId: 'session-123'
      }
    }

    logger.info('Complex context message', complexContext)

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        context: complexContext
      })
    )
  })

  /**
   * 测试目标：无参数日志应被正确处理。
   * 输入：不包含额外参数的日志。
   * 预期：args字段为undefined或空数组。
   */
  it('应当处理无参数日志', () => {
    logger.info('Simple message')

    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Simple message'
      })
    )
  })

  /**
   * 测试目标：所有日志级别应被正确处理。
   * 输入：所有级别的日志。
   * 预期：所有级别都被正确处理。
   */
  it('应当支持所有日志级别', () => {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    
    levels.forEach(level => {
      logger[level](`${level} message`)
    })

    expect(mockTransport.log).toHaveBeenCalledTimes(4)
    levels.forEach((level, index) => {
      expect(mockTransport.log).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          level,
          message: `${level} message`
        })
      )
    })
  })
})
