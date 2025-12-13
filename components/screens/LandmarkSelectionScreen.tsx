import React, { useState, memo } from 'react';
import { Landmark } from '../../types';
import { PromptModal } from '../PromptModal';

interface LandmarkSelectionScreenProps {
  cityIntro: string;
  cityPhotoUrl: string | null;
  cityPhotoPrompt: string | null;
  landmarkOptions: Landmark[];
  onLandmarkSelect: (landmark: Landmark) => void;
}

const LandmarkSelectionScreenComponent: React.FC<LandmarkSelectionScreenProps> = ({
  cityIntro,
  cityPhotoUrl,
  cityPhotoPrompt,
  landmarkOptions,
  onLandmarkSelect,
}) => {
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  return (
    <div className="px-4 sm:px-6 pb-24 sm:pb-32 max-w-lg mx-auto">
      {/* 城市照片主視覺 (9:16 比例) */}
      {cityPhotoUrl ? (
        <div className="w-full mb-4 sm:mb-6 relative group rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
          <img
            src={cityPhotoUrl}
            alt="Ailisha 在城市中"
            className="w-full h-auto object-cover"
            style={{ aspectRatio: '9/16' }}
            loading="lazy"
            decoding="async"
          />
          {cityPhotoPrompt && (
            <button
              onClick={() => setPromptModalOpen(true)}
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
      ) : (
        <div className="w-full mb-4 sm:mb-6 bg-gray-200 flex items-center justify-center rounded-xl sm:rounded-2xl" style={{ aspectRatio: '9/16' }}>
          <p className="text-gray-500 text-sm sm:text-base">照片生成中...</p>
        </div>
      )}

      {/* 城市介紹 */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-center">{cityIntro}</p>
        </div>
      </div>

      {/* 景點選項 */}
      <div>
        <p className="text-center text-xs sm:text-sm font-bold text-gray-500 mb-3 sm:mb-4 px-2">
          ✨ 我挑了三個最棒的景點，選一個吧！ ✨
        </p>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4" role="list">
          {landmarkOptions.map((landmark, idx) => (
            <button
              key={`${landmark.name}-${idx}`}
              onClick={() => onLandmarkSelect(landmark)}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-pink-300 text-left group w-full"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onLandmarkSelect(landmark);
                }
              }}
              aria-label={`選擇 ${landmark.name}`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                {landmark.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
                {landmark.description}
              </p>
              <div className="flex justify-end">
                <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold text-sm group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  選擇 &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {cityPhotoPrompt && (
        <PromptModal
          isOpen={promptModalOpen}
          onClose={() => setPromptModalOpen(false)}
          prompt={cityPhotoPrompt}
          title="城市照片提示詞"
        />
      )}
    </div>
  );
};

// 使用 React.memo 優化渲染性能
export const LandmarkSelectionScreen = memo(LandmarkSelectionScreenComponent, (prevProps, nextProps) => {
  return (
    prevProps.cityIntro === nextProps.cityIntro &&
    prevProps.cityPhotoUrl === nextProps.cityPhotoUrl &&
    prevProps.cityPhotoPrompt === nextProps.cityPhotoPrompt &&
    prevProps.landmarkOptions === nextProps.landmarkOptions &&
    prevProps.onLandmarkSelect === nextProps.onLandmarkSelect
  );
});

