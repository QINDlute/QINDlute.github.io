/**
 * 处理 Markdown 中的 ">: " 特殊引用语法
 * @param content - Markdown 内容
 * @returns 处理后的 Markdown 内容
 */
export function processSpecialQuotes(content: string): string {
  const lines = content.split('\n');
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

  return result;
}

/**
 * 为统计工具处理 ">: " 特殊引用语法，转换为普通 Markdown
 * @param content - Markdown 内容
 * @returns 处理后的 Markdown 内容
 */
export function processSpecialQuotesForStats(content: string): string {
  const lines = content.split('\n');
  let result = '';
  let inQuote = false;
  let quoteContent = [];

  for (const line of lines) {
    if (line.match(/^>\s*:\s*/)) {
      // 遇到 >: 开头的行，转换为普通文本
      if (!inQuote) {
        inQuote = true;
        quoteContent = [];
      }
      // 清理 >: 并添加到内容中
      quoteContent.push(line.replace(/^>\s*:\s*/, ''));
    } else {
      // 遇到非 >: 开头的行
      if (inQuote) {
        // 结束当前引用容器，将内容作为普通文本添加
        inQuote = false;
        if (quoteContent.length > 0) {
          result += quoteContent.join('\n') + '\n';
        }
      }
      // 添加普通行
      result += line + '\n';
    }
  }

  // 处理文件末尾的引用容器
  if (inQuote && quoteContent.length > 0) {
    result += quoteContent.join('\n') + '\n';
  }

  return result;
}
