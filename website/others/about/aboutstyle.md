# 样式示例

## 信息容器使用示例

以下枚举主要信息容器的使用示例：

```md [md]
::: info
这是一个信息
:::

::: warning
因为可能存在风险，所以需要用户立即关注的关键内容。
:::

::: caution
行为可能带来的负面影响。
:::

::: danger
这是一个危险警告
:::

::: tip
有助于用户更顺利达成目标的建议性信息。
:::

::: note
强调用户在快速浏览文档时也不应忽略的重要信息。
:::

::: important
对用户达成目标至关重要的信息。
:::

> [!NOTE]
> 这是一个注意信息(github 风格)

> [!important]
> 这是一个重要信息(github 风格)

::: details 点我查看详情
这是一个详情容器
:::

> 这是一个引用测试
```

效果如下：

::: info
这是一个信息
:::

::: warning
因为可能存在风险，所以需要用户立即关注的关键内容。
:::

::: caution
行为可能带来的负面影响。
:::

::: danger
这是一个危险警告
:::

::: tip
有助于用户更顺利达成目标的建议性信息。
:::

::: note
强调用户在快速浏览文档时也不应忽略的重要信息。
:::

::: important
对用户达成目标至关重要的信息。
:::

> [!NOTE]
> 这是一个注意信息(github 风格)

> [!important]
> 这是一个重要信息(github 风格)

::: details 点我查看详情
这是一个详情容器
:::

> 这是一个引用测试

## 自定义 Button 使用示例
下面展示按钮的使用：~~（在夜间模式按钮有另外的效果）~~

```html [html]
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="brand" href="#">主题按钮</CustomButton>
<CustomButton type="alt" href="#">备用按钮</CustomButton>
<CustomButton type="custom" href="#">自定义按钮</CustomButton>
</div>

<!-- <CustomButton type="类型" href="链接" size="尺寸">按钮文本</CustomButton> -->
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="custom" href="#" size="small">小号自定义按钮</CustomButton>
<CustomButton type="custom" href="#" size="small" :disabled=true>小号禁用自定义按钮</CustomButton>
<CustomButton type="custom" size="large" :disabled=false>大号自定义按钮</CustomButton>
</div>
```
按钮效果：
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="brand" href="#">主题按钮</CustomButton>
<CustomButton type="alt" href="#">备用按钮</CustomButton>
<CustomButton type="custom" href="#">自定义按钮</CustomButton>
</div>

<!-- <CustomButton type="类型" href="链接" size="尺寸">按钮文本</CustomButton> -->
<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; align-items: center;">
<CustomButton type="custom" href="#" size="small">小号自定义按钮</CustomButton>
<CustomButton type="custom" href="#" size="small" :disabled=true>小号禁用自定义按钮</CustomButton>
<CustomButton type="custom" size="large" :disabled=false>大号自定义按钮</CustomButton>
</div>

## MarkerText 组件使用示例

### 记号笔效果
<span class='marker'>这是一个记号笔效果（原始）</span>

```html [html]
<span class='marker'>这是一个记号笔效果</span>
```

