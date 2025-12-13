<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 與 Ailisha 艾莉莎環遊世界

一個互動式的世界旅行遊戲，與 AI 導遊 Ailisha 一起環遊世界，創造回憶和照片。

**當前版本**: v1.0.0  
**穩定版本**: [stable/v1.0](https://github.com/mkhsu2002/TravelwithAilisha/tree/stable/v1.0)  
**開發版本**: [dev/v1.1](https://github.com/mkhsu2002/TravelwithAilisha/tree/dev/v1.1)

## ✨ 功能特色

- 🌍 **環球旅行體驗**：從台北 101 出發，順時針環遊世界 6 站
- 📸 **AI 生成城市照片**：使用 Google Gemini API 生成 Ailisha 在城市中自在愜意觀光的照片（9:19 豎版比例）
- 🎯 **城市主視覺**：每個城市顯示一張 Ailisha 的城市照片作為主視覺，下方是城市介紹和景點選項
- 📝 **自動日記**：AI 為每次旅行生成感性的日記內容
- 🎵 **背景音樂**：程序化生成的背景音樂，根據遊戲狀態動態調整
- 💾 **資料持久化**：自動儲存進度，支援離線繼續遊戲
- 📥 **匯出遊記**：下載完整的 HTML 遊記檔案

## 🏗️ 專案架構

### 目錄結構

```
├── components/          # React 組件
│   ├── screens/        # 各個遊戲畫面組件
│   ├── Button.tsx      # 可重用按鈕組件
│   ├── PhotoUpload.tsx # 圖片上傳組件
│   ├── BackgroundMusic.tsx # 背景音樂組件
│   ├── Toast.tsx       # 通知系統
│   └── ErrorBoundary.tsx # 錯誤邊界
├── hooks/              # 自訂 React Hooks
│   ├── useGameState.ts # 遊戲狀態管理
│   └── usePhotoGeneration.ts # 城市照片生成邏輯
├── services/           # API 服務
│   └── geminiService.ts # Gemini API 整合（城市照片生成）
├── utils/              # 工具函數
│   ├── env.ts          # 環境變數驗證
│   ├── constants.ts    # 常數定義
│   ├── imageUtils.ts   # 圖片處理工具
│   ├── travelLogic.ts  # 旅行邏輯
│   └── storage.ts      # 本地儲存工具
├── types/              # TypeScript 類型定義
│   ├── api.ts          # API 回應類型
│   └── index.ts        # 主要類型定義
└── data.ts             # 城市和地標資料庫
```

### 技術棧

- **前端框架**: React 19 + TypeScript
- **建置工具**: Vite 6
- **樣式**: Tailwind CSS
- **AI 服務**: Google Gemini API
- **音訊**: Web Audio API
- **部署**: Cloudflare Pages

## 🚀 快速開始

### 前置需求

- Node.js 20+ 
- npm 或 yarn
- Gemini API Key（從 [Google AI Studio](https://makersuite.google.com/app/apikey) 獲取）

### 本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設置環境變數**
   
   創建 `.env.local` 檔案並填入您的 Gemini API Key：
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   ⚠️ **重要**：API Key 僅從環境變數讀取，不會在 UI 中顯示，確保安全性。

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **訪問應用**
   打開瀏覽器訪問 `http://localhost:3000`

### 可用腳本

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run preview` - 預覽生產版本
- `npm run lint` - 執行 ESLint 檢查
- `npm run lint:fix` - 自動修復 ESLint 問題
- `npm run format` - 格式化代碼（Prettier）
- `npm run type-check` - 類型檢查

## 🌿 分支管理

本專案使用以下分支策略：

- **`main`** - 主分支，包含最新的穩定代碼
- **`stable/v1.0`** - v1.0 穩定版本分支，用於生產環境部署
- **`dev/v1.1`** - v1.1 開發分支，用於新功能開發和測試

### 版本說明

- **v1.0.0** (stable/v1.0) - 初始穩定版本
  - 完整的環球旅行功能
  - AI 照片生成
  - 日記生成
  - 資料持久化
  - API Key 管理系統

- **v1.1.0** (dev/v1.1) - 開發中版本
  - 新功能和改進將在此分支開發

## 📦 部署

本專案已配置為使用 Cloudflare Pages 進行自動部署。詳細部署說明請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 部署分支

- **生產環境**: 從 `stable/v1.0` 分支部署
- **預覽環境**: 從 `dev/v1.1` 分支部署

### 快速部署步驟

1. **使用 GitHub Actions（推薦）**
   - 推送代碼到 GitHub
   - 在 GitHub Secrets 中設置：
     - `VITE_GEMINI_API_KEY`
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`
   - GitHub Actions 會自動建置和部署

2. **使用 Cloudflare Dashboard**
   - 連接 GitHub 倉庫
   - 設置建置命令：`npm run build`
   - 設置輸出目錄：`dist`
   - 添加環境變數：`VITE_GEMINI_API_KEY`

## 🎯 專案特色與優化

### 代碼品質

- ✅ **組件化架構**：將大型組件拆分為可重用的小組件
- ✅ **自訂 Hooks**：封裝複雜的狀態邏輯
- ✅ **TypeScript**：完整的類型安全
- ✅ **錯誤處理**：Error Boundary 和 Toast 通知系統
- ✅ **性能優化**：useMemo、useCallback 優化渲染

### 用戶體驗

- ✅ **圖片壓縮**：自動壓縮上傳的圖片
- ✅ **載入狀態**：清晰的載入提示
- ✅ **資料持久化**：自動儲存進度
- ✅ **無障礙性**：ARIA 標籤和鍵盤導航支援
- ✅ **響應式設計**：適配各種螢幕尺寸

### 安全性

- ✅ **環境變數驗證**：啟動時驗證必要的環境變數
- ✅ **檔案驗證**：驗證上傳檔案的類型和大小
- ✅ **錯誤處理**：優雅的錯誤處理和用戶提示

## 🔄 版本更新

### v1.1.0 (2024-12-XX)

#### 重大變更
- 🔄 **重新設計照片生成機制**：移除景點照片生成，改為每個城市生成一張 Ailisha 在城市中觀光的照片（9:19 豎版比例）
- 🎨 **優化 UI 體驗**：城市照片作為主視覺，下方顯示城市介紹和景點選項
- 🔒 **安全性提升**：移除 API Key 設定按鈕，僅從環境變數讀取，避免 API Key 曝光

#### 新增功能
- ✅ 城市照片生成功能（generateCityPhoto）
- ✅ 城市照片主視覺顯示（LandmarkSelectionScreen）
- ✅ 改進的 Ailisha 臉部一致性（使用參考圖片）

#### 技術優化
- ✅ 優化照片生成 prompt，強調臉部一致性
- ✅ 改進遊戲流程，選擇景點後直接進入下一輪
- ✅ 更新數據結構（photoUrl → cityPhotoUrl）
- ✅ 向後兼容性處理（自動轉換舊數據）

### v1.0.0 (2024-12-13)

#### 新增功能
- ✅ 完整的環球旅行體驗（6 站）
- ✅ AI 生成旅行照片（使用 Gemini API）
- ✅ 自動生成日記內容
- ✅ API Key 管理系統（Context API）
- ✅ 資料持久化（localStorage）
- ✅ 背景音樂系統
- ✅ 響應式設計

#### 技術優化
- ✅ 組件化架構重構
- ✅ TypeScript 類型安全
- ✅ 錯誤處理和 Toast 通知
- ✅ 圖片壓縮和驗證
- ✅ 性能優化（useMemo, useCallback）
- ✅ ESLint 和 Prettier 配置
- ✅ Cloudflare Pages 自動部署

#### 修復問題
- ✅ 移除 Tailwind CDN，改用 PostCSS
- ✅ 修復 Context Provider 錯誤
- ✅ 修復日記內容顯示
- ✅ 修復日期計算邏輯
- ✅ 整合 Ailisha.jpg 用於頭像和照片生成

## 📝 開發指南

### 添加新城市

編輯 `data.ts` 檔案，在對應的回合陣列中添加城市資料：

```typescript
{
  name: "城市名稱",
  country: "國家",
  latitude: 緯度,
  vibe: "urban" | "beach" | "historic" | "nature" | "cold" | "desert",
  description: "城市描述",
  landmarks: [
    {
      name: "地標名稱",
      description: "地標描述",
      bestAngle: "最佳拍攝角度"
    }
  ]
}
```

### 自訂樣式

專案使用 Tailwind CSS，可以在組件中直接使用 Tailwind 類別，或編輯 `index.html` 中的自訂樣式。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

本專案為私有專案。

## 🙏 致謝

- [Google Gemini API](https://ai.google.dev/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
