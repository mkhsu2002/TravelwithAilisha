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
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
        {/* 標題區域 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            與 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ailisha</span> 一起環遊世界
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            嗨！我是 <span className="font-bold text-pink-600">Ailisha 艾莉莎</span>
            <br />
            上傳一張自拍，我們馬上從 <span className="font-bold text-gray-800">台北 101</span> 出發！ 🌍 ✨
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="w-full space-y-5 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <div>
            <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 mb-2">
              您的暱稱
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-gray-800 font-medium placeholder-gray-400 transition-all"
              placeholder="例如：冒險家小明"
              value={userData.nickname}
              onChange={(e) => onUserDataChange({ ...userData, nickname: e.target.value })}
              aria-label="輸入您的暱稱"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              您的自拍照
            </label>
            <PhotoUpload onImageSelected={handleImageSelected} onFileChange={handleFileChange} />
          </div>
          
          {userData.selfieBase64 && (
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 shadow-md">
                <img 
                  src={userData.selfieBase64} 
                  className="w-full h-full object-cover" 
                  alt="預覽" 
                />
              </div>
            </div>
          )}

          <Button
            disabled={!userData.nickname || !userData.selfieBase64}
            onClick={handleStart}
            className="text-lg py-4 w-full"
            aria-label="開始旅程"
          >
            出發去旅行！ ✈️
          </Button>
        </div>
      </div>
    </div>
  );
};

