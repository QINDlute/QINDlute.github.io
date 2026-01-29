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
    <!-- 占位元素，保持收起状态时的间距 -->
    <div v-if="!isOpen" class="smooth-details-placeholder"></div>
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
