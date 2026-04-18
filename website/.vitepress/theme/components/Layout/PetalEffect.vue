<!-- components/Layout/PetalEffect.vue -->
<!-- 桃花纷飞特效组件 -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const isMobile = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
// 特效是否激活，默认关闭
const isActive = ref(false)
let animationFrameId: number

// 配置参数
const config = ref({
  petalCount: 50,
  speedX: 2,
  speedY: 3,
  minScale: 0.03,
  maxScale: 0.08
})

// 检测是否为移动端
const checkMobile = (): boolean => {
  const userAgent = navigator.userAgent
  const mobileRegex = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  return mobileRegex.test(userAgent)
}

// 桃花类
class Petal {
  x: number
  y: number
  speedX: number
  speedY: number
  scale: number
  width: number
  height: number
  img: HTMLImageElement
  rotation: number
  rotationSpeed: number

  constructor(width: number, height: number, config: any) {
    this.x = Math.random() * width
    this.y = 0
    this.speedX = Math.random() * config.speedX
    this.speedY = Math.random() * config.speedY
    this.scale = config.minScale + Math.random() * (config.maxScale - config.minScale)
    this.width = 250 * this.scale
    this.height = 250 * this.scale
    this.img = new Image()
    // 随机选择桃花图片（使用原项目的图片）
    const f = Math.random() * 10 > 5 ? 1 : 0
    const src = f ? "./img/petal/flow-1.png" : './img/petal/flow-2.png';
    this.img.src = src
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
  }

  reset(width: number, config: any) {
    this.x = Math.random() * width
    this.y = 0
    this.speedX = Math.random() * config.speedX
    this.speedY = Math.random() * config.speedY
    this.scale = config.minScale + Math.random() * (config.maxScale - config.minScale)
    this.width = 250 * this.scale
    this.height = 250 * this.scale
    // 重新随机选择桃花图片（使用原项目的图片）
    const f = Math.random() * 10 > 5 ? 1 : 0
    const src = f ? "./img/petal/flow-1.png" : './img/petal/flow-2.png';
    this.img.src = src
    this.rotation = Math.random() * Math.PI * 2
  }
}

// 初始化桃花数组
const petals: Petal[] = []

// 动画主循环
const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 更新和绘制每个桃花
  for (const petal of petals) {
    // 更新位置
    petal.y += petal.speedY
    petal.x += petal.speedX
    petal.rotation += petal.rotationSpeed
    
    // 边界检查
    if (petal.y >= height) {
      petal.reset(width, config.value)
    }
    if (petal.x >= width || petal.x <= -petal.width) {
      petal.reset(width, config.value)
    }
    
    // 绘制桃花
    ctx.save()
    ctx.translate(petal.x + petal.width / 2, petal.y + petal.height / 2)
    ctx.rotate(petal.rotation)
    ctx.drawImage(petal.img, -petal.width / 2, -petal.height / 2, petal.width, petal.height)
    ctx.restore()
  }
  
  // 继续动画循环
  animationFrameId = requestAnimationFrame(animate)
}

// 处理窗口大小变化（添加节流）
let resizeTimeout: number | null = null
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  resizeTimeout = window.setTimeout(() => {
    if (canvas.value) {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
    }
  }, 200)
}

// 切换桃花特效的函数
const togglePetalEffect = (active: boolean) => {
  // 如果状态没有变化，直接返回
  if (isActive.value === active) {
    return
  }
  
  isActive.value = active
  
  if (isActive.value) {
    // 激活桃花特效
    if (!canvas.value) {
      return
    }
    
    // 初始化画布
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    
    // 根据设备类型调整桃花数量，移动端减少以提高性能
    const petalCount = isMobile.value ? config.value.petalCount / 2 : config.value.petalCount
    
    // 创建桃花
    petals.length = 0 // 清空现有桃花
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal(
        canvas.value.width,
        canvas.value.height,
        config.value
      ))
    }
    
    // 开始动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(animate)
  } else {
    // 停止桃花特效
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = 0 // 重置动画帧ID
    }
    // 清空桃花数组
    petals.length = 0
  }
}

onMounted(() => {
  // 只在客户端执行
  if (typeof window === 'undefined') return
  
  // 检测是否为移动端
  isMobile.value = checkMobile()
  
  // 初始化画布尺寸
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }
  
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  
  // 监听桃花开关事件
  window.addEventListener('toggle-petal', (event: any) => {
    togglePetalEffect(event.detail.active)
  })
  
  // 从localStorage读取初始状态，自动恢复桃花特效
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('petalEffectActive')
    const shouldBeActive = savedState ? JSON.parse(savedState) : false
    
    // 如果应该激活，直接调用togglePetalEffect
    if (shouldBeActive) {
      togglePetalEffect(true)
    }
  }
})

onUnmounted(() => {
  // 清理
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  
  // 清除窗口 resize 定时器
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout)
    resizeTimeout = null
  }
})
</script>

<template>
  <canvas 
    v-show="isActive"
    ref="canvas"
    id="petal"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      pointer-events: none;
      will-change: transform;
    "
  />
</template>

<!-- // 激活桃花特效
window.dispatchEvent(new CustomEvent('toggle-petal', {
  detail: { active: true }
})) -->