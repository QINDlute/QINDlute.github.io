# 轮播组件使用指南

本指南介绍如何在VitePress中使用轮播组件，并支持在Markdown文件中直接定义轮播数据。

## 组件说明

我们提供了两个轮播组件：

1. **CarouselComponent** - 基础轮播组件，支持通过props传入数据
2. **YAMLCarousel** - 高级轮播组件，支持从YAML frontmatter读取数据

## 安装

将组件文件复制到VitePress项目的`docs/.vitepress/theme/components`目录中：

- `CarouselComponent.vue`
- `YAMLCarousel.vue`

## 基本使用

### 1. 使用CarouselComponent（通过props传入数据）

在Markdown文件中，使用Vue代码块定义轮播数据，然后将数据传递给组件：

```vue
<script setup>
const carouselItems = [
  {
    subtitle: '唐诗',
    title: '静夜思',
    description: '李白 (唐代)',
    poem: '床前明月光\n疑是地上霜\n举头望明月\n低头思故乡'
  },
  {
    subtitle: '唐诗',
    title: '登鹳雀楼',
    description: '王之涣 (唐代)',
    poem: '白日依山尽\n黄河入海流\n欲穷千里目\n更上一层楼'
  }
];
</script>

<CarouselComponent :items="carouselItems" />
```

### 2. 使用YAMLCarousel（从YAML frontmatter读取数据）

在Markdown文件顶部使用YAML frontmatter定义轮播数据，然后直接使用组件：

```yaml
---
carouselItems:
  - subtitle: '宋词'
    title: '水调歌头·明月几时有'
    description: '苏轼 (宋代)'
    poem: '明月几时有\n把酒问青天\n不知天上宫阙\n今夕是何年'
  - subtitle: '宋词'
    title: '念奴娇·赤壁怀古'
    description: '苏轼 (宋代)'
    poem: "大江东去\n浪淘尽\n千古风流人物\n故垒西边"
    # 或 poem: |
    #   大江东去
    #   浪淘尽
    #   千古风流人物
    #   故垒西边
---
```

然后在页面中使用组件：

```vue
<YAMLCarousel />
```

## 数据格式

轮播数据需要是一个数组，每个数组项包含以下字段：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| subtitle | 字符串 | 诗词类型（如：唐诗、宋词） |
| title | 字符串 | 诗词标题 |
| description | 字符串 | 作者及朝代 |
| poem | 字符串 | 诗词内容，使用换行符 `\n` 分隔诗句 |

## 自定义样式

### 修改背景颜色

您可以通过修改组件的CSS样式来自定义轮播项的背景颜色：

1. **基础背景颜色**：修改 `.carousel-item_poem` 类的 `background-color` 属性
2. **轮播项特定背景颜色**：修改 `.carousel-item--n .carousel-item_poem` 类的 `background-color` 属性

### 修改诗词样式

您可以通过修改 `.poem-content` 和 `.poem-line` 类来调整诗词的字体、大小、行间距等样式。

## 高级功能

### 同一页面使用多个轮播

您可以在同一页面中使用多个轮播组件，每个组件使用不同的数据：

```vue
<script setup>
const carousel1 = [...]; // 第一个轮播的数据
const carousel2 = [...]; // 第二个轮播的数据
</script>

<CarouselComponent :items="carousel1" />
<CarouselComponent :items="carousel2" />
```

### 使用默认数据

如果您不传入数据，轮播组件将使用默认的唐诗数据：

```vue
<CarouselComponent />
```

## 效果演示

### 示例1：使用Vue代码块

查看 `carousel-example.md` 文件，了解如何使用Vue代码块定义轮播数据。

### 示例2：使用YAML frontmatter

查看 `carousel-yaml-example.md` 文件，了解如何使用YAML frontmatter定义轮播数据。

## 注意事项

1. 确保Vue代码块中的JavaScript语法正确
2. 使用YAML frontmatter时，注意缩进和格式
3. 诗句中的换行符需要使用 `\n`
4. 组件仅在VitePress环境中工作，不支持在普通Markdown文件中使用

## 浏览器支持

组件支持所有现代浏览器，包括：
- Chrome (推荐)
- Firefox
- Safari
- Edge

## 故障排除

### 组件不显示

- 检查组件文件路径是否正确
- 确保VitePress版本支持Vue 3
- 检查浏览器控制台是否有错误信息

### 数据不显示

- 检查数据格式是否正确
- 确保数据字段名称与组件预期一致
- 检查控制台是否有数据相关的错误

### 样式问题

- 检查是否有其他CSS样式影响了轮播组件
- 尝试使用 `!important` 修饰符来覆盖冲突的样式

## 版本历史

- v1.0.0 - 初始版本，支持基础轮播功能
- v1.1.0 - 新增支持从YAML frontmatter读取数据
- v1.2.0 - 优化诗词展示效果，添加逐行动画

## 许可证

MIT License