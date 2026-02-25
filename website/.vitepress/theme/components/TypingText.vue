<!-- https://www.kodeset.site/components/019bcf3b-b958-727c-9ae1-df1d828ad1d2 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 组件属性
const props = defineProps({
  // 要显示的文本
  text: {
    type: String,
    default: 'Kodeset'
  },
  // 打字速度（毫秒）
  speed: {
    type: Number,
    default: 100
  },
  // 删除前的延迟（毫秒）
  delayBeforeDeleting: {
    type: Number,
    default: 3000
  },
  // 重新开始前的延迟（毫秒）
  delayBeforeTypingAgain: {
    type: Number,
    default: 500
  },
  // 光标颜色
  cursorColor: {
    type: String,
    default: 'black'
  },
  // 文本颜色
  textColor: {
    type: String,
    default: 'var(--vp-c-text-2)'
  },
  // 字体大小
  fontSize: {
    type: String,
    default: 'var(--vp-custom-font-size)'
  },
  // 字体粗细
  fontWeight: {
    type: String,
    default: '700'
  },
  // 行高
  lineHeight: {
    type: String,
    default: '1.5'
  }
});

// 响应式数据
const displayText = ref('');
const isDeleting = ref(false);
const index = ref(0);
let timeoutId: number | null = null;

// 打字动画函数
function typeText() {
  if (isDeleting.value) {
    displayText.value = props.text.substring(0, index.value);
    index.value--;
    
    if (index.value < 0) {
      isDeleting.value = false;
      timeoutId = window.setTimeout(typeText, props.delayBeforeTypingAgain);
    } else {
      timeoutId = window.setTimeout(typeText, props.speed / 2); // 删除时更快
    }
  } else {
    displayText.value = props.text.substring(0, index.value);
    index.value++;
    
    if (index.value > props.text.length) {
      isDeleting.value = true;
      timeoutId = window.setTimeout(typeText, props.delayBeforeDeleting);
    } else {
      timeoutId = window.setTimeout(typeText, props.speed);
    }
  }
}

// 组件挂载时开始动画
onMounted(() => {
  timeoutId = window.setTimeout(typeText, props.delayBeforeTypingAgain);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<template>
  <span 
    id="typing-text"
    :style="{
      color: textColor,
      borderColor: cursorColor,
      fontSize: fontSize,
      fontWeight: fontWeight,
      lineHeight: lineHeight,
      fontFamily: 'var(--vp-custom-font-family, inherit)',
      minHeight: `calc(${fontSize} * ${lineHeight})`
    }"
  >
    {{ displayText }}
  </span>
</template>

<style scoped>
@keyframes blink {
  0%, 100% {
    border-color: transparent;
  }
  50% {
    border-color: var(--text-color);
  }
}

#typing-text {
  border-right: 3.5px solid;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  animation: blink 0.7s steps(2) infinite;
}
</style>