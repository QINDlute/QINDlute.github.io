// .vitepress/scripts/calculateLiCount.ts
// Node.js 环境下运行
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import MarkdownIt from 'markdown-it';
import { parse } from 'node-html-parser';
import { processSpecialQuotesForStats } from '../plugin/functions';

const md = new MarkdownIt();

// 解析 Markdown 文件的 frontmatter
function parseFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (!frontmatterMatch) {
    return {};
  }
  
  const frontmatterContent = frontmatterMatch[0].replace(/^---|---$/g, '').trim();
  const frontmatter: Record<string, any> = {};
  
  frontmatterContent.split('\n').forEach(line => {
    const match = line.match(/^\s*(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      // 简单处理布尔值
      if (value === 'true') {
        frontmatter[key] = true;
      } else if (value === 'false') {
        frontmatter[key] = false;
      } else {
        frontmatter[key] = value.trim();
      }
    }
  });
  
  return frontmatter;
}

// 计算目录下所有 Markdown 文件中的 ul > li 标签数量
// 只计算 frontmatter 中 word: true 的文件
// 逻辑与 ArticleMetadata.vue 中的 dashWordCount 一致
function calculateLiCount(dirPath: string): number {
  let totalCount = 0;
  
  function processDirectory(path: string) {
    const files = readdirSync(path, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = join(path, file.name);
      
      if (file.isDirectory()) {
        processDirectory(fullPath);
      } else if (file.name.endsWith('.md')) {
        const content = readFileSync(fullPath, 'utf8');
        
        // 解析 frontmatter，只处理 word: true 的文件
        const frontmatter = parseFrontmatter(content);
        if (frontmatter.word !== true) {
          continue;
        }
        
        // 处理特殊引用语法 ">: "，将其转换为普通 Markdown 以便正确渲染列表
        const processedContent = processSpecialQuotesForStats(content);
        
        const html = md.render(processedContent);
        
        // 使用 HTML 解析器统计 ul > li
        const root = parse(html);
        const listItems = root.querySelectorAll('ul li:not(:has(ul)):not(:has(ol))');
        totalCount += listItems.length;
      }
    }
  }
  
  processDirectory(dirPath);
  return totalCount;
}

// 导出函数供配置文件使用
export function getLiCountForVocabulary() {
  const vocabPath = join(__dirname, '../../study/english/vocabulary/basic_vocabulary');
  return calculateLiCount(vocabPath);
}