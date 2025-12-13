import { UserData, TravelHistoryItem } from '../types';
import { calculateTravelDate } from './dateUtils';

const STORAGE_KEYS = {
  USER_DATA: 'travel_ailisha_user_data',
  HISTORY: 'travel_ailisha_history',
  CURRENT_ROUND: 'travel_ailisha_current_round',
  CURRENT_LAT: 'travel_ailisha_current_lat',
  CURRENT_LOCATION: 'travel_ailisha_current_location',
} as const;

/**
 * 儲存用戶資料
 */
export const saveUserData = (userData: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('儲存用戶資料失敗:', error);
  }
};

/**
 * 讀取用戶資料
 */
export const loadUserData = (): UserData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('讀取用戶資料失敗:', error);
    return null;
  }
};

/**
 * 儲存旅行歷史
 */
export const saveHistory = (history: TravelHistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('儲存歷史記錄失敗:', error);
  }
};

/**
 * 讀取旅行歷史
 */
export const loadHistory = (): TravelHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history = data ? JSON.parse(data) : [];
    
    // 向後兼容：為沒有日期的舊記錄生成日期，處理照片 URL
    return history.map((item: TravelHistoryItem) => {
      if (!item.date) {
        item.date = calculateTravelDate(item.round);
      }
      // 向後兼容：將舊的 photoUrl 轉換為 landmarkPhotoUrl
      if ('photoUrl' in item && !('landmarkPhotoUrl' in item)) {
        (item as any).landmarkPhotoUrl = (item as any).photoUrl;
        delete (item as any).photoUrl;
      }
      // 向後兼容：如果沒有 cityPhotoUrl，設置為空字串
      if (!('cityPhotoUrl' in item)) {
        (item as any).cityPhotoUrl = '';
      }
      // 向後兼容：如果沒有 landmarkPhotoUrl，設置為空字串
      if (!('landmarkPhotoUrl' in item)) {
        (item as any).landmarkPhotoUrl = '';
      }
      // 向後兼容：如果沒有 prompt 字段，設置為空字串
      if (!('cityPhotoPrompt' in item)) {
        (item as any).cityPhotoPrompt = '';
      }
      if (!('landmarkPhotoPrompt' in item)) {
        (item as any).landmarkPhotoPrompt = '';
      }
      return item;
    });
  } catch (error) {
    console.error('讀取歷史記錄失敗:', error);
    return [];
  }
};

/**
 * 儲存遊戲進度
 */
export const saveGameProgress = (data: {
  currentRound: number;
  currentLat: number;
  currentLocation: string;
}): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROUND, String(data.currentRound));
    localStorage.setItem(STORAGE_KEYS.CURRENT_LAT, String(data.currentLat));
    localStorage.setItem(STORAGE_KEYS.CURRENT_LOCATION, data.currentLocation);
  } catch (error) {
    console.error('儲存遊戲進度失敗:', error);
  }
};

/**
 * 讀取遊戲進度
 */
export const loadGameProgress = (): {
  currentRound: number;
  currentLat: number;
  currentLocation: string;
} | null => {
  try {
    const round = localStorage.getItem(STORAGE_KEYS.CURRENT_ROUND);
    const lat = localStorage.getItem(STORAGE_KEYS.CURRENT_LAT);
    const location = localStorage.getItem(STORAGE_KEYS.CURRENT_LOCATION);
    
    if (round && lat && location) {
      return {
        currentRound: parseInt(round, 10),
        currentLat: parseFloat(lat),
        currentLocation: location,
      };
    }
    return null;
  } catch (error) {
    console.error('讀取遊戲進度失敗:', error);
    return null;
  }
};

/**
 * 清除所有儲存的資料
 */
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('清除資料失敗:', error);
  }
};

