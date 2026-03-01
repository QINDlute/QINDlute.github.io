// website/.vitepress/config.mts
import { defineConfig } from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/vitepress/dist/node/index.js";
import { resolve } from "path";
import markdownItContainer from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/markdown-it-container/index.mjs";
import { groupIconMdPlugin, groupIconVitePlugin } from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/vitepress-plugin-group-icons/dist/index.js";
import Icons from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/unplugin-icons/dist/resolver.mjs";
import Components from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/unplugin-vue-components/dist/vite.mjs";
import UnoCSS from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/unocss/dist/vite.mjs";
import { presetUno, presetIcons, presetAttributify } from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/unocss/dist/index.mjs";

// website/.vitepress/configs/nav.ts
var nav = [
  { text: "\u9996\u9875", link: "/" },
  {
    text: "\u5B66\u4E60",
    items: [
      {
        text: "\u82F1\u8BED",
        items: [
          { text: "\u5199\u4F5C", link: "/study/english/writing/ChangeYourLife" },
          { text: "\u8BCD\u6C47", link: "/study/english/vocabulary/basic_vocabulary/A" },
          { text: "\u957F\u96BE\u53E5", link: "/study/english/sentence/2-3" }
        ]
      },
      { text: "\u6570\u5B66", link: "#" }
    ]
  },
  {
    text: "\u968F\u7B14",
    items: [
      {
        text: "\u8BD7\u8BCD",
        items: [
          { text: "\u65E0\u82B1", link: "/essays/poetry/\u65E0\u82B1" },
          { text: "\u7A7A\u54CD", link: "/essays/poetry/\u7A7A\u54CD" },
          { text: "\u8BC9\u8877\u60C5", link: "/essays/ci/\u8BC9\u8877\u60C5\xB7\u773C\u6B32\u7A7F" }
        ]
      }
    ]
  },
  {
    text: "\u5173\u4E8E",
    items: [
      { text: "\u7F51\u7AD9\u8BBE\u8BA1", link: "/others/about/aboutstyle/" },
      { text: "\u7F51\u7AD9\u5EFA\u8BBE", link: "/others/about/aboutvitepress/" },
      {
        text: "\u5176\u4ED6",
        items: [
          { text: "\u5F52\u6863", link: "/others/archive/" },
          { text: "\u6807\u7B7E", link: "/others/tags/" }
        ]
      }
    ],
    activeMatch: "/others/about/"
  }
];

// website/.vitepress/scripts/calculateLiCount.ts
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import MarkdownIt from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/markdown-it/index.mjs";
import { parse } from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/node-html-parser/dist/index.js";

// website/.vitepress/plugin/functions.ts
function processSpecialQuotes(content) {
  const lines = content.split("\n");
  let result = "";
  let inQuote = false;
  let quoteContent = [];
  for (const line of lines) {
    if (line.match(/^>\s*:\s*/)) {
      if (!inQuote) {
        inQuote = true;
        quoteContent = [];
      }
      quoteContent.push(line.replace(/^>\s*:\s*/, ""));
    } else {
      if (inQuote) {
        inQuote = false;
        const cleanedContent = quoteContent.join("\n");
        if (cleanedContent) {
          result += `<blockquote class="vp-quote-special">

${cleanedContent}

</blockquote>

`;
        }
      }
      result += line + "\n";
    }
  }
  if (inQuote) {
    const cleanedContent = quoteContent.join("\n");
    if (cleanedContent) {
      result += `<blockquote class="vp-quote-special">

${cleanedContent}

</blockquote>

`;
    }
  }
  return result;
}
function processSpecialQuotesForStats(content) {
  const lines = content.split("\n");
  let result = "";
  let inQuote = false;
  let quoteContent = [];
  for (const line of lines) {
    if (line.match(/^>\s*:\s*/)) {
      if (!inQuote) {
        inQuote = true;
        quoteContent = [];
      }
      quoteContent.push(line.replace(/^>\s*:\s*/, ""));
    } else {
      if (inQuote) {
        inQuote = false;
        if (quoteContent.length > 0) {
          result += quoteContent.join("\n") + "\n";
        }
      }
      result += line + "\n";
    }
  }
  if (inQuote && quoteContent.length > 0) {
    result += quoteContent.join("\n") + "\n";
  }
  return result;
}

// website/.vitepress/scripts/calculateLiCount.ts
var __vite_injected_original_dirname = "C:\\Users\\qind\\Desktop\\FAQ_docs\\website\\.vitepress\\scripts";
var md = new MarkdownIt();
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (!frontmatterMatch) {
    return {};
  }
  const frontmatterContent = frontmatterMatch[0].replace(/^---|---$/g, "").trim();
  const frontmatter = {};
  frontmatterContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (value === "true") {
        frontmatter[key] = true;
      } else if (value === "false") {
        frontmatter[key] = false;
      } else {
        frontmatter[key] = value.trim();
      }
    }
  });
  return frontmatter;
}
function calculateLiCount(dirPath) {
  let totalCount = 0;
  function processDirectory(path) {
    const files = readdirSync(path, { withFileTypes: true });
    for (const file of files) {
      const fullPath = join(path, file.name);
      if (file.isDirectory()) {
        processDirectory(fullPath);
      } else if (file.name.endsWith(".md")) {
        const content = readFileSync(fullPath, "utf8");
        const frontmatter = parseFrontmatter(content);
        if (frontmatter.word !== true) {
          continue;
        }
        const processedContent = processSpecialQuotesForStats(content);
        const html = md.render(processedContent);
        const root = parse(html);
        const listItems = root.querySelectorAll("ul li:not(:has(ul)):not(:has(ol))");
        totalCount += listItems.length;
      }
    }
  }
  processDirectory(dirPath);
  return totalCount;
}
function getLiCountForVocabulary() {
  const vocabPath = join(__vite_injected_original_dirname, "../../study/english/vocabulary/basic_vocabulary");
  return calculateLiCount(vocabPath);
}

