// c:sersindesktopAQ_docsebsitevitepresscriptsnnotation-init.js
// 页面加载时立即执行，处理标注渲染
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

  // 检查当前路径是否允许标注
  const isPathAllowed = () => {
    const currentPath = window.location.pathname;
    
    // 获取全局配置
    const config = (window as any).vitepressThemeConfig;
    
    // 如果没有配置允许的路径，则默认允许所有路径
    if (!config?.allowedAnnotationPaths || config.allowedAnnotationPaths.length === 0) {
      return true;
    }
    
    return config.allowedAnnotationPaths.some((allowedPath: string) => {
      if (allowedPath.endsWith('/')) {
        // 前缀匹配
        return currentPath.startsWith(allowedPath);
      }
      // 精确匹配
      return currentPath === allowedPath;
    });
  };

  // 渲染单个高亮元素
  const renderSingleHighlight = (annotation) => {
    try {
      // 只处理可见的文本节点，且位于 VPContent 内
      const vpContent = document.querySelector('.VPContent');
      if (!vpContent) return;

      // 1. 先收集所有匹配的文本节点
      const textNodes = [];
      
      const walker = document.createTreeWalker(
        vpContent,
        NodeFilter.SHOW_TEXT,
        { 
          acceptNode: node => {
            if (!node.parentElement) return NodeFilter.FILTER_SKIP;
            if (node.parentElement.closest('.text-highlight')) return NodeFilter.FILTER_SKIP;
            if (!node.textContent?.includes(annotation.text)) return NodeFilter.FILTER_SKIP;
            
            // 检查是否在标题内
            let parent = node.parentElement;
            while (parent) {
              if (/^h[1-6]$/i.test(parent.tagName)) {
                return NodeFilter.FILTER_SKIP;
              }
              parent = parent.parentElement;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      // 如果没有匹配的文本节点，跳过
      if (textNodes.length === 0) return;

      // 2. 查找可用的文本节点来渲染当前标注
      // 跳过已经有高亮的文本节点
      for (const textNode of textNodes) {
        // 检查该文本节点是否已经被其他标注使用
        let isUsed = false;
        let parent = textNode.parentElement;
        while (parent) {
          if (parent.classList.contains('text-highlight')) {
            isUsed = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (isUsed) continue;
        
        const text = textNode.textContent || '';
        const index = text.indexOf(annotation.text);
        if (index === -1) continue;

        // 3. 创建高亮元素
        const span = document.createElement('span');
        span.className = 'text-highlight';
        span.dataset.annotationId = annotation.id; // 添加唯一标注ID
        const color = colorOptions.find(c => c.id === annotation.color);
        span.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)';
        span.style.borderRadius = '2px';
        span.style.padding = '0 2px';
        span.style.cursor = 'pointer';
        span.title = annotation.notes || annotation.text;

        // 4. 分割文本节点并添加高亮
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
          event.stopPropagation();
          const text = span.textContent || '';
          
          // 触发自定义事件，通知打开菜单，传递标注ID
          const customEvent = new CustomEvent('highlight-click', {
            detail: {
              text: text,
              element: span,
              annotationId: span.dataset.annotationId // 添加标注ID
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
        
        // 只渲染一个匹配项，跳出循环
        break;
      }
    } catch (error) {
      console.error('渲染标注失败:', error);
    }
  };

  // 渲染所有标注到页面
  const renderAnnotations = () => {
    // 只在允许的路径上渲染标注
    if (!isPathAllowed()) return;

    // 获取当前页面的所有标注
    const annotations = loadAnnotations();
    
    // 1. 先收集所有现有的高亮元素
    const existingHighlights = new Map();
    document.querySelectorAll('.text-highlight').forEach(el => {
      const annotationId = el.dataset.annotationId;
      if (annotationId) {
        existingHighlights.set(annotationId, el);
      }
      // 不再兼容旧元素的textContent查找
    });
    
    // 2. 渲染或更新每个标注
    annotations.forEach(annotation => {
      // 检查是否已经有对应标注ID的高亮元素
      const existingHighlight = existingHighlights.get(annotation.id) || document.querySelector(`[data-annotation-id="${annotation.id}"]`);
      
      if (existingHighlight) {
        // 高亮元素已存在，检查是否需要更新
        const color = colorOptions.find(c => c.id === annotation.color);
        const currentColor = existingHighlight.style.backgroundColor;
        if (currentColor !== (color?.rgba || 'rgba(234, 179, 8, 0.3)')) {
          // 更新颜色
          existingHighlight.style.backgroundColor = color ? color.rgba : 'rgba(234, 179, 8, 0.3)';
        }
        // 更新标题
        existingHighlight.title = annotation.notes || annotation.text;
        // 确保元素有标注ID
        existingHighlight.dataset.annotationId = annotation.id;
        // 从待处理列表中移除
        existingHighlights.delete(annotation.id);
      } else {
        // 高亮元素不存在，创建新的
        renderSingleHighlight(annotation);
      }
    });
    
    // 3. 删除不再需要的高亮元素
    existingHighlights.forEach((el, key) => {
      // 检查该高亮元素是否还有对应的标注
      const isStillNeeded = annotations.some(anno => anno.id === key);
      if (!isStillNeeded) {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ''), el);
          parent.normalize();
        }
      }
    });
  };

  // 初始渲染
  const initialRender = () => {
    // 只在允许的路径上渲染标注
    if (!isPathAllowed()) return;

    // 检查VPContent是否存在
    const vpContent = document.querySelector('.VPContent');
    if (!vpContent) {
      // 如果VPContent不存在，100ms后重试
      setTimeout(initialRender, 100);
      return;
    }

    // 执行渲染
    renderAnnotations();
  };

  // 路由变化处理
  const handleRouteChange = () => {
    // 延迟执行渲染，确保页面内容已经更新
    setTimeout(() => {
      initialRender();
    }, 300);
  };

  // 页面加载完成后执行初始渲染
  if (document.readyState === 'loading') {
    // 如果页面还在加载中，等待DOMContentLoaded事件
    document.addEventListener('DOMContentLoaded', () => {
      // DOM加载完成后，延迟100ms再执行初始渲染
      setTimeout(initialRender, 100);
    });
  } else {
    // 页面已经加载完成，延迟100ms执行初始渲染
    setTimeout(initialRender, 100);
  }

  // 监听路由变化事件
  // 1. 监听浏览器前进/后退事件
  window.addEventListener('popstate', handleRouteChange);

  // 2. 监听URL哈希变化
  window.addEventListener('hashchange', handleRouteChange);

  // 3. 监听VitePress路由变化事件
  window.addEventListener('vitepress:route-changed', handleRouteChange);

  // 4. 监听页面可见性变化（标签页切换）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleRouteChange();
    }
  });

  // 5. 监听VitePress内容更新事件
  window.addEventListener('vitepress:content-updated', handleRouteChange);

  // 6. 轮询检查URL变化（最可靠的方式）
  let currentUrl = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== currentUrl) {
      currentUrl = window.location.pathname;
      handleRouteChange();
    }
  }, 300); // 每300ms检查一次，增加频率以提高响应速度

  // 7. 添加MutationObserver监听DOM变化，确保动态内容加载后也能渲染标注
  const vpContentObserver = new MutationObserver(() => {
    // 延迟执行，确保内容已经完全加载
    setTimeout(() => {
      initialRender();
    }, 200);
  });

  // 启动Observer，监听VPContent区域的变化
  const observerTarget = document.querySelector('.VPContent');
  if (observerTarget) {
    vpContentObserver.observe(observerTarget, {
      childList: true,
      subtree: true,
      attributes: false
    });
  } else {
    // 如果VPContent还不存在，等待DOM加载完成后再启动Observer
    document.addEventListener('DOMContentLoaded', () => {
      const target = document.querySelector('.VPContent');
      if (target) {
        vpContentObserver.observe(target, {
          childList: true,
          subtree: true,
          attributes: false
        });
      }
    });
  }

  // 导出到全局，方便调试
  window.renderAnnotations = renderAnnotations;
})();
