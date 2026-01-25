<!-- .vitepress/theme/components/ClickHearts.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const clickCount = ref(0)

// ========== 随机表情数据 ==========
const randomEmojis = [
  '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏',
  '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟',
  '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯',
  '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿'
].slice(0, 62)

// ========== 爱心效果逻辑 ==========
const getEmojiByCount = (count: number): string => {
  // 如果小于等于105，按原逻辑处理（包含100-105的愤怒表情）
  if (count <= 105) {
    switch(count) {
      case 10: return "OωO"
      case 20: return "(๑•́ ∀ •̀๑)"
      case 30: return "(๑•́ ₃ •̀๑)"
      case 40: return "(๑•̀_•́๑)"
      case 50: return "（￣へ￣）"
      case 60: return "(╯°口°)╯(┴—┴"
      case 70: return "૮( ᵒ̌皿ᵒ̌ )ა"
      case 80: return "╮(｡>口<｡)╭"
      case 90: return "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃"
      case 100:
      case 101:
      case 102:
      case 103:
      case 104:
      case 105:
        return "(ꐦ°᷄д°᷅)"
      default:
        return "❤"
    }
  }
  
  // 105次之后，开始新循环
  const cycleEmojis = [
    "OωO",
    "(๑•́ ∀ •̀๑)", 
    "(๑•́ ₃ •̀๑)",
    "(๑•̀_•́๑)",
    "（￣へ￣）",
    "(╯°口°)╯(┴—┴",
    "૮( ᵒ̌皿ᵒ̌ )ა",
    "╮(｡>口<｡)╭",
    "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃"
  ]
  const relativeCount = count - 106
  if (relativeCount >= 10 && (relativeCount - 10) % 10 === 0) {
    const index = Math.floor((relativeCount - 10) / 10) % cycleEmojis.length
    return cycleEmojis[index]
  }
  return "❤"
}

// ========== 创建爱心效果 ==========
const createHeartEffect = (x: number, y: number): void => {
  clickCount.value++
  const currentCount = clickCount.value
  
  const emoji = getEmojiByCount(currentCount)
  const size = emoji === "❤" ? Math.round(Math.random() * 14 + 6) : 18
  
  // 创建元素
  const heart = document.createElement('span')
  heart.textContent = emoji
  
  // 设置初始样式
  heart.style.cssText = `
    position: fixed;
    z-index: 99999;
    color: #E94F06;
    font-weight: bold;
    font-family: Arial, sans-serif;
    font-size: ${size}px;
    pointer-events: none;
    user-select: none;
    opacity: 1;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -50%);
    will-change: transform, opacity;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  `
  
  document.body.appendChild(heart)
  
  // 动画效果
  const animationDuration = 1500
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    
    // 向上移动并淡出
    const translateY = -20 - (progress * 160) // 从-20px到-180px
    const opacity = 1 - progress
    
    heart.style.transform = `translate(-50%, ${translateY}px)`
    heart.style.opacity = `${opacity}`
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 动画完成，移除元素
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart)
      }
    }
  }
  
  requestAnimationFrame(animate)
}

// ========== 创建随机表情效果 ==========
const createRandomEmojiEffect = (x: number, y: number): void => {
  // 检测是否为移动端
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  
  // 随机参数
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  const emoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)]
  // 移动端减小偏移量：-100 到 100，桌面端：-200 到 200
  const offsetRange = isMobile ? 200 : 400
  const xOffset = Math.floor(Math.random() * offsetRange) - offsetRange / 2
  const yOffset = Math.floor(Math.random() * offsetRange) - offsetRange / 2
  // 移动端缩小表情大小：18-26，桌面端：26-36
  const baseSize = isMobile ? 18 : 26
  const sizeRange = isMobile ? 8 : 10
  const size = Math.round(Math.random() * sizeRange + baseSize)
  
  // 创建元素
  const randomEmoji = document.createElement('span')
  randomEmoji.textContent = emoji
  randomEmoji.style.cssText = `
    position: fixed;
    z-index: 99999;
    color: ${color};
    font-weight: bold;
    font-size: ${size}px;
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
    user-select: none;
    opacity: 1;
    transform: translate(-50%, -50%);
    will-change: transform, opacity;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  `
  
  document.body.appendChild(randomEmoji)
  
  // 动画
  const animationDuration = 1000
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    
    // jQuery swing 缓动公式
    const easeIn = -Math.cos(progress * Math.PI) / 2 + 0.5
    
    // 计算当前位置
    const currentX = x + (xOffset * easeIn)
    const currentY = y + (yOffset * easeIn)
    const currentOpacity = 1 - easeIn
    
    randomEmoji.style.left = `${currentX}px`
    randomEmoji.style.top = `${currentY}px`
    randomEmoji.style.opacity = `${currentOpacity}`
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 动画完成，移除元素
      if (randomEmoji.parentNode) {
        randomEmoji.parentNode.removeChild(randomEmoji)
      }
    }
  }
  
  requestAnimationFrame(animate)
}

// ========== 统一点击处理 ==========
const handleClick = (event: MouseEvent): void => {
  const x = event.clientX
  const y = event.clientY
  
  // 同时触发两种效果
  createHeartEffect(x, y)
  createRandomEmojiEffect(x, y)
}

onMounted(() => {
  // 只在客户端执行
  if (typeof window === 'undefined') return
  
  // 添加点击事件监听
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener('click', handleClick)
})
</script>

<template>
</template>

<style scoped>
</style>