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

  const handleFileChange = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError?.(validation.error || '檔案驗證失敗');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      handleImageSelected(compressedBase64);
    } catch (error: unknown) {
      onError?.('圖片處理失敗，請重試');
      logger.error('圖片處理失敗', 'StartScreen', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mx-auto space-y-8 sm:space-y-10">
        {/* 標題區域 */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            <div className="text-purple-600">與 Ailisha</div>
            <div className="text-gray-900">一起環遊世界</div>
          </h1>
          <div className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed space-y-1">
            <p>嗨!我是 Ailisha 艾莉莎。</p>
            <p>上傳一張自拍,我們馬上從 台北101 出發! 🌍 ✨</p>
          </div>
        </div>

        {/* 表單卡片 */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* 暱稱輸入 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              您的暱稱
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none text-gray-800 text-sm sm:text-base placeholder-gray-400 transition-all"
              placeholder="例如:冒險家小明"
              value={userData.nickname}
              onChange={(e) => onUserDataChange({ ...userData, nickname: e.target.value })}
              aria-label="輸入您的暱稱"
            />
          </div>
          
          {/* 照片上傳 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              您的自拍照
            </label>
            <PhotoUpload 
              onImageSelected={handleImageSelected} 
              onFileChange={handleFileChange}
              previewImage={userData.selfieBase64}
            />
          </div>

          {/* 開始按鈕 */}
          <Button
            disabled={!userData.nickname || !userData.selfieBase64}
            onClick={onStart}
            variant="primary"
            aria-label="開始旅程"
            className="mt-2"
          >
            出發去旅行! ✈️ ✓
          </Button>
        </div>
      </div>
    </div>
  );
};

