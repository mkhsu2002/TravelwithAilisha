#!/bin/bash

# 合併 dev/v1.1 到 main 分支的腳本

set -e

echo "正在切換到 main 分支..."
git checkout main

echo "正在拉取最新變更..."
git fetch origin

echo "正在合併 dev/v1.1 分支到 main..."
git merge origin/dev/v1.1 -m "merge: 將 dev/v1.1 合併回 main 分支

恢復到穩定可運行的版本"

echo "合併完成！"
echo "請檢查變更，然後執行: git push origin main"

