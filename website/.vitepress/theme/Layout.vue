<template>
  <!-- 加载动画 -->
  <LoadingAnimation :isLoading="isLoading" />
  
  <!-- 继承默认主题布局，使用 v-if 控制显示，确保回到主页时纸屑动画从头加载 -->
  <div v-if="!isLoading">
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

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import { onMounted, onUnmounted, computed, ref, watch, nextTick, inject, type Ref } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar';
import "perfect-scrollbar/css/perfect-scrollbar.css";

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
import { LoadingStateKey } from './index'

const { frontmatter } = useData()
const router = useRouter()

// 从 index.ts 注入加载状态
const isLoading = inject<Ref<boolean>>(LoadingStateKey, ref(false))

// 存储 perfect-scrollbar 实例数组
let psInstances: PerfectScrollbar[] = [];

// 检测是否为移动设备
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

/**
 * 检测是否为移动设备
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 初始化 perfect-scrollbar 自定义滚动条
 */
const initPerfectScrollbar = () => {
  // 清理旧的实例
  psInstances.forEach(instance => instance.destroy());
  psInstances = [];
  
  if (isMobileDevice()) {
    return;
  }
  
  // 定义需要添加自定义滚动条的容器选择器
  const containerSelectors = [
    '.VPSidebar',
  ];
  
  containerSelectors.forEach(selector => {
    const container = document.querySelector(selector) as HTMLElement;
    
    if (container) {
      // 确保容器有必要的样式
      const styles = window.getComputedStyle(container);
      if (!['fixed', 'absolute', 'relative', 'sticky'].includes(styles.position)) {
        container.style.position = 'relative';
      }
      
      // 初始化 perfect-scrollbar
      const instance = new PerfectScrollbar(container, {
        wheelSpeed: 1,
        wheelPropagation: false,
        swipeEasing: true,
        suppressScrollX: true
      });
      
      psInstances.push(instance);
    }
  });
};

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

// 监听加载状态变化，页面内容显示后初始化 perfect-scrollbar
watch(
  () => isLoading.value,
  (newValue) => {
    if (newValue === false) {
      // 页面内容显示后，初始化 perfect-scrollbar
      nextTick(() => {
        initPerfectScrollbar();
      });
    }
  }
);

// 组件挂载时初始化
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  
  // 销毁所有 perfect-scrollbar 实例
  psInstances.forEach(instance => instance.destroy());
  psInstances = [];
});
</script>
