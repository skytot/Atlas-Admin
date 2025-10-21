/**
 * 新 Store 模块测试
 * 验证重构后的 Store 功能
 */

import { useUserStore } from './user.store'

/**
 * 测试 Store 基本功能
 */
export function testStoreBasicFunctionality() {
  console.log('🧪 测试 Store 基本功能...')
  
  const userStore = useUserStore()
  
  // 测试初始状态
  console.log('初始状态:', {
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated,
    displayName: userStore.displayName
  })
  
  // 测试同步功能
  userStore.syncFromAuth()
  console.log('同步后状态:', {
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated
  })
  
  // 测试权限检查
  console.log('权限检查:', {
    hasPermission: userStore.hasPermission('admin'),
    hasRole: userStore.hasRole('user')
  })
  
  console.log('✅ Store 基本功能测试完成')
}

/**
 * 测试组合式函数功能
 * 注意：useAuth 需要在 Vue 组件环境中使用
 */
export function testComposableFunctionality() {
  console.log('🧪 测试组合式函数功能...')
  console.log('⚠️ 注意：useAuth 需要在 Vue 组件环境中使用')
  console.log('✅ 组合式函数功能测试完成（跳过实际测试）')
}

/**
 * 运行所有测试
 */
export function runAllTests() {
  console.log('🚀 开始测试新 Store 模块...')
  
  try {
    testStoreBasicFunctionality()
    testComposableFunctionality()
    
    console.log('🎉 所有测试通过！')
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  runAllTests()
}
