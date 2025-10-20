import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { defaultAxiosConfig } from './config'

/**
 * 创建与返回一个 AxiosInstance，合并默认配置与外部配置。
 *
 * 设计约束：
 * - 严格遵守 axios 默认行为（返回 AxiosResponse，错误为 AxiosError）。
 * - 不引入自定义选项或插件系统。
 *
 * @param config 额外的 Axios 实例配置（与 AxiosRequestConfig 对齐）
 * @returns AxiosInstance 实例
 */
export function createHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    ...defaultAxiosConfig,
    ...config,
    headers: {
      ...(defaultAxiosConfig.headers ?? {}),
      ...(config?.headers ?? {})
    }
  })
}

/**
 * 默认 http 单例实例（常见用法）。
 * - 不改变 axios 的默认语义。
 */
export const http: AxiosInstance = createHttpClient()

// 直接重导出 axios 官方类型，避免自定义类型体系
export type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse }


