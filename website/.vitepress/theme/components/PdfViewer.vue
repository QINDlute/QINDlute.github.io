<template>
  <div class="pdf-viewer-container">
    <VPdfViewer :src="src" initial-scale="pageWidth" />
  </div>
</template>

<script setup lang="ts">
import { defineClientComponent } from 'vitepress'

// 定义 props
const props = defineProps<{
  src: string
}>()

// 延迟导入 VPdfViewer 组件，确保在客户端渲染
const VPdfViewer = defineClientComponent(() => {
  return import('@vue-pdf-viewer/viewer').then(({ VPdfViewer }) => VPdfViewer)
})
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
  height: 800px;
  max-width: 100%;
  overflow: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pdf-viewer-container {
    height: 600px;
  }
}
</style>