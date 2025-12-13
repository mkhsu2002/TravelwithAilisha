export enum GameState {
  START = 'START',
  INTRO = 'INTRO',
  CITY_SELECTION = 'CITY_SELECTION',
  LANDMARK_SELECTION = 'LANDMARK_SELECTION',
  PHOTO_GENERATION = 'PHOTO_GENERATION',
  PHOTO_RESULT = 'PHOTO_RESULT',
  SUMMARY = 'SUMMARY'
}

export type CityVibe = 'urban' | 'beach' | 'historic' | 'nature' | 'cold' | 'desert';

export interface Landmark {
  name: string;
  description: string;
  bestAngle: string; // Hint for generation
}

export interface City {
  name: string;
  country: string;
  description: string;
  vibe: CityVibe;
  latitude: number; // Positive for North, Negative for South. Used for route logic.
  landmarks: Landmark[]; // Pool of landmarks (5+)
}

export interface TravelHistoryItem {
  round: number;
  city: City;
  landmark: Landmark;
  photoUrl: string;
  diaryEntry: string;
  date: string; // 格式：YYYY/MM/DD
}

export interface UserData {
  nickname: string;
  selfieBase64: string | null;
}