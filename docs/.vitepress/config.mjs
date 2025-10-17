import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Atlas Admin Docs',
  description: 'Atlas Admin - 大型管理平台脚手架文档',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/Atlas-Admin/',
  srcDir: '.',
  vite: {
    resolve: {
      alias: {
        '@': '/docs'
      }
    },
    build: {
      rollupOptions: {
        external: ['vue/server-renderer']
      }
    }
  },
  ignoreDeadLinks: [
    // 忽略开发环境的 localhost 链接
    /^http:\/\/localhost/,
    // 忽略其他预期的死链接
    /^\.\/LICENSE$/,
    // 忽略 tests 目录的链接
    /.*tests\/README.*/
  ],
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }]
  ],
  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
      alt: 'Atlas Admin'
    },
    siteTitle: 'Atlas Admin Docs',
    nav: [
      {
        text: '📚 指南',
        activeMatch: '^/guide/',
        items: [
          { text: '📖 项目综述', link: '/guide/overview' },
          { text: '🚀 快速开始', link: '/guide/getting-started' },  
          { text: '🛠️ 开发环境', link: '/guide/environment' },
          { text: '💻 命令说明', link: '/guide/commands' },
        ]
      },
      {
        text: '⚙️ 核心模块',
        activeMatch: '^/core/',
        items: [
          { text: '📚 模块导读', link: '/core/intro' },
          { text: '🔐 认证模块', link: '/core/auth' },
          { text: '⚙️ 配置管理', link: '/core/config' },
          { text: '⚠️ 错误处理', link: '/core/error' },
          { text: '🌐 HTTP 客户端', link: '/core/http' },
          { text: '📝 日志系统', link: '/core/logger' },
          { text: '🔌 插件体系', link: '/core/plugins' },
          { text: '📦 存储管理', link: '/core/storage' },
          { text: '🛣️ 路由管理', link: '/core/router' },
          { text: '🗃️ 状态管理', link: '/core/store' }
        ]
      },
      {
        text: '🧪 测试指南',
        activeMatch: '^/core/testing',
        items: [
          { text: '📚 测试索引', link: '/core/testing-index' },
          { text: '📋 测试计划', link: '/core/testing-plan' },
          { text: '📖 测试指南', link: '/core/testing-guide' },
          { text: '📊 测试报告', link: '/core/testing-reports' },
          { text: '🔧 问题排查', link: '/core/testing-troubleshooting' },
          { text: '📈 测试总结', link: '/core/testing-summary' }
        ]
      },
      {
        text: '✨ 特性扩展',
        activeMatch: '^/features/',
        items: [
          { text: '🗺️ 优化路线图', link: '/features/roadmap' },
          { text: '🎨 主题与 UI', link: '/features/theme-ui' },
          { text: '📊 报表与表格', link: '/features/reporting' },
          { text: '📝 表单引擎', link: '/features/forms' }
        ]
      },
      {
        text: '🔗 更多',
        items: [
          { text: '🧪 测试文档', link: '/testing' },
          { text: '📋 优化计划', link: '/features/roadmap' },
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '项目综述', link: '/guide/overview' },   
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '开发环境', link: '/guide/environment' },
            { text: '命令说明', link: '/guide/commands' },
          ]
        },
        {
          text: '🧪 测试',
          items: [
            { text: '测试快速参考', link: '/guide/testing-quick-reference' },
          ]
        }
      ],
      '/core/': [
        {
          text: 'Core 模块',
          items: [
            { text: '简介', link: '/core/intro' },
            { text: '认证模块', link: '/core/auth' },
            { text: '配置管理', link: '/core/config' },
            { text: '错误处理', link: '/core/error' },
            { text: 'HTTP 客户端', link: '/core/http' },
            { text: '日志系统', link: '/core/logger' },
            { text: '插件体系', link: '/core/plugins' },
            { text: '存储管理', link: '/core/storage' },
            { text: '路由管理', link: '/core/router' },
            { text: '状态管理', link: '/core/store' }
          ]
        },
        {
          text: '🧪 测试指南',
          items: [
            { text: '📚 测试索引', link: '/core/testing-index' },
            { text: '📋 测试计划', link: '/core/testing-plan' },
            { text: '📖 测试指南', link: '/core/testing-guide' },
            { text: '📊 测试报告', link: '/core/testing-reports' },
            { text: '🔧 问题排查', link: '/core/testing-troubleshooting' },
            { text: '📈 测试总结', link: '/core/testing-summary' }
          ]
        }
      ],
      '/features/': [
        {
          text: '业务特性',
          items: [
            { text: '🗺️ 优化路线图', link: '/features/roadmap' },
            { text: '🎨 主题与 UI', link: '/features/theme-ui' },
            { text: '📊 报表与表格', link: '/features/reporting' },
            { text: '📝 表单引擎', link: '/features/forms' },
            { text: '🔒 安全与运维', link: '/features/security-ops' },
            { text: '⚡ 性能优化', link: '/features/performance' }
          ]
        }
      ],
      '/testing': [
        {
          text: '测试文档',
          items: [
            { text: '📚 测试索引', link: '/core/testing-index' },
            { text: '📋 测试计划', link: '/core/testing-plan' },
            { text: '📖 测试指南', link: '/core/testing-guide' },
            { text: '📊 测试报告', link: '/core/testing-reports' },
            { text: '🔧 问题排查', link: '/core/testing-troubleshooting' },
            { text: '📈 测试总结', link: '/core/testing-summary' }
          ]
        }
      ]
    },
    footer: {
      message: 'Atlas Admin · 基于 Vue 3 + Vite 的大型管理平台脚手架',
      copyright: `Copyright © ${new Date().getFullYear()} Atlas Admin Team`
    },
    lastUpdatedText: '最近更新',
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/atlas-admin-starter' }
    ],
    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    // 编辑链接
    editLink: {
      pattern: '',
      text: ''
    },
    // 返回顶部
    returnToTopLabel: '返回顶部',
    // 侧边栏菜单图标
    outline: {
      level: [2, 3],
      label: '页面导航'
    }
  }
})


