import { describe, it, expect } from 'vitest'
import { withContext, toErrorContext } from '@/core/logger/tools'

describe('core/logger/tools', () => {
  it('withContext 应正确合并上下文与 extra', () => {
    const base = { module: 'a', extra: { a: 1 } } as any
    const extra = { action: 'x', extra: { b: 2 } } as any
    const merged = withContext(base, extra) as any
    expect(merged.module).toBe('a')
    expect(merged.action).toBe('x')
    expect(merged.extra).toEqual({ a: 1, b: 2 })
  })

  it('toErrorContext 应从错误中提取可用信息', () => {
    const err = new Error('fail') as any
    err.code = 'E'
    const ctx = toErrorContext(err) as any
    expect(ctx.module).toBe('error')
    expect(ctx.action).toBe('Error')
    expect(ctx.extra.message).toBe('fail')
  })
})


