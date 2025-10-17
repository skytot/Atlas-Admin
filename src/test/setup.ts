import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { stubStorageGlobals } from '../../tests/utils/storage'

// 全局配置
config.global.mocks = {
  $t: (_key: string) => _key,
  $tc: (_key: string) => _key,
  $te: (_key: string) => true,
  $d: (value: Date | number | string) => value,
  $n: (value: number) => value
}

// 如果需要UI组件库，可以在这里添加相应的mock

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    name: 'Home',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {}
  })
}))

// 删除对 Pinia 的全局 mock，允许测试使用真实 API

// 移除 auth 的全局 mock，让测试使用真实的 auth 模块

stubStorageGlobals()
