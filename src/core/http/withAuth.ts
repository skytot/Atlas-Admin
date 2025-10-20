import type { AxiosRequestConfig } from 'axios'

/**
 * withAuth 选项。
 * @property getToken 获取访问令牌的方法；返回 null/undefined 时不注入。
 * @property headerKey 自定义注入的请求头键名，默认 'Authorization'。
 * @property scheme 自定义认证前缀，默认 'Bearer'；传空字符串可仅注入 token。
 */
export interface WithAuthOptions {
  getToken: () => string | null | undefined
  headerKey?: string
  scheme?: string
}

/**
 * 在单次请求配置中显式注入 Authorization 头。
 * 不改变 axios 默认行为，调用方自行选择是否使用。
 *
 * @typeParam D 请求体数据类型
 * @param config 原始 Axios 请求配置
 * @param opts 注入配置，包含获取 token 的回调与可选 header/scheme
 * @returns 合并了 Authorization 头的 Axios 请求配置（若未获取到 token 则原样返回）
 */
export function withAuth<D = unknown>(config: AxiosRequestConfig<D> = {}, opts: WithAuthOptions): AxiosRequestConfig<D> {
  let tokenValue: string | null | undefined
  try {
    tokenValue = opts.getToken?.()
  } catch {
    // 获取 token 失败时不注入，保持请求原样
    return config
  }
  const headerKey = opts.headerKey ?? 'Authorization'
  const scheme = opts.scheme ?? 'Bearer'

  // 规范化：仅接受非空字符串，去除首尾空白
  if (typeof tokenValue !== 'string') return config
  const trimmed = tokenValue.trim()
  if (!trimmed) return config

  const headerValue = scheme ? `${scheme} ${trimmed}` : trimmed

  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      [headerKey]: headerValue
    }
  }
}

export type { AxiosRequestConfig }


