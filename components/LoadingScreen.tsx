import React from 'react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div
      className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="載入中"
    >
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" aria-hidden="true"></div>
        <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden="true">✈️</div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">請稍候...</h3>
      <p className="text-gray-500 animate-pulse font-medium">{message}</p>
    </div>
  );
};

