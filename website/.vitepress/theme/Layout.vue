<template>
  <!-- 加载动画 -->
  <LoadingAnimation :isLoading="isLoading" />
  
  <!-- 代码块折叠功能组件 -->
  <CodeblocksFold />
  
  <!-- 继承默认主题布局，使用 v-show 控制显示，避免路由状态丢失 -->
  <div v-show="!isLoading">
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
        <ReadingProgress />
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
import { useData } from 'vitepress'
import { ref, inject, type Ref } from 'vue'

import SnowEffect from '@components/Layout/SnowEffect.vue'
import SnowTrigger from '@components/Layout/SnowTrigger.vue'
import QindHero from '@components/Layout/QindHero.vue'
import QindFooter from '@components/Layout/QindFooter.vue'
import AppleIcon from '@components/Layout/AppleIcon.vue'
import FontSettingsPlugin from '@components/Layout/FontSettingsPlugin.vue'
import ClickHearts from '@components/Layout/ClickHearts.vue'
import ReadingProgress from '@components/Layout/ReadingProgress.vue'
import TextSelectionMenu from '@components/Layout/TextSelectionMenu.vue'
import AnnotationRenderer from '@components/Layout/AnnotationRenderer.vue'
import Spotlight from '@components/Spotlight/index.vue'
import SidebarTrigger from '@components/Layout/SidebarTrigger.vue'
import LoadingAnimation from '@components/Layout/LoadingAnimation.vue'
import CodeblocksFold from '@components/Layout/CodeblocksFold.vue'
import { LoadingStateKey } from '@theme/index'

const { frontmatter } = useData()

// 从 index.ts 注入加载状态
const isLoading = inject<Ref<boolean>>(LoadingStateKey, ref(false))

</script>
