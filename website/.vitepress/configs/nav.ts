import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.Config["nav"] = [
      { text: '首页', link: '/' },
      { text: '学习', link: '#' },
      { text: '随笔',
            items: [
                  { text: '诗词',
                        items: [
                              { text: '无花', link: '/essays/poetry/无花' },
                              { text: '空响', link: '/essays/poetry/空响' },
                              { text: '诉衷情', link: '/essays/ci/诉衷情·眼欲穿' },
                        ]
                   },
            ]
       },
      { text: '关于',
            items: [
                  { text: '网站设计', link: '/others/about/aboutstyle/' },
                  { text: '网站建设', link: '/others/about/aboutvitepress/' },
                  { text: '其他', 
                        items: [
                              { text: '归档', link: '/others/archive/' },
                              { text: '标签', link: '/others/tags/' },
                        ]
                  }
            ],
            activeMatch: '/others/about/'
      },
];