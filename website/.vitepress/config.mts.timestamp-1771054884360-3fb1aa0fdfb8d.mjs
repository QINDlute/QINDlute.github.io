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

// website/.vitepress/configs/sidebar.ts
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
                  text: "\u57FA\u7840\u8BCD\u6C47\u5168\u8D2F\u901A",
                  collapsed: false,
                  items: [
                    { text: "\u524D\u7F00", link: "/study/english/vocabulary/basic_vocabulary/prefix" },
                    { text: "\u8BCD\u6839 A", link: "/study/english/vocabulary/basic_vocabulary/A" },
                    { text: "\u8BCD\u6839 B", link: "/study/english/vocabulary/basic_vocabulary/B" },
                    { text: "\u8BCD\u6839 C", link: "/study/english/vocabulary/basic_vocabulary/C" },
                    { text: "\u8BCD\u6839 D", link: "/study/english/vocabulary/basic_vocabulary/D" },
                    { text: "\u8BCD\u6839 E", link: "/study/english/vocabulary/basic_vocabulary/E" },
                    { text: "\u8BCD\u6839 F", link: "/study/english/vocabulary/basic_vocabulary/F" },
                    { text: "\u8BCD\u6839 G", link: "/study/english/vocabulary/basic_vocabulary/G" }
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
      const lines = code.split("\n");
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
            const cleanedContent = quoteContent.filter((line2) => line2.trim() !== "").join("\n");
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
        const cleanedContent = quoteContent.filter((line) => line.trim() !== "").join("\n");
        if (cleanedContent) {
          result += `<blockquote class="vp-quote-special">

${cleanedContent}

</blockquote>
`;
        }
      }
      code = result;
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
      code = code.replace(/\b(n\.|v\.|adj\.|ad\.|prep\.|conj\.)(?=\s|$|[^a-zA-Z])/g, (match) => {
        const color = posMap[match];
        return `&nbsp;<span style="color: ${color};">${match}</span>`;
      });
      return code;
    }
  };
}

