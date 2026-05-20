<template>
  <div class="geogebra-container" ref="containerRef">
    <div 
      v-if="shouldLoad"
      ref="ggbElement" 
      class="geogebra-applet"
      :style="containerStyle"
    ></div>
    <div v-else class="geogebra-placeholder" :style="placeholderStyle" @click="handlePlaceholderClick">
      <div class="placeholder-icon">📐</div>
      <div class="placeholder-text">点击加载 GeoGebra</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onActivated, onDeactivated, onUnmounted } from 'vue';
import { isMobileUA } from '@utils/functions';

interface Props {
  /**
   * 本地 GGB 文件路径（必须放在 public 目录下）
   * 例如：/geogebra/文件名.ggb
   */
  url: string;
  /**
   * 宽度（默认 688px）
   */
  width?: number | string;
  /**
   * 高度（默认 600px）
   */
  height?: number;
  /**
   * 是否显示工具栏（默认 false）
   */
  showToolBar?: boolean;
  /**
   * 是否显示菜单栏（默认 false）
   */
  showMenuBar?: boolean;
  /**
   * 是否显示重置按钮（默认 true）
   */
  showResetIcon?: boolean;
  /**
   * 是否显示代数输入框（默认 false）
   */
  showAlgebraInput?: boolean;
  /**
   * 是否启用拖动（默认 true）
   */
  enableRightClick?: boolean;
  /**
   * 是否启用缩放（默认 true）
   */
  enableShiftDragZoom?: boolean;
  /**
   * 是否允许全屏（默认 true）
   */
  allowFullscreen?: boolean;
  /**
   * 是否启用标签拖动（默认 true）
   */
  enableLabelDrags?: boolean;
  /**
   * 是否显示缩放按钮（默认 false）
   */
  showZoomButtons?: boolean;
  /**
   * 应用程序名称（默认 "classic"）
   * 可选: "graphing" | "geometry" | "3d" | "classic" | "suite"
   */
  appName?: string;
  /**
   * 边框颜色（默认 "#FFFFFF"）
   */
  borderColor?: string;
  /**
   * 边框圆角（默认 8）
   */
  borderRadius?: number;
  /**
   * 语言（默认 "zh_CN"）
   */
  language?: string;
  /**
   * 用于缩放容器的 CSS 类名
   */
  scaleContainerClass?: string;
  /**
   * 是否自动计算高度（默认 false）
   */
  autoHeight?: boolean;
  /**
   * 缩放比例（默认 1）
   */
  scale?: number;
  /**
   * 是否显示动画按钮（默认 true）
   */
  showAnimationButton?: boolean;
  /**
   * 是否自动调整视图以显示所有对象（默认 false）
   */
  showAllObjects?: boolean;
  /**
   * 是否将视图居中到原点 (0, 0)（默认 true）
   */
  centerAtOrigin?: boolean;
  /**
   * 坐标轴比例 [xRatio, yRatio]（可选，例如 [1, 2] 表示 x轴缩放1倍，y轴缩放2倍）
   */
  axisRatio?: [number, number];
  /**
   * 将视图居中到指定点 [x, y]（可选，例如 [0, 0]）
   */
  centerPoint?: [number, number];
  /**
   * 是否隐藏侧边栏（代数视图等，只显示图形视图（默认 true）
   */
  hideSidebar?: boolean;
  /**
   * 是否自动开始播放动画（默认 false，初始状态停止）
   */
  autoStart?: boolean;
  /**
   * 是否懒加载（默认 true）
   */
  lazy?: boolean;
  /**
   * 预加载距离（默认 200px）
   */
  preloadMargin?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 688,
  height: 600,
  showToolBar: false,
  showMenuBar: false,
  showResetIcon: true,
  showAlgebraInput: false,
  enableRightClick: true,
  enableShiftDragZoom: true,
  allowFullscreen: true,
  enableLabelDrags: true,
  showZoomButtons: false,
  appName: 'classic',
  borderColor: '#FFFFFF',
  borderRadius: 8,
  language: 'zh_CN',
  scaleContainerClass: '',
  autoHeight: false,
  scale: 1,
  showAnimationButton: true,
  showAllObjects: false,
  centerAtOrigin: true,
  axisRatio: [1, 1],
  hideSidebar: true,
  autoStart: false,
  lazy: undefined,
  preloadMargin: '200px',
});

