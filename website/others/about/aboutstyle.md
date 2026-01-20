# 样式示例

## VitePress 基础
### 关于 Markdown 的语法
VitePress 的核心特性之一便是强大的 markdown 支持，本站的所有笔记都是基于 markdown 语法编写的。所以学习 markdown 语法非常重要。

学习资源：
- [Markdown 官方基本语法](https://www.markdown.cn/docs/tutorial-basics/basic-syntax)**（推荐）**
- [Markdown 官方扩展语法](https://www.markdown.cn/docs/tutorial-basics/extended-syntax)
- [Markdown 知乎教程](https://zhuanlan.zhihu.com/p/676634081)

### VitePress 的主题配置
查看 [VitePress 官方主题配置](https://vitepress.dev/zh/reference/default-theme-config)即可掌握网站基础的主题配置。

如设置导航栏、侧边栏、主页等。

### VitePress 的代码块语法
VitePress 中的 markdown 关于代码块有很多扩展用法，如行高亮、代码组、导入代码片段、聚焦等等，参考[VitePress 官方](https://vitepress.dev/zh/guide/markdown#syntax-highlighting-in-code-blocks)，可自行研读。

## 信息容器使用示例

以下枚举主要信息容器的使用示例：

```md
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

```html
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

### 记号笔样式
<span class='marker'>这是一个记号笔效果（原始）</span>

```html
<span class='marker'>这是一个记号笔效果（原始）</span>
<!-- 或 这是一个记号笔效果（原始）{.marker} -->
```

该原始样式取自[千浔物语](https://docs.fe-qianxun.com/efficiency/software/vitepress#记号笔)的记号笔样式，另外本站所展示的信息容器也都取自千浔物语。

但原始样式存在不能换行的问题，在小屏幕上容易超出屏幕，对移动端极不友好，这里将其转换为行内元素，从而解决该问题。

::: whiteboard 记号笔示例：
在使用 html 元素的时候，<span class="marker">必须将 markdown 容器首行的`:::`与带有 html 元素的代码空行使用，否则对应的容器会失效并显现原来的文本。</span>
:::

### 记号笔标签的使用
虽然此时记号笔的效果已经够用，但缺少对颜色和背景样式的支持，这里封装了一个`<MarkerText>`组件，用于支持自定义颜色和背景样式。

下面介绍封装后的`<MarkerText>`组件的使用。

<MarkerText>这是默认颜色（绿色）标记文本</MarkerText>

``` html
<MarkerText>这是默认颜色（绿色）标记文本</MarkerText>
<!-- 或<marker-text></marker-text> -->
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

```html
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

``` html
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
在 VitePress 中，图片默认是不支持全屏查看的，但可以导入插件实现。本站已实现全屏查看图片，该拓展功能源自[千浔物语](https://docs.fe-qianxun.com/efficiency/software/vitepress#图片缩放)的图片缩放。

```md
![主页图片展示](/img/index_show.png){.center}
图一&emsp;主页图片展示(增加放大全屏功能){.figure-caption}
```

![主页图片展示](/img/index_show.png){.center}

图一&emsp;主页图片展示(增加放大全屏功能){.figure-caption}


## 白板容器使用示例
为了方便书写笔记或指定内容，本站自定义了一个 markdown 容器`whiteboard`，用于在笔记中展示代码、公式、图表等内容，容器内模拟了格子纸及 svg 外观。

> [!NOTE] 
> 一般情况下，在 VitePress 中使用了 markdown 的标题语法，都会在内嵌的目录中展示，而如果不想在`whiteboard`中的标题出现在目录中，需要用 html 标签`<h>`来代替 markdown 的`#`标题用法。

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

## FAQ 容器使用示例
该容器用于展示常见问题的折叠面板，参考[github 前端项目](https://github.com/solygambas/html-css-javascript-projects/tree/main/012-FAQ%20collapse)。

以下展示 FAQ 容器的使用示例：

```md
::: faq 基本用法示例
这是一个基本的 FAQ 折叠面板，默认是收起状态。
:::

::: faq active 初始展开示例
这个 FAQ 面板在加载时就会展开。
:::

::: faq
没有标题的 FAQ 面板，会显示默认标题。
:::

**多个 FAQ 项**

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
```

::: faq 基本用法示例
这是一个基本的 FAQ 折叠面板，默认是收起状态。
:::

::: faq active 初始展开示例
这个 FAQ 面板在加载时就会展开。
:::

::: faq
没有标题的 FAQ 面板，会显示默认标题。
:::

**多个 FAQ 项**

<div class="faq-container">

::: faq 问题 1
答案 1
:::

::: faq 问题 2
答案 2
:::

::: faq 问题 3
答案 3
:::

</div>


## 数学公式
VitePress 中支持使用 ***LaTeX*** 语法来书写数学公式，本站的 whiteboard 容器可以用作展示数学公式。

原来的 LaTeX 语法生成的公式不会自动换行，会造成超出屏幕从而影响阅读体验，尤其是移动端，因此添加了内部横向滚动条。对于生成的公式，增添了鼠标悬停的外观，方便查看。如果想了解 LaTeX 的更多语法，可参考 [LaTeX 公式编辑器](https://www.latexlive.com/)以及 [LaTeX 公式语法](https://zhuanlan.zhihu.com/p/110756681)

::: whiteboard LaTeX Demo
 #### $\sqrt{3x-1}+(1+x)^2$ 

> 技巧：在容器内使用`#`来单独标记 LaTeX 公式是不会在目录中展示的。

展示公式：$h(x) = \frac{1}{1+e^{-x}}$
:::


## 使用自定义容器的注意事项
在自定义 markdown 容器的使用中，由于 markdown 语法是:

``` md
::: 容器类型 <容器标题>
容器内容
:::
```
> [!caution] 注意
> 在使用自定义容器时：
> * 容器类型和容器标题之间不能有空格，否则会导致容器解析失败。
> * Markdown 语法必须与 HTML 元素空格使用，因为直接紧跟的 Markdown 语法会被当作内联内容处理，导致解析错误

由于`:::`只会与最近的且没有容器类型的`:::`匹配由此闭合容器，而不会与最外层的`:::`匹配。

这会导致两个容器永远也不可能在第二个容器之后的内容还在第一个容器内（内层容器闭合时会直接终止外层容器的解析，外层容器后续内容会被当作普通 markdown 解析，从而跑出容器外）。  

<span class='marker'>简单来说就是在自定义容器中不能嵌套自定义容器，</span>不过在容器内引用信息容器时，可以使用 github 风格，避免使用`:::`，例如：

```md
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


```md
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


## 自定义页面记忆滚动位置
默认情况下，vitepress 不会记忆每个页面的滚动位置，当用户在页面间导航（比如点击返回上一页、切换侧边栏链接）时，目标页面会默认滚动到顶部。
本站自定义了插件，默认所有页面都记忆滑轮位置，但允许用户设置 `.vitepress/theme/index.ts` 中的 scrollMemoryExcludes 来使得某些路径不记忆滚动位置。

::: code-group
```ts [index.ts]
// 配置：不使用滚动记忆功能的路径列表
// 支持精确匹配和前缀匹配（以/结尾）
const scrollMemoryExcludes: string[] = [
  // '/exact-path',          // 精确匹配单个页面
  // '/articles/category/',   // 匹配该目录下所有页面
  '/essays/poetry/',
  '/essays/ci/'
];
```
:::

## 选择文本功能菜单
本站自定义了一个菜单插件，当在文档内容（VPContent）区域选择文本后，会出现选择文本功能菜单，用户可以通过本菜单为选中的文本添加高亮、标注，或复制文本，搜索文本等操作。本菜单的样式参考了[flow阅读器](https://www.flowoss.com/zh-CN)的高亮笔记菜单的外观。


### 按钮介绍
下面介绍选择文本功能菜单的按钮
#### 菜单主页

![菜单页面](/img/aboutstyle/TextSelectionMenu.png){.center}

图二&emsp;选择文本功能菜单{.figure-caption}

第一排的按钮：
* 📋：文本复制
* 🔍：网页搜索（默认谷歌搜索）
* 📝：标注信息（换行`shift+enter`，保存`enter`，）
* 📚：词典查询（默认韦氏词典）
* 🧼：清除标注（`ctrl+del`）

第二排的按钮：为选择高亮颜色的选项，用户可以点击不同颜色按钮来为选中的文本添加不同颜色的高亮。


#### 标注窗口
点击标注📝按钮后进入标注窗口：

![标注窗口](/img/aboutstyle/NoteInput.png){.center}

图三&emsp;标注窗口{.figure-caption}

在输入框中输入标注信息后，点击保存按钮（`enter`）即可添加标注。

![标注示例](/img/aboutstyle/ShowMarker.png){.center}

图四&emsp;标注示例{.figure-caption}


### 标注的清除和导出
若想清除整个页面或全局的标注，可在浏览器（以Edge浏览器为例）开发者工具的控制台（`F12`→`控制台`）中执行以下命令：

<<< @/.vitepress/scripts/clear-annotations.js

或者直接手动操作 localStorage 中的数据（`F12`→`应用程序`→`本地存储`→`vitepress-annotations-/<页面路径>`）进行增删操作。

![localStorage 示例](/img/aboutstyle/localStorage.png){.center}

图五&emsp;localStorage 示例{.figure-caption}

> [!danger] 警告
> 本插件将标注等信息存放在了本地的 localStorage 中，需注意管理浏览器数据。清理`[Cookie 和其他网站数据]`会清除 localStorage，但清空浏览器缓存并不会影响标注数据。

页面的标注数据可以在不同的设备中共享，只需将本地的 localStorage 数据导出并导入到其他设备即可。

<<< @/.vitepress/scripts/export-localStorage.js


### 关于菜单的配置
本菜单默认所有页面都添加了选择文本功能菜单，但允许用户设置 `.vitepress/theme/index.ts` 中的 allowedAnnotationPaths 列表，允许特定的路径列表使用文本标注功能。同时还支持用户设置允许跨标签选择文本的元素列表，在该列表中的元素，其内部文本被选中后可触发菜单的显示。

::: code-group
```ts [index.ts]
// .vitepress/theme/index.ts
// 配置：允许使用文本标注功能的路径列表
// 支持精确匹配和前缀匹配（以/结尾）
const allowedAnnotationPaths: string[] = [
      '/others/',
      '/test'
];

// 配置：允许跨标签选择文本的元素列表
const allowedCrossElements: string[] = [
  'CODE',
  'PRE',
  'LI',
  'P'
];
```
:::

> [!NOTE]
> * 本功能菜单在移动端中的标注窗口不太稳定，PC 端则正常
> * 被选中的文本在取消高亮后，其原始样式会丢失，刷新后即可复原


## 英文朗读组件
关于朗读英文组件（不支持朗读中文）的使用，示例：

<TextReader>
  
  This is a simple test sentence. Click the speaker icon to hear it read aloud.{.marker}
</TextReader>

```html
<TextReader>

  This is a simple test sentence. Click the speaker icon to hear it read aloud.{.marker}
</TextReader>
```
点击文本右上角的按钮即可朗读文本，再次点击停止朗读，第三次点击则重新开始朗读，也可切换不同的文本进行朗读。

更多体验可查看 [TextReader 组件测试页面](/test/text-reader-test)

> [!warning]
> 本组件依赖Web Speech API，而移动浏览器出于性能和隐私考虑，限制了Web Speech API的某些功能，因此移动端只有默认语音来完成朗读功能。
