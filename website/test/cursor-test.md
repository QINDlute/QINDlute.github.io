# 光标样式测试页面

## 光标样式说明

这是一个测试页面，用于展示 **purpleglass** 光标主题的各种光标效果。

> 光标文件来源：https://zhutix.com/ico/bolizi-cus/

::: info 重要规则
- **文本光标**：应用于所有 `input`、`code`、`.faq` 以及 `h1-h6`、`p` 等文本元素
- **特殊光标区域**：当文字位于 `.help`、`.crosshair`、`.move` 等特殊光标区域内时，这些文字会**继承父元素的光标**，而不是显示文本光标
- 这样设计是为了确保特殊交互区域的视觉一致性和用户体验
:::

---

## 1. 默认光标

将鼠标移动到普通区域（页面背景）即可看到默认光标。

::: details 点击查看默认光标代码
```css
html, body {
  cursor: url('/cursor/purpleglass/default.cur'), default !important;
}
```
:::

---

## 2. 链接与按钮光标

悬停下方元素查看链接/指针光标效果：

<div class="cursor-demo-grid">
  <div>
    <h3>链接示例</h3>
    <a href="#">这是一个链接</a>
    <br>
    <a href="#">点击我看看</a>
  </div>
  
  <div>
    <h3>按钮示例</h3>
    <button>普通按钮</button>
    <br>
    <button>另一个按钮</button>
  </div>
  
  <div>
    <h3>图片示例</h3>
    <img src="/img/index.png" alt="示例图片" width="100" />
  </div>
</div>

---

## 3. 帮助光标

<div class="help-demo">
  <div class="help">
    <h3>帮助信息</h3>
    <p>悬停此处查看帮助光标效果（标题和段落会继承帮助光标）</p>
  </div>
</div>

::: details 为什么这里的文字不显示文本光标？
当文字位于特殊光标区域内时（如 `.help`），这些文字会继承父元素的帮助光标，而不是显示文本光标。
:::

---

## 4. 交叉指针（精确）

<div class="crosshair-demo">
  <div class="crosshair">
    <h3>交叉指针</h3>
    <p>用于精确选择（标题和段落会继承交叉指针光标）</p>
    <div class="crosshair-box"></div>
  </div>
</div>

::: details 为什么这里的文字不显示文本光标？
当文字位于特殊光标区域内时（如 `.crosshair`），这些文字会继承父元素的交叉指针光标，而不是显示文本光标。
:::

---

## 5. 文本选择光标

<div class="text-demo">
  <h3>文本选择</h3>
  <p>悬停在此文本上查看文本光标效果。尝试选中文本内容。</p>
  
  <input type="text" value="输入框文本光标" readonly />
  
  <code>代码块中的光标</code>
</div>

::: tip 提示
这个区域**不在**任何特殊光标区域内，所以段落文字（`<p>`）和标题（`<h3>`）会显示文本光标。
:::

---

## 6. 可移动元素光标

<div class="move-demo">
  <div class="move" draggable="true">
    <h3>可拖拽元素</h3>
    <p>尝试拖动我！（标题和段落会继承移动光标）</p>
  </div>
</div>

::: details 为什么这里的文字不显示文本光标？
当文字位于特殊光标区域内时（如 `.move`），这些文字会继承父元素的移动光标，而不是显示文本光标。
:::

---

## 7. 禁用状态光标

<div class="disabled-demo">
  <button disabled>禁用按钮</button>
  <button class="is-disabled">禁用元素</button>
  <div class="readonly">只读元素</div>
</div>

---

## 8. 调整大小光标

<div class="resize-demo">
  <div class="resize-container">
    <div class="resize-horizontal" data-cursor="horizontal">
      <h4>水平调整</h4>
      <p>↔ 拖动边缘调整宽度</p>
    </div>
    <div class="resize-vertical" data-cursor="vertical">
      <h4>垂直调整</h4>
      <p>↕ 拖动边缘调整高度</p>
    </div>
    <div class="resize-diagonal-1" data-cursor="diagonal1">
      <h4>对角线调整 (↘)</h4>
      <p>拖动右下角</p>
    </div>
    <div class="resize-diagonal-2" data-cursor="diagonal2">
      <h4>对角线调整 (↙)</h4>
      <p>拖动左下角</p>
    </div>
  </div>
</div>

---

## 9. 忙碌状态光标

<div class="busy-demo">
  <div class="loading">
    <h3>加载中...</h3>
    <p>后台繁忙，不可交互</p>
  </div>
  
  <div class="wait">
    <h3>请稍候</h3>
    <p>等待中...</p>
  </div>
</div>

---

## 10. 后台繁忙但仍可交互

<div class="progress-demo">
  <div class="progress">
    <h3>正在处理...</h3>
    <p>后台繁忙，但仍可交互</p>
  </div>
</div>

---

## 11. 滚动条测试

<div class="scrollbar-demo">
  <p>页面已经应用了自定义滚动条样式。滚动条会使用主题品牌色，悬停时颜色会加深。</p>
  <ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
    <li>列表项 3</li>
    <li>列表项 4</li>
    <li>列表项 5</li>
    <li>列表项 6</li>
    <li>列表项 7</li>
    <li>列表项 8</li>
    <li>列表项 9</li>
    <li>列表项 10</li>
  </ul>
</div>

---

## 12. 其他交互元素

<div class="other-elements-demo">
  <details>
    <summary>可折叠的详细信息</summary>
    <p>这是详细信息内容，可以折叠和展开。</p>
  </details>
  
  <label>
    <input type="checkbox" />
    复选框选项
  </label>
  
  <select>
    <option>选项 1</option>
    <option>选项 2</option>
    <option>选项 3</option>
  </select>
</div>

<style>
.cursor-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.cursor-demo-grid h3 {
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand-1);
}

.cursor-demo-grid a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  margin: 0.5rem 0;
  display: inline-block;
}

.cursor-demo-grid button {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cursor-demo-grid img {
  border-radius: 8px;
  margin-top: 0.5rem;
}

.help-demo,
.crosshair-demo,
.busy-demo,
.progress-demo {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.help {
  padding: 1rem;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  text-align: center;
}

.crosshair {
  padding: 1rem;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  text-align: center;
}

.crosshair-box {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--vp-c-brand-1);
  margin: 1rem auto;
}

.resize-demo .resize-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.resize-demo [class^="resize-"] {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.resize-demo [class^="resize-"]:hover {
  background: var(--vp-c-brand-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resize-demo h4 {
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand-1);
}

.loading,
.wait {
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
}

.loading {
  border: 2px solid var(--vp-c-brand-1);
}

.wait {
  border: 2px dashed var(--vp-c-brand-1);
}

.progress {
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 8px;
  text-align: center;
}

.scrollbar-demo {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
  max-height: 200px;
  overflow-y: auto;
}

.scrollbar-demo ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.scrollbar-demo li {
  margin: 0.5rem 0;
}

.other-elements-demo {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.other-elements-demo details {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
}

.other-elements-demo summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--vp-c-brand-1);
}

.other-elements-demo label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.other-elements-demo select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
}

.disabled-demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.disabled-demo button:disabled,
.disabled-demo .is-disabled,
.disabled-demo .readonly {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

.move-demo {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.move-demo .move {
  padding: 2rem;
  background: var(--vp-c-brand-soft);
  border: 2px dashed var(--vp-c-brand-1);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.move-demo .move:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.text-demo {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-demo input {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
}

.text-demo code {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 4px;
  display: inline-block;
  margin-top: 0.5rem;
}
</style>
