import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import { useAuth, useAuthState } from '@/core/store/modules/user'
import { auth } from '@/core/auth'

/**
 * 测试目标：验证 `useAuth` 组合式函数
 * 覆盖场景：
 * - 响应式状态管理
 * - 认证操作
 * - 生命周期管理
 */
describe('core/store/modules/user/useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清理认证状态
    auth.logout()
  })

  /**
   * 测试目标：useAuth 基本功能
   */
  it('应当提供正确的认证功能', () => {
  const TestComponent = defineComponent({
    setup() {
      const { state, displayName, hasPermission, login, logout, syncFromAuth } = useAuth()
      
      return {
        state,
        displayName,
        hasPermission,
        login,
        logout,
        syncFromAuth
      }
    },
    template: '<div></div>'
  })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 测试初始状态
    expect(vm.state.user).toBeNull()
    expect(vm.state.isAuthenticated).toBe(false)
    expect(vm.displayName).toBe('未知用户')
    expect(vm.hasPermission('admin')).toBe(false)
  })

  /**
   * 测试目标：useAuthState 只读功能
   */
  it('应当提供只读认证状态', () => {
    const TestComponent = defineComponent({
      setup() {
        const { state, displayName, hasPermission } = useAuthState()
        
        return {
          state,
          displayName,
          hasPermission
        }
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 测试初始状态
    expect(vm.state.user).toBeNull()
    expect(vm.state.isAuthenticated).toBe(false)
    expect(vm.displayName).toBe('未知用户')
    expect(vm.hasPermission('admin')).toBe(false)
  })

  /**
   * 测试目标：认证状态同步
   */
  it('应当正确同步认证状态', async () => {
  const TestComponent = defineComponent({
    setup() {
      const { state, displayName, hasPermission, syncFromAuth } = useAuth()
      
      return {
        state,
        displayName,
        hasPermission,
        syncFromAuth
      }
    },
    template: '<div></div>'
  })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 设置认证状态
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read'],
      roles: ['user']
    })

    // 手动触发同步
    vm.syncFromAuth()

    // 等待响应式更新
    await wrapper.vm.$nextTick()

    expect(vm.state.user).toBeTruthy()
    expect(vm.state.isAuthenticated).toBe(true)
    expect(vm.displayName).toBe('Alice')
    expect(vm.hasPermission('dashboard.read')).toBe(true)
  })

  /**
   * 测试目标：权限检查功能
   */
  it('应当正确检查权限', async () => {
  const TestComponent = defineComponent({
    setup() {
      const { hasPermission, hasRole, syncFromAuth } = useAuth()
      
      return {
        hasPermission,
        hasRole,
        syncFromAuth
      }
    },
    template: '<div></div>'
  })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 设置用户权限
    auth.setToken('test-token')
    auth.setUser({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      permissions: ['dashboard.read', 'admin'],
      roles: ['user', 'admin']
    })

    // 手动触发同步
    vm.syncFromAuth()

    await wrapper.vm.$nextTick()

    expect(vm.hasPermission('dashboard.read')).toBe(true)
    expect(vm.hasPermission('admin')).toBe(true)
    expect(vm.hasPermission('nonexistent')).toBe(false)
    expect(vm.hasRole('user')).toBe(true)
    expect(vm.hasRole('admin')).toBe(true)
    expect(vm.hasRole('nonexistent')).toBe(false)
  })

  /**
   * 测试目标：认证操作
   */
  it('应当正确处理认证操作', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { login, logout } = useAuth()
        
        return {
          login,
          logout
        }
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 测试登出
    vm.logout()
    expect(auth.getUser()).toBeNull()
    expect(auth.isAuthenticated()).toBe(false)
  })

  /**
   * 测试目标：生命周期管理
   */
  it('应当正确管理生命周期', () => {
    const TestComponent = defineComponent({
      setup() {
        const { startAuthSync, stopAuthSync } = useAuth()
        
        return {
          startAuthSync,
          stopAuthSync
        }
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm

    // 测试启动同步
    const unsubscribe = vm.startAuthSync()
    expect(typeof unsubscribe).toBe('function')
    
    // 测试停止同步
    vm.stopAuthSync()
    
    // 清理
    if (typeof unsubscribe === 'function') {
      unsubscribe()
    }
  })
})
