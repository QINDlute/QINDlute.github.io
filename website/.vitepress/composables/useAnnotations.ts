import { ref, watch } from 'vue'

export interface Annotation {
  id: string
  type: 'highlight' | 'underline'
  color: string
  text: string
  notes?: string
  position: {
    pageUrl: string
    startContainer: string
    startOffset: number
    endContainer: string
    endOffset: number
  }
  createdAt: Date
  updatedAt: Date
}

export function useAnnotations() {
  const annotations = ref<Annotation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 颜色配置
  const colorOptions = [
    { id: 'yellow', name: '黄色', class: 'bg-yellow-100 text-yellow-800', rgba: 'rgba(234, 179, 8, 0.3)' },
    { id: 'red', name: '红色', class: 'bg-red-100 text-red-800', rgba: 'rgba(239, 68, 68, 0.3)' },
    { id: 'green', name: '绿色', class: 'bg-green-100 text-green-800', rgba: 'rgba(34, 197, 94, 0.3)' },
    { id: 'blue', name: '蓝色', class: 'bg-blue-100 text-blue-800', rgba: 'rgba(59, 130, 246, 0.3)' }
  ]

  // 获取页面路径（去除哈希和查询参数）
  const getCurrentPageUrl = () => {
    return window.location.pathname
  }

  // 加载标注
  const loadAnnotations = () => {
    try {
      isLoading.value = true
      const currentPage = getCurrentPageUrl()
      const saved = localStorage.getItem(`vitepress-annotations-${currentPage}`)
      
      if (saved) {
        annotations.value = JSON.parse(saved).map((anno: any) => ({
          ...anno,
          createdAt: new Date(anno.createdAt),
          updatedAt: new Date(anno.updatedAt)
        }))
      } else {
        annotations.value = []
      }
      error.value = null
    } catch (err) {
      error.value = '加载标注失败'
      console.error('Failed to load annotations:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 保存标注
  const saveAnnotations = () => {
    try {
      const currentPage = getCurrentPageUrl()
      localStorage.setItem(
        `vitepress-annotations-${currentPage}`,
        JSON.stringify(annotations.value)
      )
    } catch (err) {
      console.error('Failed to save annotations:', err)
    }
  }

  // 创建范围标识符
  const createRangeIdentifier = (range: Range): string => {
    const { startContainer, startOffset, endContainer, endOffset } = range
    return JSON.stringify({
      start: {
        text: startContainer.textContent?.substring(0, 50),
        offset: startOffset
      },
      end: {
        text: endContainer.textContent?.substring(0, 50),
        offset: endOffset
      }
    })
  }

  // 添加标注
  const addAnnotation = (data: {
    type: 'highlight' | 'underline'
    color: string
    text: string
    range: Range
    notes?: string
  }) => {
    try {
      const currentPage = getCurrentPageUrl()
      
      const newAnnotation: Annotation = {
        id: `anno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: data.type,
        color: data.color,
        text: data.text,
        notes: data.notes,
        position: {
          pageUrl: currentPage,
          startContainer: createRangeIdentifier(data.range),
          startOffset: data.range.startOffset,
          endContainer: createRangeIdentifier(data.range),
          endOffset: data.range.endOffset
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      annotations.value.push(newAnnotation)
      saveAnnotations()
      return newAnnotation
    } catch (err) {
      console.error('Failed to add annotation:', err)
      throw err
    }
  }

  // 更新标注
  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    const index = annotations.value.findIndex(a => a.id === id)
    if (index !== -1) {
      annotations.value[index] = {
        ...annotations.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveAnnotations()
    }
  }

  // 删除标注
  const removeAnnotation = (id: string) => {
    const index = annotations.value.findIndex(a => a.id === id)
    if (index !== -1) {
      annotations.value.splice(index, 1)
      saveAnnotations()
    }
  }

  // 获取当前页面的标注
  const getCurrentPageAnnotations = () => {
    const currentPage = getCurrentPageUrl()
    return annotations.value.filter(anno => anno.position.pageUrl === currentPage)
  }

  // 搜索标注
  const searchAnnotations = (query: string) => {
    return annotations.value.filter(anno => 
      anno.text.toLowerCase().includes(query.toLowerCase()) ||
      anno.notes?.toLowerCase().includes(query.toLowerCase())
    )
  }

  // 导出标注
  const exportAnnotations = () => {
    return JSON.stringify(annotations.value, null, 2)
  }

  // 导入标注
  const importAnnotations = (json: string) => {
    try {
      const imported = JSON.parse(json)
      annotations.value = imported
      saveAnnotations()
    } catch (err) {
      throw new Error('导入失败：JSON 格式不正确')
    }
  }

  // 页面加载时自动加载标注
  if (typeof window !== 'undefined') {
    loadAnnotations()
    
    // 监听页面变化
    window.addEventListener('popstate', loadAnnotations)
    window.addEventListener('hashchange', loadAnnotations)
    
    // 监听 VitePress 路由变化 - 更可靠的方式：轮询检查当前页面URL
    let currentUrl = window.location.pathname
    setInterval(() => {
      if (window.location.pathname !== currentUrl) {
        currentUrl = window.location.pathname
        loadAnnotations()
      }
    }, 300) // 每300ms检查一次URL变化
    
    // 监听存储变化（多标签页同步）
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('vitepress-annotations-')) {
        loadAnnotations()
      }
    })
  }

  return {
    annotations,
    colorOptions,
    isLoading,
    error,
    loadAnnotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    getCurrentPageAnnotations,
    searchAnnotations,
    exportAnnotations,
    importAnnotations
  }
}