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
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-lg mx-auto space-y-8 animate-fade-in">
        {/* 標題區域 */}
        <div className="text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            與 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600">Ailisha</span> 一起環遊世界
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
            嗨！我是 <span className="font-bold text-pink-600">Ailisha 艾莉莎</span>
            <br />
            上傳一張自拍，我們馬上從 <span className="font-bold text-gray-800 bg-pink-50 px-2 py-1 rounded-md">台北 101</span> 出發！ 🌍 ✨
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div>
            <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 mb-3">
              您的暱稱
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none text-gray-800 font-medium placeholder-gray-400 transition-all hover:border-pink-300"
              placeholder="例如：冒險家小明"
              value={userData.nickname}
              onChange={(e) => onUserDataChange({ ...userData, nickname: e.target.value })}
              aria-label="輸入您的暱稱"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              您的自拍照
            </label>
            <PhotoUpload 
              onImageSelected={handleImageSelected} 
              onFileChange={handleFileChange}
              previewImage={userData.selfieBase64}
            />
          </div>

          <Button
            disabled={!userData.nickname || !userData.selfieBase64}
            onClick={handleStart}
            className="text-lg sm:text-xl py-4 w-full mt-2"
            aria-label="開始旅程"
          >
            出發去旅行！ ✈️
          </Button>
        </div>
      </div>
    </div>
  );
};

