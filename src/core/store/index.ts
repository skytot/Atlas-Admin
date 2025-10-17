import type { App } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import { createUserStore, createAuthBridge, createUserPersistenceAdapter } from './modules/user'

let piniaInstance: Pinia | null = null

function ensurePiniaInstance(): Pinia {
  if (!piniaInstance) {
    piniaInstance = createPinia()
  }
  return piniaInstance
}

/**
 * 将 Pinia 与全局 store 能力装配到应用实例。
 * @param {App} app 当前 Vue 应用实例
 */
export function setupStore(app: App): void {
  const pinia = ensurePiniaInstance()
  app.use(pinia)
}

/**
 * 获取全局复用的 Pinia 实例。
 * @returns {Pinia} 单例 Pinia 实例
 */
export function getPiniaInstance(): Pinia {
  return ensurePiniaInstance()
}

export * from './modules/user'

/**
 * 默认的用户 store，附带认证桥接与本地持久化。
 */
export const useUserStore = createUserStore({
  authBridge: createAuthBridge(),
  persistence: createUserPersistenceAdapter()
})

