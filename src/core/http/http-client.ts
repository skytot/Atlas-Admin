import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { auth } from '@/core/auth'
import type {
  ErrorHook,
  HttpClientOptions,
  HttpErrorLike,
  HttpInternalRequestConfig,
  HttpRequestConfig,
  HttpResponse,
  RequestHook,
  ResponseHook
} from './types'
import { applyDefaultHeaders, buildHttpError } from './utils'
import { createAxiosInstance } from './axios-instance'
import { handleRetry } from './retry'
import { defaultHttpClientOptions } from './config'

/**
 * HttpClient 负责对 Axios 进行高级封装：
 * - 合并默认配置（认证、重试、静默等）
 * - 统一执行请求/响应/错误钩子
 * - 处理令牌刷新与重试逻辑
 */
export class HttpClient<T = unknown> {
  private requestHooks: RequestHook<T>[]
  private responseHooks: ResponseHook<T>[]
  private errorHooks: ErrorHook[]

  private axios: AxiosInstance
  private refreshPromise?: Promise<string>

  /**
   * 创建 HttpClient 实例并注入默认钩子与配置。
   * @param {HttpClientOptions<T>} [options] HttpClient 运行配置
   */
  constructor(private readonly options: HttpClientOptions<T> = defaultHttpClientOptions as HttpClientOptions<T>) {
    this.requestHooks = [...(options.requestHooks ?? [])]
    this.responseHooks = [...(options.responseHooks ?? [])]
    this.errorHooks = [...(options.errorHooks ?? [])]
    this.axios = this.createAxios(options)
  }

  /** 创建并缓存 Axios 实例，附加默认 headers */
  /**
   * 创建并缓存 Axios 实例，附加默认 headers。
   * @param {HttpClientOptions<T>} options 客户端配置
   * @returns {AxiosInstance} Axios 实例
   */
  private createAxios(options: HttpClientOptions<T>): AxiosInstance {
    if (options.instance) return options.instance
    const config: AxiosRequestConfig = {
      ...options.axiosConfig,
      headers: {
        ...(options.defaultHeaders ?? {}),
        ...(options.axiosConfig?.headers ?? {})
      }
    }
    return createAxiosInstance(config)
  }

  /**
   * 统一的请求入口：
   * 1. 准备配置并执行请求钩子
   * 2. 调用 Axios 发起请求
   * 3. 捕获异常后交由 recoverFromError 处理
   */
  /**
   * 统一的请求入口，根据配置返回业务数据或原始响应。
   * @param {HttpRequestConfig<K>} config 请求配置
   * @param {true} [raw] 传入 true 时返回完整响应
   */
  async request<K = T>(config: HttpRequestConfig<K>): Promise<K>
  async request<K = T>(config: HttpRequestConfig<K>, raw: true): Promise<HttpResponse<K>>
  async request<K = T>(config: HttpRequestConfig<K>, raw?: boolean): Promise<K | HttpResponse<K>> {
    const preparedConfig = await this.prepareConfig(config, raw)

    try {
      return await this.dispatchRequest(preparedConfig)
    } catch (error) {
      return this.recoverFromError(error, preparedConfig)
    }
  }

  /**
   * 合并默认配置并执行请求钩子。
   * @param {HttpRequestConfig<K>} config 请求配置
   * @param {boolean} [raw] 是否强制返回原始响应
   * @returns {Promise<HttpInternalRequestConfig<K>>} 处理后的内部配置
   */
  private async prepareConfig<K>(config: HttpRequestConfig<K>, raw?: boolean): Promise<HttpInternalRequestConfig<K>> {
    const initialConfig: HttpInternalRequestConfig<K> = this.mergeConfig({
      ...config,
      rawResponse: raw ?? config.rawResponse
    })

    return this.runRequestHooks(initialConfig)
  }

  /** 合并默认参数并应用 header 注入逻辑 */
  private mergeConfig<K>(config: HttpRequestConfig<K>): HttpInternalRequestConfig<K> {
    const mergedHeaders = new axios.AxiosHeaders()

    const appendHeaders = (source?: AxiosRequestConfig['headers']) => {
      if (!source) return

      if (typeof source === 'string') {
        mergedHeaders.set('Content-Type', source)
        return
      }

      const headersObject = axios.AxiosHeaders.from(source as Record<string, string>)
      headersObject.forEach((value: string, key: string) => {
        mergedHeaders.set(key, value)
      })
    }

    appendHeaders(this.options.defaultHeaders as AxiosRequestConfig['headers'])
    appendHeaders(this.options.axiosConfig?.headers)
    appendHeaders(config.headers)

    return applyDefaultHeaders({
      ...(this.options.axiosConfig ?? {}),
      ...config,
      withAuth: config.withAuth ?? this.options.withAuth,
      autoRefreshToken: config.autoRefreshToken ?? this.options.autoRefreshToken,
      silent: config.silent ?? this.options.silent ?? false,
      retry: config.retry ?? this.options.defaultRetry,
      headers: mergedHeaders
    })
  }

  /** 依次执行请求钩子，允许在发送前修改配置 */
  /**
   * 顺序执行请求钩子，允许动态修改配置。
   * @param {HttpInternalRequestConfig<K>} config 内部请求配置
   * @returns {Promise<HttpInternalRequestConfig<K>>} 处理后的配置
   */
  private async runRequestHooks<K>(config: HttpInternalRequestConfig<K>): Promise<HttpInternalRequestConfig<K>> {
    let current = config
    const hooks = this.requestHooks as unknown as RequestHook<K>[]
    for (const hook of hooks) {
      current = await hook(current)
    }
    return current
  }

