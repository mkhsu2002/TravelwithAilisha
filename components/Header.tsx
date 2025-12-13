import React from 'react';
import { AILISHA_NAME, AILISHA_AVATAR_URL, TOTAL_ROUNDS } from '../constants';
import { UserData } from '../types';

interface HeaderProps {
  userData: UserData;
  currentRound: number;
}

export const Header: React.FC<HeaderProps> = ({ userData, currentRound }) => {
  const progressPercentage = currentRound <= TOTAL_ROUNDS 
    ? (currentRound / TOTAL_ROUNDS) * 100 
    : 100;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-md border-b border-pink-100/50">
      <div className="container-responsive">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-pink-400 ring-2 ring-pink-100 shadow-lg">
                <img
                  src={AILISHA_AVATAR_URL}
                  alt="Ailisha"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-md">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-extrabold text-pink-600 text-base sm:text-lg lg:text-xl leading-tight truncate">
                與 Ailisha 艾莉莎環遊世界
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {currentRound <= TOTAL_ROUNDS ? `第 ${currentRound} / ${TOTAL_ROUNDS} 站` : '旅程結束'}
                </p>
                <div className="hidden sm:block flex-1 max-w-32 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          {userData.selfieBase64 && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg ring-2 ring-pink-100 flex-shrink-0 ml-3">
              <img 
                src={userData.selfieBase64} 
                alt="您" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

