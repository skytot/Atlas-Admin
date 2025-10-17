/**
 * 创建基于 Map 的 storage mock，实现 localStorage/sessionStorage 接口。
 * - 用例：在单测中替代浏览器存储，提供可控的状态隔离。
 */
export const createMemoryStorage = () => {
  const store = new Map<string, string>()

  const storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null
  }

  // 添加 Object.keys 支持，用于 StorageManager.clear() 方法
  Object.defineProperty(storage, 'keys', {
    value: () => Array.from(store.keys()),
    configurable: true
  })

  return storage
}

/**
 * 将内存存储挂载到全局对象，返回两个实例便于断言。
 * - 建议在测试 setup 中调用，确保跨用例共享行为一致。
 */
export const stubStorageGlobals = () => {
  const localStorage = createMemoryStorage()
  const sessionStorage = createMemoryStorage()

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorage,
    configurable: true
  })

  Object.defineProperty(globalThis, 'sessionStorage', {
    value: sessionStorage,
    configurable: true
  })

  return { localStorage, sessionStorage }
}


