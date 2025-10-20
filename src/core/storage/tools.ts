/**
 * 将任意值安全序列化为 JSON 字符串。
 * - 失败时返回 undefined，而不是抛错
 */
export function toJSON(value: unknown): string | undefined {
  try {
    return JSON.stringify(value)
  } catch {
    return undefined
  }
}

/**
 * 安全解析 JSON 字符串。
 * - 解析失败返回 undefined
 */
export function fromJSON<T = unknown>(json: string): T | undefined {
  try {
    return JSON.parse(json) as T
  } catch {
    return undefined
  }
}

/**
 * 生成带前缀的键名（纯函数）。
 */
export function withPrefix(prefix: string, key: string): string {
  return `${prefix}${key}`
}

/**
 * 包装值，附带过期时间戳（毫秒）。
 */
export function withTTL<T>(value: T, ttlMs: number): { value: T; expiry: number } {
  return { value, expiry: Date.now() + Math.max(0, ttlMs) }
}


