<script setup lang="ts" name="SidebarTrigger">
import { nextTick, onMounted, ref, onUnmounted, computed } from "vue";

// 侧边栏折叠状态
const isCollapsed = ref(false);
// 是否处于激活状态（用于添加过渡动画）
const isActive = ref(false);
// 是否小屏幕（< 960px）
const isMobile = ref(false);
// resize 节流定时器
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 检测是否为移动设备
 */
const checkMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 960px)").matches;
};

/**
 * 节流处理的 resize 监听
 */
const handleResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    checkMobile();
  }, 100);
};

/**
 * 切换侧边栏展开/折叠状态
 */
const toggleSidebar = () => {
  const layoutDom = document.querySelector(".Layout");
  if (!layoutDom) return;

  // 切换折叠状态
  layoutDom.classList.toggle("is-sidebar-collapse");
  isCollapsed.value = !isCollapsed.value;

  // 添加激活状态以触发动画
  isActive.value = true;
  setTimeout(() => {
    isActive.value = false;
  }, 500);
};

/**
 * 处理键盘事件（支持 Enter 和 Space 键）
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleSidebar();
  }
};

/**
 * 监听外部侧边栏状态变化（如通过其他方式切换）
 */
const observeSidebarState = () => {
  const layoutDom = document.querySelector(".Layout");
  if (!layoutDom) return;

  // 初始化状态
  isCollapsed.value = layoutDom.classList.contains("is-sidebar-collapse");

  // 使用 MutationObserver 监听类名变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        isCollapsed.value = layoutDom.classList.contains("is-sidebar-collapse");
      }
    });
  });

  observer.observe(layoutDom, { attributes: true });

  // 返回清理函数
  return () => observer.disconnect();
};

// 计算图标旋转角度
const iconTransform = computed(() => ({
  transform: isCollapsed.value ? "rotate(180deg)" : "rotate(0deg)",
}));

let cleanupObserver: (() => void) | null = null;

onMounted(async () => {
  await nextTick();

  // 添加文档内容过渡动画类
  const docDom = document.querySelector(".VPContent.has-sidebar");
  docDom?.classList.add("sidebar-trigger-transition");

  // 初始化移动端检测
  checkMobile();
  window.addEventListener("resize", handleResize);

  // 监听侧边栏状态变化
  cleanupObserver = observeSidebarState();
});

onUnmounted(() => {
  // 清理 resize 监听
  window.removeEventListener("resize", handleResize);
  if (resizeTimer) clearTimeout(resizeTimer);

  // 清理 MutationObserver
  if (cleanupObserver) cleanupObserver();
});
</script>

<template>
  <slot v-if="!isMobile" :isCollapsed :isActive :toggleSidebar>
    <button
      type="button"
      :class="['sidebar-trigger', { 'is-active': isActive, 'is-collapsed': isCollapsed }]"
      @click="toggleSidebar"
      @keydown="handleKeydown"
      :title="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
      :aria-label="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
      :aria-expanded="!isCollapsed"
    >
      <span class="sidebar-trigger__icon" :style="iconTransform">
        <svg
          viewBox="0 0 48 48"
          display="inline-block"
          vertical-align="middle"
          min-width="1.2rem"
          width="1.2em"
          height="1.2em"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="4">
            <path d="M6 7h36M8 24h32"></path>
            <path stroke-linejoin="round" d="M13.99 30L8 24.005L14 18m20.01 0L40 23.995L34 30"></path>
            <path d="M6 41h36"></path>
          </g>
        </svg>
      </span>
    </button>
  </slot>
</template>

<style scoped>
.sidebar-trigger {
  position: fixed;
  top: calc(var(--vp-nav-height) + var(--sidebar-trigger-top-offset, 10px));
  left: calc(
    (100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px +
      var(--sidebar-trigger-left-offset, 10px)
  );
  z-index: 20;
  cursor: pointer;
  background-color: transparent;
  border-radius: 50%;
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1), all 0.3s ease;
}

.sidebar-trigger:hover {
  background-color: transparent;
}

.sidebar-trigger:hover .sidebar-trigger__icon svg {
  color: var(--vp-c-black);
}

/* 夜间主题时 hover 图标为白色 */
:root.theme-night .sidebar-trigger:hover .sidebar-trigger__icon svg {
  color: var(--vp-c-white);
}

.sidebar-trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.sidebar-trigger.is-active {
  transition-duration: 0.5s;
}

.sidebar-trigger__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  user-select: none;
}

.sidebar-trigger__icon svg {
  width: 1.2em;
  height: 1.2em;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
}

/* 折叠状态时图标旋转 */
.sidebar-trigger.is-collapsed .sidebar-trigger__icon {
  transform: rotate(180deg);
}

@media (max-width: 1440px) {
  .sidebar-trigger {
    left: calc(var(--vp-sidebar-width) + var(--sidebar-trigger-left-offset, 10px));
  }
}

@media (max-width: 1280px) {
  .sidebar-trigger {
    top: calc(var(--vp-nav-height) + var(--sidebar-trigger-top-offset, 10px) + 47px);
  }
}
</style>