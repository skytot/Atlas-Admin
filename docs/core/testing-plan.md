# Core 模块测试计划

## 1. 背景与目标
- 确保 `src/core` 各模块在重构与增量迭代时具备高置信度回归保障。
- 利用 Vitest 打造统一的单元与集成测试基线，提升缺陷发现率与维护性。
- 形成可执行的里程碑与产出物，支撑持续集成及文档化要求。

## 2. 范围
- 覆盖模块：`auth`、`config`、`error`、`http`、`logger`、`plugins`、`router`、`storage`、`store`。
- 输出物：测试基础设施（目录、mock 工具、配置）、模块测试用例、覆盖率报告、测试使用指南。
- 不在范围：特定业务 `features`、UI 组件外观测试、端到端流程。

## 3. 测试类型
- 单元测试（Unit）：函数/工具/类型守卫的行为与边界验证。
- 集成测试（Integration）：跨模块组合（如 HTTP + Error、Store + HTTP）的协同校验。
- 快照测试（Snapshot）：结构稳定输出（如路由表、日志格式）且版本变化可控时使用。

## 4. 工具与环境
- 测试框架：Vitest（`globals: true`、`jsdom` 环境）。
- Vue 支撑：`@vue/test-utils`，必要时结合 `vitest-environment-jsdom`。
- Mock：`vi.mock`、自定义工具；HTTP 建议引入 `msw` 或基于 axios mock；存储使用 `vi.stubGlobal`。
- 目录规范：`tests/core/<module>/*.spec.ts`，共享工具放于 `tests/utils`。

## 5. 里程碑
| 里程碑 | 目标 | 预计输出 |
| --- | --- | --- |
| M1 | 测试基线搭建 | 目录结构、setup、mock 工具、计划文档更新 |
| M2 | 核心模块首批用例 | `core/http`、`core/store/user` 单元+集成用例 |
| M3 | 全量核心覆盖 | 其余模块关键用例、快照、异常分支 |
| M4 | 质量度量 | 覆盖率报告、CI 集成建议、复盘总结 |

## 6. 任务分解
1. 审查与完善测试配置
   - 复核 `vitest.config.ts`、`src/test/setup.ts`，识别缺口。
   - 规划测试目录与别名。
2. 搭建公共测试基础设施
   - 创建 `tests/core` 目录与 README。
   - 构建 HTTP、Storage、Logger 等 Mock。
   - 封装常用断言/工厂函数。
3. `core/http` 模块用例
   - 单元：`retry`、`utils`、错误分类。
   - 集成：`http-client` 请求流程、错误与重试逻辑。
4. `core/store` 与 `user` 子模块用例
   - 使用 Pinia 测试环境，验证 actions/getters。
   - Mock HTTP 交互、状态持久化。
5. 其余核心模块用例
   - `auth`、`error`、`logger`、`storage`、`router`、`plugins`。
   - 快照覆盖路由、日志结构。
6. 质量度量与交付
   - `pnpm vitest run --coverage`，记录基准覆盖率。
   - 形成使用说明、复盘结论。

## 7. 风险与应对
- Mock 复杂度：优先封装工具减少重复，必要时引入 `msw`。
- 现有模块耦合：通过依赖注入或接口隔离调整测试点。
- 运行时间增长：分层执行（单元优先），利用 Vitest 并行。

## 8. 度量与准入标准
- 覆盖率指标：核心模块语句 ≥ 85%，分支 ≥ 75%。
- 用例质量：关键路径至少包含成功、失败、异常三类断言。
- CI 要求：Vitest 所有用例通过，生成覆盖率报告无严重警告。

## 9. 沟通与交付
- 周期性同步：完成每个里程碑后更新文档与 TODO 状态。
- 文档更新：`docs/core` 目录内维护最新进度、使用指南。
- 收尾：提交最终测试总结与后续改进建议。


