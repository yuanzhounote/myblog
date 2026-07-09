#!/usr/bin/env bash
# 方案 A 部署脚本：本地单源（vault）+ 部署自动同步
# 流程：同步 vault 已发布文章到 myblog → git 提交推送 → 触发 Vercel 部署
# 用法：bash scripts/deploy.sh
set -euo pipefail

MYBLOG="/Users/wangyanqin/Documents/myblog"
SYNC="/Users/wangyanqin/.workbuddy/skills/sync-blog/scripts/sync_article.py"
PY="/Users/wangyanqin/.workbuddy/binaries/python/versions/3.13.12/bin/python3"

cd "$MYBLOG"

echo "🔄 同步 vault 已发布文章到 myblog ..."
"$PY" "$SYNC" --all

echo "📦 提交并推送 ..."
git add -A
if git diff --cached --quiet; then
  echo "（无变化，跳过提交）"
else
  git commit -m "sync: 自动同步 vault 已发布文章 $(date +%Y-%m-%d)"
  git push
fi

echo "🚀 部署 ..."
# 若 Vercel 已连接 GitHub 自动部署，上面 git push 已触发构建，无需下面的命令。
# 若使用 Vercel CLI 直接部署，取消下一行注释：
# npx vercel deploy --prod

echo "✅ 完成。若已配置 GitHub→Vercel 自动部署，push 即触发上线；否则取消注释 vercel deploy 行。"
