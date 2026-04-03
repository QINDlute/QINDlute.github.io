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
import Spotlight from './components/Spotlight/index.vue'
import SidebarTrigger from './components/SidebarTrigger.vue'

// 导入你自定义的底部 Footer
import QindFooter from './components/QindFooter.vue'
import QindHero from './components/QindHero.vue'
</script>

<template>
  <!-- 继承默认主题布局 -->
  <DefaultTheme.Layout class="has-sidebar-trigger">

    <template #nav-bar-content-after>
      <FontSettingsPlugin />
    </template>

    <template #home-hero-info-after>
      <QindHero />
    </template>

    <template #layout-top>
      <ClickHearts />
    </template>

    <template #layout-bottom>
      <ReadingProgress />
      <TextSelectionMenu />
      <AnnotationRenderer />
      <SnowEffect />
      <Spotlight />
      <SidebarTrigger />
      <QindFooter />
    </template>

  </DefaultTheme.Layout>
</template>