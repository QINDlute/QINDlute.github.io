<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 字体大小等级映射（五个等级：0-4）
const fontSizeLevels = [12, 14, 16, 18, 20] // 对应等级0-4的像素值

// 核心：在setup函数顶层直接读取localStorage，初始化响应式数据，避免默认值闪烁

// 字体大小等级初始化
let storedFontSizeLevel = 2
const DEFAULT_FONT_SIZE_LEVEL = 2
try {
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined' && localStorage) {
    const rawData = localStorage.getItem('vitepress-font-size-level')
    if (rawData) {
      storedFontSizeLevel = parseInt(rawData)
      // 确保值在有效范围内（0-4）
      storedFontSizeLevel = Math.max(0, Math.min(4, storedFontSizeLevel))
    }
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
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined' && localStorage) {
    const rawData = localStorage.getItem('vitepress-font-type')
    if (rawData) {
      storedFontType = rawData
      // 确保值为有效值
      if (!['sans', 'serif'].includes(storedFontType)) {
        storedFontType = DEFAULT_FONT_TYPE
      }
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
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined' && localStorage) {
    const rawData = localStorage.getItem('vitepress-theme')
    if (rawData) {
      storedTheme = rawData
      // 确保值为有效值
      if (!['white', 'sepia', 'night'].includes(storedTheme)) {
        storedTheme = DEFAULT_THEME
      }
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
  // 手动设置字体家族变量（补充：解决原代码中 --vp-custom-font-family 未定义问题）
  const fontFamily = type === 'sans' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' : 'Georgia, "Times New Roman", Times, serif'
  document.documentElement.style.setProperty('--vp-custom-font-family', fontFamily)
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
  // 初始化字体家族变量（补充：解决首次加载字体不生效问题）
  const initFontFamily = fontType.value === 'sans' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif' : 'Georgia, "Times New Roman", Times, serif'
  document.documentElement.style.setProperty('--vp-custom-font-family', initFontFamily)
  
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
  try {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('vitepress-font-size-level', String(newValue))
    }
  } catch (e) {
    console.warn('写入字体大小存储失败', e)
  }
  applyFontSize() // 重新应用字体大小
})

// 监听字体类型变化，写入localStorage
watch(fontType, (newValue) => {
  try {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('vitepress-font-type', newValue)
    }
  } catch (e) {
    console.warn('写入字体类型存储失败', e)
  }
})

