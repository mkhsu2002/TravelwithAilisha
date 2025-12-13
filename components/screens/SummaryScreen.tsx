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
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-2">我的世界之旅</h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium">
          與 Ailisha 艾莉莎 • {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8 sm:space-y-12 relative before:absolute before:inset-0 before:ml-4 sm:before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pink-200 before:via-pink-400 before:to-pink-200">
        {history.map((item, idx) => (
          <div
            key={`${item.city.name}-${item.landmark.name}-${idx}`}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 sm:border-4 border-white bg-pink-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-xs sm:text-sm font-bold">{idx + 1}</span>
            </div>
            
            <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-50 hover:-translate-y-1 transition-transform duration-300">
              {/* 城市照片 */}
              <div className="mb-3 rounded-lg sm:rounded-xl overflow-hidden shadow-inner relative group" style={{ aspectRatio: '9/16' }}>
                <img
                  src={item.cityPhotoUrl}
                  alt={`Ailisha 在 ${item.city.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {item.cityPhotoPrompt && (
                  <button
                    onClick={() => openPromptModal(item.cityPhotoPrompt, `城市照片提示詞 - ${item.city.name}`)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all shadow-lg"
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
                <div className="mb-4 rounded-lg sm:rounded-xl overflow-hidden shadow-inner relative group" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={item.landmarkPhotoUrl}
                    alt={`與 Ailisha 在 ${item.landmark.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {item.landmarkPhotoPrompt && (
                    <button
                      onClick={() => openPromptModal(item.landmarkPhotoPrompt, `景點合照提示詞 - ${item.landmark.name}`)}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all shadow-lg"
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
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">
                {item.city.name}, {item.city.country}
              </h3>
              <p className="text-xs sm:text-sm text-pink-500 font-bold mb-2 sm:mb-3 flex items-center gap-1">
                📍 {item.landmark.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 italic bg-gray-50 p-2 sm:p-3 rounded-lg">
                "{item.diaryEntry}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 sm:mt-16 text-center flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pb-8 sm:pb-12">
        <Button
          variant="secondary"
          onClick={onDownloadItinerary}
          className="py-3 sm:py-4 text-sm sm:text-base"
          aria-label="下載完整遊記"
        >
          📥 下載完整遊記 (HTML)
        </Button>
        <Button
          onClick={onNewJourney}
          className="py-3 sm:py-4 text-sm sm:text-base"
          aria-label="開始新的旅程"
        >
          🔄 開始新的旅程
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

