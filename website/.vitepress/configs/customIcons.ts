// 自定义图标配置
// 用于vitepress-plugin-group-icons插件

// 配置图标参考文档：https://github.com/yuyinws/vitepress-plugin-group-icons

import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export const customIcon: groupIconVitePlugin.Options['customIcon'] = {
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
  php: "vscode-icons:file-type-php",
}