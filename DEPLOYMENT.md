# Cloudflare Pages 部署指南

本專案已配置為使用 Cloudflare Pages 進行自動部署。

> **重要說明**：本專案**不使用 GitHub Actions**，而是直接透過 Cloudflare Dashboard 連接 GitHub repository 進行自動部署。所有建置和部署流程都由 Cloudflare Pages 自動處理。

## 前置需求

1. Cloudflare 帳號
2. GitHub 帳號（用於連接 repository）
3. Gemini API Key（從 [Google AI Studio](https://makersuite.google.com/app/apikey) 獲取）

## 部署步驟

### 方法一：使用 Cloudflare Dashboard（推薦，自動部署）

本專案使用 Cloudflare Dashboard 直接連接 GitHub 進行自動部署。**不需要配置 GitHub Actions**，所有部署流程由 Cloudflare 自動處理。

1. **登入 Cloudflare Dashboard**
   - 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. **創建 Pages 專案**
   - 點擊左側選單的 "Workers & Pages"
   - 點擊 "Create application" > "Pages" > "Connect to Git"
   - 選擇您的 GitHub 倉庫 `mkhsu2002/TravelwithAilisha`

3. **配置建置設定**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`（留空）
   - Node.js version: `20`（Cloudflare 會自動偵測，或手動設定）

4. **設置生產分支（重要）**
   - 在專案設定的 "Builds & deployments" 區塊
   - 找到 "Production branch" 設定
   - 將分支設置為 `main`（而非 `stable/v1.0`）
   - 這樣當您推送代碼到 `main` 分支時，Cloudflare 會自動觸發部署

5. **添加環境變數**
   - 在專案設定中找到 "Environment variables"
   - 添加 `VITE_GEMINI_API_KEY` 並填入您的 API Key
   - 選擇環境（Production、Preview）
   - 確保 Production 環境已設置

6. **儲存並部署**
   - 點擊 "Save and Deploy"
   - Cloudflare 會自動建置並部署您的應用

7. **自動部署（無需 GitHub Actions）**
   - Cloudflare Pages 會自動監聽 GitHub repository 的推送事件
   - 之後每次推送代碼到 `main` 分支時，Cloudflare 會自動：
     1. 偵測到 GitHub 推送事件（透過 Cloudflare 的 Git 整合）
     2. 自動安裝依賴（`npm install`）
     3. 執行建置命令（`npm run build`）
     4. 部署到生產環境
   - **不需要配置 GitHub Actions**，所有流程由 Cloudflare 自動處理

### 方法二：使用 Wrangler CLI（手動部署）

1. **安裝 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登入 Cloudflare**
   ```bash
   wrangler login
   ```

3. **建置專案**
   ```bash
   npm run build
   ```

4. **部署到 Pages**
   ```bash
   wrangler pages deploy dist --project-name=travelwithailisha
   ```

## 環境變數配置

### 本地開發

1. 複製 `.env.example` 為 `.env.local`
   ```bash
   cp .env.example .env.local
   ```

2. 編輯 `.env.local` 並填入您的 API Key
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. 啟動開發伺服器
   ```bash
   npm run dev
   ```

### 生產環境

在 Cloudflare Pages 專案設定中添加環境變數：
- `VITE_GEMINI_API_KEY`: 您的 Gemini API Key

## 驗證部署

部署完成後，您可以：

1. 訪問 Cloudflare Pages 提供的 URL（格式：`https://travelwithailisha.pages.dev`）
2. 測試應用功能：
   - 上傳自拍照
   - 選擇城市和地標
   - 生成照片
   - 下載遊記

## 故障排除

### 建置失敗

1. **檢查環境變數**
   - 確認 `VITE_GEMINI_API_KEY` 已正確設置
   - 檢查 API Key 是否有效

2. **檢查建置日誌**
   - 在 Cloudflare Dashboard 中查看建置日誌
   - 前往專案 > "Deployments" 標籤查看詳細日誌

3. **本地測試建置**
   ```bash
   npm run build
   ```

### API 錯誤

1. **確認 API Key 權限**
   - 檢查 Gemini API Key 是否有生成圖片的權限
   - 確認 API 配額未超限

2. **檢查網路連線**
   - 確認 Cloudflare Pages 可以訪問 Google API

## 持續部署（自動化，無需 GitHub Actions）

### 自動部署流程

當您推送代碼到 `main` 分支時，Cloudflare Pages 會自動：
1. **偵測推送事件**：Cloudflare 透過 Git 整合自動偵測 GitHub repository 的推送
2. **觸發建置**：自動開始建置流程
3. **執行建置**：執行 `npm run build` 命令
4. **部署應用**：自動部署到 Cloudflare Pages

### 重要說明

- ✅ **不需要 GitHub Actions**：所有部署流程由 Cloudflare Pages 自動處理
- ✅ **自動觸發**：每次推送到 `main` 分支都會自動觸發部署
- ✅ **預覽部署**：推送到其他分支會自動創建預覽部署
- ✅ **建置日誌**：可在 Cloudflare Dashboard 查看完整的建置和部署日誌

### 手動觸發部署

您也可以手動觸發部署：
- 在 Cloudflare Dashboard 的專案頁面點擊 "Retry deployment" 或 "Redeploy"
- 或在 "Deployments" 標籤中選擇特定版本重新部署

## 相關資源

- [Cloudflare Pages 文檔](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Git 整合指南](https://developers.cloudflare.com/pages/platform/git-integration/)
- [Vite 文檔](https://vitejs.dev/)

