import { vi } from 'vitest'

interface MockResponseOptions<T = unknown> {
  status?: number
  data?: T
  headers?: Record<string, string>
}

/**
 * 根据传入参数构造 axios 响应对象。
 * - 用途：为集成测试提供结构化的成功响应。
 */
export const createHttpResponse = <T = unknown>({
  status = 200,
  data,
  headers = {}
}: MockResponseOptions<T> = {}) => ({
  status,
  data,
  headers
})

/**
 * 构造符合 axiosError 结构的错误对象，用于触发错误分支。
 * - 默认 message 为 'Request failed'，status 为 500。
 */
export const createHttpError = (message = 'Request failed', status = 500, data?: unknown) => {
  const error = new Error(message) as Error & {
    response?: { status: number; data?: unknown }
    isAxiosError: boolean
  }

  error.isAxiosError = true
  error.response = { status, data }
  return error
}

/**
 * 模拟 axios 实例，记录 request 方法调用情况。
 * - 返回对象包含 `request/get/post/put/delete` 四类调用。
 */
export const mockAxiosInstance = () => {
  const request = vi.fn()
  return {
    request,
    get: vi.fn((config) => request({ ...config, method: 'get' })),
    post: vi.fn((config) => request({ ...config, method: 'post' })),
    put: vi.fn((config) => request({ ...config, method: 'put' })),
    delete: vi.fn((config) => request({ ...config, method: 'delete' }))
  }
}

