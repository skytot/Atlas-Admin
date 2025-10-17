import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { AxiosInstance } from 'axios'

import { HttpClient } from '@/core/http/http-client'
import { createHttpError, createHttpResponse, mockAxiosInstance } from '../../utils/http'

/**
 * 集成测试目标：
 * - 验证 `HttpClient` 对注入的 axios 实例是否执行正确的请求流与错误标准化。
 * - 关注点：请求参数透传、响应数据返回、错误转换为 `HttpError` 结构。
 * - 依赖：`mockAxiosInstance` 负责模拟 axios API，`createHttpResponse/createHttpError` 构造测试输入。
 */
describe('core/http/http-client', () => {
  let axiosMock: ReturnType<typeof mockAxiosInstance>
  let client: HttpClient

  beforeEach(() => {
    axiosMock = mockAxiosInstance()
    client = new HttpClient({
      instance: axiosMock as unknown as AxiosInstance,
      withAuth: true,
      autoRefreshToken: false
    })
  })

  /**
   * 测试目标：确认成功的 GET 请求会：
   * - 使用预期的 `method`/`url` 调用 axios；
   * - 返回业务数据（即 `response.data`）。
   * 预期结果：
   * - `axiosMock.request` 被以 `{ method: 'get', url: '/health' }` 调用一次；
   * - Promise 解析结果等于 `{ ok: true }`。
   */
  it('应当成功处理 GET 请求', async () => {
    const response = createHttpResponse({ data: { ok: true } })
    axiosMock.request.mockResolvedValue(response)

    const result = await client.request({ url: '/health', method: 'get' })

    expect(axiosMock.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      url: '/health'
    }))
    expect(result).toEqual(response.data)
  })

  /**
   * 测试目标：当 axios 抛出错误时，`HttpClient` 应对其标准化处理。
   * 输入条件：
   * - axios 返回 500 错误，错误负载包含 `{ code: 'SERVER_ERROR' }`。
   * 预期结果：
   * - Promise 拒绝的错误对象包含 `message: 'Failed'` 与 `status: 500`，体现标准化信息。
   */
  it('应当将请求错误转换为 AppError', async () => {
    const error = createHttpError('Failed', 500, { code: 'SERVER_ERROR' })
    axiosMock.request.mockRejectedValue(error)

    await expect(client.request({ url: '/health', method: 'get' })).rejects.toMatchObject({
      message: 'Failed',
      status: 500
    })
  })
})


