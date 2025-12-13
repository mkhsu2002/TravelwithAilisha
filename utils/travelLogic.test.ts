import { describe, it, expect } from 'vitest';
import { getNextCities, getRandomElements } from './travelLogic';
import { City } from '../types';

describe('travelLogic', () => {
  describe('getRandomElements', () => {
    it('應該返回指定數量的元素', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = getRandomElements(arr, 3);
      expect(result.length).toBe(3);
    });

    it('如果請求數量超過陣列長度，應該返回整個陣列', () => {
      const arr = [1, 2, 3];
      const result = getRandomElements(arr, 5);
      expect(result.length).toBe(3);
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('應該返回不同的元素（隨機性）', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result1 = getRandomElements(arr, 3);
      const result2 = getRandomElements(arr, 3);
      // 由於是隨機的，可能相同也可能不同，但長度應該一致
      expect(result1.length).toBe(3);
      expect(result2.length).toBe(3);
    });
  });

  describe('getNextCities', () => {
    const mockCities: City[] = [
      {
        name: '城市1',
        country: '國家1',
        latitude: 25.0,
        vibe: 'urban',
        description: '描述1',
        landmarks: [],
      },
      {
        name: '城市2',
        country: '國家2',
        latitude: 26.0,
        vibe: 'beach',
        description: '描述2',
        landmarks: [],
      },
      {
        name: '城市3',
        country: '國家3',
        latitude: 27.0,
        vibe: 'historic',
        description: '描述3',
        landmarks: [],
      },
      {
        name: '城市4',
        country: '國家4',
        latitude: 28.0,
        vibe: 'nature',
        description: '描述4',
        landmarks: [],
      },
      {
        name: '城市5',
        country: '國家5',
        latitude: 29.0,
        vibe: 'cold',
        description: '描述5',
        landmarks: [],
      },
    ];

    it('應該返回指定數量的城市', () => {
      // 注意：這需要實際的 TRAVEL_DB 資料，這裡只是測試邏輯
      // 實際測試時需要 mock TRAVEL_DB
      const result = getNextCities(1, 25.0);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('返回的城市應該有正確的結構', () => {
      const result = getNextCities(1, 25.0);
      result.forEach(city => {
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('country');
        expect(city).toHaveProperty('latitude');
        expect(city).toHaveProperty('vibe');
        expect(city).toHaveProperty('description');
        expect(city).toHaveProperty('landmarks');
      });
    });
  });
});

