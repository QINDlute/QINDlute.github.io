<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 字体大小等级映射（五个等级：0-4）
const fontSizeLevels = [12, 14, 16, 18, 20] // 对应等级0-4的像素值

// 核心：在setup函数顶层直接读取localStorage，初始化响应式数据，避免默认值闪烁

// 字体大小等级初始化
let storedFontSizeLevel = 2
const DEFAULT_FONT_SIZE_LEVEL = 2
try {
  const rawData = localStorage.getItem('vitepress-font-size-level')
  if (rawData) {
    storedFontSizeLevel = parseInt(rawData)
    // 确保值在有效范围内（0-4）
    storedFontSizeLevel = Math.max(0, Math.min(4, storedFontSizeLevel))
  }
} catch (e) {
  console.warn('读取字体大小存储失败，使用默认值', e)
  storedFontSizeLevel = DEFAULT_FONT_SIZE_LEVEL
}
const fontSizeLevel = ref(storedFontSizeLevel)

// 字体类型初始化
let storedFontType = 'sans'
const DEFAULT_FONT_TYPE = 'sans'
try {
  const rawData = localStorage.getItem('vitepress-font-type')
  if (rawData) {
    storedFontType = rawData
    // 确保值为有效值
    if (!['sans', 'serif'].includes(storedFontType)) {
      storedFontType = DEFAULT_FONT_TYPE
    }
  }
} catch (e) {
  console.warn('读取字体类型存储失败，使用默认值', e)
  storedFontType = DEFAULT_FONT_TYPE
}
const fontType = ref(storedFontType)

// 主题初始化
let storedTheme = 'white'
const DEFAULT_THEME = 'white'
try {
  const rawData = localStorage.getItem('vitepress-theme')
  if (rawData) {
    storedTheme = rawData
    // 确保值为有效值
    if (!['white', 'sepia', 'night'].includes(storedTheme)) {
      storedTheme = DEFAULT_THEME
    }
  }
} catch (e) {
  console.warn('读取主题存储失败，使用默认值', e)
  storedTheme = DEFAULT_THEME
}
const theme = ref(storedTheme)

// 下拉菜单显示状态
const isDropdownOpen = ref(false)

// 下拉菜单元素引用
const dropdownRef = ref<HTMLElement | null>(null)

// 应用字体大小到CSS变量
const applyFontSize = () => {
  const currentFontSize = fontSizeLevels[fontSizeLevel.value]
  document.documentElement.style.setProperty('--vp-custom-font-size', `${currentFontSize}px`)
}

// 字体大小调整（基于等级，0-4）
const increaseFontSize = () => {
  // 最多增加到等级4
  if (fontSizeLevel.value < 4) {
    fontSizeLevel.value += 1
    applyFontSize()
  }
}

const decreaseFontSize = () => {
  // 最多减少到等级0
  if (fontSizeLevel.value > 0) {
    fontSizeLevel.value -= 1
    applyFontSize()
  }
}

// 字体类型切换
const toggleFontType = (type: 'sans' | 'serif') => {
  fontType.value = type
  // 通过CSS类控制字体类型，CSS变量会自动响应
  document.documentElement.className = document.documentElement.className.replace(/font-\w+/g, '')
  document.documentElement.classList.add(`font-${type}`)
}

// 主题切换
const toggleTheme = (newTheme: 'white' | 'sepia' | 'night') => {
  theme.value = newTheme
  
  // 移除所有主题类
  document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '')
  
  // 添加当前主题类
  document.documentElement.classList.add(`theme-${newTheme}`)
  
  // 特殊处理深色模式
  if (newTheme === 'night') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 切换下拉菜单
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (isDropdownOpen.value && dropdownRef.value) {
    // 检查点击是否在下拉菜单内部
    if (!dropdownRef.value.contains(event.target as Node)) {
      // 检查点击是否在字体设置按钮上
      const fontSettingsBtn = event.target as Element
      if (!fontSettingsBtn.closest('.font-settings-container')) {
        closeDropdown()
      }
    }
  }
}

// 组件初始化时应用所有设置
const initSettings = () => {
  // 应用字体大小
  applyFontSize()
  
  // 应用字体类型
  document.documentElement.classList.add(`font-${fontType.value}`)
  
  // 应用主题
  document.documentElement.classList.add(`theme-${theme.value}`)
  if (theme.value === 'night') {
    document.documentElement.classList.add('dark')
  }
}

// 组件挂载后执行的逻辑
onMounted(() => {
  // 确保Font Awesome图标库可用
  if (!document.querySelector('link[href*="fontawesome"]')) {
    // 动态加载Font Awesome CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)
  }

  // 初始化设置
  initSettings()

  // 添加点击外部关闭下拉菜单的事件监听器
  document.addEventListener('click', handleClickOutside)
})

// 监听字体大小变化，写入localStorage
watch(fontSizeLevel, (newValue) => {
  localStorage.setItem('vitepress-font-size-level', String(newValue))
  applyFontSize() // 重新应用字体大小
})

