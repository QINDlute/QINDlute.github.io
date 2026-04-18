<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  month: string
}>()

const count = ref(0)

const fetchArchiveCount = async () => {
  let content: string    
  try {
    console.log(`【${props.month}月】开始获取归档文件`)
    // 使用 window.location.origin 确保在所有环境下都能正确访问
    const archiveUrl = new URL('/others/archive.md', window.location.origin)
    console.log(`【${props.month}月】请求 URL:`, archiveUrl.href)
    const mdResponse = await fetch(archiveUrl.href)
    
    console.log(`【${props.month}月】响应状态:`, mdResponse.status)
    console.log(`【${props.month}月】响应 ok:`, mdResponse.ok)
    if (mdResponse.ok) {
      content = await mdResponse.text()
      console.log(`【${props.month}月】获取 archive.md 成功，内容长度:`, content.length)
      console.log(`【${props.month}月】内容前 50 字符:`, content.substring(0, 50))
    } else {
      console.log('archive.md not found, trying archive.html')
      const htmlUrl = new URL('/others/archive.html', window.location.origin)
      console.log(`【${props.month}月】请求 archive.html URL:`, htmlUrl.href)
      const htmlResponse = await fetch(htmlUrl.href)
      console.log(`【${props.month}月】archive.html 响应状态:`, htmlResponse.status)
      console.log(`【${props.month}月】archive.html 响应 ok:`, htmlResponse.ok)
      if (htmlResponse.ok) {
        content = await htmlResponse.text()
        console.log('Using archive.html file, 内容长度:', content.length)
        console.log('内容前 50 字符:', content.substring(0, 50))
      } else {
        console.log('archive.html also not found')
        // 两个文件都不存在，设置为0
        count.value = 0
        return
      }
    }
  } catch (error) {
    console.error('获取归档文件失败:', error)
    // 错误时设置为0，避免显示异常
    count.value = 0
    return
  }
    
  // 打印获取到的内容前 100 个字符，便于调试
  console.log(`【${props.month}月】获取到的内容前 100 字符:`, content.substring(0, 100))
    
  // ========== 月份匹配正则，添加 _? 兼容下划线 ==========
  const monthPattern = new RegExp(`(?:### ${props.month}月|<h3[^>]*id="?_?${props.month}月)`, 'i')
  console.log(`【${props.month}月】月份匹配正则:`, monthPattern)
  const monthMatch = content.match(monthPattern)
  
  console.log(`【${props.month}月】月份匹配结果:`, monthMatch)
  if (!monthMatch) {
    count.value = 0
    console.log(`【${props.month}月】未找到对应月份节点`)
    return
  }
    
  const idPos = monthMatch.index || 0
  console.log(`【${props.month}月】匹配位置:`, idPos)
  let finalStartPos: number
    
  if (content.startsWith('<!DOCTYPE html')) {
    const startPos = content.lastIndexOf('<h3', idPos)
    finalStartPos = startPos === -1 ? idPos : startPos
    console.log(`【${props.month}月】HTML 模式，最终开始位置:`, finalStartPos)
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
    console.log(`【${props.month}月】Markdown 模式，最终开始位置:`, finalStartPos)
  }
    
  // ========== 下一个月份匹配正则，添加 _? 兼容下划线 ==========
  const nextMonthPattern = new RegExp(`(?:### |<h3[^>]*id="?_?[0-9]{1,2}月)`, 'i')
  const contentAfterCurrent = content.slice(finalStartPos + 1)
  console.log(`【${props.month}月】内容后部分长度:`, contentAfterCurrent.length)
  const nextMonthMatch = contentAfterCurrent.match(nextMonthPattern)
  
  console.log(`【${props.month}月】下一个月份匹配结果:`, nextMonthMatch)
  const finalEndPos = nextMonthMatch  
    ? finalStartPos + 1 + nextMonthMatch.index  
    : content.length
    
  console.log(`【${props.month}月】最终结束位置:`, finalEndPos)
  const monthContent = content.slice(finalStartPos, finalEndPos)
  console.log(`【${props.month}月】月份内容长度:`, monthContent.length)
    
  const emptyRegex = /archive-empty/g
  const emptyMatches = monthContent.match(emptyRegex)
  console.log(`【${props.month}月】空匹配结果:`, emptyMatches)
  if (emptyMatches) {
    count.value = 0
    console.log(`【${props.month}月】暂无笔记`)
    return
  }
    
  const postItemRegex = /archive-post-item/g
  const postMatches = monthContent.match(postItemRegex)
  console.log(`【${props.month}月】笔记项匹配结果:`, postMatches)
    
  count.value = postMatches ? postMatches.length : 0
  console.log(`【${props.month}月】最终笔记数量：`, count.value)

}

onMounted(() => {
  console.log(`【${props.month}月】组件挂载，开始获取笔记数量`)
  fetchArchiveCount()
})
</script>

<template>
  <span>({{ count }})</span>
</template>
