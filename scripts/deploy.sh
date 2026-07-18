#!/usr/bin/env bash
# 方案 A 部署脚本（轻量版）：vault 已发布文章 → 同步 → git 提交推送 → Vercel 自动构建
# 博客只是个人成长记录，不做重 Loop 工程。发布前不本地 build（交给 Vercel 云端）。
# 用法：bash scripts/deploy.sh
set -euo pipefail

MYBLOG="/Users/wangyanqin/Documents/myblog"
SYNC="/Users/wangyanqin/.workbuddy/skills/sync-blog/scripts/sync_article.py"
PY="/Users/wangyanqin/.workbuddy/binaries/python/versions/3.13.12/bin/python3"

cd "$MYBLOG"
"$PY" "$SYNC" --all
git add -A
if git diff --cached --quiet; then
  echo "（无变化，跳过提交）"
else
  git commit -m "sync: 自动同步 vault 已发布文章 $(date +%Y-%m-%d)" >/dev/null
  git push
fi
# 若 Vercel 未连接 GitHub 自动部署，取消下一行注释用 CLI 部署：
# npx vercel deploy --prod
echo "✅ 已推送，Vercel 会自动构建（push 即触发）。"
