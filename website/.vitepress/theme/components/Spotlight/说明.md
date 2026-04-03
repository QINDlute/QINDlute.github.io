# Spotlight 聚光灯组件

## 简介

Spotlight 是一个用于 VitePress 网站的鼠标悬停聚光灯效果组件，当用户鼠标悬停在文章内容上时，会显示一个高亮效果，提升用户阅读体验。

## 功能特性

- 支持两种显示模式：侧边指示器模式和底部高亮模式
- 响应式设计，适配不同屏幕尺寸
- 支持通过 frontmatter 单独配置每篇文章的聚光灯设置
- 自动检测触摸设备，在触摸设备上禁用聚光灯效果
- 平滑的动画过渡效果

## 安装与集成

该组件已集成到本项目中，无需额外安装。组件文件结构如下：

```
Spotlight/
├── index.vue          # 主组件，负责状态管理和配置
├── components/
│   └── SpotlightHover.vue  # 核心聚光灯效果组件
└── README.md          # 本文档
```

## 使用方法

### 全局配置

在 VitePress 主题的 `Layout.vue` 文件中引入并使用 Spotlight 组件：

```vue
<template>
  <Layout>
    <template #default>
      <slot />
      <Spotlight />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Spotlight from './components/Spotlight/index.vue';
</script>
```

### 文章级配置

在 Markdown 文件的 frontmatter 中，您可以单独配置每篇文章的聚光灯设置：

```yaml
---
title: 文章标题
spotlight: true  # 启用或禁用聚光灯
spotlightMode: aside  # 聚光灯模式：aside（侧边指示器）或 under（底部高亮）
---
```

## 配置选项

### `spotlight`

- 类型：`boolean`
- 默认值：`true`
- 描述：控制是否在当前文章中启用聚光灯效果

### `spotlightMode`

- 类型：`'aside' | 'under'`
- 默认值：`'aside'`
- 描述：设置聚光灯的显示模式
  - `'aside'`：侧边指示器模式，在文本左侧显示一个品牌色指示条
  - `'under'`：底部高亮模式，在文本下方显示一个品牌色背景

## 实现原理

1. **鼠标跟踪**：通过监听鼠标移动事件，获取当前鼠标位置
2. **元素检测**：根据鼠标位置检测当前悬停的元素
3. **样式计算**：根据元素位置和大小计算聚光灯的位置和尺寸
4. **模式切换**：根据配置的模式应用不同的样式效果
5. **性能优化**：使用 Vue 的响应式系统和 Teleport 组件，确保性能流畅

## 样式说明

- 侧边指示器模式：在文本左侧显示一个 4px 宽的品牌色指示条
- 底部高亮模式：在文本下方显示一个品牌柔和色的背景
- 两种模式都有平滑的过渡动画效果

## 兼容性

- 支持所有现代浏览器
- 在触摸设备上自动禁用，以避免触摸交互冲突
- 与 VitePress 的默认主题完全兼容

## 示例

### 侧边指示器模式（默认）

```yaml
---
spotlightMode: aside
---
```

### 底部高亮模式

```yaml
---
spotlightMode: under
---
```

## 注意事项

- 聚光灯效果仅适用于文章内容区域（.vp-doc 内的元素）
- 对于段落文本，聚光灯会根据鼠标位置高亮当前行
- 对于其他元素（如标题、列表等），聚光灯会高亮整个元素
