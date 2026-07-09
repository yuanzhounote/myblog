---
title: 使MiMo Code免费打造个人博客并发布
tags:
  - MiMoCode
  - Nextjs
  - Vercel
  - 博客搭建
  - AI编程
line: 🔵 工具实操线
---

>远舟笔记·第14篇

零代码、从 0 到 1，全程靠「对话」搞定一个 Next.js 技术博客，并部署到公网。

## 一、为什么选 MiMo Code？

最近体验了 MiMo Code —— 一个 AI 驱动的代码生成工具。和 Cursor、Copilot 不同，它更像一个「AI 建筑师」：你提需求，它直接生成完整项目，你不用碰一行代码。另外目前处于限时免费阶段，零成本就能上手尝试。

正好我一直想搭个技术博客，存放自己写的 Markdown 文章，要求很简单：

- 把 `.md` 文件丢进目录就能渲染成漂亮的技术文章页面
- 有标签筛选、暗色模式、代码高亮
- 部署简单，不折腾

抱着「试一下」的心态，实际走下来，从安装到上线公网，大概花了 30 分钟。本文记录完整过程。

## 二、下载安装：选对版本是关键

MiMo Code 目前 v0.1.0 的下载页面有多个版本，**选错版本是很多人第一步就卡住的原因**。

我的设备是 MacBook Air M5，Apple Silicon 架构，下载列表中对应的是：

```
mimocode-darwin-arm64.zip (34.9 MB)
```

如果你的 Mac 是 Intel 芯片，则选 `mimocode-darwin-x64.zip`。

下载后打开，Mac 可能会提示「文件已损坏，无法打开」。这不是文件有问题，而是 macOS 的安全策略限制。打开终端，执行：

```bash
xattr -cr
```

然后在命令末尾加一个空格，把 MiMo Code 应用图标从「应用程序」文件夹直接拖进终端窗口，按下回车。命令会自动变成类似：

```bash
xattr -cr /Applications/MiMo-Code.app
```

再次点击应用图标，就能正常打开了。

## 三、新建项目：一句话的事

打开 MiMo Code 后，它会问你创建一个新项目。我给项目起名为 `mimocode-myblog`，并选择在本机建立本地 Git 仓库。

![项目创建](/images/file-20260613171001217.jpg)

然后 MiMo Code 会问你技术栈偏好，给了几个选项：

1. Static Site Generator（Hugo、Jekyll）
2. React/Next.js Blog
3. Vue/Nuxt Blog
4. Simple HTML/CSS/JS
![](/images/file-20260613171001209.jpg)
我选了 **React/Next.js Blog**。几个理由：

- Next.js 自带路由、SEO、图片优化，做博客几乎零配置
- AI 对 React/Next.js 的代码生成质量最高
- Vercel 部署一键完成，免费

## 四、写好提示词：需求越具体，结果越精准

这是最关键的一步。AI 代码生成的质量，80% 取决于你提需求的能力。我把需求整理成结构化提示词，直接丢给 MiMo Code：

### 我的核心需求

```markdown
帮我创建一个技术博客网站，使用以下技术栈和需求：

## 技术栈
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## 核心工作方式
- 我把 .md 文件放到项目的 /content/posts/ 目录下
- 博客自动读取所有 .md 文件，渲染成技术文章页面
- 纯文件系统驱动，不需要 CMS 或数据库

## Markdown 文件格式
两种情况都兼容：
1. 有 frontmatter 的，用 frontmatter 作为元数据
2. 没有 frontmatter 的纯 md，自动提取第一个 # 标题作为文章标题、
   文件时间作为日期、前 200 字作为摘要

## Markdown 渲染要求
- 标准 Markdown 语法全支持
- 代码块语法高亮，支持多种语言，带复制按钮
- 数学公式（KaTeX）支持
- GFM 扩展（任务列表、删除线等）

## 页面功能
- 首页：文章列表，按日期倒序，支持标签筛选
- 文章详情页：标题大字、日期标签、阅读时长、排版舒适
- 标签页：按标签筛选文章
- 关于页：个人简介

## 全局功能
- 暗色/亮色模式切换
- 响应式设计
- SEO meta 标签
- 3 篇示例技术文章
```

需求发给 MiMo Code 后，它会先和你确认技术方案，然后开始生成代码。整个过程大约 5-10 分钟，生成完毕后项目就可以在本地跑起来了：

```bash
cd mimocode-myblog
npm install
npm run dev
```

## 五、写文章：Markdown 直接丢进去就行

这是我设计这个工作流最舒服的地方。平时写好的 Markdown 文章，直接复制到 `/content/posts/` 目录，博客就能自动识别渲染：

- 文件名为文章 slug（URL 的一部分）
- 第一个 `# 标题` 自动作为文章标题
- 文件修改时间自动作为发布日期
- 前 200 字自动作为摘要

不需要写任何 frontmatter（当然，如果想手动指定标题、日期、标签，写 frontmatter 也支持）。

