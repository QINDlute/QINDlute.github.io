# 样式示例

<ArticleMetadata />

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

你好啊哈哈哈
<br>
你好