#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function colorLog(color, prefix, message) {
  console.log(`${colors[color]}[${prefix}]${colors.reset} ${message}`)
}

// 启动应用开发服务器
function startApp() {
  return new Promise((resolve, reject) => {
    colorLog('green', 'APP', '启动应用开发服务器...')
    
    const appProcess = spawn('pnpm', ['dev'], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true
    })
    
    appProcess.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Local:')) {
        colorLog('green', 'APP', '应用服务器已启动')
        resolve(appProcess)
      }
    })
    
    appProcess.stderr.on('data', (data) => {
      colorLog('red', 'APP', data.toString())
    })
    
    appProcess.on('error', (error) => {
      colorLog('red', 'APP', `启动失败: ${error.message}`)
      reject(error)
    })
  })
}

// 启动文档开发服务器
function startDocs() {
  return new Promise((resolve, reject) => {
    colorLog('blue', 'DOCS', '启动文档开发服务器...')
    
    const docsProcess = spawn('pnpm', ['docs:dev'], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true
    })
    
    docsProcess.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Local:')) {
        colorLog('blue', 'DOCS', '文档服务器已启动')
        resolve(docsProcess)
      }
    })
    
    docsProcess.stderr.on('data', (data) => {
      colorLog('red', 'DOCS', data.toString())
    })
    
    docsProcess.on('error', (error) => {
      colorLog('red', 'DOCS', `启动失败: ${error.message}`)
      reject(error)
    })
  })
}

// 主函数
async function main() {
  console.log(`${colors.bright}${colors.cyan}🚀 Atlas Admin 开发环境启动器${colors.reset}`)
  console.log(`${colors.yellow}正在同时启动应用和文档服务器...${colors.reset}\n`)
  
  try {
    const [appProcess, docsProcess] = await Promise.all([
      startApp(),
      startDocs()
    ])
    
    console.log(`\n${colors.bright}${colors.green}✅ 开发环境启动成功！${colors.reset}`)
    console.log(`${colors.cyan}📱 应用地址: http://localhost:5173${colors.reset}`)
    console.log(`${colors.cyan}📚 文档地址: http://localhost:5173/docs${colors.reset}`)
    console.log(`\n${colors.yellow}按 Ctrl+C 停止所有服务${colors.reset}`)
    
    // 优雅关闭
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}正在关闭服务...${colors.reset}`)
      appProcess.kill('SIGTERM')
      docsProcess.kill('SIGTERM')
      process.exit(0)
    })
    
    // 保持进程运行
    process.on('exit', () => {
      appProcess.kill('SIGTERM')
      docsProcess.kill('SIGTERM')
    })
    
  } catch (error) {
    colorLog('red', 'ERROR', `启动失败: ${error.message}`)
    process.exit(1)
  }
}

main()
