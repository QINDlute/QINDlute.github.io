# 页脚导航组件示例

本页面演示如何使用自定义的页脚导航组件。

## 使用方法

在Markdown文件中，您可以使用Vue代码块来定义上一页和下一页的配置，然后传递给`PrevNextNav`组件。

```vue
<script setup>
const prevPage = {
  title: '上一篇文章',
  link: '/previous-page'
};

const nextPage = {
  title: '下一篇文章',
  link: '/next-page'
};
</script>

<PrevNextNav :prev="prevPage" :next="nextPage" />
```

## 示例效果

<script setup>
const prevPage = {
  title: '无花',
  link: '/essays/poetry/无花'
};

const nextPage = {
  title: '空响',
  link: '/essays/poetry/空响'
};
</script>

<PrevNextNav :prev="prevPage" :next="nextPage" />

## 只显示上一页或下一页

您可以只传递上一页或下一页的配置，组件会自动处理空值情况。

### 只显示上一页

```vue
<script setup>
const prevPage = {
  title: '上一篇文章',
  link: '/previous-page'
};
</script>

<PrevNextNav :prev="prevPage" />
```

### 只显示下一页

```vue
<script setup>
const nextPage = {
  title: '下一篇文章',
  link: '/next-page'
};
</script>

<PrevNextNav :next="nextPage" />
```

## 数据格式

| 属性 | 类型 | 说明 |
|------|------|------|
| prev | Object | 上一页配置，包含title和link属性 |
| prev.title | String | 上一页的标题，可选，默认显示"上一页" |
| prev.link | String | 上一页的链接，必填，只有提供链接时才会显示上一页 |
| next | Object | 下一页配置，包含title和link属性 |
| next.title | String | 下一页的标题，可选，默认显示"下一页" |
| next.link | String | 下一页的链接，必填，只有提供链接时才会显示下一页 |

## 使用YAML Frontmatter

您也可以将上一页和下一页的配置放在YAML frontmatter中，然后通过`useData`钩子读取。

```yaml
---
prevPage:
  title: '上一篇文章'
  link: '/previous-page'
nextPage:
  title: '下一篇文章'
  link: '/next-page'
---
```

```vue
<script setup>
import { useData } from 'vitepress';
const { frontmatter } = useData();
</script>

<PrevNextNav :prev="frontmatter.prevPage" :next="frontmatter.nextPage" />
```

## 注意事项

1. 只有当提供了有效的`link`属性时，才会显示对应的上一页或下一页导航
2. 如果没有提供`title`属性，会显示默认文本"上一页"或"下一页"
3. 组件会保持与VitePress默认主题一致的样式
4. 您可以根据需要自定义组件的样式