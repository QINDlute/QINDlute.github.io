<!-- .vitepress/theme/components/TextSelectionMenu.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div
        v-if="isVisible && selection.text"
        ref="menuRef"
        class="text-selection-menu"
        :style="menuStyle"
        @mousedown.stop
        @touchstart.stop
        @click.stop
      >
        <!-- 功能按钮行 -->
        <div class="button-row" v-if="!showNoteInput">
          <button
            v-for="button in functionButtons"
            :key="button.title"
            :title="button.title"
            class="menu-button"
            @click="button.action"
          >
            <span class="icon">{{ button.icon }}</span>
          </button>
        </div>

        <!-- 颜色选择 -->
        <div class="color-picker">
          <div
            v-for="color in colorOptions"
            :key="color.id"
            :class="['color-option', { selected: selectedColor === color.id }]"
            :style="{ backgroundColor: color.rgba }"
            :title="color.name"
            @click="selectColor(color.id)"
          >
            <span class="color-label">A</span>
          </div>
        </div>

        <!-- 标注输入框 -->
        <div v-if="showNoteInput" class="note-input-wrapper">
          <textarea
            ref="noteInputRef"
            v-model="noteText"
            class="note-input"
            placeholder="添加标注..."
            rows="3"
            @keydown.esc="cancelNote"
            @keydown.enter="handleNoteKeydown"
            @keydown.ctrl.enter="saveNote"
          />
          <div class="note-actions">
            <button class="secondary-button" @click="cancelNote">
              取消
            </button>
            <button class="primary-button" @click="saveNote" :disabled="!selectedColor">
              {{ editingAnnotation ? '更新' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useTextSelection } from '../composables/useTextSelection'
import { useAnnotations, type Annotation } from '../composables/useAnnotations'

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖处理后的函数
 */
const debounce = (func: Function, wait: number) => {
  let timeout: number | null = null
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(later, wait)
  }
}

// 组合式函数
const { selection, isVisible, clearSelection, handleCopy } = useTextSelection()
const { 
  colorOptions, 
  addAnnotation, 
  updateAnnotation, 
  removeAnnotation,
  getCurrentPageAnnotations,
  cleanup
} = useAnnotations()

// 响应式数据
const menuRef = ref<HTMLElement>()
const noteInputRef = ref<HTMLTextAreaElement>()
const showNoteInput = ref(false) // 是否显示标注输入框
const selectedColor = ref<string>('yellow')
const noteText = ref('')
const editingAnnotation = ref<Annotation | null>(null)

// 临时高亮相关变量
const tempHighlightRef = ref<HTMLElement | null>(null)
const tempHighlightRange = ref<Range | null>(null)

/**
 * 计算菜单位置和样式
 */
