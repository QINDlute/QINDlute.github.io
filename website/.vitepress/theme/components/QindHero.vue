<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TypingText from './TypingText.vue'

const customTaglines = [
  '千里之行，始于足下',
  '君子藏器于身，待时而动',
]

const currentTagline = ref('')
const STORAGE_KEY = 'qind-hero-tagline-index'

const getNextTaglineIndex = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  const lastIndex = stored ? parseInt(stored, 10) : -1
  const nextIndex = (lastIndex + 1) % customTaglines.length
  localStorage.setItem(STORAGE_KEY, nextIndex.toString())
  return nextIndex
}

onMounted(() => {
  const index = getNextTaglineIndex()
  currentTagline.value = customTaglines[index]
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
