import type { AxiosRequestConfig } from 'axios'
import { appConfig } from '@/core/config/app-config'
import type { HttpClientOptions } from './types'

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

/**
 * HTTP 客户端默认配置。
 * - withAuth: 默认携带认证信息
 * - autoRefreshToken: 默认不自动刷新令牌
 * - silent: 默认输出错误，便于排查
 */
export const defaultHttpClientOptions: HttpClientOptions = {
  withAuth: true,
  autoRefreshToken: false,
  silent: false
}

