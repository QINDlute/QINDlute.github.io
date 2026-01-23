<template>
  <!-- 条件渲染：如果提供了image属性，则渲染img元素，否则渲染svg元素 -->
  <template v-if="image">
    <!-- External Image mode -->
    <img
      :src="image"
      :style="{
        display: 'inline-block',
        pointerEvents: preventView ? 'none' : 'auto'
      }"
      :alt="name || 'icon'"
      v-bind="$attrs"
      :data-no-zoom="preventView"
      @contextmenu="preventView ? ($event: MouseEvent) => $event.preventDefault() : undefined"
    />
  </template>
  <template v-else>
    <!-- SVG mode -->
    <svg
      :viewBox="viewBox"
      :style="{ display: 'inline-block' }"
      :aria-hidden="true"
      v-bind="$attrs"
    >
      <!-- 根据名称渲染对应的图标路径，所有图标共享同一个外层SVG -->
      <template v-if="name === 'web'">
        <g fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M25 40H7C5.34315 40 4 38.6569 4 37V11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V24.9412"></path>
          <path fill="#2F88FF" stroke="currentColor" stroke-width="4" d="M4 11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V20H4V11Z"></path>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M32 35H44"></path>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M38 29V41"></path>
          <circle r="2" fill="#fff" transform="matrix(0 -1 -1 0 10 14)"></circle>
          <circle r="2" fill="#fff" transform="matrix(0 -1 -1 0 16 14)"></circle>
        </g>
      </template>
      
    </svg>
  </template>
</template>

<script setup lang="ts">

interface Props {
  // 图标名称（用于内置SVG图标）
  name?: string
  // 外部图像路径（用于图像模式）
  image?: string
  // 自定义viewBox，默认为'0 0 48 48'
  viewBox?: string
  // 是否防止图像被查看（禁用缩放、右键菜单等）
  preventView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  viewBox: '0 0 48 48',
  preventView: true
})
</script>

<style scoped>
/* 可添加默认样式 */
</style>