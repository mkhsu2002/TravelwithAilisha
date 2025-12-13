import React from 'react';
import { Landmark } from '../../types';

interface LandmarkSelectionScreenProps {
  cityIntro: string;
  cityPhotoUrl: string | null;
  landmarkOptions: Landmark[];
  onLandmarkSelect: (landmark: Landmark) => void;
}

export const LandmarkSelectionScreen: React.FC<LandmarkSelectionScreenProps> = ({
  cityIntro,
  cityPhotoUrl,
  landmarkOptions,
  onLandmarkSelect,
}) => {
  return (
    <div className="pb-32 max-w-lg mx-auto">
      {/* 城市照片主視覺 (9:16 比例) */}
      {cityPhotoUrl ? (
        <div className="w-full mb-6">
          <img
            src={cityPhotoUrl}
            alt="Ailisha 在城市中"
            className="w-full object-cover"
            style={{ aspectRatio: '9/16' }}
          />
        </div>
      ) : (
        <div className="w-full mb-6 bg-gray-200 flex items-center justify-center" style={{ aspectRatio: '9/16' }}>
          <p className="text-gray-500">照片生成中...</p>
        </div>
      )}

      {/* 城市介紹 */}
      <div className="px-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-800 leading-relaxed text-center">{cityIntro}</p>
        </div>
      </div>

      {/* 景點選項 */}
      <div className="px-6">
        <p className="text-center text-sm font-bold text-gray-500 mb-4">
          ✨ 我挑了三個最棒的景點，選一個吧！ ✨
        </p>
        
        <div className="grid grid-cols-1 gap-4" role="list">
          {landmarkOptions.map((landmark, idx) => (
            <button
              key={`${landmark.name}-${idx}`}
              onClick={() => onLandmarkSelect(landmark)}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-pink-300 text-left group"
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
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                {landmark.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
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
    </div>
  );
};

