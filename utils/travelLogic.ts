import { City } from '../types';
import { TRAVEL_DB } from '../data';
import { GAME_CONFIG } from './constants';

/**
 * 從陣列中隨機選取 N 個元素
 */
export const getRandomElements = <T,>(arr: T[], n: number): T[] => {
  if (arr.length <= n) return [...arr];
  
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

/**
 * 根據緯度邏輯選擇下一批城市
 * 使用地理流動性：緯度相近的城市優先，但加入隨機性
 */
export const getNextCities = (round: number, previousLat: number): City[] => {
  // 1. 獲取當前回合的城市池
  const roundIndex = Math.min(round - 1, TRAVEL_DB.length - 1);
  const pool = TRAVEL_DB[roundIndex];

  if (pool.length <= GAME_CONFIG.CITIES_PER_ROUND) {
    return pool;
  }

  // 2. 計算每個城市的分數（基於緯度差異 + 隨機因子）
  const scoredCities = pool.map(city => {
    const latDiff = Math.abs(city.latitude - previousLat);
    const randomFactor = Math.random() * 30; // 隨機噪音，允許跳躍
    return { city, score: latDiff + randomFactor };
  });

  // 3. 按分數排序（分數越小越優先）
  scoredCities.sort((a, b) => a.score - b.score);

  // 4. 選取前 N 個城市
  return scoredCities
    .slice(0, GAME_CONFIG.CITIES_PER_ROUND)
    .map(item => item.city);
};

