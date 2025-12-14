import React, { useEffect, useCallback, useMemo } from 'react';
import { GameState, City, Landmark } from './types';
import { AILISHA_NAME, STARTING_CITY, TOTAL_ROUNDS } from './constants';
import { getRandomElements, getNextCities } from './utils/travelLogic';
import { useGameState } from './hooks/useGameState';
import { usePhotoGeneration } from './hooks/usePhotoGeneration';
import { useToast, ToastContainer, ToastType } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { StartScreen } from './components/screens/StartScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { CitySelectionScreen } from './components/screens/CitySelectionScreen';
import { LandmarkSelectionScreen } from './components/screens/LandmarkSelectionScreen';
import { SummaryScreen } from './components/screens/SummaryScreen';
import { saveHistory, saveGameProgress, loadUserData, loadHistory, loadGameProgress } from './utils/storage';
import { GAME_CONFIG } from './utils/constants';
import { resetStartDate } from './utils/dateUtils';
import { ErrorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';

const App: React.FC = () => {
  const gameState = useGameState();
  const { toasts, removeToast, error: showErrorToast, success: showSuccessToast, info: showInfoToast, warning: showWarningToast } = useToast();
  
  // 適配函數：將 ToastType 轉換為對應的 Toast 調用
  const showError = useCallback((message: string, type: ToastType = 'error') => {
    switch (type) {
      case 'error':
        showErrorToast(message);
        break;
      case 'success':
        showSuccessToast(message);
        break;
      case 'info':
        showInfoToast(message);
        break;
      case 'warning':
        showWarningToast(message);
        break;
    }
  }, [showErrorToast, showSuccessToast, showInfoToast, showWarningToast]);

  // 載入儲存的資料（僅在首次載入時）
  useEffect(() => {
    const savedUserData = loadUserData();
    const savedHistory = loadHistory();
    const savedProgress = loadGameProgress();

    if (savedUserData) {
      gameState.setUserData(savedUserData);
    }

    if (savedHistory && Array.isArray(savedHistory) && savedHistory.length > 0) {
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

  // 確保在任何環境都能安全保存用戶資料，避免 ReferenceError
  const persistUserData = useCallback((data: typeof gameState.userData) => {
    try {
      localStorage.setItem('travel_ailisha_user_data', JSON.stringify(data));
    } catch (err) {
      console.error('儲存用戶資料失敗:', err);
    }
  }, []);

  // 儲存資料到 localStorage
  useEffect(() => {
    if (gameState.userData.selfieBase64) {
      persistUserData(gameState.userData);
    }
  }, [gameState.userData, persistUserData]);

  // 儲存歷史記錄（但不保存 base64 圖片以避免配額超出）
  useEffect(() => {
    if (gameState.history.length > 0) {
      // 使用防抖，避免頻繁寫入
      const timeoutId = setTimeout(() => {
        saveHistory(gameState.history);
      }, 500);
      return () => clearTimeout(timeoutId);
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
      // 添加到歷史記錄
      gameState.addHistoryItem(entry);
      // 設置城市照片 URL 和 Prompt
      gameState.setCityPhotoUrl(entry.cityPhotoUrl);
      gameState.setCityPhotoPrompt(entry.cityPhotoPrompt);
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
    } catch (error: unknown) {
      ErrorHandler.handle(error, 'loadCityOptionsForRound', showError);
    } finally {
      gameState.setLoading(false, '');
    }
  }, [gameState.currentLat, gameState.setCityOptions, gameState.setGameState, gameState.setLoading, showError]);

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
  }, [gameState.currentRound, gameState.selectedCity, gameState.setGameState, gameState.nextRound, gameState.setCurrentLocation, loadCityOptionsForRound]);

  const handleCitySelect = useCallback(async (city: City) => {
    gameState.setSelectedCity(city);
    gameState.setCurrentLat(city.latitude);
    gameState.setCityIntro(`歡迎來到 ${city.name}！${city.description}`);
    
    const randomLandmarks = getRandomElements(city.landmarks, GAME_CONFIG.LANDMARKS_PER_CITY);
    gameState.setLandmarkOptions(randomLandmarks);
    
    // 生成城市照片（先設置臨時的 landmark，實際選擇時會更新）
    const tempLandmark = randomLandmarks[0];
    gameState.setSelectedLandmark(tempLandmark);
    
    try {
      await photoGeneration.generateCityPhoto(city, tempLandmark);
    } catch (error: unknown) {
      ErrorHandler.handle(error, 'handleCitySelect', showError);
    }
    
    gameState.setGameState(GameState.LANDMARK_SELECTION);
  }, [gameState, photoGeneration, showError]);

  const handleLandmarkSelect = useCallback(async (landmark: Landmark) => {
    if (!gameState.selectedCity) return;
    
    gameState.setSelectedLandmark(landmark);
    gameState.setGameState(GameState.PHOTO_GENERATION);

    try {
      // 生成景點合照和日記
      const result = await photoGeneration.generateLandmarkPhoto(
        gameState.selectedCity,
        landmark
      );

      // 更新歷史記錄中的 landmark、合照和日記
      if (gameState.history.length > 0) {
        const latestHistoryItem = gameState.history[gameState.history.length - 1];
        if (latestHistoryItem && latestHistoryItem.city.name === gameState.selectedCity.name) {
          // 更新最後一筆記錄
          gameState.updateLastHistoryItem({ 
            landmark,
            landmarkPhotoUrl: result.photoUrl,
            landmarkPhotoPrompt: result.prompt,
            diaryEntry: result.diary
          });
        }
      }

      // 進入下一輪
      handleNextRound();
    } catch (e: any) {
      console.error('生成景點合照錯誤:', e);
      const errorMessage = e?.message || '未知錯誤';
      showError(`生成景點合照時發生錯誤: ${errorMessage}`);
      // 確保回到景點選擇畫面，不要直接跳過
      gameState.setGameState(GameState.LANDMARK_SELECTION);
      // 不要調用 handleNextRound，讓用戶重新選擇
      return;
    }
  }, [gameState.selectedCity, gameState.setSelectedLandmark, gameState.setGameState, gameState.history, gameState.updateLastHistoryItem, photoGeneration, showError, handleNextRound]);

  // Memoize HTML 內容生成
  const htmlContent = useMemo(() => {
    if (gameState.history.length === 0) return '';

    return `
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
            <div style="width: 100%; margin-bottom: 15px;">
              <h4 style="font-size: 14px; color: #999; margin-bottom: 8px; text-align: center;">城市照片</h4>
              <img src="${item.cityPhotoUrl}" class="photo" alt="Ailisha 在 ${item.city.name}" style="aspect-ratio: 9/16; object-fit: cover; margin-bottom: 15px;" />
            </div>
            ${item.landmarkPhotoUrl ? `
            <div style="width: 100%; margin-bottom: 15px;">
              <h4 style="font-size: 14px; color: #999; margin-bottom: 8px; text-align: center;">景點合照</h4>
              <img src="${item.landmarkPhotoUrl}" class="photo" alt="與 Ailisha 在 ${item.landmark.name}" style="aspect-ratio: 1/1; object-fit: cover; margin-bottom: 15px;" />
            </div>
            ` : ''}
            <p class="diary">"${item.diaryEntry || ''}"</p>
            ${item.date ? `<p class="date" style="color: #999; font-size: 12px; margin-top: 10px;">${item.date}</p>` : ''}
          </div>
        `).join('')}
        <div class="footer">
          Generated by Travel with Ailisha App
        </div>
      </body>
      </html>
    `;
  }, [gameState.history, gameState.userData.nickname]);

  const handleDownloadItinerary = useCallback(() => {
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world_tour_${gameState.userData.nickname}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [htmlContent, gameState.userData.nickname]);

  const handleNewJourney = useCallback(() => {
    resetStartDate(); // 重置起始日期
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
            cityPhotoUrl={gameState.cityPhotoUrl}
            cityPhotoPrompt={gameState.cityPhotoPrompt}
            landmarkOptions={gameState.landmarkOptions}
            onLandmarkSelect={handleLandmarkSelect}
          />
        );
      
      case GameState.PHOTO_GENERATION:
        return <LoadingScreen message={gameState.loadingState.message} />;
      
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
      <div className="min-h-screen font-sans bg-white">
        <BackgroundMusic gameState={gameState.gameState} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        {gameState.gameState !== GameState.START && (
          <Header
            userData={gameState.userData}
            currentRound={gameState.currentRound}
          />
        )}
        
        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
