<!-- .vitepress/others/tags.md -->

笔记导航{#笔记导航 .nometa-h1}
<script setup>
  import cssNav from '../.vitepress/theme/composables/css'
  import navMenus from '../.vitepress/theme/composables/navMenuData'
</script>

## Vitepress 指导网站
<NavMenu :items=navMenus />

## 导航卡片：
<NavCard :navData=cssNav />