// 计算实际是否启用懒加载
const shouldUseLazy = computed(() => {
  if (props.lazy !== undefined) {
    return props.lazy;
  }
  // 默认：移动端懒加载，桌面端直接加载
  return isMobileUA();
});

const containerRef = ref<HTMLElement | null>(null);
const ggbElement = ref<HTMLElement | null>(null);
const isInited = ref(false);
const shouldLoad = ref(false);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;
let appletInstance: any = null;

// 检测是否是移动设备
const isMobile = isMobileUA();

// 全局队列和状态管理
const globalState = {
  isScriptLoading: false,
  initQueue: [] as Array<() => void>,
  activeInstances: 0,
  maxConcurrentInstances: isMobile ? 2 : 3, // 移动端最多同时加载2个，桌面端3个
};

/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const style: Record<string, any> = {};
  
  if (typeof props.width === 'number') {
    style.width = `${props.width}px`;
  } else {
    style.width = props.width;
  }
  
  return style;
});

/**
 * 占位符样式
 */
const placeholderStyle = computed(() => {
  const style: Record<string, any> = {};
  
  if (typeof props.width === 'number') {
    style.width = `${props.width}px`;
  } else {
    style.width = props.width;
  }
  
  if (props.height) {
    style.height = `${props.height}px`;
  }
  
  return style;
});

/**
 * 从队列中处理初始化
 */
const processQueue = () => {
  if (globalState.initQueue.length === 0) return;
  if (globalState.activeInstances >= globalState.maxConcurrentInstances) return;
  
  const nextInit = globalState.initQueue.shift();
  if (nextInit) {
    globalState.activeInstances++;
    nextInit();
  }
};

/**
 * 完成初始化，释放队列位置
 */
const completeInit = () => {
  globalState.activeInstances = Math.max(0, globalState.activeInstances - 1);
  processQueue();
};

/**
 * 加载 GeoGebra API
 */
const loadGeoGebraAPI = async () => {
  if (typeof window === 'undefined') return;
  
  // 如果脚本正在加载，加入队列等待
  if (globalState.isScriptLoading) {
    return new Promise<void>((resolve) => {
      globalState.initQueue.push(() => {
        initGeoGebra().finally(() => {
          completeInit();
          resolve();
        });
      });
    });
  }
  
  // 检查是否已加载 API
  if (!(window as any).GGBApplet) {
    globalState.isScriptLoading = true;
    
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://www.geogebra.org/apps/deployggb.js';
      script.async = true;
      
      script.onload = () => {
        globalState.isScriptLoading = false;
        initGeoGebra().finally(() => {
          completeInit();
          resolve();
        });
        // 处理队列中等待的其他组件
        processQueue();
      };
      
      script.onerror = () => {
        globalState.isScriptLoading = false;
        console.error('Failed to load GeoGebra script');
        completeInit();
        resolve();
      };
      
      document.head.appendChild(script);
    });
  } else {
    // 检查并发限制
    if (globalState.activeInstances >= globalState.maxConcurrentInstances) {
      return new Promise<void>((resolve) => {
        globalState.initQueue.push(() => {
          initGeoGebra().finally(() => {
            completeInit();
            resolve();
          });
        });
      });
    }
    
    globalState.activeInstances++;
    return initGeoGebra().finally(completeInit);
  }
};

/**
 * 初始化 GeoGebra
 */