const menuStyle = computed(() => {
  // 菜单宽度（固定）
  const menuWidth = 240
  
  // 动态计算菜单高度
  const menuHeight = showNoteInput.value ? 200 : 116 // 菜单总高度
  
  // 间距配置 - 可根据需求调节
  const BELOW_TEXT_SPACING = 5 // 菜单显示在文本下方时，顶部与文本的间距
  const ABOVE_TEXT_SPACING = 5 // 菜单显示在文本上方时，底部与文本的间距
  const VIEWPORT_MARGIN = 10 // 菜单与视口边缘的最小间距
  const DEFAULT_LINE_HEIGHT = 24 // 默认行高
  
  // 获取当前视口尺寸
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // 获取选中文本的视口坐标
  let left = selection.value.position.x
  let top = selection.value.position.y
  
  // 水平边界检查 - 确保菜单完全在视口内
  // 计算菜单的实际左右边缘位置
  let menuLeftEdge = left - menuWidth / 2
  let menuRightEdge = left + menuWidth / 2
  
  // 调整左侧边界
  if (menuLeftEdge < VIEWPORT_MARGIN) {
    // 菜单左侧超出视口，调整到左侧边缘，保留边距
    left = VIEWPORT_MARGIN + menuWidth / 2
  } 
  // 调整右侧边界
  else if (menuRightEdge > viewportWidth - VIEWPORT_MARGIN) {
    // 菜单右侧超出视口，调整到右侧边缘，保留边距
    left = viewportWidth - VIEWPORT_MARGIN - menuWidth / 2
  }
  
  /**
   * 获取菜单边缘位置
   * @param top 菜单顶部位置
   * @returns 菜单边缘位置对象
   */
  const getMenuEdges = (top: number) => ({
    topEdge: top,
    bottomEdge: top + menuHeight
  });

  // 垂直位置计算 - 确保菜单完全在视口内且不遮挡选中文本
  const textBaseY = selection.value.position.y;
  
  /**
   * 计算选中文本的行高
   * @returns 行高值
   */
  const getLineHeight = (): number => {
    // 优化：减少DOM操作，使用更简单的方法获取行高
    if (selection.value.range) {
      try {
        // 使用getComputedStyle获取父元素的行高
        const range = selection.value.range;
        const commonAncestor = range.commonAncestorContainer;
        const element = commonAncestor.nodeType === Node.TEXT_NODE 
          ? commonAncestor.parentElement 
          : commonAncestor as Element;
        
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          const lineHeight = computedStyle.lineHeight;
          // 如果是具体数值，直接返回
          if (!isNaN(parseFloat(lineHeight))) {
            return parseFloat(lineHeight);
          }
        }
      } catch (error) {
        console.warn('获取行高失败，使用默认值:', error);
      }
    }
    // 如果没有range或获取失败，使用默认行高
    return DEFAULT_LINE_HEIGHT;
  };
  
  const lineHeight = getLineHeight();
  let targetTop = textBaseY + BELOW_TEXT_SPACING; // 菜单显示在文本下方时，顶部与文本的间距

  let { topEdge, bottomEdge } = getMenuEdges(targetTop);
  const isBelowOutOfViewport = bottomEdge > viewportHeight - VIEWPORT_MARGIN;

  if (isBelowOutOfViewport) {
    targetTop = textBaseY - menuHeight - ABOVE_TEXT_SPACING - lineHeight; // 使用动态计算的行高

    targetTop = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        targetTop,
        viewportHeight - VIEWPORT_MARGIN - menuHeight
      ) 
    );
  }

  const finalTop = Math.max(
    VIEWPORT_MARGIN,
    Math.min(targetTop, viewportHeight - menuHeight - VIEWPORT_MARGIN)
  );
  
  return {
    left: `${left}px`,
    top: `${finalTop}px`,
    width: `${menuWidth}px`,
    transform: 'translateX(-50%)', // 保持水平居中
    position: 'fixed', // 使用固定定位，相对于视口
    zIndex: 99999 // 确保在最上层
  }
})



/**
 * 功能按钮配置
 */
const functionButtons = [
  {
    title: '复制',
    icon: '📋',
    action: () => {
      handleCopy()
      clearSelection()
    }
  },
  {
    title: '搜索',
    icon: '🔍',
    action: () => {
      const text = selection.value.text
      if (text) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, '_blank')
      }
      clearSelection()
    }
  },
  {
    title: '标注',
    icon: '📝',
    action: () => {
      // 保存当前范围，用于创建临时高亮
      const winSelection = window.getSelection()
      if (winSelection && !winSelection.isCollapsed) {
        tempHighlightRange.value = winSelection.getRangeAt(0).cloneRange()
        
        // 创建临时高亮
        const tempSpan = document.createElement('span')
        tempSpan.className = 'text-highlight-temp'
        tempSpan.style.backgroundColor = 'rgba(234, 179, 8, 0.15)' // 临时高亮颜色（淡色）
        tempSpan.style.borderRadius = '2px'
        tempSpan.style.padding = '0 2px'
        tempSpan.style.transition = 'background-color 0.3s ease'
        
        // 应用临时高亮
        if (tempHighlightRange.value) {
          const fragment = tempHighlightRange.value.extractContents()
          tempSpan.appendChild(fragment)
          tempHighlightRange.value.insertNode(tempSpan)
          tempHighlightRef.value = tempSpan
        }
      }
      
      showNoteInput.value = true
      nextTick(() => {
        noteInputRef.value?.focus()
      })
    }
  },
  {
    title: '定义',
    icon: '📚',
    action: () => {
      const text = selection.value.text
      if (text) {
        window.open(`https://www.merriam-webster.com/dictionary/${encodeURIComponent(text)}`, '_blank')
      }
      clearSelection()
    }
  },
  {
    title: '取消高亮',
    icon: '🧼',
    action: () => {
      const currentSelection = selection.value
      
      // 如果有标注ID，只删除指定ID的标注
      if (currentSelection.annotationId) {
        // 查找并移除指定ID的标注
        removeAnnotation(currentSelection.annotationId)
        
        // 清除页面上对应ID的所有高亮元素
        const highlights = document.querySelectorAll(`.text-highlight[data-annotation-id="${currentSelection.annotationId}"]`)
        highlights.forEach(highlight => {
          const parent = highlight.parentNode
          if (parent) {
            const textNode = document.createTextNode(highlight.textContent || '')
            parent.replaceChild(textNode, highlight)
            parent.normalize()
          }
        })
      }
      
      clearSelection()
    }
  }
]

