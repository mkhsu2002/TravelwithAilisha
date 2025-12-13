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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      {/* 城市照片主視覺 (9:16 比例) */}
      {cityPhotoUrl ? (
        <div className="w-full mb-6 sm:mb-8 relative group animate-fade-in">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-pink-100">
            <img
              src={cityPhotoUrl}
              alt="Ailisha 在城市中"
              className="w-full object-cover"
              style={{ aspectRatio: '9/16' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {cityPhotoPrompt && (
            <button
              onClick={() => setPromptModalOpen(true)}
              className="absolute top-4 right-4 bg-black/80 hover:bg-black/95 backdrop-blur-sm text-white p-3 rounded-xl transition-all shadow-xl hover:scale-110 z-10"
              aria-label="查看提示詞"
              title="查看提示詞"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="w-full mb-6 sm:mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg border-4 border-white" style={{ aspectRatio: '9/16' }}>
          <div className="text-center">
            <div className="animate-spin text-4xl mb-3">✈️</div>
            <p className="text-gray-600 font-medium">照片生成中...</p>
          </div>
        </div>
      )}

      {/* 城市介紹 */}
      <div className="mb-6 sm:mb-8 animate-slide-up">
        <div className="bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-xl border border-pink-100/50">
          <div className="flex items-start gap-4">
            <div className="text-3xl flex-shrink-0">🗺️</div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed flex-1">
              {cityIntro}
            </p>
          </div>
        </div>
      </div>

      {/* 景點選項 */}
      <div className="animate-fade-in">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg font-bold text-gray-700 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full inline-block">
            ✨ 我挑了三個最棒的景點，選一個吧！ ✨
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:gap-6" role="list">
          {landmarkOptions.map((landmark, idx) => (
            <button
              key={`${landmark.name}-${idx}`}
              onClick={() => onLandmarkSelect(landmark)}
              className="card card-hover p-6 sm:p-8 text-left group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
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
              {/* 背景裝飾 */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="absolute top-4 right-4 text-4xl opacity-5 group-hover:opacity-10 transition-opacity">📍</div>
              
              {/* 內容 */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 group-hover:text-pink-600 transition-colors flex-1">
                    {landmark.name}
                  </h3>
                  <span className="ml-4 text-2xl sm:text-3xl opacity-20 group-hover:opacity-40 transition-opacity">🏛️</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 pr-8">
                  {landmark.description}
                </p>
                <div className="flex justify-end">
                  <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-6 py-3 rounded-full font-bold text-sm sm:text-base group-hover:from-pink-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg">
                    選擇 &rarr;
                  </span>
                </div>
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

