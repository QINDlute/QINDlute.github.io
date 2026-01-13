<template>
  <div class="annotation-renderer">
    <!-- 标注会在挂载时自动渲染到页面 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useAnnotations } from '../../composables/useAnnotations'

const { getCurrentPageAnnotations, colorOptions } = useAnnotations()

// 渲染标注到页面 - 优化版本，避免破坏HTML结构
const renderAnnotations = () => {
  // 1. 先获取所有高亮元素，检查是否需要更新，避免不必要的DOM操作
  const existingHighlights = new Map()
  document.querySelectorAll('.text-highlight').forEach(el => {
    existingHighlights.set(el.textContent, el)
  })

  // 2. 获取当前页面的标注
  const annotations = getCurrentPageAnnotations()
  
  // 3. 只处理新的或需要更新的标注
  annotations.forEach(annotation => {
    try {
      // 如果已经存在高亮且颜色正确，跳过
      const existing = existingHighlights.get(annotation.text)
      if (existing) {
        // 检查颜色是否需要更新
        const color = colorOptions.find(c => c.id === annotation.color)
        const currentColor = existing.style.backgroundColor
        if (currentColor === (color?.rgba || '#FFFF00')) {
          existingHighlights.delete(annotation.text) // 标记为已处理
          return
        }
      }
      
      // 4. 只处理可见的文本节点，避免重复渲染
      const textNodes = []
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        { acceptNode: node => node.parentElement && !node.parentElement.closest('.text-highlight') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }
      )
      
      let node
      while ((node = walker.nextNode())) {
        if (node.textContent?.includes(annotation.text)) {
          textNodes.push(node)
        }
      }
      
      // 5. 为匹配的文本节点添加高亮
      textNodes.forEach(textNode => {
        const text = textNode.textContent || ''
        const index = text.indexOf(annotation.text)
        if (index !== -1) {
          // 创建高亮元素
          const span = document.createElement('span')
          span.className = 'text-highlight'
          const color = colorOptions.find(c => c.id === annotation.color)
          span.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
          span.style.borderRadius = '2px'
          span.style.padding = '0 2px'
          span.style.cursor = 'pointer'
          span.title = annotation.notes || annotation.text
          
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
        }
      })
    } catch (error) {
      console.error('渲染标注失败:', error)
    }
  })
  
  // 6. 只删除不再需要的高亮元素
  existingHighlights.forEach((el) => {
    const parent = el.parentNode
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el)
      parent.normalize()
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
          element: element
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
  const observer = new MutationObserver(() => {
    // 使用防抖，减少触发次数
    clearTimeout((window as any).annotationRenderTimeout)
    (window as any).annotationRenderTimeout = setTimeout(() => {
      renderAnnotations()
      addClickListeners()
    }, 200)
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