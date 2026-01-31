import type { menuItem } from './types'

// 科学上网导航数据
const navMenus: menuItem[] = [
  {
    id: 1,
    name: '简介',
    url: '/test',
    image: '/test/image.png'
  },
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