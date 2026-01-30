import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
    // 配置网页图标
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/img/qind_ico.svg' }],
    // 引入Font Awesome图标库
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css', integrity: 'sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==', crossorigin: 'anonymous' }],
    // 引入外部脚本文件
    ['script', { src: '/js/early-init.js' }],
    ['script', { src: '/js/image-protection.js' }],

    ['meta', { name: 'description', content: '这是琴殿的个人笔记网站' }],
    ['meta', { name: 'keywords', content: '琴殿, qindlute, qind, 博客, Vitepress, 学习笔记, 个人网站' }],
    ['meta', { name: 'author', content: 'qindlute' }],
]