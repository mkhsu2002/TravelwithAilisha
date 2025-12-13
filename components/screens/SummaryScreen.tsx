import React from 'react';
import { TravelHistoryItem, UserData } from '../../types';
import { Button } from '../Button';

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
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">我的世界之旅</h1>
        <p className="text-gray-500 font-medium">
          與 Ailisha 艾莉莎 • {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pink-200 before:via-pink-400 before:to-pink-200">
        {history.map((item, idx) => (
          <div
            key={`${item.city.name}-${item.landmark.name}-${idx}`}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-pink-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-sm font-bold">{idx + 1}</span>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-lg border border-gray-50 hover:-translate-y-1 transition-transform duration-300">
              {/* 城市照片 */}
              <div className="mb-3 rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '9/19' }}>
                <img
                  src={item.cityPhotoUrl}
                  alt={`Ailisha 在 ${item.city.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 景點合照 */}
              {item.landmarkPhotoUrl && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={item.landmarkPhotoUrl}
                    alt={`與 Ailisha 在 ${item.landmark.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="font-bold text-xl text-gray-800 mb-1">
                {item.city.name}, {item.city.country}
              </h3>
              <p className="text-sm text-pink-500 font-bold mb-3 flex items-center gap-1">
                📍 {item.landmark.name}
              </p>
              <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg">
                "{item.diaryEntry}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center pb-12">
        <Button
          variant="secondary"
          onClick={onDownloadItinerary}
          className="py-4"
          aria-label="下載完整遊記"
        >
          📥 下載完整遊記 (HTML)
        </Button>
        <Button
          onClick={onNewJourney}
          className="py-4"
          aria-label="開始新的旅程"
        >
          🔄 開始新的旅程
        </Button>
      </div>
    </div>
  );
};

