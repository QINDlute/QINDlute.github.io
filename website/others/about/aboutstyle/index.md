# 样式示例

## 信息容器使用示例

::: info
这是一个信息
:::

::: warning
这是一个轻微警告
:::

::: caution
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: tip
这是一个提示
:::

::: note
这是一个注意信息
:::

::: important
这是一个重要信息
:::

---

<span class='marker'>这是一个记号笔效果</span>

---

```python{1-2}
    print('hello world')
    print('hello world')
    print('hello world')
```

::: code-group

```html [html]
<!-- HTML 代码 -->
<div class="example">Hello World</div>
```

```css [css]
/* CSS 代码 */
.example {
  color: blue;
}
```

```js [js]
// JavaScript 代码
console.log('Hello World');
```
:::

---
## 白板容器使用示例
::: whiteboard 我的笔记本（自定义标题）
<h4>这是白板容器内部，支持所有 Markdown 语法：</h4>

<h4>列表语法</h4>

- 无序列表项 1
- 无序列表项 2
  - 子列表项

1. 有序列表项 1
2. 有序列表项 2

<h4>代码块（支持行高亮）</h4>

```python{1,3}
print('hello world') # [!code focus]
print('hello world')
name = "VitePress"
print(name) # [!code focus]
```
*end*
:::


![测试：主页图片展示](/img/index_show.png)
<div class="figure-caption">测试：主页图片展示(增加放大全屏功能)</div>

::: details 点击展开查看更多

``` python
print('hello world')
print('hello world')
name = "VitePress"
print(name)
```
::: note 注意
  - 这里面是藏起来的文字
:::


::: whiteboard LaTeX Demo
 #### $\sqrt{3x-1}+(1+x)^2$
比如 $h(x) = \frac{1}{1+e^{-x}}$
::: note 注意
  whiteboard 内的数学公式并不支持自动换行，如果需要换行，直接另起一行就可以。
:::


  $\sqrt{3x-1}+(1+x)^2+\frac{1}{x^2}+\frac{1}{x^3}-\frac{1}{x^4}-\frac{1}{x^5}+\frac{1}{x^6}$

<p>
  在使用html元素的时候，<span class="marker">要注意不能将带有html元素的代码与自定义markdown语法零格使用，</span>否则该语法会失效从而显现原来的文本，同时也不能将html元素与markdown语句混合、相邻使用，否则markdown语句会失效。
</p>

~~注意在使用html元素的时候，要注意不能将带有html元素的代码与markdown语句混合、相邻使用，否则markdown语句会失效~~

在自定义markdown容器的使用中，由于markdown语法是:

``` md
::: 容器类型 <容器标题>"
容器内容
:::
```
而":::"只会与最近的且没有容器类型的":::"匹配由此闭合容器，不会与之前的":::"匹配，这会导致两个容器永远也不可能在第二个容器之后的内容还在第一个容器内（内层容器闭合时会直接终止外层容器的解析，外层容器后续内容会被当作普通 Markdown 解析，从而跑出容器外）。  
简单来说就是在自定义容器中不能嵌套自定义容器

当然这是在常规情况下，我们可以使用HTML标签来实现自定义容器的嵌套，~~（前提是你很熟悉自定义容器的结构）~~，例如：


::: code-group

```md [md]
::: whiteboard LaTeX Demo
  你好  
  早上好

  <div class="custom-block note">
    <div class="custom-block-title">注意</div>
    <p>今天下雨</p>
  </div>

  <a href="/pure.html" target="_self">Link to pure.html</a>

  晚上好

```

``` ts [ts]
export default {
  rewrites: {
    'packages/pkg-a/src/pkg-a-docs.md': 'pkg-a/index.md',
    'packages/pkg-b/src/pkg-b-docs.md': 'pkg-b/index.md'
  }
}
```
:::

<br>
效果如下：

::: whiteboard LaTeX Demo
  你好  
  早上好

  <div class="custom-block note">
    <div class="custom-block-title">注意</div>
    <p>今天下雨</p>
  </div>

  晚上好
:::


::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

> 注意：在使用自定义容器时，容器类型和容器标题之间不能有空格，否则会导致容器解析失败。

```md
> 更新时间：2024 年
~~更新时间：2024 年~~
## 哈哈

<!-- index.md -->
<HomeUnderline />

```

## 自定义Vue组件使用示例

<div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="brand" href="#">品牌按钮</CustomButton>
<CustomButton type="alt" href="#">备用按钮</CustomButton>
<CustomButton type="custom" href="#">自定义按钮</CustomButton>
</div>
<!-- <CustomButton type="类型" href="链接" size="尺寸">按钮文本</CustomButton> -->

<div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="custom" href="#" size="small">自定义按钮</CustomButton>
<CustomButton type="custom" href="#" size="small" :disabled=true>自定义按钮</CustomButton>
<CustomButton type="custom" size="large" :disabled=false>自定义按钮</CustomButton>
</div>

