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

// 渲染标注到页面 - 优化版本，避免破坏HTML结构
const renderAnnotations = () => {
  // 1. 先获取所有高亮元素，检查是否需要更新，避免不必要的DOM操作
  const existingHighlights = new Map()
  document.querySelectorAll('.text-highlight').forEach(el => {
    const annotationId = el.dataset.annotationId
    if (annotationId) {
      existingHighlights.set(annotationId, el)
    }
    // 不再兼容旧元素的textContent查找
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
  
  // 4. 一次性收集所有可用的文本节点（在处理任何标注之前）
  const allTextNodes = []
  const walker = document.createTreeWalker(
    vpContent,
    NodeFilter.SHOW_TEXT,
    { 
      acceptNode: node => {
        if (!node.parentElement) return NodeFilter.FILTER_SKIP
        
        // 检查是否在排除区域内: div.content > div.content-body
        let parent = node.parentElement
        while (parent) {
          // 排除特定区域: div.content > div.content-body
          if (parent.classList.contains('content-body') && 
              parent.parentElement?.classList.contains('content')) {
            return NodeFilter.FILTER_SKIP
          }
          
          // 检查是否在标题内
          if (/^h[1-6]$/i.test(parent.tagName)) {
            return NodeFilter.FILTER_SKIP
          }
          parent = parent.parentElement
        }
        
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  let node
  while ((node = walker.nextNode())) {
    allTextNodes.push(node)
  }
  
  // 5. 标记哪些文本节点已经被使用
  const usedTextNodes = new Set()
  
  // 6. 处理每个标注
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
      
      // 寻找匹配的文本节点
      let targetTextNode = null
      let bestMatchScore = 0
      
      // 遍历所有文本节点，寻找最佳匹配
      for (const textNode of allTextNodes) {
        // 跳过已经被使用的节点
        if (usedTextNodes.has(textNode)) {
          continue
        }
        
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
          targetTextNode = textNode
        }
      }
      
      // 如果没有找到匹配的节点，跳过
      if (!targetTextNode) {
        return
      }
      
      // 标记该文本节点为已使用
      usedTextNodes.add(targetTextNode)
      
      const text = targetTextNode.textContent || ''
      const index = text.indexOf(annotation.text)
      if (index === -1) return
      
      // 创建高亮元素
      const span = document.createElement('span')
      span.className = 'text-highlight'
      span.dataset.annotationId = annotation.id // 添加标注ID
      const color = colorOptions.find(c => c.id === annotation.color)
      span.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
      span.style.borderRadius = '2px'
      span.style.padding = '0 2px'
      span.style.cursor = 'pointer'
      // 设置title为标注内容的前20个字符，超出部分用……代替
      const annotationNotes = annotation.notes || annotation.text
      span.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
      
      // 分割文本节点
      const beforeText = text.substring(0, index)
      const highlightedText = text.substring(index, index + annotation.text.length)
      const afterText = text.substring(index + annotation.text.length)
      
      // 创建新的文本节点和高亮节点
      if (beforeText) {
        targetTextNode.parentNode?.insertBefore(document.createTextNode(beforeText), targetTextNode)
      }
      
      span.appendChild(document.createTextNode(highlightedText))
      targetTextNode.parentNode?.insertBefore(span, targetTextNode)
      
      if (afterText) {
        targetTextNode.parentNode?.insertBefore(document.createTextNode(afterText), targetTextNode)
      }
      
      // 删除原有的文本节点
      targetTextNode.parentNode?.removeChild(targetTextNode)
      
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
  // 初始渲染
  renderAnnotations()
  addClickListeners()
  
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
  
  // 优化：减少MutationObserver的监听范围和频率
  const observer = new MutationObserver((mutations) => {
    // 检查是否有任何突变发生在排除区域外
    const hasValidMutation = mutations.some(mutation => {
      // 检查突变目标是否在排除区域内
      let target = mutation.target as Element
      while (target) {
        if (target.classList.contains('content-body') && 
            target.parentElement?.classList.contains('content')) {
          return false // 突变发生在排除区域内，跳过
        }
        target = target.parentElement as Element
      }
      return true // 突变发生在排除区域外，需要处理
    })
    
    if (hasValidMutation) {
      // 使用防抖，减少触发次数
      if ((window as any).annotationRenderTimeout) {
        clearTimeout((window as any).annotationRenderTimeout)
      }
      (window as any).annotationRenderTimeout = setTimeout(() => {
        renderAnnotations()
        addClickListeners()
      }, 200)
    }
  })
  
  // 优化：只监听内容区域，而不是整个body
  const contentElement = document.querySelector('.content') || document.querySelector('.main') || document.body
  observer.observe(contentElement, {
    childList: true,
    subtree: true
  })
  
  onUnmounted(() => {
    observer.disconnect()
    clearTimeout((window as any).annotationRenderTimeout)
    window.removeEventListener('popstate', handleRouteChange)
    window.removeEventListener('hashchange', handleRouteChange)
    window.removeEventListener('vitepress:route-changed', handleRouteChange)
  })
})

// 处理路由变化
const handleRouteChange = () => {
  // 延迟执行，确保页面内容已经更新
  setTimeout(() => {
    renderAnnotations()
    addClickListeners()
  }, 200)
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

/* 高亮样式 */
:deep(.text-highlight) {
  transition: background-color 0.3s ease;
}

:deep(.text-highlight:hover) {
  opacity: 0.9;
}
</style>