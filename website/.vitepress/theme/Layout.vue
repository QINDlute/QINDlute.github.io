<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import { onMounted, onUnmounted, computed } from 'vue'

import FontSettingsPlugin from './components/FontSettingsPlugin.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import TextSelectionMenu from './components/TextSelectionMenu.vue'
import AnnotationRenderer from './components/AnnotationRenderer.vue'
import ClickHearts from './components/ClickHearts.vue'
import SnowEffect from './components/SnowEffect.vue'
import Spotlight from './components/Spotlight/index.vue'
import SidebarTrigger from './components/SidebarTrigger.vue'
import QindFooter from './components/QindFooter.vue'
import QindHero from './components/QindHero.vue'
import SnowTrigger from './components/SnowTrigger.vue'
import AppleIcon from './components/AppleIcon.vue'

const { frontmatter } = useData()
const router = useRouter()

// 键盘快捷键处理 - 上一页/下一页
const handleKeydown = (event: KeyboardEvent) => {
  // 忽略在输入框中的按键
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
    return;
  }

  // 获取页面的上下页链接
  const prevLink = document.querySelector('.pager-link.prev')?.getAttribute('href');
  const nextLink = document.querySelector('.pager-link.next')?.getAttribute('href');

  // 左箭头 - 上一页
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (prevLink) {
      router.go(prevLink);
    }
  }

  // 右箭头 - 下一页
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (nextLink) {
      router.go(nextLink);
    }
  }
};

// 组件挂载时添加键盘监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

// 组件卸载时移除键盘监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <!-- 继承默认主题布局 -->
  <DefaultTheme.Layout class="has-sidebar-trigger" :class="frontmatter.layoutClass" v-bind="$attrs">

    <template #nav-bar-content-before>
      <SnowTrigger />
    </template>

    <template #nav-bar-content-after>
      <FontSettingsPlugin />
    </template>

    <template #home-hero-info-after>
      <QindHero />
      <AppleIcon />
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