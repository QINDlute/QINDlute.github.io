<template>
  <div class="smooth-details">
    <button 
      class="smooth-details-summary" 
      :class="{ expanded: isOpen }"
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <slot name="title">点击展开</slot>
    </button>
    <transition name="smooth-details">
      <div v-if="isOpen" class="smooth-details-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style>
:root {
  --sdetails-background-color: #eef9fd;
  --sdetails-shadow-lw: 0 1px 2px 0 #0000001a;
}
.dark {
  --sdetails-background-color: #193c47;
}
</style>

<style scoped>
.smooth-details {
  margin: 0 0 1rem;
  border: 1px solid #4cb3d4;
  border-radius: .4rem;
  box-shadow: var(--sdetails-shadow-lw);
  background-color: var(--sdetails-background-color);
  overflow: hidden;
  padding: 1rem 1rem 0;
}

.smooth-details-summary {
  cursor: pointer;
  padding-left: 1rem;
  list-style: none;
  position: relative;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font: inherit;
  color: inherit;
}

.smooth-details-summary::before {
  content: "";
  border-width: 0.38rem;
  border-style: solid;
  border-color: transparent transparent transparent #4cb3d4;
  transition: transform 0.2s ease;
  transform-origin: calc(0.38rem / 2) 50%;
  position: absolute;
  top: 0.45rem;
  left: 0;
  transform: rotate(0deg);
}

.smooth-details-summary.expanded::before {
  transform: rotate(90deg);
}

.smooth-details-content {
  border-top: 1px solid #4cb3d4;
  margin-top: 1rem;
  /* padding-top: 1rem; */
}

/* 过渡动画 */
.smooth-details-enter-active,
.smooth-details-leave-active {
  transition: max-height 0.314s ease-in-out, opacity 0.314s ease-in-out;
  max-height: 1000px;
  overflow: hidden;
}

.smooth-details-enter-from,
.smooth-details-leave-to {
  max-height: 0;
  opacity: 0;
}

.smooth-details-enter-from {
  opacity: 0;
}

.smooth-details-leave-to {
  opacity: 0;
}
</style>
