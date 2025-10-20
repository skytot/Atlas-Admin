// 最小 http 客户端导出：严格对齐 axios 行为
export { http, createHttpClient } from './client'
export type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from './client'

// 可选工具：不改变默认行为，调用方显式选择
export { toData } from './toData'
export { withAuth } from './withAuth'

