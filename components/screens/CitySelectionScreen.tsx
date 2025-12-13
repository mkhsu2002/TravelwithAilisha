import React, { useMemo, useCallback } from 'react';
import { City } from '../../types';
import { AILISHA_AVATAR_URL } from '../../constants';

interface CitySelectionScreenProps {
  currentLocation: string;
  cityOptions: City[];
  onCitySelect: (city: City) => void;
}

const CitySelectionScreenComponent: React.FC<CitySelectionScreenProps> = ({
  currentLocation,
  cityOptions,
  onCitySelect,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
      {/* Ailisha 對話框 */}
      <div className="mb-8 sm:mb-10 animate-slide-up">
        <div className="bg-white/90 backdrop-blur-lg p-5 sm:p-6 rounded-3xl shadow-xl mb-6 flex gap-4 sm:gap-5 items-start border border-pink-100/50">
          <div className="relative flex-shrink-0">
            <img
              src={AILISHA_AVATAR_URL}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-pink-200 shadow-lg ring-2 ring-pink-100"
              alt="Ailisha"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 sm:p-6 rounded-3xl rounded-tl-none shadow-sm border border-pink-100 flex-1">
            <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
              我們現在位於 <span className="font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg">{currentLocation}</span>
              <br className="hidden sm:block" />
              <span className="block sm:inline">往東飛的話，這三個地方最吸引我，你想去哪裡？</span>
            </p>
          </div>
        </div>
      </div>

      {/* 城市選項卡片 */}
      <div className="space-y-5 sm:space-y-6" role="list">
        {cityOptions.map((city, idx) => (
          <div
            key={`${city.name}-${idx}`}
            onClick={() => onCitySelect(city)}
            className="group card card-hover p-6 sm:p-8 cursor-pointer relative overflow-hidden animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCitySelect(city);
              }
            }}
            aria-label={`選擇 ${city.name}`}
          >
            {/* 背景裝飾 */}
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300" aria-hidden="true">
              <span className="text-7xl sm:text-8xl">✈️</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            {/* 內容 */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-sm sm:text-base text-pink-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" aria-hidden="true"></span>
                    <span>{city.country}</span>
                  </p>
                </div>
                <div className="ml-4 text-3xl sm:text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  🗺️
                </div>
              </div>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 pr-8">
                {city.description}
              </p>
              
              <div className="flex justify-end items-center gap-2">
                <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-6 py-3 rounded-full font-bold text-sm sm:text-base group-hover:from-pink-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg">
                  出發 &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 使用 React.memo 優化渲染性能
export const CitySelectionScreen = React.memo(CitySelectionScreenComponent, (prevProps, nextProps) => {
  // 自訂比較邏輯：只有當 cityOptions 或 currentLocation 改變時才重新渲染
  return (
    prevProps.currentLocation === nextProps.currentLocation &&
    prevProps.cityOptions === nextProps.cityOptions &&
    prevProps.onCitySelect === nextProps.onCitySelect
  );
});

