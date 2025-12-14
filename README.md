<div align="center">

<a href="https://www.facebook.com/ailisha0501/" target="_blank" rel="noopener noreferrer">
  <img width="466" height="600" alt="Ailisha in London" src="assets/Ailisha_London.jpg" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</a>

**點擊圖片前往 [Ailisha 的 Facebook](https://www.facebook.com/ailisha0501/)**

# 與 Ailisha 艾莉莎環遊世界

一個互動式的世界旅行遊戲，與 AI 導遊 Ailisha 一起環遊世界，創造回憶和照片。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)

</div>

## ✨ 功能特色

- 🌍 **環球旅行體驗**：從台北 101 出發，順時針環遊世界 6 站
- 📸 **AI 生成城市照片**：使用 Google Gemini API 生成 Ailisha 在城市中自在愜意觀光的照片（9:16 豎版比例）
- 🎯 **城市主視覺**：每個城市顯示一張 Ailisha 的城市照片作為主視覺，下方是城市介紹和景點選項
- 📸 **AI 生成景點合照**：生成您與 Ailisha 在景點的合照（1:1 正方形比例）
- 📝 **自動日記**：AI 為每次旅行生成感性的日記內容
- 🎵 **背景音樂**：程序化生成的背景音樂，根據遊戲狀態動態調整
- 💾 **資料持久化**：自動儲存進度，支援離線繼續遊戲
- 📥 **匯出遊記**：下載完整的 HTML 遊記檔案

## 🏗️ 專案架構

### 技術棧

- **前端框架**: React 19 + TypeScript
- **建置工具**: Vite 6
- **樣式**: Tailwind CSS
- **AI 服務**: Google Gemini API (Gemini 3 Pro Image Preview, Gemini 2.5 Flash)
- **音訊**: Web Audio API
- **部署**: Cloudflare Pages

## 🚀 快速開始

### 前置需求

- Node.js 20+ 
- npm 或 yarn
- Gemini API Key（從 [Google AI Studio](https://makersuite.google.com/app/apikey) 獲取）

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/mkhsu2002/TravelwithAilisha.git
   cd TravelwithAilisha
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設置環境變數**
   
   創建 `.env.local` 檔案並填入您的 Gemini API Key：
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   ⚠️ **重要**：API Key 僅從環境變數讀取，不會在 UI 中顯示，確保安全性。

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **訪問應用**
   打開瀏覽器訪問 `http://localhost:3000`

### 可用腳本

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run preview` - 預覽生產版本
- `npm run lint` - 執行 ESLint 檢查
- `npm run lint:fix` - 自動修復 ESLint 問題
- `npm run format` - 格式化代碼（Prettier）
- `npm run type-check` - 類型檢查
- `npm run test` - 執行測試

## 📖 使用說明

### 開始遊戲

1. 輸入您的暱稱
2. 上傳一張自拍照（將用於生成與 Ailisha 的合照）
3. 點擊「開始旅程」按鈕

### 遊戲流程

1. **選擇城市**：從 3 個候選城市中選擇一個
2. **查看城市照片**：欣賞 Ailisha 在該城市的照片
3. **選擇景點**：從 3 個景點中選擇一個
4. **生成合照**：AI 會生成您與 Ailisha 在景點的合照
5. **檢視合照**：查看生成的合照並可下載保存
6. **繼續下一站**：重複上述流程，完成 6 站旅程
7. **查看總結**：完成所有站點後，可以查看完整的旅行記錄並匯出

### 匯出遊記

完成旅程後，點擊「下載遊記」按鈕即可下載包含所有照片和日記的 HTML 檔案。

## 🚀 部署指南

本專案已配置為使用 Cloudflare Pages 進行部署。

### 部署到 Cloudflare Pages

1. **登入 Cloudflare Dashboard**
   - 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. **創建 Pages 專案**
   - 點擊左側選單的 "Workers & Pages"
   - 點擊 "Create application" > "Pages" > "Connect to Git"
   - 選擇您的 GitHub 倉庫

3. **配置建置設定**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`（留空）
   - Node.js version: `20` 或更高

4. **添加環境變數**
   - 在專案設定中找到 "Environment variables"
   - 添加 `VITE_GEMINI_API_KEY` 並填入您的 API Key
   - 選擇環境（Production、Preview）

5. **儲存並部署**
   - 點擊 "Save and Deploy"
   - Cloudflare 會自動建置並部署您的應用

### 環境變數配置

**本地開發**：創建 `.env.local` 檔案
```
VITE_GEMINI_API_KEY=your_api_key_here
```

**生產環境**：在 Cloudflare Pages 專案設定中添加環境變數 `VITE_GEMINI_API_KEY`

詳細部署說明請參考 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 專案特色

- ✅ **組件化架構**：可重用的 React 組件
- ✅ **TypeScript**：完整的類型安全
- ✅ **錯誤處理**：Error Boundary 和統一錯誤處理系統
- ✅ **響應式設計**：適配各種螢幕尺寸
- ✅ **圖片壓縮**：自動壓縮上傳的圖片
- ✅ **資料持久化**：自動儲存進度

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 貢獻指南

1. Fork 本專案
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 💬 技術支援與討論

加入 FlyPig LINE 群組 https://line.me/R/ti/g/@icareuec

## 🔗 推薦同步參考

如果您對 AI 智能電商工具感興趣，歡迎同步參考以下相關專案：

**AI-PM-Designer-Pro** - AI 視覺行銷生產力工具，基於 Google Gemini 2.5 Flash 與 Gemini 3 Pro Image，從產品圖自動生成完整行銷素材包

https://github.com/mkhsu2002/AI-PM-Designer-Pro

**AI Digital Portrait Studio** - 專為電商設計AI人像圖片生成工具，免去繁複的手動輸入提示詞，整合 Gemini 影像模型與 Firebase，一鍵生成多視角專業人像商品圖，支援自訂風格、背景、姿態等參數。

https://github.com/mkhsu2002/AI_Digital_Portrait_Studio

## ☕ 請我喝杯咖啡

👉 [Buy me a coffee](https://buymeacoffee.com/mkhsu2002w)

您的支持是我持續開發的動力！

若需協助委外部署或客製化選項開發（例如新增場景、人物姿態），歡迎聯絡 FlyPig AI

- Email: flypig@icareu.tw
- LINE ID: icareuec

## 📝 授權條款

本專案採用 MIT 授權。您可以自由使用、修改與自建部署。

**Open sourced by FlyPig AI**

詳見授權全文：

- [MIT License (English)](LICENSE)
- [MIT 授權條款 (繁體中文)](LICENSE.zh-TW.md)

---

<div align="center">

**與 Ailisha 一起環遊世界，創造美好回憶！** 🌍✨

Made with ❤️ by FlyPig AI

</div>