// 监听主题变化，写入localStorage
watch(theme, (newValue) => {
  try {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('vitepress-theme', newValue)
    }
  } catch (e) {
    console.warn('写入主题存储失败', e)
  }
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
    
    <div 
      v-if="isDropdownOpen" 
      ref="dropdownRef" 
      class="font-settings-dropdown"
    >
      <div class="dropdown-caret">
        <span class="caret-outer"></span>
        <span class="caret-inner"></span>
      </div>
      
      <!-- 字体大小调整 -->
      <div class="dropdown-section">
        <div class="buttons">
          <button class="button" @click="decreaseFontSize">A-</button>
          <button class="button" @click="increaseFontSize">A+</button>
        </div>
      </div>
      
      <!-- 字体类型切换 -->
      <div class="dropdown-section">
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
.btn { /* 字体设置按钮 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s; /* 字体设置按钮颜色变化过渡 */
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

.font-settings-dropdown { /* 字体设置下拉菜单*/
  position: absolute;
  z-index: 9999 !important; /* 强制最高层级，避免被遮挡 */
  /* 添加半透明背景*/
  background-color: rgba(var(--vp-c-bg-rgb), 0.8);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-2);
  min-width: 150px;
  width: 160px;
  padding: 4px;
  margin-top: 4px;
  display: block;
  opacity: 1;
  visibility: visible;
  left: auto;
  right: 0;
  top: 120%; /* 下拉菜单与按钮底部的间距 */
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.dropdown-caret {
  position: absolute;
  top: -10px;
  right: 20px;
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
}

.dropdown-section { /* 字体设置下拉菜单中的每个部分 */
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dropdown-section:last-child {
  border-bottom: none;
}

.buttons { /* 字体设置下拉菜单中的按钮组 */
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.button { /* 字体设置下拉菜单中的按钮 */
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

  /* 调整按钮激活状态样式，增强视觉反馈 */
.button.active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 优化触摸反馈 */
.button:active {
  transform: scale(0.95);
}

.font-settings-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 0;
  margin: 0;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  z-index: 9999; /* 确保容器层级高于其他元素 */
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
:global(.vp-doc td),
:global(.vp-doc summary),
:global(.vp-doc blockquote > p) {
  font-size: var(--vp-custom-font-size);
  font-family: var(--vp-custom-font-family);
  /* transition: all 100ms ease; */
}

/* 标题字体大小 - 基于基础字体大小的相对比例 */
:global(.vp-doc h1) {
  font-size: calc(var(--vp-custom-font-size) * 2.0);
  font-family: var(--vp-custom-font-family);
}

:global(.vp-doc h2) {
  font-size: calc(var(--vp-custom-font-size) * 1.75);
  font-family: var(--vp-custom-font-family);
}

:global(.vp-doc h3) {
  font-size: calc(var(--vp-custom-font-size) * 1.5);
  font-family: var(--vp-custom-font-family);
}

:global(.vp-doc h4) {
  font-size: calc(var(--vp-custom-font-size) * 1.3);
  font-family: var(--vp-custom-font-family);
}

:global(.vp-doc h5) {
  font-size: calc(var(--vp-custom-font-size) * 1.15);
  font-family: var(--vp-custom-font-family);
}

:global(.vp-doc h6) {
  font-size: calc(var(--vp-custom-font-size) * 1.05);
  font-family: var(--vp-custom-font-family);
}


/* 自定义主题类基础样式 */
:global(.theme-white) {
  --vp-c-bg-rgb: 255, 255, 255;
}

:global(.theme-sepia) {
  --vp-c-bg-rgb: 245, 240, 225;
}

:global(.theme-night.dark) {
  --vp-c-bg-rgb: 30, 30, 30;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  /* 调整字体设置按钮大小，确保足够的触摸目标 */
  .btn.toggle-dropdown {
    padding: 10px 18px 9px;
    font-size: 11px;
  }
  
  .btn i {
    font-size: 14px;
  }
  
  /* 优化下拉菜单样式 */
  .font-settings-dropdown {
    width: 120px; /* 调整宽度，适合更小的按钮 */
    min-width: 110px;
    padding: 4px;
    margin-top: 4px;
    left: 50%; /* 居中显示 */
    right: auto;
    transform: translateX(-50%); /* 水平居中 */
    top: 127%; /* 调整与按钮的间距 */
    background-color: rgba(var(--vp-c-bg-rgb), 0.8); /* 更高的背景透明度，提高可读性 */
    transition: all 0.2s ease; /* 增加过渡效果 */
  }
  
  /* 调整下拉菜单箭头位置 */
  .dropdown-caret {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
  
  /* 调整下拉菜单分区样式 */
  .dropdown-section {
    padding: 10px;
  }
  
  /* 调整按钮样式，减小尺寸 */
  .button {
    padding: 6px 6px;
    font-size: 10px;
    min-width: 40px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 调整按钮组样式：靠左排列 + 减小间距 */
  .buttons {
    gap: 6px; /* 减小间距 */
    justify-content: flex-start; /* 靠左排列 */
  }
  
  /* 调整字体大小调整按钮样式，减小尺寸 */
  .dropdown-section:nth-child(1) .button {
    font-size: 11px; /* 减小字体大小 */
    padding: 6px 8px; /* 减小内边距 */
  }
  
  /* 优化字体类型按钮样式，减小尺寸 */
  .dropdown-section:nth-child(2) .button {
    font-size: 11px; /* 减小字体大小 */
    padding: 6px 8px; /* 减小内边距 */
  }
  
  /* 优化主题切换按钮样式，确保与其他按钮大小一致 */
  .dropdown-section:nth-child(3) .button {
    font-size: 10px; /* 更小的字体 */
    padding: 6px 6px; /* 更小的内边距 */
  }
  

}
</style>