该效果取自[千浔物语](https://docs.fe-qianxun.com/efficiency/software/vitepress#记号笔)的记号笔内容，本站的展示的信息容器也都取自该博客。

但原版存在不能换行的问题，在小屏幕上容易超出屏幕，对移动端极不友好，这里做了优化，将其转换为行内元素，从而解决该问题。

::: whiteboard 记号笔示例：
在使用 html 元素的时候，<span class="marker">必须将 markdown 容器首行的`:::`与带有 html 元素的代码空行使用，否则对应的容器会失效并显现原来的文本。</span>
:::

### 标签的基本使用
虽然此时记号笔的效果基本够用了，但是还是缺少对颜色和背景样式的支持，下面介绍封装后的`<MarkerText>`组件的使用。

<MarkerText>这是默认颜色（绿色）标记文本</MarkerText>

``` html
<MarkerText>这是默认颜色（绿色）标记文本</MarkerText> <!-- 或<marker-text></marker-text> -->

```

### 属性用法

#### 不同自定义颜色
<div style="margin: 10px 0;">
  <MarkerText color="red">红色标记文本</MarkerText>
  <MarkerText color="orange">橙色标记文本</MarkerText>
  <MarkerText color="blue">蓝色标记文本</MarkerText>
  <MarkerText color="purple">紫色标记文本</MarkerText>
  <MarkerText color="magenta">品红色标记文本</MarkerText>
</div>

> [!info]
> 还可以<marker-text color="rgba(1, 22, 255, 0.3)">自定义颜色标记文本</marker-text>

```html [html]
<div style="margin: 10px 0;">
  <MarkerText color="red">红色标记文本</MarkerText>
  <MarkerText color="orange">橙色标记文本</MarkerText>
  <MarkerText color="blue">蓝色标记文本</MarkerText>
  <MarkerText color="purple">紫色标记文本</MarkerText>
  <MarkerText color="magenta">品红色标记文本</MarkerText>
</div>

  > [!info]
  > 还可以<marker-text color="rgba(1, 22, 255, 0.3)">自定义颜色标记文本</marker-text>
```

#### Full 状态（完全覆盖）
旁边是<MarkerText status="full">被完全覆盖的标记文本</MarkerText>

下面来对比一下默认状态和**full**状态的区别：
<div style="margin: 10px 0;">
  <MarkerText color="blue">这是一段多行文本示例，用于展示 MarkerText 组件在多行情况下的表现。当文本内容超过容器宽度时，会自动换行，并且每行都会正确应用标记效果。</MarkerText>
</div>

<div style="margin: 10px 0;">
  <MarkerText color="red" status="full">这是一段 full 状态的多行文本示例，用于展示完全覆盖模式下的多行表现。所有行都会被完全覆盖，并且没有悬停效果。</MarkerText>
</div>

``` html [html]
<div style="margin: 10px 0;">
  <MarkerText color="blue">这是一段多行文本示例，用于展示 MarkerText 组件在多行情况下的表现。当文本内容超过容器宽度时，会自动换行，并且每行都会正确应用标记效果。</MarkerText>
</div>

<div style="margin: 10px 0;">
  <MarkerText color="red" status="full">这是一段 full 状态的多行文本示例，用于展示完全覆盖模式下的多行表现。所有行都会被完全覆盖，并且没有悬停效果。</MarkerText>
</div>
```
> [!caution] 可能影响
> 对比原博客中的记号笔，本站的记号笔动画会有轻微的抖动（不放大看不出来），如果介意可以选择原博客的效果。

## 图片的全屏查看
在 vitepress 中，图片默认是不支持全屏查看的，但可以导入插件实现。本站已实现该全屏查看功能该拓展功能源自[千浔物语](https://docs.fe-qianxun.com/efficiency/software/vitepress#图片缩放)的图片缩放。

```md [md]
![测试：主页图片展示](/img/index_show.png)
<div class="figure-caption">测试：主页图片展示(增加放大全屏功能)</div>
```

![测试：主页图片展示](/img/index_show.png)
<div class="figure-caption">测试：主页图片展示(增加放大全屏功能)</div>

## 关于代码块
vitepress 中的 markdown 关于代码块有很多扩展用法，如行高亮、代码组、导入代码片段、聚焦等等，参考[viteprss 官方](https://vitepress.dev/zh/guide/markdown#syntax-highlighting-in-code-blocks)，可自行研读。

## 白板容器使用示例
为了方便书写笔记或指定内容，本站自定义了一个 markdown 容器`whiteboard`，用于在笔记中展示代码、公式、图表等内容，容器内模拟了格子纸及 svg 外观。
一般情况下，在 vitepress 中使用了 markdown 的标题语法，都会在内嵌的目录中展示，而如果不想在`whiteboard`中的标题出现在目录中，需要用 html 标签`<h>`来代替 markdown 的`#`标题用法。

```md{20}
::: whiteboard 我的笔记本（自定义标题）
<h4>这是白板容器内部，支持所有 Markdown 语法：</h4>

<h4>列表语法</h4>

- 无序列表项 1
- 无序列表项 2
  - 子列表项

1. 有序列表项 1
2. 有序列表项 2

<h4>代码块</h4>

```python
print('hello world')
print('hello world')
name = "VitePress"
print(name)
# ```  这里由于与代码块冲突，所以用注释显示，使用时将'#'去掉即可
:::
```

::: whiteboard 我的笔记本（自定义标题）
<h4>这是白板容器内部，支持所有 Markdown 语法：</h4>

<h4>列表语法</h4>

- 无序列表项 1
- 无序列表项 2
  - 子列表项

1. 有序列表项 1
2. 有序列表项 2

<h4>代码块</h4>

```python
print('hello world')
print('hello world')
name = "VitePress"
print(name)
```
:::

## 数学公式
vitepress 中支持使用 ***LaTeX*** 语法来书写数学公式，本站的 whiteboard 容器可以用作展示数学公式。

原来的 LaTeX 语法生成的公式不会自动换行，会造成超出屏幕从而影响阅读体验，尤其是移动端，因此添加了内部横向滚动条。对于生成的公式，增添了鼠标悬停的外观，方便查看。如果想了解 LaTeX 的更多语法，可参考 [LaTeX 公式编辑器](https://www.latexlive.com/)以及 [LaTeX 公式语法](https://zhuanlan.zhihu.com/p/110756681)



::: whiteboard LaTeX Demo
 #### $\sqrt{3x-1}+(1+x)^2$ 

> 技巧：在容器内使用`#`来单独标记 LaTeX 公式是不会在目录中展示的。

展示公式：$h(x) = \frac{1}{1+e^{-x}}$
:::

## 使用自定义容器的注意事项
在自定义 markdown 容器的使用中，由于 markdown 语法是:

``` md [md]
::: 容器类型 <容器标题>
容器内容
:::
```
> [!caution] 注意
> 在使用自定义容器时：
> * 容器类型和容器标题之间不能有空格，否则会导致容器解析失败。
> * 必须将 markdown 容器首行的`:::`与带有 html 元素的代码空行使用，否则对应的容器会失效并显现原来的文本。

而`:::`只会与最近的且没有容器类型的`:::`匹配由此闭合容器，而不会与最外层的`:::`匹配。

这会导致两个容器永远也不可能在第二个容器之后的内容还在第一个容器内（内层容器闭合时会直接终止外层容器的解析，外层容器后续内容会被当作普通 markdown 解析，从而跑出容器外）。  

<span class='marker'>简单来说就是在自定义容器中不能嵌套自定义容器，</span>不过在容器内引用信息容器时，可以使用 github 风格，避免使用`:::`，例如：

```md [md]
::: details 点击展开查看更多
``` python
print('hello world')
print('hello world')
name = "VitePress"
print(name)
# ``` 这里由于与代码块冲突，所以用注释显示，现实使用时将'#'去掉即可
> [!note] 注意
> 这里面是藏起来的文字
:::
```
效果：
::: details 点击展开查看更多
``` python
print('hello world')
print('hello world')
name = "VitePress"
print(name)
```
> [!note] 注意
> 这里面是藏起来的文字
:::

如果实在需要嵌套自定义容器，也可以使用 HTML 标签来实现 ~~（需熟悉容器结构）~~ 。例如：


```md [md]
::: whiteboard 嵌套示例
  你好  
  早上好

  <div class="custom-block note">
    <div class="custom-block-title">注意</div>
    <p>今天下雨</p>
  </div>

  <a href="/pure.html" target="_self">Link to pure.html</a>

  晚上好
:::
```

<br>
效果如下：

::: whiteboard 嵌套示例
  你好  
  早上好

  <div class="custom-block note">
    <div class="custom-block-title">注意</div>
    <p>今天下雨</p>
  </div>

  晚上好
:::

## 关于 Markdown 的语法
在 vitepress 中，核心特性之一便是强大的 markdown 支持，本站的所有笔记都是基于 markdown 语法编写的。所以学习 markdown 语法是非常重要的。

学习资源：
- [Markdown 官方基本语法](https://www.markdown.cn/docs/tutorial-basics/basic-syntax)**（推荐）**
- [Markdown 官方扩展语法](https://www.markdown.cn/docs/tutorial-basics/extended-syntax)
- [Markdown 知乎教程](https://zhuanlan.zhihu.com/p/676634081)

## vitepress 的主题配置
查看 [vitepress 官方主题配置](https://vitepress.dev/zh/reference/default-theme-config)即可掌握网站基础的主题配置。

如设置导航栏、侧边栏、主页等。
