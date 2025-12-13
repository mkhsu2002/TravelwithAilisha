# Cloudflare Pages 自動部署故障排除

## 問題：為什麼 Cloudflare 沒有自動重新部署？

Cloudflare Pages 的自動部署有兩種方式，請根據您的設置方式檢查：

## 方法一：Cloudflare Dashboard 直接連接 GitHub（推薦）

這是最簡單的方式，Cloudflare 會自動監聽 GitHub push 事件。

### 檢查步驟：

1. **確認 Cloudflare Pages 專案已連接 GitHub**
   - 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 前往 Workers & Pages > 您的專案
   - 檢查 "Source" 部分是否顯示已連接的 GitHub 倉庫
   - 如果沒有連接，點擊 "Connect to Git" 並選擇您的倉庫

2. **檢查建置設定**
   - 在專案設定中找到 "Builds & deployments"
   - 確認以下設定：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/`（留空）
     - **Node.js version**: `20` 或更高

3. **檢查環境變數**
   - 在專案設定中找到 "Environment variables"
   - 確認已設置 `VITE_GEMINI_API_KEY`
   - 選擇環境：Production 和 Preview

4. **檢查 Webhook 狀態**
   - 在 GitHub 倉庫中，前往 Settings > Webhooks
   - 確認是否有 Cloudflare Pages 的 webhook
   - Webhook URL 應該類似：`https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`
   - 如果沒有，Cloudflare 可能沒有正確連接

5. **手動觸發部署測試**
   - 在 Cloudflare Dashboard 中，點擊 "Retry deployment" 或 "Create deployment"
   - 如果手動部署成功，但自動部署失敗，可能是 webhook 問題

### 解決方案：

如果 webhook 沒有正確設置：

1. **重新連接 GitHub**
   - 在 Cloudflare Pages 專案設定中
   - 點擊 "Disconnect" 斷開連接
   - 然後重新 "Connect to Git"
   - 選擇您的 GitHub 倉庫並授權

2. **檢查 GitHub 權限**
   - 確認 Cloudflare 有權限訪問您的倉庫
   - 在 GitHub Settings > Applications > Authorized OAuth Apps 中檢查

## 方法二：使用 GitHub Actions

如果您使用 GitHub Actions 部署，需要設置以下 secrets：

### 必需的 GitHub Secrets：

1. **VITE_GEMINI_API_KEY**
   - 您的 Gemini API Key
   - 設置位置：GitHub 倉庫 > Settings > Secrets and variables > Actions

2. **CLOUDFLARE_API_TOKEN**
   - Cloudflare API Token（需要 Pages:Edit 權限）
   - 獲取方式：
     - 登入 Cloudflare Dashboard
     - My Profile > API Tokens
     - Create Token > 使用 "Edit Cloudflare Workers" 模板
     - 添加 "Account" > "Cloudflare Pages" > "Edit" 權限

3. **CLOUDFLARE_ACCOUNT_ID**
   - 您的 Cloudflare Account ID
   - 在 Cloudflare Dashboard 右側欄位可以找到

### 檢查 GitHub Actions：

1. 前往 GitHub 倉庫的 "Actions" 標籤
2. 檢查是否有 "Deploy to Cloudflare Pages" 工作流程
3. 查看最近的執行記錄，確認是否有錯誤

## 常見問題

### 1. Push 後沒有觸發部署

**可能原因：**
- Cloudflare Pages 專案沒有連接到 GitHub
- Webhook 沒有正確設置
- 推送的分支不是 `main`

**解決方案：**
- 確認 Cloudflare Pages 專案已連接 GitHub
- 檢查推送的分支是否為 `main`
- 重新連接 GitHub 倉庫

### 2. 部署失敗

**可能原因：**
- 建置命令錯誤
- 環境變數未設置
- Node.js 版本不匹配

**解決方案：**
- 檢查建置日誌中的錯誤訊息
- 確認環境變數已正確設置
- 確認 Node.js 版本為 20 或更高

### 3. 部署成功但網站無法訪問

**可能原因：**
- 建置輸出目錄錯誤
- 環境變數未正確傳遞

**解決方案：**
- 確認 Build output directory 為 `dist`
- 檢查環境變數是否在正確的環境中設置

## 驗證自動部署

1. **推送一個小變更到 main 分支**
   ```bash
   git add .
   git commit -m "test: 測試自動部署"
   git push origin main
   ```

2. **檢查 Cloudflare Dashboard**
   - 在 Cloudflare Pages 專案中查看 "Deployments" 標籤
   - 應該會看到新的部署正在進行

3. **檢查 GitHub Actions（如果使用）**
   - 在 GitHub 倉庫的 "Actions" 標籤中查看
   - 應該會看到工作流程正在執行

## 手動觸發部署

如果自動部署有問題，可以手動觸發：

### Cloudflare Dashboard：
1. 前往 Cloudflare Pages 專案
2. 點擊 "Create deployment"
3. 選擇分支和提交

### GitHub Actions：
1. 前往 GitHub 倉庫的 "Actions" 標籤
2. 選擇 "Deploy to Cloudflare Pages" 工作流程
3. 點擊 "Run workflow"

## 需要幫助？

如果以上步驟都無法解決問題，請檢查：
- Cloudflare Pages 建置日誌
- GitHub Actions 執行日誌（如果使用）
- GitHub Webhooks 狀態

