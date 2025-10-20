import { describe, it, expect } from 'vitest'
import { toJSON, fromJSON, withPrefix, withTTL } from '@/core/storage/tools'

describe('core/storage/tools', () => {
  it('toJSON/fromJSON 应该安全序列化与解析', () => {
    const obj = { a: 1 }
    const s = toJSON(obj)!
    expect(typeof s).toBe('string')
    const back = fromJSON<typeof obj>(s)!
    expect(back.a).toBe(1)
  })

  it('withPrefix 应生成带前缀键名', () => {
    expect(withPrefix('APP_', 'k')).toBe('APP_k')
  })

  it('withTTL 应包装值与过期时间', () => {
    const wrapped = withTTL('v', 100)
    expect(wrapped.value).toBe('v')
    expect(typeof wrapped.expiry).toBe('number')
  })
})


