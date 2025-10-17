import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

import { setupErrorHandler } from '@/core/error/error-handler'
import type { ErrorLevel } from '@/core/error/types'

/**
 * 测试目标：验证错误处理器的安装与错误捕获功能。
 * 覆盖场景：
 * - Vue 应用错误处理器的注册；
 * - 错误标准化与上报流程；
 * - 未处理 Promise 拒绝的捕获。
 */
// Mock 错误上报器
vi.mock('@/core/error/reporter', () => ({
  reportError: vi.fn()
}))

describe('core/error/error-handler', () => {
  let app: ReturnType<typeof createApp>
  let mockReporter: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    app = createApp({})
    // 获取 mock 函数
    const { reportError } = await import('@/core/error/reporter')
    mockReporter = reportError as ReturnType<typeof vi.fn>
    mockReporter.mockClear()
  })

  /**
   * 测试目标：错误处理器应正确安装到 Vue 应用。
   * 输入：调用 `setupErrorHandler` 并传入 Vue 应用实例。
   * 预期：`app.config.errorHandler` 被设置为函数。
   */
  it('应当正确安装错误处理器', () => {
    setupErrorHandler(app)

    expect(app.config.errorHandler).toBeDefined()
    expect(typeof app.config.errorHandler).toBe('function')
  })

  /**
   * 测试目标：Vue 错误应被正确捕获和处理。
   * 输入：模拟 Vue 组件错误，触发 errorHandler。
   * 预期：错误被标准化并传递给上报器。
   */
  it('应当捕获和处理 Vue 错误', async () => {
    setupErrorHandler(app)
    const errorHandler = app.config.errorHandler!

    const testError = new Error('Test Vue error')
    const mockInstance = { $options: { name: 'TestComponent' }, $props: {} }

    await errorHandler(testError, mockInstance as any, 'mounted')

    expect(mockReporter).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test Vue error',
        name: 'Error',
        level: 'error',
        context: expect.objectContaining({
          componentName: 'TestComponent',
          lifecycleHook: 'mounted'
        })
      })
    )
  })

  /**
   * 测试目标：未处理的 Promise 拒绝应被捕获。
   * 输入：模拟 `unhandledrejection` 事件。
   * 预期：错误被标准化并上报。
   */
  it('应当捕获未处理的 Promise 拒绝', async () => {
    setupErrorHandler(app, { captureUnhandledRejection: true })

    const rejectionError = new Error('Promise rejection')
    
    // 模拟 unhandledrejection 事件（不创建真实的 Promise 拒绝）
    const event = new Event('unhandledrejection') as any
    event.reason = rejectionError
    event.promise = Promise.resolve() // 使用已解决的 Promise 避免未处理拒绝

    // 模拟事件触发
    window.dispatchEvent(event)

    // 等待异步处理
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockReporter).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Promise rejection',
        level: 'error',
        context: expect.objectContaining({
          lifecycleHook: 'unhandledrejection'
        })
      })
    )
  })

  /**
   * 测试目标：自定义错误级别应正确应用。
   * 输入：使用自定义错误级别 'warning'。
   * 预期：上报的错误包含指定的级别。
   */
  it('应当支持自定义错误级别', async () => {
    const customLevel: ErrorLevel = 'warning'
    setupErrorHandler(app, { defaultLevel: customLevel })

    const errorHandler = app.config.errorHandler!
    const testError = new Error('Warning level error')

    await errorHandler(testError, null, 'created')

    expect(mockReporter).toHaveBeenCalledWith(
      expect.objectContaining({
        level: customLevel
      })
    )
  })
})