const initGeoGebra = async () => {
  await nextTick();
  if (!ggbElement.value || typeof window === 'undefined') return;
  
  const GGBApplet = (window as any).GGBApplet;
  if (!GGBApplet) return;

  // 清除可能存在的旧内容
  if (isInited.value && ggbElement.value) {
    ggbElement.value.innerHTML = '';
  }

  // 给容器添加一个唯一 ID
  const elementId = `geogebra-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  ggbElement.value.id = elementId;

  const parameters = {
    appName: props.appName,
    width: typeof props.width === 'number' ? props.width : 800,
    height: typeof props.height === 'number' ? props.height : 600,
    showToolBar: props.showToolBar,
    showMenuBar: props.showMenuBar,
    showResetIcon: props.showResetIcon,
    showAlgebraInput: props.showAlgebraInput,
    enableRightClick: props.enableRightClick,
    enableShiftDragZoom: props.enableShiftDragZoom,
    showFullscreenButton: props.allowFullscreen,
    enableLabelDrags: props.enableLabelDrags,
    showZoomButtons: props.showZoomButtons,
    borderColor: props.borderColor,
    borderRadius: props.borderRadius,
    language: props.language,
    autoScale: true,
    filename: props.url,
    errorDialogsActive: true,
    scaleContainerClass: props.scaleContainerClass,
    autoHeight: props.autoHeight,
    scale: props.scale,
    showAnimationButton: props.showAnimationButton,
    appletOnLoad: (api: any) => {
      appletInstance = api;
      
      if (props.hideSidebar) {
        api.evalCommand('SetPerspective("G")');
      }
      
      if (props.showAllObjects) {
        api.showAllObjects();
      }
      
      if (props.centerAtOrigin) {
        api.evalCommand('CenterView((0, 0))');
      }
      
      if (props.centerPoint) {
        api.evalCommand(`CenterView((${props.centerPoint[0]}, ${props.centerPoint[1]}))`);
      }
      
      if (props.scale !== 1) {
        api.evalCommand(`ZoomIn(${props.scale})`);
      }
      
      if (props.axisRatio) {
        api.evalCommand(`SetAxesRatio(${props.axisRatio[0]}, ${props.axisRatio[1]})`);
      }
      
      if (!props.autoStart) {
        api.stopAnimation();
      }
    }
  };

  appletInstance = new GGBApplet(parameters, true);
  appletInstance.inject(elementId);
  isInited.value = true;
};

/**
 * 开始加载（懒加载触发时调用）
 */
const startLoading = () => {
  if (shouldLoad.value) return;
  shouldLoad.value = true;
  
  // 延迟一下确保DOM更新
  nextTick(() => {
    loadGeoGebraAPI();
  });
};

/**
 * 设置Intersection Observer实现懒加载
 */
const setupLazyLoad = () => {
  if (typeof window === 'undefined' || !containerRef.value) return;
  if (!shouldUseLazy.value) {
    startLoading();
    return;
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        startLoading();
        // 加载后停止观察
        if (observer && containerRef.value) {
          observer.unobserve(containerRef.value);
        }
      }
    });
  }, {
    rootMargin: props.preloadMargin,
    threshold: 0.01,
  });
  
  observer.observe(containerRef.value);
};

/**
 * 点击占位符手动加载
 */
const handlePlaceholderClick = () => {
  startLoading();
};

onMounted(() => {
  setupLazyLoad();
});

onActivated(() => {
  // 页面重新激活时，如果已经可见则重新加载
  if (shouldLoad.value && isVisible.value) {
    isInited.value = false;
    if (ggbElement.value) {
      ggbElement.value.innerHTML = '';
    }
    loadGeoGebraAPI();
  }
});

onDeactivated(() => {
  // 页面失活时清理
  isInited.value = false;
  if (appletInstance) {
    try {
      appletInstance.remove();
    } catch (e) {
      // 忽略错误
    }
    appletInstance = null;
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (appletInstance) {
    try {
      appletInstance.remove();
    } catch (e) {
      // 忽略错误
    }
    appletInstance = null;
  }
});

watch(() => props.url, () => {
  if (shouldLoad.value) {
    isInited.value = false;
    if (ggbElement.value) {
      ggbElement.value.innerHTML = '';
    }
    loadGeoGebraAPI();
  }
});
</script>

<style scoped>
.geogebra-container {
  margin: 1.5rem 0;
}

.geogebra-applet {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.geogebra-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.geogebra-placeholder:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #e4e8ec 0%, #b3c4d2 100%);
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.placeholder-text {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}
</style>
