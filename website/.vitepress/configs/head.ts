import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
    // 配置网页图标
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/img/qind_ico.svg' }],
    // 引入外部脚本文件
    ['script', { src: '/js/early-init.js' }],
    ['script', { src: '/js/image-protection.js' }],

    ['meta', { name: 'description', content: '这是琴殿的个人笔记网站' }],
    ['meta', { name: 'keywords', content: 'qindlute, 个人网站, 琴殿, 博客, 琴殿博客' }],
    ['meta', { name: 'author', content: 'qindlute' }],
]