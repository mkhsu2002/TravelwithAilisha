# 連接新 GitHub Repository 的步驟

## 步驟 1：在 GitHub 上建立新倉庫

1. 登入 GitHub
2. 點擊右上角的 "+" → "New repository"
3. 填寫倉庫資訊：
   - Repository name: `TravelwithAilisha`（或您想要的名稱）
   - Description: （可選）
   - 選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"
   - **不要**添加 .gitignore 或 license
4. 點擊 "Create repository"

## 步驟 2：連接本地專案到新倉庫

在終端機執行以下命令（將 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替換為實際值）：

```bash
cd /Users/mkhsu/Library/CloudStorage/Dropbox/Cursor_Projects/TravelwithAilisha

# 添加新的 remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用 SSH（如果您已設定 SSH keys）
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 查看 remote 設定
git remote -v

# 推送所有分支到新倉庫
git push -u origin --all

# 推送所有 tags（如果有）
git push -u origin --tags
```

## 步驟 3：驗證

1. 檢查 GitHub 倉庫頁面，確認所有檔案都已上傳
2. 確認分支都已同步

## 範例命令

假設您的 GitHub 用戶名是 `mkhsu2002`，新倉庫名稱是 `TravelwithAilisha`：

```bash
git remote add origin https://github.com/mkhsu2002/TravelwithAilisha.git
git push -u origin --all
```

## 注意事項

- 確保您有新倉庫的寫入權限
- 如果是私有倉庫，需要適當的認證（Personal Access Token 或 SSH key）
- 推送前確保本地代碼已經 commit




