import type { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Config["sidebar"] = {
    // 为 /notes/ 路径配置侧边栏
    '/notes/': [
    {
        text: '学习笔记',
        collapsed: false, // 初始状态展开
        items: [
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
    '/others/': [
        { text: '关于', 
            // collapsed: false,
            items:[
                { text: '网站设计', link: '/others/about/aboutstyle' },
                { text: '网站建设',
                    collapsed: false,
                    items: [
                        { text: 'VitePress 介绍', link: '/others/about/aboutvitepress' },
                        { text: 'Git 托管', link: '/others/about/Git' },
                        { text: 'SSH 传输', link: '/others/about/SSH' },
                    ]
                }
            ]
        },
        { text: '其他',
            items: [
                { text: '归档', link: '/others/archive' },
                { text: '标签', link: '/others/tags' },
            ]
        }
    ],
    '/essays/': [
        { text: '随笔',
            items: [
                { text: '诗词',
                    items: [
                        { text: '无花', link: '/essays/poetry/无花' },
                        { text: '空响', link: '/essays/poetry/空响' },
                    ]
                },
            ]
        },
    ]
}