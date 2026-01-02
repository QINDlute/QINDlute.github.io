import { defineConfig } from 'vitepress'

// 引用前先安装，windows代码：npm install -D markdown-it-container
import markdownItContainer from 'markdown-it-container'

import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

// 导入自定义图标配置
import { customIcon } from './config/customIcons'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "qindlute",
  description: "个人笔记网站",
  lang: "zh-CN",

  appearance: false,

  // 启用更新时间功能
  lastUpdated: true,

  // 添加外部脚本，提前应用自定义样式配置，消除闪烁问题
  head: [
    // 配置网页图标
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/img/qind_ico.svg' }],
    // 引入外部脚本文件
    ['script', { src: '/js/early-init.js' }],
    ['script', { src: '/js/image-protection.js' }]
  ],

  // 使用VitePress内置的主题配置 使用VitePress内置的主题配置
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/qind_ico.svg',
    // 自定义最后更新时间文本
    lastUpdatedText: '最后更新于',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/qindlute' },
      { icon: 'gmail', link: 'mailto:qindlute@gmail.com' }
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/notes/' },
      { text: '标签', link: '/others/tags/' },
      { text: '归档', link: '/others/archive/' },
      { text: '关于', link: '/others/about/aboutme/' },
    ],

    sidebar: {
      // 为 /notes/ 路径配置侧边栏
      '/notes/': [
        {
          text: '学习笔记',
          collapsed: false, // 初始状态展开
          items: [
            { text: '版本控制', 
              collapsed: false,
              items: [
                { text: 'Git 托管', link: '/notes/ver_ctrl/git/' },
                { text: 'SSH 传输', link: '/notes/ver_ctrl/SSH/' },
              ]
            },
            {
              text: '前端开发',
              collapsed: false,
              items: [
                { text: 'HTML基础', link: '/notes/frontend/html-basics/' },
                { text: 'CSS布局', link: '/notes/frontend/css-layout/' },
                { text: 'JavaScript核心', link: '/notes/frontend/javascript-core/' },
                { text: 'Vue.js框架', link: '/notes/frontend/vuejs/' },
                { text: 'React框架', link: '/notes/frontend/react/' }
              ]
            },
            {
              text: '后端开发',
              collapsed: false,
              items: [
                { text: 'Node.js基础', link: '/notes/backend/nodejs-basics/' }
              ]
            }
          ]
        },
        {
          text: '生活记录',
          collapsed: false, // 初始状态展开
          items: [
            {
              text: '日常感悟',
              collapsed: false,
              items: [
                { text: '生活感悟', link: '/notes/life/reflection/' }
              ]
            },
            { text: '旅行日记', link: '/notes/travel/' }
          ]
        }
      ],
      // 为其他路径配置默认侧边栏（可选）
      '/others/': [
        {
          text: '快速导航',
          items: [
            { text: '首页', link: '/' },
            { text: '笔记分类', link: '/notes/' },
            { text: '标签', link: '/others/tags/' },
            { text: '归档', link: '/others/archive/' },
            { text: '关于', 
              collapsed: false,
              items:[
                { text: '关于我', link: '/others/about/aboutme/' },
                { text: '关于网站', link: '/others/about/aboutvitepress/' },
                { text: '关于样式', link: '/others/about/aboutstyle/' }
              ]
            }
          ]
        }
      ]
    },

    // 内置的大纲配置
    outline: {
      level: 'deep',
      label: '目录'
    },
    returnToTopLabel: '回到顶部',

    // 内置的页脚配置
    footer: {
      message: 'qindlute 制作',
      copyright: 'Copyright © 2025 qindlute'
    },

    // 启用本地搜索功能
    search: {
      provider: 'local',
      // 搜索选项配置
      options: {
        // 搜索结果数量限制
        limit: 10,
        // 是否启用全文搜索
        fullText: true,
        // 是否忽略大小写
        ignoreCase: true,
        // 是否使用引号进行精确匹配
        queryStrategy: 'prefix',
        // 搜索延迟，避免频繁触发
        debounceTime: 300
      }
    }
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon,
      }) // 代码组图标
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
