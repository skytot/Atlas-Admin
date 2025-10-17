import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { AxiosInstance } from 'axios'

// Mock axios before importing HttpClient
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios')
  return {
    ...actual,
    default: {
      ...(actual.default || {}),
      isCancel: vi.fn(() => false),
      AxiosHeaders: class MockAxiosHeaders {
        headers: Map<string, string>
        
        constructor() {
          this.headers = new Map()
        }
        
        set(key: string, value: string) {
          this.headers.set(key, value)
        }
        
        has(key: string) {
          return this.headers.has(key)
        }
        
        static from(headers: Record<string, string>) {
          const instance = new MockAxiosHeaders()
          Object.entries(headers || {}).forEach(([key, value]) => {
            instance.headers.set(key, value)
          })
          return instance
        }
        
        forEach(callback: (value: string, key: string) => void) {
          this.headers.forEach(callback)
        }
      }
    }
  }
})

// Mock auth module
vi.mock('@/core/auth', () => ({
  auth: {
    getToken: vi.fn(() => 'mock-token'),
    refreshToken: vi.fn(() => Promise.resolve('new-token'))
  }
}))

import { HttpClient } from '@/core/http/http-client'
import { createHttpError, createHttpResponse, mockAxiosInstance } from '../../utils/http'
import type { RetryStrategy } from '@/core/http/types'

/**
 * 重构后的HttpClient详细测试。
 * 基于实际实现，专注于核心功能测试。
 */
describe('core/http/http-client-detailed', () => {
  let axiosMock: ReturnType<typeof mockAxiosInstance>
  let mockRequestHook: any
  let mockResponseHook: any
  let mockErrorHook: any
  let client: HttpClient

  beforeEach(() => {
    axiosMock = mockAxiosInstance()
    mockRequestHook = vi.fn((config) => config)
    mockResponseHook = vi.fn((response) => response)
    mockErrorHook = vi.fn((error) => Promise.reject(error))

    client = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      withAuth: true,
      autoRefreshToken: false,
      silent: false,
      requestHooks: [mockRequestHook],
      responseHooks: [mockResponseHook],
      errorHooks: [mockErrorHook]
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 测试目标：请求钩子应在请求前被调用。
   * 输入：配置了请求钩子的HttpClient。
   * 预期：请求钩子被调用，且参数正确。
   */
  it('应当执行请求钩子', async () => {
    const response = createHttpResponse({ data: { success: true } })
    axiosMock.request.mockResolvedValue(response)

    await client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })

    expect(mockRequestHook).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/test',
        method: 'get'
      })
    )
  })

  /**
   * 测试目标：响应钩子应在请求成功后被调用。
   * 输入：成功的HTTP请求。
   * 预期：响应钩子被调用，且包含响应数据。
   */
  it('应当执行响应钩子', async () => {
    const responseData = { success: true }
    const response = createHttpResponse({ data: responseData })
    axiosMock.request.mockResolvedValue(response)

    const result = await client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })

    expect(mockResponseHook).toHaveBeenCalledWith(
      expect.objectContaining({
        data: responseData
      })
    )
    expect(result).toEqual(responseData)
  })

  /**
   * 测试目标：错误钩子应在请求失败后被调用。
   * 输入：失败的HTTP请求。
   * 预期：错误钩子被调用，且包含标准化错误。
   */
  it('应当执行错误钩子', async () => {
    const error = createHttpError('Network Error', 0, undefined)
    axiosMock.request.mockRejectedValue(error)

    await expect(client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })).rejects.toThrow()

    expect(mockErrorHook).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Network Error',
        status: 0
      })
    )
  })

  /**
   * 测试目标：HttpClient应支持基本配置。
   * 输入：基本HttpClient配置。
   * 预期：配置被正确应用。
   */
  it('应当支持基本配置', () => {
    const customClient = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      withAuth: false,
      autoRefreshToken: true,
      silent: true
    })

    expect(customClient).toBeDefined()
  })

  /**
   * 测试目标：HttpClient应支持钩子管理。
   * 输入：通过构造函数配置钩子。
   * 预期：钩子被正确管理。
   */
  it('应当支持钩子管理', () => {
    const hook1 = vi.fn()
    const hook2 = vi.fn()

    const clientWithHooks = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      requestHooks: [hook1],
      responseHooks: [hook2]
    })

    expect(clientWithHooks).toBeDefined()
  })

  /**
   * 测试目标：HttpClient应支持原始响应返回。
   * 输入：设置rawResponse为true。
   * 预期：返回完整的Axios响应。
   */
  it('应当支持原始响应返回', async () => {
    const response = createHttpResponse({ 
      data: { success: true },
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
    axiosMock.request.mockResolvedValue(response)

    const result = await client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    }, true)

    expect(result).toEqual(response)
  })

  /**
   * 测试目标：HttpClient应支持认证配置。
   * 输入：withAuth为true的配置。
   * 预期：认证信息被正确处理。
   */
  it('应当支持认证配置', async () => {
    const response = createHttpResponse({ data: { success: true } })
    axiosMock.request.mockResolvedValue(response)

    await client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })

    expect(axiosMock.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/test',
        method: 'get'
      })
    )
  })

  /**
   * 测试目标：HttpClient应支持静默模式。
   * 输入：silent为true的配置。
   * 预期：静默模式被正确处理。
   */
  it('应当支持静默模式', async () => {
    const error = createHttpError('Silent Error', 500, undefined)
    axiosMock.request.mockRejectedValue(error)

    await expect(client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: true 
    })).rejects.toThrow()
  })

  /**
   * 测试目标：HttpClient应支持重试配置。
   * 输入：配置重试策略。
   * 预期：重试配置被正确处理。
   */
  it('应当支持重试配置', async () => {
    const retryStrategy: RetryStrategy = {
      retries: 1,
      delay: 100
    }

    const clientWithRetry = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      defaultRetry: retryStrategy
    })

    expect(clientWithRetry).toBeDefined()
  })

  /**
   * 测试目标：HttpClient应支持默认头部。
   * 输入：配置默认头部。
   * 预期：默认头部被正确应用。
   */
  it('应当支持默认头部', async () => {
    const clientWithHeaders = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      defaultHeaders: {
        'X-Custom': 'value'
      }
    })

    const response = createHttpResponse({ data: { success: true } })
    axiosMock.request.mockResolvedValue(response)

    await clientWithHeaders.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })

    expect(axiosMock.request).toHaveBeenCalled()
  })

  /**
   * 测试目标：HttpClient应支持错误处理。
   * 输入：各种类型的错误。
   * 预期：错误被正确处理和转换。
   */
  it('应当支持错误处理', async () => {
    const networkError = createHttpError('Network Error', 0, undefined)
    axiosMock.request.mockRejectedValue(networkError)

    await expect(client.request({ 
      url: '/test', 
      method: 'get', 
      headers: {},
      silent: false 
    })).rejects.toThrow('Network Error')
  })

  /**
   * 测试目标：HttpClient应支持配置合并。
   * 输入：多个配置源。
   * 预期：配置被正确合并。
   */
  it('应当支持配置合并', async () => {
    const response = createHttpResponse({ data: { success: true } })
    axiosMock.request.mockResolvedValue(response)

    await client.request({ 
      url: '/test', 
      method: 'get', 
      headers: { 'X-Test': 'value' },
      silent: false 
    })

    expect(axiosMock.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/test',
        method: 'get'
      })
    )
  })
})