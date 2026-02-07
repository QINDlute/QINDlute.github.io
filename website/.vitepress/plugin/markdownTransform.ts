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
      code = code.replace(/^>\s*:\s*(.+)$/gm, (match, content) => {
        return `<blockquote class="vp-quote-special">\n\n${content}\n\n</blockquote>`
      })

      // 处理词性高亮 (n. v. adj. ad.)
      // 使用 marker.css 中定义的颜色，保持颜色风格一致
      const posMap: Record<string, string> = {
        'n.': 'rgba(251, 146, 60)',
        'v.': 'rgba(239, 68, 68)',
        'adj.': 'rgba(59, 130, 246)',
        'ad.': 'rgba(168, 85, 247)',
        'prep.': 'rgba(152, 251, 152)' // 薄荷绿
      }

      // 使用正则匹配独立出现的词性缩写
      // \b 确保匹配单词边界，防止误伤
      code = code.replace(/\b(n\.|v\.|adj\.|ad\.|prep\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
        const color = posMap[match];
        return `&nbsp;<span style="color: ${color};">${match}</span>`;
      });

      return code
    }
  }
}