// website/.vitepress/configs/sidebar.ts
var vocabLiCount = getLiCountForVocabulary();
var sidebar = {
  "/others/": [
    {
      text: "\u5173\u4E8E",
      // collapsed: false,
      items: [
        { text: "\u7F51\u7AD9\u8BBE\u8BA1", link: "/others/about/aboutstyle" },
        {
          text: "\u7F51\u7AD9\u5EFA\u8BBE",
          collapsed: false,
          items: [
            { text: "VitePress \u4ECB\u7ECD", link: "/others/about/aboutvitepress" },
            { text: "Git \u6258\u7BA1", link: "/others/about/Git" },
            { text: "SSH \u4F20\u8F93", link: "/others/about/SSH" }
          ]
        }
      ]
    },
    {
      text: "\u5176\u4ED6",
      items: [
        { text: "\u5F52\u6863", link: "/others/archive" },
        { text: "\u6807\u7B7E", link: "/others/tags" }
      ]
    }
  ],
  "/essays/": [
    {
      text: "\u968F\u7B14",
      items: [
        {
          text: "\u8BD7",
          items: [
            { text: "\u65E0\u82B1", link: "/essays/poetry/\u65E0\u82B1" },
            { text: "\u7A7A\u54CD", link: "/essays/poetry/\u7A7A\u54CD" }
          ]
        },
        {
          text: "\u8BCD",
          items: [
            { text: "\u8BC9\u8877\u60C5\xB7\u773C\u6B32\u7A7F", link: "/essays/ci/\u8BC9\u8877\u60C5\xB7\u773C\u6B32\u7A7F" }
          ]
        }
      ]
    }
  ],
  "/study/": [
    {
      text: "\u5B66\u4E60",
      items: [
        {
          text: "\u82F1\u8BED",
          items: [
            { text: "\u5199\u4F5C", link: "/study/english/writing/ChangeYourLife" },
            {
              text: "\u8BCD\u6C47",
              items: [
                {
                  text: `\u57FA\u7840\u8BCD\u6C47\uFF08${vocabLiCount}\uFF09`,
                  collapsed: false,
                  items: [
                    { text: "\u524D\u7F00", link: "/study/english/vocabulary/basic_vocabulary/prefix" },
                    { text: "\u8BCD\u6839 A", link: "/study/english/vocabulary/basic_vocabulary/A" },
                    { text: "\u8BCD\u6839 B", link: "/study/english/vocabulary/basic_vocabulary/B" },
                    { text: "\u8BCD\u6839 C", link: "/study/english/vocabulary/basic_vocabulary/C" },
                    { text: "\u8BCD\u6839 D", link: "/study/english/vocabulary/basic_vocabulary/D" },
                    { text: "\u8BCD\u6839 E", link: "/study/english/vocabulary/basic_vocabulary/E" },
                    { text: "\u8BCD\u6839 F", link: "/study/english/vocabulary/basic_vocabulary/F" },
                    { text: "\u8BCD\u6839 G", link: "/study/english/vocabulary/basic_vocabulary/G" },
                    { text: "\u8BCD\u6839 H", link: "/study/english/vocabulary/basic_vocabulary/H" },
                    { text: "\u8BCD\u6839 I", link: "/study/english/vocabulary/basic_vocabulary/I" },
                    { text: "\u8BCD\u6839 J", link: "/study/english/vocabulary/basic_vocabulary/J" },
                    { text: "\u8BCD\u6839 L", link: "/study/english/vocabulary/basic_vocabulary/L" }
                  ]
                },
                { text: "Oxford 3000", link: "/study/english/vocabulary/oxford_3000" }
              ]
            },
            {
              text: "\u957F\u96BE\u53E5",
              collapsed: false,
              items: [
                { text: "2026.02.03", link: "/study/english/sentence/2-3" },
                { text: "2026.02.04", link: "/study/english/sentence/2-4" },
                { text: "2026.02.05", link: "/study/english/sentence/2-5" },
                { text: "2026.02.06", link: "/study/english/sentence/2-6" },
                { text: "2026.02.07", link: "/study/english/sentence/2-7" },
                { text: "2026.02.08", link: "/study/english/sentence/2-8" },
                { text: "2026.02.09", link: "/study/english/sentence/2-9" },
                { text: "2026.02.10", link: "/study/english/sentence/2-10" },
                { text: "2026.02.11", link: "/study/english/sentence/2-11" },
                { text: "2026.02.12", link: "/study/english/sentence/2-12" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// website/.vitepress/configs/head.ts
var head = [
  // 配置网页图标
  ["link", { rel: "icon", type: "image/x-icon", href: "/img/qind_ico.svg" }],
  // 引入Font Awesome图标库
  ["link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css", integrity: "sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==", crossorigin: "anonymous" }],
  // 引入外部脚本文件
  ["script", { src: "/js/early-init.js" }],
  ["script", { src: "/js/image-protection.js" }],
  ["meta", { name: "description", content: "\u8FD9\u662F\u7434\u6BBF\u7684\u4E2A\u4EBA\u7B14\u8BB0\u7F51\u7AD9" }],
  ["meta", { name: "keywords", content: "\u7434\u6BBF, qindlute, qind, \u535A\u5BA2, Vitepress, \u5B66\u4E60\u7B14\u8BB0, \u4E2A\u4EBA\u7F51\u7AD9" }],
  ["meta", { name: "author", content: "qindlute" }]
];

// website/.vitepress/configs/customIcons.ts
var customIcon = {
  // export const customIcon = {
  mts: "vscode-icons:file-type-typescript",
  cts: "vscode-icons:file-type-typescript",
  ts: "vscode-icons:file-type-typescript",
  tsx: "vscode-icons:file-type-typescript",
  mjs: "vscode-icons:file-type-js",
  cjs: "vscode-icons:file-type-js",
  json: "vscode-icons:file-type-json",
  js: "vscode-icons:file-type-js",
  jsx: "vscode-icons:file-type-js",
  md: "vscode-icons:file-type-markdown",
  py: "vscode-icons:file-type-python",
  ico: "vscode-icons:file-type-favicon",
  html: "vscode-icons:file-type-html",
  css: "vscode-icons:file-type-css",
  scss: "vscode-icons:file-type-scss",
  yml: "vscode-icons:file-type-light-yaml",
  yaml: "vscode-icons:file-type-light-yaml",
  php: "vscode-icons:file-type-php"
};

// website/.vitepress/plugin/markdownTransform.ts
import MarkdownIt2 from "file:///C:/Users/qind/Desktop/FAQ_docs/node_modules/markdown-it/index.mjs";
var md2 = new MarkdownIt2();
function MarkdownTransform() {
  return {
    name: "md-link-transform",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".md")) return null;
      if (id.includes("node_modules") || id.includes(".vitepress/config"))
        return null;
      code = code.replace(/!\[(.*?)\]\((.*?)\)/g, (match, text, src) => {
        return src.startsWith("http") ? `<img src="${src}" alt="${text || "image"}" />` : match;
      });
      code = code.replace(
        /\[(.*?)\]\((https?:\/\/[^\s)]+)(?:\s+"(.*?)")?\)/g,
        (match, text, href, title) => {
          return title === void 0 ? `<CustomLink title="${text}" href="${href}" />` : match;
        }
      );
      code = processSpecialQuotes(code);
      const lines = code.split("\n");
      let inCodeBlock = false;
      let resultLines = [];
      for (const line of lines) {
        if (line.startsWith("```")) {
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
          const renderedAfter = md2.renderInline(after);
          resultLines.push(`${before}<interval>${renderedAfter}</interval>`);
        } else {
          resultLines.push(line);
        }
      }
      code = resultLines.join("\n");
      const posMap = {
        "n.": "rgba(251, 146, 60)",
        // 橙色
        "v.": "rgba(239, 68, 68)",
        // 红色
        "adj.": "rgba(59, 130, 246)",
        // 蓝色
        "ad.": "rgba(168, 85, 247)",
        // 紫色
        "prep.": "rgba(152, 251, 152)",
        // 薄荷绿
        "conj.": "rgba(0, 255, 255)"
        // 青色
      };
      code = code.replace(/\b(n\.|v\.|adj\.|ad\.|prep\.|conj\.|pref\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
        if (match === "pref.") {
          return `&nbsp;<span class="text-gradient">${match}</span>`;
        }
        const color = posMap[match];
        return `&nbsp;<span style="color: ${color};">${match}</span>`;
      });
      return code;
    }
  };
}

// website/.vitepress/config.mts
var __vite_injected_original_dirname2 = "C:\\Users\\qind\\Desktop\\FAQ_docs\\website\\.vitepress";
var config_default = defineConfig({
  title: "\u7434\u6BBF",
  description: "\u4E2A\u4EBA\u7B14\u8BB0\u7F51\u7AD9",
  lang: "zh-CN",
  appearance: false,
  // 添加外部脚本，提前应用自定义样式配置
  head,
  sitemap: {
    hostname: "https://docs.qindlute.cloud"
  },
  // 使用VitePress内置的主题配置
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/img/qind_ico.svg",
    // 覆盖页面标题
    siteTitle: "\u7434\u6BBF",
    nav,
    sidebar,
    // 大纲配置
    outline: {
      level: "deep",
      label: "\u76EE\u5F55"
    },
    returnToTopLabel: "\u56DE\u5230\u9876\u90E8",
    socialLinks: [
      { icon: "github", link: "https://github.com/QINDlute/QINDlute.github.io/tree/master" },
      { icon: "gmail", link: "mailto:qindlute@gmail.com" }
    ],
    // 页脚配置
    footer: {
      message: "qindlute's notes",
      copyright: "Copyright \xA9 2025-2026 qindlute"
    },
    docFooter: {
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875"
    },
    // lastUpdated: {
    //   text: '最后更新于'
    // },
    // 启用本地搜索功能
    search: {
      provider: "local",
      // 搜索选项配置
      options: {
        translations: {
          button: {
            buttonText: "\u641C\u7D22",
            buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
          },
          modal: {
            noResultsText: "\u672A\u627E\u5230\u5339\u914D\u7ED3\u679C",
            resetButtonTitle: "\u6E05\u7A7A\u641C\u7D22",
            displayDetails: "\u663E\u793A\u8BE6\u7EC6\u4FE1\u606F",
            footer: {
              navigateText: "\u5BFC\u822A",
              selectText: "\u9009\u62E9",
              closeText: "\u9000\u51FA"
            }
          }
        },
        miniSearch: {
          searchOptions: {
            boost: {
              // 标题权重为8，文本权重为4（优先匹配标题）
              title: 8,
              text: 4
            }
          }
        }
      }
    }
  },
  vite: {
    plugins: [
      // tailwindcss(), // 添加 Tailwind CSS 插件
      UnoCSS({
        presets: [
          presetUno(),
          presetIcons({
            scale: 1.2,
            warn: true
          }),
          presetAttributify()
        ]
      }),
      // 添加 UnoCSS 插件
      Components({
        dirs: resolve(__vite_injected_original_dirname2, "./theme/components"),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: ""
          })
        ],
        dts: "./.vitepress/components.d.ts",
        transformer: "vue3"
      }),
      // 添加 Components 插件，用于自动注册图标组件
      groupIconVitePlugin({
        customIcon
      }),
      // 使用导入的图标配置
      Icons({
        compiler: "vue3",
        autoInstall: true,
        defaultStyle: "display: inline-block"
      }),
      MarkdownTransform()
    ],
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname2, ".."),
        // 项目根目录
        "@components": resolve(__vite_injected_original_dirname2, "components"),
        // 组件目录
        "@composables": resolve(__vite_injected_original_dirname2, "composables")
        // 可组合函数目录
      }
    },
    ssr: {
      noExternal: ["pdfjs-dist", "@vue-pdf-viewer/viewer"]
    }
  },
  markdown: {
    math: true,
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    config: (md3) => {
      md3.use(groupIconMdPlugin);
      md3.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      };
      md3.use(markdownItContainer, "note", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(5).trim();
          return token.nesting === 1 ? `<div class="custom-block note"><div class="custom-block-title">${info || "NOTE"}</div>` : "</div>";
        }
      });
      md3.use(markdownItContainer, "important", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(10).trim();
          return token.nesting === 1 ? `<div class="custom-block important"><div class="custom-block-title">${info || "IMPORTANT"}</div>` : "</div>";
        }
      });
      md3.use(markdownItContainer, "caution", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(8).trim();
          return token.nesting === 1 ? `<div class="custom-block caution"><div class="custom-block-title">${info || "CAUTION"}</div>` : "</div>";
        }
      });
      md3.use(markdownItContainer, "whiteboard", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          if (token.nesting === 1) {
            const title = token.info.trim().replace(/^whiteboard\s*/, "");
            const titleHtml = title ? `<h3 class="whiteboard-title">${title}</h3>` : "";
            return `<div class="whiteboard"><div class="whiteboard-content">${titleHtml}`;
          }
          return "</div></div>";
        }
      });
      md3.use(markdownItContainer, "faq", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          if (token.nesting === 1) {
            const info = token.info.trim();
            const isActive = info.includes("active");
            const title = info.replace(/^faq\s*(active)?\s*/, "").trim() || "\u5E38\u89C1\u95EE\u9898";
            const activeClass = isActive ? "active" : "";
            return `
              <div class="faq ${activeClass}">
                <h3 class="faq-title">${title}</h3>
                <div class="faq-text">`;
          }
          return `
              </div>
              <button class="faq-toggle">
                <i class="fas fa-chevron-down"></i>
                <i class="fas fa-times"></i>
              </button>
            </div>`;
        }
      });
      md3.use(markdownItContainer, "details:", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          if (token.nesting === 1) {
            const title = token.info.trim().replace(/^details:\s*/, "").trim() || "\u70B9\u51FB\u5C55\u5F00";
            return `<SmoothDetails><template #title>${title}</template>`;
          }
          return `</SmoothDetails>`;
        }
      });
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3MvbmF2LnRzIiwgIndlYnNpdGUvLnZpdGVwcmVzcy9zY3JpcHRzL2NhbGN1bGF0ZUxpQ291bnQudHMiLCAid2Vic2l0ZS8udml0ZXByZXNzL3BsdWdpbi9mdW5jdGlvbnMudHMiLCAid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3Mvc2lkZWJhci50cyIsICJ3ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlncy9oZWFkLnRzIiwgIndlYnNpdGUvLnZpdGVwcmVzcy9jb25maWdzL2N1c3RvbUljb25zLnRzIiwgIndlYnNpdGUvLnZpdGVwcmVzcy9wbHVnaW4vbWFya2Rvd25UcmFuc2Zvcm0udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3FpbmQvRGVza3RvcC9GQVFfZG9jcy93ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlnLm10c1wiOy8vIC52aXRlcHJlc3MvY29uZmlnLm10c1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnXHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5cclxuLy8gXHU1RjE1XHU3NTI4XHU1MjREXHU1MTQ4XHU1Qjg5XHU4OEM1XHVGRjBDd2luZG93c1x1NEVFM1x1NzgwMVx1RkYxQW5wbSBpbnN0YWxsIC1EIG1hcmtkb3duLWl0LWNvbnRhaW5lclxyXG5pbXBvcnQgbWFya2Rvd25JdENvbnRhaW5lciBmcm9tICdtYXJrZG93bi1pdC1jb250YWluZXInXHJcblxyXG5pbXBvcnQgeyBncm91cEljb25NZFBsdWdpbiwgZ3JvdXBJY29uVml0ZVBsdWdpbiwgbG9jYWxJY29uTG9hZGVyIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1ncm91cC1pY29ucydcclxuLy8gaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCB7IHByZXNldFVubywgcHJlc2V0SWNvbnMsIHByZXNldEF0dHJpYnV0aWZ5IH0gZnJvbSAndW5vY3NzJ1xyXG5cclxuaW1wb3J0IHsgbmF2LCBzaWRlYmFyLCBoZWFkLCBjdXN0b21JY29uIH0gZnJvbSAnLi9jb25maWdzJ1xyXG5pbXBvcnQgeyBNYXJrZG93blRyYW5zZm9ybSB9IGZyb20gJy4vcGx1Z2luL21hcmtkb3duVHJhbnNmb3JtJ1xyXG5cclxuXHJcblxyXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgdGl0bGU6IFwiXHU3NDM0XHU2QkJGXCIsXHJcbiAgZGVzY3JpcHRpb246IFwiXHU0RTJBXHU0RUJBXHU3QjE0XHU4QkIwXHU3RjUxXHU3QUQ5XCIsXHJcbiAgbGFuZzogXCJ6aC1DTlwiLFxyXG5cclxuICBhcHBlYXJhbmNlOiBmYWxzZSxcclxuXHJcbiAgLy8gXHU2REZCXHU1MkEwXHU1OTE2XHU5MEU4XHU4MTFBXHU2NzJDXHVGRjBDXHU2M0QwXHU1MjREXHU1RTk0XHU3NTI4XHU4MUVBXHU1QjlBXHU0RTQ5XHU2ODM3XHU1RjBGXHU5MTREXHU3RjZFXHJcbiAgaGVhZCxcclxuXHJcbiAgc2l0ZW1hcDoge1xyXG4gICAgaG9zdG5hbWU6ICdodHRwczovL2RvY3MucWluZGx1dGUuY2xvdWQnLFxyXG4gIH0sXHJcblxyXG4gIC8vIFx1NEY3Rlx1NzUyOFZpdGVQcmVzc1x1NTE4NVx1N0Y2RVx1NzY4NFx1NEUzQlx1OTg5OFx1OTE0RFx1N0Y2RVxyXG4gIHRoZW1lQ29uZmlnOiB7XHJcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXHJcbiAgICBsb2dvOiAnL2ltZy9xaW5kX2ljby5zdmcnLFxyXG5cclxuICAgIC8vIFx1ODk4Nlx1NzZENlx1OTg3NVx1OTc2Mlx1NjgwN1x1OTg5OFxyXG4gICAgc2l0ZVRpdGxlOiAnXHU3NDM0XHU2QkJGJyxcclxuXHJcbiAgICBuYXYsXHJcblxyXG4gICAgc2lkZWJhcixcclxuXHJcbiAgICAvLyBcdTU5MjdcdTdFQjJcdTkxNERcdTdGNkVcclxuICAgIG91dGxpbmU6IHtcclxuICAgICAgbGV2ZWw6ICdkZWVwJyxcclxuICAgICAgbGFiZWw6ICdcdTc2RUVcdTVGNTUnXHJcbiAgICB9LFxyXG4gICAgcmV0dXJuVG9Ub3BMYWJlbDogJ1x1NTZERVx1NTIzMFx1OTg3Nlx1OTBFOCcsXHJcbiAgICBcclxuICAgIHNvY2lhbExpbmtzOiBbXHJcbiAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vUUlORGx1dGUvUUlORGx1dGUuZ2l0aHViLmlvL3RyZWUvbWFzdGVyJyB9LFxyXG4gICAgICB7IGljb246ICdnbWFpbCcsIGxpbms6ICdtYWlsdG86cWluZGx1dGVAZ21haWwuY29tJyB9XHJcbiAgICBdLFxyXG5cclxuICAgIC8vIFx1OTg3NVx1ODExQVx1OTE0RFx1N0Y2RVxyXG4gICAgZm9vdGVyOiB7XHJcbiAgICAgIG1lc3NhZ2U6ICdxaW5kbHV0ZVxcJ3Mgbm90ZXMnLFxyXG4gICAgICBjb3B5cmlnaHQ6ICdDb3B5cmlnaHQgXHUwMEE5IDIwMjUtMjAyNiBxaW5kbHV0ZSdcclxuICAgIH0sXHJcbiAgICBkb2NGb290ZXI6IHtcclxuICAgICAgcHJldjogJ1x1NEUwQVx1NEUwMFx1OTg3NScsXHJcbiAgICAgIG5leHQ6ICdcdTRFMEJcdTRFMDBcdTk4NzUnXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBsYXN0VXBkYXRlZDoge1xyXG4gICAgLy8gICB0ZXh0OiAnXHU2NzAwXHU1NDBFXHU2NkY0XHU2NUIwXHU0RThFJ1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICAvLyBcdTU0MkZcdTc1MjhcdTY3MkNcdTU3MzBcdTY0MUNcdTdEMjJcdTUyOUZcdTgwRkRcclxuICAgIHNlYXJjaDoge1xyXG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcclxuICAgICAgLy8gXHU2NDFDXHU3RDIyXHU5MDA5XHU5ODc5XHU5MTREXHU3RjZFXHJcbiAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICB0cmFuc2xhdGlvbnM6IHtcclxuICAgICAgICAgIGJ1dHRvbjoge1xyXG4gICAgICAgICAgICBidXR0b25UZXh0OiAnXHU2NDFDXHU3RDIyJyxcclxuICAgICAgICAgICAgYnV0dG9uQXJpYUxhYmVsOiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vZGFsOiB7XHJcbiAgICAgICAgICAgIG5vUmVzdWx0c1RleHQ6ICdcdTY3MkFcdTYyN0VcdTUyMzBcdTUzMzlcdTkxNERcdTdFRDNcdTY3OUMnLFxyXG4gICAgICAgICAgICByZXNldEJ1dHRvblRpdGxlOiAnXHU2RTA1XHU3QTdBXHU2NDFDXHU3RDIyJyxcclxuICAgICAgICAgICAgZGlzcGxheURldGFpbHM6ICdcdTY2M0VcdTc5M0FcdThCRTZcdTdFQzZcdTRGRTFcdTYwNkYnLFxyXG4gICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICBuYXZpZ2F0ZVRleHQ6ICdcdTVCRkNcdTgyMkEnLFxyXG4gICAgICAgICAgICAgIHNlbGVjdFRleHQ6ICdcdTkwMDlcdTYyRTknLFxyXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ1x1OTAwMFx1NTFGQSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWluaVNlYXJjaDoge1xyXG4gICAgICAgICAgc2VhcmNoT3B0aW9uczoge1xyXG4gICAgICAgICAgICBib29zdDogeyAvLyBcdTY4MDdcdTk4OThcdTY3NDNcdTkxQ0RcdTRFM0E4XHVGRjBDXHU2NTg3XHU2NzJDXHU2NzQzXHU5MUNEXHU0RTNBNFx1RkYwOFx1NEYxOFx1NTE0OFx1NTMzOVx1OTE0RFx1NjgwN1x1OTg5OFx1RkYwOVxyXG4gICAgICAgICAgICAgIHRpdGxlOiA4LFxyXG4gICAgICAgICAgICAgIHRleHQ6IDRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICB2aXRlOiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIC8vIHRhaWx3aW5kY3NzKCksIC8vIFx1NkRGQlx1NTJBMCBUYWlsd2luZCBDU1MgXHU2M0QyXHU0RUY2XHJcbiAgICAgIFVub0NTUyh7XHJcbiAgICAgICAgcHJlc2V0czogW1xyXG4gICAgICAgICAgcHJlc2V0VW5vKCksXHJcbiAgICAgICAgICBwcmVzZXRJY29ucyh7XHJcbiAgICAgICAgICAgIHNjYWxlOiAxLjIsXHJcbiAgICAgICAgICAgIHdhcm46IHRydWUsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHByZXNldEF0dHJpYnV0aWZ5KCksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksIC8vIFx1NkRGQlx1NTJBMCBVbm9DU1MgXHU2M0QyXHU0RUY2XHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGRpcnM6IHJlc29sdmUoX19kaXJuYW1lLCAnLi90aGVtZS9jb21wb25lbnRzJyksXHJcbiAgICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBjb21wb25lbnRQcmVmaXg6ICcnLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgICBkdHM6ICcuLy52aXRlcHJlc3MvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgICB0cmFuc2Zvcm1lcjogJ3Z1ZTMnLFxyXG4gICAgICB9KSwgLy8gXHU2REZCXHU1MkEwIENvbXBvbmVudHMgXHU2M0QyXHU0RUY2XHVGRjBDXHU3NTI4XHU0RThFXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgIGdyb3VwSWNvblZpdGVQbHVnaW4oe1xyXG4gICAgICAgIGN1c3RvbUljb25cclxuICAgICAgfSksIC8vIFx1NEY3Rlx1NzUyOFx1NUJGQ1x1NTE2NVx1NzY4NFx1NTZGRVx1NjgwN1x1OTE0RFx1N0Y2RVxyXG4gICAgICBJY29ucyh7XHJcbiAgICAgICAgY29tcGlsZXI6ICd2dWUzJyxcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgICBkZWZhdWx0U3R5bGU6ICdkaXNwbGF5OiBpbmxpbmUtYmxvY2snLFxyXG4gICAgICB9KSxcclxuICAgICAgTWFya2Rvd25UcmFuc2Zvcm0oKSxcclxuXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicpLCAvLyBcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcclxuICAgICAgICAnQGNvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ2NvbXBvbmVudHMnKSwgLy8gXHU3RUM0XHU0RUY2XHU3NkVFXHU1RjU1XHJcbiAgICAgICAgJ0Bjb21wb3NhYmxlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnY29tcG9zYWJsZXMnKSAvLyBcdTUzRUZcdTdFQzRcdTU0MDhcdTUxRkRcdTY1NzBcdTc2RUVcdTVGNTVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNzcjoge1xyXG4gICAgICBub0V4dGVybmFsOiBbJ3BkZmpzLWRpc3QnLCAnQHZ1ZS1wZGYtdmlld2VyL3ZpZXdlciddXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWFya2Rvd246IHtcclxuICAgIG1hdGg6IHRydWUsXHJcbiAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgIGltYWdlOiB7XHJcbiAgICAgIGxhenlMb2FkaW5nOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgY29uZmlnOiAobWQpID0+IHtcclxuICAgICAgbWQudXNlKGdyb3VwSWNvbk1kUGx1Z2luKSAvLyBcdTRFRTNcdTc4MDFcdTdFQzRcdTU2RkVcdTY4MDdcclxuXHJcbiAgICAgIC8vIGgxIFx1NjgwN1x1OTg5OFx1ODFFQVx1NTJBOFx1NkRGQlx1NTJBMCBBcnRpY2xlTWV0YWRhdGEgXHU3RUM0XHU0RUY2XHJcbiAgICAgIG1kLnJlbmRlcmVyLnJ1bGVzLmhlYWRpbmdfY2xvc2UgPSAodG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiwgc2xmKSA9PiB7XHJcbiAgICAgICAgICBsZXQgaHRtbFJlc3VsdCA9IHNsZi5yZW5kZXJUb2tlbih0b2tlbnMsIGlkeCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICBpZiAodG9rZW5zW2lkeF0udGFnID09PSAnaDEnKSBodG1sUmVzdWx0ICs9IGA8QXJ0aWNsZU1ldGFkYXRhIC8+YDsgXHJcbiAgICAgICAgICByZXR1cm4gaHRtbFJlc3VsdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU2Q0U4XHU1MThDXHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHJcbiAgICAgIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAnbm90ZScsIHtcclxuICAgICAgICByZW5kZXI6ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxyXG4gICAgICAgICAgY29uc3QgaW5mbyA9IHRva2VuLmluZm8udHJpbSgpLnNsaWNlKDUpLnRyaW0oKVxyXG4gICAgICAgICAgcmV0dXJuIHRva2VuLm5lc3RpbmcgPT09IDFcclxuICAgICAgICAgICAgPyBgPGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jayBub3RlXCI+PGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jay10aXRsZVwiPiR7aW5mbyB8fCAnTk9URSd9PC9kaXY+YFxyXG4gICAgICAgICAgICA6ICc8L2Rpdj4nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgbWQudXNlKG1hcmtkb3duSXRDb250YWluZXIsICdpbXBvcnRhbnQnLCB7XHJcbiAgICAgICAgcmVuZGVyOiAodG9rZW5zLCBpZHgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cclxuICAgICAgICAgIGNvbnN0IGluZm8gPSB0b2tlbi5pbmZvLnRyaW0oKS5zbGljZSgxMCkudHJpbSgpXHJcbiAgICAgICAgICByZXR1cm4gdG9rZW4ubmVzdGluZyA9PT0gMVxyXG4gICAgICAgICAgICA/IGA8ZGl2IGNsYXNzPVwiY3VzdG9tLWJsb2NrIGltcG9ydGFudFwiPjxkaXYgY2xhc3M9XCJjdXN0b20tYmxvY2stdGl0bGVcIj4ke2luZm8gfHwgJ0lNUE9SVEFOVCd9PC9kaXY+YFxyXG4gICAgICAgICAgICA6ICc8L2Rpdj4nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgbWQudXNlKG1hcmtkb3duSXRDb250YWluZXIsICdjYXV0aW9uJywge1xyXG4gICAgICAgIHJlbmRlcjogKHRva2VucywgaWR4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXHJcbiAgICAgICAgICBjb25zdCBpbmZvID0gdG9rZW4uaW5mby50cmltKCkuc2xpY2UoOCkudHJpbSgpXHJcbiAgICAgICAgICByZXR1cm4gdG9rZW4ubmVzdGluZyA9PT0gMVxyXG4gICAgICAgICAgICA/IGA8ZGl2IGNsYXNzPVwiY3VzdG9tLWJsb2NrIGNhdXRpb25cIj48ZGl2IGNsYXNzPVwiY3VzdG9tLWJsb2NrLXRpdGxlXCI+JHtpbmZvIHx8ICdDQVVUSU9OJ308L2Rpdj5gXHJcbiAgICAgICAgICAgIDogJzwvZGl2PidcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC8vIDo6OiB3aGl0ZWJvYXJkIFx1ODFFQVx1NUI5QVx1NEU0OVx1NUJCOVx1NTY2OFxyXG4gICAgICBtZC51c2UobWFya2Rvd25JdENvbnRhaW5lciwgJ3doaXRlYm9hcmQnLCB7XHJcbiAgICAgICAgcmVuZGVyOiAodG9rZW5zLCBpZHgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cclxuICAgICAgICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAxKSB7XHJcbiAgICAgICAgICAgIC8vIFx1NjUyRlx1NjMwMVx1ODFFQVx1NUI5QVx1NEU0OVx1NjgwN1x1OTg5OFx1RkYwOFx1NjVFMFx1NjgwN1x1OTg5OFx1NTIxOVx1NEUwRFx1NjYzRVx1NzkzQVx1RkYwOVxyXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRva2VuLmluZm8udHJpbSgpLnJlcGxhY2UoL153aGl0ZWJvYXJkXFxzKi8sICcnKSAvLyBcdTUzMzlcdTkxNERcdTZCNjNcdTUyMTlcdTg4NjhcdThGQkVcdTVGMEZcdUZGMENcdTVDMDZcIjo6OiB3aGl0ZWJvYXJkIFtcdTY4MDdcdTk4OThdXCIgXHU2NkZGXHU2MzYyXHU0RTNBW1x1NjgwN1x1OTg5OF1cclxuICAgICAgICAgICAgY29uc3QgdGl0bGVIdG1sID0gdGl0bGUgPyBgPGgzIGNsYXNzPVwid2hpdGVib2FyZC10aXRsZVwiPiR7dGl0bGV9PC9oMz5gIDogJydcclxuICAgICAgICAgICAgLy8gXHU2RTMyXHU2N0QzIENTUyBcdTVCRjlcdTVFOTRcdTc2ODQgSFRNTCBcdTdFRDNcdTY3ODRcdUZGMUF3aGl0ZWJvYXJkIFx1NUJCOVx1NTY2OCArIHdoaXRlYm9hcmQtY29udGVudCBcdTUxODVcdTVCQjlcdTVCQjlcdTU2NjhcclxuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwid2hpdGVib2FyZFwiPjxkaXYgY2xhc3M9XCJ3aGl0ZWJvYXJkLWNvbnRlbnRcIj4ke3RpdGxlSHRtbH1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBcdTk1RURcdTU0MDhcdTVCQjlcdTU2NjhcclxuICAgICAgICAgIHJldHVybiAnPC9kaXY+PC9kaXY+J1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIFx1NkNFOFx1NTE4QyBGQVEgXHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHJcbiAgICAgIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAnZmFxJywge1xyXG4gICAgICAgIHJlbmRlcjogKHRva2VucywgaWR4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXHJcbiAgICAgICAgICAvLyBcdTUzMzlcdTkxNERcdTVCQjlcdTU2NjhcdTVGMDBcdTU5Q0JcdTY4MDdcdThCQjBcdUZGMDg6OjogZmFxIFx1NjgwN1x1OTg5OFx1RkYwOVxyXG4gICAgICAgICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpIHtcclxuICAgICAgICAgICAgLy8gMS4gXHU2M0QwXHU1M0Q2XHU4MUVBXHU1QjlBXHU0RTQ5XHU2ODA3XHU5ODk4XHVGRjA4XHU2NTJGXHU2MzAxIFwiOjo6IGZhcSBcdTY4MDdcdTk4OThcIiBcdTYyMTYgXCI6OjogZmFxIGFjdGl2ZSBcdTY4MDdcdTk4OThcIiBcdThCRURcdTZDRDVcdUZGMENhY3RpdmVcdTg4NjhcdTc5M0FcdTUyMURcdTU5Q0JcdTVDNTVcdTVGMDBcdUZGMDlcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRva2VuLmluZm8udHJpbSgpXHJcbiAgICAgICAgICAgIC8vIFx1NTIwNlx1NzlCQiBcImFjdGl2ZVwiIFx1NjgwN1x1OEJCMFx1NTQ4Q1x1NjgwN1x1OTg5OFx1RkYwOFx1NTNFRlx1OTAwOVx1RkYxQVx1NjUyRlx1NjMwMVx1NTIxRFx1NTlDQlx1NUM1NVx1NUYwMFx1RkYwOVxyXG4gICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZm8uaW5jbHVkZXMoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gaW5mby5yZXBsYWNlKC9eZmFxXFxzKihhY3RpdmUpP1xccyovLCAnJykudHJpbSgpIHx8ICdcdTVFMzhcdTg5QzFcdTk1RUVcdTk4OTgnIC8vIFx1NjVFMFx1NjgwN1x1OTg5OFx1NjVGNlx1OUVEOFx1OEJBNFx1NjYzRVx1NzkzQVwiXHU1RTM4XHU4OUMxXHU5NUVFXHU5ODk4XCIgXHJcbiAgICAgICAgICAgIC8vIDIuIFx1NjJGQ1x1NjNBNSBGQVEgXHU5NzYyXHU2NzdGXHU3Njg0XHU1RjAwXHU1OUNCIEhUTUxcdUZGMDhcdTU0OENcdTUzOUZcdTY3MDlcdTdFRDNcdTY3ODRcdTVCOENcdTUxNjhcdTRFMDBcdTgxRjRcdUZGMDlcclxuICAgICAgICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1QzU1XHU1RjAwXHU1MjE5XHU2REZCXHU1MkEwIGFjdGl2ZSBcdTdDN0JcdUZGMENcdTU0MjZcdTUyMTlcdTRFMERcdTZERkJcdTUyQTBcclxuICAgICAgICAgICAgY29uc3QgYWN0aXZlQ2xhc3MgPSBpc0FjdGl2ZSA/ICdhY3RpdmUnIDogJydcclxuICAgICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmFxICR7YWN0aXZlQ2xhc3N9XCI+XHJcbiAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJmYXEtdGl0bGVcIj4ke3RpdGxlfTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmFxLXRleHRcIj5gIC8vIFx1NkNFOFx1NjEwRlx1RkYxQWZhcS10ZXh0IFx1NTMwNVx1ODhGOVx1NUJCOVx1NTY2OFx1NTE4NVx1NzY4NFx1NTE4NVx1NUJCOVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gMy4gXHU1MzM5XHU5MTREXHU1QkI5XHU1NjY4XHU3RUQzXHU2NzVGXHU2ODA3XHU4QkIwXHVGRjA4Ojo6XHVGRjA5XHVGRjBDXHU5NUVEXHU1NDA4IEhUTUwgXHU3RUQzXHU2Nzg0XHJcbiAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJmYXEtdG9nZ2xlXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGV2cm9uLWRvd25cIj48L2k+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIFx1NkNFOFx1NTE4QyBkZXRhaWxzOiBcdTgxRUFcdTVCOUFcdTRFNDlcdTVCQjlcdTU2NjhcdUZGMENcdTZFMzJcdTY3RDNcdTRFM0EgU21vb3RoRGV0YWlscyBcdTdFQzRcdTRFRjZcclxuICAgICAgbWQudXNlKG1hcmtkb3duSXRDb250YWluZXIsICdkZXRhaWxzOicsIHtcclxuICAgICAgICByZW5kZXI6ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxyXG4gICAgICAgICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpIHtcclxuICAgICAgICAgICAgLy8gXHU2M0QwXHU1M0Q2XHU2ODA3XHU5ODk4XHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdG9rZW4uaW5mby50cmltKCkucmVwbGFjZSgvXmRldGFpbHM6XFxzKi8sICcnKS50cmltKCkgfHwgJ1x1NzBCOVx1NTFGQlx1NUM1NVx1NUYwMCdcclxuICAgICAgICAgICAgcmV0dXJuIGA8U21vb3RoRGV0YWlscz48dGVtcGxhdGUgI3RpdGxlPiR7dGl0bGV9PC90ZW1wbGF0ZT5gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYDwvU21vb3RoRGV0YWlscz5gXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXFxcXG5hdi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcWluZC9EZXNrdG9wL0ZBUV9kb2NzL3dlYnNpdGUvLnZpdGVwcmVzcy9jb25maWdzL25hdi50c1wiO2ltcG9ydCB0eXBlIHsgRGVmYXVsdFRoZW1lIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5hdjogRGVmYXVsdFRoZW1lLkNvbmZpZ1tcIm5hdlwiXSA9IFtcclxuICAgICAgeyB0ZXh0OiAnXHU5OTk2XHU5ODc1JywgbGluazogJy8nIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NUI2Nlx1NEU2MCcsIFxyXG4gICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTgyRjFcdThCRUQnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MTk5XHU0RjVDJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3dyaXRpbmcvQ2hhbmdlWW91ckxpZmUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NkM0NycsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvQScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU5NTdGXHU5NkJFXHU1M0U1JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItMyd9LCAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NTcwXHU1QjY2JywgbGluazogJyMnIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OTY4Rlx1N0IxNCcsXHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJEN1x1OEJDRCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjVFMFx1ODJCMScsIGxpbms6ICcvZXNzYXlzL3BvZXRyeS9cdTY1RTBcdTgyQjEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0E3QVx1NTRDRCcsIGxpbms6ICcvZXNzYXlzL3BvZXRyeS9cdTdBN0FcdTU0Q0QnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDOVx1ODg3N1x1NjBDNScsIGxpbms6ICcvZXNzYXlzL2NpL1x1OEJDOVx1ODg3N1x1NjBDNVx1MDBCN1x1NzczQ1x1NkIzMlx1N0E3RicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1MTczXHU0RThFJyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3RjUxXHU3QUQ5XHU4QkJFXHU4QkExJywgbGluazogJy9vdGhlcnMvYWJvdXQvYWJvdXRzdHlsZS8nIH0sXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0Y1MVx1N0FEOVx1NUVGQVx1OEJCRScsIGxpbms6ICcvb3RoZXJzL2Fib3V0L2Fib3V0dml0ZXByZXNzLycgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MTc2XHU0RUQ2JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NUY1Mlx1Njg2MycsIGxpbms6ICcvb3RoZXJzL2FyY2hpdmUvJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY4MDdcdTdCN0UnLCBsaW5rOiAnL290aGVycy90YWdzLycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGFjdGl2ZU1hdGNoOiAnL290aGVycy9hYm91dC8nXHJcbiAgICAgIH0sXHJcbl07IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXHNjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcc2NyaXB0c1xcXFxjYWxjdWxhdGVMaUNvdW50LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9xaW5kL0Rlc2t0b3AvRkFRX2RvY3Mvd2Vic2l0ZS8udml0ZXByZXNzL3NjcmlwdHMvY2FsY3VsYXRlTGlDb3VudC50c1wiOy8vIC52aXRlcHJlc3Mvc2NyaXB0cy9jYWxjdWxhdGVMaUNvdW50LnRzXHJcbi8vIE5vZGUuanMgXHU3M0FGXHU1ODgzXHU0RTBCXHU4RkQwXHU4ODRDXHJcbmltcG9ydCB7IHJlYWRkaXJTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnO1xyXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInO1xyXG5pbXBvcnQgeyBwcm9jZXNzU3BlY2lhbFF1b3Rlc0ZvclN0YXRzIH0gZnJvbSAnLi4vcGx1Z2luL2Z1bmN0aW9ucyc7XHJcblxyXG5jb25zdCBtZCA9IG5ldyBNYXJrZG93bkl0KCk7XHJcblxyXG4vLyBcdTg5RTNcdTY3OTAgTWFya2Rvd24gXHU2NTg3XHU0RUY2XHU3Njg0IGZyb250bWF0dGVyXHJcbmZ1bmN0aW9uIHBhcnNlRnJvbnRtYXR0ZXIoY29udGVudDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgYW55PiB7XHJcbiAgY29uc3QgZnJvbnRtYXR0ZXJNYXRjaCA9IGNvbnRlbnQubWF0Y2goL14tLS1bXFxzXFxTXSo/LS0tLyk7XHJcbiAgaWYgKCFmcm9udG1hdHRlck1hdGNoKSB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGZyb250bWF0dGVyQ29udGVudCA9IGZyb250bWF0dGVyTWF0Y2hbMF0ucmVwbGFjZSgvXi0tLXwtLS0kL2csICcnKS50cmltKCk7XHJcbiAgY29uc3QgZnJvbnRtYXR0ZXI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcclxuICBcclxuICBmcm9udG1hdHRlckNvbnRlbnQuc3BsaXQoJ1xcbicpLmZvckVhY2gobGluZSA9PiB7XHJcbiAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL15cXHMqKFxcdyspOlxccyooLispJC8pO1xyXG4gICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgIGNvbnN0IFssIGtleSwgdmFsdWVdID0gbWF0Y2g7XHJcbiAgICAgIC8vIFx1N0I4MFx1NTM1NVx1NTkwNFx1NzQwNlx1NUUwM1x1NUMxNFx1NTAzQ1xyXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xyXG4gICAgICAgIGZyb250bWF0dGVyW2tleV0gPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgZnJvbnRtYXR0ZXJba2V5XSA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZyb250bWF0dGVyW2tleV0gPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICByZXR1cm4gZnJvbnRtYXR0ZXI7XHJcbn1cclxuXHJcbi8vIFx1OEJBMVx1N0I5N1x1NzZFRVx1NUY1NVx1NEUwQlx1NjI0MFx1NjcwOSBNYXJrZG93biBcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODQgdWwgPiBsaSBcdTY4MDdcdTdCN0VcdTY1NzBcdTkxQ0ZcclxuLy8gXHU1M0VBXHU4QkExXHU3Qjk3IGZyb250bWF0dGVyIFx1NEUyRCB3b3JkOiB0cnVlIFx1NzY4NFx1NjU4N1x1NEVGNlxyXG4vLyBcdTkwM0JcdThGOTFcdTRFMEUgQXJ0aWNsZU1ldGFkYXRhLnZ1ZSBcdTRFMkRcdTc2ODQgZGFzaFdvcmRDb3VudCBcdTRFMDBcdTgxRjRcclxuZnVuY3Rpb24gY2FsY3VsYXRlTGlDb3VudChkaXJQYXRoOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGxldCB0b3RhbENvdW50ID0gMDtcclxuICBcclxuICBmdW5jdGlvbiBwcm9jZXNzRGlyZWN0b3J5KHBhdGg6IHN0cmluZykge1xyXG4gICAgY29uc3QgZmlsZXMgPSByZWFkZGlyU3luYyhwYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XHJcbiAgICBcclxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG4gICAgICBjb25zdCBmdWxsUGF0aCA9IGpvaW4ocGF0aCwgZmlsZS5uYW1lKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChmaWxlLmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICBwcm9jZXNzRGlyZWN0b3J5KGZ1bGxQYXRoKTtcclxuICAgICAgfSBlbHNlIGlmIChmaWxlLm5hbWUuZW5kc1dpdGgoJy5tZCcpKSB7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlYWRGaWxlU3luYyhmdWxsUGF0aCwgJ3V0ZjgnKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTg5RTNcdTY3OTAgZnJvbnRtYXR0ZXJcdUZGMENcdTUzRUFcdTU5MDRcdTc0MDYgd29yZDogdHJ1ZSBcdTc2ODRcdTY1ODdcdTRFRjZcclxuICAgICAgICBjb25zdCBmcm9udG1hdHRlciA9IHBhcnNlRnJvbnRtYXR0ZXIoY29udGVudCk7XHJcbiAgICAgICAgaWYgKGZyb250bWF0dGVyLndvcmQgIT09IHRydWUpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBcdTU5MDRcdTc0MDZcdTcyNzlcdTZCOEFcdTVGMTVcdTc1MjhcdThCRURcdTZDRDUgXCI+OiBcIlx1RkYwQ1x1NUMwNlx1NTE3Nlx1OEY2Q1x1NjM2Mlx1NEUzQVx1NjY2RVx1OTAxQSBNYXJrZG93biBcdTRFRTVcdTRGQkZcdTZCNjNcdTc4NkVcdTZFMzJcdTY3RDNcdTUyMTdcdTg4NjhcclxuICAgICAgICBjb25zdCBwcm9jZXNzZWRDb250ZW50ID0gcHJvY2Vzc1NwZWNpYWxRdW90ZXNGb3JTdGF0cyhjb250ZW50KTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBodG1sID0gbWQucmVuZGVyKHByb2Nlc3NlZENvbnRlbnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFx1NEY3Rlx1NzUyOCBIVE1MIFx1ODlFM1x1Njc5MFx1NTY2OFx1N0VERlx1OEJBMSB1bCA+IGxpXHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IHBhcnNlKGh0bWwpO1xyXG4gICAgICAgIGNvbnN0IGxpc3RJdGVtcyA9IHJvb3QucXVlcnlTZWxlY3RvckFsbCgndWwgbGk6bm90KDpoYXModWwpKTpub3QoOmhhcyhvbCkpJyk7XHJcbiAgICAgICAgdG90YWxDb3VudCArPSBsaXN0SXRlbXMubGVuZ3RoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByb2Nlc3NEaXJlY3RvcnkoZGlyUGF0aCk7XHJcbiAgcmV0dXJuIHRvdGFsQ291bnQ7XHJcbn1cclxuXHJcbi8vIFx1NUJGQ1x1NTFGQVx1NTFGRFx1NjU3MFx1NEY5Qlx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1NEY3Rlx1NzUyOFxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlDb3VudEZvclZvY2FidWxhcnkoKSB7XHJcbiAgY29uc3Qgdm9jYWJQYXRoID0gam9pbihfX2Rpcm5hbWUsICcuLi8uLi9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeScpO1xyXG4gIHJldHVybiBjYWxjdWxhdGVMaUNvdW50KHZvY2FiUGF0aCk7XHJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxccGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXHBsdWdpblxcXFxmdW5jdGlvbnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3FpbmQvRGVza3RvcC9GQVFfZG9jcy93ZWJzaXRlLy52aXRlcHJlc3MvcGx1Z2luL2Z1bmN0aW9ucy50c1wiOy8qKlxyXG4gKiBcdTU5MDRcdTc0MDYgTWFya2Rvd24gXHU0RTJEXHU3Njg0IFwiPjogXCIgXHU3Mjc5XHU2QjhBXHU1RjE1XHU3NTI4XHU4QkVEXHU2Q0Q1XHJcbiAqIEBwYXJhbSBjb250ZW50IC0gTWFya2Rvd24gXHU1MTg1XHU1QkI5XHJcbiAqIEByZXR1cm5zIFx1NTkwNFx1NzQwNlx1NTQwRVx1NzY4NCBNYXJrZG93biBcdTUxODVcdTVCQjlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzU3BlY2lhbFF1b3Rlcyhjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gIGxldCBpblF1b3RlID0gZmFsc2U7XHJcbiAgbGV0IHF1b3RlQ29udGVudCA9IFtdO1xyXG5cclxuICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGlmIChsaW5lLm1hdGNoKC9ePlxccyo6XFxzKi8pKSB7XHJcbiAgICAgIC8vIFx1OTA0N1x1NTIzMCA+OiBcdTVGMDBcdTU5MzRcdTc2ODRcdTg4NENcclxuICAgICAgaWYgKCFpblF1b3RlKSB7XHJcbiAgICAgICAgLy8gXHU1RjAwXHU1OUNCXHU2NUIwXHU3Njg0XHU1RjE1XHU3NTI4XHU1QkI5XHU1NjY4XHJcbiAgICAgICAgaW5RdW90ZSA9IHRydWU7XHJcbiAgICAgICAgcXVvdGVDb250ZW50ID0gW107XHJcbiAgICAgIH1cclxuICAgICAgLy8gXHU2RTA1XHU3NDA2ID46IFx1NUU3Nlx1NkRGQlx1NTJBMFx1NTIzMFx1NTE4NVx1NUJCOVx1NEUyRFx1RkYwOFx1NEZERFx1NzU1OVx1NTM5Rlx1NTlDQlx1NjgzQ1x1NUYwRlx1RkYwOVxyXG4gICAgICBxdW90ZUNvbnRlbnQucHVzaChsaW5lLnJlcGxhY2UoL14+XFxzKjpcXHMqLywgJycpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFx1OTA0N1x1NTIzMFx1OTc1RSA+OiBcdTVGMDBcdTU5MzRcdTc2ODRcdTg4NENcclxuICAgICAgaWYgKGluUXVvdGUpIHtcclxuICAgICAgICAvLyBcdTdFRDNcdTY3NUZcdTVGNTNcdTUyNERcdTVGMTVcdTc1MjhcdTVCQjlcdTU2NjhcclxuICAgICAgICBpblF1b3RlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gXHU0RkREXHU3NTU5XHU1MzlGXHU1OUNCIE1hcmtkb3duIFx1NjgzQ1x1NUYwRlx1RkYwQ1x1OEJBOSBWaXRlUHJlc3MgXHU4OUUzXHU2NzkwXHU1NjY4XHU1OTA0XHU3NDA2XHJcbiAgICAgICAgY29uc3QgY2xlYW5lZENvbnRlbnQgPSBxdW90ZUNvbnRlbnQuam9pbignXFxuJyk7XHJcbiAgICAgICAgaWYgKGNsZWFuZWRDb250ZW50KSB7XHJcbiAgICAgICAgICByZXN1bHQgKz0gYDxibG9ja3F1b3RlIGNsYXNzPVwidnAtcXVvdGUtc3BlY2lhbFwiPlxcblxcbiR7Y2xlYW5lZENvbnRlbnR9XFxuXFxuPC9ibG9ja3F1b3RlPlxcblxcbmA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NjY2RVx1OTAxQVx1ODg0Q1xyXG4gICAgICByZXN1bHQgKz0gbGluZSArICdcXG4nO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gXHU1OTA0XHU3NDA2XHU2NTg3XHU0RUY2XHU2NzJCXHU1QzNFXHU3Njg0XHU1RjE1XHU3NTI4XHU1QkI5XHU1NjY4XHJcbiAgaWYgKGluUXVvdGUpIHtcclxuICAgIGNvbnN0IGNsZWFuZWRDb250ZW50ID0gcXVvdGVDb250ZW50LmpvaW4oJ1xcbicpO1xyXG4gICAgaWYgKGNsZWFuZWRDb250ZW50KSB7XHJcbiAgICAgIHJlc3VsdCArPSBgPGJsb2NrcXVvdGUgY2xhc3M9XCJ2cC1xdW90ZS1zcGVjaWFsXCI+XFxuXFxuJHtjbGVhbmVkQ29udGVudH1cXG5cXG48L2Jsb2NrcXVvdGU+XFxuXFxuYDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTRFM0FcdTdFREZcdThCQTFcdTVERTVcdTUxNzdcdTU5MDRcdTc0MDYgXCI+OiBcIiBcdTcyNzlcdTZCOEFcdTVGMTVcdTc1MjhcdThCRURcdTZDRDVcdUZGMENcdThGNkNcdTYzNjJcdTRFM0FcdTY2NkVcdTkwMUEgTWFya2Rvd25cclxuICogQHBhcmFtIGNvbnRlbnQgLSBNYXJrZG93biBcdTUxODVcdTVCQjlcclxuICogQHJldHVybnMgXHU1OTA0XHU3NDA2XHU1NDBFXHU3Njg0IE1hcmtkb3duIFx1NTE4NVx1NUJCOVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NTcGVjaWFsUXVvdGVzRm9yU3RhdHMoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gIGxldCByZXN1bHQgPSAnJztcclxuICBsZXQgaW5RdW90ZSA9IGZhbHNlO1xyXG4gIGxldCBxdW90ZUNvbnRlbnQgPSBbXTtcclxuXHJcbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBpZiAobGluZS5tYXRjaCgvXj5cXHMqOlxccyovKSkge1xyXG4gICAgICAvLyBcdTkwNDdcdTUyMzAgPjogXHU1RjAwXHU1OTM0XHU3Njg0XHU4ODRDXHVGRjBDXHU4RjZDXHU2MzYyXHU0RTNBXHU2NjZFXHU5MDFBXHU2NTg3XHU2NzJDXHJcbiAgICAgIGlmICghaW5RdW90ZSkge1xyXG4gICAgICAgIGluUXVvdGUgPSB0cnVlO1xyXG4gICAgICAgIHF1b3RlQ29udGVudCA9IFtdO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFx1NkUwNVx1NzQwNiA+OiBcdTVFNzZcdTZERkJcdTUyQTBcdTUyMzBcdTUxODVcdTVCQjlcdTRFMkRcclxuICAgICAgcXVvdGVDb250ZW50LnB1c2gobGluZS5yZXBsYWNlKC9ePlxccyo6XFxzKi8sICcnKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBcdTkwNDdcdTUyMzBcdTk3NUUgPjogXHU1RjAwXHU1OTM0XHU3Njg0XHU4ODRDXHJcbiAgICAgIGlmIChpblF1b3RlKSB7XHJcbiAgICAgICAgLy8gXHU3RUQzXHU2NzVGXHU1RjUzXHU1MjREXHU1RjE1XHU3NTI4XHU1QkI5XHU1NjY4XHVGRjBDXHU1QzA2XHU1MTg1XHU1QkI5XHU0RjVDXHU0RTNBXHU2NjZFXHU5MDFBXHU2NTg3XHU2NzJDXHU2REZCXHU1MkEwXHJcbiAgICAgICAgaW5RdW90ZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChxdW90ZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmVzdWx0ICs9IHF1b3RlQ29udGVudC5qb2luKCdcXG4nKSArICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBcdTZERkJcdTUyQTBcdTY2NkVcdTkwMUFcdTg4NENcclxuICAgICAgcmVzdWx0ICs9IGxpbmUgKyAnXFxuJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFx1NTkwNFx1NzQwNlx1NjU4N1x1NEVGNlx1NjcyQlx1NUMzRVx1NzY4NFx1NUYxNVx1NzUyOFx1NUJCOVx1NTY2OFxyXG4gIGlmIChpblF1b3RlICYmIHF1b3RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICByZXN1bHQgKz0gcXVvdGVDb250ZW50LmpvaW4oJ1xcbicpICsgJ1xcbic7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZ3NcXFxcc2lkZWJhci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcWluZC9EZXNrdG9wL0ZBUV9kb2NzL3dlYnNpdGUvLnZpdGVwcmVzcy9jb25maWdzL3NpZGViYXIudHNcIjtpbXBvcnQgdHlwZSB7IERlZmF1bHRUaGVtZSB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuaW1wb3J0IHsgZ2V0TGlDb3VudEZvclZvY2FidWxhcnkgfSBmcm9tIFwiLi4vc2NyaXB0cy9jYWxjdWxhdGVMaUNvdW50XCI7XHJcblxyXG5jb25zdCB2b2NhYkxpQ291bnQgPSBnZXRMaUNvdW50Rm9yVm9jYWJ1bGFyeSgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNpZGViYXI6IERlZmF1bHRUaGVtZS5Db25maWdbXCJzaWRlYmFyXCJdID0ge1xyXG4gICAgJy9vdGhlcnMvJzogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1NTE3M1x1NEU4RScsIFxyXG4gICAgICAgICAgICAvLyBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBpdGVtczpbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdGNTFcdTdBRDlcdThCQkVcdThCQTEnLCBsaW5rOiAnL290aGVycy9hYm91dC9hYm91dHN0eWxlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3RjUxXHU3QUQ5XHU1RUZBXHU4QkJFJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1ZpdGVQcmVzcyBcdTRFQ0JcdTdFQ0QnLCBsaW5rOiAnL290aGVycy9hYm91dC9hYm91dHZpdGVwcmVzcycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnR2l0IFx1NjI1OFx1N0JBMScsIGxpbms6ICcvb3RoZXJzL2Fib3V0L0dpdCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnU1NIIFx1NEYyMFx1OEY5MycsIGxpbms6ICcvb3RoZXJzL2Fib3V0L1NTSCcgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1NTE3Nlx1NEVENicsXHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTVGNTJcdTY4NjMnLCBsaW5rOiAnL290aGVycy9hcmNoaXZlJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFJywgbGluazogJy9vdGhlcnMvdGFncycgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICAnL2Vzc2F5cy8nOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU5NjhGXHU3QjE0JyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJENycsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NUUwXHU4MkIxJywgbGluazogJy9lc3NheXMvcG9ldHJ5L1x1NjVFMFx1ODJCMScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QTdBXHU1NENEJywgbGluazogJy9lc3NheXMvcG9ldHJ5L1x1N0E3QVx1NTRDRCcgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEJyxcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQzlcdTg4NzdcdTYwQzVcdTAwQjdcdTc3M0NcdTZCMzJcdTdBN0YnLCBsaW5rOiAnL2Vzc2F5cy9jaS9cdThCQzlcdTg4NzdcdTYwQzVcdTAwQjdcdTc3M0NcdTZCMzJcdTdBN0YnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbiAgICAnL3N0dWR5Lyc6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTVCNjZcdTRFNjAnLFxyXG4gICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4MkYxXHU4QkVEJywgXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MTk5XHU0RjVDJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3dyaXRpbmcvQ2hhbmdlWW91ckxpZmUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NkM0NycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IGBcdTU3RkFcdTc4NDBcdThCQ0RcdTZDNDdcdUZGMDgke3ZvY2FiTGlDb3VudH1cdUZGMDlgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MjREXHU3RjAwJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9wcmVmaXgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgQScsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvQScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBCJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9CJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEMnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0MnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgRCcsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvRCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBFJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9FJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEYnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0YnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgRycsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvRycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBIJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9IJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEknLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0knIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgSicsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvSicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBMJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9MJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnT3hmb3JkIDMwMDAnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9veGZvcmRfMzAwMCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU5NTdGXHU5NkJFXHU1M0U1JywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjAzJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItMycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA0JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItNCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA1JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItNScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA2JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItNicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA3JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItNycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA4JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItOCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjA5JywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItOScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjEwJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItMTAnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnMjAyNi4wMi4xMScsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC9zZW50ZW5jZS8yLTExJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMTInLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi0xMicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZ3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnc1xcXFxoZWFkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9xaW5kL0Rlc2t0b3AvRkFRX2RvY3Mvd2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3MvaGVhZC50c1wiO2ltcG9ydCB0eXBlIHsgSGVhZENvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcblxuZXhwb3J0IGNvbnN0IGhlYWQ6IEhlYWRDb25maWdbXSA9IFtcbiAgICAvLyBcdTkxNERcdTdGNkVcdTdGNTFcdTk4NzVcdTU2RkVcdTY4MDdcbiAgICBbJ2xpbmsnLCB7IHJlbDogJ2ljb24nLCB0eXBlOiAnaW1hZ2UveC1pY29uJywgaHJlZjogJy9pbWcvcWluZF9pY28uc3ZnJyB9XSxcbiAgICAvLyBcdTVGMTVcdTUxNjVGb250IEF3ZXNvbWVcdTU2RkVcdTY4MDdcdTVFOTNcbiAgICBbJ2xpbmsnLCB7IHJlbDogJ3N0eWxlc2hlZXQnLCBocmVmOiAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZm9udC1hd2Vzb21lLzUuMTUuMS9jc3MvYWxsLm1pbi5jc3MnLCBpbnRlZ3JpdHk6ICdzaGE1MTItKzR6Q0s5aytxTkZVUjVYK2NLTDlFSVIrWk9odElsb05sOUdJS1M1N1YxTXlOc1lwWWNVclVlUWM5dk5menNXZlYyOElhTEwzaTk2UDlzZE55ZVJzc0E9PScsIGNyb3Nzb3JpZ2luOiAnYW5vbnltb3VzJyB9XSxcbiAgICAvLyBcdTVGMTVcdTUxNjVcdTU5MTZcdTkwRThcdTgxMUFcdTY3MkNcdTY1ODdcdTRFRjZcbiAgICBbJ3NjcmlwdCcsIHsgc3JjOiAnL2pzL2Vhcmx5LWluaXQuanMnIH1dLFxuICAgIFsnc2NyaXB0JywgeyBzcmM6ICcvanMvaW1hZ2UtcHJvdGVjdGlvbi5qcycgfV0sXG5cbiAgICBbJ21ldGEnLCB7IG5hbWU6ICdkZXNjcmlwdGlvbicsIGNvbnRlbnQ6ICdcdThGRDlcdTY2MkZcdTc0MzRcdTZCQkZcdTc2ODRcdTRFMkFcdTRFQkFcdTdCMTRcdThCQjBcdTdGNTFcdTdBRDknIH1dLFxuICAgIFsnbWV0YScsIHsgbmFtZTogJ2tleXdvcmRzJywgY29udGVudDogJ1x1NzQzNFx1NkJCRiwgcWluZGx1dGUsIHFpbmQsIFx1NTM1QVx1NUJBMiwgVml0ZXByZXNzLCBcdTVCNjZcdTRFNjBcdTdCMTRcdThCQjAsIFx1NEUyQVx1NEVCQVx1N0Y1MVx1N0FEOScgfV0sXG4gICAgWydtZXRhJywgeyBuYW1lOiAnYXV0aG9yJywgY29udGVudDogJ3FpbmRsdXRlJyB9XSxcbl0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXFxcXGN1c3RvbUljb25zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9xaW5kL0Rlc2t0b3AvRkFRX2RvY3Mvd2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3MvY3VzdG9tSWNvbnMudHNcIjsvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTU2RkVcdTY4MDdcdTkxNERcdTdGNkVcclxuLy8gXHU3NTI4XHU0RThFdml0ZXByZXNzLXBsdWdpbi1ncm91cC1pY29uc1x1NjNEMlx1NEVGNlxyXG5cclxuLy8gXHU5MTREXHU3RjZFXHU1NkZFXHU2ODA3XHU1M0MyXHU4MDAzXHU2NTg3XHU2ODYzXHVGRjFBaHR0cHM6Ly9naXRodWIuY29tL3l1eWlud3Mvdml0ZXByZXNzLXBsdWdpbi1ncm91cC1pY29uc1xyXG5cclxuaW1wb3J0IHsgZ3JvdXBJY29uVml0ZVBsdWdpbiB9IGZyb20gJ3ZpdGVwcmVzcy1wbHVnaW4tZ3JvdXAtaWNvbnMnXHJcblxyXG5leHBvcnQgY29uc3QgY3VzdG9tSWNvbjogZ3JvdXBJY29uVml0ZVBsdWdpbi5PcHRpb25zWydjdXN0b21JY29uJ10gPSB7XHJcbi8vIGV4cG9ydCBjb25zdCBjdXN0b21JY29uID0ge1xyXG4gIG10czogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLXR5cGVzY3JpcHRcIixcclxuICBjdHM6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS10eXBlc2NyaXB0XCIsXHJcbiAgdHM6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS10eXBlc2NyaXB0XCIsXHJcbiAgdHN4OiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtdHlwZXNjcmlwdFwiLFxyXG4gIG1qczogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLWpzXCIsXHJcbiAgY2pzOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtanNcIixcclxuICBqc29uOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtanNvblwiLFxyXG4gIGpzOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtanNcIixcclxuICBqc3g6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1qc1wiLFxyXG4gIG1kOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtbWFya2Rvd25cIixcclxuICBweTogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLXB5dGhvblwiLFxyXG4gIGljbzogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLWZhdmljb25cIixcclxuICBodG1sOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtaHRtbFwiLFxyXG4gIGNzczogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLWNzc1wiLFxyXG4gIHNjc3M6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1zY3NzXCIsXHJcbiAgeW1sOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtbGlnaHQteWFtbFwiLFxyXG4gIHlhbWw6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1saWdodC15YW1sXCIsXHJcbiAgcGhwOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtcGhwXCIsXHJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxccGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXHBsdWdpblxcXFxtYXJrZG93blRyYW5zZm9ybS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcWluZC9EZXNrdG9wL0ZBUV9kb2NzL3dlYnNpdGUvLnZpdGVwcmVzcy9wbHVnaW4vbWFya2Rvd25UcmFuc2Zvcm0udHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IHByb2Nlc3NTcGVjaWFsUXVvdGVzIH0gZnJvbSAnLi9mdW5jdGlvbnMnXHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gJ21hcmtkb3duLWl0J1xyXG5cclxuLy8gXHU1MjFCXHU1RUZBIG1hcmtkb3duLWl0IFx1NUI5RVx1NEY4QlxyXG5jb25zdCBtZCA9IG5ldyBNYXJrZG93bkl0KClcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBNYXJrZG93blRyYW5zZm9ybSgpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnbWQtbGluay10cmFuc2Zvcm0nLFxyXG4gICAgZW5mb3JjZTogJ3ByZScsXHJcbiAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcclxuICAgICAgaWYgKCFpZC5lbmRzV2l0aCgnLm1kJykpIHJldHVybiBudWxsXHJcbiAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykgfHwgaWQuaW5jbHVkZXMoJy52aXRlcHJlc3MvY29uZmlnJykpIFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgICAvLyBcdTUxNDhcdTU5MDRcdTc0MDZcdTU2RkVcdTcyNDdcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvIVxcWyguKj8pXFxdXFwoKC4qPylcXCkvZywgKG1hdGNoLCB0ZXh0LCBzcmMpID0+IHtcclxuICAgICAgICByZXR1cm4gc3JjLnN0YXJ0c1dpdGgoJ2h0dHAnKSBcclxuICAgICAgICAgID8gYDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiJHt0ZXh0IHx8ICdpbWFnZSd9XCIgLz5gXHJcbiAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBcdTUxOERcdTU5MDRcdTc0MDZcdTk0RkVcdTYzQTVcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFxbKC4qPylcXF1cXCgoaHR0cHM/OlxcL1xcL1teXFxzKV0rKSg/OlxccytcIiguKj8pXCIpP1xcKS9nLCBcclxuICAgICAgICAobWF0Y2gsIHRleHQsIGhyZWYsIHRpdGxlKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGl0bGUgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICA/IGA8Q3VzdG9tTGluayB0aXRsZT1cIiR7dGV4dH1cIiBocmVmPVwiJHtocmVmfVwiIC8+YFxyXG4gICAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcblxyXG4gICAgICAvLyBcdTVDMDYgPjogXHU4RjZDXHU2MzYyXHU0RTNBXHU4MUVBXHU1QjlBXHU0RTQ5IEhUTUxcclxuICAgICAgY29kZSA9IHByb2Nlc3NTcGVjaWFsUXVvdGVzKGNvZGUpO1xyXG5cclxuICAgICAgLy8gXHU1OTA0XHU3NDA2IFwiJiBcIiBcdThGNkNcdTYzNjJcdTRFM0EgPGludGVydmFsPjwvaW50ZXJ2YWw+IFx1NjgwN1x1N0I3RVxyXG4gICAgICBjb25zdCBsaW5lcyA9IGNvZGUuc3BsaXQoJ1xcbicpOyAvLyBcdTYzMDlcdTg4NENcdTUyMDZcdTUyNzJcdTRFRTNcdTc4MDFcclxuICAgICAgbGV0IGluQ29kZUJsb2NrID0gZmFsc2U7XHJcbiAgICAgIGxldCByZXN1bHRMaW5lczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgXHJcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJ2BgYCcpKSB7IC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1OEZEQlx1NTE2NVx1NjIxNlx1OTAwMFx1NTFGQVx1NEVFM1x1NzgwMVx1NTc1N1xyXG4gICAgICAgICAgaW5Db2RlQmxvY2sgPSAhaW5Db2RlQmxvY2s7XHJcbiAgICAgICAgICByZXN1bHRMaW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbkNvZGVCbG9jaykge1xyXG4gICAgICAgICAgcmVzdWx0TGluZXMucHVzaChsaW5lKTtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goLyhefFxccykoJlxccykoLispLyk7XHJcbiAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICBjb25zdCBiZWZvcmUgPSBsaW5lLnNsaWNlKDAsIG1hdGNoLmluZGV4ICsgbWF0Y2hbMV0ubGVuZ3RoKTtcclxuICAgICAgICAgIGNvbnN0IGFmdGVyID0gbWF0Y2hbM107XHJcbiAgICAgICAgICBjb25zdCByZW5kZXJlZEFmdGVyID0gbWQucmVuZGVySW5saW5lKGFmdGVyKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmVzdWx0TGluZXMucHVzaChgJHtiZWZvcmV9PGludGVydmFsPiR7cmVuZGVyZWRBZnRlcn08L2ludGVydmFsPmApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXN1bHRMaW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgY29kZSA9IHJlc3VsdExpbmVzLmpvaW4oJ1xcbicpO1xyXG5cclxuICAgICAgLy8gXHU1OTA0XHU3NDA2XHU4QkNEXHU2MDI3XHU5QUQ4XHU0RUFFIChuLiB2LiBhZGouIGFkLiBwcmVwLiBjb25qLiBwcmVmLilcclxuICAgICAgLy8gXHU0RjdGXHU3NTI4IG1hcmtlci5jc3MgXHU0RTJEXHU1QjlBXHU0RTQ5XHU3Njg0XHU5ODlDXHU4MjcyXHVGRjBDXHU0RkREXHU2MzAxXHU5ODlDXHU4MjcyXHU5OENFXHU2ODNDXHU0RTAwXHU4MUY0XHJcbiAgICAgIGNvbnN0IHBvc01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgICAnbi4nOiAncmdiYSgyNTEsIDE0NiwgNjApJywgLy8gXHU2QTU5XHU4MjcyXHJcbiAgICAgICAgJ3YuJzogJ3JnYmEoMjM5LCA2OCwgNjgpJywgLy8gXHU3RUEyXHU4MjcyXHJcbiAgICAgICAgJ2Fkai4nOiAncmdiYSg1OSwgMTMwLCAyNDYpJywgLy8gXHU4NEREXHU4MjcyXHJcbiAgICAgICAgJ2FkLic6ICdyZ2JhKDE2OCwgODUsIDI0NyknLCAvLyBcdTdEMkJcdTgyNzJcclxuICAgICAgICAncHJlcC4nOiAncmdiYSgxNTIsIDI1MSwgMTUyKScsIC8vIFx1ODU4NFx1ODM3N1x1N0VGRlxyXG4gICAgICAgICdjb25qLic6ICdyZ2JhKDAsIDI1NSwgMjU1KScgLy8gXHU5NzUyXHU4MjcyXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NkI2M1x1NTIxOVx1NTMzOVx1OTE0RFx1NzJFQ1x1N0FDQlx1NTFGQVx1NzNCMFx1NzY4NFx1OEJDRFx1NjAyN1x1N0YyOVx1NTE5OVxyXG4gICAgICAvLyBcXGIgXHU3ODZFXHU0RkREXHU1MzM5XHU5MTREXHU1MzU1XHU4QkNEXHU4RkI5XHU3NTRDXHVGRjBDXHU5NjMyXHU2QjYyXHU4QkVGXHU0RjI0XHJcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1xcYihuXFwufHZcXC58YWRqXFwufGFkXFwufHByZXBcXC58Y29ualxcLnxwcmVmXFwuKSg/PVxcc3wkfFteYS16QS1aXSkvZywgKG1hdGNoKSA9PiB7XHJcbiAgICAgICAgLy8gXHU1QkY5IHByZWYuIFx1NzI3OVx1NkI4QVx1NTkwNFx1NzQwNlx1RkYwQ1x1NEY3Rlx1NzUyOFx1NkUxMFx1NTNEOFx1NjU0OFx1Njc5Q1xyXG4gICAgICAgIGlmIChtYXRjaCA9PT0gJ3ByZWYuJykge1xyXG4gICAgICAgICAgcmV0dXJuIGAmbmJzcDs8c3BhbiBjbGFzcz1cInRleHQtZ3JhZGllbnRcIj4ke21hdGNofTwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb2xvciA9IHBvc01hcFttYXRjaF07XHJcbiAgICAgICAgcmV0dXJuIGAmbmJzcDs8c3BhbiBzdHlsZT1cImNvbG9yOiAke2NvbG9yfTtcIj4ke21hdGNofTwvc3Bhbj5gO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBjb2RlXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlO0FBR3hCLE9BQU8seUJBQXlCO0FBRWhDLFNBQVMsbUJBQW1CLDJCQUE0QztBQUV4RSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsV0FBVyxhQUFhLHlCQUF5Qjs7O0FDWG5ELElBQU0sTUFBa0M7QUFBQSxFQUN6QyxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxJQUFJO0FBQUEsRUFDeEI7QUFBQSxJQUFFLE1BQU07QUFBQSxJQUNGLE9BQU87QUFBQSxNQUNEO0FBQUEsUUFBRSxNQUFNO0FBQUEsUUFDRixPQUFPO0FBQUEsVUFDRCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSx3Q0FBd0M7QUFBQSxVQUM1RCxFQUFFLE1BQU0sZ0JBQU0s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QUFNLE9BQU8sTUFBTSxLQUFLLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLO0FBQzdDLGlCQUFPLE1BQU0sWUFBWSxJQUNyQixxRUFBcUUsUUFBUSxTQUFTLFdBQ3RGO0FBQUEsUUFDTjtBQUFBLE1BQ0YsQ0FBQztBQUVELE1BQUFBLElBQUcsSUFBSSxxQkFBcUIsY0FBYztBQUFBLFFBQ3hDLFFBQVEsQ0FBQyxRQUFRLFFBQVE7QUFDdkIsZ0JBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsY0FBSSxNQUFNLFlBQVksR0FBRztBQUV2QixrQkFBTSxRQUFRLE1BQU0sS0FBSyxLQUFLLEVBQUUsUUFBUSxrQkFBa0IsRUFBRTtBQUM1RCxrQkFBTSxZQUFZLFFBQVEsZ0NBQWdDLEtBQUssVUFBVTtBQUV6RSxtQkFBTywyREFBMkQsU0FBUztBQUFBLFVBQzdFO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRixDQUFDO0FBR0QsTUFBQUEsSUFBRyxJQUFJLHFCQUFxQixPQUFPO0FBQUEsUUFDakMsUUFBUSxDQUFDLFFBQVEsUUFBUTtBQUN2QixnQkFBTSxRQUFRLE9BQU8sR0FBRztBQUV4QixjQUFJLE1BQU0sWUFBWSxHQUFHO0FBRXZCLGtCQUFNLE9BQU8sTUFBTSxLQUFLLEtBQUs7QUFFN0Isa0JBQU0sV0FBVyxLQUFLLFNBQVMsUUFBUTtBQUN2QyxrQkFBTSxRQUFRLEtBQUssUUFBUSx1QkFBdUIsRUFBRSxFQUFFLEtBQUssS0FBSztBQUdoRSxrQkFBTSxjQUFjLFdBQVcsV0FBVztBQUMxQyxtQkFBTztBQUFBLGdDQUNhLFdBQVc7QUFBQSx3Q0FDSCxLQUFLO0FBQUE7QUFBQSxVQUVuQztBQUVBLGlCQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFPVDtBQUFBLE1BQ0YsQ0FBQztBQUdELE1BQUFBLElBQUcsSUFBSSxxQkFBcUIsWUFBWTtBQUFBLFFBQ3RDLFFBQVEsQ0FBQyxRQUFRLFFBQVE7QUFDdkIsZ0JBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsY0FBSSxNQUFNLFlBQVksR0FBRztBQUV2QixrQkFBTSxRQUFRLE1BQU0sS0FBSyxLQUFLLEVBQUUsUUFBUSxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssS0FBSztBQUN0RSxtQkFBTyxtQ0FBbUMsS0FBSztBQUFBLFVBQ2pEO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFFSDtBQUFBLEVBQ0Y7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogWyJNYXJrZG93bkl0IiwgIm1kIiwgIk1hcmtkb3duSXQiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAibWQiXQp9Cg==
