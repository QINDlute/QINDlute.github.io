<template>
  <a
    :href="href"
    :class="[
      'VPButton',
      size,
      type,
      { 'is-disabled': disabled }
    ]"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  /**
   * 按钮类型
   * @default 'brand'
   */
  type?: 'brand' | 'alt' | 'costum'
  
  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * 按钮链接
   */
  href?: string
  
  /**
   * 目标窗口
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
  
  /**
   * 是否禁用
   */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /**
   * 点击事件
   */
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
/* 组件样式已在 costom_nightbtn.css 中定义，这里只需要添加额外的样式 */
.VPButton.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

<!-- <CustomButton type="类型" href="链接" size="尺寸">按钮文本</CustomButton> -->