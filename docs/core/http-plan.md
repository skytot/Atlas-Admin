## HTTP 能力规划（Plan）

目标：在“最少封装、严格对齐 axios”的前提下，按需提供可选工具函数，降低调用代码复杂度，同时保持显式与可测试性。

不变约束：

- 不改变 axios 的默认返回值与错误形态（返回 AxiosResponse，错误为 AxiosError）。
- 工具应为可选、显式、纯函数优先；拦截器只做只读记录（如日志/trace）。

实施路线：分阶段、小步快跑、用例驱动（先测后码）。

---

### 第一阶段（高频刚需）

- toData 扩展：
  - toDataOr<T>(p: Promise<AxiosResponse<T>>, fallback: T): Promise<T>
  - safeData<T>(p: Promise<AxiosResponse<T>>): Promise<{ ok: true; data: T } | { ok: false; error: AxiosError }>
- 超时与取消：
  - withTimeout<T>(p: Promise<T>, ms: number): Promise<T>
  - makeCancelable<T>(p: Promise<T>): { promise: Promise<T>; cancel: () => void }
- 重试（显式调用，不改默认行为）：
  - withRetry<T>(fn: () => Promise<T>, opts: { retries: number; backoff?: 'linear' | 'exp' | ((n: number) => number) }): Promise<T>
- 错误工具：
  - classifyAxiosError(err: unknown): { isNetwork: boolean; isTimeout: boolean; status?: number; code?: string }

验收标准：

- 单元测试覆盖核心分支；示例在 docs/core/http.md 中新增简短用法片段。

---

### 第二阶段（可观察性与易用性）

- 进度与节流：
  - onUploadProgressThrottled(handler, intervalMs)
  - onDownloadProgressThrottled(handler, intervalMs)
- 鉴权与序列化辅助：
  - withAuth(config, getToken): AxiosRequestConfig
  - json(), formUrlencoded(), multipart()：返回 { headers, data }
- 分页与列表：
  - fetchPaged<T>(url, { page, size, params? }): Promise<{ items: T[]; total?: number }>
- 缓存与条件请求：
  - withCache<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number)
  - etag helpers：buildIfNoneMatch(headers), parseEtag(response)

验收标准：

- 以一个真实 feature（如 user 列表）编写用例验证，避免抽象过度。

---

### 第三阶段（可靠性与弹性）

- 并发与限流：
  - limit<T>(fn: (...args: any[]) => Promise<T>, { maxConcurrent, minInterval })
- 熔断：
  - circuit<T>(fn: () => Promise<T>, opts: { failureThreshold: number; cooldownMs: number })
- 多源竞速与健康检查：
  - raceHosts<T>(hosts: string[], build: (base: string) => Promise<T>)
  - healthCheck(url: string): Promise<'up' | 'down'>

验收标准：

- 针对稳定性场景的附加测试与文档说明（边界与代价明确）。

---

### 非目标/排除项

- 重新定义 axios API（包括返回值与错误形态）。
- 隐式插件体系或“魔法”拦截器；一律显式工具替代。

---

### 里程碑与产出物

- M1：第一阶段工具 + 单元测试 + docs 片段
- M2：第二阶段工具 + 示例 feature 用例 + 文档
- M3：第三阶段工具 + 压测/故障演练说明

---

### 维护约定

- 工具以小模块拆分：`src/core/http/tools/*`
- 每个工具具备：类型签名、失败语义、复杂度说明、测试用例、docs 示例。


