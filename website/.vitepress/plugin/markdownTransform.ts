import type { Plugin } from 'vite'
import { processSpecialQuotes } from './functions'
import MarkdownIt from 'markdown-it'

// 渲染顺序：原始Markdown → Vite pre 阶段 → markdownTransform.ts → 生成 HTML 结构 → Markdown 解析 
// → markdown-it 插件 → config.mts 注册插件中标题内容 →最终 HTML 页面


// 创建 markdown-it 实例
const md = new MarkdownIt()

export function MarkdownTransform(): Plugin {
  return {
    name: 'md-link-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null
      if (id.includes('node_modules') || id.includes('.vitepress/config')) 
        return null

      // 先处理图片
      code = code.replace(/!\[(.*?)\]\((.*?)\)/g, (match, text, src) => {
        return src.startsWith('http') 
          ? `<img src="${src}" alt="${text || 'image'}" />`
          : match
      })

      // 再处理链接
      code = code.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)(?:\s+"(.*?)")?\)/g, 
        (match, text, href, title) => {
          return title === undefined
            ? `<CustomLink title="${text}" href="${href}" />`
            : match
        }
      )

      // 将 >: 转换为自定义 HTML
      code = processSpecialQuotes(code);

      // 处理 "& " 转换为 <interval></interval> 标签
      // 处理 faq-math 容器
      const lines = code.split('\n'); // 按行分割代码
      let inCodeBlock = false;
      let inFaqMathContainer = false;
      let inFaqMathTitle = false;
      let faqMathTitle = '';
      let faqMathContent = '';
      let faqMathActive = false;
      let resultLines: string[] = [];
      
      for (const line of lines) {
        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          resultLines.push(line);
          continue;
        }
        if (inCodeBlock) {
          resultLines.push(line);
          continue;
        }
        
        // 处理 faq-math 容器开始
        if (line.startsWith('::: faq-math')) {
          inFaqMathContainer = true;
          inFaqMathTitle = true;
          const fullLine = line.trim();
          const contentAfterFaqMath = fullLine.replace('::: faq-math', '').trim();
          const hasActive = contentAfterFaqMath.includes('active');
          let titleContent = hasActive ? contentAfterFaqMath.replace('active', '').trim() : contentAfterFaqMath;
          const hashIndex = titleContent.indexOf('#');
          if (hashIndex !== -1) {
            titleContent = titleContent.substring(0, hashIndex).trim();
            inFaqMathTitle = false;
          }
          faqMathActive = hasActive;
          faqMathTitle = titleContent;
          faqMathContent = '';
          continue;
        }
        
        // 处理 faq-math 标题（多行）
        if (inFaqMathContainer && inFaqMathTitle) {
          const lineContent = line.trim();
          const hashIndex = lineContent.indexOf('#');
          if (hashIndex !== -1) {
            const titlePart = lineContent.substring(0, hashIndex).trim();
            if (titlePart) {
              faqMathTitle += ' ' + titlePart;
            }
            inFaqMathTitle = false;
          } else {
            if (lineContent) {
              faqMathTitle += ' ' + lineContent;
            }
          }
          continue;
        }
        
        // 处理 faq-math 容器结束
        if (inFaqMathContainer && line.startsWith(':::')) {
          inFaqMathContainer = false;
          inFaqMathTitle = false;
          const activeClass = faqMathActive ? 'active' : '';
          resultLines.push(`<div class="faq ${activeClass}">`);
          resultLines.push(`<h3 class="faq-title">`);
          resultLines.push(``);
          // 处理标题，支持多行（按句号分割）
          const titleLines = faqMathTitle.split('。');
          for (const titleLine of titleLines) {
            if (titleLine.trim()) {
              resultLines.push(`$${titleLine.trim()}$`);
            }
          }
          resultLines.push(`</h3>`);
          resultLines.push(`<div class="faq-text">`);
          resultLines.push(``);
          resultLines.push(faqMathContent);
          resultLines.push(`</div>`);
          resultLines.push(`<button class="faq-toggle">`);
          resultLines.push(`<i class="fas fa-chevron-down"></i>`);
          resultLines.push(`<i class="fas fa-times"></i>`);
          resultLines.push(`</button>`);
          resultLines.push(`</div>`);
          continue;
        }
        
        // 收集 faq-math 容器内容
        if (inFaqMathContainer) {
          faqMathContent += line + '\n';
          continue;
        }
        
        const match = line.match(/(^|\s)(&\s)(.+)/);
        if (match) {
          const before = line.slice(0, match.index + match[1].length);
          const after = match[3];
          const renderedAfter = md.renderInline(after);
          resultLines.push(`${before}<interval>${renderedAfter}</interval>`);
        } else {
          resultLines.push(line);
        }
      }
      
      code = resultLines.join('\n');

      // 处理词性高亮 (n. v. adj. ad. prep. conj. pref.)
      // 使用 marker.css 中定义的颜色，保持颜色风格一致
      const posMap: Record<string, string> = {
        'n.': 'rgba(251, 146, 60)', // 橙色，名词
        'pron.': 'rgba(245, 158, 11)', // 琥珀色，代词
        'adj.': 'rgba(59, 130, 246)', // 蓝色，形容词
        'ad.': 'rgba(168, 85, 247)', // 紫色，副词
        'v.': 'rgba(239, 68, 68)', // 红色，动词
        'num.': 'rgba(16, 185, 129)', // 绿色，数词
        'art.': 'rgba(96, 165, 250)', // 浅蓝，冠词
        'prep.': 'rgba(152, 251, 152)', // 薄荷绿，介词
        'conj.': 'rgba(0, 255, 255)', // 青色，连词
        'int.': 'rgba(236, 72, 153)' // 粉色，感叹词
      }

      // 使用正则匹配独立出现的词性缩写
      // \b 确保匹配单词边界，防止误伤
      code = code.replace(/\b(n\.|pron\.|adj\.|ad\.|v\.|num\.|art\.|prep\.|conj\.|int\.|pref\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
        // 对 pref. 特殊处理，使用渐变效果
        if (match === 'pref.') {
          return `&nbsp;<span class="text-gradient">${match}</span>`;
        }
        const color = posMap[match];
        return `&nbsp;<span style="color: ${color};">${match}</span>`;
      });

      return code
    }
  }
}

