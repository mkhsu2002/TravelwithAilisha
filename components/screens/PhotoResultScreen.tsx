import React from 'react';
import { TravelHistoryItem, City } from '../../types';
import { TOTAL_ROUNDS } from '../../constants';
import { Button } from '../Button';

interface PhotoResultScreenProps {
  currentRound: number;
  selectedCity: City | null;
  generatedPhoto: string | null;
  latestHistoryItem: TravelHistoryItem | null;
  onNextRound: () => void;
}

export const PhotoResultScreen: React.FC<PhotoResultScreenProps> = ({
  currentRound,
  selectedCity,
  generatedPhoto,
  latestHistoryItem,
  onNextRound,
}) => {
  // 移除調試日誌，使用 logger（如需要）
  // React.useEffect(() => {
  //   if (latestHistoryItem) {
  //     logger.debug('PhotoResultScreen 載入', 'PhotoResultScreen', {
  //       round: latestHistoryItem.round,
  //       city: latestHistoryItem.city.name,
  //     });
  //   }
  // }, [latestHistoryItem]);

  const handleDownload = () => {
    if (!generatedPhoto) return;
    
    const link = document.createElement('a');
    link.href = generatedPhoto;
    link.download = `ailisha_travel_${currentRound}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 pb-32 max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📸 我們的回憶</h2>
      
      <div className="w-full bg-white p-4 rounded-3xl shadow-2xl rotate-1 transform hover:rotate-0 transition-transform duration-500 mb-8 border border-gray-100">
        {generatedPhoto && (
          <div className="rounded-2xl overflow-hidden aspect-square relative bg-gray-100">
            <img src={generatedPhoto} alt="旅行紀念照" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mt-5 px-3 pb-3">
          {latestHistoryItem?.diaryEntry ? (
            <p className="font-handwriting text-gray-700 text-center text-lg italic leading-relaxed mb-4">
              "{latestHistoryItem.diaryEntry}"
            </p>
          ) : (
            <p className="text-gray-500 text-center text-sm mb-4">
              日記生成中...
            </p>
          )}
          <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
            <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
              {selectedCity?.name}
            </span>
            <span className="text-xs text-gray-400">
              {latestHistoryItem?.date || '載入中...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <Button
          onClick={onNextRound}
          className="w-full py-4 text-lg shadow-pink-500/30"
          aria-label={currentRound >= TOTAL_ROUNDS ? '完成旅程' : '前往下一站'}
        >
          {currentRound >= TOTAL_ROUNDS ? '完成旅程 🎉' : '前往下一站 ✈️'}
        </Button>
        <button
          onClick={handleDownload}
          disabled={!generatedPhoto}
          className="w-full bg-white text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="下載照片"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          儲存這張照片
        </button>
      </div>
    </div>
  );
};

