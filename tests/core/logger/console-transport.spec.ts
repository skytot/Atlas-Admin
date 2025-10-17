import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { consoleTransport } from '@/core/logger/transports/console.transport'
import type { LogPayload } from '@/core/logger/types'

/**
 * 单元测试目标：验证 `core/logger/transports/console.transport` 模块。
 * 覆盖场景：
 * - 控制台输出格式；
 * - 不同级别的输出方法；
 * - 参数格式化；
 * - 上下文和标签处理。
 */
describe('core/logger/console-transport', () => {
  let originalConsole: typeof console

  beforeEach(() => {
    // 保存原始console方法
    originalConsole = { ...console }
    
    // Mock console方法
    console.info = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
  })

  afterEach(() => {
    // 恢复原始console方法
    Object.assign(console, originalConsole)
    vi.clearAllMocks()
  })

  /**
   * 测试目标：debug级别应使用console.info输出。
   * 输入：debug级别的日志载荷。
   * 预期：console.info被调用，格式正确。
   */
  it('应当使用console.info输出debug日志', () => {
    const payload: LogPayload = {
      level: 'debug',
      message: 'Debug message',
      timestamp: Date.now(),
      args: ['arg1', 'arg2']
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Debug message/),
      { args: ['arg1', 'arg2'] }
    )
  })

  /**
   * 测试目标：info级别应使用console.info输出。
   * 输入：info级别的日志载荷。
   * 预期：console.info被调用，格式正确。
   */
  it('应当使用console.info输出info日志', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Info message',
      timestamp: Date.now()
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Info message/)
    )
  })

  /**
   * 测试目标：warn级别应使用console.warn输出。
   * 输入：warn级别的日志载荷。
   * 预期：console.warn被调用，格式正确。
   */
  it('应当使用console.warn输出warn日志', () => {
    const payload: LogPayload = {
      level: 'warn',
      message: 'Warning message',
      timestamp: Date.now()
    }

    consoleTransport.log(payload)

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Warning message/)
    )
  })

  /**
   * 测试目标：error级别应使用console.error输出。
   * 输入：error级别的日志载荷。
   * 预期：console.error被调用，格式正确。
   */
  it('应当使用console.error输出error日志', () => {
    const payload: LogPayload = {
      level: 'error',
      message: 'Error message',
      timestamp: Date.now()
    }

    consoleTransport.log(payload)

    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Error message/)
    )
  })

  /**
   * 测试目标：应正确格式化时间戳。
   * 输入：特定时间戳的日志载荷。
   * 预期：时间戳被正确转换为ISO格式。
   */
  it('应当正确格式化时间戳', () => {
    const timestamp = 1640995200000 // 2022-01-01T00:00:00.000Z
    const payload: LogPayload = {
      level: 'info',
      message: 'Timestamp test',
      timestamp
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      '[2022-01-01T00:00:00.000Z] [INFO] Timestamp test'
    )
  })

  /**
   * 测试目标：应正确格式化参数。
   * 输入：包含args的日志载荷。
   * 预期：参数被正确格式化。
   */
  it('应当正确格式化参数', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Message with args',
      timestamp: Date.now(),
      args: ['string', 123, { key: 'value' }, [1, 2, 3]]
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Message with args/),
      { args: ['string', 123, { key: 'value' }, [1, 2, 3]] }
    )
  })

  /**
   * 测试目标：应正确格式化上下文。
   * 输入：包含context的日志载荷。
   * 预期：上下文被正确格式化。
   */
  it('应当正确格式化上下文', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Message with context',
      timestamp: Date.now(),
      context: {
        module: 'auth',
        action: 'login',
        userId: 'user-123'
      }
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Message with context/),
      { context: { module: 'auth', action: 'login', userId: 'user-123' } }
    )
  })

  /**
   * 测试目标：应正确格式化标签。
   * 输入：包含tags的日志载荷。
   * 预期：标签被正确格式化。
   */
  it('应当正确格式化标签', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Message with tags',
      timestamp: Date.now(),
      tags: ['production', 'api', 'auth']
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Message with tags/),
      { tags: ['production', 'api', 'auth'] }
    )
  })

  /**
   * 测试目标：应正确处理完整的日志载荷。
   * 输入：包含所有字段的日志载荷。
   * 预期：所有字段被正确格式化。
   */
  it('应当正确处理完整日志载荷', () => {
    const payload: LogPayload = {
      level: 'warn',
      message: 'Complete log payload',
      timestamp: Date.now(),
      args: ['arg1', 'arg2'],
      context: {
        module: 'payment',
        action: 'process',
        requestId: 'req-456',
        userId: 'user-789',
        extra: {
          amount: 100,
          currency: 'USD'
        }
      },
      tags: ['payment', 'warning']
    }

    consoleTransport.log(payload)

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Complete log payload/),
      { args: ['arg1', 'arg2'] },
      { context: payload.context },
      { tags: ['payment', 'warning'] }
    )
  })

  /**
   * 测试目标：应正确处理空参数。
   * 输入：不包含args、context、tags的日志载荷。
   * 预期：只输出基本消息。
   */
  it('应当正确处理空参数', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Simple message',
      timestamp: Date.now()
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Simple message/)
    )
  })

  /**
   * 测试目标：应正确处理空数组参数。
   * 输入：包含空数组的日志载荷。
   * 预期：空数组被正确处理。
   */
  it('应当正确处理空数组参数', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Message with empty arrays',
      timestamp: Date.now(),
      args: [],
      tags: []
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Message with empty arrays/)
    )
  })

  /**
   * 测试目标：应正确处理空对象上下文。
   * 输入：包含空对象的context。
   * 预期：空对象被正确处理。
   */
  it('应当正确处理空对象上下文', () => {
    const payload: LogPayload = {
      level: 'info',
      message: 'Message with empty context',
      timestamp: Date.now(),
      context: {}
    }

    consoleTransport.log(payload)

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Message with empty context/)
    )
  })
})
