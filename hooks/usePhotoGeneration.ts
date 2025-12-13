import { useCallback } from 'react';
import { City, Landmark, TravelHistoryItem } from '../types';
import { generateCityPhoto, generateSouvenirPhoto, generateDiaryEntry } from '../services/geminiService';
import { useApiKey } from '../contexts/ApiKeyContext';
import { calculateTravelDate } from '../utils/dateUtils';

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
      const cityPhotoResult = await generateCityPhoto(
        city.name,
        city.description,
        city.vibe,
        apiKey
      );

      // 2. 生成日記
      const diary = await generateDiaryEntry(city.name, landmark.name, apiKey);

      // 3. 計算日期（每站間隔兩週，基於固定的起始日期）
      const dateString = calculateTravelDate(currentRound);

      // 4. 創建歷史記錄項目（暫時沒有景點合照）
      const newEntry: TravelHistoryItem = {
        round: currentRound,
        city,
        landmark,
        cityPhotoUrl: cityPhotoResult.photoUrl,
        cityPhotoPrompt: cityPhotoResult.prompt,
        landmarkPhotoUrl: '', // 稍後選擇景點時會生成
        landmarkPhotoPrompt: '', // 稍後選擇景點時會生成
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

  const generateLandmarkPhoto = useCallback(async (
    city: City,
    landmark: Landmark
  ): Promise<{ photoUrl: string; prompt: string }> => {
    if (!userSelfieBase64) {
      throw new Error('缺少玩家自拍照');
    }

    if (!apiKey) {
      throw new Error('API Key 未設定');
    }

    onLoadingChange(true, `正在 ${landmark.name} 架設相機準備自拍... 📸`);

    try {
      // 生成景點合照（玩家與 Ailisha）
      const landmarkPhotoResult = await generateSouvenirPhoto(
        userSelfieBase64,
        city.name,
        landmark.name,
        landmark.description,
        city.vibe,
        apiKey
      );

      return landmarkPhotoResult;
    } catch (error) {
      console.error('生成景點合照失敗:', error);
      throw error;
    } finally {
      onLoadingChange(false, '');
    }
  }, [userSelfieBase64, apiKey, onLoadingChange]);

  return {
    generateCityPhoto: generateCityPhotoForCity,
    generateLandmarkPhoto,
  };
};

