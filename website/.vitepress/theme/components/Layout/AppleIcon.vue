<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const isApple = ref(false)

/**
 * 在 Apple 设备上为博客标题添加 Apple 图标
 */
const addAppleIcon = () => {
  // 尝试多个可能的选择器来找到 hero 名称
  const selectors = [
    '.VPHero .name',
    '.hero .name',
    '.VPHero h1.name',
    'h1.name'
  ]
  
  let heroName: HTMLElement | null = null
  
  // 逐个尝试选择器
  for (const selector of selectors) {
    heroName = document.querySelector(selector)
    if (heroName) break
  }
  
  if (heroName && !heroName.querySelector('.apple-icon')) {
    const appleIcon = document.createElement('span')
    appleIcon.className = 'apple-icon'
    appleIcon.textContent = '\uF8FF'
    appleIcon.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    appleIcon.style.marginLeft = '4px'
    appleIcon.style.fontSize = '0.9em'
    heroName.appendChild(appleIcon)
  }
}

onMounted(async () => {
  isApple.value = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
  
  if (isApple.value) {
    // 等待 DOM 完全更新
    await nextTick()
    
    // 立即尝试一次
    addAppleIcon()
    
    // 延迟再次尝试，确保 hero 组件已经渲染
    setTimeout(addAppleIcon, 100)
    setTimeout(addAppleIcon, 500)
  }
})
</script>

<template>
  <!-- 空组件，通过 DOM 操作实现功能 -->
</template>
