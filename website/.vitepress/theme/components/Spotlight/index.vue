<script setup lang="ts">
import { ref, watch } from "vue";
import { useData } from "vitepress";
import SpotlightHover from "./components/SpotlightHover.vue";

const { frontmatter } = useData();

// 存储聚光灯状态
const spotlight = ref(true);
const oldSpotlight = ref(spotlight.value);

// 存储聚光灯模式
const spotlightMode = ref<'aside' | 'under'>('aside');
const oldSpotlightMode = ref(spotlightMode.value);

// 文章单独设置是否使用聚光灯
watch(
  () => frontmatter.value.spotlight,
  newVal => {
    if (newVal !== undefined) {
      oldSpotlight.value = spotlight.value;
      spotlight.value = newVal;
    } else {
      // 还原
      spotlight.value = oldSpotlight.value;
    }
  },
  { immediate: true }
);

// 文章单独设置聚光灯模式
watch(
  () => frontmatter.value.spotlightMode,
  newVal => {
    if (newVal === 'aside' || newVal === 'under') {
      oldSpotlightMode.value = spotlightMode.value;
      spotlightMode.value = newVal;
    } else {
      // 还原
      spotlightMode.value = oldSpotlightMode.value;
    }
  },
  { immediate: true }
);

// 检查是否支持触摸设备
const isTouchDevice = () => {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

const supportTouch = ref(isTouchDevice());
</script>

<template>
  <SpotlightHover 
    v-if="spotlight && !supportTouch" 
    :enabled="spotlight && !supportTouch" 
    :mode="spotlightMode"
  />
</template>