import React from 'react';
import { UserData } from '../../types';

interface IntroScreenProps {
  userData: UserData;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ userData }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 動畫圖標 */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
          <div className="text-5xl sm:text-6xl lg:text-7xl animate-bounce" style={{ animationDelay: '0s' }} aria-hidden="true">
            🇹🇼
          </div>
          <div className="text-4xl sm:text-5xl animate-pulse" style={{ animationDelay: '0.2s' }} aria-hidden="true">
            ➡️
          </div>
          <div className="text-5xl sm:text-6xl lg:text-7xl animate-bounce" style={{ animationDelay: '0.4s' }} aria-hidden="true">
            🌏
          </div>
        </div>
        
        {/* 標題 */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
            起點：<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">台北 101</span>！
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-lg mx-auto leading-relaxed px-4">
            太興奮了，<span className="font-bold text-pink-600">{userData.nickname}</span>！
            <br className="hidden sm:block" />
            我們將從台北出發。
            <br />
            我正在計算最佳的順時針飛行路線...
          </p>
        </div>
        
        {/* 載入動畫 */}
        <div className="flex flex-col items-center gap-4 mt-12">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-pink-200 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl animate-bounce" aria-label="載入中">✈️</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-500 font-medium animate-pulse">
            準備中...
          </p>
        </div>
      </div>
    </div>
  );
};