/**
 * 选择高亮颜色
 * @param colorId 颜色ID
 */
const selectColor = (colorId: string) => {
  // 保存原始颜色，用于取消编辑时恢复
  const originalColor = selectedColor.value
  
  selectedColor.value = colorId
  
  // 如果显示标注输入框
  if (showNoteInput.value) {
    handleColorChangeForNoteInput(colorId)
  } else {
    // 如果不显示标注输入框，直接创建高亮
    createHighlight()
  }
}

/**
 * 处理标注输入框状态下的颜色变化
 * @param colorId 颜色ID
 */
const handleColorChangeForNoteInput = (colorId: string) => {
  // 情况1：正在编辑现有标注
  if (editingAnnotation.value && selection.value.annotationId) {
    updateExistingAnnotationColor(colorId)
  }
  // 情况2：正在创建新标注（有临时高亮）
  else if (tempHighlightRef.value) {
    updateTemporaryHighlightColor(colorId)
  }
}

/**
 * 更新现有标注的颜色
 * @param colorId 颜色ID
 */
const updateExistingAnnotationColor = (colorId: string) => {
  // 查找颜色信息
  const colorInfo = colorOptions.find(c => c.id === colorId)
  if (colorInfo && selection.value.annotationId) {
    // 立即更新DOM中高亮元素的颜色（预览效果）
    const highlight = document.querySelector(`[data-annotation-id="${selection.value.annotationId}"]`)
    if (highlight) {
      highlight.style.backgroundColor = colorInfo.rgba
    }
  }
}

/**
 * 更新临时高亮的颜色
 * @param colorId 颜色ID
 */
const updateTemporaryHighlightColor = (colorId: string) => {
  // 查找颜色信息
  const colorInfo = colorOptions.find(c => c.id === colorId)
  if (colorInfo && tempHighlightRef.value) {
    // 更新临时高亮颜色
    tempHighlightRef.value.style.backgroundColor = colorInfo.rgba
    tempHighlightRef.value.style.opacity = '0.7' // 临时高亮稍微降低不透明度，与永久高亮区分
  }
}

