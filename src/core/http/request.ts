import { httpClient } from './http-client'
import type { HttpRequestConfig, HttpResponse } from './types'

/**
 * 轻量请求函数，默认为业务场景返回 `response.data`。
 * @param {HttpRequestConfig<T>} config Axios 风格的请求配置，可通过 `rawResponse: true` 指定返回原始响应
 * @param {true} [raw] 传入 `true` 时直接返回 `AxiosResponse`，与在配置中设置 `rawResponse: true` 等效
 * @returns {Promise<T | HttpResponse<T>>} 请求结果
 */
export async function request<T = unknown>(config: HttpRequestConfig<T>): Promise<T>
export async function request<T = unknown>(config: HttpRequestConfig<T>, raw: true): Promise<HttpResponse<T>>
export async function request<T = unknown>(
  config: HttpRequestConfig<T>,
  raw?: boolean
): Promise<T | HttpResponse<T>> {
  const shouldReturnRaw = raw ?? config.rawResponse ?? false
  return shouldReturnRaw
    ? httpClient.request(config, true)
    : httpClient.request(config)
}