  /** 依次执行响应钩子，方便统一处理响应数据 */
  /**
   * 依次执行响应钩子，方便统一处理响应数据。
   * @param {HttpResponse<K>} response Axios 响应
   * @returns {Promise<HttpResponse<K>>} 处理后的响应
   */
  private async runResponseHooks<K>(response: HttpResponse<K>): Promise<HttpResponse<K>> {
    let current = response
    const hooks = this.responseHooks as unknown as ResponseHook<K>[]
    for (const hook of hooks) {
      current = await hook(current)
    }
    return current
  }

  /** 调用 Axios 发起请求，并在返回前运行响应钩子 */
  /**
   * 调用 Axios 发起请求，并在返回前运行响应钩子。
   * @param {HttpInternalRequestConfig<K>} config 请求配置
   * @returns {Promise<K | HttpResponse<K>>} 业务数据或原始响应
   */
  private async dispatchRequest<K>(config: HttpInternalRequestConfig<K>): Promise<K | HttpResponse<K>> {
    const response = await this.axios.request<K>(config)
    const processed = await this.runResponseHooks(response)
    return config.rawResponse ? processed : processed.data
  }

  /**
   * 错误恢复流程：优先尝试重试策略，其次尝试刷新令牌，最后触发错误钩子。
   * 若所有方案都失败则抛出最终的标准化 HttpError。
   */
  /**
   * 错误恢复流程：优先尝试重试策略，其次尝试刷新令牌，最后触发错误钩子。
   * 若所有方案都失败则抛出最终的标准化 HttpError。
   * @param {unknown} error 捕获到的错误对象
   * @param {HttpInternalRequestConfig<K>} config 当前请求配置
   * @returns {Promise<K | HttpResponse<K>>} 成功时的返回结果
   */
  private async recoverFromError<K>(error: unknown, config: HttpInternalRequestConfig<K>): Promise<K | HttpResponse<K>> {
    let currentConfig = config
    let currentError = await buildHttpError<K>(error, currentConfig)

    while (true) {
      const retryConfig = await handleRetry(currentError, currentConfig)
      if (!retryConfig) break

      const prepared = await this.runRequestHooks(retryConfig)

      try {
        return await this.dispatchRequest(prepared)
      } catch (retryError) {
        currentConfig = prepared
        currentError = await buildHttpError<K>(retryError, prepared)
      }
    }

    const recovered = await this.tryAuthRecovery(currentError)
    if (recovered) return recovered

    let processedError: HttpErrorLike<K> = currentError
    for (const hook of this.errorHooks) {
      processedError = await hook(processedError)
    }

    throw processedError
  }

  /** 基于 401 响应尝试刷新令牌并重发 */
  /**
   * 针对 401 错误尝试刷新令牌并重新发起请求。
   * @param {HttpErrorLike<K>} error 标准化错误对象
   * @returns {Promise<K | HttpResponse<K> | null>} 恢复成功返回结果，否则返回 null
   */
  private async tryAuthRecovery<K>(error: HttpErrorLike<K>): Promise<K | HttpResponse<K> | null> {
    if (!this.shouldAttemptAuthRecovery(error)) return null
    const refreshed = await this.ensureTokenRefreshed()
    if (!refreshed) return null

    const retryConfig: HttpInternalRequestConfig<K> = {
      ...error.config,
      __isTokenRetry: true,
      headers: error.config.headers
    }

    const prepared = await this.runRequestHooks(retryConfig)
    try {
      return await this.dispatchRequest(prepared)
    } catch (retryError) {
      const normalized = await buildHttpError(retryError, prepared)
      let current = normalized
      for (const hook of this.errorHooks) {
        current = await hook(current)
      }
      throw current
    }
  }

  /** 判断是否需要触发刷新令牌流程 */
  /**
   * 判断当前错误是否应触发认证恢复流程。
   * @param {HttpErrorLike<K>} error 标准化错误对象
   * @returns {boolean} 满足条件则返回 true
   */
  private shouldAttemptAuthRecovery<K>(error: HttpErrorLike<K>): boolean {
    if (error.config.__isTokenRetry) return false
    if (error.status !== 401) return false
    return error.config.autoRefreshToken ?? this.options.autoRefreshToken ?? false
  }

  /** 保证刷新令牌过程串行执行 */
  /**
   * 串行执行刷新令牌操作，避免并发刷新。
   * @returns {Promise<boolean>} 刷新成功返回 true
   */
  private async ensureTokenRefreshed(): Promise<boolean> {
    try {
      this.refreshPromise = this.refreshPromise ?? auth.refreshToken()
      await this.refreshPromise
      return true
    } catch {
      auth.logout()
      return false
    } finally {
      this.refreshPromise = undefined
    }
  }

  /** 注册请求钩子 */
  /**
   * 注册请求钩子，允许在发送前修改配置。
   * @param {RequestHook<T>} hook 请求钩子函数
   */
  useRequestHook(hook: RequestHook<T>): void {
    this.requestHooks.push(hook)
  }

  /** 注册响应钩子 */
  /**
   * 注册响应钩子，统一处理回包数据。
   * @param {ResponseHook<T>} hook 响应钩子函数
   */
  useResponseHook(hook: ResponseHook<T>): void {
    this.responseHooks.push(hook)
  }

  /** 注册错误钩子 */
  /**
   * 注册错误钩子，用于记录或二次处理错误。
   * @param {ErrorHook} hook 错误钩子函数
   */
  useErrorHook(hook: ErrorHook): void {
    this.errorHooks.push(hook)
  }
}

export const httpClient = new HttpClient(defaultHttpClientOptions)

export const http = {
  request: httpClient.request.bind(httpClient)
}
