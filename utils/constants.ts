/**
 * 遊戲配置常數
 */
export const GAME_CONFIG = {
  TOTAL_ROUNDS: 6,
  CITIES_PER_ROUND: 3,
  LANDMARKS_PER_CITY: 3,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  INTRO_DELAY: 1500, // 毫秒
  PHOTO_ASPECT_RATIO: '1:1' as const,
  PHOTO_SIZE: '1K' as const,
} as const;

/**
 * 允許的圖片類型
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

/**
 * 錯誤訊息
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: '檔案大小超過 5MB，請選擇較小的圖片',
  INVALID_FILE_TYPE: '不支援的檔案類型，請上傳 JPG、PNG 或 WebP 格式',
  API_ERROR: 'API 呼叫失敗，請稍後再試',
  NETWORK_ERROR: '網路連線錯誤，請檢查您的網路連線',
  GENERATION_ERROR: '生成照片時發生錯誤，請檢查網路連線或稍後再試',
  DATA_LOAD_ERROR: '資料庫載入錯誤',
} as const;

