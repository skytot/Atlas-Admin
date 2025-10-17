/**
 * HTTP 模块公共类型定义。
 */
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

/**
 * HTTP 响应类型别名，保持与 Axios 一致。
 */
export type HttpResponse<T = unknown> = AxiosResponse<T>

/**
 * HTTP 错误抽象，供重试、钩子等逻辑使用。
 */
export interface HttpErrorLike<T = unknown> {
  message: string
  name: string
  code?: string
  status?: number
  config: HttpInternalRequestConfig<T>
  response?: HttpResponse<T>
  cause?: unknown
  originalError?: unknown
  stack?: string
  isNetworkError: boolean
  isCancelled: boolean
  silent: boolean
}

/**
 * 重试策略配置。
 */
export interface RetryStrategy {
  /** 最大重试次数（不含首次请求） */
  retries: number
  /** 重试间隔（毫秒），或根据错误动态计算 */
  delay?: number | RetryDelayFn
  /** 指数退避系数，若提供且 delay 为数字则生效 */
  backoffMultiplier?: number
  /** 指定哪些状态码会触发重试 */
  retryOnStatus?: number[]
  /** 自定义重试判断 */
  shouldRetry?: (error: HttpErrorLike, attempt: number) => boolean
}

export type RetryDelayFn = (attempt: number, error: HttpErrorLike) => number

/**
 * 请求钩子。
 */
export type RequestHook<T = unknown> = (
  config: HttpInternalRequestConfig<T>
) => HttpInternalRequestConfig<T> | Promise<HttpInternalRequestConfig<T>>

/**
 * 响应钩子。
 */
export type ResponseHook<T = unknown> = (
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>

/**
 * 错误钩子。
 */
export type ErrorHook = <T = unknown>(error: HttpErrorLike<T>) =>
  | HttpErrorLike<T>
  | Promise<HttpErrorLike<T>>

/**
 * HttpClient 构造参数。
 */
export interface HttpClientOptions<T = unknown> {
  /** 自定义 Axios 实例 */
  instance?: AxiosInstance
  /** Axios 配置 */
  axiosConfig?: AxiosRequestConfig
  /** 默认是否追加认证 */
  withAuth?: boolean
  /** 默认是否自动刷新令牌 */
  autoRefreshToken?: boolean
  /** 默认重试策略 */
  defaultRetry?: RetryStrategy
  /** 默认请求头 */
  defaultHeaders?: Record<string, string>
  /** 默认静默模式 */
  silent?: boolean
  /** 请求钩子 */
  requestHooks?: RequestHook<T>[]
  /** 响应钩子 */
  responseHooks?: ResponseHook<T>[]
  /** 错误钩子 */
  errorHooks?: ErrorHook[]
}

/**
 * 对外暴露的请求配置。
 */
export interface HttpRequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  /** 返回原始 AxiosResponse */
  rawResponse?: boolean
  /** 静默错误，跳过全局错误处理 */
  silent?: boolean
  /** 自定义重试策略 */
  retry?: RetryStrategy | false
  /** 是否自动追加认证信息，默认遵循客户端配置 */
  autoAttachToken?: boolean
  /** 是否允许自动刷新令牌 */
  autoRefreshToken?: boolean
  /** 是否需要认证 */
  withAuth?: boolean
  /** 默认重试策略覆盖 */
  defaultRetry?: RetryStrategy
  /** 附加元数据，便于拦截器使用 */
  metadata?: Record<string, unknown>
}

/**
 * 内部统一的请求配置，向下兼容 Axios 内部类型。
 */
export interface HttpInternalRequestConfig<T = unknown>
  extends InternalAxiosRequestConfig<T>,
    HttpRequestConfig<T> {
  /** 内部使用的重试计数 */
  __retryCount?: number
  /** 是否因刷新令牌而重试 */
  __isTokenRetry?: boolean
  /** 是否跳过重试 */
  __skipRetry?: boolean
}

export interface HttpErrorInit<T = unknown>
  extends Omit<HttpErrorLike<T>, 'config' | 'message' | 'name' | 'silent'> {
  message: string
  name?: string
  config: HttpInternalRequestConfig<T>
  silent?: boolean
}


