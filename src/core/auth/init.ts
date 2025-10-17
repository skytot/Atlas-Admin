/**
 * 认证模块初始化
 * 在应用启动时恢复认证状态并同步到UserStore
 */

import { auth } from './index'
import { useUserStore } from '@/core/store/modules/user'

/**
 * 初始化认证系统
 * 恢复认证状态并同步到UserStore
 * 注意：此函数必须在 Pinia 初始化之后调用
 */
export function initAuth(): void {
  // 1. 从持久化存储恢复认证状态
  auth.restore()
  
  // 2. 获取UserStore实例并恢复状态
  // 此时 Pinia 已经初始化完成，可以安全使用
  const userStore = useUserStore()
  userStore.restoreFromAuth()
}
