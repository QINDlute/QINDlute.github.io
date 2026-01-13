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
        <div class="button-row">
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
            @keydown.enter="saveNote"
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
import { useTextSelection } from '../../composables/useTextSelection'
import { useAnnotations, type Annotation } from '../../composables/useAnnotations'

// 组合式函数
const { selection, isVisible, clearSelection, handleCopy } = useTextSelection()
const { 
  colorOptions, 
  addAnnotation, 
  updateAnnotation, 
  removeAnnotation,
  getCurrentPageAnnotations 
} = useAnnotations()

// 响应式数据
const menuRef = ref<HTMLElement>()
const noteInputRef = ref<HTMLTextAreaElement>()
const showNoteInput = ref(false)
const selectedColor = ref<string>('yellow')
const noteText = ref('')
const editingAnnotation = ref<Annotation | null>(null)

// 计算属性
const menuStyle = computed(() => {
  // 获取菜单元素的高度（使用已知的估计高度）
  const menuHeight = showNoteInput.value ? 200 : 120
  
  // 计算菜单的视口坐标
  const rect = {
    width: 240, // 菜单宽度
    height: menuHeight
  }
  
  // 确保菜单在视口内
  let left = selection.value.position.x
  let top = selection.value.position.y
  
  // 垂直边界检查
  if (top < 0) {
    top = 10
  } else if (top + rect.height > window.innerHeight) {
    top = window.innerHeight - rect.height - 10
  }
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    transform: 'translateX(-50%)', // 恢复水平居中变换
    position: 'fixed' // 使用固定定位，相对于视口
  }
})

// 功能按钮配置
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
      // 检查是否有现有标注
      const annotations = getCurrentPageAnnotations()
      const currentSelection = selection.value
      
      if (currentSelection.range || currentSelection.text) {
        const selectedText = currentSelection.text
        // 查找并移除现有标注
        annotations.forEach(anno => {
          if (anno.text === selectedText) {
            removeAnnotation(anno.id)
          }
        })
        
        // 清除页面上的高亮
        const highlights = document.querySelectorAll('.text-highlight')
        highlights.forEach(highlight => {
          if (highlight.textContent === selectedText) {
            const parent = highlight.parentNode
            if (parent) {
              const textNode = document.createTextNode(highlight.textContent || '')
              parent.replaceChild(textNode, highlight)
              parent.normalize()
            }
          }
        })
      }
      
      clearSelection()
    }
  }
]

// 方法
const selectColor = (colorId: string) => {
  selectedColor.value = colorId
  
  // 如果不显示标注输入框，直接创建高亮
  if (!showNoteInput.value) {
    createHighlight()
  }
}

const createHighlight = () => {
  if (!selection.value.text || !selectedColor.value) return

  try {
    // 确保有有效的范围
    let range = selection.value.range
    
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
          
          // 更新DOM中的高亮颜色
          const highlights = document.querySelectorAll('.text-highlight')
          highlights.forEach(highlight => {
            if (highlight.textContent === selection.value.text) {
              const colorInfo = colorOptions.find(c => c.id === selectedColor.value)
              highlight.style.backgroundColor = colorInfo ? colorInfo.rgba : '#FFFF00'
            }
          })
          
          clearSelection()
          showNoteInput.value = false
          noteText.value = ''
          return
        }
        
        console.error('没有有效的选择范围')
        return
      }
    }

    const annotation = addAnnotation({
      type: 'highlight',
      color: selectedColor.value,
      text: selection.value.text,
      range: range,
      notes: noteText.value
    })

    // 应用高亮到 DOM
    applyHighlight(range, selectedColor.value)
    
    clearSelection()
    showNoteInput.value = false
    noteText.value = ''
  } catch (error) {
    console.error('创建高亮失败:', error)
  }
}

const applyHighlight = (range: Range, color: string) => {
  // 创建高亮元素
  const span = document.createElement('span')
  span.className = 'text-highlight'
  
  // 确保能找到颜色
  const colorInfo = colorOptions.find(c => c.id === color)
  span.style.backgroundColor = colorInfo ? colorInfo.rgba : '#FFFF00' // 默认黄色
  span.style.borderRadius = '2px'
  span.style.padding = '0 2px'
  span.style.cursor = 'pointer'
  span.style.transition = 'background-color 0.3s ease'
  
  try {
    // 直接使用当前范围，不进行复杂的重新定位
    if (!range.collapsed) {
      // 使用更可靠的方法处理范围
      const fragment = range.extractContents()
      span.appendChild(fragment)
      range.insertNode(span)
      
      // 为新添加的高亮立即添加点击事件
      span.addEventListener('click', (event) => {
        event.stopPropagation()
        const text = span.textContent || ''
        
        // 触发自定义事件，通知打开菜单
        const customEvent = new CustomEvent('highlight-click', {
          detail: {
            text: text,
            element: span
          },
          bubbles: true,
          composed: true
        })
        
        event.currentTarget?.dispatchEvent(customEvent)
      })
    }
  } catch (error) {
    console.error('应用高亮失败:', error)
    // 简化失败处理，减少性能开销
  }
}

