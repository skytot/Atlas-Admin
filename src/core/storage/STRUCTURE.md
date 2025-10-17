# 存储模块结构说明

## 模块架构

```
src/core/storage/
├── index.ts            # 模块入口，只导出 storage 与 StorageManager
├── storage-manager.ts  # 核心实现，封装浏览器 Storage API
├── types.ts            # 类型定义文件
└── example.ts          # 使用示例
```

## 设计原则

### 1. 单一出口
- 对外仅通过 `index.ts` 导出 `storage` 与 `StorageManager`
- 类型统一从 `types.ts` 导出

### 2. 明确依赖
- `storage-manager.ts` 依赖浏览器 `localStorage` / `sessionStorage`
- 如需 SSR，需在外部注入兼容实现（TODO）

### 3. 职责划分
- `StorageManager` 负责底层读写与事件触发
- `storage` 提供便捷方法、默认实例
- 类型定义集中管理，避免重复定义

## 使用方式

```typescript
import { storage, StorageManager } from '@/core/storage'
import type { StorageOptions } from '@/core/storage'

storage.set('token', 'abc123')
const token = storage.get<string>('token')

const custom = new StorageManager('APP_', 'sessionStorage')
custom.setItem('cache', { foo: 'bar' })
```
### StorageManager（类）
面向想要完全掌控存储行为的场景。
可自定义前缀、选择 localStorage / sessionStorage 等，必要时还可以继承扩展。
适合在非标准环境（多实例、多命名空间、插件扩展）中自行创建实例。

### storageManager（默认实例）
StorageManager 的默认单例，内部配置了约定好的前缀/默认存储。
需要访问更底层的能力（如 getItemInfo、setItemWithExpiry）但又不想自己 new 的时候使用。
在模块内部复用，避免重复实例化。

### storage（便捷对象）
针对常见读写操作提供的轻量 API：set / get / remove / clear / has / keys / onChange / setWithExpiry / getWithExpiry。
默认做了序列化、事件派发等封装，日常业务无需关心底层细节，直接调用即可。
适合绝大多数业务代码，保持调用方式统一。

## TODO

- [ ] 提供可注入的 Storage 抽象，支持 SSR 或自定义存储后端
- [ ] 增加批量操作、命名空间隔离等高级特性
