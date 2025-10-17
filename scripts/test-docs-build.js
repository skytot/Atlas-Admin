#!/usr/bin/env node

/**
 * 测试文档构建脚本
 * 用于验证文档构建配置是否正确
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 开始测试文档构建...\n')

// 检查必要文件
const requiredFiles = [
  'docs/.vitepress/config.mjs',
  'docs/index.md',
  'package.json'
]

console.log('📋 检查必要文件...')
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 文件不存在`)
    process.exit(1)
  }
}

// 检查 docs 目录
if (!fs.existsSync('docs')) {
  console.log('❌ docs 目录不存在')
  process.exit(1)
}

console.log('\n📦 安装依赖...')
try {
  execSync('npm ci', { stdio: 'inherit' })
  console.log('✅ 依赖安装成功')
} catch (error) {
  console.log('❌ 依赖安装失败:', error.message)
  process.exit(1)
}

console.log('\n📦 安装文档依赖...')
try {
  execSync('cd docs && npm ci', { stdio: 'inherit' })
  console.log('✅ 文档依赖安装成功')
} catch (error) {
  console.log('❌ 文档依赖安装失败:', error.message)
  process.exit(1)
}

console.log('\n🏗️ 构建文档...')
try {
  execSync('cd docs && npm run build', { stdio: 'inherit' })
  console.log('✅ 文档构建成功')
} catch (error) {
  console.log('❌ 文档构建失败:', error.message)
  process.exit(1)
}

// 检查构建输出
const distPath = 'docs/.vitepress/dist'
if (fs.existsSync(distPath)) {
  console.log('✅ 构建输出目录存在')
  
  // 检查关键文件
  const keyFiles = ['index.html', 'assets']
  for (const file of keyFiles) {
    if (fs.existsSync(path.join(distPath, file))) {
      console.log(`✅ ${file} 存在`)
    } else {
      console.log(`⚠️ ${file} 不存在`)
    }
  }
} else {
  console.log('❌ 构建输出目录不存在')
  process.exit(1)
}

console.log('\n🎉 文档构建测试完成！')
console.log('📁 构建输出:', distPath)
console.log('🌐 可以在本地预览构建结果')