// website/.vitepress/config.mts
var __vite_injected_original_dirname = "C:\\Users\\qind\\Desktop\\FAQ_docs\\website\\.vitepress";
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
        dirs: resolve(__vite_injected_original_dirname, "./theme/components"),
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
        "@": resolve(__vite_injected_original_dirname, ".."),
        // 项目根目录
        "@components": resolve(__vite_injected_original_dirname, "components"),
        // 组件目录
        "@composables": resolve(__vite_injected_original_dirname, "composables")
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
    config: (md) => {
      md.use(groupIconMdPlugin);
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      };
      md.use(markdownItContainer, "note", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(5).trim();
          return token.nesting === 1 ? `<div class="custom-block note"><div class="custom-block-title">${info || "NOTE"}</div>` : "</div>";
        }
      });
      md.use(markdownItContainer, "important", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(10).trim();
          return token.nesting === 1 ? `<div class="custom-block important"><div class="custom-block-title">${info || "IMPORTANT"}</div>` : "</div>";
        }
      });
      md.use(markdownItContainer, "caution", {
        render: (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim().slice(8).trim();
          return token.nesting === 1 ? `<div class="custom-block caution"><div class="custom-block-title">${info || "CAUTION"}</div>` : "</div>";
        }
      });
      md.use(markdownItContainer, "whiteboard", {
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
      md.use(markdownItContainer, "faq", {
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
      md.use(markdownItContainer, "details:", {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3MvbmF2LnRzIiwgIndlYnNpdGUvLnZpdGVwcmVzcy9jb25maWdzL3NpZGViYXIudHMiLCAid2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZ3MvaGVhZC50cyIsICJ3ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlncy9jdXN0b21JY29ucy50cyIsICJ3ZWJzaXRlLy52aXRlcHJlc3MvcGx1Z2luL21hcmtkb3duVHJhbnNmb3JtLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9xaW5kL0Rlc2t0b3AvRkFRX2RvY3Mvd2Vic2l0ZS8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjsvLyAudml0ZXByZXNzL2NvbmZpZy5tdHNcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuXHJcbi8vIFx1NUYxNVx1NzUyOFx1NTI0RFx1NTE0OFx1NUI4OVx1ODhDNVx1RkYwQ3dpbmRvd3NcdTRFRTNcdTc4MDFcdUZGMUFucG0gaW5zdGFsbCAtRCBtYXJrZG93bi1pdC1jb250YWluZXJcclxuaW1wb3J0IG1hcmtkb3duSXRDb250YWluZXIgZnJvbSAnbWFya2Rvd24taXQtY29udGFpbmVyJ1xyXG5cclxuaW1wb3J0IHsgZ3JvdXBJY29uTWRQbHVnaW4sIGdyb3VwSWNvblZpdGVQbHVnaW4sIGxvY2FsSWNvbkxvYWRlciB9IGZyb20gJ3ZpdGVwcmVzcy1wbHVnaW4tZ3JvdXAtaWNvbnMnXHJcbi8vIGltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgeyBwcmVzZXRVbm8sIHByZXNldEljb25zLCBwcmVzZXRBdHRyaWJ1dGlmeSB9IGZyb20gJ3Vub2NzcydcclxuXHJcbmltcG9ydCB7IG5hdiwgc2lkZWJhciwgaGVhZCwgY3VzdG9tSWNvbiB9IGZyb20gJy4vY29uZmlncydcclxuaW1wb3J0IHsgTWFya2Rvd25UcmFuc2Zvcm0gfSBmcm9tICcuL3BsdWdpbi9tYXJrZG93blRyYW5zZm9ybSdcclxuXHJcblxyXG5cclxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHRpdGxlOiBcIlx1NzQzNFx1NkJCRlwiLFxyXG4gIGRlc2NyaXB0aW9uOiBcIlx1NEUyQVx1NEVCQVx1N0IxNFx1OEJCMFx1N0Y1MVx1N0FEOVwiLFxyXG4gIGxhbmc6IFwiemgtQ05cIixcclxuXHJcbiAgYXBwZWFyYW5jZTogZmFsc2UsXHJcblxyXG4gIC8vIFx1NkRGQlx1NTJBMFx1NTkxNlx1OTBFOFx1ODExQVx1NjcyQ1x1RkYwQ1x1NjNEMFx1NTI0RFx1NUU5NFx1NzUyOFx1ODFFQVx1NUI5QVx1NEU0OVx1NjgzN1x1NUYwRlx1OTE0RFx1N0Y2RVxyXG4gIGhlYWQsXHJcblxyXG4gIHNpdGVtYXA6IHtcclxuICAgIGhvc3RuYW1lOiAnaHR0cHM6Ly9kb2NzLnFpbmRsdXRlLmNsb3VkJyxcclxuICB9LFxyXG5cclxuICAvLyBcdTRGN0ZcdTc1MjhWaXRlUHJlc3NcdTUxODVcdTdGNkVcdTc2ODRcdTRFM0JcdTk4OThcdTkxNERcdTdGNkVcclxuICB0aGVtZUNvbmZpZzoge1xyXG4gICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xyXG4gICAgbG9nbzogJy9pbWcvcWluZF9pY28uc3ZnJyxcclxuXHJcbiAgICAvLyBcdTg5ODZcdTc2RDZcdTk4NzVcdTk3NjJcdTY4MDdcdTk4OThcclxuICAgIHNpdGVUaXRsZTogJ1x1NzQzNFx1NkJCRicsXHJcblxyXG4gICAgbmF2LFxyXG5cclxuICAgIHNpZGViYXIsXHJcblxyXG4gICAgLy8gXHU1OTI3XHU3RUIyXHU5MTREXHU3RjZFXHJcbiAgICBvdXRsaW5lOiB7XHJcbiAgICAgIGxldmVsOiAnZGVlcCcsXHJcbiAgICAgIGxhYmVsOiAnXHU3NkVFXHU1RjU1J1xyXG4gICAgfSxcclxuICAgIHJldHVyblRvVG9wTGFiZWw6ICdcdTU2REVcdTUyMzBcdTk4NzZcdTkwRTgnLFxyXG4gICAgXHJcbiAgICBzb2NpYWxMaW5rczogW1xyXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL1FJTkRsdXRlL1FJTkRsdXRlLmdpdGh1Yi5pby90cmVlL21hc3RlcicgfSxcclxuICAgICAgeyBpY29uOiAnZ21haWwnLCBsaW5rOiAnbWFpbHRvOnFpbmRsdXRlQGdtYWlsLmNvbScgfVxyXG4gICAgXSxcclxuXHJcbiAgICAvLyBcdTk4NzVcdTgxMUFcdTkxNERcdTdGNkVcclxuICAgIGZvb3Rlcjoge1xyXG4gICAgICBtZXNzYWdlOiAncWluZGx1dGVcXCdzIG5vdGVzJyxcclxuICAgICAgY29weXJpZ2h0OiAnQ29weXJpZ2h0IFx1MDBBOSAyMDI1LTIwMjYgcWluZGx1dGUnXHJcbiAgICB9LFxyXG4gICAgZG9jRm9vdGVyOiB7XHJcbiAgICAgIHByZXY6ICdcdTRFMEFcdTRFMDBcdTk4NzUnLFxyXG4gICAgICBuZXh0OiAnXHU0RTBCXHU0RTAwXHU5ODc1J1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gbGFzdFVwZGF0ZWQ6IHtcclxuICAgIC8vICAgdGV4dDogJ1x1NjcwMFx1NTQwRVx1NjZGNFx1NjVCMFx1NEU4RSdcclxuICAgIC8vIH0sXHJcblxyXG4gICAgLy8gXHU1NDJGXHU3NTI4XHU2NzJDXHU1NzMwXHU2NDFDXHU3RDIyXHU1MjlGXHU4MEZEXHJcbiAgICBzZWFyY2g6IHtcclxuICAgICAgcHJvdmlkZXI6ICdsb2NhbCcsXHJcbiAgICAgIC8vIFx1NjQxQ1x1N0QyMlx1OTAwOVx1OTg3OVx1OTE0RFx1N0Y2RVxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgdHJhbnNsYXRpb25zOiB7XHJcbiAgICAgICAgICBidXR0b246IHtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dDogJ1x1NjQxQ1x1N0QyMicsXHJcbiAgICAgICAgICAgIGJ1dHRvbkFyaWFMYWJlbDogJ1x1NjQxQ1x1N0QyMlx1NjU4N1x1Njg2MydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtb2RhbDoge1xyXG4gICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnXHU2NzJBXHU2MjdFXHU1MjMwXHU1MzM5XHU5MTREXHU3RUQzXHU2NzlDJyxcclxuICAgICAgICAgICAgcmVzZXRCdXR0b25UaXRsZTogJ1x1NkUwNVx1N0E3QVx1NjQxQ1x1N0QyMicsXHJcbiAgICAgICAgICAgIGRpc3BsYXlEZXRhaWxzOiAnXHU2NjNFXHU3OTNBXHU4QkU2XHU3RUM2XHU0RkUxXHU2MDZGJyxcclxuICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgbmF2aWdhdGVUZXh0OiAnXHU1QkZDXHU4MjJBJyxcclxuICAgICAgICAgICAgICBzZWxlY3RUZXh0OiAnXHU5MDA5XHU2MkU5JyxcclxuICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdcdTkwMDBcdTUxRkEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1pbmlTZWFyY2g6IHtcclxuICAgICAgICAgIHNlYXJjaE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgYm9vc3Q6IHsgLy8gXHU2ODA3XHU5ODk4XHU2NzQzXHU5MUNEXHU0RTNBOFx1RkYwQ1x1NjU4N1x1NjcyQ1x1Njc0M1x1OTFDRFx1NEUzQTRcdUZGMDhcdTRGMThcdTUxNDhcdTUzMzlcdTkxNERcdTY4MDdcdTk4OThcdUZGMDlcclxuICAgICAgICAgICAgICB0aXRsZTogOCxcclxuICAgICAgICAgICAgICB0ZXh0OiA0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgdml0ZToge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAvLyB0YWlsd2luZGNzcygpLCAvLyBcdTZERkJcdTUyQTAgVGFpbHdpbmQgQ1NTIFx1NjNEMlx1NEVGNlxyXG4gICAgICBVbm9DU1Moe1xyXG4gICAgICAgIHByZXNldHM6IFtcclxuICAgICAgICAgIHByZXNldFVubygpLFxyXG4gICAgICAgICAgcHJlc2V0SWNvbnMoe1xyXG4gICAgICAgICAgICBzY2FsZTogMS4yLFxyXG4gICAgICAgICAgICB3YXJuOiB0cnVlLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBwcmVzZXRBdHRyaWJ1dGlmeSgpLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pLCAvLyBcdTZERkJcdTUyQTAgVW5vQ1NTIFx1NjNEMlx1NEVGNlxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkaXJzOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vdGhlbWUvY29tcG9uZW50cycpLFxyXG4gICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgY29tcG9uZW50UHJlZml4OiAnJyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZHRzOiAnLi8udml0ZXByZXNzL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICAgICAgdHJhbnNmb3JtZXI6ICd2dWUzJyxcclxuICAgICAgfSksIC8vIFx1NkRGQlx1NTJBMCBDb21wb25lbnRzIFx1NjNEMlx1NEVGNlx1RkYwQ1x1NzUyOFx1NEU4RVx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICBncm91cEljb25WaXRlUGx1Z2luKHtcclxuICAgICAgICBjdXN0b21JY29uXHJcbiAgICAgIH0pLCAvLyBcdTRGN0ZcdTc1MjhcdTVCRkNcdTUxNjVcdTc2ODRcdTU2RkVcdTY4MDdcdTkxNERcdTdGNkVcclxuICAgICAgSWNvbnMoe1xyXG4gICAgICAgIGNvbXBpbGVyOiAndnVlMycsXHJcbiAgICAgICAgYXV0b0luc3RhbGw6IHRydWUsXHJcbiAgICAgICAgZGVmYXVsdFN0eWxlOiAnZGlzcGxheTogaW5saW5lLWJsb2NrJyxcclxuICAgICAgfSksXHJcbiAgICAgIE1hcmtkb3duVHJhbnNmb3JtKCksXHJcblxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nKSwgLy8gXHU5ODc5XHU3NkVFXHU2ODM5XHU3NkVFXHU1RjU1XHJcbiAgICAgICAgJ0Bjb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdjb21wb25lbnRzJyksIC8vIFx1N0VDNFx1NEVGNlx1NzZFRVx1NUY1NVxyXG4gICAgICAgICdAY29tcG9zYWJsZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ2NvbXBvc2FibGVzJykgLy8gXHU1M0VGXHU3RUM0XHU1NDA4XHU1MUZEXHU2NTcwXHU3NkVFXHU1RjU1XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzc3I6IHtcclxuICAgICAgbm9FeHRlcm5hbDogWydwZGZqcy1kaXN0JywgJ0B2dWUtcGRmLXZpZXdlci92aWV3ZXInXVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1hcmtkb3duOiB7XHJcbiAgICBtYXRoOiB0cnVlLFxyXG4gICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICBpbWFnZToge1xyXG4gICAgICBsYXp5TG9hZGluZzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNvbmZpZzogKG1kKSA9PiB7XHJcbiAgICAgIG1kLnVzZShncm91cEljb25NZFBsdWdpbikgLy8gXHU0RUUzXHU3ODAxXHU3RUM0XHU1NkZFXHU2ODA3XHJcblxyXG4gICAgICAvLyBoMSBcdTY4MDdcdTk4OThcdTgxRUFcdTUyQThcdTZERkJcdTUyQTAgQXJ0aWNsZU1ldGFkYXRhIFx1N0VDNFx1NEVGNlxyXG4gICAgICBtZC5yZW5kZXJlci5ydWxlcy5oZWFkaW5nX2Nsb3NlID0gKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNsZikgPT4ge1xyXG4gICAgICAgICAgbGV0IGh0bWxSZXN1bHQgPSBzbGYucmVuZGVyVG9rZW4odG9rZW5zLCBpZHgsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgaWYgKHRva2Vuc1tpZHhdLnRhZyA9PT0gJ2gxJykgaHRtbFJlc3VsdCArPSBgPEFydGljbGVNZXRhZGF0YSAvPmA7IFxyXG4gICAgICAgICAgcmV0dXJuIGh0bWxSZXN1bHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NkNFOFx1NTE4Q1x1ODFFQVx1NUI5QVx1NEU0OVx1NUJCOVx1NTY2OFxyXG4gICAgICBtZC51c2UobWFya2Rvd25JdENvbnRhaW5lciwgJ25vdGUnLCB7XHJcbiAgICAgICAgcmVuZGVyOiAodG9rZW5zLCBpZHgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cclxuICAgICAgICAgIGNvbnN0IGluZm8gPSB0b2tlbi5pbmZvLnRyaW0oKS5zbGljZSg1KS50cmltKClcclxuICAgICAgICAgIHJldHVybiB0b2tlbi5uZXN0aW5nID09PSAxXHJcbiAgICAgICAgICAgID8gYDxkaXYgY2xhc3M9XCJjdXN0b20tYmxvY2sgbm90ZVwiPjxkaXYgY2xhc3M9XCJjdXN0b20tYmxvY2stdGl0bGVcIj4ke2luZm8gfHwgJ05PVEUnfTwvZGl2PmBcclxuICAgICAgICAgICAgOiAnPC9kaXY+J1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAnaW1wb3J0YW50Jywge1xyXG4gICAgICAgIHJlbmRlcjogKHRva2VucywgaWR4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXHJcbiAgICAgICAgICBjb25zdCBpbmZvID0gdG9rZW4uaW5mby50cmltKCkuc2xpY2UoMTApLnRyaW0oKVxyXG4gICAgICAgICAgcmV0dXJuIHRva2VuLm5lc3RpbmcgPT09IDFcclxuICAgICAgICAgICAgPyBgPGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jayBpbXBvcnRhbnRcIj48ZGl2IGNsYXNzPVwiY3VzdG9tLWJsb2NrLXRpdGxlXCI+JHtpbmZvIHx8ICdJTVBPUlRBTlQnfTwvZGl2PmBcclxuICAgICAgICAgICAgOiAnPC9kaXY+J1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAnY2F1dGlvbicsIHtcclxuICAgICAgICByZW5kZXI6ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxyXG4gICAgICAgICAgY29uc3QgaW5mbyA9IHRva2VuLmluZm8udHJpbSgpLnNsaWNlKDgpLnRyaW0oKVxyXG4gICAgICAgICAgcmV0dXJuIHRva2VuLm5lc3RpbmcgPT09IDFcclxuICAgICAgICAgICAgPyBgPGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jayBjYXV0aW9uXCI+PGRpdiBjbGFzcz1cImN1c3RvbS1ibG9jay10aXRsZVwiPiR7aW5mbyB8fCAnQ0FVVElPTid9PC9kaXY+YFxyXG4gICAgICAgICAgICA6ICc8L2Rpdj4nXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAvLyA6Ojogd2hpdGVib2FyZCBcdTgxRUFcdTVCOUFcdTRFNDlcdTVCQjlcdTU2NjhcclxuICAgICAgbWQudXNlKG1hcmtkb3duSXRDb250YWluZXIsICd3aGl0ZWJvYXJkJywge1xyXG4gICAgICAgIHJlbmRlcjogKHRva2VucywgaWR4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpZHhdXHJcbiAgICAgICAgICBpZiAodG9rZW4ubmVzdGluZyA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBcdTY1MkZcdTYzMDFcdTgxRUFcdTVCOUFcdTRFNDlcdTY4MDdcdTk4OThcdUZGMDhcdTY1RTBcdTY4MDdcdTk4OThcdTUyMTlcdTRFMERcdTY2M0VcdTc5M0FcdUZGMDlcclxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0b2tlbi5pbmZvLnRyaW0oKS5yZXBsYWNlKC9ed2hpdGVib2FyZFxccyovLCAnJykgLy8gXHU1MzM5XHU5MTREXHU2QjYzXHU1MjE5XHU4ODY4XHU4RkJFXHU1RjBGXHVGRjBDXHU1QzA2XCI6Ojogd2hpdGVib2FyZCBbXHU2ODA3XHU5ODk4XVwiIFx1NjZGRlx1NjM2Mlx1NEUzQVtcdTY4MDdcdTk4OThdXHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlSHRtbCA9IHRpdGxlID8gYDxoMyBjbGFzcz1cIndoaXRlYm9hcmQtdGl0bGVcIj4ke3RpdGxlfTwvaDM+YCA6ICcnXHJcbiAgICAgICAgICAgIC8vIFx1NkUzMlx1NjdEMyBDU1MgXHU1QkY5XHU1RTk0XHU3Njg0IEhUTUwgXHU3RUQzXHU2Nzg0XHVGRjFBd2hpdGVib2FyZCBcdTVCQjlcdTU2NjggKyB3aGl0ZWJvYXJkLWNvbnRlbnQgXHU1MTg1XHU1QkI5XHU1QkI5XHU1NjY4XHJcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIndoaXRlYm9hcmRcIj48ZGl2IGNsYXNzPVwid2hpdGVib2FyZC1jb250ZW50XCI+JHt0aXRsZUh0bWx9YFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gXHU5NUVEXHU1NDA4XHU1QkI5XHU1NjY4XHJcbiAgICAgICAgICByZXR1cm4gJzwvZGl2PjwvZGl2PidcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBcdTZDRThcdTUxOEMgRkFRIFx1ODFFQVx1NUI5QVx1NEU0OVx1NUJCOVx1NTY2OFxyXG4gICAgICBtZC51c2UobWFya2Rvd25JdENvbnRhaW5lciwgJ2ZhcScsIHtcclxuICAgICAgICByZW5kZXI6ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxyXG4gICAgICAgICAgLy8gXHU1MzM5XHU5MTREXHU1QkI5XHU1NjY4XHU1RjAwXHU1OUNCXHU2ODA3XHU4QkIwXHVGRjA4Ojo6IGZhcSBcdTY4MDdcdTk4OThcdUZGMDlcclxuICAgICAgICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAxKSB7XHJcbiAgICAgICAgICAgIC8vIDEuIFx1NjNEMFx1NTNENlx1ODFFQVx1NUI5QVx1NEU0OVx1NjgwN1x1OTg5OFx1RkYwOFx1NjUyRlx1NjMwMSBcIjo6OiBmYXEgXHU2ODA3XHU5ODk4XCIgXHU2MjE2IFwiOjo6IGZhcSBhY3RpdmUgXHU2ODA3XHU5ODk4XCIgXHU4QkVEXHU2Q0Q1XHVGRjBDYWN0aXZlXHU4ODY4XHU3OTNBXHU1MjFEXHU1OUNCXHU1QzU1XHU1RjAwXHVGRjA5XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0b2tlbi5pbmZvLnRyaW0oKVxyXG4gICAgICAgICAgICAvLyBcdTUyMDZcdTc5QkIgXCJhY3RpdmVcIiBcdTY4MDdcdThCQjBcdTU0OENcdTY4MDdcdTk4OThcdUZGMDhcdTUzRUZcdTkwMDlcdUZGMUFcdTY1MkZcdTYzMDFcdTUyMURcdTU5Q0JcdTVDNTVcdTVGMDBcdUZGMDlcclxuICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBpbmZvLmluY2x1ZGVzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGluZm8ucmVwbGFjZSgvXmZhcVxccyooYWN0aXZlKT9cXHMqLywgJycpLnRyaW0oKSB8fCAnXHU1RTM4XHU4OUMxXHU5NUVFXHU5ODk4JyAvLyBcdTY1RTBcdTY4MDdcdTk4OThcdTY1RjZcdTlFRDhcdThCQTRcdTY2M0VcdTc5M0FcIlx1NUUzOFx1ODlDMVx1OTVFRVx1OTg5OFwiIFxyXG4gICAgICAgICAgICAvLyAyLiBcdTYyRkNcdTYzQTUgRkFRIFx1OTc2Mlx1Njc3Rlx1NzY4NFx1NUYwMFx1NTlDQiBIVE1MXHVGRjA4XHU1NDhDXHU1MzlGXHU2NzA5XHU3RUQzXHU2Nzg0XHU1QjhDXHU1MTY4XHU0RTAwXHU4MUY0XHVGRjA5XHJcbiAgICAgICAgICAgIC8vIFx1NTIxRFx1NTlDQlx1NUM1NVx1NUYwMFx1NTIxOVx1NkRGQlx1NTJBMCBhY3RpdmUgXHU3QzdCXHVGRjBDXHU1NDI2XHU1MjE5XHU0RTBEXHU2REZCXHU1MkEwXHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gaXNBY3RpdmUgPyAnYWN0aXZlJyA6ICcnXHJcbiAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZhcSAke2FjdGl2ZUNsYXNzfVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwiZmFxLXRpdGxlXCI+JHt0aXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZhcS10ZXh0XCI+YCAvLyBcdTZDRThcdTYxMEZcdUZGMUFmYXEtdGV4dCBcdTUzMDVcdTg4RjlcdTVCQjlcdTU2NjhcdTUxODVcdTc2ODRcdTUxODVcdTVCQjlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIDMuIFx1NTMzOVx1OTE0RFx1NUJCOVx1NTY2OFx1N0VEM1x1Njc1Rlx1NjgwN1x1OEJCMFx1RkYwODo6Olx1RkYwOVx1RkYwQ1x1OTVFRFx1NTQwOCBIVE1MIFx1N0VEM1x1Njc4NFxyXG4gICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZmFxLXRvZ2dsZVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hldnJvbi1kb3duXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBcdTZDRThcdTUxOEMgZGV0YWlsczogXHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHVGRjBDXHU2RTMyXHU2N0QzXHU0RTNBIFNtb290aERldGFpbHMgXHU3RUM0XHU0RUY2XHJcbiAgICAgIG1kLnVzZShtYXJrZG93bkl0Q29udGFpbmVyLCAnZGV0YWlsczonLCB7XHJcbiAgICAgICAgcmVuZGVyOiAodG9rZW5zLCBpZHgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cclxuICAgICAgICAgIGlmICh0b2tlbi5uZXN0aW5nID09PSAxKSB7XHJcbiAgICAgICAgICAgIC8vIFx1NjNEMFx1NTNENlx1NjgwN1x1OTg5OFxyXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRva2VuLmluZm8udHJpbSgpLnJlcGxhY2UoL15kZXRhaWxzOlxccyovLCAnJykudHJpbSgpIHx8ICdcdTcwQjlcdTUxRkJcdTVDNTVcdTVGMDAnXHJcbiAgICAgICAgICAgIHJldHVybiBgPFNtb290aERldGFpbHM+PHRlbXBsYXRlICN0aXRsZT4ke3RpdGxlfTwvdGVtcGxhdGU+YFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGA8L1Ntb290aERldGFpbHM+YFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgfSxcclxuICBcclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZ3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnc1xcXFxuYXYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3FpbmQvRGVza3RvcC9GQVFfZG9jcy93ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlncy9uYXYudHNcIjtpbXBvcnQgdHlwZSB7IERlZmF1bHRUaGVtZSB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBuYXY6IERlZmF1bHRUaGVtZS5Db25maWdbXCJuYXZcIl0gPSBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTk5Nlx1OTg3NScsIGxpbms6ICcvJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVCNjZcdTRFNjAnLCBcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4MkYxXHU4QkVEJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTE5OVx1NEY1QycsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC93cml0aW5nL0NoYW5nZVlvdXJMaWZlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTZDNDcnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0EnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OTU3Rlx1OTZCRVx1NTNFNScsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC9zZW50ZW5jZS8yLTMnfSwgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjU3MFx1NUI2NicsIGxpbms6ICcjJyB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTk2OEZcdTdCMTQnLFxyXG4gICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCRDdcdThCQ0QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY1RTBcdTgyQjEnLCBsaW5rOiAnL2Vzc2F5cy9wb2V0cnkvXHU2NUUwXHU4MkIxJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdBN0FcdTU0Q0QnLCBsaW5rOiAnL2Vzc2F5cy9wb2V0cnkvXHU3QTdBXHU1NENEJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQzlcdTg4NzdcdTYwQzUnLCBsaW5rOiAnL2Vzc2F5cy9jaS9cdThCQzlcdTg4NzdcdTYwQzVcdTAwQjdcdTc3M0NcdTZCMzJcdTdBN0YnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTE3M1x1NEU4RScsXHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0Y1MVx1N0FEOVx1OEJCRVx1OEJBMScsIGxpbms6ICcvb3RoZXJzL2Fib3V0L2Fib3V0c3R5bGUvJyB9LFxyXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdGNTFcdTdBRDlcdTVFRkFcdThCQkUnLCBsaW5rOiAnL290aGVycy9hYm91dC9hYm91dHZpdGVwcmVzcy8nIH0sXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTE3Nlx1NEVENicsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTVGNTJcdTY4NjMnLCBsaW5rOiAnL290aGVycy9hcmNoaXZlLycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFJywgbGluazogJy9vdGhlcnMvdGFncy8nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBhY3RpdmVNYXRjaDogJy9vdGhlcnMvYWJvdXQvJ1xyXG4gICAgICB9LFxyXG5dOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZ3NcXFxcc2lkZWJhci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcWluZC9EZXNrdG9wL0ZBUV9kb2NzL3dlYnNpdGUvLnZpdGVwcmVzcy9jb25maWdzL3NpZGViYXIudHNcIjtpbXBvcnQgdHlwZSB7IERlZmF1bHRUaGVtZSB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBzaWRlYmFyOiBEZWZhdWx0VGhlbWUuQ29uZmlnW1wic2lkZWJhclwiXSA9IHtcclxuICAgICcvb3RoZXJzLyc6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTUxNzNcdTRFOEUnLCBcclxuICAgICAgICAgICAgLy8gY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgaXRlbXM6W1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3RjUxXHU3QUQ5XHU4QkJFXHU4QkExJywgbGluazogJy9vdGhlcnMvYWJvdXQvYWJvdXRzdHlsZScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0Y1MVx1N0FEOVx1NUVGQVx1OEJCRScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdWaXRlUHJlc3MgXHU0RUNCXHU3RUNEJywgbGluazogJy9vdGhlcnMvYWJvdXQvYWJvdXR2aXRlcHJlc3MnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0dpdCBcdTYyNThcdTdCQTEnLCBsaW5rOiAnL290aGVycy9hYm91dC9HaXQnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1NTSCBcdTRGMjBcdThGOTMnLCBsaW5rOiAnL290aGVycy9hYm91dC9TU0gnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxyXG4gICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1RjUyXHU2ODYzJywgbGluazogJy9vdGhlcnMvYXJjaGl2ZScgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjgwN1x1N0I3RScsIGxpbms6ICcvb3RoZXJzL3RhZ3MnIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgJy9lc3NheXMvJzogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1OTY4Rlx1N0IxNCcsXHJcbiAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCRDcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjVFMFx1ODJCMScsIGxpbms6ICcvZXNzYXlzL3BvZXRyeS9cdTY1RTBcdTgyQjEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0E3QVx1NTRDRCcsIGxpbms6ICcvZXNzYXlzL3BvZXRyeS9cdTdBN0FcdTU0Q0QnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkM5XHU4ODc3XHU2MEM1XHUwMEI3XHU3NzNDXHU2QjMyXHU3QTdGJywgbGluazogJy9lc3NheXMvY2kvXHU4QkM5XHU4ODc3XHU2MEM1XHUwMEI3XHU3NzNDXHU2QjMyXHU3QTdGJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgJy9zdHVkeS8nOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU1QjY2XHU0RTYwJyxcclxuICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1ODJGMVx1OEJFRCcsIFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTE5OVx1NEY1QycsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC93cml0aW5nL0NoYW5nZVlvdXJMaWZlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTZDNDcnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1N0ZBXHU3ODQwXHU4QkNEXHU2QzQ3XHU1MTY4XHU4RDJGXHU5MDFBJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTI0RFx1N0YwMCcsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvcHJlZml4JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEEnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0EnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgQicsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvQicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBDJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9DJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEQnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0QnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdThCQ0RcdTY4MzkgRScsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L2Jhc2ljX3ZvY2FidWxhcnkvRScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJDRFx1NjgzOSBGJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3ZvY2FidWxhcnkvYmFzaWNfdm9jYWJ1bGFyeS9GJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkNEXHU2ODM5IEcnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvdm9jYWJ1bGFyeS9iYXNpY192b2NhYnVsYXJ5L0cnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdPeGZvcmQgMzAwMCcsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC92b2NhYnVsYXJ5L294Zm9yZF8zMDAwJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTk1N0ZcdTk2QkVcdTUzRTUnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDMnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi0zJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDQnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi00JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDUnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi01JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDYnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi02JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDcnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi03JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDgnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi04JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMDknLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi05JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJzIwMjYuMDIuMTAnLCBsaW5rOiAnL3N0dWR5L2VuZ2xpc2gvc2VudGVuY2UvMi0xMCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcyMDI2LjAyLjExJywgbGluazogJy9zdHVkeS9lbmdsaXNoL3NlbnRlbmNlLzItMTEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnMjAyNi4wMi4xMicsIGxpbms6ICcvc3R1ZHkvZW5nbGlzaC9zZW50ZW5jZS8yLTEyJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICBdXHJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXFxcXGhlYWQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3FpbmQvRGVza3RvcC9GQVFfZG9jcy93ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlncy9oZWFkLnRzXCI7aW1wb3J0IHR5cGUgeyBIZWFkQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuXG5leHBvcnQgY29uc3QgaGVhZDogSGVhZENvbmZpZ1tdID0gW1xuICAgIC8vIFx1OTE0RFx1N0Y2RVx1N0Y1MVx1OTg3NVx1NTZGRVx1NjgwN1xuICAgIFsnbGluaycsIHsgcmVsOiAnaWNvbicsIHR5cGU6ICdpbWFnZS94LWljb24nLCBocmVmOiAnL2ltZy9xaW5kX2ljby5zdmcnIH1dLFxuICAgIC8vIFx1NUYxNVx1NTE2NUZvbnQgQXdlc29tZVx1NTZGRVx1NjgwN1x1NUU5M1xuICAgIFsnbGluaycsIHsgcmVsOiAnc3R5bGVzaGVldCcsIGhyZWY6ICdodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9mb250LWF3ZXNvbWUvNS4xNS4xL2Nzcy9hbGwubWluLmNzcycsIGludGVncml0eTogJ3NoYTUxMi0rNHpDSzlrK3FORlVSNVgrY0tMOUVJUitaT2h0SWxvTmw5R0lLUzU3VjFNeU5zWXBZY1VyVWVRYzl2TmZ6c1dmVjI4SWFMTDNpOTZQOXNkTnllUnNzQT09JywgY3Jvc3NvcmlnaW46ICdhbm9ueW1vdXMnIH1dLFxuICAgIC8vIFx1NUYxNVx1NTE2NVx1NTkxNlx1OTBFOFx1ODExQVx1NjcyQ1x1NjU4N1x1NEVGNlxuICAgIFsnc2NyaXB0JywgeyBzcmM6ICcvanMvZWFybHktaW5pdC5qcycgfV0sXG4gICAgWydzY3JpcHQnLCB7IHNyYzogJy9qcy9pbWFnZS1wcm90ZWN0aW9uLmpzJyB9XSxcblxuICAgIFsnbWV0YScsIHsgbmFtZTogJ2Rlc2NyaXB0aW9uJywgY29udGVudDogJ1x1OEZEOVx1NjYyRlx1NzQzNFx1NkJCRlx1NzY4NFx1NEUyQVx1NEVCQVx1N0IxNFx1OEJCMFx1N0Y1MVx1N0FEOScgfV0sXG4gICAgWydtZXRhJywgeyBuYW1lOiAna2V5d29yZHMnLCBjb250ZW50OiAnXHU3NDM0XHU2QkJGLCBxaW5kbHV0ZSwgcWluZCwgXHU1MzVBXHU1QkEyLCBWaXRlcHJlc3MsIFx1NUI2Nlx1NEU2MFx1N0IxNFx1OEJCMCwgXHU0RTJBXHU0RUJBXHU3RjUxXHU3QUQ5JyB9XSxcbiAgICBbJ21ldGEnLCB7IG5hbWU6ICdhdXRob3InLCBjb250ZW50OiAncWluZGx1dGUnIH1dLFxuXSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxjb25maWdzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxaW5kXFxcXERlc2t0b3BcXFxcRkFRX2RvY3NcXFxcd2Vic2l0ZVxcXFwudml0ZXByZXNzXFxcXGNvbmZpZ3NcXFxcY3VzdG9tSWNvbnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3FpbmQvRGVza3RvcC9GQVFfZG9jcy93ZWJzaXRlLy52aXRlcHJlc3MvY29uZmlncy9jdXN0b21JY29ucy50c1wiOy8vIFx1ODFFQVx1NUI5QVx1NEU0OVx1NTZGRVx1NjgwN1x1OTE0RFx1N0Y2RVxyXG4vLyBcdTc1MjhcdTRFOEV2aXRlcHJlc3MtcGx1Z2luLWdyb3VwLWljb25zXHU2M0QyXHU0RUY2XHJcblxyXG4vLyBcdTkxNERcdTdGNkVcdTU2RkVcdTY4MDdcdTUzQzJcdTgwMDNcdTY1ODdcdTY4NjNcdUZGMUFodHRwczovL2dpdGh1Yi5jb20veXV5aW53cy92aXRlcHJlc3MtcGx1Z2luLWdyb3VwLWljb25zXHJcblxyXG5pbXBvcnQgeyBncm91cEljb25WaXRlUGx1Z2luIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1ncm91cC1pY29ucydcclxuXHJcbmV4cG9ydCBjb25zdCBjdXN0b21JY29uOiBncm91cEljb25WaXRlUGx1Z2luLk9wdGlvbnNbJ2N1c3RvbUljb24nXSA9IHtcclxuLy8gZXhwb3J0IGNvbnN0IGN1c3RvbUljb24gPSB7XHJcbiAgbXRzOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtdHlwZXNjcmlwdFwiLFxyXG4gIGN0czogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLXR5cGVzY3JpcHRcIixcclxuICB0czogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLXR5cGVzY3JpcHRcIixcclxuICB0c3g6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS10eXBlc2NyaXB0XCIsXHJcbiAgbWpzOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtanNcIixcclxuICBjanM6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1qc1wiLFxyXG4gIGpzb246IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1qc29uXCIsXHJcbiAganM6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1qc1wiLFxyXG4gIGpzeDogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLWpzXCIsXHJcbiAgbWQ6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1tYXJrZG93blwiLFxyXG4gIHB5OiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtcHl0aG9uXCIsXHJcbiAgaWNvOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtZmF2aWNvblwiLFxyXG4gIGh0bWw6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1odG1sXCIsXHJcbiAgY3NzOiBcInZzY29kZS1pY29uczpmaWxlLXR5cGUtY3NzXCIsXHJcbiAgc2NzczogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLXNjc3NcIixcclxuICB5bWw6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1saWdodC15YW1sXCIsXHJcbiAgeWFtbDogXCJ2c2NvZGUtaWNvbnM6ZmlsZS10eXBlLWxpZ2h0LXlhbWxcIixcclxuICBwaHA6IFwidnNjb2RlLWljb25zOmZpbGUtdHlwZS1waHBcIixcclxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccWluZFxcXFxEZXNrdG9wXFxcXEZBUV9kb2NzXFxcXHdlYnNpdGVcXFxcLnZpdGVwcmVzc1xcXFxwbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHFpbmRcXFxcRGVza3RvcFxcXFxGQVFfZG9jc1xcXFx3ZWJzaXRlXFxcXC52aXRlcHJlc3NcXFxccGx1Z2luXFxcXG1hcmtkb3duVHJhbnNmb3JtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9xaW5kL0Rlc2t0b3AvRkFRX2RvY3Mvd2Vic2l0ZS8udml0ZXByZXNzL3BsdWdpbi9tYXJrZG93blRyYW5zZm9ybS50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBNYXJrZG93blRyYW5zZm9ybSgpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnbWQtbGluay10cmFuc2Zvcm0nLFxyXG4gICAgZW5mb3JjZTogJ3ByZScsXHJcbiAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcclxuICAgICAgaWYgKCFpZC5lbmRzV2l0aCgnLm1kJykpIHJldHVybiBudWxsXHJcbiAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykgfHwgaWQuaW5jbHVkZXMoJy52aXRlcHJlc3MvY29uZmlnJykpIFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgICAvLyBcdTUxNDhcdTU5MDRcdTc0MDZcdTU2RkVcdTcyNDdcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvIVxcWyguKj8pXFxdXFwoKC4qPylcXCkvZywgKG1hdGNoLCB0ZXh0LCBzcmMpID0+IHtcclxuICAgICAgICByZXR1cm4gc3JjLnN0YXJ0c1dpdGgoJ2h0dHAnKSBcclxuICAgICAgICAgID8gYDxpbWcgc3JjPVwiJHtzcmN9XCIgYWx0PVwiJHt0ZXh0IHx8ICdpbWFnZSd9XCIgLz5gXHJcbiAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBcdTUxOERcdTU5MDRcdTc0MDZcdTk0RkVcdTYzQTVcclxuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvXFxbKC4qPylcXF1cXCgoaHR0cHM/OlxcL1xcL1teXFxzKV0rKSg/OlxccytcIiguKj8pXCIpP1xcKS9nLCBcclxuICAgICAgICAobWF0Y2gsIHRleHQsIGhyZWYsIHRpdGxlKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGl0bGUgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICA/IGA8Q3VzdG9tTGluayB0aXRsZT1cIiR7dGV4dH1cIiBocmVmPVwiJHtocmVmfVwiIC8+YFxyXG4gICAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcblxyXG4gICAgICAvLyBcdTVDMDYgPjogXHU4RjZDXHU2MzYyXHU0RTNBXHU4MUVBXHU1QjlBXHU0RTQ5IEhUTUxcdUZGMDhcdTY1MkZcdTYzMDFcdThGREVcdTdFRUQgPjogXHU1NDA4XHU1RTc2XHU0RTNBXHU0RTAwXHU0RTJBXHU1QkI5XHU1NjY4XHVGRjA5XHJcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NTdGQVx1NEU4RVx1ODg0Q1x1NzY4NFx1NTkwNFx1NzQwNlx1NjVCOVx1NkNENVxyXG4gICAgICBjb25zdCBsaW5lcyA9IGNvZGUuc3BsaXQoJ1xcbicpO1xyXG4gICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgIGxldCBpblF1b3RlID0gZmFsc2U7XHJcbiAgICAgIGxldCBxdW90ZUNvbnRlbnQgPSBbXTtcclxuICAgICAgXHJcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICAgIGlmIChsaW5lLm1hdGNoKC9ePlxccyo6XFxzKi8pKSB7XHJcbiAgICAgICAgICAvLyBcdTkwNDdcdTUyMzAgPjogXHU1RjAwXHU1OTM0XHU3Njg0XHU4ODRDXHJcbiAgICAgICAgICBpZiAoIWluUXVvdGUpIHtcclxuICAgICAgICAgICAgLy8gXHU1RjAwXHU1OUNCXHU2NUIwXHU3Njg0XHU1RjE1XHU3NTI4XHU1QkI5XHU1NjY4XHJcbiAgICAgICAgICAgIGluUXVvdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBxdW90ZUNvbnRlbnQgPSBbXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIFx1NkUwNVx1NzQwNiA+OiBcdTVFNzZcdTZERkJcdTUyQTBcdTUyMzBcdTUxODVcdTVCQjlcdTRFMkRcclxuICAgICAgICAgIHF1b3RlQ29udGVudC5wdXNoKGxpbmUucmVwbGFjZSgvXj5cXHMqOlxccyovLCAnJykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBcdTkwNDdcdTUyMzBcdTk3NUUgPjogXHU1RjAwXHU1OTM0XHU3Njg0XHU4ODRDXHJcbiAgICAgICAgICBpZiAoaW5RdW90ZSkge1xyXG4gICAgICAgICAgICAvLyBcdTdFRDNcdTY3NUZcdTVGNTNcdTUyNERcdTVGMTVcdTc1MjhcdTVCQjlcdTU2NjhcclxuICAgICAgICAgICAgaW5RdW90ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zdCBjbGVhbmVkQ29udGVudCA9IHF1b3RlQ29udGVudC5maWx0ZXIobGluZSA9PiBsaW5lLnRyaW0oKSAhPT0gJycpLmpvaW4oJ1xcbicpO1xyXG4gICAgICAgICAgICBpZiAoY2xlYW5lZENvbnRlbnQpIHtcclxuICAgICAgICAgICAgICByZXN1bHQgKz0gYDxibG9ja3F1b3RlIGNsYXNzPVwidnAtcXVvdGUtc3BlY2lhbFwiPlxcblxcbiR7Y2xlYW5lZENvbnRlbnR9XFxuXFxuPC9ibG9ja3F1b3RlPlxcbmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIFx1NkRGQlx1NTJBMFx1NjY2RVx1OTAxQVx1ODg0Q1xyXG4gICAgICAgICAgcmVzdWx0ICs9IGxpbmUgKyAnXFxuJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTkwNFx1NzQwNlx1NjU4N1x1NEVGNlx1NjcyQlx1NUMzRVx1NzY4NFx1NUYxNVx1NzUyOFx1NUJCOVx1NTY2OFxyXG4gICAgICBpZiAoaW5RdW90ZSkge1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWRDb250ZW50ID0gcXVvdGVDb250ZW50LmZpbHRlcihsaW5lID0+IGxpbmUudHJpbSgpICE9PSAnJykuam9pbignXFxuJyk7XHJcbiAgICAgICAgaWYgKGNsZWFuZWRDb250ZW50KSB7XHJcbiAgICAgICAgICByZXN1bHQgKz0gYDxibG9ja3F1b3RlIGNsYXNzPVwidnAtcXVvdGUtc3BlY2lhbFwiPlxcblxcbiR7Y2xlYW5lZENvbnRlbnR9XFxuXFxuPC9ibG9ja3F1b3RlPlxcbmA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBjb2RlID0gcmVzdWx0O1xyXG5cclxuICAgICAgLy8gXHU1OTA0XHU3NDA2XHU4QkNEXHU2MDI3XHU5QUQ4XHU0RUFFIChuLiB2LiBhZGouIGFkLilcclxuICAgICAgLy8gXHU0RjdGXHU3NTI4IG1hcmtlci5jc3MgXHU0RTJEXHU1QjlBXHU0RTQ5XHU3Njg0XHU5ODlDXHU4MjcyXHVGRjBDXHU0RkREXHU2MzAxXHU5ODlDXHU4MjcyXHU5OENFXHU2ODNDXHU0RTAwXHU4MUY0XHJcbiAgICAgIGNvbnN0IHBvc01hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcclxuICAgICAgICAnbi4nOiAncmdiYSgyNTEsIDE0NiwgNjApJywgLy8gXHU2QTU5XHU4MjcyXHJcbiAgICAgICAgJ3YuJzogJ3JnYmEoMjM5LCA2OCwgNjgpJywgLy8gXHU3RUEyXHU4MjcyXHJcbiAgICAgICAgJ2Fkai4nOiAncmdiYSg1OSwgMTMwLCAyNDYpJywgLy8gXHU4NEREXHU4MjcyXHJcbiAgICAgICAgJ2FkLic6ICdyZ2JhKDE2OCwgODUsIDI0NyknLCAvLyBcdTdEMkJcdTgyNzJcclxuICAgICAgICAncHJlcC4nOiAncmdiYSgxNTIsIDI1MSwgMTUyKScsIC8vIFx1ODU4NFx1ODM3N1x1N0VGRlxyXG4gICAgICAgICdjb25qLic6ICdyZ2JhKDAsIDI1NSwgMjU1KScgLy8gXHU5NzUyXHU4MjcyXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NkI2M1x1NTIxOVx1NTMzOVx1OTE0RFx1NzJFQ1x1N0FDQlx1NTFGQVx1NzNCMFx1NzY4NFx1OEJDRFx1NjAyN1x1N0YyOVx1NTE5OVxyXG4gICAgICAvLyBcXGIgXHU3ODZFXHU0RkREXHU1MzM5XHU5MTREXHU1MzU1XHU4QkNEXHU4RkI5XHU3NTRDXHVGRjBDXHU5NjMyXHU2QjYyXHU4QkVGXHU0RjI0XHJcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1xcYihuXFwufHZcXC58YWRqXFwufGFkXFwufHByZXBcXC58Y29ualxcLikoPz1cXHN8JHxbXmEtekEtWl0pL2csIChtYXRjaCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gcG9zTWFwW21hdGNoXTtcclxuICAgICAgICByZXR1cm4gYCZuYnNwOzxzcGFuIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9O1wiPiR7bWF0Y2h9PC9zcGFuPmA7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGNvZGVcclxuICAgIH1cclxuICB9XHJcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlO0FBR3hCLE9BQU8seUJBQXlCO0FBRWhDLFNBQVMsbUJBQW1CLDJCQUE0QztBQUV4RSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsV0FBVyxhQUFhLHlCQUF5Qjs7O0FDWG5ELElBQU0sTUFBa0M7QUFBQSxFQUN6QyxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxJQUFJO0FBQUEsRUFDeEI7QUFBQSxJQUFFLE1BQU07QUFBQSxJQUNGLE9BQU87QUFBQSxNQUNEO0FBQUEsUUFBRSxNQUFNO0FBQUEsUUFDRixPQUFPO0FBQUEsVUFDRCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSx3Q0FBd0M7QUFBQSxVQUM1RCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSwrQ0FBK0M7QUFBQSxVQUNuRSxFQUFFLE1BQU0sc0JBQU8sTUFBTSw4QkFBNkI7QUFBQSxRQUN4RDtBQUFBLE1BQ047QUFBQSxNQUNBLEVBQUUsTUFBTSxnQkFBTSxNQUFNLElBQUk7QUFBQSxJQUM5QjtBQUFBLEVBQ0w7QUFBQSxFQUNEO0FBQUEsSUFBRSxNQUFNO0FBQUEsSUFDRixPQUFPO0FBQUEsTUFDRDtBQUFBLFFBQUUsTUFBTTtBQUFBLFFBQ0YsT0FBTztBQUFBLFVBQ0QsRUFBRSxNQUFNLGdCQUFNLE1BQU0sOEJBQW9CO0FBQUEsVUFDeEMsRUFBRSxNQUFNLGdCQUFNLE1BQU0sOEJBQW9CO0FBQUEsVUFDeEMsRUFBRSxNQUFNLHNCQUFPLE1BQU0sc0RBQXFCO0FBQUEsUUFDaEQ7QUFBQSxNQUNMO0FBQUEsSUFDUDtBQUFBLEVBQ0w7QUFBQSxFQUNEO0FBQUEsSUFBRSxNQUFNO0FBQUEsSUFDRixPQUFPO0FBQUEsTUFDRCxFQUFFLE1BQU0sNEJBQVEsTUFBTSw0QkFBNEI7QUFBQSxNQUNsRCxFQUFFLE1BQU0sNEJBQVEsTUFBTSxnQ0FBZ0M7QUFBQSxNQUN0RDtBQUFBLFFBQUUsTUFBTTtBQUFBLFFBQ0YsT0FBTztBQUFBLFVBQ0QsRUFBRSxNQUFNLGdCQUFNLE1BQU0sbUJBQW1CO0FBQUEsVUFDdkMsRUFBRSxNQUFNLGdCQUFNLE1BQU0sZ0JBQWdCO0FBQUEsUUFDMUM7QUFBQSxNQUNOO0FBQUEsSUFDTjtBQUFBLElBQ0EsYUFBYTtBQUFBLEVBQ25CO0FBQ047OztBQ3RDTyxJQUFNLFVBQTBDO0FBQUEsRUFDbkQsWUFBWTtBQUFBLElBQ1I7QUFBQSxNQUFFLE1BQU07QUFBQTtBQUFBLE1BRUosT0FBTTtBQUFBLFFBQ0YsRUFBRSxNQUFNLDRCQUFRLE1BQU0sMkJBQTJCO0FBQUEsUUFDakQ7QUFBQSxVQUFFLE1BQU07QUFBQSxVQUNKLFdBQVc7QUFBQSxVQUNYLE9BQU87QUFBQSxZQUNILEVBQUUsTUFBTSwwQkFBZ0IsTUFBTSwrQkFBK0I7QUFBQSxZQUM3RCxFQUFFLE1BQU0sb0JBQVUsTUFBTSxvQkFBb0I7QUFBQSxZQUM1QyxFQUFFLE1BQU0sb0JBQVUsTUFBTSxvQkFBb0I7QUFBQSxVQUNoRDtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUFFLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNILEVBQUUsTUFBTSxnQkFBTSxNQUFNLGtCQUFrQjtBQUFBLFFBQ3RDLEVBQUUsTUFBTSxnQkFBTSxNQUFNLGVBQWU7QUFBQSxNQUN2QztBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxZQUFZO0FBQUEsSUFDUjtBQUFBLE1BQUUsTUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0g7QUFBQSxVQUFFLE1BQU07QUFBQSxVQUNKLE9BQU87QUFBQSxZQUNILEVBQUUsTUFBTSxnQkFBTSxNQUFNLDhCQUFvQjtBQUFBLFlBQ3hDLEVBQUUsTUFBTSxnQkFBTSxNQUFNLDhCQUFvQjtBQUFBLFVBQzVDO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUFFLE1BQU07QUFBQSxVQUNKLE9BQU87QUFBQSxZQUNILEVBQUUsTUFBTSw0Q0FBVyxNQUFNLHNEQUFxQjtBQUFBLFVBQ2xEO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsV0FBVztBQUFBLElBQ1A7QUFBQSxNQUFFLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNIO0FBQUEsVUFBRSxNQUFNO0FBQUEsVUFDSixPQUFPO0FBQUEsWUFDSCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSx3Q0FBd0M7QUFBQSxZQUM1RDtBQUFBLGNBQUUsTUFBTTtBQUFBLGNBQ0osT0FBTztBQUFBLGdCQUNIO0FBQUEsa0JBQUUsTUFBTTtBQUFBLGtCQUNKLFdBQVc7QUFBQSxrQkFDWCxPQUFPO0FBQUEsb0JBQ0gsRUFBRSxNQUFNLGdCQUFNLE1BQU0sb0RBQW9EO0FBQUEsb0JBQ3hFLEVBQUUsTUFBTSxrQkFBUSxNQUFNLCtDQUErQztBQUFBLG9CQUNyRSxFQUFFLE1BQU0sa0JBQVEsTUFBTSwrQ0FBK0M7QUFBQSxvQkFDckUsRUFBRSxNQUFNLGtCQUFRLE1BQU0sK0NBQStDO0FBQUEsb0JBQ3JFLEVBQUUsTUFBTSxrQkFBUSxNQUFNLCtDQUErQztBQUFBLG9CQUNyRSxFQUFFLE1BQU0sa0JBQVEsTUFBTSwrQ0FBK0M7QUFBQSxvQkFDckUsRUFBRSxNQUFNLGtCQUFRLE1BQU0sK0NBQStDO0FBQUEsb0JBQ3JFLEVBQUUsTUFBTSxrQkFBUSxNQUFNLCtDQUErQztBQUFBLGtCQUN6RTtBQUFBLGdCQUNKO0FBQUEsZ0JBQ0EsRUFBRSxNQUFNLGVBQWUsTUFBTSx3Q0FBd0M7QUFBQSxjQUN6RTtBQUFBLFlBQ0o7QUFBQSxZQUNBO0FBQUEsY0FBRSxNQUFNO0FBQUEsY0FDSixXQUFXO0FBQUEsY0FDWCxPQUFPO0FBQUEsZ0JBQ0gsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSw4QkFBOEI7QUFBQSxnQkFDMUQsRUFBRSxNQUFNLGNBQWMsTUFBTSwrQkFBK0I7QUFBQSxnQkFDM0QsRUFBRSxNQUFNLGNBQWMsTUFBTSwrQkFBK0I7QUFBQSxnQkFDM0QsRUFBRSxNQUFNLGNBQWMsTUFBTSwrQkFBK0I7QUFBQSxjQUMvRDtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKOzs7QUNwRk8sSUFBTSxPQUFxQjtBQUFBO0FBQUEsRUFFOUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxRQUFRLE1BQU0sZ0JBQWdCLE1BQU0sb0JBQW9CLENBQUM7QUFBQTtBQUFBLEVBRXpFLENBQUMsUUFBUSxFQUFFLEtBQUssY0FBYyxNQUFNLDhFQUE4RSxXQUFXLG1HQUFtRyxhQUFhLFlBQVksQ0FBQztBQUFBO0FBQUEsRUFFMVAsQ0FBQyxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUFBLEVBQ3ZDLENBQUMsVUFBVSxFQUFFLEtBQUssMEJBQTBCLENBQUM7QUFBQSxFQUU3QyxDQUFDLFFBQVEsRUFBRSxNQUFNLGVBQWUsU0FBUyxxRUFBYyxDQUFDO0FBQUEsRUFDeEQsQ0FBQyxRQUFRLEVBQUUsTUFBTSxZQUFZLFNBQVMsNEdBQWdELENBQUM7QUFBQSxFQUN2RixDQUFDLFFBQVEsRUFBRSxNQUFNLFVBQVUsU0FBUyxXQUFXLENBQUM7QUFDcEQ7OztBQ1BPLElBQU0sYUFBd0Q7QUFBQTtBQUFBLEVBRW5FLEtBQUs7QUFBQSxFQUNMLEtBQUs7QUFBQSxFQUNMLElBQUk7QUFBQSxFQUNKLEtBQUs7QUFBQSxFQUNMLEtBQUs7QUFBQSxFQUNMLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLElBQUk7QUFBQSxFQUNKLEtBQUs7QUFBQSxFQUNMLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFBQSxFQUNMLE1BQU07QUFBQSxFQUNOLEtBQUs7QUFDUDs7O0FDekJPLFNBQVMsb0JBQTRCO0FBQzFDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUNULFVBQVUsTUFBTSxJQUFJO0FBQ2xCLFVBQUksQ0FBQyxHQUFHLFNBQVMsS0FBSyxFQUFHLFFBQU87QUFDaEMsVUFBSSxHQUFHLFNBQVMsY0FBYyxLQUFLLEdBQUcsU0FBUyxtQkFBbUI7QUFDaEUsZUFBTztBQUdULGFBQU8sS0FBSyxRQUFRLHdCQUF3QixDQUFDLE9BQU8sTUFBTSxRQUFRO0FBQ2hFLGVBQU8sSUFBSSxXQUFXLE1BQU0sSUFDeEIsYUFBYSxHQUFHLFVBQVUsUUFBUSxPQUFPLFNBQ3pDO0FBQUEsTUFDTixDQUFDO0FBR0QsYUFBTyxLQUFLO0FBQUEsUUFBUTtBQUFBLFFBQ2xCLENBQUMsT0FBTyxNQUFNLE1BQU0sVUFBVTtBQUM1QixpQkFBTyxVQUFVLFNBQ2Isc0JBQXNCLElBQUksV0FBVyxJQUFJLFNBQ3pDO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFJQSxZQUFNLFFBQVEsS0FBSyxNQUFNLElBQUk7QUFDN0IsVUFBSSxTQUFTO0FBQ2IsVUFBSSxVQUFVO0FBQ2QsVUFBSSxlQUFlLENBQUM7QUFFcEIsaUJBQVcsUUFBUSxPQUFPO0FBQ3hCLFlBQUksS0FBSyxNQUFNLFdBQVcsR0FBRztBQUUzQixjQUFJLENBQUMsU0FBUztBQUVaLHNCQUFVO0FBQ1YsMkJBQWUsQ0FBQztBQUFBLFVBQ2xCO0FBRUEsdUJBQWEsS0FBSyxLQUFLLFFBQVEsYUFBYSxFQUFFLENBQUM7QUFBQSxRQUNqRCxPQUFPO0FBRUwsY0FBSSxTQUFTO0FBRVgsc0JBQVU7QUFDVixrQkFBTSxpQkFBaUIsYUFBYSxPQUFPLENBQUFBLFVBQVFBLE1BQUssS0FBSyxNQUFNLEVBQUUsRUFBRSxLQUFLLElBQUk7QUFDaEYsZ0JBQUksZ0JBQWdCO0FBQ2xCLHdCQUFVO0FBQUE7QUFBQSxFQUE0QyxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFDdEU7QUFBQSxVQUNGO0FBRUEsb0JBQVUsT0FBTztBQUFBLFFBQ25CO0FBQUEsTUFDRjtBQUdBLFVBQUksU0FBUztBQUNYLGNBQU0saUJBQWlCLGFBQWEsT0FBTyxVQUFRLEtBQUssS0FBSyxNQUFNLEVBQUUsRUFBRSxLQUFLLElBQUk7QUFDaEYsWUFBSSxnQkFBZ0I7QUFDbEIsb0JBQVU7QUFBQTtBQUFBLEVBQTRDLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUN0RTtBQUFBLE1BQ0Y7QUFFQSxhQUFPO0FBSVAsWUFBTSxTQUFpQztBQUFBLFFBQ3JDLE1BQU07QUFBQTtBQUFBLFFBQ04sTUFBTTtBQUFBO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLE9BQU87QUFBQTtBQUFBLFFBQ1AsU0FBUztBQUFBO0FBQUEsUUFDVCxTQUFTO0FBQUE7QUFBQSxNQUNYO0FBSUEsYUFBTyxLQUFLLFFBQVEsMkRBQTJELENBQUMsVUFBVTtBQUN4RixjQUFNLFFBQVEsT0FBTyxLQUFLO0FBQzFCLGVBQU8sNkJBQTZCLEtBQUssTUFBTSxLQUFLO0FBQUEsTUFDdEQsQ0FBQztBQUVELGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNGOzs7QUwxRkEsSUFBTSxtQ0FBbUM7QUFxQnpDLElBQU8saUJBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUVOLFlBQVk7QUFBQTtBQUFBLEVBR1o7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxFQUNaO0FBQUE7QUFBQSxFQUdBLGFBQWE7QUFBQTtBQUFBLElBRVgsTUFBTTtBQUFBO0FBQUEsSUFHTixXQUFXO0FBQUEsSUFFWDtBQUFBLElBRUE7QUFBQTtBQUFBLElBR0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLElBRWxCLGFBQWE7QUFBQSxNQUNYLEVBQUUsTUFBTSxVQUFVLE1BQU0sNkRBQTZEO0FBQUEsTUFDckYsRUFBRSxNQUFNLFNBQVMsTUFBTSw0QkFBNEI7QUFBQSxJQUNyRDtBQUFBO0FBQUEsSUFHQSxRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUEsTUFDVCxXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsV0FBVztBQUFBLE1BQ1QsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT0EsUUFBUTtBQUFBLE1BQ04sVUFBVTtBQUFBO0FBQUEsTUFFVixTQUFTO0FBQUEsUUFDUCxjQUFjO0FBQUEsVUFDWixRQUFRO0FBQUEsWUFDTixZQUFZO0FBQUEsWUFDWixpQkFBaUI7QUFBQSxVQUNuQjtBQUFBLFVBQ0EsT0FBTztBQUFBLFlBQ0wsZUFBZTtBQUFBLFlBQ2Ysa0JBQWtCO0FBQUEsWUFDbEIsZ0JBQWdCO0FBQUEsWUFDaEIsUUFBUTtBQUFBLGNBQ04sY0FBYztBQUFBLGNBQ2QsWUFBWTtBQUFBLGNBQ1osV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0EsWUFBWTtBQUFBLFVBQ1YsZUFBZTtBQUFBLFlBQ2IsT0FBTztBQUFBO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsWUFDUjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFFRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUE7QUFBQSxNQUVQLE9BQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxVQUNQLFVBQVU7QUFBQSxVQUNWLFlBQVk7QUFBQSxZQUNWLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSLENBQUM7QUFBQSxVQUNELGtCQUFrQjtBQUFBLFFBQ3BCO0FBQUEsTUFDRixDQUFDO0FBQUE7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULE1BQU0sUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxRQUM3QyxTQUFTLENBQUMsVUFBVSxjQUFjLE9BQU87QUFBQSxRQUN6QyxXQUFXO0FBQUEsVUFDVCxjQUFjO0FBQUEsWUFDWixpQkFBaUI7QUFBQSxVQUNuQixDQUFDO0FBQUEsUUFDSDtBQUFBLFFBQ0EsS0FBSztBQUFBLFFBQ0wsYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBO0FBQUEsTUFDRCxvQkFBb0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0YsQ0FBQztBQUFBO0FBQUEsTUFDRCxNQUFNO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixhQUFhO0FBQUEsUUFDYixjQUFjO0FBQUEsTUFDaEIsQ0FBQztBQUFBLE1BQ0Qsa0JBQWtCO0FBQUEsSUFFcEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUE7QUFBQSxRQUM1QixlQUFlLFFBQVEsa0NBQVcsWUFBWTtBQUFBO0FBQUEsUUFDOUMsZ0JBQWdCLFFBQVEsa0NBQVcsYUFBYTtBQUFBO0FBQUEsTUFDbEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxZQUFZLENBQUMsY0FBYyx3QkFBd0I7QUFBQSxJQUNyRDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxJQUNmO0FBQUEsSUFDQSxRQUFRLENBQUMsT0FBTztBQUNkLFNBQUcsSUFBSSxpQkFBaUI7QUFHeEIsU0FBRyxTQUFTLE1BQU0sZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFNBQVMsS0FBSyxRQUFRO0FBQ2xFLFlBQUksYUFBYSxJQUFJLFlBQVksUUFBUSxLQUFLLE9BQU87QUFDckQsWUFBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLEtBQU0sZUFBYztBQUM1QyxlQUFPO0FBQUEsTUFDWDtBQUdBLFNBQUcsSUFBSSxxQkFBcUIsUUFBUTtBQUFBLFFBQ2xDLFFBQVEsQ0FBQyxRQUFRLFFBQVE7QUFDdkIsZ0JBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsZ0JBQU0sT0FBTyxNQUFNLEtBQUssS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEtBQUs7QUFDN0MsaUJBQU8sTUFBTSxZQUFZLElBQ3JCLGtFQUFrRSxRQUFRLE1BQU0sV0FDaEY7QUFBQSxRQUNOO0FBQUEsTUFDRixDQUFDO0FBRUQsU0FBRyxJQUFJLHFCQUFxQixhQUFhO0FBQUEsUUFDdkMsUUFBUSxDQUFDLFFBQVEsUUFBUTtBQUN2QixnQkFBTSxRQUFRLE9BQU8sR0FBRztBQUN4QixnQkFBTSxPQUFPLE1BQU0sS0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSztBQUM5QyxpQkFBTyxNQUFNLFlBQVksSUFDckIsdUVBQXVFLFFBQVEsV0FBVyxXQUMxRjtBQUFBLFFBQ047QUFBQSxNQUNGLENBQUM7QUFFRCxTQUFHLElBQUkscUJBQXFCLFdBQVc7QUFBQSxRQUNyQyxRQUFRLENBQUMsUUFBUSxRQUFRO0FBQ3ZCLGdCQUFNLFFBQVEsT0FBTyxHQUFHO0FBQ3hCLGdCQUFNLE9BQU8sTUFBTSxLQUFLLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLO0FBQzdDLGlCQUFPLE1BQU0sWUFBWSxJQUNyQixxRUFBcUUsUUFBUSxTQUFTLFdBQ3RGO0FBQUEsUUFDTjtBQUFBLE1BQ0YsQ0FBQztBQUVELFNBQUcsSUFBSSxxQkFBcUIsY0FBYztBQUFBLFFBQ3hDLFFBQVEsQ0FBQyxRQUFRLFFBQVE7QUFDdkIsZ0JBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsY0FBSSxNQUFNLFlBQVksR0FBRztBQUV2QixrQkFBTSxRQUFRLE1BQU0sS0FBSyxLQUFLLEVBQUUsUUFBUSxrQkFBa0IsRUFBRTtBQUM1RCxrQkFBTSxZQUFZLFFBQVEsZ0NBQWdDLEtBQUssVUFBVTtBQUV6RSxtQkFBTywyREFBMkQsU0FBUztBQUFBLFVBQzdFO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRixDQUFDO0FBR0QsU0FBRyxJQUFJLHFCQUFxQixPQUFPO0FBQUEsUUFDakMsUUFBUSxDQUFDLFFBQVEsUUFBUTtBQUN2QixnQkFBTSxRQUFRLE9BQU8sR0FBRztBQUV4QixjQUFJLE1BQU0sWUFBWSxHQUFHO0FBRXZCLGtCQUFNLE9BQU8sTUFBTSxLQUFLLEtBQUs7QUFFN0Isa0JBQU0sV0FBVyxLQUFLLFNBQVMsUUFBUTtBQUN2QyxrQkFBTSxRQUFRLEtBQUssUUFBUSx1QkFBdUIsRUFBRSxFQUFFLEtBQUssS0FBSztBQUdoRSxrQkFBTSxjQUFjLFdBQVcsV0FBVztBQUMxQyxtQkFBTztBQUFBLGdDQUNhLFdBQVc7QUFBQSx3Q0FDSCxLQUFLO0FBQUE7QUFBQSxVQUVuQztBQUVBLGlCQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFPVDtBQUFBLE1BQ0YsQ0FBQztBQUdELFNBQUcsSUFBSSxxQkFBcUIsWUFBWTtBQUFBLFFBQ3RDLFFBQVEsQ0FBQyxRQUFRLFFBQVE7QUFDdkIsZ0JBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsY0FBSSxNQUFNLFlBQVksR0FBRztBQUV2QixrQkFBTSxRQUFRLE1BQU0sS0FBSyxLQUFLLEVBQUUsUUFBUSxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssS0FBSztBQUN0RSxtQkFBTyxtQ0FBbUMsS0FBSztBQUFBLFVBQ2pEO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFFSDtBQUFBLEVBQ0Y7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogWyJsaW5lIl0KfQo=
