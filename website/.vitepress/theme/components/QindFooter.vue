<!-- .vitepress/theme/components/MyFooter.vue -->
<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()
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

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>