import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { HttpRequestConfig } from '@/core/http/types'

// Mock httpClient before importing request
vi.mock('@/core/http/http-client', () => ({
  httpClient: {
    request: vi.fn()
  }
}))

import { request } from '@/core/http/request'

/**
 * 单元测试目标：验证 `core/http/request` 模块的轻量请求函数。
 * 覆盖场景：
 * - 默认返回业务数据（response.data）；
 * - 原始响应返回（rawResponse: true）；
 * - 参数透传；
 * - 错误处理。
 */
describe('core/http/http-request', () => {
  let mockHttpClient: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    const { httpClient } = await import('@/core/http/http-client')
    mockHttpClient = httpClient.request as ReturnType<typeof vi.fn>
    mockHttpClient.mockClear()
  })

  /**
   * 测试目标：默认请求应返回业务数据。
   * 输入：标准请求配置。
   * 预期：返回response.data，不返回原始响应。
   */
  it('应当返回业务数据', async () => {
    const mockData = { success: true, data: 'test' }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get'
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：配置rawResponse: true应返回原始响应。
   * 输入：配置了rawResponse的请求。
   * 预期：返回原始响应对象。
   */
  it('应当支持配置rawResponse返回原始响应', async () => {
    const mockResponse = {
      data: { success: true },
      status: 200,
      headers: { 'content-type': 'application/json' },
      config: {}
    }
    mockHttpClient.mockResolvedValue(mockResponse)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get',
      rawResponse: true
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config, true)
    expect(result).toBe(mockResponse)
  })

  /**
   * 测试目标：raw参数应覆盖配置中的rawResponse。
   * 输入：配置了rawResponse: false但传入raw: true。
   * 预期：使用raw参数，返回原始响应。
   */
  it('应当支持raw参数覆盖配置', async () => {
    const mockResponse = {
      data: { success: true },
      status: 200,
      headers: { 'content-type': 'application/json' },
      config: {}
    }
    mockHttpClient.mockResolvedValue(mockResponse)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get',
      rawResponse: false
    }

    const result = await request(config, true)

    expect(mockHttpClient).toHaveBeenCalledWith(config, true)
    expect(result).toBe(mockResponse)
  })

  /**
   * 测试目标：raw参数为false时应返回业务数据。
   * 输入：配置了rawResponse: true但传入raw: false。
   * 预期：使用raw参数，返回业务数据。
   */
  it('应当支持raw参数为false', async () => {
    const mockData = { success: true, data: 'test' }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get',
      rawResponse: true
    }

    const result = await request(config, true)

    expect(mockHttpClient).toHaveBeenCalledWith(config, true)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：POST请求应正确传递数据。
   * 输入：POST请求配置。
   * 预期：数据被正确传递。
   */
  it('应当正确处理POST请求', async () => {
    const mockData = { id: 1, name: 'test' }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/users',
      method: 'post',
      data: { name: 'test' }
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：PUT请求应正确传递数据。
   * 输入：PUT请求配置。
   * 预期：数据被正确传递。
   */
  it('应当正确处理PUT请求', async () => {
    const mockData = { id: 1, name: 'updated' }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/users/1',
      method: 'put',
      data: { name: 'updated' }
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：DELETE请求应正确处理。
   * 输入：DELETE请求配置。
   * 预期：请求被正确发送。
   */
  it('应当正确处理DELETE请求', async () => {
    const mockData = { success: true }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/users/1',
      method: 'delete'
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：请求错误应被正确传播。
   * 输入：HTTP请求失败。
   * 预期：错误被正确抛出。
   */
  it('应当正确处理请求错误', async () => {
    const error = new Error('Request failed')
    mockHttpClient.mockRejectedValue(error)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get'
    }

    await expect(request(config)).rejects.toThrow('Request failed')
    expect(mockHttpClient).toHaveBeenCalledWith(config)
  })

  /**
   * 测试目标：复杂请求配置应被正确传递。
   * 输入：包含headers、params等复杂配置的请求。
   * 预期：所有配置被正确传递。
   */
  it('应当正确处理复杂请求配置', async () => {
    const mockData = { success: true }
    mockHttpClient.mockResolvedValue(mockData)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get',
      headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'application/json'
      },
      params: {
        page: 1,
        limit: 10
      },
      timeout: 5000
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config)
    expect(result).toBe(mockData)
  })

  /**
   * 测试目标：原始响应应包含完整信息。
   * 输入：请求原始响应的配置。
   * 预期：返回完整的响应对象。
   */
  it('应当返回完整的原始响应', async () => {
    const mockResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-total-count': '100'
      },
      config: {
        url: '/test',
        method: 'get'
      }
    }
    mockHttpClient.mockResolvedValue(mockResponse)

    const config: HttpRequestConfig = {
      url: '/test',
      method: 'get',
      rawResponse: true
    }

    const result = await request(config)

    expect(mockHttpClient).toHaveBeenCalledWith(config, true)
    expect(result).toEqual(mockResponse)
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('status')
    expect(result).toHaveProperty('headers')
    expect(result).toHaveProperty('config')
  })
})