const createHighlight = () => {
  if (!selection.value.text || !selectedColor.value) return

  try {
    // 确保有有效的范围
    let range = selection.value.range
    
    // 优先使用临时高亮范围（如果存在）
    if (tempHighlightRange.value && !tempHighlightRange.value.collapsed) {
      range = tempHighlightRange.value
    }
    
    // 对于点击高亮文本打开的菜单，range为null，需要从当前选择重新获取
    if (!range || range.collapsed) {
      // 尝试从当前选择重新获取范围
      const winSelection = window.getSelection()
      if (winSelection && !winSelection.isCollapsed) {
        range = winSelection.getRangeAt(0)
        selection.value.range = range
      } else {
        // 如果是编辑现有标注，不需要有效的范围
        if (editingAnnotation.value) {
          // 更新现有标注
          updateAnnotation(editingAnnotation.value.id, {
            color: selectedColor.value,
            notes: noteText.value,
            updatedAt: new Date()
          })
          
          // 更新DOM中的高亮颜色，只更新当前标注ID对应的高亮
          if (selection.value.annotationId) {
            const highlight = document.querySelector(`[data-annotation-id="${selection.value.annotationId}"]`)
            if (highlight) {
              const colorInfo = colorOptions.find(c => c.id === selectedColor.value)
              highlight.style.backgroundColor = colorInfo ? colorInfo.rgba : '#FFFF00'
            }
          }
          
          clearSelection()
          showNoteInput.value = false
          noteText.value = ''
          return
        }
        
        console.error('没有有效的选择范围')
        return
      }
    }

    // 如果没有选择颜色，默认使用黄色
    const finalColor = selectedColor.value || 'yellow'
    
    const annotation = addAnnotation({
      type: 'highlight',
      color: finalColor,
      text: selection.value.text,
      range: range,
      notes: noteText.value
    })

    // 应用高亮到 DOM，并传递 annotationId 和最终颜色
    applyHighlight(range, finalColor, annotation.id)
    
    clearSelection()
    showNoteInput.value = false
    noteText.value = ''
  } catch (error) {
    console.error('创建高亮失败:', error)
  }
}

/**
 * 应用高亮到DOM
 * @param range 选择范围
 * @param color 高亮颜色
 * @param annotationId 标注ID
 */
const applyHighlight = (range: Range, color: string, annotationId: string) => {
  // 创建高亮元素
  const span = document.createElement('span')
  span.className = 'text-highlight'
  span.dataset.annotationId = annotationId // 添加标注ID
  
  // 确保能找到颜色
  const colorInfo = colorOptions.find(c => c.id === color)
  span.style.backgroundColor = colorInfo ? colorInfo.rgba : '#FFFF00' // 默认黄色
  span.style.borderRadius = '2px'
  span.style.padding = '0 2px'
  span.style.cursor = 'pointer'
  span.style.transition = 'background-color 0.3s ease'
  
  // 设置title为标注内容的前20个字符，超出部分用……代替
  const annotationNotes = noteText.value || ''
  span.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
  
  try {
    // 直接使用当前范围，不进行复杂的重新定位
    if (!range.collapsed) {
      // 使用更可靠的方法处理范围
      const fragment = range.extractContents()
      span.appendChild(fragment)
      range.insertNode(span)
      
      // 为新添加的高亮立即添加点击事件
      span.addEventListener('click', handleHighlightClickEvent)
    }
  } catch (error) {
    console.error('应用高亮失败:', error)
    // 简化失败处理，减少性能开销
  }
}

/**
 * 处理高亮元素点击事件
 * @param event 点击事件
 */
const handleHighlightClickEvent = (event: MouseEvent) => {
  event.stopPropagation()
  const span = event.currentTarget as HTMLElement
  const text = span.textContent || ''
  
  // 触发自定义事件，通知打开菜单
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
}

