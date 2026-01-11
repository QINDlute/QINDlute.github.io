<template>
  <div class="VPDoc-prevnext has-sidebar has-aside">
    <footer class="VPDocFooter">
      <nav class="prev-next" aria-labelledby="doc-footer-aria-label">
        <span class="visually-hidden" id="doc-footer-aria-label">Pager</span>
        <!-- 上一页 -->
        <div class="pager">
          <a 
            v-if="effectivePrev && effectivePrev.link" 
            class="VPLink link pager-link prev" 
            :href="effectivePrev.link"
          >
            <span class="desc">上一页</span>
            <span class="title">{{ effectivePrev.title || '上一页' }}</span>
          </a>
        </div>
        <!-- 下一页 -->
        <div class="pager">
          <a 
            v-if="effectiveNext && effectiveNext.link" 
            class="VPLink link pager-link next" 
            :href="effectiveNext.link"
          >
            <span class="desc">下一页</span>
            <span class="title">{{ effectiveNext.title || '下一页' }}</span>
          </a>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

const props = defineProps({
  // 上一页配置（通过props传入）
  prev: {
    type: [Object, Array],
    default: () => ({})
  },
  // 下一页配置（通过props传入）
  next: {
    type: [Object, Array],
    default: () => ({})
  }
});

// 获取页面的frontmatter数据
const { frontmatter } = useData();

// 处理可能是数组的数据
const normalizeNavData = (data) => {
  if (Array.isArray(data)) {
    // 如果是数组，返回第一个元素
    return data[0] || {};
  }
  // 如果是对象，直接返回
  return data || {};
};

// 计算有效的上一页数据：优先使用props传入的数据，否则从frontmatter读取
const effectivePrev = computed(() => {
  // 如果props传入了prev且有实际内容，则使用props的数据
  if (props.prev && (props.prev.link || (Array.isArray(props.prev) && props.prev[0]?.link))) {
    return normalizeNavData(props.prev);
  }
  // 否则从frontmatter读取prev数据
  return normalizeNavData(frontmatter.value.prev);
});

// 计算有效的下一页数据：优先使用props传入的数据，否则从frontmatter读取
const effectiveNext = computed(() => {
  // 如果props传入了next且有实际内容，则使用props的数据
  if (props.next && (props.next.link || (Array.isArray(props.next) && props.next[0]?.link))) {
    return normalizeNavData(props.next);
  }
  // 否则从frontmatter读取next数据
  return normalizeNavData(frontmatter.value.next);
});
</script>

<style scoped>
/* 保持与VitePress默认样式一致，无需额外样式 */
</style>