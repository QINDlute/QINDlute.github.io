<script setup lang="ts">
import type { navItem } from '../composables/types'

defineProps<{
  navData: navItem[]
}>()
</script>

<template>
  <div class="nav-card-container grid auto-rows-auto grid-cols-2 gap-[12px]">
    <section v-for="navItem of navData" :key="navItem.id">
      <a :href="navItem.link" rel="noreferrer" target="_blank" class="group">
        <section
          class="flex h-full flex-col border-1 border-solid rounded-[8px] leading-[24px] px-[24px] py-[12px] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200"
        >
          <span class="nav-title transition-colors duration-200">
            {{ navItem.text }}
          </span>
          <span class="nav-desc mb-auto text-sm min-h-[20px] transition-colors duration-200">
            {{ navItem.desc ?? navItem.text }}
          </span>
        </section>
      </a>
    </section>
  </div>
</template>

<style scoped>
.nav-card-container a section {
  border-color: var(--nav-card-border);
  background-color: var(--nav-card-bg);
}

.nav-card-container a:hover section {
  background-color: var(--nav-card-hover-bg);
  box-shadow: 0 4px 12px var(--nav-card-shadow);
}

.nav-title {
  color: var(--nav-card-text);
}

.nav-card-container a:hover .nav-title {
  color: var(--nav-card-hover-text);
}

.nav-desc {
  color: var(--nav-card-desc);
  opacity: 0.5; /* 对应原来的opacity-50 */
}

.nav-card-container a:hover .nav-desc {
  color: var(--nav-card-hover-text);
  opacity: 0.9;
}

/* a 标签下划线生效 */
.nav-card-container a {
  text-decoration: underline;
  transition: text-decoration 0.2s ease;
}

/* 添加 hover 效果，移除下划线 */
.nav-card-container a:hover {
  text-decoration: none;
  transition: text-decoration 0.2s ease;
}
</style>