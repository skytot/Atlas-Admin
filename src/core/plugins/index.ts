import type { App } from 'vue'
import { router } from '@/core/router'
import { setupErrorHandler } from '@/core/error/error-handler'
import { setupStore } from '@/core/store'
import { initAuth } from '@/core/auth/init'

/**
 * 注册核心插件模块，包括路由、全局错误处理和 store。
 * 注意：Auth模块采用按需导入方式，无需在此注册。
 * @param {App} app Vue 应用实例
 */
export function setupPlugins(app: App): void {
  setupStore(app)
  app.use(router)
  setupErrorHandler(app)
  
  // 在 Pinia 初始化完成后，立即初始化认证系统
  initAuth()
}
