<script setup lang="ts" name="SidebarTrigger">
import { nextTick, onMounted, ref, onUnmounted, computed } from "vue";

// 侧边栏折叠状态
const isCollapsed = ref(false);
// 目录详情页折叠状态
const isAsideCollapsed = ref(false);
// 是否有目录详情页
const hasAside = ref(false);
// 是否处于激活状态（用于添加过渡动画）
const isActive = ref(false);
// 是否小屏幕（< 960px）
const isMobile = ref(false);
// resize 节流定时器
let resizeTimer: ReturnType<typeof setTimeout> | null = null;
// 记录触发折叠时的鼠标位置
let lastMousePosition = { x: window.innerWidth / 2, y: 200 };

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
    // 动画完成后，模拟鼠标移动来校正聚光灯位置
    simulateMouseMove();
  }, 450);
};

/**
 * 切换目录详情页（aside）展开/折叠状态
 */
const toggleAside = () => {
  const layoutDom = document.querySelector(".Layout");
  const asideDom = document.querySelector(".aside");
  if (!asideDom || !layoutDom) return;
  
  // 切换折叠状态
  layoutDom.classList.toggle("has-aside-collapse");
  asideDom.classList.toggle("is-collapsed");
  isAsideCollapsed.value = !isAsideCollapsed.value;
  
  // 添加激活状态以触发动画
  isActive.value = true;
  
  // 动画完成后，模拟鼠标移动来校正聚光灯位置
  setTimeout(() => {
    isActive.value = false;
    simulateMouseMove();
  }, 450); // 与侧边栏保持一致，都是 0.45s
};

/**
 * 处理键盘快捷键 Ctrl + B 和 Ctrl + H
 */
const handleKeyboardShortcut = (event: KeyboardEvent) => {
  // 检测 Ctrl + B 组合键（侧边栏）
  if (event.ctrlKey && event.key === 'b') {
    // 检查当前页面是否有侧边栏
    const hasSidebar = document.querySelector(".VPContent.has-sidebar") !== null;
    
    // 非移动端且有侧边栏时才触发
    if (!isMobile.value && hasSidebar) {
      event.preventDefault(); // 阻止浏览器默认的加粗行为
      toggleSidebar();
    }
  }
  
  // 检测 Ctrl + G 组合键（目录详情页）
  if (event.ctrlKey && event.key === 'g') {
    // 检查当前页面是否有目录详情页且有内容
    const asideElement = document.querySelector(".aside");
    let hasAsideContent = false;
    if (asideElement) {
      const outlineList = asideElement.querySelector(".VPDocOutlineItem.root");
      hasAsideContent = outlineList !== null && outlineList.children.length > 0;
    }
    
    // 非移动端且有目录详情页内容时才触发
    if (!isMobile.value && hasAsideContent) {
      event.preventDefault(); // 阻止浏览器默认行为
      toggleAside();
    }
  }
};

/**
 * 模拟鼠标移动来校正聚光灯位置
 */
const simulateMouseMove = () => {
  const centerX = window.innerWidth / 2;
  let y = lastMousePosition.y;
  
  // 与页面缩放有关，缩放越小，顶部位置越低（越小），标准 90%对应120文档标题高度
  // 若触发折叠按钮时鼠标处于聚光灯外（两个聚光灯区域之间）时，不会自动校准聚光灯位置
  if (y < 120) {
    y = 120;
  }
  // console.log("lastMousePosition.y:", lastMousePosition.y);
  // console.log("y:", y);
  
  // 触发一次大幅度的移动，确保 watch 一定会被触发
  dispatchMouseMove(0, 0);
  
  // 稍等片刻，移动到目标位置
  setTimeout(() => {
    dispatchMouseMove(centerX, y);
  }, 30);
  
  // 再稍等片刻，横向偏移一点
  setTimeout(() => {
    dispatchMouseMove(centerX + 10, y);
  }, 80);
  
  // 最后移回原位置
  setTimeout(() => {
    dispatchMouseMove(centerX, y);
  }, 90);
};

/**
 * 派发鼠标移动事件
 */
