// .vitepress/scripts/export-localStorage.js
// 遍历导出整个网站的所有 localStorage 数据为 JSON 字符串
Object.keys(localStorage).forEach(key => {
  const value = localStorage.getItem(key);
  console.log(`Key: ${key}, Value: ${value}`);
});

// 只导出 /essays/ 这个网页的标注数据（而非整个域名）
const targetPath = '/essays/'; // 你要导出的网页路径
Object.keys(localStorage).forEach(key => {
  // 筛选仅该页面的标注key
  if (key === `vitepress-annotations-${targetPath}`) {
    const value = localStorage.getItem(key);
    console.log(`Key: ${key}, Value: ${value}`);
  }
});