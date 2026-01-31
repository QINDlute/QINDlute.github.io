<script setup lang="ts">
import type { menuItem } from '../composables/types'

// 定义 props
const props = withDefaults(defineProps<{
  title?: string
  items: menuItem[]
  columns?: number  // 可自定义列数
}>(), {
  columns: 0  // 0 表示使用响应式
})
</script>

<template>
  <div class="nav-menu-container">
    <!-- 标题 -->
    <h3 v-if="title" class="lists-title">{{ title }}</h3>
    
    <!-- 网格容器 -->
    <section class="lists-land">
      <div 
        v-for="item of items" 
        :key="item.id" 
        class="lists-link"
      >
        <a :href="item.url">
          <div class="lists-bg">
            <div class="lists-item">
              <img 
                :src="item.image" 
                :alt="item.name" 
                class="lists-img medium-zoom-image"
              />
            </div>
          </div>
        </a>
        <div class="lists-text">{{ item.name }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lists-title { 
  font-size: 20px;
  font-weight: 600;
  padding-top: 2rem
} 
 
.lists-land { 
  display: grid; 
  grid-template-columns: repeat(3,minmax(0,1fr)); 
  column-gap: 1.6rem; 
  row-gap: 2rem; 
  padding-top: 2rem 
} 

@media (min-width: 576px) { 
  .lists-land { 
      column-gap:2.5rem; 
      grid-template-columns: repeat(4,minmax(0,1fr)) 
  } 
} 

@media (min-width: 1024px) { 
  .lists-land { 
    column-gap:2rem; 
    grid-template-columns: repeat(6,minmax(0,1fr)) 
  } 
}

.lists-link { 
  transition: transform .3s 
} 

.lists-link:hover { 
  transform: translateY(-5px) 
} 

.lists-bg { 
  position: relative 
} 

.lists-item { 
  display: flex; 
  justify-content: center; 
  border: 1px solid #282828; 
  border-radius: 1.2rem; 
  padding: .1rem 0; 
  z-index: -1; 
  aspect-ratio: 1/1; 
  width: 100%; 
  overflow: hidden 
} 

.lists-item:hover { 
  background-color: var(--custom-bg); 
  border: 2px solid #9b11b9; 
  border-radius: 1.2rem 
} 

.lists-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  border-radius: 1rem; 
  pointer-events: none; 
  transition: transform .3s ease 
} 

.lists-bg:hover .lists-item:before { 
  content: ""; 
  background-image: linear-gradient(165deg,#9b11b9,#e03bf1); 
  position: absolute; 
  width: 100%; 
  height: 100%; 
  filter: blur(36px); 
  z-index: -2; 
  top: 0; 
  left: 0 
} 

.lists-link .lists-text { 
  text-align: center; 
  padding-top: .75rem; 
  font-size: .875rem; 
  line-height: 1.25rem; 
  font-weight: 500; 
  color: var(--custom-text) 
} 

.medium-zoom-overlay,.medium-zoom-image { 
  z-index: 0!important
} 
</style>