<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'

import SnowEffect from './components/Layout/SnowEffect.vue'
import SnowTrigger from './components/Layout/SnowTrigger.vue'
import QindHero from './components/Layout/QindHero.vue'
import QindFooter from './components/Layout/QindFooter.vue'
import AppleIcon from './components/Layout/AppleIcon.vue'
import FontSettingsPlugin from './components/Layout/FontSettingsPlugin.vue'
import ClickHearts from './components/Layout/ClickHearts.vue'
// import ReadingProgress from './components/Layout/ReadingProgress.vue'
import ReadingProgress_mobile from './components/Layout/ReadingProgress_mobile.vue'
import TextSelectionMenu from './components/Layout/TextSelectionMenu.vue'
import AnnotationRenderer from './components/Layout/AnnotationRenderer.vue'
import Spotlight from './components/Spotlight/index.vue'
import SidebarTrigger from './components/SidebarTrigger.vue'
import LoadingAnimation from './components/LoadingAnimation.vue'

const { frontmatter } = useData()
const router = useRouter()

// 加载动画组件的ref引用
const loadingAnimationRef = ref<InstanceType<typeof LoadingAnimation>>()
// 用于控制页面内容显示的状态
const showContent = ref(false)

// 检测是否为移动设备
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// 监听加载动画状态变化
watch(
  () => loadingAnimationRef.value?.isLoading,
  (isLoading) => {
    // 当加载状态变为false时，显示页面内容
    if (isLoading === false) {
      showContent.value = true
    } else {
      // 当加载状态变为true时，隐藏页面内容
      showContent.value = false
    }
  },
  { immediate: true }
)

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
  <!-- 加载动画 -->
  <LoadingAnimation ref="loadingAnimationRef" />
  
  <!-- 继承默认主题布局，只有在showContent为true时才显示 -->
  <div v-if="showContent">
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
        <SnowEffect />
        <Spotlight />
        <SidebarTrigger />
        <!-- <ReadingProgress v-if="!isMobile" /> -->
        <ReadingProgress_mobile />
      </template>

      <template #layout-bottom>
        <TextSelectionMenu />
        <AnnotationRenderer />
        <QindFooter />
      </template>

    </DefaultTheme.Layout>
  </div>
</template>