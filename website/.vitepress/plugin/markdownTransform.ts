import type { Plugin } from 'vite'

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
      const lines = code.split('\n');
      let result = '';
      let inQuote = false;
      let quoteContent = [];

      for (const line of lines) {
        if (line.match(/^>\s*:\s*/)) {
          // 遇到 >: 开头的行
          if (!inQuote) {
            // 开始新的引用容器
            inQuote = true;
            quoteContent = [];
          }
          // 清理 >: 并添加到内容中（保留原始格式）
          quoteContent.push(line.replace(/^>\s*:\s*/, ''));
        } else {
          // 遇到非 >: 开头的行
          if (inQuote) {
            // 结束当前引用容器
            inQuote = false;
            // 保留原始 Markdown 格式，让 VitePress 解析器处理
            const cleanedContent = quoteContent.join('\n');
            if (cleanedContent) {
              result += `<blockquote class="vp-quote-special">\n\n${cleanedContent}\n\n</blockquote>\n\n`;
            }
          }
          // 添加普通行
          result += line + '\n';
        }
      }

      // 处理文件末尾的引用容器
      if (inQuote) {
        const cleanedContent = quoteContent.join('\n');
        if (cleanedContent) {
          result += `<blockquote class="vp-quote-special">\n\n${cleanedContent}\n\n</blockquote>\n\n`;
        }
      }

      code = result;

      // 处理词性高亮 (n. v. adj. ad.)
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
      code = code.replace(/\b(n\.|v\.|adj\.|ad\.|prep\.|conj\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
        const color = posMap[match];
        return `&nbsp;<span style="color: ${color};">${match}</span>`;
      });

      return code
    }
  }
}