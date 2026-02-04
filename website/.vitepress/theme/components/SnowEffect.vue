<!-- components/SnowEffect.vue -->
<!-- 取自 https://www.hajidong.cn/ -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, onBeforeUnmount } from 'vue'

const isMobile = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
// 雪花效果是否激活，默认关闭
const isActive = ref(false)
// 是否进入观赏模式（鼠标不动超过10秒）
const iswatchMode = ref(false)
let animationFrameId: number
let mouseX = -100
let mouseY = -100
// 鼠标移动定时器
let mouseMoveTimeout: number | null = null
// 观赏模式触发时间（毫秒）
const watchModeTimeout = 10000

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

// 缓存配置（用于动画循环，避免响应式开销）
let cachedConfig = { ...config.value }
let cachedMinDist = cachedConfig.minDist
let cachedColor = cachedConfig.color

// 监听配置变化，更新缓存
watch(config, (newConfig) => {
  cachedConfig = { ...newConfig }
  cachedMinDist = newConfig.minDist
  cachedColor = newConfig.color
}, { deep: true })

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
    cachedColor = "255, 182, 193" // 同步更新缓存
  } else {
    config.value.color = "255, 255, 255" // 白色
    cachedColor = "255, 255, 255" // 同步更新缓存
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
    this.size = 3 * Math.random() + cachedConfig.size
    this.speed = 1 * Math.random() + cachedConfig.speed
    this.velY = this.speed
    this.velX = 0
    this.opacity = 0.5 * Math.random() + cachedConfig.opacity
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
  const minDist = cachedMinDist
  const color = cachedColor
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 更新和绘制每个雪花
  for (const flake of snowflakes) {
    // 计算鼠标与雪花的距离
    const dx = mouseX - flake.x
    const dy = mouseY - flake.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    // 检查是否进入观赏模式
    if (!iswatchMode.value && dist < minDist) {
      // 如果鼠标靠近，产生排斥力
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
    ctx.fillStyle = `rgba(${color}, ${flake.opacity})`
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 继续动画循环
  animationFrameId = requestAnimationFrame(animate)
}

// 重置鼠标移动定时器
const resetMouseMoveTimeout = () => {
  // 清除之前的定时器
  if (mouseMoveTimeout !== null) {
    clearTimeout(mouseMoveTimeout)
    mouseMoveTimeout = null
  }
  
  // 退出观赏模式
  if (iswatchMode.value) {
    iswatchMode.value = false
  }
  
  // 设置新的定时器
  mouseMoveTimeout = window.setTimeout(() => {
    // 进入观赏模式
    iswatchMode.value = true
  }, watchModeTimeout)
}

// 处理鼠标移动（添加防抖）
let lastMouseMoveTime = 0
const handleMouseMove = (e: MouseEvent) => {
  const now = Date.now()
  // 限制鼠标移动事件处理频率（每100ms处理一次）
  if (now - lastMouseMoveTime > 100) {
    mouseX = e.clientX
    mouseY = e.clientY
    lastMouseMoveTime = now
    
    // 重置鼠标移动定时器
    resetMouseMoveTimeout()
  }
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

// 切换雪花效果的函数
const toggleSnowEffect = (active: boolean) => {
  // console.log('toggleSnowEffect called with active:', active)
  
  // 如果状态没有变化，直接返回，避免重复执行
  if (isActive.value === active) {
    // console.log('Snow effect is already in the requested state, returning')
    return
  }
  
  isActive.value = active
  
  if (isActive.value) {
    // 激活雪花效果
    // console.log('Activating snow effect, canvas exists:', !!canvas.value)
    if (!canvas.value) {
      // console.error('Canvas element is null')
      return
    }
    
    // 初始化画布
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    
    // 初始化雪花颜色（根据当前主题）
    updateSnowColor()
    
    // 根据设备类型调整雪花数量，移动端减少雪花以提高性能
    const flakeCount = isMobile.value ? config.value.flakeCount / 2 : config.value.flakeCount
    // console.log('Creating', flakeCount, 'snowflakes')
    
    // 创建雪花
    snowflakes.length = 0 // 清空现有雪花
    for (let i = 0; i < flakeCount; i++) {
      snowflakes.push(new Snowflake(
        canvas.value.width,
        canvas.value.height,
        config.value
      ))
    }
    
    // 初始化鼠标移动定时器
    resetMouseMoveTimeout()
    
    // 开始动画
    // console.log('Starting animation')
    // 确保只请求一个动画帧
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(animate)
  } else {
    // 停止雪花效果
    // console.log('Deactivating snow effect')
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = 0 // 重置动画帧ID
    }
    // 清空雪花数组
    snowflakes.length = 0
    
    // 清除鼠标移动定时器
    if (mouseMoveTimeout !== null) {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = null
    }
    
    // 重置观赏模式
    iswatchMode.value = false
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
  
  // 总是添加事件监听，包括事件监听器
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
  
  // 监听雪花开关事件
  window.addEventListener('toggle-snow', (event: any) => {
    toggleSnowEffect(event.detail.active)
  })
  
  // 监听主题变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  // 从localStorage读取初始状态，自动恢复雪花特效
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('snowEffectActive')
    const shouldBeActive = savedState ? JSON.parse(savedState) : false
    
    // 如果应该激活，直接调用toggleSnowEffect
    if (shouldBeActive) {
      // console.log('Restoring snow effect from localStorage')
      toggleSnowEffect(true)
    }
  }
})

onUnmounted(() => {
  // 清理
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  
  // 清除鼠标移动定时器
  if (mouseMoveTimeout !== null) {
    clearTimeout(mouseMoveTimeout)
    mouseMoveTimeout = null
  }
  
  // 清除窗口 resize 定时器
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout)
    resizeTimeout = null
  }
  
  // 停止主题观察
  observer.disconnect()
})
</script>

<template>
  <canvas 
    v-show="isActive"
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
      will-change: transform;
    "
  />
</template>