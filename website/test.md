# Tailwind CSS 特性实验

## 1. 响应式设计
响应式设计是 Tailwind CSS 的核心特性之一，您可以使用不同的断点前缀来适配不同屏幕尺寸：

<div class="bg-blue-500 text-white p-4 md:p-6 lg:p-8 rounded-lg">
  <p class="text-sm md:text-base lg:text-lg">
    我会根据屏幕尺寸自动调整大小和间距
  </p>
</div>

## 2. 颜色系统
Tailwind CSS 提供了丰富的颜色系统，包括背景色、文本色、边框色等：

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
  <div class="bg-red-500 text-white p-4 rounded">红色</div>
  <div class="bg-green-500 text-white p-4 rounded">绿色</div>
  <div class="bg-blue-500 text-white p-4 rounded">蓝色</div>
  <div class="bg-purple-500 text-white p-4 rounded">紫色</div>
</div>

## 3. Flexbox 布局
Tailwind CSS 提供了丰富的 Flexbox 工具类，方便您快速构建灵活的布局：

<div class="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg mt-4">
  <div class="font-bold mb-2 md:mb-0">左侧标题</div>
  <div class="flex gap-2">
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">按钮1</button>
    <button class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">按钮2</button>
  </div>
</div>

## 4. Grid 布局
Grid 布局是构建复杂页面结构的强大工具：

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  <div class="bg-white p-4 rounded-lg shadow-md">卡片1</div>
  <div class="bg-white p-4 rounded-lg shadow-md">卡片2</div>
  <div class="bg-white p-4 rounded-lg shadow-md">卡片3</div>
</div>

## 5. 交互效果
Tailwind CSS 提供了丰富的交互效果，如悬停、过渡动画等：

<div class="mt-4">
  <button class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 hover:shadow-lg transform hover:scale-105 transition duration-300">
    悬停我看看效果
  </button>
</div>

## 6. 文本样式
您可以使用 Tailwind CSS 快速调整文本样式：

<div class="mt-4 bg-gray-100 p-4 rounded-lg">
  <h2 class="text-2xl font-bold text-center mb-2">文本样式示例</h2>
  <p class="text-sm text-gray-600">小号灰色文本</p>
  <p class="text-lg font-semibold">大号粗体文本</p>
  <p class="text-right text-blue-500">右对齐蓝色文本</p>
</div>

## 7. 边框和阴影
您可以轻松添加边框和阴影效果：

<div class="mt-4 grid grid-cols-2 gap-4">
  <div class="bg-white p-4 border-2 border-blue-500 rounded-lg">带边框的卡片</div>
  <div class="bg-white p-4 shadow-lg rounded-lg">带阴影的卡片</div>
</div>

## 8. 渐变背景
Tailwind CSS 支持渐变背景：

<div class="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
  <h3 class="text-xl font-bold">渐变背景示例</h3>
  <p>从蓝色到紫色的线性渐变</p>
</div>

## 9. 圆角和变换
您可以调整元素的圆角和变换效果：

<div class="mt-4 grid grid-cols-2 gap-4">
  <div class="bg-blue-500 text-white p-4 rounded-full text-center">圆形按钮</div>
  <div class="bg-green-500 text-white p-4 rounded-lg transform rotate-45 text-center">旋转的卡片</div>
</div>

## 10. 间距工具
Tailwind CSS 提供了丰富的间距工具，方便您调整元素之间的距离：

<div class="mt-4 bg-gray-100 p-6 rounded-lg">
  <div class="bg-white p-2 mb-2">小内边距</div>
  <div class="bg-white p-4 mb-4">中等内边距</div>
  <div class="bg-white p-6">大内边距</div>
</div>


<CustomLink title='【编程】Prisma 教程 | 快速入门 | 下一代 Node.js 和 TypeScript ORM' href='https://www.bilibili.com/video/BV1yo4y1x7e7/'/>

<TypingText 
  text="你好呀，朋友" 
  fontSize="5.6rem" 
  textColor="#333"
  cursorColor="#666"
/>

```bash
git reset --soft HEAD~1  # 撤回最近一次提交
```