const saveNote = () => {
  // 使用文本而不是范围作为检查条件，确保在范围失效时仍能正常工作
  if (!selection.value.text) return
  
  if (editingAnnotation.value) {
    // 更新现有标注
    updateAnnotation(editingAnnotation.value.id, {
      notes: noteText.value,
      color: selectedColor.value
    })
    
    // 更新DOM中的高亮颜色和注释
    const highlights = document.querySelectorAll('.text-highlight')
    highlights.forEach(highlight => {
      if (highlight.textContent === selection.value.text) {
        const color = colorOptions.find(c => c.id === selectedColor.value)
        highlight.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)'
        highlight.title = noteText.value || selection.value.text
      }
    })
    
    // 隐藏菜单，但不清除高亮
    isVisible.value = false
    showNoteInput.value = false
    noteText.value = ''
    editingAnnotation.value = null
  } else {
    createHighlight()
  }
}

const cancelNote = () => {
  showNoteInput.value = false
  noteText.value = ''
  editingAnnotation.value = null
  clearSelection()
}

// 检查是否有现有标注
const checkExistingAnnotation = () => {
  const annotations = getCurrentPageAnnotations()
  const currentSelection = selection.value
  
  // 先通过文本内容查找现有标注
  const existingByText = annotations.find(anno => anno.text === currentSelection.text)
  
  if (existingByText) {
    editingAnnotation.value = existingByText
    selectedColor.value = existingByText.color
    noteText.value = existingByText.notes || ''
    // 只有当标注有内容时才打开标注窗口
    showNoteInput.value = !!existingByText.notes
    return true
  }
  
  // 如果文本匹配失败且有有效范围，尝试通过范围信息查找
  if (currentSelection.range) {
    const rangeId = JSON.stringify({
      start: currentSelection.range.startOffset,
      end: currentSelection.range.endOffset,
      text: currentSelection.text
    })
    
    const existingByRange = annotations.find(anno => 
      JSON.stringify(anno.position).includes(rangeId)
    )
    
    if (existingByRange) {
      editingAnnotation.value = existingByRange
      selectedColor.value = existingByRange.color
      noteText.value = existingByRange.notes || ''
      // 只有当标注有内容时才打开标注窗口
      showNoteInput.value = !!existingByRange.notes
      return true
    }
  }
  
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
  }
})

// 点击高亮文本时打开菜单
const handleHighlightClick = (event: CustomEvent) => {
  const { text, element } = event.detail
  
  // 检查高亮元素是否位于标题标签内（h1-h6）
  const parentHeading = element.closest('h1, h2, h3, h4, h5, h6')
  if (parentHeading) {
    return // 不处理标题内的高亮点击
  }
  
  // 获取高亮元素的位置
  const rect = element.getBoundingClientRect()
  
  // 获取菜单元素的估计高度（包括注释输入框）
  const menuEstimatedHeight = showNoteInput.value ? 200 : 120
  
  // 计算菜单位置，确保不覆盖文本且不超出视口
  let menuY = rect.bottom + 10 // 默认显示在下方
  
  // 检查菜单是否会超出视口底部
  if (rect.bottom + menuEstimatedHeight > window.innerHeight) {
    // 如果会超出，显示在上方
    menuY = rect.top - menuEstimatedHeight - 10
  }
  
  // 设置选择状态
  selection.value = {
    text,
    range: null, // 高亮文本没有有效范围，设置为null
    position: {
      x: rect.left + rect.width / 2, // 水平居中
      y: menuY
    }
  }
  
  // 检查是否有现有标注
  const annotations = getCurrentPageAnnotations()
  const existing = annotations.find(anno => anno.text === text)
  
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
  
  if (event.key === 'Escape') {
    if (showNoteInput.value) {
      cancelNote()
    } else {
      clearSelection()
    }
    event.preventDefault()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  // 监听高亮文本点击事件
  document.addEventListener('highlight-click', handleHighlightClick as EventListener)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  
  // 移除高亮文本点击事件监听
  document.removeEventListener('highlight-click', handleHighlightClick as EventListener)
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
  gap: 8px;
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