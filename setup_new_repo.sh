#!/bin/bash

# 連接本地專案到新 GitHub Repository 的腳本

set -e

echo "=== 連接本地專案到新 GitHub Repository ==="
echo ""

# 檢查是否已有 remote
if git remote | grep -q "^origin$"; then
    echo "⚠️  發現現有的 origin remote，正在移除..."
    git remote remove origin
    echo "✅ 已移除舊的 remote"
fi

echo ""
echo "請提供以下資訊："
read -p "GitHub 用戶名: " GITHUB_USERNAME
read -p "新倉庫名稱: " REPO_NAME
read -p "使用 SSH 連接？(y/n，預設 n): " USE_SSH

if [ "${USE_SSH,,}" = "y" ] || [ "${USE_SSH,,}" = "yes" ]; then
    REMOTE_URL="git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"
else
    REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

echo ""
echo "將使用以下 remote URL: ${REMOTE_URL}"
read -p "確認繼續？(y/n): " CONFIRM

if [ "${CONFIRM,,}" != "y" ] && [ "${CONFIRM,,}" != "yes" ]; then
    echo "取消操作"
    exit 0
fi

echo ""
echo "1. 添加新的 remote..."
git remote add origin "${REMOTE_URL}"

echo "2. 驗證 remote 設定..."
git remote -v

echo ""
echo "3. 準備推送到新倉庫..."
echo "   分支：$(git branch --show-current)"
echo "   Commit: $(git log --oneline -1)"

echo ""
echo "✅ 設定完成！"
echo ""
echo "下一步："
echo "1. 確認已在 GitHub 建立新倉庫（不要初始化 README）"
echo "2. 執行以下命令推送代碼："
echo "   git push -u origin $(git branch --show-current)"
echo "   或推送所有分支："
echo "   git push -u origin --all"




