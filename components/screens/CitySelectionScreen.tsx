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
    <div className="px-4 sm:px-6 py-6 pb-24 sm:pb-32 max-w-lg mx-auto">
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm mb-6 sm:mb-8 flex gap-3 sm:gap-4 items-start border border-gray-100">
        <img
          src={AILISHA_AVATAR_URL}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-pink-100"
          alt="Ailisha"
        />
        <div className="bg-pink-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-tl-none flex-1">
          <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
            我們現在位於 <span className="font-bold text-pink-600">{currentLocation}</span>。
            <br/>
            往東飛的話，這三個地方最吸引我，你想去哪裡？
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6" role="list">
        {cityOptions.map((city, idx) => (
          <div
            key={`${city.name}-${idx}`}
            onClick={() => onCitySelect(city)}
            className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-pink-300 relative overflow-hidden"
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
            <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
              <span className="text-4xl sm:text-6xl">✈️</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{city.name}</h3>
            <p className="text-xs sm:text-sm text-pink-500 font-bold uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" aria-hidden="true"></span>
              {city.country}
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">{city.description}</p>
            <div className="flex justify-end">
              <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold text-sm group-hover:bg-pink-600 group-hover:text-white transition-colors">
                出發 &rarr;
              </span>
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

