import React from 'react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-pink-50/95 via-white/95 to-purple-50/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="載入中"
    >
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        {/* 載入動畫 */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32">
          <div className="absolute inset-0 border-4 border-pink-100 rounded-full" aria-hidden="true"></div>
          <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl animate-bounce" aria-hidden="true">✈️</span>
          </div>
        </div>
        
        {/* 文字內容 */}
        <div className="space-y-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">請稍候...</h3>
          <p className="text-base sm:text-lg text-gray-600 animate-pulse font-medium px-4">
            {message || '處理中...'}
          </p>
        </div>
        
        {/* 進度點 */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