const saveNote = () => {
  // 使用文本而不是范围作为检查条件，确保在范围失效时仍能正常工作
  if (!selection.value.text) return
  
  if (editingAnnotation.value) {
    // 更新现有标注
    updateAnnotation(editingAnnotation.value.id, { notes: noteText.value, color: selectedColor.value })
    
    // 更新DOM中的高亮颜色和注释，只更新当前标注ID对应的高亮
      if (selection.value.annotationId) {
        const highlight = document.querySelector(`[data-annotation-id="${selection.value.annotationId}"]`)
        if (highlight) {
          const color = colorOptions.find(c => c.id === selectedColor.value)
          highlight.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
          // 设置title为标注内容的前20个字符，超出部分用……代替
          const annotationNotes = noteText.value || selection.value.text
          highlight.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
        }
      }
    
    // 先重置编辑状态，再关闭菜单，避免watch监听器触发颜色恢复逻辑
    editingAnnotation.value = null
    originalColorForEditing = ''
    showNoteInput.value = false
    noteText.value = ''
    isVisible.value = false
  } else {
    // 如果标注内容为空，取消临时高亮并退出
    if (!noteText.value.trim()) {
      // 调用cancelNote函数处理临时高亮移除和状态重置
      cancelNote()
      return
    }
    
    // 1. 直接将临时高亮转换为永久高亮（如果存在）
    if (tempHighlightRef.value) {
      // 查找颜色信息
      const finalColor = selectedColor.value || 'yellow'
      const colorInfo = colorOptions.find(c => c.id === finalColor)
      
      // 直接修改临时高亮元素为永久高亮
      tempHighlightRef.value.className = 'text-highlight' // 更改为永久高亮类名
      tempHighlightRef.value.style.opacity = '1' // 恢复完全不透明度
      tempHighlightRef.value.style.backgroundColor = colorInfo ? colorInfo.rgba : '#FFFF00' // 设置永久高亮颜色
      
      // 2. 创建标注并添加ID
      const annotation = addAnnotation({
        type: 'highlight',
        color: finalColor,
        text: selection.value.text,
        range: tempHighlightRange.value || selection.value.range,
        notes: noteText.value
      })
      
      // 3. 添加标注ID到高亮元素
      tempHighlightRef.value.dataset.annotationId = annotation.id
      
      // 4. 设置title为标注内容的前20个字符，超出部分用……代替
      const annotationNotes = noteText.value || ''
      tempHighlightRef.value.title = annotationNotes.length > 20 ? `${annotationNotes.substring(0, 20)}……` : annotationNotes
      
      // 4. 添加点击事件
      const highlightElement = tempHighlightRef.value
      highlightElement.addEventListener('click', (event) => {
        event.stopPropagation()
        const text = highlightElement.textContent || ''
        
        // 触发自定义事件，通知打开菜单
        const customEvent = new CustomEvent('highlight-click', {
          detail: {
            text: text,
            element: highlightElement,
            annotationId: annotation.id
          },
          bubbles: true,
          composed: true
        })
        
        event.currentTarget?.dispatchEvent(customEvent)
      })
      
      // 5. 重置临时高亮引用
      tempHighlightRef.value = null
    } else {
      // 如果没有临时高亮，直接创建永久高亮
      createHighlight()
    }
    
    // 关闭标注窗口
    isVisible.value = false
    showNoteInput.value = false
    noteText.value = ''
    clearSelection()
  }
  
  // 重置临时高亮相关变量
  tempHighlightRange.value = null
}

// 保存原始颜色，用于取消编辑时恢复
let originalColorForEditing = ''

const cancelNote = () => {
  // 1. 处理正在编辑的现有标注
  if (editingAnnotation.value && selection.value.annotationId) {
    // 恢复高亮元素的原始颜色
    const colorInfo = colorOptions.find(c => c.id === originalColorForEditing)
    if (colorInfo) {
      const highlight = document.querySelector(`[data-annotation-id="${selection.value.annotationId}"]`)
      if (highlight) {
        highlight.style.backgroundColor = colorInfo.rgba
      }
    }
  }
  // 2. 处理正在创建的新标注（临时高亮）
  else if (tempHighlightRef.value) {
    const parent = tempHighlightRef.value.parentNode
    if (parent) {
      // 获取临时高亮的文本内容
      const text = tempHighlightRef.value.textContent || ''
      
      // 保存当前临时高亮的位置
      const nextSibling = tempHighlightRef.value.nextSibling
      
      // 删除临时高亮元素
      parent.removeChild(tempHighlightRef.value)
      
      // 在原位置插入文本节点
      const textNode = document.createTextNode(text)
      parent.insertBefore(textNode, nextSibling)
      parent.normalize()
    }
    
    // 重置临时高亮引用
    tempHighlightRef.value = null
  }
  
  // 3. 重置所有状态
  showNoteInput.value = false
  noteText.value = ''
  editingAnnotation.value = null
  tempHighlightRange.value = null
  originalColorForEditing = ''
  clearSelection()
}

// 处理标注输入框的按键事件
const handleNoteKeydown = (event: KeyboardEvent) => {
  // 如果按下了 Shift 键，允许换行
  if (event.shiftKey) {
    return
  }
  
  // 否则阻止默认行为，直接提交
  event.preventDefault()
  saveNote()
}