完成初版后我把项目做了第一次 Git 提交，内容包含 Markdown 渲染、标签筛选、暗色模式、SEO 优化。

## 六、推送到 GitHub

MiMo Code 创建的项目本地就有 Git 仓库，接下来推送到 GitHub。

先在 GitHub 网页上创建新仓库，命名为 `myblog`，注意**不要勾选**「Add a README file」和 `.gitignore`（本地已经有了）。

然后配置远程仓库并推送：

```bash
cd mimocode-myblog
git remote add origin git@github.com:你的用户名/myblog.git
git branch -M main
git push -u origin main
```

> 💡 推荐用 SSH 方式推送：先运行 `ssh-keygen -t ed25519 -C "youremail"` 生成密钥，把公钥（`~/.ssh/id_ed25519.pub` 的内容）添加到 GitHub 的 Settings → SSH Keys，这样以后推送不用输密码。

## 七、部署上线：Vercel 一键搞定

这是我觉得最香的一步。我本来打算用 GitHub Pages，但 Next.js 用 GitHub Pages 需要导出静态文件、改 `next.config.js`、处理 basePath，比较折腾。

换了 Vercel，直接 3 分钟上线：

### 1. 注册登录

打开 [vercel.com](https://vercel.com)，用 GitHub 账号直接登录（不绑卡，不付费）。

### 2. 导入仓库

点 **Add New Project**，选择 `你的用户名/myblog` 仓库。Vercel 自动识别为 Next.js 项目，不需要改任何构建配置。

![Vercel 导入项目](/images/file-20260613171001207.jpg)

### 3. 一键部署

点 **Deploy**，等待 1-2 分钟，博客就上线了。Vercel 会自动分配一个域名：

```
https://myblog-xxxxx.vercel.app
```

![部署成功](/images/file-20260613171001208.jpg)

### 后续更新：push 即发布

以后每次写新文章或改代码，只需要：

```bash
git add .
git commit -m "新文章：xxx"
git push
```

Vercel 会自动监听到 GitHub 仓库变化，1-2 分钟内自动重新构建部署，你什么都不用做。

### 关于费用

Vercel 个人免费版（Hobby Plan）的核心额度：

| 项目 | 免费额度 | 个人博客用量 |
|------|----------|------------|
| 带宽 | 100GB/月 | 几 GB |
| 构建时间 | 6000 分钟/月 | 每月不到 30 分钟 |
| HTTPS | 免费自动 | ✅ |
| 域名 | `xxx.vercel.app` | ✅ |
| 自定义域名 | 支持绑定 | 可选 |

技术博客这点流量和构建需求，免费版用一辈子都没问题。

## 八、后续优化

博客上线后，我又做了几轮打磨：

### 中文 Slug 修复

中文文件名作为 URL 路径时，浏览器会自动编码，但后端没做解码，导致点击文章 404。解决方法是前端 `encodeURIComponent` + 后端 `decodeURIComponent` 配对使用。

### 格式统一

14 篇文章的格式参差不齐——有的用 `# 一级标题`，有的用引用块头部，有的末尾残留了发布平台的链接。我以显示效果最好的笔记 12 为模板，统一为「frontmatter + `>远舟笔记·第N篇` 头部」的格式，并清理了所有尾部残留。

### 标签体系

按每篇文章使用的 AI 工具和场景打了 4-5 个标签，利用已有的标签筛选功能让读者按主题浏览。

### 图片迁移

原本图片散落在 `content/posts/assets/` 的子目录里，引用路径在 Next.js 渲染时失效。统一迁移到 `public/images/`，引用改为 `/images/xxx.jpg`。

## 九、总结

整个流程下来，我的感受是：

**AI 代码工具的成熟度已经到了「能用」的阶段。** 不是玩具，是真的能产出可以上线跑的项目。关键不在于工具本身多强，而在于你能否把需求描述清楚 —— 需求够具体，结果就够靠谱。

几个要点总结：

1. **选对版本**：Mac M 系列选 arm64，Intel 选 x64
2. **提示词要结构化**：技术栈、文件格式、渲染细节、设计风格，逐条列清
3. **工作流设计**：让 AI 生成的项目适配你的使用习惯，而不是你去适应它
4. **部署选 Vercel**：Next.js + Vercel 是最省心的组合，比 GitHub Pages 简单十倍
5. **上线不是终点**：中文 slug、格式统一、标签体系、图片路径——这些细节决定了博客的长期可维护性

现在这个博客已经成了我的线上笔记本，写完 Markdown 丢进去就自动上线，零维护成本。

---

**相关链接：**

- MiMo Code 下载：[github.com/XiaomiMiMo/MiMo-Code/releases](https://github.com/XiaomiMiMo/MiMo-Code/releases)
- Vercel 部署：[vercel.com](https://vercel.com)
- 我的博客：[myblog-umber-nine.vercel.app/blog](https://myblog-umber-nine.vercel.app/blog)
