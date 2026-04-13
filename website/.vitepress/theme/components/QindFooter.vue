<!-- .vitepress/theme/components/MyFooter.vue -->
<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'
import { onMounted, ref } from 'vue'

const { hasSidebar } = useSidebar()

/**
 * 存储不蒜子统计数据
 */
const siteUv = ref<string>('--')
const pagePv = ref<string>('--')

/**
 * 从不蒜子 API 获取统计数据
 */
const fetchBusuanziData = async () => {
  try {
    const response = await fetch('https://cdn.busuanzi.cc/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: window.location.href,
        referrer: document.referrer
      })
    })
    const data = await response.json()
    siteUv.value = data.busuanzi_site_uv || '0'
    pagePv.value = data.busuanzi_page_pv || '0'
  } catch (error) {
    console.error('获取不蒜子数据失败:', error)
    siteUv.value = '0'
    pagePv.value = '0'
  }
}

/**
 * 生成 shields.io 静态徽章 URL
 */
const getBadgeUrl = (label: string, value: string) => {
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-pink`
}

onMounted(() => {
  fetchBusuanziData()
})
</script>

<template>
  <footer class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
      <div class="footer-image">
        <div class="footer-image-glow-wrapper">
          <img src="/img/footer/image.gif" alt="" class="footer-image-glow" aria-hidden="true" />
        </div>
        <img src="/img/footer/image.gif" alt="Footer Image" />
      </div>
      
      <!-- 统计徽章区域 -->
      <div class="stats-badges">
        <!-- 访问量徽章 - shields.io 静态徽章 -->
        <img
          :src="getBadgeUrl('clicks', pagePv)"
          alt="clicks badge"
          class="badge-img"
        />

        <!-- 访客数徽章 - shields.io 静态徽章 -->
        <img
          :src="getBadgeUrl('visits', siteUv)"
          alt="visits badge"
          class="badge-img"
        />
      </div>
      
      <p class="message">qindlute's notes</p>
      <p class="copyright">Copyright © 2025-2026 qindlute</p>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

.VPFooter :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.VPFooter :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.footer-image {
  position: relative;
  margin-bottom: 16px;
  text-align: center;
}

.footer-image img {
  max-width: 100%;
  height: auto;
  display: inline-block;
  transition: box-shadow 0.3s ease;
}

/* 发光层包装器 - 用于裁剪溢出的发光 */
.footer-image-glow-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  opacity: 0;
  overflow: hidden;
  /* 比原图稍大，给发光留出空间 */
  width: calc(100% + 40px);
  height: calc(100% + 80px);
  /* 强制GPU层，确保每帧重绘 */
  will-change: transform;
}

.dark .footer-image-glow-wrapper {
  opacity: 0.8;
}

/* 底层发光层 */
.footer-image-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100% - 40px);
  height: auto;
  pointer-events: none;
  filter: 
    blur(8px) 
    drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) 
    drop-shadow(0 0 16px rgba(255, 255, 255, 0.5));
  /* 强制每帧重绘 */
  animation: glowRefresh 0.05s infinite;
}

/* 微动画强制发光层每帧重绘，解决drop-shadow残影问题 */
@keyframes glowRefresh {
  0%, 100% {
    filter: 
      blur(8px) 
      drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) 
      drop-shadow(0 0 16px rgba(255, 255, 255, 0.5));
  }
  50% {
    filter: 
      blur(8.01px) 
      drop-shadow(0 0 8.01px rgba(255, 255, 255, 0.7)) 
      drop-shadow(0 0 16.01px rgba(255, 255, 255, 0.5));
  }
}

.stats-badges {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>