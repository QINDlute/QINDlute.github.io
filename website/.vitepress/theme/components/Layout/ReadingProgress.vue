<template>
  <!-- 阅读进度条 -->
  <div id="reading-progress" ref="progressBar"></div>

  <!-- 返回顶部按钮 -->
  <button
    id="back-to-top"
    ref="backToTopBtn"
    @click="scrollToTop"
    aria-label="返回顶部"
  >
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progressBar = ref<HTMLElement | null>(null)
const backToTopBtn = ref<HTMLButtonElement | null>(null)
let scrollContainer: HTMLElement | null = null

/**
 * 更新阅读进度条
 */
const updateProgress = () => {
  if (!progressBar.value || !scrollContainer) return

  const scrollTop = scrollContainer.scrollTop
  const scrollHeight = scrollContainer.scrollHeight
  const clientHeight = scrollContainer.clientHeight
  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100

  progressBar.value.style.width = `${scrollPercent}%`
}

/**
 * 滚动到顶部
 */
const scrollToTop = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  if (!scrollContainer) return

  updatePerfectScrollbar()
  
  const startPosition = scrollContainer.scrollTop
  const startTime = performance.now()
  const duration = 500

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = easeOutCubic(progress)

    scrollContainer!.scrollTop = startPosition * (1 - easeProgress)
    updatePerfectScrollbar()

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

/**
 * 更新 perfect-scrollbar 实例（使滑块位置与 scrollTop 同步）
 */
const updatePerfectScrollbar = () => {
  if (typeof window !== 'undefined') {
    const psInstances = (window as any).vitepressPsInstances
    if (psInstances && psInstances.length > 0) {
      psInstances.forEach((ps: any) => ps.update())
    }
  }
}

/**
 * 更新返回顶部按钮显示状态
 */
const updateBackToTopBtn = () => {
  if (!backToTopBtn.value || !scrollContainer) return

  if (scrollContainer.scrollTop > 500) {
    backToTopBtn.value.classList.add('visible')
  } else {
    backToTopBtn.value.classList.remove('visible')
  }
}

/**
 * 滚动事件处理
 */
const handleScroll = () => {
  updateProgress()
  updateBackToTopBtn()
  
  // 触发 window 的 scroll 事件，让 VitePress 的大纲高亮逻辑生效
  window.dispatchEvent(new Event('scroll'))
}

/**
 * 初始化滚动容器
 */
const initScrollContainer = () => {
  scrollContainer = document.querySelector('.has-sidebar-trigger') as HTMLElement
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
}

onMounted(() => {
  initScrollContainer()
  
  // 覆盖 window.scrollY，让 VitePress 的大纲高亮逻辑能获取到正确的滚动位置
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollY', {
      get: () => {
        if (scrollContainer) {
          return scrollContainer.scrollTop
        }
        return 0
      }
    })
  }
})

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})
</script>
