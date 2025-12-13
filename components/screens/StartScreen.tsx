import React from 'react';
import { UserData } from '../../types';
import { Button } from '../Button';
import { PhotoUpload } from '../PhotoUpload';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import { logger } from '../../utils/logger';

interface StartScreenProps {
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  onStart: () => void;
  onError?: (message: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  userData,
  onUserDataChange,
  onStart,
  onError,
}) => {

  const handleImageSelected = async (base64: string) => {
    onUserDataChange({ ...userData, selfieBase64: base64 });
  };

  const handleStart = () => {
    onStart();
  };

  const handleFileChange = async (file: File) => {
    // 驗證檔案
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError?.(validation.error || '檔案驗證失敗');
      return;
    }

    try {
      // 壓縮圖片
      const compressedBase64 = await compressImage(file);
      handleImageSelected(compressedBase64);
    } catch (error: unknown) {
      onError?.('圖片處理失敗，請重試');
      // 錯誤已通過 onError 回調處理，這裡只記錄
      logger.error('圖片處理失敗', 'StartScreen', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mx-auto space-y-8 animate-fade-in">
        {/* 標題區域 */}
        <div className="text-center space-y-6">
          <div className="inline-block p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl mb-4 animate-scale-in">
            <span className="text-6xl sm:text-7xl block">🌍</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            與 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 animate-gradient">Ailisha</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">一起環遊世界</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-md mx-auto px-4">
            嗨！我是 <span className="font-bold text-pink-600">Ailisha 艾莉莎</span>
            <br />
            上傳一張自拍，我們馬上從 <span className="font-bold text-gray-800 bg-pink-50 px-2 py-1 rounded-lg">台北 101</span> 出發！ ✨
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="w-full space-y-6 bg-white/90 backdrop-blur-lg p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-pink-100/50 card-hover">
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <span>您的暱稱</span>
            </label>
            <input
              id="nickname"
              type="text"
              className="input-modern text-base sm:text-lg"
              placeholder="例如：冒險家小明"
              value={userData.nickname}
              onChange={(e) => onUserDataChange({ ...userData, nickname: e.target.value })}
              aria-label="輸入您的暱稱"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <span>您的自拍照</span>
            </label>
            <PhotoUpload onImageSelected={handleImageSelected} onFileChange={handleFileChange} />
          </div>
          
          {userData.selfieBase64 && (
            <div className="flex justify-center animate-scale-in">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-xl ring-4 ring-pink-100">
                  <img 
                    src={userData.selfieBase64} 
                    className="w-full h-full object-cover" 
                    alt="預覽" 
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg animate-bounce">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              disabled={!userData.nickname || !userData.selfieBase64}
              onClick={handleStart}
              className="text-lg sm:text-xl py-5 shadow-pink-500/30 w-full"
              aria-label="開始旅程"
            >
              <span className="flex items-center justify-center gap-2">
                <span>出發去旅行！</span>
                <span className="text-2xl animate-bounce">✈️</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

