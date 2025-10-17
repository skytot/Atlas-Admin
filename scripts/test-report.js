#!/usr/bin/env node

/**
 * 测试报告优化脚本
 * 提供多种测试运行模式和报告格式
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// 测试结果目录
const RESULTS_DIR = './test-results'

// 确保结果目录存在
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true })
}

// 测试模式配置
const testModes = {
  // 快速模式 - 只运行核心测试
  quick: {
    pattern: 'tests/core/{auth,storage,error}/**/*.spec.ts',
    description: '快速测试 - 核心模块'
  },
  // 完整模式 - 运行所有测试
  full: {
    pattern: 'tests/**/*.spec.ts',
    description: '完整测试 - 所有模块'
  },
  // HTTP模块测试
  http: {
    pattern: 'tests/core/http/**/*.spec.ts',
    description: 'HTTP模块测试'
  },
  // 存储模块测试
  storage: {
    pattern: 'tests/core/storage/**/*.spec.ts',
    description: '存储模块测试'
  }
}

// 报告器配置
const reporters = {
  verbose: 'verbose',
  basic: 'basic',
  dot: 'dot',
  json: 'json'
}

function runTests(mode = 'full', reporter = 'verbose') {
  const config = testModes[mode]
  if (!config) {
    console.error(`❌ 未知的测试模式: ${mode}`)
    console.log('可用模式:', Object.keys(testModes).join(', '))
    process.exit(1)
  }

  console.log(`🚀 开始运行测试: ${config.description}`)
  console.log(`📊 报告器: ${reporter}`)
  console.log(`🔍 测试模式: ${mode}`)
  console.log('─'.repeat(50))

  try {
    const command = `npx vitest run --reporter=${reporter}`
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log('─'.repeat(50))
    console.log('✅ 测试完成!')
    
    // 显示结果文件
    if (reporter === 'json' && fs.existsSync('./test-results/results.json')) {
      console.log('📄 JSON报告: ./test-results/results.json')
    }
    if (reporter === 'html' && fs.existsSync('./test-results/index.html')) {
      console.log('🌐 HTML报告: ./test-results/index.html')
    }
    
  } catch (error) {
    console.error('❌ 测试运行失败:', error.message)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
🧪 测试报告优化工具

用法:
  node scripts/test-report.js [模式] [报告器]

模式:
  ${Object.entries(testModes).map(([key, config]) => 
    `  ${key.padEnd(8)} - ${config.description}`
  ).join('\n')}

报告器:
  ${Object.entries(reporters).map(([key, value]) => 
    `  ${key.padEnd(8)} - ${value}`
  ).join('\n')}

示例:
  node scripts/test-report.js quick verbose    # 快速测试，详细输出
  node scripts/test-report.js full json       # 完整测试，JSON报告
  node scripts/test-report.js http html       # HTTP测试，HTML报告
`)
}

// 解析命令行参数
const args = process.argv.slice(2)
const mode = args[0] || 'full'
const reporter = args[1] || 'verbose'

if (mode === 'help' || mode === '--help' || mode === '-h') {
  showHelp()
  process.exit(0)
}

runTests(mode, reporter)
