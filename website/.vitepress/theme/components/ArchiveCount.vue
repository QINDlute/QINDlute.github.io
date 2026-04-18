<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  month: string
}>()

const count = ref(0)

// 直接导入 archive.md 文件
import archiveContent from '../../../others/archive.md?raw'

const fetchArchiveCount = () => {  
  const content = archiveContent 
  // 简化的月份匹配模式：直接匹配 ### 1月
  const monthPattern = new RegExp(`### ${props.month}月`, 'i')
  const monthMatch = content.match(monthPattern)
  
  if (!monthMatch) {
    count.value = 0
    return
  }
    
  // 找到月份节点的开始位置
  const monthStartPos = monthMatch.index || 0
  
  // 找到下一个月份节点的开始位置（简化为只匹配 ### 数字月）
  const nextMonthPattern = new RegExp(`### [0-9]{1,2}月`, 'i')
  const contentAfterMonth = content.slice(monthStartPos + 1)
  const nextMonthMatch = contentAfterMonth.match(nextMonthPattern)
    
  // 确定当前月份内容的结束位置
  const monthEndPos = nextMonthMatch  
    ? monthStartPos + 1 + nextMonthMatch.index  
    : content.length
  
  // 提取当前月份的内容
  const monthContent = content.slice(monthStartPos, monthEndPos)
  
  // 检查是否标记为 empty
  const emptyRegex = /archive-empty/g
  const emptyMatches = monthContent.match(emptyRegex)
  if (emptyMatches) {
    count.value = 0
    return
  }
  
  // 统计 archive-post-item 的数量
  const postItemRegex = /archive-post-item/g
  const postMatches = monthContent.match(postItemRegex)
  
  count.value = postMatches ? postMatches.length : 0
}

onMounted(() => {
  fetchArchiveCount()
})
</script>

<template>
  <span>({{ count }})</span>
</template>