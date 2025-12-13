# 專案程式碼檢視與優化建議報告

> **檢視日期**: 2024-12-XX  
> **專案名稱**: Travel with Ailisha (與 Ailisha 艾莉莎環遊世界)  
> **檢視者**: 資深軟體工程師

---

## 📋 執行摘要

本專案是一個使用 React 19 + TypeScript + Vite 建構的互動式世界旅行遊戲，整體架構良好，組件化程度高，但仍有許多優化空間。本報告將從**架構設計**、**程式碼品質**、**性能優化**、**安全性**、**可維護性**、**測試覆蓋率**等面向提出具體優化建議。

---

## 🏗️ 一、架構設計優化

### 1.1 狀態管理架構

**現況分析**:
- 使用自訂 Hook `useGameState` 管理狀態，但狀態分散在多個 `useState`
- 沒有使用狀態管理庫（如 Zustand、Redux Toolkit）
- 狀態更新邏輯分散在 `App.tsx` 和各個組件中

**問題**:
```typescript
// useGameState.ts - 狀態過於分散
const [gameState, setGameState] = useState<GameState>(GameState.START);
const [userData, setUserData] = useState<UserData>({ nickname: '', selfieBase64: null });
const [currentRound, setCurrentRound] = useState(1);
// ... 多達 15+ 個獨立狀態
```

**優化建議**:
1. **引入 Zustand 進行狀態管理**
   - 優點：輕量級、TypeScript 友好、易於測試
   - 將遊戲狀態集中管理，減少 prop drilling
   - 提供中間件支援（persist、devtools）

2. **狀態結構重組**
   ```typescript
   // 建議的狀態結構
   interface GameStore {
     // 遊戲流程狀態
     gameState: GameState;
     currentRound: number;
     
     // 用戶資料
     userData: UserData;
     
     // 旅行狀態
     travel: {
       currentLocation: string;
       currentLat: number;
       history: TravelHistoryItem[];
     };
     
     // UI 狀態
     ui: {
       loading: LoadingState;
       cityOptions: City[];
       selectedCity: City | null;
       landmarkOptions: Landmark[];
       selectedLandmark: Landmark | null;
     };
   }
   ```

**優先級**: 🔴 高

---

### 1.2 API 服務層設計

**現況分析**:
- `geminiService.ts` 混合了初始化、業務邏輯和 API 調用
- 沒有統一的錯誤處理機制
- API 調用沒有重試機制
- 沒有請求取消機制

**問題**:
```typescript
// services/geminiService.ts
let aiInstance: GoogleGenAI | null = null; // 模組級變數，難以測試
let currentApiKey: string | null = null;

export const generateCityPhoto = async (...) => {
  initializeAI(apiKey); // 副作用
  // ... 沒有錯誤分類、重試邏輯
}
```

**優化建議**:
1. **建立 API Client 抽象層**
   ```typescript
   // services/apiClient.ts
   class GeminiApiClient {
     private client: GoogleGenAI | null = null;
     
     constructor(apiKey: string) {
       this.client = new GoogleGenAI({ apiKey });
     }
     
     async generateImage(params: ImageGenerationParams): Promise<ImageResult> {
       // 統一錯誤處理、重試邏輯
     }
   }
   ```

2. **實作請求重試機制**
   ```typescript
   async function withRetry<T>(
     fn: () => Promise<T>,
     maxRetries = 3,
     delay = 1000
   ): Promise<T> {
     // 指數退避重試邏輯
   }
   ```

3. **實作請求取消機制**
   ```typescript
   // 使用 AbortController 取消進行中的請求
   const controller = new AbortController();
   // 在組件卸載時取消請求
   ```

**優先級**: 🔴 高

---

### 1.3 組件職責分離

**現況分析**:
- `App.tsx` 仍然包含過多業務邏輯（365 行）
- 一些組件同時處理 UI 和業務邏輯

**優化建議**:
1. **提取業務邏輯到 Hooks**
   - 將 `handleCitySelect`、`handleLandmarkSelect` 等邏輯提取到 `useGameActions.ts`
   - 組件只負責渲染和事件綁定

2. **建立服務層**
   - `services/gameService.ts` - 遊戲流程控制
   - `services/photoService.ts` - 照片生成邏輯
   - `services/storageService.ts` - 儲存邏輯封裝

**優先級**: 🟡 中

---

## 💻 二、程式碼品質優化

### 2.1 TypeScript 類型安全

