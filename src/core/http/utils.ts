import axios, { AxiosError } from 'axios'
import { auth } from '@/core/auth'
import type { HttpErrorLike, HttpInternalRequestConfig } from './types'
import { HttpError } from './error'

/**
 * 将任意错误转换为标准化 HttpError，便于后续统一处理。
 * @param {unknown} error 原始错误对象
 * @param {HttpInternalRequestConfig<T>} config 请求配置
 * @returns {Promise<HttpErrorLike<T>>} 标准化错误实例
 */
export async function buildHttpError<T>(
  error: unknown,
  config: HttpInternalRequestConfig<T>
): Promise<HttpErrorLike<T>> {
  if (error instanceof HttpError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const cause = (error as Error & { cause?: unknown }).cause
    return new HttpError({
      message: error.message,
      name: error.name,
      code: error.code,
      status: error.response?.status,
      config,
      response: error.response,
      cause,
      originalError: error,
      isNetworkError: !error.response,
      isCancelled: axios.isCancel(error),
      silent: Boolean(config.silent)
    })
  }

  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause
    return new HttpError({
      message: error.message,
      name: error.name,
      config,
      cause,
      originalError: error,
      isCancelled: false,
      isNetworkError: false,
      silent: Boolean(config.silent)
    })
  }

  return new HttpError({
    message: 'Unknown HTTP error',
    name: 'HttpError',
    config,
    cause: undefined,
    isCancelled: false,
    isNetworkError: false,
    silent: Boolean(config.silent)
  })
}

/**
 * 根据约定自动补全请求头：认证、Accept、Content-Type。
 * @param {HttpInternalRequestConfig<T>} config 请求配置
 * @returns {HttpInternalRequestConfig<T>} 更新后的配置
 */
export function applyDefaultHeaders<T>(
  config: HttpInternalRequestConfig<T>
): HttpInternalRequestConfig<T> {
  const headers = new axios.AxiosHeaders(config.headers)
  const withAuth = config.withAuth ?? config.autoAttachToken ?? true
  if (withAuth) {
    const token = auth.getToken()
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (config.data && typeof config.data === 'object' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return {
    ...config,
    headers
  }
}

/**
 * 类型守卫：判断是否为 AxiosError。
 * @param {unknown} error 任意错误
 * @returns {error is AxiosError} 是否为 AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