// 检查是否有现有标注
const checkExistingAnnotation = () => {
  const annotations = getCurrentPageAnnotations()
  const currentSelection = selection.value
  
  // 如果是通过点击高亮元素打开的菜单，直接使用annotationId查找
  if (currentSelection.annotationId) {
    const existingById = annotations.find(anno => anno.id === currentSelection.annotationId)
    if (existingById) {
      editingAnnotation.value = existingById
      selectedColor.value = existingById.color
      // 保存原始颜色，用于取消编辑时恢复
      originalColorForEditing = existingById.color
      noteText.value = existingById.notes || ''
      // 只有当标注有内容时才打开标注窗口
      showNoteInput.value = !!existingById.notes
      return true
    }
  }
  
  // 如果是新选择的文本，不自动匹配现有标注，允许创建新标注
  // 这解决了相同文本不能创建多个不同标注的问题
  return false
}

// 监听选择变化
watch(isVisible, (newVal) => {
  if (newVal) {
    const hasExisting = checkExistingAnnotation()
    if (!hasExisting) {
      showNoteInput.value = false
      noteText.value = ''
    }
  } else {
    // 菜单关闭时，处理编辑中的现有标注
    if (editingAnnotation.value && selection.value.annotationId) {
      // 如果正在编辑现有标注且未保存，恢复原始颜色
      const colorInfo = colorOptions.find(c => c.id === originalColorForEditing)
      if (colorInfo) {
        const highlight = document.querySelector(`[data-annotation-id="${selection.value.annotationId}"]`)
        if (highlight) {
          highlight.style.backgroundColor = colorInfo.rgba
        }
      }
    }
    
    // 菜单关闭时，清理临时高亮
    if (tempHighlightRef.value) {
      const parent = tempHighlightRef.value.parentNode
      if (parent) {
        // 获取临时高亮的文本内容
        const text = tempHighlightRef.value.textContent || ''
        
        // 保存当前临时高亮的位置
        const nextSibling = tempHighlightRef.value.nextSibling
        
        // 删除临时高亮元素
        parent.removeChild(tempHighlightRef.value)
        
        // 在原位置插入文本节点
        const textNode = document.createTextNode(text)
        parent.insertBefore(textNode, nextSibling)
        parent.normalize()
      }
      
      // 重置临时高亮引用
      tempHighlightRef.value = null
      tempHighlightRange.value = null
    }
    
    // 重置编辑状态
    showNoteInput.value = false
    noteText.value = ''
    editingAnnotation.value = null
    originalColorForEditing = ''
  }
})

// 点击高亮文本时打开菜单
const handleHighlightClick = (event: CustomEvent) => {
  const { text, element, annotationId } = event.detail
  
  // 检查高亮元素是否位于标题标签内（h1-h6）
  const parentHeading = element.closest('h1, h2, h3, h4, h5, h6')
  if (parentHeading) {
    return // 不处理标题内的高亮点击
  }
  
  // 获取高亮元素的位置
  const rect = element.getBoundingClientRect()
  
  // 设置选择状态，包含annotationId
  // 使用高亮元素的底部位置作为基准，与menuStyle计算属性保持一致
  // 菜单位置由menuStyle计算属性统一处理，确保位置计算逻辑一致
  selection.value = {
    text,
    range: null, // 高亮文本没有有效范围，设置为null
    position: {
      x: rect.left + rect.width / 2, // 水平居中
      y: rect.bottom // 使用文本底部位置作为基准，与menuStyle计算属性保持一致
    },
    annotationId // 添加标注ID
  }
  
  // 检查是否有现有标注，优先使用annotationId
  const annotations = getCurrentPageAnnotations()
  let existing = null
  
  if (annotationId) {
    existing = annotations.find(anno => anno.id === annotationId)
  } else {
    existing = annotations.find(anno => anno.text === text)
  }
  
  if (existing) {
    editingAnnotation.value = existing
    selectedColor.value = existing.color
    noteText.value = existing.notes || ''
    // 只有当标注有内容时才打开标注窗口
    showNoteInput.value = !!existing.notes
  }
  
  // 显示菜单
  isVisible.value = true
}

