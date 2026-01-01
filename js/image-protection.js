// 图片保护措施 - 防止下载
(function() {
  // 1. 禁止右键菜单（针对图片）
  document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      // alert('图片受保护，禁止下载');
    }
  });
  
  // 2. 禁止图片拖拽
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
  
  // 3. 禁止选择图片
  // document.addEventListener('selectstart', function(e) {
  //   if (e.target.tagName === 'IMG') {
  //     e.preventDefault();
  //   }
  // });
  
  // 4. 保护hero区域图片
  window.addEventListener('load', function() {
    const heroSection = document.querySelector('.VPHero');
    if (heroSection) {
      // 为hero区域添加整体保护
      heroSection.style.userSelect = 'none';
      heroSection.style.pointerEvents = 'none';
      
      // 但允许内部按钮和链接点击
      const interactiveElements = heroSection.querySelectorAll('button, a, .VPButton');
      interactiveElements.forEach(el => {
        el.style.pointerEvents = 'auto';
      });
    }
  });
})();
