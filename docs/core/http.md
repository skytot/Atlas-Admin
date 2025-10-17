# HTTP 客户端

HTTP 客户端模块基于 Axios 进行了分层封装，最终对外仅暴露一个通用请求函数 `request`。通过在配置中传递不同参数即可覆盖常见业务场景，包括标准 CRUD、下载、表单提交、无 Token 请求等。

## 模块结构

```
src/core/http/
├── config.ts              # 统一的默认配置（axios 与 HttpClient）
├── axios-instance.ts      # Axios 实例工厂，复用默认 axios 配置
├── http-client.ts         # HttpClient 实现与高级能力（认证、重试、钩子）
├── request.ts             # 对外唯一导出的 request 函数
├── retry.ts               # 重试策略实现
├── error.ts               # HttpError 定义
├── utils.ts               # Header 注入、错误归一化
├── types.ts               # 类型定义
└── index.ts               # 模块出口（仅导出 request）
```

## request 函数说明

```ts
import { request } from '@/core/http'
```

- **签名**：`request<T>(config: HttpRequestConfig<T>, raw?: true)`
- **默认返回**：`response.data`
- **原始响应**：传 `raw: true`（或在配置里写 `rawResponse: true`）即可得到 `AxiosResponse<T>`
- **配置选项**：继承自 `AxiosRequestConfig`，并扩展了 `withAuth`、`autoRefreshToken`、`retry`、`metadata` 等高级能力

## 常见用法

### 1. 标准 GET 请求

```ts
const users = await request<UserDTO[]>({
  url: '/users',
  method: 'GET'
})
```

### 2. 下载文件（获取 Blob）

```ts
const blob = await request<Blob>({
  url: '/reports/export',
  method: 'GET',
  responseType: 'blob',
  rawResponse: false // 默认为 false，可省略
})
```

需要读取响应头（例如文件名）时：

```ts
const response = await request<ArrayBuffer>(
  {
    url: '/reports/export',
    method: 'GET',
    responseType: 'arraybuffer'
  },
  true
) // 返回 AxiosResponse
const disposition = response.headers['content-disposition']
```

### 3. 表单提交

#### application/x-www-form-urlencoded

```ts
import qs from 'qs'

await request({
  url: '/form/submit',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  data: qs.stringify({ name: 'Alice', age: 18 })
})
```

#### multipart/form-data（包含文件）

```ts
const formData = new FormData()
formData.append('file', file)
formData.append('desc', '示例')

await request({
  url: '/upload',
  method: 'POST',
  data: formData,
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

### 4. 无需 Token 的请求

```ts
await request({
  url: '/public/info',
  method: 'GET',
  withAuth: false // 关闭默认的 Authorization 注入
})
```

### 5. 自定义重试策略

```ts
await request({
  url: '/analytics',
  method: 'GET',
  retry: {
    retries: 3,
    delay: attempt => attempt * 500,
    retryOnStatus: [500, 503]
  }
})
```

### 6. 原样透传请求配置

任意 Axios 原生配置都可透传，如 `timeout`、`paramsSerializer`、`transformRequest` 等（默认超时时间等可在 `src/core/http/config.ts` 中统一调整）：

```ts
await request({
  url: '/search',
  method: 'GET',
  params: { q: keyword },
  timeout: 20000,
  paramsSerializer: params => new URLSearchParams(params as Record<string, string>).toString()
})
```

## 高级能力（自动启用）

- **认证控制**：默认追加 Bearer Token；是否自动刷新由 `src/core/http/config.ts` 配置，当前默认关闭，如需启用可传 `autoRefreshToken: true` 或自定义 `HttpClient`
- **重试机制**：可选的状态码/网络重试策略，支持指数退避
- **钩子体系**：请求、响应、错误钩子在 `HttpClient` 中实现，若需要自定义流程可自行实例化 `HttpClient`
- **错误标准化**：所有异常最终都会转换为 `HttpError`，方便统一捕获与上报

若需要完全自定义行为，可直接实例化 `HttpClient`（同样建议引用 `defaultHttpClientOptions` 进行扩展）：

```ts
import { HttpClient } from '@/core/http/http-client'

const customClient = new HttpClient({
  withAuth: false,
  autoRefreshToken: false,
  retry: { retries: 1 }
})

const data = await customClient.request({ url: '/custom' })
```
1.使用内置 HttpClient 类创建实例

```ts
import { HttpClient } from '@/core/http/http-client'
import { defaultAxiosConfig, defaultHttpClientOptions } from '@/core/http/config'

const serviceA = new HttpClient({
  ...defaultHttpClientOptions,
  axiosConfig: { ...defaultAxiosConfig, baseURL: 'https://api-a.example.com' }
})

const serviceB = new HttpClient({
  ...defaultHttpClientOptions,
  withAuth: false, // 或者传其他自定义行为
  axiosConfig: { ...defaultAxiosConfig, baseURL: 'https://api-b.example.com' }
})
```

2. **不同实例独立使用**  
   ```ts
   const dataA = await serviceA.request({ url: '/resource' })
   const dataB = await serviceB.request({ url: '/public', withAuth: false })
   ```

要点说明：
- `HttpClient` 构造器允许传入 `instance`（现成的 Axios 实例）或 `axiosConfig`（额外的 Axios 配置）。
- 每个实例维护自己的钩子集合、刷新状态、重试策略等，互不影响。
- 建议基于 `src/core/http/config.ts` 提供的默认配置做扩展，避免散落默认值。
  
> 默认导出中不再暴露 `http` / `httpClient`，以 `request` 作为唯一通用入口，既满足通用场景，也为高级用法保留灵活空间。
