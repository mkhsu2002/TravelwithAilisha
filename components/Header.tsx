import React, { useState } from 'react';
import { AILISHA_NAME, AILISHA_AVATAR_URL, TOTAL_ROUNDS } from '../constants';
import { UserData } from '../types';
import { ApiKeyModal } from './ApiKeyModal';
import { useApiKey } from '../contexts/ApiKeyContext';

interface HeaderProps {
  userData: UserData;
  currentRound: number;
}

export const Header: React.FC<HeaderProps> = ({ userData, currentRound }) => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const { isConfigured } = useApiKey();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm p-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 ring-2 ring-pink-100">
            <img
              src={AILISHA_AVATAR_URL}
              alt="Ailisha"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-pink-600 text-lg leading-tight">
              與 Ailisha 艾莉莎環遊世界
            </h1>
            <p className="text-xs text-gray-500">
              {currentRound <= TOTAL_ROUNDS ? `第 ${currentRound} / ${TOTAL_ROUNDS} 站` : '旅程結束'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* API Key 管理按鈕 */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${isConfigured
                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
              }
            `}
            aria-label="管理 API Key"
            title={isConfigured ? 'API Key 已配置' : '需要配置 API Key'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="hidden sm:inline">
              {isConfigured ? 'API Key' : '設定 API Key'}
            </span>
          </button>
          
          {userData.selfieBase64 && (
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={userData.selfieBase64} alt="您" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </header>
      
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </>
  );
};

