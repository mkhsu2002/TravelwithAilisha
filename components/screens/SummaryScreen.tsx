import React, { useState } from 'react';
import { TravelHistoryItem, UserData } from '../../types';
import { Button } from '../Button';
import { PromptModal } from '../PromptModal';

interface SummaryScreenProps {
  userData: UserData;
  history: TravelHistoryItem[];
  onDownloadItinerary: () => void;
  onNewJourney: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  userData,
  history,
  onDownloadItinerary,
  onNewJourney,
}) => {
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean; prompt: string; title: string }>({
    isOpen: false,
    prompt: '',
    title: '',
  });

  const openPromptModal = (prompt: string, title: string) => {
    setPromptModal({ isOpen: true, prompt, title });
  };

  const closePromptModal = () => {
    setPromptModal({ isOpen: false, prompt: '', title: '' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 標題區域 */}
      <div className="text-center mb-12 sm:mb-16 mt-6 sm:mt-8 animate-fade-in">
        <div className="inline-block p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl mb-6 animate-scale-in">
          <span className="text-5xl sm:text-6xl block">🌍</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          我的世界之旅
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          與 <span className="text-pink-600 font-bold">Ailisha 艾莉莎</span> • {new Date().toLocaleDateString('zh-TW')}
        </p>
      </div>

      {/* 時間軸 */}
      <div className="space-y-8 sm:space-y-12 relative pb-8">
        {/* 時間軸線 */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-200 via-pink-400 to-purple-200 transform -translate-x-1/2 rounded-full shadow-lg"></div>
        
        {history.map((item, idx) => (
          <div
            key={`${item.city.name}-${item.landmark.name}-${idx}`}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* 時間軸節點 */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-white bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ring-4 ring-pink-100">
              <span className="text-base sm:text-lg font-bold">{idx + 1}</span>
            </div>
            
            {/* 內容卡片 */}
            <div className="w-[calc(100%-4rem)] sm:w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] card card-hover p-5 sm:p-6 lg:p-8">
              {/* 城市照片 */}
              <div className="mb-4 rounded-2xl overflow-hidden shadow-xl relative group/photo border-2 border-gray-100" style={{ aspectRatio: '9/16' }}>
                <img
                  src={item.cityPhotoUrl}
                  alt={`Ailisha 在 ${item.city.name}`}
                  className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity"></div>
                {item.cityPhotoPrompt && (
                  <button
                    onClick={() => openPromptModal(item.cityPhotoPrompt, `城市照片提示詞 - ${item.city.name}`)}
                    className="absolute top-3 right-3 bg-black/80 hover:bg-black/95 backdrop-blur-sm text-white p-2.5 rounded-xl transition-all shadow-xl hover:scale-110 z-10"
                    aria-label="查看提示詞"
                    title="查看提示詞"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 景點合照 */}
              {item.landmarkPhotoUrl && (
                <div className="mb-4 rounded-2xl overflow-hidden shadow-xl relative group/photo border-2 border-gray-100" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={item.landmarkPhotoUrl}
                    alt={`與 Ailisha 在 ${item.landmark.name}`}
                    className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity"></div>
                  {item.landmarkPhotoPrompt && (
                    <button
                      onClick={() => openPromptModal(item.landmarkPhotoPrompt, `景點合照提示詞 - ${item.landmark.name}`)}
                      className="absolute top-3 right-3 bg-black/80 hover:bg-black/95 backdrop-blur-sm text-white p-2.5 rounded-xl transition-all shadow-xl hover:scale-110 z-10"
                      aria-label="查看提示詞"
                      title="查看提示詞"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* 文字內容 */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-gray-900 mb-2">
                    {item.city.name}, {item.city.country}
                  </h3>
                  <p className="text-sm sm:text-base text-pink-600 font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span>{item.landmark.name}</span>
                  </p>
                </div>
                
                {item.diaryEntry && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-5 rounded-xl border border-pink-100">
                    <p className="text-gray-700 text-sm sm:text-base italic leading-relaxed">
                      "{item.diaryEntry}"
                    </p>
                  </div>
                )}
                
                {item.date && (
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {item.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按鈕 */}
      <div className="mt-16 sm:mt-20 text-center flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pb-12 animate-fade-in">
        <Button
          variant="secondary"
          onClick={onDownloadItinerary}
          className="py-4 sm:py-5 text-base sm:text-lg px-8 sm:px-10"
          aria-label="下載完整遊記"
        >
          <span className="flex items-center gap-2">
            <span>📥</span>
            <span>下載完整遊記 (HTML)</span>
          </span>
        </Button>
        <Button
          onClick={onNewJourney}
          className="py-4 sm:py-5 text-base sm:text-lg px-8 sm:px-10"
          aria-label="開始新的旅程"
        >
          <span className="flex items-center gap-2">
            <span>🔄</span>
            <span>開始新的旅程</span>
          </span>
        </Button>
      </div>

      <PromptModal
        isOpen={promptModal.isOpen}
        onClose={closePromptModal}
        prompt={promptModal.prompt}
        title={promptModal.title}
      />
    </div>
  );
};

