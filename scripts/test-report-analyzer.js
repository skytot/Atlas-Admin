#!/usr/bin/env node

/**
 * 测试结果分析器
 * 解析测试结果JSON数据并生成可视化报告
 */

import fs from 'fs'
import path from 'path'

const RESULTS_DIR = './test-results'
const DOCS_DIR = './docs/testing'
const RESULTS_FILE = path.join(RESULTS_DIR, 'results.json')
const REPORTS_FILE = path.join(DOCS_DIR, 'reports.md')

function analyzeTestResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.log('❌ 未找到测试结果文件，请先运行测试')
    process.exit(1)
  }

  try {
    const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
    
    // 分析测试数据
    const analysis = analyzeTestData(results)
    
    // 生成报告
    generateReport(analysis)
    
    console.log('✅ 测试报告已生成: docs/testing/reports.md')
    
  } catch (error) {
    console.error('❌ 分析测试结果时出错:', error.message)
    process.exit(1)
  }
}

function analyzeTestData(results) {
  const analysis = {
    summary: {
      totalSuites: results.numTotalTestSuites,
      passedSuites: results.numPassedTestSuites,
      failedSuites: results.numFailedTestSuites,
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      success: results.success,
      startTime: new Date(results.startTime).toLocaleString('zh-CN'),
      duration: results.testResults.reduce((total, file) => {
        return total + (file.endTime - file.startTime)
      }, 0)
    },
    modules: {},
    slowTests: [],
    testFiles: []
  }

  // 按模块分析
  results.testResults.forEach(file => {
    const filePath = file.name
    const moduleName = extractModuleName(filePath)
    const duration = file.endTime - file.startTime
    
    if (!analysis.modules[moduleName]) {
      analysis.modules[moduleName] = {
        name: moduleName,
        files: 0,
        tests: 0,
        passed: 0,
        failed: 0,
        duration: 0,
        testFiles: []
      }
    }
    
    const module = analysis.modules[moduleName]
    module.files++
    module.tests += file.assertionResults.length
    module.passed += file.assertionResults.filter(t => t.status === 'passed').length
    module.failed += file.assertionResults.filter(t => t.status === 'failed').length
    module.duration += duration
    module.testFiles.push({
      name: path.basename(filePath),
      path: filePath,
      tests: file.assertionResults.length,
      passed: file.assertionResults.filter(t => t.status === 'passed').length,
      failed: file.assertionResults.filter(t => t.status === 'failed').length,
      duration: duration
    })
    
    // 收集慢测试
    file.assertionResults.forEach(test => {
      if (test.duration > 50) { // 超过50ms的测试
        analysis.slowTests.push({
          title: test.title,
          duration: test.duration,
          file: path.basename(filePath),
          module: moduleName
        })
      }
    })
    
    analysis.testFiles.push({
      name: path.basename(filePath),
      path: filePath,
      module: moduleName,
      tests: file.assertionResults.length,
      passed: file.assertionResults.filter(t => t.status === 'passed').length,
      failed: file.assertionResults.filter(t => t.status === 'failed').length,
      duration: duration,
      status: file.assertionResults.filter(t => t.status === 'failed').length > 0 ? 'failed' : 'passed'
    })
  })

  // 排序慢测试
  analysis.slowTests.sort((a, b) => b.duration - a.duration)
  
  return analysis
}

function extractModuleName(filePath) {
  const parts = filePath.split('/')
  if (parts.includes('core')) {
    const coreIndex = parts.indexOf('core')
    return parts[coreIndex + 1] || 'unknown'
  }
  return 'other'
}

