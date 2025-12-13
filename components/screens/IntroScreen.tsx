import React from 'react';
import { UserData } from '../../types';

interface IntroScreenProps {
  userData: UserData;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ userData }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-6 px-4 sm:px-6 text-center animate-fade-in">
      <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 animate-bounce" aria-hidden="true">🇹🇼 ➡️ 🌏</div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-800">起點：台北 101！</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-xs mx-auto leading-relaxed px-2">
        太興奮了，{userData.nickname}！我們將從台北出發。
        我正在計算最佳的順時針飛行路線...
      </p>
      <div className="animate-spin text-pink-500 text-3xl sm:text-5xl" aria-label="載入中">✈️</div>
    </div>
  );
};

