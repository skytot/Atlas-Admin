import type { AxiosRequestConfig } from 'axios'
import { appConfig } from '@/core/config/app-config'

/**
 * 统一的 Axios 默认配置。
 * - baseURL: 后端接口基础地址
 * - timeout: 请求超时时间（毫秒）
 * 可在此处集中维护默认 headers 等参数。
 */
export const DEFAULT_HTTP_TIMEOUT = 15000

export const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: appConfig.apiBaseUrl,
  timeout: DEFAULT_HTTP_TIMEOUT
}