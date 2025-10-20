## Vue 3 编程思想与设计理念（本项目实践）

> 专注、组合、清晰、可靠

本文档阐述本项目在工程层面的设计哲学与落地方式，帮助新成员快速理解“哪里该改、怎么改”。

---

### 一、核心原则（The Core Tenets）

- **单一职责（Single Responsibility）**: 每个组件、函数、模块只解决一个明确问题。
- **组合优于继承（Composition over Inheritance）**: 以 `setup()` 与 composables 组合逻辑，而非继承层次。
- **显式优于隐式（Explicit over Implicit）**: 状态来源、副作用、依赖关系可见且可追溯。
- **可预测性（Predictability）**: 相同输入 → 相同输出，避免隐藏副作用与共享可变状态。
- **开发者体验即产品（DX as Product）**: 代码清晰易读、易调试、易测试、易协作。

---

### 二、分层架构（Layered Architecture）

项目结构按职责分层，每层“只做一件事”：

- **UI 层（components/views）**: 仅负责展示与用户交互，位于 `src/features/**/components`、`src/features/**/views`、`src/App.vue`、`src/styles/**`。
- **组合逻辑层（composables）**: 可复用的视图逻辑与状态组合（本项目按需在 `src/features/**/composables` 组织）。
- **业务服务层（services）**: 业务流程与规则编排（可在 `src/features/**/services` 建立）。
- **API 层（core/http + 模块 API）**: 标准化请求、拦截器与错误处理，集中在 `src/core/http/**`；按域拆分 API 模块于 `src/features/**/api`。
- **状态层（store）**: 领域化的共享状态，位于 `src/core/store/**` 与特性域 `src/features/**/stores`。
- **基础设施层（core）**: 配置、路由、存储、日志、错误处理等通用能力：
  - `src/core/http/**` 请求封装与错误重试
  - `src/core/error/**` 错误归一化与上报
  - `src/core/logger/**` 统一日志
  - `src/core/storage/**` 序列化/持久化
  - `src/core/router/**` 路由与静态路由
  - `src/core/auth/**` 认证初始化与持久化

层与层之间通过清晰接口交互，避免跨层耦合。

---

### 三、关键实践指南

#### 1) 组件：只负责“展示”和“用户交互”

- 不做：数据请求、复杂业务判断、权限校验
- 只做：接收 `props`，触发 `emits`，渲染 UI，调用 composables 处理局部逻辑

```vue
<!-- 示例：UserProfile.vue -->
<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
    <EditButton v-if="canEdit" @click="openEdit" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ userId: string }>();
const { user, canEdit } = useUserProfile(props.userId);
const emit = defineEmits<{ (e: 'open-edit'): void }>();
const openEdit = () => emit('open-edit');
</script>
```

#### 2) Composables：只封装“可复用逻辑”

- 每个 `useXxx` 只解决一个问题：数据获取、表单校验、权限判断等
- 不包含 UI，不直接操作 DOM

```ts
// 示例：composables/useUserProfile.ts
export function useUserProfile(userId: string) {
  const { data: user } = useFetchUser(userId);
  const canEdit = computed(() => user.value?.role === 'admin');
  return { user, canEdit };
}
```

#### 3) Services：只处理“业务流程”

- 协调多个 API 调用，封装业务规则
- 不直接响应用户事件，不包含 UI

```ts
// 示例：services/orderService.ts
export async function createOrder(params: OrderParams) {
  await validateStock(params.items);
  const coupon = await applyCoupon(params.couponCode);
  return api.createOrder({ ...params, coupon });
}
```

#### 4) API 层：只做“标准化请求”

- 统一拦截器、错误处理、序列化；返回纯数据
- 按域模块化（如 `userApi.ts`, `orderApi.ts`）

```ts
// 示例：features/user/api/userApi.ts
export const userApi = {
  getUser: (id: string) => client.get(`/users/${id}`),
  updateUser: (data: User) => client.put('/users', data),
};
```

#### 5) 状态管理（Pinia）：按业务域拆分 Store

