---
title: "使用 Next.js 构建现代博客"
date: "2026-06-13"
tags: ["Next.js", "React", "前端开发"]
description: "详细介绍如何使用 Next.js 14 和 App Router 构建一个现代化的技术博客网站。"
---

# 使用 Next.js 构建现代博客

## 为什么选择 Next.js

Next.js 是 React 生态中最流行的框架之一，它提供了许多开箱即用的功能：

- **服务端渲染 (SSR)** - 提升首屏加载速度和 SEO
- **静态站点生成 (SSG)** - 构建时生成静态页面
- **App Router** - 基于文件系统的路由，更加直观
- **内置优化** - 图片优化、字体优化、脚本优化

## 项目结构

```
myblog/
├── content/posts/    # Markdown 文章目录
├── src/
│   ├── app/          # 页面组件
│   ├── lib/          # 工具函数
│   └── components/   # 可复用组件
├── public/           # 静态资源
└── package.json
```

## 核心功能实现

### 1. Markdown 文件读取

使用 Node.js 的 `fs` 模块读取 `content/posts` 目录下的所有 `.md` 文件：

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const postsData = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        ...data,
        content,
      };
    });
    
  return postsData.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
```

### 2. Markdown 渲染

使用 `remark` 和 `rehype` 插件链来处理 Markdown：

```typescript
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

const result = await unified()
  .use(remarkGfm)
  .use(remarkMath)
  .use(rehypeHighlight)
  .use(rehypeKatex)
  .use(rehypeSlug)
  .process(markdownContent);
```

## 部署到 Vercel

Next.js 项目可以一键部署到 Vercel：

```bash
npm install -g vercel
vercel login
vercel
```

## 总结

使用 Next.js 构建博客有以下优势：

1. **性能优秀** - 自动代码分割、静态优化
2. **开发体验好** - 热重载、TypeScript 支持
3. **部署简单** - 一行命令部署到 Vercel
4. **功能丰富** - 图片优化、SEO 支持

希望这篇文章对你有所帮助！
