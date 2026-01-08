import { h } from 'vue'
import { onMounted, onUnmounted, watch, nextTick } from 'vue'

import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'


import DefaultTheme from 'vitepress/theme'
import './style.css'
import './markdown_styles.css'
import './style/index.scss'

import FontSettingsPlugin from './components/FontSettingsPlugin.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ArchiveCount from './components/ArchiveCount.vue'
import ArticleMetadata from './components/ArticleMetadata.vue'
import CustomButton from './components/CustomButton.vue'

import mediumZoom from 'medium-zoom'

import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  // 注册全局组件
  enhanceApp({ app }) {
    app.component('ArchiveCount', ArchiveCount)
    app.component('ArticleMetadata', ArticleMetadata)
    app.component('CustomButton', CustomButton)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 将字体设置插件挂载到导航栏内容之后
      'nav-bar-content-after': () => h(FontSettingsPlugin),
      // 阅读进度条继续挂载到页面底部
      'layout-bottom': () => h(ReadingProgress)
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
    
    // 记录滚动位置
    const recordScrollPos = () => {
      if (typeof window === 'undefined') return;
      
      const currentPath = window.location.pathname;
      const scrollTop = window.scrollY;
      const scrollPosMap = JSON.parse(window.localStorage.getItem(scrollPosKey) || '{}');
      scrollPosMap[currentPath] = scrollTop;
      window.localStorage.setItem(scrollPosKey, JSON.stringify(scrollPosMap));
    };
    
    // 恢复滚动位置
    const restoreScrollPos = () => {
      if (typeof window === 'undefined') return;
      
      const currentPath = window.location.pathname;
      const scrollPosMap = JSON.parse(window.localStorage.getItem(scrollPosKey) || '{}');
      const targetScrollTop = scrollPosMap[currentPath] || 0;
      
      nextTick(() => {
        window.scrollTo({
          top: targetScrollTop,
          behavior: 'instant'
        });
        // 触发scroll事件，更新进度条
        window.dispatchEvent(new Event('scroll'));
      });
    };
    
    onMounted(() => {
      // 初始化图片缩放
      initZoom();
      
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
        });
      }
    );
  },
} satisfies Theme
