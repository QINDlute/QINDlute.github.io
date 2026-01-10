<template>
  <CarouselComponent :items="carouselData" />
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import CarouselComponent from './CarouselComponent.vue';

// 使用VitePress的useData钩子获取页面数据
const { frontmatter } = useData();

// 从frontmatter中提取轮播数据
const carouselData = computed(() => {
  // 检查frontmatter中是否有carouselItems数据（兼容不同的命名）
  if (frontmatter.value) {
    // 优先使用carouselItems，如果没有则使用carouselItems1
    return frontmatter.value.carouselItems || frontmatter.value.carouselItems1 || [];
  }
  // 如果没有frontmatter，返回默认空数组
  return [];
});
</script>