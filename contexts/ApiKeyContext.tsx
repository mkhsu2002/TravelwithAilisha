import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isConfigured: boolean;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // 僅從環境變數讀取 API Key（避免暴露）
  // 安全性：API Key 不應儲存在 localStorage 或任何客戶端儲存中
  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim() !== '') {
      setApiKeyState(envKey.trim());
      logger.info('API Key 已從環境變數載入', 'ApiKeyContext');
    } else {
      logger.warn('VITE_GEMINI_API_KEY 未設定，請在環境變數中配置', 'ApiKeyContext');
    }
  }, []);

  // 注意：setApiKey 僅用於開發環境測試，生產環境應只從環境變數讀取
  const setApiKey = useCallback((key: string | null) => {
    if (import.meta.env.PROD) {
      logger.warn('生產環境不允許動態設定 API Key', 'ApiKeyContext');
      return;
    }
    setApiKeyState(key);
    logger.debug('API Key 已更新', 'ApiKeyContext');
  }, []);

  const clearApiKey = useCallback(() => {
    if (import.meta.env.PROD) {
      logger.warn('生產環境不允許清除 API Key', 'ApiKeyContext');
      return;
    }
    setApiKeyState(null);
    logger.debug('API Key 已清除', 'ApiKeyContext');
  }, []);

  const isConfigured = apiKey !== null && apiKey.trim() !== '';

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        isConfigured,
        clearApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};

