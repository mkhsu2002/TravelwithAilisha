import React from 'react';
import { AILISHA_NAME, AILISHA_AVATAR_URL, TOTAL_ROUNDS } from '../constants';
import { UserData } from '../types';

interface HeaderProps {
  userData: UserData;
  currentRound: number;
}

export const Header: React.FC<HeaderProps> = ({ userData, currentRound }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-pink-400 ring-2 ring-pink-100 flex-shrink-0">
          <img
            src={AILISHA_AVATAR_URL}
            alt="Ailisha"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-pink-600 text-sm sm:text-base lg:text-lg leading-tight truncate">
            與 Ailisha 艾莉莎環遊世界
          </h1>
          <p className="text-xs text-gray-500">
            {currentRound <= TOTAL_ROUNDS ? `第 ${currentRound} / ${TOTAL_ROUNDS} 站` : '旅程結束'}
          </p>
        </div>
      </div>
      {userData.selfieBase64 && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 ml-2">
          <img src={userData.selfieBase64} alt="您" className="w-full h-full object-cover" />
        </div>
      )}
    </header>
  );
};

