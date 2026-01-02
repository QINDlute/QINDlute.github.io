// 页面加载时立即执行，无需等待Vue/VitePress初始化
(function() {
  // 字体大小等级映射
  const fontSizeLevels = [12, 14, 16, 18, 20];
  
  // 读取localStorage配置，使用默认值作为备选
  let storedFontSizeLevel = 2;
  try {
    const rawSize = localStorage.getItem('vitepress-font-size-level');
    if (rawSize) {
      storedFontSizeLevel = parseInt(rawSize);
      // 确保值在有效范围内
      storedFontSizeLevel = Math.max(0, Math.min(4, storedFontSizeLevel));
    }
  } catch (e) {
    console.warn('读取字体大小存储失败，使用默认值', e);
  }
  
  let storedFontType = 'sans';
  try {
    const rawType = localStorage.getItem('vitepress-font-type');
    if (rawType && ['sans', 'serif'].includes(rawType)) {
      storedFontType = rawType;
    }
  } catch (e) {
    console.warn('读取字体类型存储失败，使用默认值', e);
  }
  
  let storedTheme = 'white';
  try {
    const rawTheme = localStorage.getItem('vitepress-theme');
    if (rawTheme && ['white', 'sepia', 'night'].includes(rawTheme)) {
      storedTheme = rawTheme;
    }
  } catch (e) {
    console.warn('读取主题存储失败，使用默认值', e);
  }
  
  // 获取HTML根元素
  const htmlRoot = document.documentElement;
  
  // 应用字体大小
  const currentFontSize = fontSizeLevels[storedFontSizeLevel];
  htmlRoot.style.setProperty('--vp-custom-font-size', currentFontSize + 'px');
  
  // 应用字体类型
  htmlRoot.className = htmlRoot.className.replace(/font-\w+/g, '');
  htmlRoot.classList.add('font-' + storedFontType);
  
  // 应用主题
  htmlRoot.className = htmlRoot.className.replace(/theme-\w+/g, '');
  htmlRoot.classList.add('theme-' + storedTheme);
  
  // 处理深色模式
  if (storedTheme === 'night') {
    htmlRoot.classList.add('dark');
  } else {
    htmlRoot.classList.remove('dark');
  }
})();
