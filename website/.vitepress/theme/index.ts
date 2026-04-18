// .vitepress/theme/index.ts
import { h, ref, provide, inject, type Ref } from 'vue'
import { onMounted, onUnmounted, watch, nextTick, onBeforeMount } from 'vue'

import { useRoute, useData, onContentUpdated } from 'vitepress'
import type { Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'
import './style.css'
import './style/index.scss'
import Layout from './Layout.vue'

import mediumZoom from 'medium-zoom'

import 'virtual:group-icons.css'
import "virtual:uno.css";

import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';

import codeblocksFold from 'vitepress-plugin-codeblocks-fold';
import 'vitepress-plugin-codeblocks-fold/style/index.css';

// 加载状态 key，用于 provide/inject
export const LoadingStateKey = Symbol('loading-state')

let homePageStyle: HTMLStyleElement | undefined
export default {
  extends: DefaultTheme,
  Layout: Layout,
  // 注册全局组件
  enhanceApp({ app, router}) {
    // 加载状态，初始为 true（显示加载动画）
    const isLoading = ref(true);
    // 提供加载状态给子组件
    app.provide(LoadingStateKey, isLoading);
    
    /**
     * 路由变化开始，立即显示加载动画
     */
    const handleRouteStart = () => {
      if (!isLoading.value) {
        isLoading.value = true;
      }
    };
    
    /**
     * 路由变化完成，延迟隐藏加载动画
     */
    const handleRouteComplete = () => {
      // 随机延迟 460-500ms 后隐藏加载动画（参考 teek）
      const delay = Math.floor(Math.random() * (500 - 460 + 1)) + 460;
      setTimeout(() => {
        if (isLoading.value) {
          isLoading.value = false;
        }
      }, delay);
    };
    
    // 保存原始的路由钩子
    const originalOnBeforeRouteChange = router.onBeforeRouteChange;
    const originalOnAfterRouteChange = router.onAfterRouteChange;
    
    // 路由变化前：显示加载动画
    router.onBeforeRouteChange = async (href: string) => {
      // 先调用原始的钩子
      if (originalOnBeforeRouteChange) {
        const result = await originalOnBeforeRouteChange(href);
        if (result === false) return false;
      }
      // 立即显示加载动画
      handleRouteStart();
      return true;
    };
    
    // 路由变化后：隐藏加载动画
    router.onAfterRouteChange = async (href: string) => {
      // 先调用原始的钩子
      if (originalOnAfterRouteChange) {
        await originalOnAfterRouteChange(href);
      }
      // 延迟隐藏加载动画
      handleRouteComplete();
    };
    
    // 初始加载时，0.5秒后隐藏加载动画
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
    
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

  setup() {
    // 监听路由变化
    const route = useRoute();
    const { frontmatter } = useData();
    
    // 注入加载状态
    const isLoading = inject<Ref<boolean>>(LoadingStateKey);
    
    // 内容更新后隐藏加载动画（关键！）
    onContentUpdated(() => {
      if (isLoading && isLoading.value) {
        // 随机延迟 460-500ms 后隐藏加载动画
        const delay = Math.floor(Math.random() * (500 - 460 + 1)) + 460;
        setTimeout(() => {
          if (isLoading.value) {
            isLoading.value = false;
          }
        }, delay);
      }
    });
    
    // 初始化代码块折叠功能，作用于所有代码块
    codeblocksFold({ route, frontmatter }, true, 500);
    
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
      '/essays/',
      '/study/',
      '/test/',
      '/test',
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
      const hash = window.location.hash;
      
      // 如果当前路径在排除列表中，不恢复滚动位置
      if (shouldExcludeScrollMemory(currentPath)) {
        return;
      }
      
      console.log('恢复滚动位置:', { currentPath, hash });
      
      // 延迟执行，确保页面内容已经显示
      setTimeout(() => {
        console.log('执行滚动操作，当前URL:', window.location.href);
        
        nextTick(() => {
          // 如果URL包含锚点，优先滚动到锚点
          if (hash) {
            console.log('检测到锚点:', hash);
            try {
              // 对URL编码的锚点进行解码
              const decodedHash = decodeURIComponent(hash);
              console.log('解码后的锚点:', decodedHash);
              
              // 尝试使用解码后的锚点
              let element = document.querySelector(decodedHash);
              console.log('找到锚点元素:', element);
              
              if (element) {
                console.log('滚动到锚点元素');
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              } else {
                console.log('未找到锚点元素');
                // 尝试使用更宽松的选择器
                const normalizedHash = hash.replace(/^#/, '').replace(/[^a-zA-Z0-9_-]/g, '');
                const fallbackElement = document.querySelector(`[id*="${normalizedHash}"]`);
                console.log('尝试宽松匹配:', normalizedHash, '结果:', fallbackElement);
                if (fallbackElement) {
                  fallbackElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }
            } catch (error) {
              console.error('锚点滚动失败:', error);
              // 尝试使用更宽松的选择器
              const normalizedHash = hash.replace(/^#/, '').replace(/[^a-zA-Z0-9_-]/g, '');
              const fallbackElement = document.querySelector(`[id*="${normalizedHash}"]`);
              console.log('尝试宽松匹配:', normalizedHash, '结果:', fallbackElement);
              if (fallbackElement) {
                fallbackElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }
          } else {
            // 否则恢复之前的滚动位置
            let targetScrollTop = 0;
            try {
              if (typeof window !== 'undefined' && localStorage) {
                const scrollPosMap = JSON.parse(window.localStorage.getItem(scrollPosKey) || '{}');
                targetScrollTop = scrollPosMap[currentPath] || 0;
              }
            } catch (e) {
              console.warn('恢复滚动位置失败', e);
            }
            
            console.log('恢复滚动位置:', targetScrollTop);
            window.scrollTo({
              top: targetScrollTop,
              behavior: 'instant'
            });
          }
          // 触发scroll事件，更新进度条
          window.dispatchEvent(new Event('scroll'));
        });
      }, 500); // 增加延迟到 500ms，确保页面内容完全显示
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
