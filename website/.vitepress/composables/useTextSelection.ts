import { ref, onMounted, onUnmounted } from 'vue'

export interface TextSelection {
  text: string
  range: Range | null
  position: { x: number; y: number }
}

export function useTextSelection() {
  // 检查当前路径是否允许标注
  // 使用全局配置的 allowedAnnotationPaths
  const isPathAllowed = () => {
    const currentPath = window.location.pathname
    
    // 获取全局配置
    const vitepressThemeConfig = (window as any).vitepressThemeConfig
    const allowedPaths = vitepressThemeConfig?.allowedAnnotationPaths || ['/essays/'] // 默认配置
    
    return allowedPaths.some(excludePath => {
      if (excludePath.endsWith('/')) {
        // 前缀匹配（目录）
        return currentPath.startsWith(excludePath)
      }
      // 精确匹配（单个页面）
      return currentPath === excludePath
    })
  }
  
  const selection = ref<TextSelection>({
    text: '',
    range: null,
    position: { x: 0, y: 0 }
  })
  
  const isVisible = ref(false)
  const isTouchDevice = ref(false)
  // 添加标志位，防止mouseup后立即触发click关闭菜单
  const ignoreNextClick = ref(false)

  // 检测是否是移动设备
  onMounted(() => {
    isTouchDevice.value = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0
  })

  const handleTextSelection = (event?: MouseEvent) => {
    // 检查当前路径是否允许标注
    if (!isPathAllowed()) {
      isVisible.value = false
      return
    }
    
    // 检查是否点击了菜单内部，如果是，不处理
    if (event && (event.target as Element).closest('.text-selection-menu')) {
      return
    }
    
    const winSelection = window.getSelection()
    
    // 移动设备使用 selectionchange 事件
    if (isTouchDevice.value) {
      if (!winSelection || winSelection.isCollapsed) {
        isVisible.value = false
        return
      }
    } else {
      // 桌面设备使用 mouseup 事件
      if (!winSelection || winSelection.toString().trim().length === 0) {
        isVisible.value = false
        return
      }
    }

    const text = winSelection.toString().trim()
    if (!text) {
      isVisible.value = false
      return
    }

    const range = winSelection.getRangeAt(0)
    
    // 检查选择的文本是否位于标题标签内（h1-h6）
    // 1. 检查commonAncestorContainer是否在标题内
    const commonAncestor = range.commonAncestorContainer
    let currentElement = commonAncestor.nodeType === Node.TEXT_NODE ? commonAncestor.parentElement : commonAncestor as Element
    
    // 2. 检查当前元素或其任何祖先是否为标题
    while (currentElement) {
      if (/^h[1-6]$/i.test(currentElement.tagName)) {
        isVisible.value = false
        return
      }
      currentElement = currentElement.parentElement
    }
    
    // 3. 检查选择范围是否与任何标题元素相交
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (const heading of headings) {
      if (range.intersectsNode(heading)) {
        isVisible.value = false
        return
      }
    }
    
    // 4. 检查选择范围是否在 VPContent 元素内
    const vpContent = document.querySelector('.VPContent')
    if (!vpContent || !range.intersectsNode(vpContent)) {
      isVisible.value = false
      return
    }
    
    const rect = range.getBoundingClientRect()

    selection.value = {
      text,
      range,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      }
    }
    
    // 设置标志位，防止mouseup后立即触发click关闭菜单
    ignoreNextClick.value = true
    isVisible.value = true
    
    // 100ms后重置标志位
    setTimeout(() => {
      ignoreNextClick.value = false
    }, 100)
  }

  const clearSelection = () => {
    isVisible.value = false
    selection.value = {
      text: '',
      range: null,
      position: { x: 0, y: 0 }
    }
    window.getSelection()?.removeAllRanges()
  }

  const handleClickOutside = (event: MouseEvent) => {
    // 如果是刚显示菜单，忽略本次点击
    if (ignoreNextClick.value) {
      return
    }
    
    // 如果点击的是高亮文本，不关闭菜单
    if ((event.target as Element).closest('.text-highlight')) {
      return
    }
    
    if (isVisible.value && 
        !(event.target as Element).closest('.text-selection-menu')) {
      clearSelection()
    }
  }

  // 添加键盘快捷键支持
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible.value) {
      clearSelection()
    }
    if (event.key === 'c' && event.ctrlKey && isVisible.value) {
      handleCopy()
    }
  }

  const handleCopy = () => {
    if (selection.value.text) {
      navigator.clipboard.writeText(selection.value.text)
    }
  }

  // 创建一个持久化的鼠标事件处理函数引用
  const mouseUpHandler = (event: MouseEvent) => handleTextSelection(event)
  
  // 处理滚动事件，关闭菜单
  const handleScroll = () => {
    clearSelection()
  }

  onMounted(() => {
    // 只在允许的路径上添加事件监听器
    if (isPathAllowed()) {
      if (isTouchDevice.value) {
        document.addEventListener('selectionchange', handleTextSelection)
      } else {
        document.addEventListener('mouseup', mouseUpHandler)
      }
      
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      
      // 添加滚动事件监听器，滚动时关闭菜单
      window.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    // 确保移除所有可能添加的事件监听器
    if (isTouchDevice.value) {
      document.removeEventListener('selectionchange', handleTextSelection)
    } else {
      document.removeEventListener('mouseup', mouseUpHandler)
    }
    
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
    
    // 移除滚动事件监听器
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    selection,
    isVisible,
    clearSelection,
    handleCopy
  }
}