import type { App } from 'vue'
import { createPinia, type Pinia } from 'pinia'

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

// 导出用户 Store 模块
export * from './modules'

