import React, { useState, useEffect } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import { Button } from './Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, isConfigured } = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(apiKey || '');
      setShowKey(false);
      setError('');
    }
  }, [isOpen, apiKey]);

  const handleSave = () => {
    const trimmedKey = inputValue.trim();
    
    if (!trimmedKey) {
      setError('請輸入 API Key');
      return;
    }

    setApiKey(trimmedKey);
    setError('');
    onClose();
  };

  const handleClear = () => {
    setInputValue('');
    setApiKey(null);
    setError('');
  };

  const handleGetKey = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="關閉"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          id="api-key-modal-title"
          className="text-3xl font-bold text-white text-center mb-4"
        >
          Setup Gemini API
        </h2>

        {/* Description */}
        <div className="text-white/90 text-sm text-center mb-6 space-y-2">
          <p>為了確保安全，請使用您自己的 API Key。</p>
          <p>您的 Key 只會儲存在瀏覽器中，不會上傳至伺服器。</p>
        </div>

        {/* Input Label */}
        <label
          htmlFor="api-key-input"
          className="block text-white text-sm font-bold uppercase tracking-wider mb-2"
        >
          GEMINI API KEY
        </label>

        {/* Input Field */}
        <div className="relative mb-4">
          <input
            id="api-key-input"
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder="輸入您的 API Key"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            aria-label="Gemini API Key 輸入欄位"
            aria-describedby={error ? 'api-key-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label={showKey ? '隱藏 API Key' : '顯示 API Key'}
          >
            {showKey ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.75l1.006 1.006M9.88 9.75l1.006-1.006m-1.006 1.006L9.88 9.75m1.006 1.006l1.006 1.006m-1.006-1.006l-1.006 1.006M12 12l.01.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p id="api-key-error" className="text-red-400 text-sm mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Status */}
        {isConfigured && inputValue === apiKey && (
          <div className="mb-4 flex items-center gap-2 text-green-400 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>API Key 已配置</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30"
            aria-label="儲存並開始使用"
          >
            開始使用
          </Button>
          
          {isConfigured && (
            <button
              onClick={handleClear}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
              aria-label="清除 API Key"
            >
              清除 API Key
            </button>
          )}
        </div>

        {/* Get Key Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGetKey}
            className="text-white/80 hover:text-white text-sm underline transition-colors"
            aria-label="前往獲取 API Key"
          >
            還沒有 Key? 點此免費獲取
          </button>
        </div>
      </div>
    </div>
  );
};