// 键盘事件监听
const handleKeyDown = (event: KeyboardEvent) => {
  if (!isVisible.value) return
  
  // ESC键处理
  if (event.key === 'Escape') {
    if (showNoteInput.value) {
      cancelNote()
    } else {
      clearSelection()
    }
    event.preventDefault()
  }
  // Ctrl+Del组合键处理 - 清除高亮
  else if (event.ctrlKey && event.key === 'Delete') {
    // 直接调用取消高亮的action函数
    const cancelHighlightAction = functionButtons.find(btn => btn.title === '取消高亮')?.action
    if (cancelHighlightAction) {
      cancelHighlightAction()
    }
    event.preventDefault()
  }
}

/**
 * 处理窗口大小变化（防抖处理）
 */
const handleResize = debounce(() => {
  if (isVisible.value) {
    // 窗口大小变化时，强制更新菜单位置
    // 通过重新设置selection对象触发menuStyle计算属性重新计算
    selection.value = {
      ...selection.value
    }
  }
}, 100)

/**
 * 监听showNoteInput变化，重新计算位置
 */
watch(showNoteInput, (newVal) => {
  if (isVisible.value) {
    // 打开标注窗口时，菜单高度增加，重新计算位置
    selection.value = {
      ...selection.value
    }
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  // 监听高亮文本点击事件
  document.addEventListener('highlight-click', handleHighlightClick as EventListener)
  
  // 监听取消标注事件（点击屏幕外时触发）
  document.addEventListener('annotation-cancel', cancelNote as EventListener)
  
  // 监听窗口大小变化，当视口高度变化（如键盘弹出）时重新计算菜单位置
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  
  // 移除高亮文本点击事件监听
  document.removeEventListener('highlight-click', handleHighlightClick as EventListener)
  
  // 移除取消标注事件监听
  document.removeEventListener('annotation-cancel', cancelNote as EventListener)
  
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize)
  
  // 清理标注相关的资源（定时器和事件监听器）
  cleanup()
})
</script>

<style scoped>
.text-selection-menu {
  position: fixed;
  z-index: 99999;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 12px;
  min-width: 240px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.button-row {
  display: flex;
  gap: 3px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.menu-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.menu-button .icon {
  font-size: 18px;
  line-height: 1;
}

.color-picker {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.color-label {
  font-size: 14px;
  font-weight: bold;
  color: #374151;
}

.note-input-wrapper {
  margin-top: 12px;
}

.note-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: white;
}

.note-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.note-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
}

.primary-button {
  padding: 6px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.primary-button:hover:not(:disabled) {
  background: #2563eb;
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-button {
  padding: 6px 16px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #e5e7eb;
}

/* 临时高亮样式 */
.text-highlight-temp {
  background-color: rgba(234, 179, 8, 0.15) !important;
  border-radius: 2px;
  padding: 0 2px;
  transition: background-color 0.3s ease;
}

.text-highlight-temp:hover {
  opacity: 0.9;
}

/* Dark模式样式 */
.dark .text-selection-menu {
  background: rgba(31, 41, 55, 0.95);
  border-color: #374151;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.dark .button-row {
  border-bottom-color: #374151;
}

.dark .menu-button {
  color: #e5e7eb;
}

.dark .menu-button:hover {
  background: #374151;
}

.dark .color-label {
  color: #e5e7eb;
}

.dark .note-input {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .note-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.dark .primary-button {
  background: #3b82f6;
  color: white;
}

.dark .primary-button:hover:not(:disabled) {
  background: #2563eb;
}

.dark .secondary-button {
  background: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}

.dark .secondary-button:hover {
  background: #4b5563;
}

/* Dark模式下的临时高亮样式 */
.dark .text-highlight-temp {
  background-color: rgba(234, 179, 8, 0.25) !important;
  color: #f9fafb;
}

.dark .text-highlight-temp:hover {
  opacity: 0.9;
}

/* 动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>