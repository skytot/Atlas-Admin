# HTTP 客户端

本模块遵循“最少封装、严格对齐 axios”的原则：

- 对外导出一个配置后的 `AxiosInstance`：`http`
- 不改动 axios 的返回值与错误形态
- 提供可选工具函数 `toData`，供调用处显式提取 `response.data`

## 模块结构

```
src/core/http/
├── config.ts          # 默认 axios 配置（baseURL/timeout 等）
├── client.ts          # createHttpClient + http 单例（AxiosInstance）
├── toData.ts          # 可选工具，将 Promise<AxiosResponse<T>> 映射为 Promise<T>
└── index.ts           # 模块出口
```

## 导出

```ts
import { http, createHttpClient, toData } from '@/core/http'
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from '@/core/http'
```

- `http`: 默认实例，`AxiosInstance`
- `createHttpClient(config?)`: 创建新的 `AxiosInstance`
- `toData(promise)`: 将 `Promise<AxiosResponse<T>>` 转为 `Promise<T>`（可选）
- 类型全部直接重导出自 axios 官方定义

## 使用示例

### 1. 标准 GET 请求（保持 axios 语义）

```ts
const res = await http.get<User[]>('/users') // AxiosResponse<User[]>
console.log(res.data)
```

若更偏好直接拿 data：

```ts
import { toData } from '@/core/http'
const users = await toData(http.get<User[]>('/users')) // Promise<User[]>
```

### 2. 表单与上传

```ts
await http.post('/form/submit', new URLSearchParams({ name: 'Alice' }), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

const formData = new FormData()
formData.append('file', file)
await http.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
```

### 3. 下载文件与读取响应头

```ts
const res = await http.get<ArrayBuffer>('/reports/export', { responseType: 'arraybuffer' })
const disposition = res.headers['content-disposition']
```

### 4. 创建独立实例

```ts
import { createHttpClient } from '@/core/http'
const serviceA = createHttpClient({ baseURL: 'https://api-a.example.com' })
const serviceB = createHttpClient({ baseURL: 'https://api-b.example.com', withCredentials: true })
```

## 设计约束

- 不新增自定义配置项；仅使用 axios 官方 `AxiosRequestConfig`
- 不改写返回值/错误形态；错误保持 `AxiosError`
- 默认能力（超时、baseURL 等）在 `config.ts` 配置；业务能力在调用处显式实现

## API 层示例

```ts
// src/features/user/api/userApi.ts
import { http, toData } from '@/core/http'

export interface UserDTO {
  id: number
  name: string
  roles?: string[]
  permissions?: string[]
}

export const userApi = {
  getUser: (id: string | number) => toData(http.get<UserDTO>(`/users/${id}`)),
  listUsers: () => toData(http.get<UserDTO[]>('/users')),
  updateUser: (data: UserDTO) => toData(http.put<UserDTO>(`/users/${data.id}`, data)),
}
```

## 鉴权注入（显式工具）

```ts
import { http, withAuth, toData } from '@/core/http'

// 从你的认证模块获取 token（示例）
const getToken = () => localStorage.getItem('token')

// 在单次请求前显式注入 Authorization 头
const profile = await toData(
  http.get<UserDTO>('/me', withAuth({}, { getToken }))
)

// 自定义请求头键名与前缀（如仅注入 token）
const res = await http.get('/audit', withAuth({}, { getToken, headerKey: 'X-Auth-Token', scheme: '' }))
```

## JSDoc 与类型提示约定

- 所有可选工具均提供完整 JSDoc，IDE 将展示参数、返回值与默认值说明。
- 严格遵循 axios 类型：
  - 返回 `AxiosResponse<T>`；
  - 错误为 `AxiosError`；
  - 仅使用 `AxiosRequestConfig` 作为配置类型。
- 建议在 API 层结合 `toData` 返回纯数据，以提升上层可读性。
