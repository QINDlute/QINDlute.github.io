<template>
  <div class="geogebra-container">
    <div 
      ref="ggbElement" 
      class="geogebra-applet"
      :style="containerStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onActivated, onDeactivated } from 'vue';

interface Props {
  /**
   * 本地 GGB 文件路径（必须放在 public 目录下）
   * 例如：/geogebra/文件名.ggb
   */
  url: string;
  /**
   * 宽度（默认 800px）
   */
  width?: number | string;
  /**
   * 高度（默认 600px）
   */
  height?: number;
  /**
   * 是否显示工具栏（默认 true）
   */
  showToolBar?: boolean;
  /**
   * 是否显示菜单栏（默认 false）
   */
  showMenuBar?: boolean;
  /**
   * 是否显示重置按钮（默认 false）
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
   * 是否显示动画按钮（默认 false）
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
   * 将视图居中到指定点 [x, y]（可选，例如 [0, 0]）
   */
  centerPoint?: [number, number];
  /**
   * 是否隐藏侧边栏（代数视图等，只显示图形视图（默认 false）
   */
  hideSidebar?: boolean;
  /**
   * 是否自动开始播放动画（默认 false，初始状态停止）
   */
  autoStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 688,
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
  hideSidebar: true,
  autoStart: false,
});

const ggbElement = ref<HTMLElement | null>(null);
const isInited = ref(false);

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
 * 加载 GeoGebra API
 */
const loadGeoGebraAPI = async () => {
  if (typeof window === 'undefined') return;
  
  // 确保DOM元素存在
  await nextTick();
  if (!ggbElement.value) return;
  
  // 检查是否已加载 API
  if (!(window as any).GGBApplet) {
    const script = document.createElement('script');
    script.src = 'https://www.geogebra.org/apps/deployggb.js';
    script.async = true;
    script.onload = initGeoGebra;
    document.head.appendChild(script);
  } else {
    initGeoGebra();
  }
};

/**
 * 初始化 GeoGebra
 */
const initGeoGebra = async () => {
  // 确保DOM元素存在
  await nextTick();
  if (!ggbElement.value || typeof window === 'undefined') return;
  
  const GGBApplet = (window as any).GGBApplet;
  if (!GGBApplet) return;

  // 清除可能存在的旧内容
  if (isInited.value && ggbElement.value) {
    ggbElement.value.innerHTML = '';
  }

  // 给容器添加一个唯一 ID
  if (!ggbElement.value.id) {
    ggbElement.value.id = `geogebra-${Date.now()}`;
  }

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
      
      if (!props.autoStart) {
        api.stopAnimation();
      }
    }
  };

  const applet = new GGBApplet(parameters, true);
  applet.inject(ggbElement.value.id);
  isInited.value = true;
};

onMounted(() => {
  loadGeoGebraAPI();
});

onActivated(() => {
  // 页面重新激活时重新初始化
  isInited.value = false;
  if (ggbElement.value) {
    ggbElement.value.innerHTML = '';
  }
  loadGeoGebraAPI();
});

onDeactivated(() => {
  // 页面失活时清理内容
  isInited.value = false;
});

watch(() => props.url, () => {
  isInited.value = false;
  if (ggbElement.value) {
    ggbElement.value.innerHTML = '';
  }
  loadGeoGebraAPI();
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
</style>