- 每个 store 只管理一个领域状态（例如 `user`、`cart`）
- 优先使用局部状态 + composables，跨组件共享再引入 store
- 项目参考：`src/core/store/modules/user/**`

---

### 四、错误处理：职责分离

错误类型与处理位置：

- **网络/系统错误**（API 层 `src/core/http/**`）: 通过拦截器统一上报与全局提示，重试策略在 `retry.ts` 控制。
- **业务错误**（services/composables）: 将后端语义转换为用户可理解提示，必要时打点日志。
- **UI 交互错误**（组件内）: 就地反馈（如表单校验）。

实践要点：

- 使用标准错误对象与 `error.handled = true` 机制避免重复提示（见 `src/core/error/**`）。
- 统一日志入口（`src/core/logger/**`），区分 info/warn/error，便于测试与排查。

---

### 五、开发者体验（DX）保障

- **命名清晰**: `useFetchUser` 优于 `useData`，`orderService` 优于 `bizUtils`。
- **类型完备**: TypeScript 全覆盖，类型即文档；导出显式类型。
- **测试友好**:
  - composables 可做单元测试（Vitest，见 `tests/**`）
  - 组件可通过 Storybook/隔离场景测试 UI
  - services 通过 mock API 做集成测试
- **Tree-shaking 友好**: ESM 模块，避免副作用；按域拆分 `api/` 与 `services/`。

---

### 六、反模式（Anti‑Patterns）

| 反模式 | 问题 | 正确做法 |
| --- | --- | --- |
| 在组件中直接调用 axios | 职责混乱，难测试 | 通过 composables 或 services 间接调用，底层统一用 `core/http` |
| 一个 composable 做多件事 | 违反单一职责 | 拆分为 `useX`、`useY`、`useZ` |
| 全局 store 存所有状态 | 状态耦合，难维护 | 按领域拆分，优先局部状态 |
| `utils.ts` 包罗万象 | 无法 tree-shaking，难维护 | 按功能拆分模块，清晰命名与导出 |

---

### 七、与现有代码的映射关系

- `src/core/http/**`: Axios 实例、请求封装、错误处理与重试策略。
- `src/core/error/**`: 错误类型、归一化与上报策略，避免重复提示。
- `src/core/logger/**`: 可插拔传输（console/error）与结构化日志。
- `src/core/storage/**`: 序列化、持久化与类型约束。
- `src/core/auth/**`: 认证初始化、持久化、单一数据源架构（见文档与测试）。
- `src/core/router/**`: 路由初始化与静态路由装配。
- `src/core/store/**`: Pinia 入口与按域模块化（如 `modules/user/**`）。
- `src/features/**`: 业务特性模块（如 `dashboard`、`gov`、`user`），放置视图、组件、composables、api、stores 等。

当你需要修改功能：

- UI 行为与样式 → `features/**/components|views` 或 `styles/**`
- 可复用视图逻辑 → `features/**/composables`
- 业务编排与规则 → `features/**/services`
- 领域 API 调用 → `features/**/api`
- 跨组件共享状态 → `features/**/stores` 或 `core/store/**`
- 基建能力或横切关注点 → `src/core/**`

---

### 八、实践清单（Checklist）

- [ ] 一个文件只做一件事，名字能一眼看懂职责
- [ ] 组件内不直接访问底层 HTTP，改走 composable/service
- [ ] Composable 不直接操作 DOM，不混入多职责
- [ ] Service 不包含 UI 与事件语义
- [ ] API 返回纯数据，错误统一在拦截器与 `core/error` 归一化
- [ ] Store 仅存跨组件共享的最小必要状态
- [ ] 日志/错误上报使用统一入口（`core/logger`、`core/error`）
- [ ] 新增模块按 `features/<domain>/{views,components,composables,api,stores}` 组织
- [ ] 新增能力优先放入 `src/core/**` 并编写文档与测试

---

### 九、总结：做好一件事

让每个文件、每个函数、每个组件，都像一个专注的工匠：

- 只打磨一件作品，但把它做到极致。

通过清晰分层、严格职责边界、组合式逻辑复用与显式依赖关系，我们构建的不是“能跑就行”的代码，而是可被长期演进与维护的系统。


