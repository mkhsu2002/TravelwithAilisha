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

  // 載入儲存的 API Key
  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      setApiKeyState(storedKey);
    } else {
      // 如果沒有儲存的 Key，嘗試從環境變數讀取
      const envKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (envKey) {
        setApiKeyState(envKey);
        localStorage.setItem(STORAGE_KEY, envKey);
      }
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

