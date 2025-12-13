import React from 'react';
import { Landmark } from '../../types';
import { AILISHA_AVATAR_URL } from '../../constants';

interface LandmarkSelectionScreenProps {
  cityIntro: string;
  landmarkOptions: Landmark[];
  onLandmarkSelect: (landmark: Landmark) => void;
}

export const LandmarkSelectionScreen: React.FC<LandmarkSelectionScreenProps> = ({
  cityIntro,
  landmarkOptions,
  onLandmarkSelect,
}) => {
  return (
    <div className="p-6 pb-32 max-w-lg mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-col gap-4 border border-gray-100">
        <div className="flex gap-4 items-start">
          <img
            src={AILISHA_AVATAR_URL}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-pink-100"
            alt="Ailisha"
          />
          <div className="bg-pink-50 p-4 rounded-2xl rounded-tl-none w-full">
            <p className="text-gray-800 leading-relaxed">{cityIntro}</p>
          </div>
        </div>
        <p className="text-center text-sm font-bold text-gray-500 mt-1">
          ✨ 我挑了三個最棒的拍照點，選一個吧！ ✨
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6" role="list">
        {landmarkOptions.map((landmark, idx) => {
          const bgImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(landmark.name + ' scenery realistic 4k')}`;
          
          return (
            <div
              key={`${landmark.name}-${idx}`}
              onClick={() => onLandmarkSelect(landmark)}
              className="relative overflow-hidden rounded-3xl shadow-lg aspect-[4/3] cursor-pointer group isolation-auto"
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
              <img
                src={bgImage}
                alt={landmark.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" aria-hidden="true" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-0 transition-transform">
                <h3 className="text-white font-bold text-2xl mb-1 shadow-black drop-shadow-md">
                  {landmark.name}
                </h3>
                <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md line-clamp-2">
                  {landmark.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

