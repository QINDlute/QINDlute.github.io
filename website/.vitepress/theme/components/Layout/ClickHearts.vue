<!-- .vitepress/theme/components/ClickHearts.vue -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const clickCount = ref(0)
const randomEmojis = [
  '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏',
  '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟',
  '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯',
  '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿'
].slice(0, 62)

// ========== 性能优化配置 ==========
const MAX_NODES = 30 // 最大节点数
const THROTTLE_DELAY = 100 // 节流延迟（毫秒）
const nodeQueue: HTMLElement[] = [] // 节点队列
let lastClickTime = 0 // 上次点击时间
let asideElement: HTMLElement | null = null // 侧边栏元素引用
let observer: MutationObserver | null = null // DOM变化观察者

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

// 安全添加元素并管理节点队列
const safeAppend = (el: HTMLElement) => {
  document.body.appendChild(el)
  nodeQueue.push(el)
  
  // 如果节点太多，强制回收旧的，不等待 setTimeout
  if (nodeQueue.length > MAX_NODES) {
    const oldest = nodeQueue.shift()
    if (oldest?.parentNode) {
      oldest.parentNode.removeChild(oldest)
    }
  }
}

// 通用的元素移除逻辑
const removeElement = (el: HTMLElement, delay: number) => {
  setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
      // 从队列中移除
      const index = nodeQueue.indexOf(el)
      if (index > -1) {
        nodeQueue.splice(index, 1)
      }
    }
  }, delay)
}

// 节流函数
const throttle = (func: Function, limit: number) => {
  let inThrottle = false
  return function(this: any, ...args: any[]) {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const createEffects = (x: number, y: number) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const positionType = isMobile ? 'absolute' : 'fixed'
  clickCount.value++

  // 1. 爱心/表情文字效果 (向上飘散)
  const emoji = getEmojiByCount(clickCount.value)
  
  // 根据设备类型调整爱心大小
  const heartSize = emoji === "❤\uFE0E"
    ? (isMobile
      ? Math.round(Math.random() * 8 + 8)
      : Math.round(Math.random() * 8 + 12)
    )
    : 18;  // 特殊表情固定大小
  
  const heart = document.createElement('span')
  heart.textContent = emoji
  heart.style.cssText = `
    position: ${positionType}; z-index: 99999; color: #E94F06; font-weight: bold;
    font-size: ${heartSize}px;
    left: ${x}px; top: ${y}px; pointer-events: none; user-select: none;
    will-change: transform, opacity; transform: translate(-50%, -50%);
    transition: transform 1.5s cubic-bezier(0.45, 0, 0.55, 1), opacity 1.5s cubic-bezier(0.45, 0, 0.55, 1);
  `
  heart.style.textShadow = `
    0 0 5px rgba(255, 255, 255, 0.5), 
    0 0 10px rgba(233, 79, 6, 0.3)
  `
  safeAppend(heart)

  // 2. 随机 Emoji 效果 (四周扩散)
  const randomEmoji = document.createElement('span')
  const offsetRange = isMobile ? 200 : 400
  const xOffset = Math.random() * offsetRange - offsetRange / 2
  const yOffset = Math.random() * offsetRange - offsetRange / 2
  randomEmoji.textContent = randomEmojis[Math.floor(Math.random() * randomEmojis.length)]
  randomEmoji.style.cssText = `
    position: ${positionType}; z-index: 99998;
    font-size: ${isMobile ? '18px' : '26px'};
    left: ${x}px; top: ${y}px; pointer-events: none; user-select: none;
    will-change: transform, opacity; transform: translate(-50%, -50%);
    transition: transform 1s cubic-bezier(0.45, 0, 0.55, 1), opacity 1s cubic-bezier(0.45, 0, 0.55, 1);
  `
  randomEmoji.style.textShadow = `
    0 0 5px rgba(255, 255, 255, 0.5), 
    0 0 10px rgba(233, 79, 6, 0.3)
  `
  safeAppend(randomEmoji)

  // 触发动画 (使用 requestAnimationFrame 确保 transition 生效)
  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -180px)`
    heart.style.opacity = '0'

    randomEmoji.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`
    randomEmoji.style.opacity = '0'
  })

  removeElement(heart, 1500)
  removeElement(randomEmoji, 1000)
}

// 节流包装点击处理函数
const throttledCreateEffects = throttle((x: number, y: number) => {
  createEffects(x, y)
}, THROTTLE_DELAY)

const handleClick = (e: MouseEvent | TouchEvent) => {
  // 根据设备类型获取正确的坐标
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const x = isMobile
    ? ('touches' in e ? e.touches[0].pageX : (e as MouseEvent).pageX)
    : ('touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX)
  const y = isMobile
    ? ('touches' in e ? e.touches[0].pageY : (e as MouseEvent).pageY)
    : ('touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY)
  
  // 节流处理
  const now = Date.now()
  if (now - lastClickTime < THROTTLE_DELAY) {
    return
  }
  lastClickTime = now
  
  throttledCreateEffects(x, y)
}

// 绑定侧边栏事件
const bindAsideEvent = () => {
  const tapEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown'
  // 先移除旧的事件监听（如果有）
  if (asideElement) {
    asideElement.removeEventListener(tapEvent, handleClick as any)
  }
  // 查找新的侧边栏元素
  asideElement = document.querySelector('aside, .VPSidebar')
  // 绑定新的事件监听
  if (asideElement) {
    asideElement.addEventListener(tapEvent, handleClick as any)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    // 1. 为其余区域使用 click 事件
    document.addEventListener('click', handleClick as any)
    
    // 2. 尝试绑定侧边栏事件
    bindAsideEvent()
    
    // 3. 使用 MutationObserver 监听 DOM 变化，确保侧边栏加载后能绑定事件
    observer = new MutationObserver(() => {
      bindAsideEvent()
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
})
onUnmounted(() => {
  // 1. 移除其余区域的 click 事件监听
  document.removeEventListener('click', handleClick as any)
  
  // 2. 移除 aside 元素的事件监听
  if (asideElement) {
    const tapEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown'
    asideElement.removeEventListener(tapEvent, handleClick as any)
    asideElement = null
  }
  
  // 3. 断开 MutationObserver
  if (observer) {
    observer.disconnect()
    observer = null
  }
  
  // 清理所有还在跑动画的元素
  nodeQueue.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el)
    }
  })
  nodeQueue.length = 0
})
</script>

<template></template>
