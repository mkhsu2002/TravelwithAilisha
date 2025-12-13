# Cloudflare Pages 自動部署設定指南

本專案使用 **Cloudflare Pages 直接連接 GitHub** 進行自動部署，**不需要配置 GitHub Actions**。

## 快速設定步驟

### 1. 登入 Cloudflare Dashboard

前往 [Cloudflare Dashboard](https://dash.cloudflare.com/) 並登入您的帳號。

### 2. 創建 Pages 專案

1. 點擊左側選單的 **"Workers & Pages"**
2. 點擊 **"Create application"** > **"Pages"** > **"Connect to Git"**
3. 選擇 **GitHub** 作為 Git 提供者
4. 授權 Cloudflare 訪問您的 GitHub 帳號（如果尚未授權）
5. 選擇 repository：`mkhsu2002/TravelwithAilisha`

### 3. 配置建置設定

在專案設定頁面，配置以下選項：

- **Project name**: `travelwithailisha`（或您喜歡的名稱）
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`（留空）

### 4. 設定 Node.js 版本

Cloudflare Pages 會自動偵測 Node.js 版本，但您也可以手動設定：

- 在專案設定中找到 **"Environment variables"**
- 添加環境變數：
  - `NODE_VERSION`: `20`

或者，專案中的 `.nvmrc` 檔案會自動指定 Node.js 版本。

### 5. 添加環境變數

在 **"Environment variables"** 區塊添加：

- **Variable name**: `VITE_GEMINI_API_KEY`
- **Value**: 您的 Gemini API Key
- **Environment**: 選擇 **Production** 和 **Preview**（建議兩個環境都設定）

### 6. 儲存並部署

點擊 **"Save and Deploy"**，Cloudflare 會：
1. 自動安裝依賴
2. 執行建置
3. 部署到生產環境

## 自動部署機制

### 如何運作

1. **Git 整合**：Cloudflare Pages 透過 OAuth 連接您的 GitHub repository
2. **自動偵測**：當您推送代碼到 `main` 分支時，Cloudflare 會自動偵測到變更
3. **自動建置**：觸發建置流程，執行 `npm run build`
4. **自動部署**：建置成功後自動部署到 Cloudflare Pages

### 不需要 GitHub Actions

- ✅ **不需要** 創建 `.github/workflows/` 目錄
- ✅ **不需要** 配置 GitHub Actions YAML 檔案
- ✅ **不需要** 設定 GitHub Secrets
- ✅ 所有部署流程由 Cloudflare Pages 自動處理

### 預覽部署

- 推送到 `main` 分支 → 自動部署到生產環境
- 推送到其他分支 → 自動創建預覽部署（Preview Deployment）
- 每個 Pull Request → 自動創建預覽部署

## 驗證部署

部署完成後，您可以：

1. 在 Cloudflare Dashboard 查看部署狀態
2. 訪問 Cloudflare 提供的 URL（格式：`https://travelwithailisha.pages.dev`）
3. 測試應用功能

## 監控和日誌

### 查看建置日誌

1. 前往 Cloudflare Dashboard > Workers & Pages > 您的專案
2. 點擊 **"Deployments"** 標籤
3. 選擇特定的部署查看詳細日誌

### 建置失敗處理

如果建置失敗：

1. 查看建置日誌找出錯誤原因
2. 檢查環境變數是否正確設定
3. 確認 `package.json` 中的建置腳本正確
4. 本地測試建置：`npm run build`

## 手動觸發部署

您也可以手動觸發部署：

1. 在 Cloudflare Dashboard 的專案頁面
2. 點擊 **"Retry deployment"** 重新部署最新版本
3. 或在 **"Deployments"** 標籤中選擇特定版本點擊 **"Redeploy"**

## 自訂域名

### 設定自訂域名

1. 在專案設定中找到 **"Custom domains"**
2. 點擊 **"Set up a custom domain"**
3. 輸入您的域名
4. 按照指示更新 DNS 設定

## 相關資源

- [Cloudflare Pages 文檔](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Git 整合指南](https://developers.cloudflare.com/pages/platform/git-integration/)
- [Cloudflare Pages 環境變數](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)

## 故障排除

### 建置失敗

**問題**：建置失敗，錯誤訊息顯示找不到模組

**解決方案**：
- 確認 `package.json` 中的依賴已正確安裝
- 檢查 Node.js 版本是否為 20
- 查看建置日誌中的詳細錯誤訊息

### 環境變數未生效

**問題**：環境變數已設定但應用中無法讀取

**解決方案**：
- 確認環境變數名稱正確（`VITE_GEMINI_API_KEY`）
- 確認已選擇正確的環境（Production/Preview）
- 重新部署應用

### 部署後無法訪問

**問題**：部署成功但無法訪問網站

**解決方案**：
- 檢查自訂域名設定
- 確認 DNS 設定正確
- 等待 DNS 傳播（可能需要幾分鐘）

---

**重要提醒**：本專案使用 Cloudflare Pages 的 Git 整合功能，所有部署流程都是自動的，不需要額外配置 GitHub Actions。

