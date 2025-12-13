import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isConfigured: boolean;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = 'gemini_api_key';

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // 僅從環境變數讀取 API Key（避免暴露）
  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) {
      setApiKeyState(envKey);
    } else {
      console.warn('VITE_GEMINI_API_KEY 未設定，請在環境變數中配置');
    }
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState(null);
    localStorage.removeItem(STORAGE_KEY);
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

