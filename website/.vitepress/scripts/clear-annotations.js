// 以下命令在浏览器的开发者工具内的控制台面板执行
// 清空当前页面的标注
localStorage.removeItem(`vitepress-annotations-${window.location.pathname}`);

// 或清空所有页面的标注
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key?.startsWith('vitepress-annotations-')) {
    localStorage.removeItem(key);
  }
}

// 刷新页面
window.location.reload();