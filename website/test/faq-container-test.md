# FAQ 容器测试

这是一个用于测试 FAQ Markdown 自定义容器的页面。

## 基本用法

::: faq 基本用法示例
这是一个基本的 FAQ 折叠面板，默认是收起状态。
:::

## 初始展开

::: faq active 初始展开示例
这个 FAQ 面板在加载时就会展开。
:::

## 无标题

::: faq
没有标题的 FAQ 面板，会显示默认标题。
:::

## 嵌套内容

::: faq 支持嵌套内容
FAQ 容器支持各种 Markdown 内容：

- 列表项 1
- 列表项 2
  - 嵌套列表项

**粗体文本** 和 *斜体文本* 也可以正常显示。

```javascript
// 代码块也支持
console.log('Hello, FAQ!');
```
:::

## 多个 FAQ 项

<div class="faq-container">

::: faq 问题 1
答案 1
:::

::: faq active 问题 2
答案 2
:::

::: faq 问题 3
答案 3
:::

</div>

## 独立 FAQ 项

::: faq 独立问题 1
这是一个没有被 .faq-container 包裹的独立 FAQ 项。
:::

::: faq active 独立问题 2
这是另一个独立的 FAQ 项，初始展开。
:::
