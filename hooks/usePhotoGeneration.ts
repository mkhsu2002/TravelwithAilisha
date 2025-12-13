import { useCallback } from 'react';
import { City, Landmark, TravelHistoryItem } from '../types';
import { generateSouvenirPhoto, generateDiaryEntry } from '../services/geminiService';
import { useApiKey } from '../contexts/ApiKeyContext';

interface UsePhotoGenerationParams {
  userSelfieBase64: string | null;
  currentRound: number;
  onSuccess: (entry: TravelHistoryItem) => void;
  onLoadingChange: (isLoading: boolean, message: string) => void;
}

export const usePhotoGeneration = ({
  userSelfieBase64,
  currentRound,
  onSuccess,
  onLoadingChange,
}: UsePhotoGenerationParams) => {
  const { apiKey } = useApiKey();

  const generatePhoto = useCallback(async (
    city: City,
    landmark: Landmark
  ): Promise<TravelHistoryItem> => {
    if (!userSelfieBase64 || !city) {
      throw new Error('缺少必要的資料');
    }

    if (!apiKey) {
      throw new Error('請先配置 API Key。請在右上角點擊「設定 API Key」。');
    }

    onLoadingChange(true, `正在 ${landmark.name} 架設相機準備自拍... 📸`);

    try {
      // 1. 生成照片
      const photoUrl = await generateSouvenirPhoto(
        userSelfieBase64,
        city.name,
        landmark.name,
        landmark.description,
        city.vibe,
        apiKey
      );

      // 2. 生成日記
      const diary = await generateDiaryEntry(city.name, landmark.name, apiKey);

      // 3. 計算日期（每站間隔兩週，從今天開始）
      const baseDate = new Date();
      const daysToAdd = (currentRound - 1) * 14; // 每站間隔兩週（14天）
      const travelDate = new Date(baseDate);
      travelDate.setDate(baseDate.getDate() + daysToAdd);
      const dateString = `${travelDate.getFullYear()}/${String(travelDate.getMonth() + 1).padStart(2, '0')}/${String(travelDate.getDate()).padStart(2, '0')}`;

      // 4. 創建歷史記錄項目
      const newEntry: TravelHistoryItem = {
        round: currentRound,
        city,
        landmark,
        photoUrl,
        diaryEntry: diary,
        date: dateString,
      };

      onSuccess(newEntry);
      return newEntry;
    } catch (error) {
      console.error('生成照片失敗:', error);
      throw error;
    } finally {
      onLoadingChange(false, '');
    }
  }, [userSelfieBase64, currentRound, apiKey, onSuccess, onLoadingChange]);

  return {
    generatePhoto,
  };
};

