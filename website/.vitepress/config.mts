// .vitepress/config.mts
import { defineConfig } from 'vitepress'
import { resolve } from 'path'

// 引用前先安装，windows代码：npm install -D markdown-it-container
import markdownItContainer from 'markdown-it-container'

import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
// import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { presetUno, presetIcons, presetAttributify } from 'unocss'

import { nav, sidebar, head, customIcon } from './configs'
import { MarkdownTransform } from './plugin/markdownTransform'



// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "琴殿",
  description: "个人笔记网站",
  lang: "zh-CN",

  appearance: false,

  // 添加外部脚本，提前应用自定义样式配置
  head,

  sitemap: {
    hostname: 'https://docs.qindlute.cloud',
  },

  // 使用VitePress内置的主题配置
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/qind_ico.svg',

    // 覆盖页面标题
    siteTitle: '琴殿',

    nav,

    sidebar,

    // 大纲配置
    outline: {
      level: 'deep',
      label: '目录'
    },
    returnToTopLabel: '回到顶部',
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/QINDlute/QINDlute.github.io/tree/master' },
      { icon: 'gmail', link: 'mailto:qindlute@gmail.com' }
    ],

    // 页脚配置
    footer: {
      message: 'qindlute\'s notes',
      copyright: 'Copyright © 2025-2026 qindlute'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    // lastUpdated: {
    //   text: '最后更新于'
    // },

    // 启用本地搜索功能
    search: {
      provider: 'local',
      // 搜索选项配置
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '未找到匹配结果',
            resetButtonTitle: '清空搜索',
            displayDetails: '显示详细信息',
            footer: {
              navigateText: '导航',
              selectText: '选择',
              closeText: '退出'
            }
          }
        },
        miniSearch: {
          searchOptions: {
            boost: { // 标题权重为8，文本权重为4（优先匹配标题）
              title: 8,
              text: 4
            }
          }
        }
        
      }
    },
  },

  vite: {
    plugins: [
      // tailwindcss(), // 添加 Tailwind CSS 插件
      UnoCSS({
        presets: [
          presetUno(),
          presetIcons({
            scale: 1.2,
            warn: true,
          }),
          presetAttributify(),
        ],
      }), // 添加 UnoCSS 插件
      Components({
        dirs: resolve(__dirname, './theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: '',
          }),
        ],
        dts: './.vitepress/components.d.ts',
        transformer: 'vue3',
      }), // 添加 Components 插件，用于自动注册图标组件
      groupIconVitePlugin({
        customIcon
      }), // 使用导入的图标配置
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        defaultStyle: 'display: inline-block',
      }),
      MarkdownTransform(),

    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '..'), // 项目根目录
        '@components': resolve(__dirname, 'components'), // 组件目录
        '@composables': resolve(__dirname, 'composables') // 可组合函数目录
      }
    },
    ssr: {
      noExternal: ['pdfjs-dist', '@vue-pdf-viewer/viewer']
    }
  },

  markdown: {
    math: true,
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    config: (md) => {
      md.use(groupIconMdPlugin) // 代码组图标

      // h1 标题自动添加 ArticleMetadata 组件
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`; 
          return htmlResult;
      }

      // 注册自定义容器
      md.use(markdownItContainer, 'note', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(5).trim()
          return token.nesting === 1
            ? `<div class="custom-block note"><div class="custom-block-title">${info || 'NOTE'}</div>`
            : '</div>'
        }
      })

      md.use(markdownItContainer, 'important', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(10).trim()
          return token.nesting === 1
            ? `<div class="custom-block important"><div class="custom-block-title">${info || 'IMPORTANT'}</div>`
            : '</div>'
        }
      })

      md.use(markdownItContainer, 'caution', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(8).trim()
          return token.nesting === 1
            ? `<div class="custom-block caution"><div class="custom-block-title">${info || 'CAUTION'}</div>`
            : '</div>'
        }
      })
      // ::: whiteboard 自定义容器
      md.use(markdownItContainer, 'whiteboard', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          if (token.nesting === 1) {
            // 支持自定义标题（无标题则不显示）
            const title = token.info.trim().replace(/^whiteboard\s*/, '') // 匹配正则表达式，将"::: whiteboard [标题]" 替换为[标题]
            const titleHtml = title ? `<h3 class="whiteboard-title">${title}</h3>` : ''
            // 渲染 CSS 对应的 HTML 结构：whiteboard 容器 + whiteboard-content 内容容器
            return `<div class="whiteboard"><div class="whiteboard-content">${titleHtml}`
          }
          // 闭合容器
          return '</div></div>'
        }
      })

      // 注册 FAQ 自定义容器
      md.use(markdownItContainer, 'faq', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          // 匹配容器开始标记（::: faq 标题）
          if (token.nesting === 1) {
            // 1. 提取自定义标题（支持 "::: faq 标题" 或 "::: faq active 标题" 语法，active表示初始展开）
            const info = token.info.trim()
            // 分离 "active" 标记和标题（可选：支持初始展开）
            const isActive = info.includes('active')
            const title = info.replace(/^faq\s*(active)?\s*/, '').trim() || '常见问题' // 无标题时默认显示"常见问题" 
            // 2. 拼接 FAQ 面板的开始 HTML（和原有结构完全一致）
            // 初始展开则添加 active 类，否则不添加
            const activeClass = isActive ? 'active' : ''
            return `
              <div class="faq ${activeClass}">
                <h3 class="faq-title">${title}</h3>
                <div class="faq-text">` // 注意：faq-text 包裹容器内的内容
          }
          // 3. 匹配容器结束标记（:::），闭合 HTML 结构
          return `
              </div>
              <button class="faq-toggle">
                <i class="fas fa-chevron-down"></i>
                <i class="fas fa-times"></i>
              </button>
            </div>`
        }
      })

      // 注册 details: 自定义容器，渲染为 SmoothDetails 组件
      md.use(markdownItContainer, 'details:', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          if (token.nesting === 1) {
            // 提取标题
            const title = token.info.trim().replace(/^details:\s*/, '').trim() || '点击展开'
            return `<SmoothDetails><template #title>${title}</template>`
          }
          return `</SmoothDetails>`
        }
      })

    }
  },
  
})
