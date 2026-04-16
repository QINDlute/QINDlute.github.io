<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vitepress";

const props = defineProps<{ enabled: boolean; mode?: 'aside' | 'under' }>();

const shouldRecalculate = ref(false);
const boxStyles = ref<Record<string, string | number>>({ display: "none" });
const vpDocElement = ref<HTMLElement>();
const highlightedElement = ref<HTMLElement>();

const mousePosition = ref<{ x: number; y: number }>({ x: -1, y: -1 });
const currentMode = ref(props.mode || 'aside');

// 事件监听器引用，用于 cleanup
let mousemoveHandler: ((event: MouseEvent) => void) | null = null;
let scrollHandler: (() => void) | null = null;

const computeBoxStyles = (bounding: { height: number; left: number; top: number; width: number }) => {
  return {
    display: "block",
    width: `${bounding.width + 8}px`,
    height: `${bounding.height + 8}px`,
    left: `${bounding.left - 4}px`,
    top: `${bounding.top - 4}px`,
    transition: "all 0.2s ease",
    borderRadius: "8px",
  };
};

const findChildElementUnderVPDocElement = (element: HTMLElement | null) => {
  if (element === null) return null;

  if (element.parentElement === document.querySelector(".VPDoc main .vp-doc > div")) return element;
  else return findChildElementUnderVPDocElement(element.parentElement);
};

/**
 * 检查元素是否包含图片
 */
const containsImage = (element: HTMLElement): boolean => {
  return element.tagName === "IMG" || element.querySelector("img") !== null;
};

const watchHandler = () => {
  if (typeof window === 'undefined') return;

  const element = document.elementFromPoint(mousePosition.value.x, mousePosition.value.y) as HTMLElement | null;

  if (!(element && vpDocElement.value?.contains(element))) return;

  // 忽视 <hr> 标签，保持之前的状态不变
  if (element.tagName === "HR") {
    return;
  }

  const el = findChildElementUnderVPDocElement(element);
  highlightedElement.value = el || undefined;

  // 如果当前元素是图片，高亮整个段落（整行宽度）
  if (element.tagName === "IMG") {
    // 找到图片所在的段落
    const parentParagraph = element.closest("p");
    if (parentParagraph) {
      const rect = parentParagraph.getBoundingClientRect();
      boxStyles.value = computeBoxStyles({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      // 如果没有找到段落，则高亮图片本身
      const rect = element.getBoundingClientRect();
      boxStyles.value = computeBoxStyles({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  } else if (highlightedElement.value && highlightedElement.value.tagName === "P" && !containsImage(highlightedElement.value)) {
    // 普通段落，按行高亮
    const val = highlightedElement.value;
    const style = window.getComputedStyle(val);
    const lineHeight = Number.parseFloat(style.lineHeight);
    const lines = Math.floor(val.offsetHeight / lineHeight);

    const rect = val.getBoundingClientRect();
    const relativeY = mousePosition.value.y - rect.top;

    for (let i = 0; i < lines; i++) {
      const top = i * lineHeight;
      const height = lineHeight;
      const left = val.offsetLeft;
      const width = val.offsetWidth;

      if (relativeY >= top && relativeY < top + height) {
        boxStyles.value = computeBoxStyles({
          top: top + rect.top,
          left: left + rect.left,
          width,
          height,
        });

        break;
      }
    }
  } else {
    // 其他元素或包含图片的段落，高亮整个元素
    if (highlightedElement.value) {
      const rect = highlightedElement.value.getBoundingClientRect();

      boxStyles.value = computeBoxStyles({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  // 初始化 DOM 元素
  vpDocElement.value = document.querySelector(".VPDoc main .vp-doc") as HTMLElement;

  // 绑定事件监听器
  mousemoveHandler = (event: MouseEvent) => {
    mousePosition.value = { x: event.clientX, y: event.clientY };
  };
  window.addEventListener('mousemove', mousemoveHandler);

  scrollHandler = watchHandler;
  window.addEventListener('scroll', scrollHandler, true);
});

onUnmounted(() => {
  // 清理事件监听器
  if (mousemoveHandler) {
    window.removeEventListener('mousemove', mousemoveHandler);
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler, true);
  }
});

const route = useRoute();
watch(
  route,
  () => {
    if (typeof window !== 'undefined') {
      vpDocElement.value = document.querySelector(".VPDoc main .vp-doc") as HTMLElement;

      shouldRecalculate.value = true;
      boxStyles.value = { display: "none" };

      watchHandler();
      shouldRecalculate.value = false;
    }
  },
  { flush: "post" }
);

watch([() => mousePosition.value.x, () => mousePosition.value.y], () => {
  if (props.enabled) watchHandler();
});

watch(
  () => props.enabled,
  val => {
    if (!val) boxStyles.value = { display: "none" };
  }
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.enabled && !shouldRecalculate"
      :style="boxStyles"
      :class="[
        'spotlight-hover',
        currentMode === 'aside' ? 'spotlight-hover__aside' : 'spotlight-hover__under'
      ]"
      aria-hidden="true"
      focusable="false"
    />
  </Teleport>
</template>

<style scoped>
/* 文本中高亮 */
.spotlight-hover {
  pointer-events: none;
  position: fixed;
  z-index: 9; /* 刚好在codeblocks-fold（代码块折叠插件）之上 */
  box-shadow: 0 0 15px var(--vp-c-brand);
}

/* 侧边栏高亮 */
.spotlight-hover__aside::before {
  content: "";
  position: absolute;
  display: block;
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--vp-c-brand);
  left: -24px;
  box-shadow: 0 0 15px var(--vp-c-brand);
}

.spotlight-hover__under {
  z-index: -1;
  background-color: var(--vp-c-brand-soft);
}
</style>