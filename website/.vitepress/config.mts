import { defineConfig } from 'vitepress'

// 引用前先安装，windows代码：npm install -D markdown-it-container
import markdownItContainer from 'markdown-it-container'

import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

import { nav, sidebar, head, customIcon } from './configs'

// 导入自定义图标配置
// import { customIcon } from './configs/customIcons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "琴殿",
  description: "个人笔记网站",
  lang: "zh-CN",

  appearance: false,

  // 添加外部脚本，提前应用自定义样式配置，消除闪烁问题
  head,

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
      { icon: 'github', link: 'https://github.com/qindlute' },
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
    
    lastUpdated: {
      text: '最后更新于'
    },

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
    }
  },


  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon
      }) // 使用导入的图标配置
    ]
  },

  markdown: {
    math: true,
    lineNumbers: true,
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
            ? `<div class="custom-block note"><div class="custom-block-title">${info || 'Note'}</div>`
            : '</div>'
        }
      })

      md.use(markdownItContainer, 'important', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(10).trim()
          return token.nesting === 1
            ? `<div class="custom-block important"><div class="custom-block-title">${info || 'Important'}</div>`
            : '</div>'
        }
      })

      md.use(markdownItContainer, 'caution', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          const info = token.info.trim().slice(8).trim()
          return token.nesting === 1
            ? `<div class="custom-block caution"><div class="custom-block-title">${info || 'Caution'}</div>`
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

    }
  },
  
})