**現況分析**:
- 存在 `any` 類型使用（ESLint 設為 warn）
- 部分類型定義不夠嚴格
- API 回應類型定義不完整

**問題範例**:
```typescript
// App.tsx:195
catch (e: any) {
  console.error('生成景點合照錯誤:', e);
  const errorMessage = e?.message || '未知錯誤';
}

// types/api.ts - 類型定義不完整
export interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { data?: string };
      }>;
    };
  }>;
}
```

**優化建議**:
1. **建立完整的錯誤類型系統**
   ```typescript
   // types/errors.ts
   export class ApiError extends Error {
     constructor(
       message: string,
       public code: string,
       public statusCode?: number
     ) {
       super(message);
       this.name = 'ApiError';
     }
   }
   
   export class NetworkError extends Error {
     constructor(message: string) {
       super(message);
       this.name = 'NetworkError';
     }
   }
   ```

2. **嚴格化 API 回應類型**
   ```typescript
   // 使用 zod 進行運行時驗證
   import { z } from 'zod';
   
   const GeminiImageResponseSchema = z.object({
     candidates: z.array(z.object({
       content: z.object({
         parts: z.array(z.object({
           inlineData: z.object({
             data: z.string()
           }).optional()
         }))
       })
     }))
   });
   ```

3. **移除所有 `any` 類型**
   - 使用 `unknown` 替代 `any`
   - 使用類型守衛進行類型檢查

**優先級**: 🔴 高

---

### 2.2 錯誤處理完善

**現況分析**:
- 錯誤處理不一致，有些地方用 `console.error`，有些用 Toast
- Error Boundary 沒有錯誤上報機制
- API 錯誤訊息不夠詳細

**優化建議**:
1. **統一錯誤處理機制**
   ```typescript
   // utils/errorHandler.ts
   export class ErrorHandler {
     static handle(error: unknown, context: string) {
       const errorInfo = this.normalizeError(error);
       
       // 1. 記錄錯誤（可整合 Sentry）
       this.logError(errorInfo, context);
       
       // 2. 顯示用戶友好的訊息
       this.showUserMessage(errorInfo);
       
       // 3. 回報錯誤（可選）
       this.reportError(errorInfo, context);
     }
   }
   ```

2. **增強 Error Boundary**
   ```typescript
   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
     // 整合錯誤追蹤服務（如 Sentry）
     if (process.env.NODE_ENV === 'production') {
       errorTrackingService.captureException(error, {
         contexts: { react: errorInfo }
       });
     }
   }
   ```

3. **API 錯誤分類處理**
   ```typescript
   // 根據錯誤類型顯示不同訊息
   if (error instanceof NetworkError) {
     showError('網路連線錯誤，請檢查您的網路');
   } else if (error instanceof ApiError) {
     showError(`API 錯誤: ${error.message}`);
   }
   ```

**優先級**: 🔴 高

---

### 2.3 程式碼清理

**現況分析**:
- 存在多處 `console.log`、`console.error`（10+ 處）
- 有未使用的導入和變數
- 註解不一致

**優化建議**:
1. **移除或替換 console 語句**
   ```typescript
   // 建立統一的日誌系統
   // utils/logger.ts
   export const logger = {
     debug: (...args: unknown[]) => {
       if (import.meta.env.DEV) console.log('[DEBUG]', ...args);
     },
     error: (...args: unknown[]) => {
       console.error('[ERROR]', ...args);
       // 可整合錯誤追蹤服務
     },
     info: (...args: unknown[]) => {
       if (import.meta.env.DEV) console.info('[INFO]', ...args);
     }
   };
   ```

2. **使用 ESLint 規則自動清理**
   ```json
   // .eslintrc.json
   {
     "rules": {
       "no-console": ["warn", { "allow": ["warn", "error"] }],
       "no-unused-vars": "error",
       "@typescript-eslint/no-unused-vars": "error"
     }
   }
   ```

**優先級**: 🟡 中

---

## ⚡ 三、性能優化

### 3.1 React 渲染優化

**現況分析**:
- 部分組件沒有使用 `React.memo`
- 一些回調函數沒有使用 `useCallback`
- 複雜計算沒有使用 `useMemo`

**問題範例**:
```typescript
// App.tsx - latestHistoryItem 已使用 useMemo，但其他計算沒有
const latestHistoryItem = useMemo(() => {
  return gameState.history.length > 0 
    ? gameState.history[gameState.history.length - 1] 
    : null;
}, [gameState.history]);

// 但 handleDownloadItinerary 中的 HTML 生成沒有 memoize
const handleDownloadItinerary = useCallback(() => {
  const htmlContent = `...`; // 每次渲染都會重新生成
}, [gameState.history, gameState.userData.nickname]);
```

