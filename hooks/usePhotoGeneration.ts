import { useCallback } from 'react';
import { City, Landmark, TravelHistoryItem } from '../types';
import { generateCityPhoto, generateDiaryEntry } from '../services/geminiService';
import { useApiKey } from '../contexts/ApiKeyContext';
import { calculateTravelDate } from '../utils/dateUtils';

interface UsePhotoGenerationParams {
  currentRound: number;
  onSuccess: (entry: TravelHistoryItem) => void;
  onLoadingChange: (isLoading: boolean, message: string) => void;
}

export const usePhotoGeneration = ({
  currentRound,
  onSuccess,
  onLoadingChange,
}: UsePhotoGenerationParams) => {
  const { apiKey } = useApiKey();

  const generateCityPhotoForCity = useCallback(async (
    city: City,
    landmark: Landmark
  ): Promise<TravelHistoryItem> => {
    if (!city) {
      throw new Error('缺少必要的資料');
    }

    if (!apiKey) {
      throw new Error('API Key 未設定');
    }

    onLoadingChange(true, `正在生成 ${city.name} 的城市照片... 📸`);

    try {
      // 1. 生成城市照片（Ailisha 在城市中）
      const cityPhotoUrl = await generateCityPhoto(
        city.name,
        city.description,
        city.vibe,
        apiKey
      );

      // 2. 生成日記
      const diary = await generateDiaryEntry(city.name, landmark.name, apiKey);

      // 3. 計算日期（每站間隔兩週，基於固定的起始日期）
      const dateString = calculateTravelDate(currentRound);

      // 4. 創建歷史記錄項目
      const newEntry: TravelHistoryItem = {
        round: currentRound,
        city,
        landmark,
        cityPhotoUrl,
        diaryEntry: diary,
        date: dateString,
      };

      onSuccess(newEntry);
      return newEntry;
    } catch (error) {
      console.error('生成城市照片失敗:', error);
      throw error;
    } finally {
      onLoadingChange(false, '');
    }
  }, [currentRound, apiKey, onSuccess, onLoadingChange]);

  return {
    generateCityPhoto: generateCityPhotoForCity,
  };
};

