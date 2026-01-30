<!-- .vitepress/theme/components/SmoothDetails.vue -->
<template>
  <div class="smooth-details">
    <button 
      class="smooth-details-summary" 
      :class="{ expanded: isOpen }"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <slot name="title">查看详情</slot>
    </button>
    <!-- Calculate height dynamically -->
    <div 
      class="smooth-details-content"
      :style="contentStyle"
      ref="contentRef"
      :class="{ expanded: isOpen }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, onUpdated } from 'vue';

const isOpen = ref(false);
const showBorder = ref(false);
const contentRef = ref<HTMLElement | null>(null);
const contentHeight = ref(0);
const transitionDuration = ref(400); // 默认过渡时长（毫秒）
const observerRef = ref<MutationObserver | null>(null);
const timeoutRef = ref<number | null>(null);
const debounceTimeoutRef = ref<number | null>(null);

const toggle = () => {
  // 清除之前可能存在的定时器
  if (timeoutRef.value !== null) {
    clearTimeout(timeoutRef.value);
    timeoutRef.value = null;
  }
  
  if (!isOpen.value) {
    // 展开时立即显示横线
    showBorder.value = true;
  } else {
    // 收起时，等待动画完成后再隐藏横线
    timeoutRef.value = window.setTimeout(() => {
      showBorder.value = false;
      timeoutRef.value = null; // 清除定时器引用
    }, transitionDuration.value);
  }
  isOpen.value = !isOpen.value;
};

// 计算内容高度和过渡时长
const updateContentHeight = () => {
  // 清除之前的防抖定时器
  if (debounceTimeoutRef.value !== null) {
    clearTimeout(debounceTimeoutRef.value);
    debounceTimeoutRef.value = null;
  }
  
  // 添加防抖，避免过于频繁的计算
  debounceTimeoutRef.value = window.setTimeout(() => {
    if (contentRef.value) {
      // 使用 scrollHeight 获取内容的实际高度
      contentHeight.value = contentRef.value.scrollHeight;
      
      // 根据高度计算过渡时长
      const height = contentHeight.value;
      const duration = (4 + 15 * Math.pow(height / 36, 0.25) + (height / 36) / 5) * 10;
      const roundedDuration = Math.round(duration);
      
      // 保存过渡时长到响应式变量
      transitionDuration.value = roundedDuration;
      
      // 设置过渡时长到容器元素，使箭头伪元素也能继承
      const container = contentRef.value.parentElement;
      if (container) {
        container.style.setProperty('--sdetails-transition-duration', `${roundedDuration}ms`);
      }
    }
    
    // 清除防抖定时器引用
    debounceTimeoutRef.value = null;
  }, 100); // 100ms 防抖延迟
};

// 监听内容变化
const observeContentChanges = () => {
  if (!contentRef.value) return;
  
  const observer = new MutationObserver(() => {
    updateContentHeight();
  });
  
  observer.observe(contentRef.value, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  });
  
  observerRef.value = observer;
  return observer;
};

// 动态样式
const contentStyle = computed(() => {
  return {
    maxHeight: isOpen.value ? `${contentHeight.value}px` : '0px',
    borderTop: (isOpen.value || showBorder.value) ? '1px solid var(--sdetails-border-color)' : 'none',
    transition: `max-height ${transitionDuration.value}ms ease-in-out, margin-top ${transitionDuration.value}ms ease-in-out`
  };
});

onMounted(() => {
  // 初始计算高度
  updateContentHeight();
  observeContentChanges();
});

onUnmounted(() => {
  // 清理 MutationObserver
  if (observerRef.value) {
    observerRef.value.disconnect();
    observerRef.value = null;
  }
  
  // 清理定时器
  if (timeoutRef.value !== null) {
    clearTimeout(timeoutRef.value);
    timeoutRef.value = null;
  }
  
  // 清理防抖定时器
  if (debounceTimeoutRef.value !== null) {
    clearTimeout(debounceTimeoutRef.value);
    debounceTimeoutRef.value = null;
  }
});

// 监听插槽内容变化
onUpdated(() => {
  // 在 DOM 更新后重新计算高度
  nextTick(() => {
    updateContentHeight();
  });
});
</script>