**優化建議**:
1. **Memoize 複雜計算**
   ```typescript
   const htmlContent = useMemo(() => {
     return generateItineraryHTML(gameState.history, gameState.userData);
   }, [gameState.history, gameState.userData]);
   ```

2. **使用 React.memo 優化子組件**
   ```typescript
   export const CitySelectionScreen = React.memo<CitySelectionScreenProps>(
     ({ cityOptions, onCitySelect }) => {
       // ...
     },
     (prevProps, nextProps) => {
       // 自訂比較邏輯
       return prevProps.cityOptions === nextProps.cityOptions;
     }
   );
   ```

3. **優化列表渲染**
   ```typescript
   // 使用虛擬滾動（如果列表很長）
   import { FixedSizeList } from 'react-window';
   ```

**優先級**: 🟡 中

---

### 3.2 圖片載入優化

**現況分析**:
- 圖片沒有懶加載（lazy loading）
- 沒有圖片預載入機制
- Base64 圖片直接嵌入，沒有優化

**優化建議**:
1. **實作圖片懶加載**
   ```typescript
   <img
     src={cityPhotoUrl}
     loading="lazy"
     decoding="async"
     alt="Ailisha 在城市中"
   />
   ```

2. **使用 WebP 格式並提供降級方案**
   ```typescript
   <picture>
     <source srcSet={webpUrl} type="image/webp" />
     <source srcSet={jpgUrl} type="image/jpeg" />
     <img src={jpgUrl} alt="..." />
   </picture>
   ```

3. **圖片預載入**
   ```typescript
   // 預載入下一站的城市照片
   useEffect(() => {
     if (nextCityPhotoUrl) {
       const link = document.createElement('link');
       link.rel = 'preload';
       link.as = 'image';
       link.href = nextCityPhotoUrl;
       document.head.appendChild(link);
     }
   }, [nextCityPhotoUrl]);
   ```

**優先級**: 🟡 中

---

### 3.3 Bundle 大小優化

**現況分析**:
- 沒有分析 bundle 大小
- 可能包含未使用的依賴

**優化建議**:
1. **分析 Bundle 大小**
   ```bash
   npm install --save-dev vite-bundle-visualizer
   # 在 vite.config.ts 中配置
   ```

2. **程式碼分割**
   ```typescript
   // 路由級別的程式碼分割
   const SummaryScreen = lazy(() => import('./components/screens/SummaryScreen'));
   
   <Suspense fallback={<LoadingScreen />}>
     <SummaryScreen />
   </Suspense>
   ```

3. **移除未使用的依賴**
   - 使用 `depcheck` 檢查未使用的依賴
   - 定期審查 `package.json`

**優先級**: 🟢 低

---

## 🔒 四、安全性優化

### 4.1 API Key 管理

**現況分析**:
- API Key 從環境變數讀取，但仍有 localStorage 備份機制（未使用）
- 沒有 API Key 驗證機制
- API Key 可能在前端暴露

**問題**:
```typescript
// contexts/ApiKeyContext.tsx
const setApiKey = useCallback((key: string | null) => {
  setApiKeyState(key);
  if (key) {
    localStorage.setItem(STORAGE_KEY, key); // 儲存在 localStorage
  }
}, []);
```

**優化建議**:
1. **移除 localStorage 儲存機制**
   - API Key 只應存在環境變數中
   - 不應儲存在客戶端

2. **實作 API Key 驗證**
   ```typescript
   async function validateApiKey(apiKey: string): Promise<boolean> {
     try {
       // 發送一個輕量級請求驗證 API Key
       const response = await fetch('...', {
         headers: { 'Authorization': `Bearer ${apiKey}` }
       });
       return response.ok;
     } catch {
       return false;
     }
   }
   ```

3. **考慮使用後端代理**
   - 將 API Key 儲存在後端
   - 前端通過後端代理調用 Gemini API
   - 避免 API Key 暴露在前端

**優先級**: 🔴 高

---

### 4.2 輸入驗證與清理

**現況分析**:
- 圖片上傳有基本驗證
- HTML 匯出沒有 XSS 防護

**優化建議**:
1. **強化輸入驗證**
   ```typescript
   // 使用 zod 進行輸入驗證
   const UserDataSchema = z.object({
     nickname: z.string().min(1).max(20).regex(/^[\w\s\u4e00-\u9fa5]+$/),
     selfieBase64: z.string().regex(/^data:image\/(jpeg|jpg|png|webp);base64,/),
   });
   ```

