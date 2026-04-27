import type { DefaultTheme } from "vitepress";
import { getLiCountForVocabulary } from "../scripts/calculateLiCount";
import { text } from "stream/consumers";

const vocabLiCount = getLiCountForVocabulary();

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
    '/study/math/': [
        { text: '数学', 
            items: [
                { text: '一元函数微分学', 
                    items: [
                        { text: '中值定理', link: '/study/math/3_一元函数微分学/1-中值定理' },
                        { text: '极值', link: '/study/math/3_一元函数微分学/2-极值' },
                        { text: '几个小问题', link: '/study/math/3_一元函数微分学/3-几个小问题' },
                        { text: '错题集', 
                            items: [
                                { text: 'L', link: '/study/math/3_一元函数微分学/错题集/L' },
                                { text: '极值', link: '/study/math/3_一元函数微分学/错题集/极值' },
                            ]
                        },
                    ]
                },
            ]
        },
    ],
    '/study/english/': [
        { text: '英语', 
            items: [
                { text: '写作', link: '/study/english/writing/ChangeYourLife' },
                { text: '词汇', 
                    items: [
                        { text: `基础词汇（${vocabLiCount}）`,
                            link: '/study/english/vocabulary/basic_vocabulary/',
                            collapsed: false,
                            items: [
                                { text: '前缀', link: '/study/english/vocabulary/basic_vocabulary/prefix' },
                                { text: '词根 A', link: '/study/english/vocabulary/basic_vocabulary/A' },
                                { text: '词根 B', link: '/study/english/vocabulary/basic_vocabulary/B' },
                                { text: '词根 C', link: '/study/english/vocabulary/basic_vocabulary/C' },
                                { text: '词根 D', link: '/study/english/vocabulary/basic_vocabulary/D' },
                                { text: '词根 E', link: '/study/english/vocabulary/basic_vocabulary/E' },
                                { text: '词根 F', link: '/study/english/vocabulary/basic_vocabulary/F' },
                                { text: '词根 G', link: '/study/english/vocabulary/basic_vocabulary/G' },
                                { text: '词根 H', link: '/study/english/vocabulary/basic_vocabulary/H' },
                                { text: '词根 I', link: '/study/english/vocabulary/basic_vocabulary/I' },
                                { text: '词根 J', link: '/study/english/vocabulary/basic_vocabulary/J' },
                                { text: '词根 L', link: '/study/english/vocabulary/basic_vocabulary/L' },
                                { text: '词根 M', link: '/study/english/vocabulary/basic_vocabulary/M' },
                                { text: '词根 N', link: '/study/english/vocabulary/basic_vocabulary/N' },
                                { text: '词根 O', link: '/study/english/vocabulary/basic_vocabulary/O' },
                                { text: '词根 P', link: '/study/english/vocabulary/basic_vocabulary/P' },
                                { text: '词根 Q', link: '/study/english/vocabulary/basic_vocabulary/Q' },
                                { text: '词根 R', link: '/study/english/vocabulary/basic_vocabulary/R' },
                                { text: '词根 S', link: '/study/english/vocabulary/basic_vocabulary/S' },
                                { text: '词根 T', link: '/study/english/vocabulary/basic_vocabulary/T' },
                                { text: '词根 U', link: '/study/english/vocabulary/basic_vocabulary/U' },
                                { text: '词根 V', link: '/study/english/vocabulary/basic_vocabulary/V' },
                                { text: '词根 W', link: '/study/english/vocabulary/basic_vocabulary/W' },
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
                        { text: '2026.02.10', link: '/study/english/sentence/2-10' },
                        { text: '2026.02.11', link: '/study/english/sentence/2-11' },
                        { text: '2026.02.12', link: '/study/english/sentence/2-12' },
                    ]
                },
            ]
        },
    ],
}