import type { AxiosResponse } from 'axios'

/**
 * 将 Promise<AxiosResponse<T>> 映射为 Promise<T>。
 * 可选工具：调用方显式选择是否仅取 data；不改变 http 默认返回 AxiosResponse 的规范。
 *
 * @typeParam T 响应数据类型
 * @param p 发起请求返回的 Promise<AxiosResponse<T>>
 * @returns 仅包含 data 的 Promise<T>
 */
export function toData<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
  return p.then(r => r.data)
}