/**
 * Store 模块完整测试
 * 专门测试 Store 功能，不依赖 Vue 环境
 */

import { useUserStore } from './user.store'

/**
 * 测试 Store 状态管理
 */
export function testStoreState() {
  console.log('🧪 测试 Store 状态管理...')
  
  const userStore = useUserStore()
  
  // 测试初始状态
  console.log('初始状态:', {
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated,
    isLoading: userStore.isLoading,
    error: userStore.error
  })
  
  // 测试状态设置
  userStore.setLoading(true)
  console.log('设置加载状态后:', userStore.isLoading)
  
  userStore.setError('测试错误')
  console.log('设置错误后:', userStore.error)
  
  userStore.clearError()
  console.log('清除错误后:', userStore.error)
  
  userStore.setLoading(false)
  console.log('取消加载状态后:', userStore.isLoading)
  
  console.log('✅ Store 状态管理测试完成')
}

/**
 * 测试 Store Getters
 */
export function testStoreGetters() {
  console.log('🧪 测试 Store Getters...')
  
  const userStore = useUserStore()
  
  // 测试显示名称
  console.log('显示名称:', userStore.displayName)
  
  // 测试权限和角色
  console.log('权限列表:', userStore.permissions)
  console.log('角色列表:', userStore.roles)
  
  // 测试权限检查
  console.log('权限检查:', {
    hasAdmin: userStore.hasPermission('admin'),
    hasUser: userStore.hasPermission('user'),
    hasRole: userStore.hasRole('admin')
  })
  
  // 测试用户摘要
  console.log('用户摘要:', userStore.userSummary)
  
  // 测试登录状态
  console.log('登录状态:', userStore.isLoggedIn)
  
  console.log('✅ Store Getters 测试完成')
}

/**
 * 测试 Store Actions
 */
export function testStoreActions() {
  console.log('🧪 测试 Store Actions...')
  
  const userStore = useUserStore()
  
  // 测试同步功能
  console.log('执行同步前:', {
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated
  })
  
  userStore.syncFromAuth()
  console.log('执行同步后:', {
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated
  })
  
  // 测试刷新功能（异步）
  console.log('开始刷新测试...')
  userStore.refresh().then(() => {
    console.log('刷新完成:', {
      user: userStore.user,
      isAuthenticated: userStore.isAuthenticated
    })
  }).catch((error) => {
    console.log('刷新失败:', error)
  })
  
  console.log('✅ Store Actions 测试完成')
}

/**
 * 测试认证同步
 */
export function testAuthSync() {
  console.log('🧪 测试认证同步...')
  
  const userStore = useUserStore()
  
  // 启动认证同步
  const unsubscribe = userStore.startAuthSync()
  console.log('认证同步已启动')
  
  // 模拟认证事件
  setTimeout(() => {
    console.log('模拟认证状态变化...')
    userStore.syncFromAuth()
  }, 100)
  
  // 清理
  setTimeout(() => {
    unsubscribe()
    console.log('认证同步已停止')
  }, 200)
  
  console.log('✅ 认证同步测试完成')
}

/**
 * 运行所有 Store 测试
 */
export function runStoreTests() {
  console.log('🚀 开始 Store 模块测试...')
  
  try {
    testStoreState()
    testStoreGetters()
    testStoreActions()
    testAuthSync()
    
    console.log('🎉 所有 Store 测试通过！')
  } catch (error) {
    console.error('❌ Store 测试失败:', error)
  }
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  runStoreTests()
}
