// .vitepress/theme/index.ts
import { h } from 'vue'
import { onMounted, onUnmounted, watch, nextTick } from 'vue'

import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'
import './style.css'
import './style/index.scss'

import FontSettingsPlugin from './components/FontSettingsPlugin.vue'
import ReadingProgress from './components/ReadingProgress.vue'

import TextSelectionMenu from './components/TextSelectionMenu.vue'
import AnnotationRenderer from './components/AnnotationRenderer.vue'

import ClickHearts from './components/ClickHearts.vue'
import SnowEffect from './components/SnowEffect.vue'

import mediumZoom from 'medium-zoom'

import 'virtual:group-icons.css'
import "virtual:uno.css";

import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';


let homePageStyle: HTMLStyleElement | undefined
export default {
  extends: DefaultTheme,
  // 注册全局组件
  enhanceApp({ app, router}) {
    // 彩虹背景动画样式
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'),
        // () => updateHomePageStyle(true),
        { immediate: true },
      )
    }
    // 添加全局方法
    app.config.globalProperties.$copyText = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.error('复制失败:', err)
        return false
      }
    }
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 将字体设置插件挂载到导航栏内容之前
      'nav-bar-content-after': () => h(FontSettingsPlugin),
      // 挂载到页面底部
      'layout-bottom': () => [
        h(ReadingProgress),
        h(TextSelectionMenu),
        h(AnnotationRenderer),
        h(SnowEffect),
      ],
      'layout-top': () => [
        h(ClickHearts),
      ],
    })
  },
  setup() {
    // 监听路由变化
    const route = useRoute();
    
    // 初始化图片缩放
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    
    // 滚动位置记忆功能
    const scrollPosKey = 'vitepress_page_scroll_pos';
    
    // 配置：不使用滚动记忆功能的路径列表
    // 支持精确匹配和前缀匹配（以/结尾）
    const scrollMemoryExcludes: string[] = [
      // '/exact-path',          // 精确匹配单个页面
      // '/articles/category/',   // 匹配该目录下所有页面
      '/essays/poetry/',
      '/essays/ci/'
    ];
    
    // 配置：允许使用文本标注功能的路径列表
    const allowedAnnotationPaths: string[] = [
      '/others/',
      '/test',
      '/test/'
    ];
    
    // 配置：允许跨标签选择文本的元素列表
    const allowedCrossElements: string[] = [
      'CODE',
      'PRE',
      'LI',
      'P'
    ];
    
    // 暴露配置到全局，便于其他组件访问
    if (typeof window !== 'undefined') {
      (window as any).vitepressThemeConfig = {
        scrollMemoryExcludes,
        allowedAnnotationPaths,
        allowedCrossElements
      };
    }
    
    // 检查当前路径是否需要排除滚动记忆
    const shouldExcludeScrollMemory = (path: string) => {
      return scrollMemoryExcludes.some(excludePath => {
        if (excludePath.endsWith('/')) {
          // 前缀匹配
          return path.startsWith(excludePath);
        }
        // 精确匹配
        return path === excludePath;
      });
    };
    
    // 记录滚动位置
    const recordScrollPos = () => {
      if (typeof window === 'undefined') return;
      
      const currentPath = window.location.pathname;
      
      // 如果当前路径在排除列表中，不记录滚动位置
      if (shouldExcludeScrollMemory(currentPath)) {
        return;
      }
      
      try {
        if (typeof window !== 'undefined' && localStorage) {
          const scrollTop = window.scrollY;
          const scrollPosMap = JSON.parse(window.localStorage.getItem(scrollPosKey) || '{}');
          scrollPosMap[currentPath] = scrollTop;
          window.localStorage.setItem(scrollPosKey, JSON.stringify(scrollPosMap));
        }
      } catch (e) {
        console.warn('保存滚动位置失败', e);
      }
    };
    
    // 恢复滚动位置
    const restoreScrollPos = () => {
      if (typeof window === 'undefined') return;
      
      const currentPath = window.location.pathname;
      
      // 如果当前路径在排除列表中，不恢复滚动位置
      if (shouldExcludeScrollMemory(currentPath)) {
        return;
      }
      
      let targetScrollTop = 0;
      try {
        if (typeof window !== 'undefined' && localStorage) {
          const scrollPosMap = JSON.parse(window.localStorage.getItem(scrollPosKey) || '{}');
          targetScrollTop = scrollPosMap[currentPath] || 0;
        }
      } catch (e) {
        console.warn('恢复滚动位置失败', e);
      }
      
      nextTick(() => {
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'instant'
        });
        // 触发scroll事件，更新进度条
        window.dispatchEvent(new Event('scroll'));
      });
    };
    
    // 初始化FAQ折叠面板
    const initFaqToggle = () => {
      if (typeof window === 'undefined') return;
      
      // 查找所有.faq-container元素，支持多个容器
      const faqContainers = document.querySelectorAll(".faq-container");
      faqContainers.forEach((faqContainer) => {
        const toggles = faqContainer.querySelectorAll(".faq-toggle");
        toggles.forEach((toggle) => {
          // 移除可能存在的旧事件监听器，避免重复绑定
          toggle.removeEventListener('click', toggleFaq);
          toggle.addEventListener("click", toggleFaq);
        });
      });
      
      // 也支持没有.faq-container包裹的情况
      const standaloneFaqs = document.querySelectorAll(".faq:not(.faq-container .faq)");
      standaloneFaqs.forEach((faq) => {
        const toggle = faq.querySelector(".faq-toggle");
        if (toggle) {
          toggle.removeEventListener('click', toggleFaq);
          toggle.addEventListener("click", toggleFaq);
        }
      });
    };
    
    // FAQ点击切换函数
    const toggleFaq = function(this: HTMLElement) {
      this.parentNode?.classList.toggle("active");
    };
    
    onMounted(() => {
      // 初始化图片缩放
      initZoom();
      
      // 初始化FAQ折叠面板
      nextTick(() => {
        initFaqToggle();
      });
      
      // 滚动位置记忆 - 只在浏览器环境中执行
      if (typeof window !== 'undefined') {
        // 恢复滚动位置
        restoreScrollPos();
        
        // 添加滚动事件监听器
        window.addEventListener('scroll', recordScrollPos);
        
        // 监听页面卸载前保存滚动位置
        window.addEventListener('beforeunload', recordScrollPos);
      }
    });
    
    onUnmounted(() => {
      // 清理事件监听器
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', recordScrollPos);
        window.removeEventListener('beforeunload', recordScrollPos);
      }
    });
    
    watch(
      () => route.path,
      () => {
        nextTick(() => {
          initZoom();
          restoreScrollPos();
          // 路由变化时重新初始化FAQ折叠面板
          initFaqToggle();
        });
      }
    );
  },
} satisfies Theme

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}