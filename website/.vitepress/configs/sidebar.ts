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
    ],
    '/study/': [
        { text: '学习',
            items: [
                { text: '英语', 
                    items: [
                        { text: '写作', link: '/study/english/writing/ChangeYourLife' },
                        { text: '词汇', 
                            items: [
                                { text: '基础词汇全贯通',
                                    collapsed: false,
                                    items: [
                                        { text: '前缀', link: '/study/english/vocabulary/basic_vocabulary/prefix' },
                                        { text: '词根 A', link: '/study/english/vocabulary/basic_vocabulary/A' },
                                        { text: '词根 B', link: '/study/english/vocabulary/basic_vocabulary/B' },
                                        { text: '词根 C', link: '/study/english/vocabulary/basic_vocabulary/C' },
                                        { text: '词根 D', link: '/study/english/vocabulary/basic_vocabulary/D' },
                                    ],
                                },
                                { text: 'Oxford 3000', link: '/study/english/vocabulary/oxford_3000' },
                            ]
                        },
                        { text: '长难句', 
                            collapsed: false,
                            items: [
                                { text: '2026.02.03', link: '/study/english/sentence/2-3' },
                                { text: '2026.02.04', link: '/study/english/sentence/2-4' },
                                { text: '2026.02.05', link: '/study/english/sentence/2-5' },
                                { text: '2026.02.06', link: '/study/english/sentence/2-6' },
                                { text: '2026.02.07', link: '/study/english/sentence/2-7' },
                                { text: '2026.02.08', link: '/study/english/sentence/2-8' },
                                { text: '2026.02.09', link: '/study/english/sentence/2-9' },
                            ]
                        },
                    ]
                },
            ]
        }
    ]
}