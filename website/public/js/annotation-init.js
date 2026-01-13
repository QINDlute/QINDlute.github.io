// .vitepress\scripts\annotation-init.js
// 页面加载时立即执行，无需等待Vue/VitePress初始化
(function() {
  // 定义颜色配置（与useAnnotations.ts保持一致）
  const colorOptions = [
    { id: 'yellow', name: '黄色', rgba: 'rgba(234, 179, 8, 0.3)' },
    { id: 'red', name: '红色', rgba: 'rgba(239, 68, 68, 0.3)' },
    { id: 'green', name: '绿色', rgba: 'rgba(34, 197, 94, 0.3)' },
    { id: 'blue', name: '蓝色', rgba: 'rgba(59, 130, 246, 0.3)' }
  ];

  // 获取当前页面路径
  const getCurrentPageUrl = () => {
    return window.location.pathname;
  };

  // 加载标注数据
  const loadAnnotations = () => {
    try {
      const currentPage = getCurrentPageUrl();
      const saved = localStorage.getItem(`vitepress-annotations-${currentPage}`);
      if (saved) {
        return JSON.parse(saved).map((anno) => ({
          ...anno,
          createdAt: new Date(anno.createdAt),
          updatedAt: new Date(anno.updatedAt)
        }));
      }
    } catch (err) {
      console.error('Failed to load annotations:', err);
    }
    return [];
  };

  // 渲染标注到页面
  const renderAnnotations = () => {
    // 清除之前的高亮
    const existingHighlights = document.querySelectorAll('.text-highlight');
    existingHighlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });

    // 渲染当前页面的标注
    const annotations = loadAnnotations();
    
    annotations.forEach(annotation => {
      try {
        // 只处理可见的文本节点
        const textNodes = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          { acceptNode: node => node.parentElement && !node.parentElement.closest('.text-highlight') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }
        );
        
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent?.includes(annotation.text)) {
            textNodes.push(node);
          }
        }
        
        // 为匹配的文本节点添加高亮
        textNodes.forEach(textNode => {
          const text = textNode.textContent || '';
          const index = text.indexOf(annotation.text);
          if (index !== -1) {
            // 检查文本节点是否位于标题标签内（h1-h6）
            let parent = textNode.parentElement;
            let isInHeading = false;
            while (parent) {
              if (/^h[1-6]$/i.test(parent.tagName)) {
                isInHeading = true;
                break;
              }
              parent = parent.parentElement;
            }
            
            // 如果位于标题内，跳过添加高亮
            if (isInHeading) {
              continue;
            }
            
            // 创建高亮元素
            const span = document.createElement('span');
            span.className = 'text-highlight';
            const color = colorOptions.find(c => c.id === annotation.color);
            span.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)';
            span.style.borderRadius = '2px';
            span.style.padding = '0 2px';
            span.style.cursor = 'pointer';
            span.title = annotation.notes || annotation.text;
            
            // 分割文本节点
            const beforeText = text.substring(0, index);
            const highlightedText = text.substring(index, index + annotation.text.length);
            const afterText = text.substring(index + annotation.text.length);
            
            // 创建新的文本节点和高亮节点
            if (beforeText) {
              textNode.parentNode?.insertBefore(document.createTextNode(beforeText), textNode);
            }
            
            span.appendChild(document.createTextNode(highlightedText));
            
            // 为高亮元素添加点击事件
            span.addEventListener('click', (event) => {
              // 检查高亮元素是否在 VPContent 元素内
              const vpContent = document.querySelector('.VPContent');
              if (!vpContent || !vpContent.contains(span)) {
                return;
              }
              
              event.stopPropagation();
              const text = span.textContent || '';
              
              // 触发自定义事件，通知打开菜单
              const customEvent = new CustomEvent('highlight-click', {
                detail: {
                  text: text,
                  element: span
                },
                bubbles: true,
                composed: true
              });
              
              event.currentTarget?.dispatchEvent(customEvent);
            });
            
            textNode.parentNode?.insertBefore(span, textNode);
            
            if (afterText) {
              textNode.parentNode?.insertBefore(document.createTextNode(afterText), textNode);
            }
            
            // 删除原有的文本节点
            textNode.parentNode?.removeChild(textNode);
          }
        });
      } catch (error) {
        console.error('渲染标注失败:', error);
      }
    });
  };

  // 监听页面内容变化
  const observer = new MutationObserver(() => {
    // 使用防抖，减少触发次数
    clearTimeout(window.annotationRenderTimeout);
    window.annotationRenderTimeout = setTimeout(() => {
      renderAnnotations();
    }, 100);
  });

  // 检查当前路径是否允许标注
  // 使用全局配置的 allowedAnnotationPaths
  const isPathAllowed = () => {
    const currentPath = window.location.pathname;
    
    // 获取全局配置
    const vitepressThemeConfig = window.vitepressThemeConfig;
    const allowedPaths = vitepressThemeConfig?.allowedAnnotationPaths || ['/essays/']; // 默认配置
    
    return allowedPaths.some(excludePath => {
      if (excludePath.endsWith('/')) {
        // 前缀匹配（目录）
        return currentPath.startsWith(excludePath);
      }
      // 精确匹配（单个页面）
      return currentPath === excludePath;
    });
  };
  
  // 初始渲染
  const initialRender = () => {
    // 只在允许的路径上渲染标注
    if (isPathAllowed()) {
      // 尝试渲染标注
      renderAnnotations();
      
      // 检查页面是否有内容
      const contentElement = document.querySelector('.content, .main, article, .VPDoc');
      if (contentElement && contentElement.textContent.trim()) {
        // 如果有内容，开始监听变化
        observer.observe(contentElement, {
          childList: true,
          subtree: true
        });
      } else {
        // 如果没有内容，100ms后重试
        setTimeout(initialRender, 100);
      }
    }
  };

  // 立即执行初始渲染
  initialRender();
  
  // 监听路由变化事件 - 只在允许的路径上渲染标注
  window.addEventListener('popstate', () => {
    if (isPathAllowed()) {
      renderAnnotations();
    }
  });
  window.addEventListener('hashchange', () => {
    if (isPathAllowed()) {
      renderAnnotations();
    }
  });
  
  // 监听页面加载完成 - 只在允许的路径上渲染标注
  window.addEventListener('load', () => {
    if (isPathAllowed()) {
      renderAnnotations();
    }
  });
})();