import { useState, useCallback, useMemo } from 'react';
import { GameState, City, Landmark, TravelHistoryItem, UserData } from '../types';
import { GAME_CONFIG } from '../utils/constants';
import { STARTING_CITY, TOTAL_ROUNDS } from '../constants';

interface LoadingState {
  isLoading: boolean;
  message: string;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userData, setUserData] = useState<UserData>({ nickname: '', selfieBase64: null });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(STARTING_CITY);
  const [currentLat, setCurrentLat] = useState<number>(25.0);
  const [history, setHistory] = useState<TravelHistoryItem[]>([]);
  
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [landmarkOptions, setLandmarkOptions] = useState<Landmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [cityIntro, setCityIntro] = useState<string>('');
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  const [cityPhotoUrl, setCityPhotoUrl] = useState<string | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
  });

  const setLoading = useCallback((isLoading: boolean, message: string = '') => {
    setLoadingState({ isLoading, message });
  }, []);

  const addHistoryItem = useCallback((item: TravelHistoryItem) => {
    setHistory(prev => [...prev, item]);
  }, []);

  const updateLastHistoryItem = useCallback((updates: Partial<TravelHistoryItem>) => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], ...updates };
      return updated;
    });
  }, []);

  const nextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState(GameState.SUMMARY);
    } else {
      const nextRoundNum = currentRound + 1;
      setCurrentRound(nextRoundNum);
      if (selectedCity) {
        setCurrentLocation(selectedCity.name);
      }
    }
  }, [currentRound, selectedCity]);

  const resetGame = useCallback(() => {
    setGameState(GameState.START);
    setUserData({ nickname: '', selfieBase64: null });
    setCurrentRound(1);
    setCurrentLocation(STARTING_CITY);
    setCurrentLat(25.0);
    setHistory([]);
    setCityOptions([]);
    setSelectedCity(null);
    setLandmarkOptions([]);
    setSelectedLandmark(null);
    setCityIntro('');
    setGeneratedPhoto(null);
    setCityPhotoUrl(null);
    setLoadingState({ isLoading: false, message: '' });
  }, []);

  const isGameComplete = useMemo(() => {
    return currentRound > TOTAL_ROUNDS;
  }, [currentRound]);

  return {
    // State
    gameState,
    setGameState,
    userData,
    setUserData,
    currentRound,
    setCurrentRound,
    currentLocation,
    setCurrentLocation,
    currentLat,
    setCurrentLat,
    history,
    cityOptions,
    setCityOptions,
    selectedCity,
    setSelectedCity,
    landmarkOptions,
    setLandmarkOptions,
    selectedLandmark,
    setSelectedLandmark,
    cityIntro,
    setCityIntro,
    generatedPhoto,
    setGeneratedPhoto,
    cityPhotoUrl,
    setCityPhotoUrl,
    loadingState,
    
    // Actions
    setLoading,
    addHistoryItem,
    updateLastHistoryItem,
    nextRound,
    resetGame,
    isGameComplete,
  };
};

