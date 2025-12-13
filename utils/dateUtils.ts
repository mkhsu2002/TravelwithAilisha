/**
 * 日期工具函數
 */

const START_DATE_KEY = 'travel_ailisha_start_date';

/**
 * 獲取或創建起始日期（第一次訪問時設定為今天）
 */
export const getStartDate = (): Date => {
  const stored = localStorage.getItem(START_DATE_KEY);
  if (stored) {
    return new Date(stored);
  }
  
  // 第一次訪問，設定為今天
  const today = new Date();
  localStorage.setItem(START_DATE_KEY, today.toISOString());
  return today;
};

/**
 * 根據回合數計算日期（每站間隔兩週）
 */
export const calculateTravelDate = (round: number): string => {
  const startDate = getStartDate();
  const daysToAdd = (round - 1) * 14; // 每站間隔兩週（14天）
  const travelDate = new Date(startDate);
  travelDate.setDate(startDate.getDate() + daysToAdd);
  
  return `${travelDate.getFullYear()}/${String(travelDate.getMonth() + 1).padStart(2, '0')}/${String(travelDate.getDate()).padStart(2, '0')}`;
};

/**
 * 重置起始日期（用於新旅程）
 */
export const resetStartDate = (): void => {
  localStorage.removeItem(START_DATE_KEY);
};

