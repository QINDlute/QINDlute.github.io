<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TypingText from './TypingText.vue'

const customTaglines = [
  '千里之行，始于足下',
  '君子藏器于身，待时而动',
  '花道两别终有日，可笑草木攀新桕🌸',
  '雪肤乌发红唇，鸿雁从此生',
]

const currentTagline = ref('')

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * customTaglines.length)
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
