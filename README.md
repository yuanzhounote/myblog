# 远舟笔记

一个文案从业者的学习笔记博客，关于 AI 工具、知识管理与个人成长。

博客地址：www.yuanzhounote.com（由 Vercel 部署）

---

## 项目结构

```
myblog/
├── content/
│   └── posts/               # Markdown 文章源文件（共15篇）
├── public/
│   ├── images/              # 文章配图
│   ├── rss.xml              # RSS 订阅（自动生成）
│   └── sitemap.xml          # 站点地图（自动生成）
├── scripts/
│   └── generate-feed.mjs    # RSS 订阅源生成脚本
├── src/
│   ├── app/
│   │   ├── about/           # 关于页
│   │   ├── blog/            # 文章详情页
│   │   ├── search/          # 搜索页
│   │   ├── tags/            # 标签分类页
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   └── not-found.tsx    # 404 页面
│   ├── components/
│   │   ├── Navigation.tsx   # 导航栏
│   │   ├── Footer.tsx       # 页脚
│   │   ├── HomeSearch.tsx   # 首页搜索框
│   │   ├── SearchBox.tsx    # 搜索组件
│   │   ├── ReadingProgress.tsx # 阅读进度条
│   │   └── CopyButton.tsx   # 代码块复制按钮
│   └── lib/
│       ├── blog.ts          # 文章数据读取
│       ├── markdown.ts      # Markdown 渲染
│       ├── feed.ts          # RSS 生成
│       ├── search.ts        # 全文搜索索引
│       └── tag-colors.ts    # 标签颜色映射
├── next.config.ts           # Next.js 配置
├── vercel.json              # Vercel 部署配置
├── tailwindcss              # Tailwind CSS v4
└── package.json
```

## 技术栈

| 项目 | 说明 |
|------|------|
| 框架 | Next.js 16.2.9 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 部署 | Vercel（新加坡节点） |
| Markdown | remark + rehype 生态 |
| 代码高亮 | highlight.js |
| 数学公式 | KaTeX |
| 广告条统计 | 不蒜子 |

## 文章功能

- **Markdown 渲染**：支持 GFM、代码高亮、数学公式、Mermaid 图表
- **标签系统**：彩色标签分类展示
- **全文搜索**：客户端搜索索引
- **阅读进度条**：文章页顶部滚动指示
- **代码块复制**：一键复制代码
- **RSS 订阅**：自动生成 `rss.xml`
- **Sitemap**：自动生成 `sitemap.xml`

## 本地开发

```bash
# 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 添加新文章

1. 将 Markdown 文件放入 `content/posts/`
2. 图片放入 `public/images/`
3. 在 Markdown 中使用 `/images/文件名` 引用图片
4. 提交 Git 并推送，Vercel 自动部署

文章 frontmatter 格式：

```yaml
---
tags:
  - 标签1
  - 标签2
---

>远舟笔记·第N篇

正文从这里开始...
```

## 部署

通过 Vercel 自动部署。推送到 `main` 分支即可触发构建和发布。
