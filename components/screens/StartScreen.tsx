import React, { useState } from 'react';
import { UserData } from '../../types';
import { Button } from '../Button';
import { PhotoUpload } from '../PhotoUpload';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import { useApiKey } from '../../contexts/ApiKeyContext';
import { ApiKeyModal } from '../ApiKeyModal';

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
  const { isConfigured } = useApiKey();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleImageSelected = async (base64: string) => {
    onUserDataChange({ ...userData, selfieBase64: base64 });
  };

  const handleStart = () => {
    if (!isConfigured) {
      setIsApiKeyModalOpen(true);
      onError?.('請先配置 API Key 才能開始旅程');
      return;
    }
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
    } catch (err) {
      onError?.('圖片處理失敗，請重試');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          與 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ailisha</span><br/>一起環遊世界
        </h1>
        <p className="text-gray-600 leading-relaxed">
          嗨！我是 Ailisha 艾莉莎。<br/>
          上傳一張自拍，我們馬上從 <b className="text-gray-800">台北 101</b> 出發！ 🌍 ✨
        </p>
      </div>

      <div className="w-full space-y-5 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 mb-2">
            您的暱稱
          </label>
          <input
            id="nickname"
            type="text"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-gray-800 font-medium placeholder-gray-400 transition-all"
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
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
              <img src={userData.selfieBase64} className="w-full h-full object-cover" alt="預覽" />
            </div>
          </div>
        )}

        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  需要配置 API Key
                </p>
                <p className="text-xs text-yellow-700 mb-2">
                  請先設定 Gemini API Key 才能開始旅程
                </p>
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="text-xs text-yellow-800 underline hover:text-yellow-900 font-medium"
                >
                  點擊設定 API Key
                </button>
              </div>
            </div>
          </div>
        )}

        <Button
          disabled={!userData.nickname || !userData.selfieBase64 || !isConfigured}
          onClick={handleStart}
          className="text-lg py-4 shadow-pink-500/20"
          aria-label="開始旅程"
        >
          出發去旅行！ ✈️
        </Button>
      </div>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

