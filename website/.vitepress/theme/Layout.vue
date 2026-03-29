<script setup lang="ts">
// 导入 VitePress 默认主题
import DefaultTheme from 'vitepress/theme'

// 导入你的所有插件
import FontSettingsPlugin from './components/FontSettingsPlugin.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import TextSelectionMenu from './components/TextSelectionMenu.vue'
import AnnotationRenderer from './components/AnnotationRenderer.vue'
import ClickHearts from './components/ClickHearts.vue'
import SnowEffect from './components/SnowEffect.vue'

// 导入你自定义的底部 Footer
import QindFooter from './components/QindFooter.vue'
</script>

<template>
  <!-- 继承默认主题布局 -->
  <DefaultTheme.Layout>

    <template #nav-bar-content-after>
      <FontSettingsPlugin />
    </template>

    <template #layout-top>
      <ClickHearts />
    </template>

    <template #layout-bottom>
      <ReadingProgress />
      <TextSelectionMenu />
      <AnnotationRenderer />
      <SnowEffect />
      <QindFooter />
    </template>

  </DefaultTheme.Layout>
</template>