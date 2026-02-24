import type { Plugin } from 'vite'
import { processSpecialQuotes } from './functions'
import MarkdownIt from 'markdown-it'

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
      const lines = code.split('\n'); // 按行分割代码
      let inCodeBlock = false;
      let resultLines: string[] = [];
      
      for (const line of lines) {
        if (line.startsWith('```')) { // 检查是否进入或退出代码块
          inCodeBlock = !inCodeBlock;
          resultLines.push(line);
          continue;
        }
        if (inCodeBlock) {
          resultLines.push(line);
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
        'n.': 'rgba(251, 146, 60)', // 橙色
        'v.': 'rgba(239, 68, 68)', // 红色
        'adj.': 'rgba(59, 130, 246)', // 蓝色
        'ad.': 'rgba(168, 85, 247)', // 紫色
        'prep.': 'rgba(152, 251, 152)', // 薄荷绿
        'conj.': 'rgba(0, 255, 255)' // 青色
      }

      // 使用正则匹配独立出现的词性缩写
      // \b 确保匹配单词边界，防止误伤
      code = code.replace(/\b(n\.|v\.|adj\.|ad\.|prep\.|conj\.|pref\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
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

