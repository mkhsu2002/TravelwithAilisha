import React, { useEffect, useCallback, useMemo } from 'react';
import { GameState, City, Landmark } from './types';
import { AILISHA_NAME, STARTING_CITY, TOTAL_ROUNDS } from './constants';
import { getRandomElements, getNextCities } from './utils/travelLogic';
import { useGameState } from './hooks/useGameState';
import { usePhotoGeneration } from './hooks/usePhotoGeneration';
import { useToast, ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { StartScreen } from './components/screens/StartScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { CitySelectionScreen } from './components/screens/CitySelectionScreen';
import { LandmarkSelectionScreen } from './components/screens/LandmarkSelectionScreen';
import { PhotoResultScreen } from './components/screens/PhotoResultScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { saveHistory, saveGameProgress, loadUserData, loadHistory, loadGameProgress } from './utils/storage';
import { GAME_CONFIG } from './utils/constants';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

const App: React.FC = () => {
  const gameState = useGameState();
  const { toasts, removeToast, error: showError } = useToast();

  // 載入儲存的資料（僅在首次載入時）
  useEffect(() => {
    const savedUserData = loadUserData();
    const savedHistory = loadHistory();
    const savedProgress = loadGameProgress();

    if (savedUserData) {
      gameState.setUserData(savedUserData);
    }

    if (savedHistory.length > 0) {
      // 直接設置歷史記錄，而不是逐個添加
      savedHistory.forEach(item => gameState.addHistoryItem(item));
    }

    if (savedProgress) {
      gameState.setCurrentRound(savedProgress.currentRound);
      gameState.setCurrentLat(savedProgress.currentLat);
      gameState.setCurrentLocation(savedProgress.currentLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 儲存資料到 localStorage
  useEffect(() => {
    if (gameState.userData.selfieBase64) {
      saveUserData(gameState.userData);
    }
  }, [gameState.userData]);

  useEffect(() => {
    if (gameState.history.length > 0) {
      saveHistory(gameState.history);
    }
  }, [gameState.history]);

  useEffect(() => {
    if (gameState.currentRound > 1 || gameState.currentLocation !== STARTING_CITY) {
      saveGameProgress({
        currentRound: gameState.currentRound,
        currentLat: gameState.currentLat,
        currentLocation: gameState.currentLocation,
      });
    }
  }, [gameState.currentRound, gameState.currentLat, gameState.currentLocation]);

  // 頁面切換時滾動到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameState.gameState]);

  // Photo Generation Hook
  const photoGeneration = usePhotoGeneration({
    userSelfieBase64: gameState.userData.selfieBase64,
    currentRound: gameState.currentRound,
    onSuccess: (entry) => {
      gameState.setGeneratedPhoto(entry.photoUrl);
      gameState.setGameState(GameState.PHOTO_RESULT);
    },
    onLoadingChange: gameState.setLoading,
  });

  // Handlers
  const handleStart = useCallback(() => {
    if (!gameState.userData.nickname || !gameState.userData.selfieBase64) {
      showError('請輸入暱稱並上傳自拍照');
      return;
    }
    
    gameState.setGameState(GameState.INTRO);
    
    setTimeout(() => {
      loadCityOptionsForRound(1);
    }, GAME_CONFIG.INTRO_DELAY);
  }, [gameState.userData, gameState.setGameState, showError]);

  const loadCityOptionsForRound = useCallback((round: number) => {
    gameState.setLoading(true, `${AILISHA_NAME} 正在研究 ${round === 1 ? '世界地圖' : '下一站路線'}...`);
    
    try {
      const nextCities = getNextCities(round, gameState.currentLat);
      gameState.setCityOptions(nextCities);
      gameState.setGameState(GameState.CITY_SELECTION);
    } catch (e) {
      console.error(e);
      showError('資料庫載入錯誤');
    } finally {
      gameState.setLoading(false, '');
    }
  }, [gameState.currentLat, gameState.setCityOptions, gameState.setGameState, gameState.setLoading, showError]);

  const handleCitySelect = useCallback((city: City) => {
    gameState.setSelectedCity(city);
    gameState.setCurrentLat(city.latitude);
    gameState.setCityIntro(`歡迎來到 ${city.name}！${city.description}`);
    
    const randomLandmarks = getRandomElements(city.landmarks, GAME_CONFIG.LANDMARKS_PER_CITY);
    gameState.setLandmarkOptions(randomLandmarks);
    
    gameState.setGameState(GameState.LANDMARK_SELECTION);
  }, [gameState]);

  const handleLandmarkSelect = useCallback(async (landmark: Landmark) => {
    if (!gameState.selectedCity) return;
    
    gameState.setSelectedLandmark(landmark);
    gameState.setGameState(GameState.PHOTO_GENERATION);

    try {
      await photoGeneration.generatePhoto(gameState.selectedCity, landmark);
    } catch (e) {
      console.error(e);
      showError('生成照片時發生錯誤，請檢查網路連線或稍後再試');
      gameState.setGameState(GameState.LANDMARK_SELECTION);
    }
  }, [gameState.selectedCity, gameState.setSelectedLandmark, gameState.setGameState, photoGeneration, showError]);

  const handleNextRound = useCallback(() => {
    if (gameState.currentRound >= TOTAL_ROUNDS) {
      gameState.setGameState(GameState.SUMMARY);
    } else {
      gameState.nextRound();
      if (gameState.selectedCity) {
        gameState.setCurrentLocation(gameState.selectedCity.name);
        loadCityOptionsForRound(gameState.currentRound + 1);
      }
    }
  }, [gameState, loadCityOptionsForRound]);

  const handleDownloadItinerary = useCallback(() => {
    if (gameState.history.length === 0) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>我的世界之旅 - ${gameState.userData.nickname}</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f9f9f9; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #ec4899; padding-bottom: 20px; }
          .title { font-size: 32px; font-weight: bold; color: #db2777; margin: 0; }
          .subtitle { color: #666; font-size: 18px; margin-top: 10px; }
          .entry { background: white; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; }
          .round-badge { background: #fce7f3; color: #db2777; font-weight: bold; padding: 5px 15px; border-radius: 20px; margin-bottom: 15px; }
          .location { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .landmark { color: #db2777; font-size: 16px; margin-bottom: 15px; }
          .photo { width: 100%; max-width: 500px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #eee; }
          .diary { font-style: italic; color: #555; text-align: center; padding: 10px; background: #fafafa; border-radius: 8px; width: 100%; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">與 Ailisha 的環遊世界之旅</h1>
          <p class="subtitle">冒險家: ${gameState.userData.nickname} • 日期: ${new Date().toLocaleDateString()}</p>
        </div>
        ${gameState.history.map((item, idx) => `
          <div class="entry">
            <div class="round-badge">第 ${item.round} 站</div>
            <div class="location">${item.city.name}, ${item.city.country}</div>
            <div class="landmark">📍 ${item.landmark.name}</div>
            <img src="${item.photoUrl}" class="photo" alt="${item.landmark.name}" />
            <p class="diary">"${item.diaryEntry}"</p>
          </div>
        `).join('')}
        <div class="footer">
          Generated by Travel with Ailisha App
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world_tour_${gameState.userData.nickname}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [gameState.history, gameState.userData.nickname]);

  const handleNewJourney = useCallback(() => {
    gameState.resetGame();
    window.location.reload();
  }, [gameState]);

  // Memoized latest history item
  const latestHistoryItem = useMemo(() => {
    return gameState.history.length > 0 
      ? gameState.history[gameState.history.length - 1] 
      : null;
  }, [gameState.history]);

  // Render content based on game state
  const renderContent = () => {
    if (gameState.loadingState.isLoading) {
      return <LoadingScreen message={gameState.loadingState.message} />;
    }

    switch (gameState.gameState) {
      case GameState.START:
        return (
          <StartScreen
            userData={gameState.userData}
            onUserDataChange={gameState.setUserData}
            onStart={handleStart}
            onError={showError}
          />
        );
      
      case GameState.INTRO:
        return <IntroScreen userData={gameState.userData} />;
      
      case GameState.CITY_SELECTION:
        return (
          <CitySelectionScreen
            currentLocation={gameState.currentLocation}
            cityOptions={gameState.cityOptions}
            onCitySelect={handleCitySelect}
          />
        );
      
      case GameState.LANDMARK_SELECTION:
        return (
          <LandmarkSelectionScreen
            cityIntro={gameState.cityIntro}
            landmarkOptions={gameState.landmarkOptions}
            onLandmarkSelect={handleLandmarkSelect}
          />
        );
      
      case GameState.PHOTO_GENERATION:
        return <LoadingScreen message={gameState.loadingState.message} />;
      
      case GameState.PHOTO_RESULT:
        return (
          <PhotoResultScreen
            currentRound={gameState.currentRound}
            selectedCity={gameState.selectedCity}
            generatedPhoto={gameState.generatedPhoto}
            latestHistoryItem={latestHistoryItem}
            onNextRound={handleNextRound}
          />
        );
      
      case GameState.SUMMARY:
        return (
          <SummaryScreen
            userData={gameState.userData}
            history={gameState.history}
            onDownloadItinerary={handleDownloadItinerary}
            onNewJourney={handleNewJourney}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <ApiKeyProvider>
        <div className="min-h-screen bg-gray-50 pb-10 font-sans">
          <BackgroundMusic gameState={gameState.gameState} />
          <ToastContainer toasts={toasts} onRemove={removeToast} />
          
          {gameState.gameState !== GameState.START && (
            <Header
              userData={gameState.userData}
              currentRound={gameState.currentRound}
            />
          )}
          
          <main className="container mx-auto">
            {renderContent()}
          </main>
        </div>
      </ApiKeyProvider>
    </ErrorBoundary>
  );
};

export default App;
