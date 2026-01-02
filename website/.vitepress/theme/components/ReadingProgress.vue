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
    <i class="fa fa-arrow-up"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 进度条元素引用
const progressBar = ref<HTMLElement | null>(null)
// 返回顶部按钮引用
const backToTopBtn = ref<HTMLButtonElement | null>(null)

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

// 滚动事件处理
const handleScroll = () => {
  updateProgress()
  updateBackToTopBtn()
}

// 组件挂载时添加事件监听器
onMounted(() => {
  // 初始更新
  updateProgress()
  updateBackToTopBtn()
  
  // 添加滚动事件监听器
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
