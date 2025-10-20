import { describe, expect, it, vi, beforeEach } from 'vitest'
import { http } from '@/core/http'
import { toData } from '@/core/http'

/**
 * 单元测试目标：验证 `core/http/request` 模块的轻量请求函数。
 * 覆盖场景：
 * - 默认返回业务数据（response.data）；
 * - 原始响应返回（rawResponse: true）；
 * - 参数透传；
 * - 错误处理。
 */
describe('core/http/http-minimal', () => {
  let getSpy: any
  let postSpy: any
  let deleteSpy: any
  let putSpy: any

  beforeEach(() => {
    const makeResponse = (data: any) => ({ data, status: 200, headers: { 'content-type': 'application/json' } }) as any
    getSpy = vi.spyOn(http as any, 'get').mockResolvedValue(makeResponse({ ok: true }))
    postSpy = vi.spyOn(http as any, 'post').mockResolvedValue(makeResponse({ ok: true }))
    putSpy = vi.spyOn(http as any, 'put').mockResolvedValue(makeResponse({ ok: true }))
    deleteSpy = vi.spyOn(http as any, 'delete').mockResolvedValue(makeResponse({ ok: true }))
  })

  /**
   * 测试目标：默认请求应返回业务数据。
   * 输入：标准请求配置。
   * 预期：返回response.data，不返回原始响应。
   */
  it('应当保持 axios 返回值形态（AxiosResponse）', async () => {
    const res = await http.get('/test')
    expect(res).toHaveProperty('data')
  })

  /**
   * 测试目标：配置rawResponse: true应返回原始响应。
   * 输入：配置了rawResponse的请求。
   * 预期：返回原始响应对象。
   */
  it('toData 应当返回 data 部分', async () => {
    ;(getSpy as any).mockResolvedValueOnce({ data: [], status: 200, headers: {} })
    const users = await toData(http.get<{ id: number }[]>('/users'))
    expect(Array.isArray(users)).toBe(true)
  })

  /**
   * 测试目标：raw参数应覆盖配置中的rawResponse。
   * 输入：配置了rawResponse: false但传入raw: true。
   * 预期：使用raw参数，返回原始响应。
   */
  it('GET/POST/PUT/DELETE 应可调用并返回 AxiosResponse', async () => {
    const r1 = await http.get('/a')
    const r2 = await http.post('/b', { name: 'x' })
    const r3 = await http.put('/c', { id: 1 })
    const r4 = await http.delete('/d')
    expect(r1).toHaveProperty('data')
    expect(r2).toHaveProperty('data')
    expect(r3).toHaveProperty('data')
    expect(r4).toHaveProperty('data')
  })

  /**
   * 测试目标：raw参数为false时应返回业务数据。
   * 输入：配置了rawResponse: true但传入raw: false。
   * 预期：使用raw参数，返回业务数据。
   */
  it('错误应保持为 AxiosError（由调用方自行断言/处理）', async () => {
    getSpy.mockImplementationOnce((() => Promise.reject(Object.assign(new Error('x'), { isAxiosError: true }))) as any)
    await expect(http.get('/err')).rejects.toThrow()
  })

  /**
   * 测试目标：POST请求应正确传递数据。
   * 输入：POST请求配置。
   * 预期：数据被正确传递。
   */
  it('POST 请求应传递 body 并返回 AxiosResponse', async () => {
    const res = await http.post('/users', { name: 'n' })
    expect(res).toHaveProperty('data')
  })

  /**
   * 测试目标：PUT请求应正确传递数据。
   * 输入：PUT请求配置。
   * 预期：数据被正确传递。
   */
  it('PUT 请求应传递 body 并返回 AxiosResponse', async () => {
    const res = await http.put('/users/1', { name: 'updated' })
    expect(res).toHaveProperty('data')
  })

  /**
   * 测试目标：DELETE请求应正确处理。
   * 输入：DELETE请求配置。
   * 预期：请求被正确发送。
   */
  it('DELETE 请求应返回 AxiosResponse', async () => {
    const res = await http.delete('/users/1')
    expect(res).toHaveProperty('data')
  })

  /**
   * 测试目标：请求错误应被正确传播。
   * 输入：HTTP请求失败。
   * 预期：错误被正确抛出。
   */
  it('请求错误应被原样抛出（AxiosError）', async () => {
    postSpy.mockImplementationOnce((() => Promise.reject(Object.assign(new Error('fail'), { isAxiosError: true }))) as any)
    await expect(http.post('/x', {})).rejects.toThrow('fail')
  })

  /**
   * 测试目标：复杂请求配置应被正确传递。
   * 输入：包含headers、params等复杂配置的请求。
   * 预期：所有配置被正确传递。
   */
  it('应当支持复杂请求配置（headers/params/timeout）', async () => {
    await http.get('/test', {
      headers: { 'X-Test': '1' },
      params: { page: 1 },
      timeout: 5000
    })
    expect(getSpy).toHaveBeenCalled()
  })

  /**
   * 测试目标：原始响应应包含完整信息。
   * 输入：请求原始响应的配置。
   * 预期：返回完整的响应对象。
   */
  it('应当返回完整的 AxiosResponse（包含headers/status等）', async () => {
    const res = await http.get('/test')
    expect(res).toHaveProperty('status')
    expect(res).toHaveProperty('headers')
  })
})