2. **防止 XSS 攻擊**
   ```typescript
   // 匯出 HTML 時清理用戶輸入
   import DOMPurify from 'dompurify';
   
   const safeNickname = DOMPurify.sanitize(userData.nickname);
   ```

**優先級**: 🟡 中

---

## 🧪 五、測試覆蓋率

### 5.1 單元測試

**現況分析**:
- **完全沒有測試檔案**
- 這是專案最大的缺失

**優化建議**:
1. **建立測試框架**
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

2. **優先測試的模組**:
   - `utils/travelLogic.ts` - 核心業務邏輯
   - `utils/storage.ts` - 儲存邏輯
   - `hooks/useGameState.ts` - 狀態管理
   - `services/geminiService.ts` - API 服務

3. **測試範例**:
   ```typescript
   // utils/travelLogic.test.ts
   import { describe, it, expect } from 'vitest';
   import { getNextCities } from './travelLogic';
   
   describe('getNextCities', () => {
     it('應該返回指定數量的城市', () => {
       const cities = getNextCities(1, 25.0);
       expect(cities.length).toBe(3);
     });
   });
   ```

**優先級**: 🔴 高

---

### 5.2 整合測試

**優化建議**:
1. **測試遊戲流程**
   - 測試完整的遊戲流程（開始 → 選擇城市 → 選擇景點 → 生成照片）
   - 使用 MSW (Mock Service Worker) 模擬 API

2. **測試錯誤處理**
   - 測試 API 失敗情況
   - 測試網路錯誤情況

**優先級**: 🟡 中

---

### 5.3 E2E 測試

**優化建議**:
1. **使用 Playwright 或 Cypress**
   ```bash
   npm install --save-dev @playwright/test
   ```

2. **測試關鍵用戶流程**
   - 用戶註冊和上傳照片
   - 完成一輪遊戲
   - 匯出遊記

**優先級**: 🟢 低

---

## ♿ 六、可訪問性 (A11y) 優化

### 6.1 鍵盤導航

**現況分析**:
- 部分組件有鍵盤支援，但不完整
- 沒有焦點管理

**優化建議**:
1. **完整的鍵盤導航支援**
   ```typescript
   // 所有互動元素都應該支援鍵盤
   <button
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         handleClick();
       }
     }}
   >
   ```

2. **焦點管理**
   ```typescript
   // 頁面切換時自動聚焦到主要內容
   useEffect(() => {
     const mainContent = document.querySelector('main');
     mainContent?.focus();
   }, [gameState]);
   ```

**優先級**: 🟡 中

---

### 6.2 ARIA 標籤

**現況分析**:
- 部分組件有 ARIA 標籤，但不完整

**優化建議**:
1. **完善 ARIA 標籤**
   ```typescript
   <div
     role="dialog"
     aria-labelledby="modal-title"
     aria-describedby="modal-description"
   >
     <h2 id="modal-title">標題</h2>
     <p id="modal-description">描述</p>
   </div>
   ```

2. **使用語義化 HTML**
   - 使用 `<nav>`, `<main>`, `<article>` 等語義標籤
   - 正確使用標題層級（h1-h6）

**優先級**: 🟡 中

---

## 📚 七、文檔與可維護性

### 7.1 程式碼文檔

**現況分析**:
- 部分函數有 JSDoc，但不完整
- 複雜邏輯缺少註解

**優化建議**:
1. **完善 JSDoc 註解**
   ```typescript
   /**
    * 根據緯度邏輯選擇下一批城市
    * 
    * @param round - 當前回合數（1-6）
    * @param previousLat - 上一站的緯度
    * @returns 候選城市陣列，最多返回 GAME_CONFIG.CITIES_PER_ROUND 個
    * 
    * @example
    * ```typescript
    * const cities = getNextCities(1, 25.0);
    * // 返回 3 個候選城市
    * ```
    */
   export const getNextCities = (round: number, previousLat: number): City[] => {
     // ...
   };
   ```

2. **建立架構文檔**
   - `docs/ARCHITECTURE.md` - 架構說明
   - `docs/API.md` - API 文檔
   - `docs/CONTRIBUTING.md` - 貢獻指南

**優先級**: 🟡 中

---

### 7.2 常數管理

**現況分析**:
- 常數分散在多個檔案
- 有硬編碼值

