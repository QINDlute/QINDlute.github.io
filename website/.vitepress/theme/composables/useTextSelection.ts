// .vitepress/theme/composables/useTextSelection.ts
import { ref, onMounted, onUnmounted } from 'vue'

export interface TextSelection {
  text: string
  range: Range | null
  position: { x: number; y: number }
  annotationId?: string
}

export function useTextSelection() {
  // 检查当前路径是否允许标注
  const isPathAllowed = () => {
    const currentPath = window.location.pathname
    const vitepressThemeConfig = (window as any).vitepressThemeConfig
    const allowedPaths = vitepressThemeConfig?.allowedAnnotationPaths || ['/essays/']
    return allowedPaths.some(excludePath => {
      if (excludePath.endsWith('/')) {
        return currentPath.startsWith(excludePath)
      }
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
  const ignoreNextClick = ref(false)
  // 新增：标记是否正在处理移动端文本选择，避免重复触发
  const isProcessingSelection = ref(false)

  // 重构：统一的文本选择处理逻辑，适配移动端延迟检测
  const handleTextSelection = (event?: MouseEvent | Event) => {
    if (!isPathAllowed()) {
      isVisible.value = false
      return
    }
    
    // 移动端防止重复处理
    if (isProcessingSelection.value) return
    
    // 检查是否点击了菜单内部或高亮文本
    if (event && (event.target as Element)?.closest('.text-selection-menu')) {
      return
    }
    
    // 如果点击的是高亮文本，不关闭菜单
    if (event && (event.target as Element)?.closest('.text-highlight')) {
      // 标记下一次点击需要被忽略，防止后续click事件关闭菜单
      ignoreNextClick.value = true
      setTimeout(() => {
        ignoreNextClick.value = false
      }, 300) // 移动端click延迟较长，设置300ms
      return
    }
    
    // 新增：移动端延迟获取选择结果（解决selectionchange触发时机过早问题）
    const getSelectionResult = () => {
      const winSelection = window.getSelection()
      if (!winSelection) return null
      
      const text = winSelection.toString().trim()
      if (!text) return null
      
      const range = winSelection.getRangeAt(0)
      
      // 检查选中文本是否包含不允许的元素（如链接、按钮等）
      const isInDisallowedElement = (range: Range) => {
        // 不允许的元素标签列表
        const disallowedTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'SCRIPT', 'STYLE']
        
        const checkElement = (el: Element | null) => {
          while (el) {
            if (disallowedTags.includes(el.tagName)) {
              return true
            }
            el = el.parentElement
          }
          return false
        }
        
        // 检查共同祖先元素
        const commonAncestor = range.commonAncestorContainer
        const currentElement = commonAncestor.nodeType === Node.TEXT_NODE 
          ? commonAncestor.parentElement 
          : (commonAncestor as Element)
        
        // 检查当前元素及其祖先元素
        if (checkElement(currentElement)) return true
        
        // 检查选择范围是否与任何不允许的元素相交
        const disallowedElements = document.querySelectorAll(disallowedTags.join(','))
        const rangeRect = range.getBoundingClientRect()
        
        for (const element of disallowedElements) {
          const elementRect = element.getBoundingClientRect()
          // 用矩形重叠判断是否相交
          if (
            rangeRect.left < elementRect.right &&
            rangeRect.right > elementRect.left &&
            rangeRect.top < elementRect.bottom &&
            rangeRect.bottom > elementRect.top
          ) {
            return true
          }
        }
        
        return false
      }
      
      // 检查选中文本是否跨标签（不在同一个元素内）
      const isCrossElementSelection = (range: Range) => {
        // 检查共同祖先元素是否在允许的元素内，如果是，则允许跨标签选择
        const isInAllowedElement = () => {
          const commonAncestor = range.commonAncestorContainer
          let currentElement = commonAncestor.nodeType === Node.TEXT_NODE 
            ? commonAncestor.parentElement 
            : (commonAncestor as Element)
          
          // 获取VitePress主题配置
          const vitepressThemeConfig = (window as any).vitepressThemeConfig
          // 允许跨标签选择的元素列表，默认为空列表，可在配置中自定义
          const allowedElements = vitepressThemeConfig?.allowedCrossElements || []
          
          // 检查当前元素及其祖先元素是否在允许的元素列表中
          while (currentElement) {
            if (allowedElements.includes(currentElement.tagName)) {
              return true
            }
            currentElement = currentElement.parentElement
          }
          return false
        }
        
        // 如果在允许的元素内，允许跨标签选择
        if (isInAllowedElement()) {
          return false
        }
        
        // 如果startContainer和endContainer不同，说明跨标签
        if (range.startContainer !== range.endContainer) {
          return true
        }
        
        // 如果startContainer和endContainer相同，但它们的父元素不同，说明跨标签
        // 这种情况可能发生在文本节点被分割的情况下
        const startParent = range.startContainer.nodeType === Node.TEXT_NODE 
          ? range.startContainer.parentElement 
          : (range.startContainer as Element)
        
        const endParent = range.endContainer.nodeType === Node.TEXT_NODE 
          ? range.endContainer.parentElement 
          : (range.endContainer as Element)
        
        if (startParent !== endParent) {
          return true
        }
        
        // 检查共同祖先元素是否是文本节点的直接父元素
        // 如果共同祖先元素是块级元素，而选择范围跨越了多个内联元素，也可能导致格式问题
        const commonAncestor = range.commonAncestorContainer
        if (commonAncestor.nodeType !== Node.TEXT_NODE) {
          // 检查共同祖先元素下是否有多个子节点
          if (commonAncestor.childNodes.length > 1) {
            // 检查startOffset和endOffset是否跨越了多个子节点
            let currentNode = commonAncestor.firstChild
            let currentOffset = 0
            let startNode = null
            let endNode = null
            
            // 遍历子节点，找到startOffset和endOffset所在的节点
            while (currentNode) {
              if (currentOffset + currentNode.textContent!.length > range.startOffset && !startNode) {
                startNode = currentNode
              }
              
              if (currentOffset + currentNode.textContent!.length > range.endOffset && !endNode) {
                endNode = currentNode
              }
              
              if (startNode && endNode) {
                break
              }
              
              currentOffset += currentNode.textContent!.length
              currentNode = currentNode.nextSibling
            }
            
            // 如果startNode和endNode不同，说明跨标签
            if (startNode !== endNode) {
              return true
            }
          }
        }
        
        return false
      }
      
      // 兼容处理：部分移动端浏览器不支持intersectsNode
      const isInHeading = (range: Range) => {
        const checkElement = (el: Element | null) => {
          while (el) {
            if (/^h[1-6]$/i.test(el.tagName)) return true
            el = el.parentElement
          }
          return false
        }
        
        const commonAncestor = range.commonAncestorContainer
        const currentElement = commonAncestor.nodeType === Node.TEXT_NODE 
          ? commonAncestor.parentElement 
          : (commonAncestor as Element)
        
        // 优先检查当前元素，避免使用intersectsNode
        if (checkElement(currentElement)) return true
        
        // 降级检查所有标题（仅在必要时）
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        for (const heading of headings) {
          const rect = heading.getBoundingClientRect()
          const rangeRect = range.getBoundingClientRect()
          // 用矩形重叠判断是否相交（替代intersectsNode）
          if (
            rangeRect.left < rect.right &&
            rangeRect.right > rect.left &&
            rangeRect.top < rect.bottom &&
            rangeRect.bottom > rect.top
          ) {
            return true
          }
        }
        return false
      }
      
      // 检查是否在不允许的元素内
      if (isInDisallowedElement(range)) return null
      
      // 检查选中文本是否跨标签
      if (isCrossElementSelection(range)) return null
      
      // 检查是否在标题内
      if (isInHeading(range)) return null
      
      // 检查是否在VPContent内（兼容移动端视口）
      const vpContent = document.querySelector('.VPContent')
      if (!vpContent) return null
      const vpRect = vpContent.getBoundingClientRect()
      const rangeRect = range.getBoundingClientRect()
      // 用矩形重叠判断是否在VPContent内
      const isInVPContent = (
        rangeRect.left < vpRect.right &&
        rangeRect.right > vpRect.left &&
        rangeRect.top < vpRect.bottom &&
        rangeRect.bottom > vpRect.top
      )
      if (!isInVPContent) return null
      
      return { text, range, rangeRect }
    }
    
    // 区分移动端/桌面端处理
    if (isTouchDevice.value) {
      isProcessingSelection.value = true
      // 移动端延迟200ms，确保选中文本稳定
      setTimeout(() => {
        const result = getSelectionResult()
        if (result) {
          const { text, range, rangeRect } = result
          selection.value = {
            text,
            range,
            position: {
              x: rangeRect.left + rangeRect.width / 2,
              y: rangeRect.bottom + 10
            }
          }
          ignoreNextClick.value = true
          isVisible.value = true
          
          // 重置忽略点击标记
          setTimeout(() => {
            ignoreNextClick.value = false
          }, 300) // 延长至300ms，适配移动端click延迟
        } else {
          // 如果已经有选中文本，不关闭菜单（防止键盘弹出导致菜单关闭）
          if (selection.value.text) {
            isProcessingSelection.value = false
            return
          }
          isVisible.value = false
        }
        isProcessingSelection.value = false
      }, 200)
    } else {
      // 桌面端原有逻辑
      const result = getSelectionResult()
      if (result) {
        const { text, range, rangeRect } = result
        selection.value = {
          text,
          range,
          position: {
            x: rangeRect.left + rangeRect.width / 2,
            y: rangeRect.bottom + 10
          }
        }
        ignoreNextClick.value = true
        isVisible.value = true
        
        setTimeout(() => {
          ignoreNextClick.value = false
        }, 100)
      } else {
        // 如果已经有选中文本，不关闭菜单
        if (selection.value.text) {
          return
        }
        isVisible.value = false
      }
    }
  }

  const clearSelection = () => {
    isVisible.value = false
    selection.value = {
      text: '',
      range: null,
      position: { x: 0, y: 0 }
    }
    window.getSelection()?.removeAllRanges()
    isProcessingSelection.value = false // 重置处理标记
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (ignoreNextClick.value || isProcessingSelection.value) {
      return
    }
    
    if ((event.target as Element).closest('.text-highlight')) {
      return
    }
    
    if (isVisible.value && !(event.target as Element).closest('.text-selection-menu')) {
      // 触发自定义事件，通知组件执行取消逻辑
      const customEvent = new CustomEvent('annotation-cancel', {
        bubbles: true,
        composed: true
      })
      event.target?.dispatchEvent(customEvent)
      clearSelection()
    }
  }

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

  // 持久化的事件处理函数引用
  const mouseUpHandler = (event: MouseEvent) => handleTextSelection(event)
  const selectionChangeHandler = () => {
    // 如果正在处理高亮文本点击，不处理selectionchange事件，避免关闭菜单
    if (ignoreNextClick.value) return
    handleTextSelection()
  }
  
  // 移动端touchend事件处理函数
  const touchEndHandler = (event: TouchEvent) => {
    // 如果点击的是高亮文本，不处理touchend事件，避免关闭菜单
    if ((event.target as Element).closest('.text-highlight')) {
      // 标记下一次点击和selectionchange需要被忽略
      ignoreNextClick.value = true
      setTimeout(() => {
        ignoreNextClick.value = false
      }, 300) // 移动端click延迟较长，设置300ms
      return
    }
    // 延迟触发，确保文本选择完成
    setTimeout(handleTextSelection, 100)
  }
  
  // 简化的handleScroll函数，只要滚动就关闭窗口
  const handleScroll = () => {
    clearSelection()
  }

  onMounted(() => {
    // 更准确的移动端检测
    isTouchDevice.value = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    
    // 事件监听适配
    if (isTouchDevice.value) {
      // 移动端同时监听selectionchange和touchend（兜底）
      document.addEventListener('selectionchange', selectionChangeHandler)
      document.addEventListener('touchend', touchEndHandler)
    } else {
      document.addEventListener('mouseup', mouseUpHandler)
    }
    
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    // 恢复滚动事件监听
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    // 移除所有监听器
    if (isTouchDevice.value) {
      document.removeEventListener('selectionchange', selectionChangeHandler)
      document.removeEventListener('touchend', touchEndHandler)
    } else {
      document.removeEventListener('mouseup', mouseUpHandler)
    }
    
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
    // 移除滚动事件监听
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    selection,
    isVisible,
    clearSelection,
    handleCopy
  }
}