/**
 * 测试分组配置
 * 用于优化测试报告的组织和显示
 */

export const testGroups = {
  // 核心模块测试
  core: {
    name: '核心模块',
    pattern: 'tests/core/**/*.spec.ts',
    description: '核心功能模块测试',
    priority: 'high'
  },
  
  // HTTP模块测试
  http: {
    name: 'HTTP模块',
    pattern: 'tests/core/http/**/*.spec.ts',
    description: 'HTTP客户端和请求处理测试',
    priority: 'high'
  },
  
  // 存储模块测试
  storage: {
    name: '存储模块',
    pattern: 'tests/core/storage/**/*.spec.ts',
    description: '存储管理和序列化测试',
    priority: 'high'
  },
  
  // 认证模块测试
  auth: {
    name: '认证模块',
    pattern: 'tests/core/auth/**/*.spec.ts',
    description: '用户认证和权限管理测试',
    priority: 'high'
  },
  
  // 错误处理测试
  error: {
    name: '错误处理',
    pattern: 'tests/core/error/**/*.spec.ts',
    description: '错误捕获和处理测试',
    priority: 'medium'
  },
  
  // 路由模块测试
  router: {
    name: '路由模块',
    pattern: 'tests/core/router/**/*.spec.ts',
    description: '路由配置和导航测试',
    priority: 'medium'
  },
  
  // 日志模块测试
  logger: {
    name: '日志模块',
    pattern: 'tests/core/logger/**/*.spec.ts',
    description: '日志记录和传输测试',
    priority: 'low'
  }
}

// 测试标签配置
export const testTags = {
  // 按功能分类
  'unit': '单元测试',
  'integration': '集成测试',
  'e2e': '端到端测试',
  
  // 按模块分类
  'core': '核心模块',
  'http': 'HTTP模块',
  'storage': '存储模块',
  'auth': '认证模块',
  'error': '错误处理',
  'router': '路由模块',
  'logger': '日志模块',
  
  // 按优先级分类
  'critical': '关键功能',
  'important': '重要功能',
  'optional': '可选功能',
  
  // 按性能分类
  'fast': '快速测试',
  'slow': '慢速测试',
  'network': '网络相关'
}

// 测试环境配置
export const testEnvironments = {
  development: {
    timeout: 10000,
    retry: 2,
    parallel: true
  },
  ci: {
    timeout: 30000,
    retry: 3,
    parallel: false
  },
  production: {
    timeout: 60000,
    retry: 1,
    parallel: false
  }
}

// 测试报告配置
export const reportConfig = {
  // 基础报告
  basic: {
    reporter: 'basic',
    output: 'console'
  },
  
  // 详细报告
  verbose: {
    reporter: 'verbose',
    output: 'console'
  },
  
  // JSON报告
  json: {
    reporter: 'json',
    output: './test-results/results.json'
  },
  
  // HTML报告
  html: {
    reporter: 'html',
    output: './test-results/index.html'
  },
  
  // 多格式报告
  multi: {
    reporter: ['verbose', 'json', 'html'],
    output: {
      json: './test-results/results.json',
      html: './test-results/index.html'
    }
  }
}
