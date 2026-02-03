<script setup lang="ts">
</script>

<template>
  <span class="interval">
    <slot></slot>
  </span>
</template>

<style scoped>
.interval {
  margin: 0 0 0 24px;
  white-space: nowrap;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .interval {
    margin: 0;
    white-space: nowrap;
  }
}

</style>
