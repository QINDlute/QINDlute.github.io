<!-- ./vitepress/theme/components/CustomButton.vue -->

<!-- 19line:仅button标签支持disabled属性，解决<a>标签绑定disabled无效的兼容性问题 -->
<!-- 优化1：动态标签渲染，解决无href时<a>标签语义化和兼容性问题 -->
<!-- 有href时渲染<a>标签（链接功能），无href时渲染<button>标签（按钮功能） -->
<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :class="[
      'VPButton',
      size,
      type,
      { 'is-disabled': disabled }
    ]"
    :target="href ? target : undefined"
    :rel="href && target === '_blank' ? 'noopener noreferrer' : null"
    @click="handleClick"
    :disabled="!href && disabled"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
// 优化2：移除冗余导入，defineProps/defineEmits是Vue3编译器宏，无需手动导入
// 优化3：抽离Props类型定义，提高可维护性，便于后续复用和修改
type ButtonType = 'brand' | 'alt' | 'custom'
type ButtonSize = 'small' | 'medium' | 'large'
type TargetType = '_self' | '_blank' | '_parent' | '_top'

// 优化4：使用withDefaults设置默认值，解决无默认值导致的样式/功能兼容性问题
// 原代码仅注释了默认值，未实际设置，导致不传递props时可能出现样式异常
const props = withDefaults(
  defineProps<{
    /**
     * 按钮类型
     * @default 'brand'
     */
    type?: ButtonType
    
    /**
     * 按钮大小
     * @default 'medium'
     */
    size?: ButtonSize
    
    /**
     * 按钮链接
     */
    href?: string
    
    /**
     * 目标窗口
     */
    target?: TargetType
    
    /**
     * 是否禁用
     */
    disabled?: boolean
  }>(),
  {
    type: 'brand',
    size: 'medium',
    disabled: false // 显式设置默认值，避免undefined带来的判断问题
  }
)

// 优化5：简化Emits定义，保持类型安全的同时更简洁
const emit = defineEmits<{
  /**
   * 点击事件
   */
  click: [event: MouseEvent]
}>()

// 优化6：优化点击事件逻辑，提前终止执行，提高性能
const handleClick = (event: MouseEvent) => {
  // 禁用状态下阻止默认行为和事件派发
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation() // 新增：阻止事件冒泡，提升事件处理稳定性
    return
  }
  emit('click', event)
}
</script>

<style scoped>
/* 优化7：简化样式结构，保留核心禁用样式，提高样式优先级兼容性 */
/* 原样式无问题，优化注释说明，便于维护 */
.VPButton.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none; /* 彻底阻止交互，解决部分浏览器禁用状态仍可点击的兼容性问题 */
}

/* 补充：解决动态标签（button）的默认样式干扰，提高兼容性 */
:deep(.VPButton) {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: none;
}
</style>

<!-- <CustomButton type="类型" href="链接" size="尺寸">按钮文本</CustomButton> -->