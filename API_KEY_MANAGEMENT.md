# API Key 管理功能說明

## 概述

專案已實現統一的 API Key 管理系統，使用 React Context 來管理 Gemini API Key 的傳遞和使用。

## 主要功能

### 1. Context 管理 (`contexts/ApiKeyContext.tsx`)

- **統一管理**: 使用 React Context 統一管理 API Key
- **本地儲存**: API Key 儲存在瀏覽器的 localStorage 中
- **環境變數支援**: 自動從環境變數 `VITE_GEMINI_API_KEY` 讀取（如果存在）
- **狀態追蹤**: 提供 `isConfigured` 狀態來追蹤 API Key 是否已配置

### 2. API Key 管理介面 (`components/ApiKeyModal.tsx`)

參考截圖設計實現的管理介面，包含：

- **標題**: "Setup Gemini API"
- **說明文字**: 
  - "為了確保安全，請使用您自己的 API Key。"
  - "您的 Key 只會儲存在瀏覽器中，不會上傳至伺服器。"
- **輸入欄位**: 
  - 標籤："GEMINI API KEY"
  - 支援顯示/隱藏切換（眼睛圖標）
  - 密碼模式輸入
- **操作按鈕**:
  - "開始使用" - 儲存並關閉
  - "清除 API Key" - 清除已儲存的 Key
- **獲取 Key 連結**: "還沒有 Key? 點此免費獲取"

### 3. Header 按鈕 (`components/Header.tsx`)

在頁首右上角新增 API Key 管理按鈕：

- **未配置狀態**: 黃色按鈕，顯示 "設定 API Key"
- **已配置狀態**: 綠色按鈕，顯示 "API Key"
- **響應式設計**: 在小螢幕上隱藏文字，只顯示圖標

### 4. StartScreen 整合 (`components/screens/StartScreen.tsx`)

- **API Key 檢查**: 在開始旅程前檢查 API Key 是否已配置
- **提示訊息**: 如果未配置，顯示警告提示並引導用戶設定
- **按鈕禁用**: 未配置 API Key 時禁用開始按鈕

### 5. 服務層更新 (`services/geminiService.ts`)

- **動態初始化**: API Key 通過參數傳遞，不再依賴環境變數
- **錯誤處理**: 提供清晰的錯誤訊息引導用戶配置 API Key
- **實例管理**: 當 API Key 改變時自動重新初始化客戶端

## 使用方式

### 開發者

1. **環境變數（可選）**:
   ```bash
   # .env.local
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   如果設置了環境變數，應用會自動讀取並儲存到 localStorage。

2. **用戶設定**:
   - 用戶可以通過右上角的按鈕打開 API Key 管理介面
   - 輸入 API Key 後點擊 "開始使用"
   - API Key 會自動儲存到瀏覽器的 localStorage

### 用戶

1. **首次使用**:
   - 打開應用後，如果未配置 API Key，會看到提示
   - 點擊右上角的 "設定 API Key" 按鈕
   - 在彈出的視窗中輸入 API Key
   - 點擊 "開始使用" 完成設定

2. **獲取 API Key**:
   - 點擊管理介面中的 "還沒有 Key? 點此免費獲取"
   - 會打開 Google AI Studio 的 API Key 頁面

3. **更新 API Key**:
   - 隨時可以點擊右上角的按鈕重新設定
   - 可以清除現有的 API Key

## 安全性

- ✅ **本地儲存**: API Key 只儲存在用戶的瀏覽器中
- ✅ **不上傳**: API Key 不會上傳到任何伺服器
- ✅ **密碼模式**: 輸入時預設隱藏，可切換顯示
- ✅ **環境變數優先**: 開發環境可以使用環境變數，生產環境由用戶自行設定

## 技術實現

### Context API

```typescript
const { apiKey, setApiKey, isConfigured, clearApiKey } = useApiKey();
```

### 服務層調用

```typescript
// 照片生成
await generateSouvenirPhoto(..., apiKey);

// 日記生成
await generateDiaryEntry(city, landmark, apiKey);
```

## 檔案結構

```
新增/修改的檔案：
├── contexts/
│   └── ApiKeyContext.tsx          # API Key Context
├── components/
│   ├── ApiKeyModal.tsx            # API Key 管理介面
│   ├── Header.tsx                 # 更新：新增按鈕
│   └── screens/
│       └── StartScreen.tsx        # 更新：API Key 檢查
├── services/
│   └── geminiService.ts          # 更新：接受 apiKey 參數
└── hooks/
    └── usePhotoGeneration.ts     # 更新：從 Context 獲取 apiKey
```

## 注意事項

1. **向後兼容**: 如果環境變數中有 `VITE_GEMINI_API_KEY`，會自動讀取
2. **清除資料**: 清除 API Key 會同時清除 localStorage 中的儲存
3. **錯誤處理**: 所有 API 調用都會檢查 API Key 是否存在
4. **用戶體驗**: 未配置時會提供清晰的引導和提示

## 未來改進（可選）

1. **API Key 驗證**: 在儲存前驗證 API Key 的有效性
2. **加密儲存**: 使用加密方式儲存 API Key（雖然是本地儲存）
3. **多環境支援**: 支援多個 API Key（開發/生產）
4. **使用統計**: 追蹤 API 使用情況

