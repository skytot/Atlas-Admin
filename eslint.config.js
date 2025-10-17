// eslint.config.js
/**
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 * @typedef {{ default?: { globals?: Record<string, boolean> } }} AutoImportConfig
 */

import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {Record<string, boolean>} */
let autoImportGlobals = {}
try {
  const autoImportPath = resolve(__dirname, './.eslintrc-auto-import.json')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cfg = /** @type {AutoImportConfig} */ (
    await import(`file://${autoImportPath}`, { with: { type: 'json' } })
  )
  const globalsCandidate = cfg?.default?.globals
  if (globalsCandidate && typeof globalsCandidate === 'object') {
    autoImportGlobals = /** @type {Record<string, boolean>} */ (globalsCandidate)
  }
} catch (error) {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? /** @type {string | undefined} */ (/** @type {{ code?: unknown }} */ (error).code)
      : undefined

  if (code !== 'ERR_MODULE_NOT_FOUND') {
    throw error
  }
}

/** @type {FlatConfig[]} */
const config = [
  // 1. 忽略文件
  {
    ignores: ['dist', 'node_modules', 'auto-imports.d.ts', 'components.d.ts', 'coverage']
  },

  // 2. 基础 JavaScript 推荐规则
  eslint.configs.recommended,

  // 3. Vue 3 推荐规则（essential 级别）
  ...vue.configs['flat/essential'],

  // 4. TypeScript 类型感知规则（启用 projectService）
  ...tseslint.configs.recommendedTypeChecked,

  // 5. 主应用配置：Vue + TS 文件
  {
    files: ['**/*.{vue,ts,tsx}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportGlobals
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      // --- Vue ---
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/max-attributes-per-line': ['error', { singleline: { max: 3 }, multiline: { max: 1 } }],
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, { baseIndent: 0 }],

      // --- TypeScript / JavaScript ---
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',

      // --- Prettier 兼容（关闭格式相关规则，交给 Prettier）---
      curly: 'off',
      quotes: 'off',
      semi: 'off',
      indent: 'off',
      'space-before-function-paren': 'off',
      'comma-dangle': 'off',
      'arrow-parens': 'off',
      'no-mixed-spaces-and-tabs': 'off'
    }
  },

  // 6. Node.js 脚本和配置文件（.js, .cjs, .mjs）
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off' // 允许 require() in .js
    }
  }
]

export default config
