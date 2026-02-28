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
      const freshTextNodes: Text[] = []
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
        freshTextNodes.push(freshNode as Text)
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
      
      // 优先使用标注中保存的位置信息来精确定位
      const text = annotation.text
      if (!text) return
      
      // 尝试使用位置信息进行精确匹配
      try {
        const startContainer = JSON.parse(annotation.position.startContainer)
        const startInfo = startContainer.start
        const endContainer = JSON.parse(annotation.position.endContainer)
        const endInfo = endContainer.end
        
        // 遍历文本节点，寻找与起始位置信息匹配的节点
        let bestMatchNode = null
        let bestMatchScore = 0
        
        for (const textNode of freshTextNodes) {
          const nodeText = textNode.textContent || ''
          let matchScore = 0
          
          // 检查文本是否以起始文本开头
          if (nodeText.startsWith(startInfo.text)) {
            matchScore += 20
          } else if (nodeText.includes(startInfo.text)) {
            matchScore += 10
          }
          
          // 检查偏移量是否接近
          const index = nodeText.indexOf(text)
          if (index !== -1) {
            const offsetDiff = Math.abs(index - startInfo.offset)
            if (offsetDiff === 0) {
              matchScore += 30
            } else if (offsetDiff < 5) {
              matchScore += 20
            } else if (offsetDiff < 10) {
              matchScore += 10
            }
          }
          
          // 检查文本长度是否接近
          const lengthDiff = Math.abs(nodeText.length - (startInfo.text?.length || 0))
          if (lengthDiff < 10) {
            matchScore += 5
          }
          
          // 更新最佳匹配
          if (matchScore > bestMatchScore) {
            bestMatchScore = matchScore
            bestMatchNode = textNode
          }
        }
        
        // 如果找到了最佳匹配节点
        if (bestMatchNode && bestMatchScore > 15) {
          const nodeText = bestMatchNode.textContent || ''
          let index = -1
          
          // 优先使用保存的偏移量
          if (startInfo.offset >= 0 && startInfo.offset + text.length <= nodeText.length) {
            // 验证保存的偏移量是否对应正确的文本
            if (nodeText.substring(startInfo.offset, startInfo.offset + text.length) === text) {
              index = startInfo.offset
            }
          }
          
          // 如果保存的偏移量无效，使用indexOf
          if (index === -1) {
            index = nodeText.indexOf(text)
          }
          
          if (index !== -1) {
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
            
            // 尝试使用Range API来保留HTML结构
            try {
              const range = document.createRange()
              range.setStart(bestMatchNode, index)
              range.setEnd(bestMatchNode, index + text.length)
              
              const fragment = range.extractContents()
              span.appendChild(fragment)
              range.insertNode(span)
            } catch (error) {
              // 如果Range API失败，回退到文本节点
              // 分割文本节点
              const beforeText = nodeText.substring(0, index)
              const highlightedText = nodeText.substring(index, index + text.length)
              const afterText = nodeText.substring(index + text.length)
              
              // 创建新的文本节点和高亮节点
              if (beforeText) {
                bestMatchNode.parentNode?.insertBefore(document.createTextNode(beforeText), bestMatchNode)
              }
              
              span.appendChild(document.createTextNode(highlightedText))
              bestMatchNode.parentNode?.insertBefore(span, bestMatchNode)
              
              if (afterText) {
                bestMatchNode.parentNode?.insertBefore(document.createTextNode(afterText), bestMatchNode)
              }
              
              // 删除原有的文本节点
              bestMatchNode.parentNode?.removeChild(bestMatchNode)
            }
            
            // 为高亮元素添加点击事件
            span.addEventListener('click', (event) => {
              event.stopPropagation()
              const text = span.textContent || ''
              
              // 触发自定义事件，通知TextSelectionMenu组件打开菜单
              const customEvent = new CustomEvent('highlight-click', {
                detail: {
                  text: text,
                  element: span,
                  annotationId: span.dataset.annotationId
                },
                bubbles: true,
                composed: true
              })
              
              event.currentTarget?.dispatchEvent(customEvent)
            })
            
            // 标记为已处理
            existingHighlights.delete(annotation.id)
            return
          }
        }
      } catch (error) {
        console.error('位置信息解析失败:', error)
      }
      
      // 如果位置信息匹配失败，使用XPath进行精确匹配
      try {
        // 尝试解析位置信息
        const startContainer = JSON.parse(annotation.position.startContainer)
        const startInfo = startContainer.start
        
        // 创建更精确的XPath表达式，包含起始文本信息
        const startText = startInfo.text?.substring(0, 20) || ''
        if (startText) {
          // 优先搜索代码块元素
          const codeXpathExpression = `//code[contains(text(), '${startText}')] | //pre[contains(text(), '${startText}')]`
          const codeResult = document.evaluate(codeXpathExpression, vpContent, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
          
          let targetElement = null
          let targetRange = null
          
          // 先检查代码块元素
          for (let i = 0; i < codeResult.snapshotLength; i++) {
            const element = codeResult.snapshotItem(i) as Element
            const elementText = element.textContent || ''
            
            if (elementText.includes(text)) {
              // 创建范围来包含标注文本
              const range = document.createRange()
              const textNode = Array.from(element.childNodes).find(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent?.includes(text)
              ) as Text
              
              if (textNode) {
                // 优先使用保存的偏移量
                let startOffset = startInfo.offset
                
                // 验证偏移量是否有效
                if (startOffset < 0 || startOffset + text.length > (textNode.textContent?.length || 0)) {
                  // 如果偏移量无效，使用indexOf
                  startOffset = textNode.textContent?.indexOf(text) || 0
                }
                
                // 验证偏移量对应的文本是否正确
                if (textNode.textContent?.substring(startOffset, startOffset + text.length) === text) {
                  const endOffset = startOffset + text.length
                  
                  range.setStart(textNode, startOffset)
                  range.setEnd(textNode, endOffset)
                  targetElement = element
                  targetRange = range
                  break
                }
              }
            }
          }
          
          // 如果没有找到代码块元素，搜索所有元素
          if (!targetRange) {
            const xpathExpression = `//*[contains(text(), '${startText}')]`
            const result = document.evaluate(xpathExpression, vpContent, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
            
            // 遍历结果，找到最精确的匹配
            for (let i = 0; i < result.snapshotLength; i++) {
              const element = result.snapshotItem(i) as Element
              const elementText = element.textContent || ''
              
              if (elementText.includes(text)) {
                // 创建范围来包含标注文本
                const range = document.createRange()
                const textNode = Array.from(element.childNodes).find(node => 
                  node.nodeType === Node.TEXT_NODE && node.textContent?.includes(text)
                ) as Text
                
                if (textNode) {
                  // 优先使用保存的偏移量
                  let startOffset = startInfo.offset
                  
                  // 验证偏移量是否有效
                  if (startOffset < 0 || startOffset + text.length > (textNode.textContent?.length || 0)) {
                    // 如果偏移量无效，使用indexOf
                    startOffset = textNode.textContent?.indexOf(text) || 0
                  }
                  
                  // 验证偏移量对应的文本是否正确
                  if (textNode.textContent?.substring(startOffset, startOffset + text.length) === text) {
                    const endOffset = startOffset + text.length
                    
                    range.setStart(textNode, startOffset)
                    range.setEnd(textNode, endOffset)
                    targetElement = element
                    targetRange = range
                    break
                  }
                }
              }
            }
          }
          
          // 如果找到了目标范围，使用它来创建高亮
          if (targetRange) {
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
            
            // 提取范围内容并添加到高亮元素
            const fragment = targetRange.extractContents()
            span.appendChild(fragment)
            
            // 插入高亮元素
            targetRange.insertNode(span)
            
            // 为高亮元素添加点击事件
            span.addEventListener('click', (event) => {
              event.stopPropagation()
              const text = span.textContent || ''
              
              // 触发自定义事件，通知TextSelectionMenu组件打开菜单
              const customEvent = new CustomEvent('highlight-click', {
                detail: {
                  text: text,
                  element: span,
                  annotationId: span.dataset.annotationId
                },
                bubbles: true,
                composed: true
              })
              
              event.currentTarget?.dispatchEvent(customEvent)
            })
            
            // 标记为已处理
            existingHighlights.delete(annotation.id)
            return
          }
        }
      } catch (error) {
        console.error('XPath查找失败:', error)
      }
      
      // 增强代码块支持：直接在整个VPContent中搜索文本，包括代码块
      try {
        // 首先尝试直接在VPContent中查找包含标注文本的元素
        // 包括代码块中的文本
        const allElements = vpContent.querySelectorAll('*')
        let targetElement = null
        let targetTextNode = null
        let targetIndex = -1
        
        // 遍历所有元素，寻找包含标注文本的元素
        for (const element of allElements) {
          // 检查元素是否包含标注文本
          if (element.textContent?.includes(text)) {
            // 检查是否是代码块相关元素
            const isCodeBlock = element.tagName.toLowerCase() === 'code' || element.tagName.toLowerCase() === 'pre'
            
            // 优先选择代码块元素
            if (isCodeBlock) {
              // 在代码块中查找文本节点
              const textNodes = []
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)
              let node
              while ((node = walker.nextNode())) {
                textNodes.push(node)
              }
              
              // 检查每个文本节点是否包含标注文本
              for (const textNode of textNodes) {
                const nodeText = textNode.textContent || ''
                const index = nodeText.indexOf(text)
                if (index !== -1) {
                  targetElement = element
                  targetTextNode = textNode
                  targetIndex = index
                  break
                }
              }
              
              if (targetTextNode) break
            }
          }
        }
        
        // 如果找到了目标文本节点
        if (targetTextNode && targetIndex !== -1) {
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
          
          // 尝试使用Range API来保留HTML结构
          try {
            const range = document.createRange()
            range.setStart(targetTextNode, targetIndex)
            range.setEnd(targetTextNode, targetIndex + text.length)
            
            const fragment = range.extractContents()
            span.appendChild(fragment)
            range.insertNode(span)
          } catch (error) {
            // 如果Range API失败，回退到文本节点
            const nodeText = targetTextNode.textContent || ''
            const beforeText = nodeText.substring(0, targetIndex)
            const highlightedText = nodeText.substring(targetIndex, targetIndex + text.length)
            const afterText = nodeText.substring(targetIndex + text.length)
            
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
          }
          
          // 为高亮元素添加点击事件
          span.addEventListener('click', (event) => {
            event.stopPropagation()
            const text = span.textContent || ''
            
            // 触发自定义事件，通知TextSelectionMenu组件打开菜单
            const customEvent = new CustomEvent('highlight-click', {
              detail: {
                text: text,
                element: span,
                annotationId: span.dataset.annotationId
              },
              bubbles: true,
              composed: true
            })
            
            event.currentTarget?.dispatchEvent(customEvent)
          })
          
          // 标记为已处理
          existingHighlights.delete(annotation.id)
          return
        }
      } catch (error) {
        console.error('代码块处理失败:', error)
      }
      
      // 如果上述方法都失败，回退到原有的文本节点匹配方法，但添加更精确的匹配逻辑
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
          } else {
            // 验证偏移量对应的文本是否正确
            if (text.substring(index, index + annotation.text.length) !== annotation.text) {
              index = text.indexOf(annotation.text)
            }
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
        
        // 尝试使用Range API来保留HTML结构
        try {
          const range = document.createRange()
          range.setStart(textNode, index)
          range.setEnd(textNode, index + annotation.text.length)
          
          const fragment = range.extractContents()
          span.appendChild(fragment)
          range.insertNode(span)
        } catch (error) {
          // 如果Range API失败，回退到文本节点
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
        
        // 为高亮元素添加点击事件
        span.addEventListener('click', (event) => {
          event.stopPropagation()
          const text = span.textContent || ''
          
          // 触发自定义事件，通知TextSelectionMenu组件打开菜单
          const customEvent = new CustomEvent('highlight-click', {
            detail: {
              text: text,
              element: span,
              annotationId: span.dataset.annotationId
            },
            bubbles: true,
            composed: true
          })
          
          event.currentTarget?.dispatchEvent(customEvent)
        })
      } else {
        // 跨节点匹配
        // 创建一个容器元素来包裹所有高亮文本
        const container = document.createElement('span')
        container.className = 'text-highlight'
        container.dataset.annotationId = annotation.id
        const color = colorOptions.find(c => c.id === annotation.color)
        container.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
        container.style.borderRadius = '2px'
        container.style.padding = '0 2px'
        container.style.cursor = 'pointer'
        const annotationNotes = annotation.notes || annotation.text
        container.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
        
        // 直接使用Range API来处理跨节点选择，这与applyHighlight函数的处理方式一致
        try {
          // 找到第一个和最后一个文本节点
          const firstTextNode = matchedNodes[0]
          const lastTextNode = matchedNodes[matchedNodes.length - 1]
          
          // 计算在第一个和最后一个节点中的偏移量
          const text = annotation.text
          const combinedText = matchedNodes.map(node => node.textContent || '').join('')
          const textIndex = combinedText.indexOf(text)
          
          if (textIndex !== -1) {
            // 计算在第一个节点中的起始偏移量
            let cumulativeLength = 0
            let startNode = firstTextNode
            let startOffset = 0
            
            for (const node of matchedNodes) {
              const nodeText = node.textContent || ''
              if (cumulativeLength <= textIndex && textIndex < cumulativeLength + nodeText.length) {
                startNode = node
                startOffset = textIndex - cumulativeLength
                break
              }
              cumulativeLength += nodeText.length
            }
            
            // 计算在最后一个节点中的结束偏移量
            const endIndex = textIndex + text.length
            cumulativeLength = 0
            let endNode = lastTextNode
            let endOffset = 0
            
            for (const node of matchedNodes) {
              const nodeText = node.textContent || ''
              if (cumulativeLength < endIndex && endIndex <= cumulativeLength + nodeText.length) {
                endNode = node
                endOffset = endIndex - cumulativeLength
                break
              }
              cumulativeLength += nodeText.length
            }
            
            // 创建范围
            const range = document.createRange()
            range.setStart(startNode, startOffset)
            range.setEnd(endNode, endOffset)
            
            // 提取内容并添加到容器
            const fragment = range.extractContents()
            container.appendChild(fragment)
            
            // 插入容器
            range.insertNode(container)
          }
        } catch (error) {
          console.error('跨节点Range处理失败:', error)
          // 回退到原有的处理方式，但确保保留HTML结构
          const index = matchedText.indexOf(annotation.text)
          if (index === -1) return
          
          let currentPosition = 0
          let firstNodeParent = null
          let firstNodeNextSibling = null
          
          // 遍历匹配的节点
          for (const textNode of matchedNodes) {
            const text = textNode.textContent || ''
            const nodeStart = currentPosition
            const nodeEnd = currentPosition + text.length
            
            // 保存第一个节点的位置信息，用于后续插入容器
            if (!firstNodeParent) {
              firstNodeParent = textNode.parentNode
              firstNodeNextSibling = textNode.nextSibling
            }
            
            // 检查当前节点是否与高亮范围重叠
            if (nodeStart < index + annotation.text.length && nodeEnd > index) {
              // 计算在当前节点中的高亮范围
              const highlightStart = Math.max(0, index - nodeStart)
              const highlightEnd = Math.min(text.length, index + annotation.text.length - nodeStart)
              
              // 处理前导文本
              if (highlightStart > 0) {
                const beforeText = text.substring(0, highlightStart)
                textNode.parentNode?.insertBefore(document.createTextNode(beforeText), textNode)
              }
              
              // 处理高亮文本 - 尝试保留HTML结构
              try {
                const range = document.createRange()
                range.setStart(textNode, highlightStart)
                range.setEnd(textNode, highlightEnd)
                
                const fragment = range.extractContents()
                container.appendChild(fragment)
              } catch (err) {
                // 如果Range API失败，回退到文本节点
                const highlightedText = text.substring(highlightStart, highlightEnd)
                container.appendChild(document.createTextNode(highlightedText))
              }
              
              // 处理后续文本
              if (highlightEnd < text.length) {
                const afterText = text.substring(highlightEnd)
                textNode.parentNode?.insertBefore(document.createTextNode(afterText), textNode)
              }
              
              // 删除原有的文本节点
              textNode.parentNode?.removeChild(textNode)
            } else {
              // 对于不重叠的节点，保持原样
              currentPosition = nodeEnd
            }
            
            currentPosition = nodeEnd
          }
          
          // 将容器元素插入到第一个匹配节点的位置
          if (firstNodeParent) {
            firstNodeParent.insertBefore(container, firstNodeNextSibling)
          }
        }
        
        // 为容器添加点击事件
        container.addEventListener('click', (event) => {
          event.stopPropagation()
          const text = container.textContent || ''
          
          // 触发自定义事件，通知TextSelectionMenu组件打开菜单
          const customEvent = new CustomEvent('highlight-click', {
            detail: {
              text: text,
              element: container,
              annotationId: container.dataset.annotationId
            },
            bubbles: true,
            composed: true
          })
          
          event.currentTarget?.dispatchEvent(customEvent)
        })
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
        // 保留高亮元素内的所有子节点
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        // 删除高亮元素本身
        parent.removeChild(el)
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