**優化建議**:
1. **集中管理常數**
   ```typescript
   // constants/index.ts
   export const GAME_CONFIG = {
     TOTAL_ROUNDS: 6,
     CITIES_PER_ROUND: 3,
     // ...
   } as const;
   
   export const API_CONFIG = {
     MAX_RETRIES: 3,
     RETRY_DELAY: 1000,
     TIMEOUT: 30000,
   } as const;
   ```

2. **使用環境變數**
   ```typescript
   // 將可配置的值移到環境變數
   const MAX_FILE_SIZE = import.meta.env.VITE_MAX_FILE_SIZE || 5 * 1024 * 1024;
   ```

**優先級**: 🟢 低

---

## 🔧 八、開發體驗優化

### 8.1 開發工具

**優化建議**:
1. **整合 React DevTools**
   - 確保開發環境可以使用 React DevTools

2. **整合 Redux DevTools（如果使用 Zustand）**
   ```typescript
   import { devtools } from 'zustand/middleware';
   
   const useStore = create(
     devtools((set) => ({
       // ...
     }), { name: 'GameStore' })
   );
   ```

3. **建立開發腳本**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "dev:analyze": "vite-bundle-visualizer",
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

**優先級**: 🟢 低

---

### 8.2 Git Hooks

**優化建議**:
1. **使用 Husky + lint-staged**
   ```bash
   npm install --save-dev husky lint-staged
   ```

2. **配置 pre-commit hook**
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
       "*.{json,md}": ["prettier --write"]
     }
   }
   ```

**優先級**: 🟢 低

---

## 📊 九、優化優先級總結

### 🔴 高優先級（立即處理）

1. ✅ **建立測試框架並撰寫核心邏輯測試**
2. ✅ **統一錯誤處理機制**
3. ✅ **移除所有 `any` 類型，提升類型安全**
4. ✅ **API Key 安全性改進（移除 localStorage 儲存）**
5. ✅ **建立 API Client 抽象層並實作重試機制**

### 🟡 中優先級（近期處理）

1. ✅ **引入狀態管理庫（Zustand）**
2. ✅ **完善錯誤處理和錯誤追蹤**
3. ✅ **性能優化（React.memo、useMemo）**
4. ✅ **圖片載入優化（懶加載、WebP）**
5. ✅ **可訪問性改進（ARIA、鍵盤導航）**
6. ✅ **輸入驗證強化**

### 🟢 低優先級（長期改進）

1. ✅ **Bundle 大小優化**
2. ✅ **E2E 測試**
3. ✅ **文檔完善**
4. ✅ **開發工具整合**

---

## 🎯 十、具體實作建議

### 階段一：基礎優化（1-2 週）

1. **清理程式碼**
   - 移除 console.log
   - 移除未使用的導入
   - 統一錯誤處理

2. **類型安全**
   - 移除所有 `any`
   - 完善類型定義
   - 使用 zod 進行運行時驗證

3. **測試基礎**
   - 建立測試框架
   - 撰寫核心邏輯測試

### 階段二：架構優化（2-3 週）

1. **狀態管理**
   - 引入 Zustand
   - 重構狀態結構

2. **API 層優化**
   - 建立 API Client
   - 實作重試機制
   - 實作請求取消

3. **錯誤處理**
   - 統一錯誤處理
   - 整合錯誤追蹤

### 階段三：性能與體驗（1-2 週）

1. **性能優化**
   - React 渲染優化
   - 圖片優化
   - Bundle 優化

2. **可訪問性**
   - ARIA 標籤
   - 鍵盤導航
   - 焦點管理

---

## 📝 十一、其他建議

### 11.1 國際化 (i18n)

**建議**: 如果未來需要支援多語言，建議現在就建立 i18n 架構
```typescript
// 使用 react-i18next
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<p>{t('city.description', { city: city.name })}</p>
```

### 11.2 分析與監控

**建議**: 整合分析工具
- Google Analytics / Plausible Analytics
- 錯誤追蹤：Sentry
- 性能監控：Web Vitals

### 11.3 CI/CD 優化

**建議**: 建立完整的 CI/CD 流程
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

---

## ✅ 結論

本專案整體架構良好，組件化程度高，但在**測試覆蓋率**、**類型安全**、**錯誤處理**、**安全性**等方面還有很大改進空間。建議按照優先級逐步實作優化，優先處理高優先級項目，特別是測試框架的建立和類型安全的提升。

---

**報告完成日期**: 2024-12-XX  
**下次檢視建議**: 完成階段一優化後

