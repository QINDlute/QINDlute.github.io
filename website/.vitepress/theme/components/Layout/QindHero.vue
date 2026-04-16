<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TypingText from './../TypingText.vue'

const customTaglines = [
  '千里之行，始于足下',
  '君子藏器于身，待时而动',
  '只要你愿意，任何时间都不晚',
]

const currentTagline = ref('')

onMounted(() => {
  // 从 localStorage 读取上一次的索引
  const getLastIndex = () => {
    try {
      const stored = localStorage.getItem('qind-hero-last-index')
      return stored ? parseInt(stored) : -1
    } catch (e) {
      return -1
    }
  }

  const lastIndex = getLastIndex()

  const getRandomIndex = () => {
    // 如果只有一个标语，直接返回0
    if (customTaglines.length === 1) {
      return 0
    }
    
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * customTaglines.length)
    } while (randomIndex === lastIndex) // 确保与上一次不同
    
    return randomIndex
  }
  
  const randomIndex = getRandomIndex()
  // 保存当前索引到 localStorage
  try {
    localStorage.setItem('qind-hero-last-index', String(randomIndex))
  } catch (e) {
    // 忽略存储错误
  }
  currentTagline.value = customTaglines[randomIndex]
})
</script>

<template>
  <p v-if="currentTagline" class="qind-hero-tagline">
    <TypingText 
      :text="currentTagline" 
      fontSize="24px" 
      cursorColor="#666"
    />
  </p>
</template>

<style>
/* 通过选择器隐藏原来的 tagline */
.VPHero .main > p.tagline {
  display: none !important;
}

.qind-hero-tagline {
  margin: 0;
}
</style>
