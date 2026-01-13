import type { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Config["sidebar"] = {
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
                { text: '诗',
                    items: [
                        { text: '无花', link: '/essays/poetry/无花' },
                        { text: '空响', link: '/essays/poetry/空响' },
                    ]
                },
                { text: '词',
                    items: [
                        { text: '诉衷情·眼欲穿', link: '/essays/ci/诉衷情·眼欲穿' },
                    ]
                }
            ]
        },
    ]
}