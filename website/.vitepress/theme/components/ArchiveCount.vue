<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  month: string
}>()

const count = ref(0)

const fetchArchiveCount = async () => {
  let content: string    
  try {
    // 使用 window.location.origin 确保在所有环境下都能正确访问
    const archiveUrl = new URL('/others/archive.md', window.location.origin)
    const mdResponse = await fetch(archiveUrl.href)
    
    if (mdResponse.ok) {
      content = await mdResponse.text()
    } else {
      console.log('archive.md not found, trying archive.html')
      const htmlUrl = new URL('/others/archive.html', window.location.origin)
      const htmlResponse = await fetch(htmlUrl.href)
      content = await htmlResponse.text()
      console.log('Using archive.html file')
    }
  } catch (error) {
    console.error('获取归档文件失败:', error)
    // 错误时设置为0，避免显示异常
    count.value = 0
    return
  }
    
  // ========== 月份匹配正则，添加 _? 兼容下划线 ==========
  const monthPattern = new RegExp(`(?:### ${props.month}月|<h3[^>]*id="?_?${props.month}月)`, 'i')
  const monthMatch = content.match(monthPattern)
  
  if (!monthMatch) {
    count.value = 0
    console.log(`【${props.month}月】未找到对应月份节点`)
    return
  }
    
  const idPos = monthMatch.index || 0
  let finalStartPos: number
    
  if (content.startsWith('<!DOCTYPE html')) {
    const startPos = content.lastIndexOf('<h3', idPos)
    finalStartPos = startPos === -1 ? idPos : startPos
  } else {
    const exactPattern = new RegExp(`^### ${props.month}月`, 'gm')
    let match
    let startPos = -1
     
    while ((match = exactPattern.exec(content)) !== null) {
      if (match.index <= idPos) {
        startPos = match.index
      } else {
        break
      }
    }
    
    finalStartPos = startPos === -1 ? idPos : startPos
  }
    
  // ========== 下一个月份匹配正则，添加 _? 兼容下划线 ==========
  const nextMonthPattern = new RegExp(`(?:### |<h3[^>]*id="?_?[0-9]{1,2}月)`, 'i')
  const contentAfterCurrent = content.slice(finalStartPos + 1)
  const nextMonthMatch = contentAfterCurrent.match(nextMonthPattern)
    
  const finalEndPos = nextMonthMatch  
    ? finalStartPos + 1 + nextMonthMatch.index  
    : content.length
    
  const monthContent = content.slice(finalStartPos, finalEndPos)
    
  const emptyRegex = /archive-empty/g
  const emptyMatches = monthContent.match(emptyRegex)
  if (emptyMatches) {
    count.value = 0
    console.log(`【${props.month}月】暂无笔记`)
    return
  }
    
  const postItemRegex = /archive-post-item/g
  const postMatches = monthContent.match(postItemRegex)
    
  count.value = postMatches ? postMatches.length : 0
  console.log(`【${props.month}月】最终笔记数量：`, count.value)

}

onMounted(() => {
  fetchArchiveCount()
})
</script>

<template>
  <span>({{ count }})</span>
</template>