// 监听字体类型变化，写入localStorage
watch(fontType, (newValue) => {
  localStorage.setItem('vitepress-font-type', newValue)
})

// 监听主题变化，写入localStorage
watch(theme, (newValue) => {
  localStorage.setItem('vitepress-theme', newValue)
})

// 组件卸载时移除所有事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- 字体设置组件 -->
  <div class="font-settings-container">
    <!-- 字体设置按钮 -->
    <button 
      class="btn toggle-dropdown" 
      aria-label="Font Settings" 
      @click="toggleDropdown"
    >
      <i class="fa fa-font"></i>
    </button>
    
    <!-- 字体设置下拉菜单 -->
    <div 
      v-if="isDropdownOpen" 
      ref="dropdownRef" 
      class="font-settings-dropdown"
      @click.stop="closeDropdown"
    >
      <div class="dropdown-caret">
        <span class="caret-outer"></span>
        <span class="caret-inner"></span>
      </div>
      
      <!-- 字体大小调整 -->
      <div class="dropdown-section">
        <h4 class="dropdown-title">字体大小</h4>
        <div class="buttons">
          <button class="button" @click="decreaseFontSize">A-</button>
          <button class="button" @click="increaseFontSize">A+</button>
        </div>
      </div>
      
      <!-- 字体类型切换 -->
      <div class="dropdown-section">
        <h4 class="dropdown-title">字体类型</h4>
        <div class="buttons">
          <button 
            class="button" 
            :class="{ active: fontType === 'sans' }" 
            @click="toggleFontType('sans')"
          >
            Sans
          </button>
          <button 
            class="button" 
            :class="{ active: fontType === 'serif' }" 
            @click="toggleFontType('serif')"
          >
            Serif
          </button>
        </div>
      </div>
      
      <!-- 主题切换 -->
      <div class="dropdown-section">
        <h4 class="dropdown-title">主题</h4>
        <div class="buttons">
          <button 
            class="button" 
            :class="{ active: theme === 'white' }" 
            @click="toggleTheme('white')"
          >
            White
          </button>
          <button 
            class="button" 
            :class="{ active: theme === 'sepia' }" 
            @click="toggleTheme('sepia')"
          >
            Sepia
          </button>
          <button 
            class="button" 
            :class="{ active: theme === 'night' }" 
            @click="toggleTheme('night')"
          >
            Night
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用默认的btn样式，不需要自定义样式 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.btn i {
  font-size: 14px;
}

.font-settings-dropdown {
  position: absolute;
  z-index: 9999;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-2);
  min-width: 200px;
  width: 220px;
  padding: 12px;
  margin-top: 4px;
  transform: none;
  display: block;
  opacity: 1;
  visibility: visible;
  /* 确保下拉菜单显示在按钮正下方 */
  left: auto;
  right: 0;
  top: 100%;
  /* 防止超出视口 */
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.dropdown-caret {
  position: absolute;
  top: -10px;
  right: 20px; /* 将箭头从左侧移动到右侧 */
  width: 0;
  height: 0;
}

.caret-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-bottom-color: var(--vp-c-border);
}

.caret-inner {
  position: absolute;
  top: 1px;
  left: 0;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-bottom-color: var(--vp-c-bg);
}

.dropdown-section {
  padding: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dropdown-section:last-child {
  border-bottom: none;
}

.dropdown-title {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  background: var(--vp-c-default-soft);
  border-color: var(--vp-c-divider);
}

.button.active {
  color: var(--vp-c-white);
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
}

.font-settings-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
}

.font-settings-container:hover {
  background-color: var(--vp-c-default-soft);
}

.font-settings-container .btn.toggle-dropdown {
  position: relative;
}

/* 应用CSS变量到VitePress内容 */
:global(.VPContent),
:global(.vp-doc),
:global(.vp-doc p),
:global(.vp-doc li),
:global(.vp-doc span),
:global(.vp-doc a),
:global(.vp-doc dd),
:global(.vp-doc dt),
:global(.vp-doc th),
:global(.vp-doc td) {
  font-size: var(--vp-custom-font-size);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

/* 标题字体大小 - 基于基础字体大小的相对比例 */
:global(.vp-doc h1) {
  font-size: calc(var(--vp-custom-font-size) * 2.0);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}

:global(.vp-doc h2) {
  font-size: calc(var(--vp-custom-font-size) * 1.75);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}

:global(.vp-doc h3) {
  font-size: calc(var(--vp-custom-font-size) * 1.5);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}

:global(.vp-doc h4) {
  font-size: calc(var(--vp-custom-font-size) * 1.3);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}

:global(.vp-doc h5) {
  font-size: calc(var(--vp-custom-font-size) * 1.15);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}

:global(.vp-doc h6) {
  font-size: calc(var(--vp-custom-font-size) * 1.05);
  font-family: var(--vp-custom-font-family);
  transition: all 0.3s ease;
}
</style>