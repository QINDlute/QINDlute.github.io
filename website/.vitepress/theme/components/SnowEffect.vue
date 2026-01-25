<!-- components/SnowEffect.vue -->
<!-- 取自 https://www.hajidong.cn/ -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, onBeforeUnmount } from 'vue'

const isMobile = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number
let mouseX = -100
let mouseY = -100

// 配置参数
const config = ref({
  flakeCount: 50,
  minDist: 150,
  color: "255, 255, 255",
  size: 2,
  speed: 0.5,
  opacity: 0.2,
  stepsize: 0.5
})

// 检测是否为移动端
const checkMobile = (): boolean => {
  const userAgent = navigator.userAgent
  const mobileRegex = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  return mobileRegex.test(userAgent)
}

// 检测当前主题并设置雪花颜色
const updateSnowColor = () => {
  const root = document.documentElement
  const isWhite = root.classList.contains('theme-white')
  const isSepia = root.classList.contains('theme-sepia')
  
  // 当主题为white或sepia时，雪花颜色改为粉色；night主题保持白色
  if (isWhite || isSepia) {
    config.value.color = "255, 182, 193" // 粉色
  } else {
    config.value.color = "255, 255, 255" // 白色
  }
}

// 监听主题变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      updateSnowColor()
    }
  })
})

// 处理主题变化
const handleThemeChange = () => {
  updateSnowColor()
}

// 雪花类
class Snowflake {
  x: number
  y: number
  size: number
  speed: number
  velX: number
  velY: number
  stepSize: number
  step: number
  opacity: number

  constructor(width: number, height: number, config: any) {
    this.x = Math.floor(Math.random() * width)
    this.y = Math.floor(Math.random() * height)
    this.size = 3 * Math.random() + config.size
    this.speed = 1 * Math.random() + config.speed
    this.velX = 0
    this.velY = this.speed
    this.stepSize = Math.random() / 30 * config.stepsize
    this.step = 0
    this.opacity = 0.5 * Math.random() + config.opacity
  }

  reset(width: number) {
    this.x = Math.floor(Math.random() * width)
    this.y = 0
    this.size = 3 * Math.random() + config.value.size
    this.speed = 1 * Math.random() + config.value.speed
    this.velY = this.speed
    this.velX = 0
    this.opacity = 0.5 * Math.random() + config.value.opacity
  }
}

// 初始化雪花数组
const snowflakes: Snowflake[] = []

// 动画主循环
const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  const width = canvas.value.width
  const height = canvas.value.height
  const minDist = config.value.minDist
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 更新和绘制每个雪花
  for (const flake of snowflakes) {
    // 计算鼠标与雪花的距离
    const dx = mouseX - flake.x
    const dy = mouseY - flake.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    // 如果鼠标靠近，产生排斥力
    if (dist < minDist) {
      const force = minDist / (dist * dist) / 2
      flake.velX -= force * (dx / dist)
      flake.velY -= force * (dy / dist)
    } else {
      // 正常运动
      flake.velX *= 0.98
      if (flake.velY < flake.speed && flake.speed - flake.velY > 0.01) {
        flake.velY += 0.01 * (flake.speed - flake.velY)
      }
      flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize
    }
    
    // 更新位置
    flake.y += flake.velY
    flake.x += flake.velX
    
    // 边界检查
    if (flake.y >= height || flake.y <= 0) {
      flake.reset(width)
    }
    if (flake.x >= width || flake.x <= 0) {
      flake.reset(width)
    }
    
    // 绘制雪花
    ctx.fillStyle = `rgba(${config.value.color}, ${flake.opacity})`
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 继续动画循环
  animationFrameId = requestAnimationFrame(animate)
}

// 处理鼠标移动
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

// 处理窗口大小变化
const handleResize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  // 只在客户端执行
  if (typeof window === 'undefined') return
  
  // 检测是否为移动端
  isMobile.value = checkMobile()
  if (isMobile.value) return
  
  // 初始化画布
  if (!canvas.value) return
  
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  
  // 初始化雪花颜色（根据当前主题）
  updateSnowColor()
  
  // 创建雪花
  for (let i = 0; i < config.value.flakeCount; i++) {
    snowflakes.push(new Snowflake(
      canvas.value.width,
      canvas.value.height,
      config.value
    ))
  }
  
  // 添加事件监听
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
  
  // 监听主题变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  // 开始动画
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  // 清理
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  
  // 停止主题观察
  observer.disconnect()
})
</script>

<template>
  <canvas 
    v-if="!isMobile"
    ref="canvas"
    id="snow"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      pointer-events: none;
    "
  />
</template>