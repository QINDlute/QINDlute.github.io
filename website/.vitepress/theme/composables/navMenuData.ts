import type { menuItem } from './types'

// 科学上网导航数据
const navMenus: menuItem[] = [
  {
    id: 1,
    name: 'VP yiov大佬',
    url: 'https://vitepress.yiov.top/',
    image: '/img/menu/vitepress-icon.png'
  },
  {
    id: 2,
    name: 'VP teek大佬',
    url: 'https://vp.teek.top/',
    image: '/img/menu/vitepress_teek.png'
  },
  {
    id: 3,
    name: 'VP 千浔物语',
    url: 'https://docs.fe-qianxun.com/',
    image: '/img/menu/qianxun-icon.png'
  },
  {
    id: 4,
    name: 'VP chodocs',
    url: 'https://chodocs.cn/',
    image: '/img/menu/chodocs-menu.png'
  },
  {
    id: 5,
    name: 'VP 官方文档',
    url: 'https://vitepress.dev/zh/',
    image: '/img/menu/vitepress-icon.png'
  }
]

// 编程导航数据
// const programmingMenu: menuItem[] = [
//   {
//     id: 1,
//     name: '前端开发',
//     url: '/frontend',
//     image: '/images/frontend.png'
//   },
//   {
//     id: 2,
//     name: '后端开发',
//     url: '/backend',
//     image: '/images/backend.png'
//   },
//   // ... 更多
// ]

// 统一导出
// export const navMenus = {
//   gfw: gfwMenu,
//   programming: programmingMenu,
//   // 可以添加更多分类
// }

export default navMenus