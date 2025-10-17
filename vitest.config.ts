import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['tests/**/*.spec.ts'],
    // 报告器配置
    reporters: ['verbose', 'json'],
    // 输出目录
    outputFile: {
      json: './test-results/results.json'
    },
    // 测试超时配置
    testTimeout: 10000,
    hookTimeout: 10000,
    // 重试配置
    retry: 2,
    // 并发配置
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    },
    // 性能统计
    benchmark: {
      outputFile: './test-results/benchmark.json'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@features': resolve(__dirname, 'src/features'),
      '@locales': resolve(__dirname, 'src/locales'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  }
})
