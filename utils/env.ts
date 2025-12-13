/**
 * 環境變數驗證和獲取工具
 */

export const getGeminiApiKey = (): string => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  
  if (!key) {
    throw new Error(
      'GEMINI_API_KEY 未設定。請在 .env.local 檔案中設定 VITE_GEMINI_API_KEY'
    );
  }
  
  return key;
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

