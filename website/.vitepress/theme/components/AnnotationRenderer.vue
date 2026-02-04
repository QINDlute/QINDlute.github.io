<!-- .vitepress/theme/components/AnnotationRenderer.vue -->
<template>
  <div class="annotation-renderer">
    <!-- 标注会在挂载时自动渲染到页面 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useAnnotations } from '../composables/useAnnotations'

const { getCurrentPageAnnotations, colorOptions } = useAnnotations()

// 添加当前页面 URL 跟踪
let currentPageUrl = ''
let urlCheckInterval: number | null = null

// 等待页面加载完成
const waitForPageLoad = () => {
  return new Promise((resolve) => {
    // 检查页面内容是否已经加载
    const checkPageLoad = () => {
      const contentElement = document.querySelector('.VPContent')
      if (contentElement && contentElement.textContent?.length > 0) {
        resolve()
      } else {
        // 每 100ms 检查一次
        setTimeout(checkPageLoad, 100)
      }
    }
    // 开始检查
    checkPageLoad()
  })
}

// 处理 URL 变化
const handleUrlChange = () => {
  const newUrl = window.location.pathname
  if (newUrl !== currentPageUrl) {
    currentPageUrl = newUrl
    // 等待页面内容完全加载后再渲染
    waitForPageLoad().then(() => {
      setTimeout(() => {
        renderAnnotations()
        addClickListeners()
      }, 200) // 额外延迟，确保所有内容都已就绪
    })
  }
}

