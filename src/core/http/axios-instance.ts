import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { defaultAxiosConfig } from './config'

/**
 * 创建基于默认配置的 Axios 实例。
 * @param {AxiosRequestConfig} [config] 额外的实例配置
 * @returns {AxiosInstance} 带合并配置的 Axios 实例
 */
export function createAxiosInstance(config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    ...defaultAxiosConfig,
    ...config,
    headers: {
      ...(defaultAxiosConfig.headers ?? {}),
      ...(config?.headers ?? {})
    }
  })
}

export const axiosInstance = createAxiosInstance()
