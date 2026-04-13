<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('snowEffectActive')
    return savedState ? JSON.parse(savedState) : false
  }
  return false
}

const isSnowActive = ref(getInitialState())

const toggleSnow = () => {
  isSnowActive.value = !isSnowActive.value
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('snowEffectActive', JSON.stringify(isSnowActive.value))
  }
  
  window.dispatchEvent(new CustomEvent('toggle-snow', {
    detail: { active: isSnowActive.value }
  }))
}

onMounted(() => {
  window.dispatchEvent(new CustomEvent('toggle-snow', {
    detail: { active: isSnowActive.value }
  }))
});
</script>

<template>
  <button
    class="VPNavBarSnow"
    :class="{ 'is-active': isSnowActive }"
    @click="toggleSnow"
    title="雪花效果"
    type="button"
  >
    <svg class="snow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
      <line x1="16" y1="8" x2="2" y2="22"></line>
      <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>
  </button>
</template>

<style scoped>
.VPNavBarSnow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
  border-radius: 50%;
  margin-left: 4px;
}

.VPNavBarSnow:hover {
  color: var(--vp-c-text-1);
}

.VPNavBarSnow.is-active {
  color: var(--vp-c-brand-1);
}

.VPNavBarSnow.is-active:hover {
  color: var(--vp-c-brand-2);
}

.snow-icon {
  width: 18px;
  height: 18px;
}
</style>
