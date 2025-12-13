#!/bin/bash

# 將 main 分支重置為 dev/v1.1 的狀態

set -e

echo "=== 將 main 分支重置為 dev/v1.1 ==="
echo ""

# 移除可能的 lock 檔案
echo "1. 清理 lock 檔案..."
rm -f .git/index.lock
rm -f .git/refs/heads/*.lock

# 切換到 main 分支
echo "2. 切換到 main 分支..."
git checkout main

# 拉取最新變更
echo "3. 拉取遠端變更..."
git fetch origin

# 硬重置到 dev/v1.1
echo "4. 將 main 重置為 dev/v1.1 的狀態..."
git reset --hard origin/dev/v1.1

# 顯示當前狀態
echo ""
echo "5. 當前 main 分支狀態："
git log --oneline -3

echo ""
echo "✅ 重置完成！"
echo ""
echo "下一步：執行以下命令推送到遠端："
echo "   git push origin main --force"
echo ""
echo "⚠️  警告：這會強制覆蓋遠端的 main 分支歷史！"