function generateReport(analysis) {
  const report = `# 测试报告

## 📊 测试概览

| 指标 | 数值 | 状态 |
|------|------|------|
| 测试套件总数 | ${analysis.summary.totalSuites} | ${analysis.summary.passedSuites === analysis.summary.totalSuites ? '✅' : '❌'} |
| 通过套件 | ${analysis.summary.passedSuites} | ${analysis.summary.passedSuites === analysis.summary.totalSuites ? '✅' : '❌'} |
| 失败套件 | ${analysis.summary.failedSuites} | ${analysis.summary.failedSuites === 0 ? '✅' : '❌'} |
| 测试用例总数 | ${analysis.summary.totalTests} | - |
| 通过用例 | ${analysis.summary.passedTests} | ${analysis.summary.passedTests === analysis.summary.totalTests ? '✅' : '❌'} |
| 失败用例 | ${analysis.summary.failedTests} | ${analysis.summary.failedTests === 0 ? '✅' : '❌'} |
| 成功率 | ${((analysis.summary.passedTests / analysis.summary.totalTests) * 100).toFixed(1)}% | ${analysis.summary.success ? '✅' : '❌'} |
| 执行时间 | ${(analysis.summary.duration / 1000).toFixed(2)}s | - |
| 开始时间 | ${analysis.summary.startTime} | - |

## 🏗️ 模块分析

${Object.values(analysis.modules).map(module => `
### ${module.name} 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | ${module.files} |
| 测试用例数 | ${module.tests} |
| 通过用例 | ${module.passed} |
| 失败用例 | ${module.failed} |
| 成功率 | ${((module.passed / module.tests) * 100).toFixed(1)}% |
| 执行时间 | ${(module.duration / 1000).toFixed(2)}s |

#### 测试文件详情

${module.testFiles.map(file => `
- **${file.name}**
  - 用例数: ${file.tests}
  - 通过: ${file.passed} ✅
  - 失败: ${file.failed} ${file.failed > 0 ? '❌' : '✅'}
  - 耗时: ${(file.duration / 1000).toFixed(2)}s
`).join('')}
`).join('')}

## ⏱️ 性能分析

### 最慢的测试用例 (前10个)

${analysis.slowTests.slice(0, 10).map((test, index) => `
${index + 1}. **${test.title}**
   - 耗时: ${test.duration.toFixed(2)}ms
   - 文件: ${test.file}
   - 模块: ${test.module}
`).join('')}

## 📁 测试文件详情

${analysis.testFiles.map(file => `
### ${file.name}

- **路径**: \`${file.path}\`
- **模块**: ${file.module}
- **状态**: ${file.status === 'passed' ? '✅ 通过' : '❌ 失败'}
- **测试用例**: ${file.tests} 个
- **通过**: ${file.passed} 个
- **失败**: ${file.failed} 个
- **耗时**: ${(file.duration / 1000).toFixed(2)}s
`).join('')}

## 📈 测试趋势

### 模块覆盖率

${Object.values(analysis.modules).map(module => `
- **${module.name}**: ${((module.passed / module.tests) * 100).toFixed(1)}% (${module.passed}/${module.tests})
`).join('')}

### 性能指标

- **平均测试时间**: ${(analysis.summary.duration / analysis.summary.totalTests).toFixed(2)}ms/测试
- **最慢模块**: ${Object.values(analysis.modules).sort((a, b) => b.duration - a.duration)[0]?.name || 'N/A'}
- **最快模块**: ${Object.values(analysis.modules).sort((a, b) => a.duration - b.duration)[0]?.name || 'N/A'}

## 🎯 建议

${generateRecommendations(analysis)}

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
*数据来源: test-results/results.json*
`

  // 确保目录存在
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true })
  }
  
  // 写入报告文件
  fs.writeFileSync(REPORTS_FILE, report, 'utf8')
}

function generateRecommendations(analysis) {
  const recommendations = []
  
  if (analysis.summary.failedTests > 0) {
    recommendations.push('- 🔧 修复失败的测试用例')
  }
  
  if (analysis.slowTests.length > 0) {
    recommendations.push('- ⚡ 优化慢速测试用例，特别是超过100ms的测试')
  }
  
  const moduleSuccessRates = Object.values(analysis.modules).map(m => (m.passed / m.tests) * 100)
  const minSuccessRate = Math.min(...moduleSuccessRates)
  if (minSuccessRate < 100) {
    recommendations.push('- 📊 提升测试覆盖率，确保所有模块都有足够的测试')
  }
  
  if (analysis.summary.duration > 10000) {
    recommendations.push('- 🚀 考虑并行运行测试以提升执行速度')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('- 🎉 测试质量良好，继续保持！')
  }
  
  return recommendations.join('\n')
}

// 运行分析
analyzeTestResults()