const dispatchMouseMove = (x: number, y: number) => {
  const event = new MouseEvent('mousemove', {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
    view: window
  });
  window.dispatchEvent(event);
};

/**
 * 处理键盘事件（支持 Enter 和 Space 键）
 */
const handleKeydown = (event: KeyboardEvent, target: 'sidebar' | 'aside' = 'sidebar') => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (target === 'sidebar') {
      toggleSidebar();
    } else {
      toggleAside();
    }
  }
};

/**
 * 监听外部侧边栏状态变化和DOM变化
 */
const observeSidebarState = () => {
  const layoutDom = document.querySelector(".Layout");
  const asideDom = document.querySelector(".aside");
  if (!layoutDom) return () => {};

  // 初始化状态
  isCollapsed.value = layoutDom.classList.contains("is-sidebar-collapse");
  if (asideDom) {
    // 检查当前页面是否有目录内容
    const outlineList = asideDom.querySelector(".VPDocOutlineItem.root");
    const hasAsideContent = outlineList !== null && outlineList.children.length > 0;
    
    // 有目录内容时才考虑折叠状态，否则强制展开
    if (hasAsideContent) {
      isAsideCollapsed.value = asideDom.classList.contains("is-collapsed");
    } else {
      // 没有目录内容时，强制展开
      isAsideCollapsed.value = false;
      layoutDom.classList.remove("has-aside-collapse");
      asideDom.classList.remove("is-collapsed");
    }
  }

  // 使用 MutationObserver 监听类名变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        if (mutation.target === layoutDom) {
          isCollapsed.value = layoutDom.classList.contains("is-sidebar-collapse");
        } else if (mutation.target === asideDom) {
          // 检查当前页面是否有目录内容
          const outlineList = asideDom.querySelector(".VPDocOutlineItem.root");
          const hasAsideContent = outlineList !== null && outlineList.children.length > 0;
          
          // 有目录内容时才考虑折叠状态，否则强制展开
          if (hasAsideContent) {
            isAsideCollapsed.value = asideDom.classList.contains("is-collapsed");
          } else {
            // 没有目录内容时，强制展开
            isAsideCollapsed.value = false;
            layoutDom.classList.remove("has-aside-collapse");
            asideDom.classList.remove("is-collapsed");
          }
        }
      }
    });
  });

  observer.observe(layoutDom, { attributes: true });
  if (asideDom) {
    observer.observe(asideDom, { attributes: true });
  }

  // 监听文档内容容器变化，添加过渡类
  const addTransitionClass = () => {
    const docDom = document.querySelector(".VPContent.has-sidebar");
    if (docDom && !docDom.classList.contains("sidebar-trigger-transition")) {
      docDom.classList.add("sidebar-trigger-transition");
    }
  };

  // 监听body子元素变化，处理路由切换场景
  const bodyObserver = new MutationObserver(() => {
    addTransitionClass();
    // 路由切换时重新检查是否有目录详情页且有内容
    const asideElement = document.querySelector(".aside");
    if (asideElement) {
      const outlineList = asideElement.querySelector(".VPDocOutlineItem.root");
      hasAside.value = outlineList !== null && outlineList.children.length > 0;
    } else {
      hasAside.value = false;
    }
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // 初始化调用添加过渡类
  addTransitionClass();

  // 返回清理函数
  return () => {
    observer.disconnect();
    bodyObserver.disconnect();
  };
};

// 计算图标旋转角度
const iconTransform = computed(() => ({
  transform: isCollapsed.value ? "rotate(180deg)" : "rotate(0deg)",
}));

// 计算 aside 图标旋转角度
const asideIconTransform = computed(() => ({
  transform: isAsideCollapsed.value ? "rotate(180deg)" : "rotate(0deg)",
}));

let cleanupObserver: (() => void) | null = null;

onMounted(async () => {
  await nextTick();

  // 初始化移动端检测
  checkMobile();
  window.addEventListener("resize", handleResize);

  // 监听鼠标移动，记录当前位置
  window.addEventListener("mousemove", handleMouseMove);

  // 监听键盘快捷键
  window.addEventListener("keydown", handleKeyboardShortcut);

  // 监听侧边栏状态变化
  cleanupObserver = observeSidebarState();

  // 检查是否有目录详情页且有内容
  const asideElement = document.querySelector(".aside");
  if (asideElement) {
    const outlineList = asideElement.querySelector(".VPDocOutlineItem.root");
    hasAside.value = outlineList !== null && outlineList.children.length > 0;
  } else {
    hasAside.value = false;
  }
});

/**
 * 处理鼠标移动，记录当前位置
 */
const handleMouseMove = (event: MouseEvent) => {
  lastMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
};

onUnmounted(() => {
  // 清理 resize 监听
  window.removeEventListener("resize", handleResize);
  if (resizeTimer) clearTimeout(resizeTimer);

  // 清理鼠标移动监听
  window.removeEventListener("mousemove", handleMouseMove);

  // 清理键盘快捷键监听
  window.removeEventListener("keydown", handleKeyboardShortcut);

  // 清理 MutationObserver
  if (cleanupObserver) cleanupObserver();
});
</script>

<template>
  <slot v-if="!isMobile" :isCollapsed :isActive :toggleSidebar :toggleAside :isAsideCollapsed>
    <!-- 侧边栏触发器 -->
    <button
      type="button"
      :class="['sidebar-trigger', { 'is-active': isActive, 'is-collapsed': isCollapsed }]"
      @click="toggleSidebar"
      @keydown="(e) => handleKeydown(e, 'sidebar')"
      :title="isCollapsed ? '展开侧边栏 (Ctrl+B)' : '折叠侧边栏 (Ctrl+B)'"
      :aria-label="isCollapsed ? '展开侧边栏 (Ctrl+B)' : '折叠侧边栏 (Ctrl+B)'"
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

    <!-- 目录详情页触发器 -->
    <button
      v-if="hasAside"
      type="button"
      :class="['aside-trigger', { 'is-active': isActive, 'is-collapsed': isAsideCollapsed }]"
      @click="toggleAside"
      @keydown="(e) => handleKeydown(e, 'aside')"
      :title="isAsideCollapsed ? '展开目录详情页 (Ctrl+G)' : '折叠目录详情页 (Ctrl+G)'"
      :aria-label="isAsideCollapsed ? '展开目录详情页 (Ctrl+G)' : '折叠目录详情页 (Ctrl+G)'"
      :aria-expanded="!isAsideCollapsed"
    >
      <span class="aside-trigger__icon" :style="asideIconTransform">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          display="inline-block"
          vertical-align="middle"
          min-width="1.2rem"
          width="1.2em"
          height="1.2em"
          aria-hidden="true"
        >
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h9m-9 4h16m0 0l-3-3m3 3l-3 3M4 16h9"/>
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
  transition: left .45s cubic-bezier(0.4, 0, 0.2, 1), all 0.3s ease;
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
  transition-duration: .45s;
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

/* 目录详情页触发器样式 */
.aside-trigger {
  position: fixed;
  top: calc(var(--vp-nav-height) + var(--sidebar-trigger-top-offset, 10px));
  right: calc(
    (100% - (var(--vp-layout-max-width) - 64px)) / 2 - 5px
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
  transition: right .45s cubic-bezier(0.4, 0, 0.2, 1), all 0.3s ease;
}

/* aside 折叠时，触发器移动到最右边 */
.Layout.has-aside-collapse .aside-trigger {
  right: 10px;
}

.aside-trigger:hover {
  background-color: transparent;
}

.aside-trigger:hover .aside-trigger__icon svg {
  color: var(--vp-c-black);
}

/* 夜间主题时 hover 图标为白色 */
:root.theme-night .aside-trigger:hover .aside-trigger__icon svg {
  color: var(--vp-c-white);
}

.aside-trigger:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.aside-trigger__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  user-select: none;
}

.aside-trigger__icon svg {
  width: 1.2em;
  height: 1.2em;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
}

/* 折叠状态时图标旋转 */
.aside-trigger.is-collapsed .aside-trigger__icon {
  transform: rotate(180deg);
}
</style>