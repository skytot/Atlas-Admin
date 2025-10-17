#!/usr/bin/env node

/**
 * 测试结果分析脚本
 * 分析测试结果并提供详细的报告
 */

const fs = require('fs')
const path = require('path')

const RESULTS_DIR = './test-results'
const RESULTS_FILE = path.join(RESULTS_DIR, 'results.json')

function analyzeTestResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.log('❌ 未找到测试结果文件，请先运行测试')
    process.exit(1)
  }

  try {
    const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
    
    console.log('📊 测试结果分析报告')
    console.log('═'.repeat(60))
    
    // 基本统计
    const stats = results.testResults.reduce((acc, file) => {
      acc.total += file.numTotalTests
      acc.passed += file.numPassingTests
      acc.failed += file.numFailingTests
      acc.skipped += file.numTodoTests
      acc.duration += file.perfStats.end - file.perfStats.start
      return acc
    }, { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 })

    console.log(`📈 测试统计:`)
    console.log(`   总测试数: ${stats.total}`)
    console.log(`   通过: ${stats.passed} (${((stats.passed / stats.total) * 100).toFixed(1)}%)`)
    console.log(`   失败: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`)
    console.log(`   跳过: ${stats.skipped} (${((stats.skipped / stats.total) * 100).toFixed(1)}%)`)
    console.log(`   耗时: ${(stats.duration / 1000).toFixed(2)}s`)
    console.log()

    // 文件级别分析
    console.log('📁 文件级别分析:')
    results.testResults.forEach(file => {
      const status = file.numFailingTests > 0 ? '❌' : '✅'
      const duration = ((file.perfStats.end - file.perfStats.start) / 1000).toFixed(2)
      console.log(`   ${status} ${file.testFilePath}`)
      console.log(`      通过: ${file.numPassingTests}, 失败: ${file.numFailingTests}, 耗时: ${duration}s`)
    })
    console.log()

    // 失败测试详情
    const failedTests = results.testResults
      .filter(file => file.numFailingTests > 0)
      .flatMap(file => file.assertionResults.filter(test => test.status === 'failed'))

    if (failedTests.length > 0) {
      console.log('❌ 失败测试详情:')
      failedTests.forEach(test => {
        console.log(`   • ${test.title}`)
        if (test.failureMessages && test.failureMessages.length > 0) {
          console.log(`     错误: ${test.failureMessages[0].split('\n')[0]}`)
        }
      })
      console.log()
    }

    // 性能分析
    const slowTests = results.testResults
      .flatMap(file => file.assertionResults)
      .filter(test => test.duration && test.duration > 1000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)

    if (slowTests.length > 0) {
      console.log('⏱️  最慢的测试 (前5个):')
      slowTests.forEach(test => {
        console.log(`   • ${test.title}: ${test.duration}ms`)
      })
      console.log()
    }

    // 建议
    console.log('💡 优化建议:')
    if (stats.failed > 0) {
      console.log('   • 修复失败的测试用例')
    }
    if (slowTests.length > 0) {
      console.log('   • 优化慢速测试用例')
    }
    if (stats.skipped > 0) {
      console.log('   • 检查跳过的测试用例')
    }
    if (stats.duration > 30000) {
      console.log('   • 考虑并行运行测试')
    }

    console.log('═'.repeat(60))
    console.log('✅ 分析完成!')

  } catch (error) {
    console.error('❌ 分析测试结果时出错:', error.message)
    process.exit(1)
  }
}

// 运行分析
analyzeTestResults()
