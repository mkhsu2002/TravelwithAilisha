#!/bin/bash

# 推送到 GitHub 的腳本（處理可能的錯誤）

set -e

echo "=== 推送到 GitHub ==="
echo ""

cd /Users/mkhsu/Library/CloudStorage/Dropbox/Cursor_Projects/TravelwithAilisha

# 配置 git
echo "1. 配置 Git..."
git config http.postBuffer 524288000
git config http.version HTTP/1.1

# 檢查 remote
echo "2. 檢查 remote 設定..."
git remote -v

# 嘗試推送
echo "3. 開始推送 main 分支..."
echo "   這可能需要一些時間，請耐心等待..."

# 使用 SSH 方式嘗試（如果 HTTPS 失敗）
# git remote set-url origin git@github.com:mkhsu2002/TravelwithAilisha.git

# 推送（如果失敗會顯示錯誤）
if git push -u origin main; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "如果需要推送其他分支，執行："
    echo "   git push -u origin dev/v1.1"
    echo "   git push -u origin stable/v1.0"
else
    echo ""
    echo "❌ 推送失敗"
    echo ""
    echo "可能的解決方案："
    echo "1. 檢查網路連線"
    echo "2. 確認 GitHub 認證（Personal Access Token）"
    echo "3. 嘗試使用 SSH："
    echo "   git remote set-url origin git@github.com:mkhsu2002/TravelwithAilisha.git"
    echo "   git push -u origin main"
    echo "4. 或者分批推送較小的 commits"
fi