// 渲染标注到页面 - 修复版本，支持同一节点内的多个标注
const renderAnnotations = () => {
  // 1. 先获取所有高亮元素，检查是否需要更新，避免不必要的DOM操作
  const existingHighlights = new Map()
  document.querySelectorAll('.text-highlight').forEach(el => {
    const annotationId = el.dataset.annotationId
    if (annotationId) {
      existingHighlights.set(annotationId, el)
    }
  })

  // 2. 获取当前页面的标注
  const annotations = getCurrentPageAnnotations()
  
  // 如果没有标注，直接清理并返回
  if (annotations.length === 0) {
    existingHighlights.forEach((el) => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    })
    return
  }
  
  // 3. 只处理可见的文本节点，避免重复渲染
  const vpContent = document.querySelector('.VPContent')
  if (!vpContent) return
  
  // 4. 处理每个标注
  annotations.forEach(annotation => {
    try {
      // 如果已经存在高亮且颜色正确，跳过
      let existing = existingHighlights.get(annotation.id)
      
      if (existing) {
        // 检查颜色是否需要更新
        const color = colorOptions.find(c => c.id === annotation.color)
        const currentColor = existing.style.backgroundColor
        if (currentColor === (color?.rgba || '#FFFF00')) {
          // 即使颜色正确，也更新title属性
          const annotationNotes = annotation.notes || annotation.text
          existing.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
          existingHighlights.delete(annotation.id) // 标记为已处理
          return
        }
        // 更新颜色和title
        existing.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
        const annotationNotes = annotation.notes || annotation.text
        existing.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
        existingHighlights.delete(annotation.id) // 标记为已处理
        return
      }
      
      // 检查是否已经有对应标注ID的高亮元素
      const existingHighlight = document.querySelector(`[data-annotation-id="${annotation.id}"]`)
      if (existingHighlight) {
        // 高亮元素已存在，更新颜色和title
        const color = colorOptions.find(c => c.id === annotation.color)
        existingHighlight.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
        const annotationNotes = annotation.notes || annotation.text
        existingHighlight.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
        existingHighlights.delete(annotation.id) // 标记为已处理
        return
      }
      
      // 重新收集文本节点，因为之前的可能已经被修改
      const freshTextNodes = []
      const freshWalker = document.createTreeWalker(
        vpContent,
        NodeFilter.SHOW_TEXT,
        { 
          acceptNode: node => {
            if (!node.parentElement) return NodeFilter.FILTER_SKIP
            
            // 检查是否在排除区域内
            let parent = node.parentElement
            while (parent) {
              if (parent.classList.contains('content-body') && 
                  parent.parentElement?.classList.contains('content')) {
                return NodeFilter.FILTER_SKIP
              }
              
              if (/^h[1-6]$/i.test(parent.tagName)) {
                return NodeFilter.FILTER_SKIP
              }
              parent = parent.parentElement
            }
            
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )

      let freshNode
      while ((freshNode = freshWalker.nextNode())) {
        freshTextNodes.push(freshNode)
      }
      
      // 寻找匹配的文本 - 支持跨多个文本节点的情况
      let matchedNodes: Text[] = []
      let matchedText = ''
      let bestMatchScore = 0
      
      // 尝试单节点匹配（优先）
      for (const textNode of freshTextNodes) {
        const text = textNode.textContent || ''
        
        // 检查文本是否包含标注文本
        if (!text.includes(annotation.text)) {
          continue
        }
        
        // 尝试解析位置信息
        let matchScore = 0
        try {
          const startContainer = JSON.parse(annotation.position.startContainer)
          const startInfo = startContainer.start
          
          // 检查文本节点是否与起始位置信息匹配
          if (text.startsWith(startInfo.text)) {
            // 起始文本精确匹配，加分
            matchScore += 10
            
            // 检查起始偏移量是否匹配
            const index = text.indexOf(annotation.text)
            if (index === startInfo.offset) {
              // 偏移量精确匹配，加分
              matchScore += 20
            } else if (Math.abs(index - startInfo.offset) < 10) {
              // 偏移量接近匹配，少量加分
              matchScore += 5
            }
          } else if (text.includes(startInfo.text)) {
            // 起始文本部分匹配，少量加分
            matchScore += 3
          }
        } catch (err) {
          // 位置信息解析失败，使用基本匹配
          matchScore = 1
        }
        
        // 如果找到更好的匹配，更新目标节点
        if (matchScore > bestMatchScore) {
          bestMatchScore = matchScore
          matchedNodes = [textNode]
          matchedText = text
        }
      }
      
      // 如果没有找到单节点匹配，尝试跨节点匹配
      if (matchedNodes.length === 0) {
        let currentText = ''
        let tempNodes: Text[] = []
        
        // 遍历所有文本节点，寻找连续的文本片段
        for (const textNode of freshTextNodes) {
          const text = textNode.textContent || ''
          currentText += text
          tempNodes.push(textNode)
          
          // 检查累积的文本是否包含标注文本
          if (currentText.includes(annotation.text)) {
            matchedNodes = tempNodes
            matchedText = currentText
            break
          }
          
          // 如果累积的文本过长，重置
          if (currentText.length > annotation.text.length * 2) {
            currentText = text
            tempNodes = [textNode]
          }
        }
      }
      
      // 如果没有找到匹配的节点，跳过
      if (matchedNodes.length === 0) {
        return
      }
      
      // 处理匹配结果
      if (matchedNodes.length === 1) {
        // 单节点匹配
        const textNode = matchedNodes[0]
        
        const text = textNode.textContent || ''
        let index = -1
        
        // 优先使用标注中保存的精确偏移量
        try {
          // 尝试解析位置信息，获取精确的起始偏移量
          const startContainer = JSON.parse(annotation.position.startContainer)
          const startInfo = startContainer.start
          // 使用保存的偏移量作为索引
          index = startInfo.offset
          
          // 验证偏移量是否有效
          if (index < 0 || index + annotation.text.length > text.length) {
            // 如果偏移量无效，回退到indexOf
            index = text.indexOf(annotation.text)
          }
        } catch (err) {
          // 位置信息解析失败，回退到indexOf
          index = text.indexOf(annotation.text)
        }
        
        if (index === -1) return
        
        // 设置title为标注内容的前20个字符，超出部分用……代替
        const annotationNotes = annotation.notes || annotation.text
        
        // 创建高亮元素
        const span = document.createElement('span')
        span.className = 'text-highlight'
        span.dataset.annotationId = annotation.id // 添加标注ID
        const color = colorOptions.find(c => c.id === annotation.color)
        span.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
        span.style.borderRadius = '2px'
        span.style.padding = '0 2px'
        span.style.cursor = 'pointer'
        span.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
        
        // 分割文本节点
        const beforeText = text.substring(0, index)
        const highlightedText = text.substring(index, index + annotation.text.length)
        const afterText = text.substring(index + annotation.text.length)
        
        // 创建新的文本节点和高亮节点
        if (beforeText) {
          textNode.parentNode?.insertBefore(document.createTextNode(beforeText), textNode)
        }
        
        span.appendChild(document.createTextNode(highlightedText))
        textNode.parentNode?.insertBefore(span, textNode)
        
        if (afterText) {
          textNode.parentNode?.insertBefore(document.createTextNode(afterText), textNode)
        }
        
        // 删除原有的文本节点
        textNode.parentNode?.removeChild(textNode)
      } else {
        // 跨节点匹配
        const index = matchedText.indexOf(annotation.text)
        if (index === -1) return
        
        // 设置title为标注内容的前20个字符，超出部分用……代替
        const annotationNotes = annotation.notes || annotation.text
        
        let currentPosition = 0
        
        // 遍历匹配的节点
        for (const textNode of matchedNodes) {
          const text = textNode.textContent || ''
          const nodeStart = currentPosition
          const nodeEnd = currentPosition + text.length
          
          // 检查当前节点是否与高亮范围重叠
          if (nodeStart < index + annotation.text.length && nodeEnd > index) {
            // 计算在当前节点中的高亮范围
            const highlightStart = Math.max(0, index - nodeStart)
            const highlightEnd = Math.min(text.length, index + annotation.text.length - nodeStart)
            
            // 分割文本节点
            if (highlightStart > 0) {
              const beforeText = text.substring(0, highlightStart)
              textNode.parentNode?.insertBefore(document.createTextNode(beforeText), textNode)
            }
            
            const highlightedText = text.substring(highlightStart, highlightEnd)
            const highlightPart = document.createElement('span')
            highlightPart.className = 'text-highlight'
            highlightPart.dataset.annotationId = annotation.id
            const color = colorOptions.find(c => c.id === annotation.color)
            highlightPart.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
            highlightPart.style.borderRadius = '2px'
            highlightPart.style.padding = '0 2px'
            highlightPart.style.cursor = 'pointer'
            highlightPart.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
            highlightPart.appendChild(document.createTextNode(highlightedText))
            textNode.parentNode?.insertBefore(highlightPart, textNode)
            
            if (highlightEnd < text.length) {
              const afterText = text.substring(highlightEnd)
              textNode.parentNode?.insertBefore(document.createTextNode(afterText), textNode)
            }
            
            // 删除原有的文本节点
            textNode.parentNode?.removeChild(textNode)
          }
          
          currentPosition = nodeEnd
        }
      }
      
      // 标记为已处理
      existingHighlights.delete(annotation.id)
    } catch (error) {
      console.error('渲染标注失败:', error)
    }
  })
  
  // 7. 只删除不再需要的高亮元素
  existingHighlights.forEach((el, key) => {
    // 只删除不再需要的元素，排除当前标注ID
    const isStillNeeded = annotations.some(anno => anno.id === key)
    if (!isStillNeeded) {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    }
  })
}

// 添加点击事件监听
const addClickListeners = () => {
  document.querySelectorAll('.text-highlight').forEach(element => {
    element.addEventListener('click', (event) => {
      event.stopPropagation()
      const text = element.textContent || ''
      
      // 点击高亮文本时，触发自定义事件，通知TextSelectionMenu组件打开菜单
      const customEvent = new CustomEvent('highlight-click', {
        detail: {
          text: text,
          element: element,
          annotationId: element.dataset.annotationId
        },
        bubbles: true,
        composed: true
      })
      
      event.currentTarget?.dispatchEvent(customEvent)
    })
  })
}

// 监听页面变化
onMounted(() => {
  // 初始化当前页面 URL
  currentPageUrl = window.location.pathname
  
  // 初始渲染
  renderAnnotations()
  addClickListeners()
  
  // 添加 URL 变化检测定时器
  urlCheckInterval = window.setInterval(handleUrlChange, 300)
  
  // 监听路由变化
  // 1. 监听 popstate 事件（浏览器前进/后退）
  window.addEventListener('popstate', handleRouteChange)
  
  // 2. 监听 hashchange 事件（URL哈希变化）
  window.addEventListener('hashchange', handleRouteChange)
  
  // 3. 监听 VitePress 路由变化（通过事件总线）
  window.addEventListener('vitepress:route-changed', handleRouteChange)
  
  // 4. 监听页面加载完成事件
  window.addEventListener('load', () => {
    setTimeout(() => {
      renderAnnotations()
      addClickListeners()
    }, 100)
  })
  
  onUnmounted(() => {
    // 清除定时器
    if (urlCheckInterval !== null) {
      clearInterval(urlCheckInterval)
      urlCheckInterval = null
    }
    
    clearTimeout((window as any).annotationRenderTimeout)
    window.removeEventListener('popstate', handleRouteChange)
    window.removeEventListener('hashchange', handleRouteChange)
    window.removeEventListener('vitepress:route-changed', handleRouteChange)
  })
})

// 处理路由变化
const handleRouteChange = () => {
  // 等待页面内容完全加载后再渲染
  waitForPageLoad().then(() => {
    setTimeout(() => {
      renderAnnotations()
      addClickListeners()
    }, 200) // 额外延迟，确保所有内容都已就绪
  })
}

// 监听标注变化
watch(getCurrentPageAnnotations, () => {
  renderAnnotations()
  addClickListeners()
}, { deep: true })
</script>

<style scoped>
.annotation-renderer {
  display: none;
}

:deep(.text-highlight:hover) {
  opacity: 0.9;
}
</style>