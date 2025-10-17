import type { HttpErrorInit, HttpErrorLike } from './types'

/**
 * HttpError 将 Axios 错误或其他异常标准化，便于全局处理。
 */
export class HttpError<T = unknown> extends Error implements HttpErrorLike<T> {
  code?: string
  status?: number
  config: HttpErrorInit<T>['config']
  response?: HttpErrorInit<T>['response']
  cause?: unknown
  originalError?: unknown
  isNetworkError: boolean
  isCancelled: boolean
  silent: boolean

  constructor({
    message,
    name,
    code,
    status,
    config,
    response,
    cause,
    originalError,
    isNetworkError,
    isCancelled,
    silent = false
  }: HttpErrorInit<T>) {
    super(message)
    this.name = name ?? 'HttpError'
    this.code = code
    this.status = status
    this.config = config
    this.response = response
    this.cause = cause
    this.originalError = originalError
    this.isNetworkError = isNetworkError
    this.isCancelled = isCancelled
    this.silent = silent
  }
}

/**
 * 判断是否为 HttpError。
 * @param {unknown} error 任意错误
 * @returns {error is HttpErrorLike} 是否为 HttpError
 */
export function isHttpError(error: unknown): error is HttpErrorLike {
  return error instanceof HttpError
}

