<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useData, useRoute } from "vitepress";
import SpotlightHover from "./components/SpotlightHover.vue";
import ClientOnly from "../ClientOnly.vue";

const { frontmatter } = useData();
const route = useRoute();

// 禁用 spotlight 的路径列表
const disabledPaths = [
  '/others/archive',
  '/others/tags',
  '/study/math/',
];

/**
 * 检查当前路径是否在禁用列表中
 */
const isPathDisabled = () => {
  const currentPath = route.path;
  return disabledPaths.some(path => currentPath.startsWith(path));
};

// 存储聚光灯状态
const spotlight = ref(true);
const oldSpotlight = ref(spotlight.value);

// 存储聚光灯模式
const spotlightMode = ref<'aside' | 'under'>('aside');
const oldSpotlightMode = ref(spotlightMode.value);

// 路径禁用状态
const isDisabledByPath = ref(false);

// 监听路由变化，检查路径
watch(
  () => route.path,
  () => {
    isDisabledByPath.value = isPathDisabled();
  },
  { immediate: true }
);

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
const supportTouch = ref(false);

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

onMounted(() => {
  supportTouch.value = isTouchDevice();
});

// 计算最终是否启用 spotlight
const isEnabled = computed(() => {
  return spotlight.value && !supportTouch.value && !isDisabledByPath.value;
});
</script>

<template>
  <ClientOnly>
    <SpotlightHover 
      v-if="isEnabled" 
      :enabled="isEnabled" 
      :mode="spotlightMode"
    />
  </ClientOnly>
</template>
