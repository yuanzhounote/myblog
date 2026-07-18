# 附件下载目录

把要提供下载的附件（Markdown / txt / pdf 等）放在这里。

## 怎么让某篇文章出现「下载附件」？

在 `content/posts/你的文章.md` 的 frontmatter 里加 `attachments` 字段即可：

```yaml
---
title: 文章标题
tags: [AI, 知识管理]
attachments:
  - file: 配套笔记.md        # 本目录下的文件名
    label: 配套笔记（可改名）  # 页面上展示的名字，不写则默认用文件名
  - 另一份资料.txt           # 也可以只写文件名
---
```

- 文件必须放在 `public/attachments/` 下。
- 文章页会自动在文末显示「本文附件」卡片；被文章引用的附件会汇总到 `/downloads` 资料下载页。
- 还没关联到文章的「独立附件」也会自动出现在 `/downloads` 的「其它附件」分区，方便临时存放或测试。
- 下载链接走 `/api/download?file=文件名`，由服务端强制以附件形式下载（微信内打开也能正常下载）。
- 文件名可以含中文、空格、`#` 等，链接已做编码处理；若需自定义展示名，在文章 frontmatter 里用 `label` 指定即可。
