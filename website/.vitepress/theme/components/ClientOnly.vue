<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <slot v-if="isClient" />
</template>
