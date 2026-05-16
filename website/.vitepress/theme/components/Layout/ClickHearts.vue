<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { isMobileWidth } from '@utils/functions'

const clickCount = ref(0)
const randomEmojis = [
  '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏',
  '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟',
  '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯',
  '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿'
].slice(0, 62)

const MAX_NODES = 30
const THROTTLE_DELAY = 50
const TOUCH_MOVE_THRESHOLD = 10
const nodeQueue: HTMLElement[] = []
let lastClickTime = 0
let isTouchDevice = false

// 移动端触摸事件相关变量
let touchStartX = 0
let touchStartY = 0
let touchMoved = false
let isTrackingTouch = false

// 侧边栏相关变量
let asideElement: HTMLElement | null = null
let observer: MutationObserver | null = null

const getEmojiByCount = (count: number): string => {
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
        return "❤\uFE0E"
    }
  }
  const cycleEmojis = ["OωO", "(๑•́ ∀ •̀๑)", "(๑•́ ₃ •̀๑)", "(๑•̀_•́๑)", "（￣へ￣）", "(╯°口°)╯(┴—┴", "૮( ᵒ̌皿ᵒ̌ )ა", "╮(｡>口<｡)╭", "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃"]
  const relativeCount = count - 106
  if (relativeCount >= 10 && (relativeCount - 10) % 10 === 0) {
    return cycleEmojis[Math.floor((relativeCount - 10) / 10) % cycleEmojis.length]
  }
  return "❤\uFE0E"
}

const safeAppend = (el: HTMLElement) => {
  document.body.appendChild(el)
  nodeQueue.push(el)
  if (nodeQueue.length > MAX_NODES) {
    const oldest = nodeQueue.shift()
    if (oldest?.parentNode) oldest.parentNode.removeChild(oldest)
  }
}

const removeElement = (el: HTMLElement, delay: number) => {
  setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
      const index = nodeQueue.indexOf(el)
      if (index > -1) nodeQueue.splice(index, 1)
    }
  }, delay)
}

// 创建特效（PC端和移动端统一调用）
const createEffects = (x: number, y: number) => {
  clickCount.value++
  const isMobile = isMobileWidth()
  const emoji = getEmojiByCount(clickCount.value)

  const heartSize = emoji === "❤\uFE0E"
    ? (isMobile
      ? Math.round(Math.random() * 8 + 8)
      : Math.round(Math.random() * 8 + 12)
    )
    : 18;
  
  const heart = document.createElement('span')
  heart.textContent = emoji
  heart.style.cssText = `
    position: fixed; z-index: 99998; color: #E94F06; font-weight: bold;
    font-size: ${heartSize}px; left: ${x}px; top: ${y}px; 
    pointer-events: none; user-select: none; transform: translate(-50%, -50%);
    transition: transform 1.5s cubic-bezier(0.45,0,0.55,1), opacity 1.5s cubic-bezier(0.45,0,0.55,1);
  `
  heart.style.textShadow = '0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(233,79,6,0.3)'
  safeAppend(heart)

  const randomEmoji = document.createElement('span')
  const offsetRange = isMobile ? 200 : 400
  const xOffset = Math.random() * offsetRange - offsetRange/2
  const yOffset = Math.random() * offsetRange - offsetRange/2
  
  randomEmoji.textContent = randomEmojis[Math.floor(Math.random() * randomEmojis.length)]
  randomEmoji.style.cssText = `
    position: fixed; z-index: 99997;
    font-size: ${isMobile ? '18px' : '26px'};
    left: ${x}px; top: ${y}px; pointer-events: none; user-select: none;
    transform: translate(-50%, -50%);
    transition: transform 1s cubic-bezier(0.45,0,0.55,1), opacity 1s cubic-bezier(0.45,0,0.55,1);
  `
  randomEmoji.style.textShadow = '0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(233,79,6,0.3)'
  safeAppend(randomEmoji)

  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -180px)`
    heart.style.opacity = '0'
    randomEmoji.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`
    randomEmoji.style.opacity = '0'
  })

  removeElement(heart, 1500)
  removeElement(randomEmoji, 1000)
}

// PC端点击处理（全局和侧边栏共用）
const handlePC = (e: MouseEvent) => {
  if (isTouchDevice && isTrackingTouch) return
  if (Date.now() - lastClickTime < THROTTLE_DELAY) return
  lastClickTime = Date.now()
  createEffects(e.clientX, e.clientY)
}

// 侧边栏事件绑定
const bindAsideEvent = () => {
  // 移除旧的监听
  if (asideElement) {
    asideElement.removeEventListener('mousedown', handlePC)
  }
  // 查找侧边栏元素（VitePress 常用类名 .VPSidebar，降级为 aside）
  asideElement = document.querySelector('.VPSidebar, aside')
  if (asideElement) {
    asideElement.addEventListener('mousedown', handlePC)
  }
}

// 移动端触摸相关函数（保持不变）
const handleTouchStart = (e: TouchEvent) => {
  if (Date.now() - lastClickTime < THROTTLE_DELAY) return
  
  const touch = e.touches[0]
  if (!touch) return
  
  touchStartX = touch.clientX
  touchStartY = touch.clientY
  touchMoved = false
  isTrackingTouch = true
  
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd)
  document.addEventListener('touchcancel', handleTouchCancel)
}

const handleTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch || !isTrackingTouch) return
  
  const deltaX = Math.abs(touch.clientX - touchStartX)
  const deltaY = Math.abs(touch.clientY - touchStartY)
  
  if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
    touchMoved = true
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isTrackingTouch) return
  
  const vp = window.visualViewport
  const x = touchStartX + (vp?.offsetLeft || 0)
  const y = touchStartY + (vp?.offsetTop || 0)
  
  if (!touchMoved && Date.now() - lastClickTime >= THROTTLE_DELAY) {
    lastClickTime = Date.now()
    createEffects(x, y)
  }
  
  cleanupTouchListeners()
}

const handleTouchCancel = () => {
  cleanupTouchListeners()
}

const cleanupTouchListeners = () => {
  isTrackingTouch = false
  touchMoved = false
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchCancel)
}

onMounted(() => {
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  if (isTouchDevice) {
    // 移动端：触摸事件（全局，包括侧边栏）
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
  } else {
    // 桌面端：全局 click + 侧边栏 mousedown 双重保障
    document.addEventListener('click', handlePC)
    // 绑定侧边栏
    bindAsideEvent()
    // 监听侧边栏动态出现（例如路由切换后重新渲染）
    observer = new MutationObserver(() => {
      bindAsideEvent()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  if (isTouchDevice) {
    document.removeEventListener('touchstart', handleTouchStart)
    cleanupTouchListeners()
  } else {
    document.removeEventListener('click', handlePC)
    // 清理侧边栏监听
    if (asideElement) {
      asideElement.removeEventListener('mousedown', handlePC)
      asideElement = null
    }
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
  
  // 清理所有特效元素
  nodeQueue.forEach(el => el.parentNode?.removeChild(el))
  nodeQueue.length = 0
})
</script>

<template></template>