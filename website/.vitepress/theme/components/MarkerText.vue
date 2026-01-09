<!-- .vitepress/theme/components/MarkerText.vue -->

<template>
  <span
    class="marker"
    :class="[
      colorClass,
      { 'marker-full': status === 'full' }
    ]"
    :style="customStyle"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义组件props
const props = defineProps<{
  /**
   * 标记颜色
   * 可选值: red, orange, blue, purple, green, 或自定义颜色值
   */
  color?: string;
  
  /**
   * 标记状态
   * - full: 完全覆盖文本
   * - 其他值: 仅底部34%覆盖
   */
  status?: string;
}>();

// 计算颜色类名
const colorClass = computed(() => {
  // 如果是预定义颜色，则返回对应的类名
  const predefinedColors = ['red', 'orange', 'blue', 'purple', 'green', 'magenta'];
  if (props.color && predefinedColors.includes(props.color)) {
    return `marker-${props.color}`;
  }
  return '';
});

// 计算自定义样式
const customStyle = computed(() => {
  // 如果是自定义颜色值，则使用内联样式
  const predefinedColors = ['red', 'orange', 'blue', 'purple', 'green', 'magenta'];
  if (props.color && !predefinedColors.includes(props.color)) {
    return {
      '--marker-color': props.color
    };
  }
  return {};
});
</script>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
