import React from 'react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div
      className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="載入中"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 relative">
        <div className="absolute inset-0 border-3 sm:border-4 border-gray-100 rounded-full" aria-hidden="true"></div>
        <div className="absolute inset-0 border-3 sm:border-4 border-pink-500 rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl" aria-hidden="true">✈️</div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">請稍候...</h3>
      <p className="text-sm sm:text-base text-gray-500 animate-pulse font-medium px-4">{message}</p>
    </div>
  );
};

