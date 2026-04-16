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

// 进度条元素引用
const progressBar = ref<HTMLElement | null>(null)
// 返回顶部按钮引用
const backToTopBtn = ref<HTMLButtonElement | null>(null)

// RAF ID 用于取消动画帧
let rafId: number | null = null
// 上次滚动位置
let lastScrollTop = 0

// 使用 requestAnimationFrame 优化滚动事件处理
const handleScroll = () => {
  // 如果已经有待执行的动画帧，则取消
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
  
  // 使用 requestAnimationFrame 确保在浏览器渲染周期内执行
  rafId = requestAnimationFrame(() => {
    // 获取当前滚动位置
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    // 如果滚动位置没有变化，不更新
    if (scrollTop === lastScrollTop) {
      return
    }
    lastScrollTop = scrollTop
    
    // 更新进度条
    updateProgress()
    
    // 更新返回顶部按钮
    updateBackToTopBtn()
    
    // 重置 RAF ID
    rafId = null
  })
}

// 更新阅读进度条
const updateProgress = () => {
  if (!progressBar.value) return
  
  // 获取文档总高度
  const docHeight = document.documentElement.scrollHeight
  // 获取窗口高度
  const windowHeight = window.innerHeight
  // 获取滚动距离
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  // 计算滚动百分比
  const scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100
  
  // 更新进度条宽度
  progressBar.value.style.width = `${scrollPercent}%`
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 更新返回顶部按钮显示状态
const updateBackToTopBtn = () => {
  if (!backToTopBtn.value) return
  
  // 滚动超过500px时显示按钮
  if (window.scrollY > 500) {
    backToTopBtn.value.classList.add('visible')
  } else {
    backToTopBtn.value.classList.remove('visible')
  }
}

// 组件挂载时添加事件监听器
onMounted(() => {
  // 初始更新
  updateProgress()
  updateBackToTopBtn()
  
  // 添加滚动事件监听器，使用 passive 提高滚动性能
  window.addEventListener('scroll', handleScroll, { passive: true })
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 取消任何待执行的动画帧
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>