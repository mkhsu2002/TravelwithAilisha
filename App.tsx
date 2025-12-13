import React, { useState, useEffect, useRef } from 'react';
import { AILISHA_NAME, AILISHA_AVATAR_URL, STARTING_CITY, TOTAL_ROUNDS } from './constants';
import { GameState, City, Landmark, TravelHistoryItem, UserData } from './types';
import { generateSouvenirPhoto, generateDiaryEntry } from './services/geminiService';
import { TRAVEL_DB } from './data';
import { Button } from './components/Button';
import { PhotoUpload } from './components/PhotoUpload';
import { BackgroundMusic } from './components/BackgroundMusic';

const App: React.FC = () => {
  // State
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userData, setUserData] = useState<UserData>({ nickname: '', selfieBase64: null });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(STARTING_CITY);
  const [currentLat, setCurrentLat] = useState<number>(25.0); // Taipei's latitude approx
  const [history, setHistory] = useState<TravelHistoryItem[]>([]);
  
  // Selection Data
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [landmarkOptions, setLandmarkOptions] = useState<Landmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [cityIntro, setCityIntro] = useState<string>("");
  const [generatedPhoto, setGeneratedPhoto] = useState<string | null>(null);
  
  // Loading & Processing
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on state change usually helps UX
    window.scrollTo(0, 0);
  }, [gameState]);

  // --- Logic Helpers ---

  /**
   * Helper to shuffle array and pick N elements
   */
  const getRandomElements = <T,>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  /**
   * Selects next cities based on "Route Correlation" (Latitude) logic.
   * If user was in North, bias towards North, but allow some crossover.
   */
  const getNextCities = (round: number, previousLat: number): City[] => {
    // 1. Get pool for this round
    const roundIndex = Math.min(round - 1, TRAVEL_DB.length - 1);
    const pool = TRAVEL_DB[roundIndex];

    if (pool.length <= 3) return pool;

    // 2. Logic: "Geographic Flow"
    // Calculate a "score" for each city based on distance to previous latitude.
    // Smaller difference = higher chance, BUT we add randomness so it's not deterministic.
    const scoredCities = pool.map(city => {
        const latDiff = Math.abs(city.latitude - previousLat);
        const randomFactor = Math.random() * 30; // Random noise to allow jumps
        return { city, score: latDiff + randomFactor };
    });

    // Sort by score (ascending: closest + random noise first)
    scoredCities.sort((a, b) => a.score - b.score);

    // Pick top 3
    return scoredCities.slice(0, 3).map(item => item.city);
  };

  // --- Handlers ---

  const handleStart = async () => {
    if (!userData.nickname || !userData.selfieBase64) return;
    setGameState(GameState.INTRO);
    
    // Slight delay for effect then fetch first cities
    setTimeout(() => {
        loadCityOptionsForRound(1);
    }, 1500);
  };

  const loadCityOptionsForRound = (round: number) => {
    setIsLoading(true);
    setLoadingMessage(`${AILISHA_NAME} 正在研究 ${round === 1 ? '世界地圖' : '下一站路線'}...`);
    
    try {
        const nextCities = getNextCities(round, currentLat);
        setCityOptions(nextCities);
        setGameState(GameState.CITY_SELECTION);
    } catch (e) {
        console.error(e);
        alert("資料庫載入錯誤。");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    setCurrentLat(city.latitude); // Update current lat for next round logic
    setCityIntro(`歡迎來到 ${city.name}！${city.description}`);
    
    // Randomly select 3 landmarks from the pool of 5+
    const randomLandmarks = getRandomElements(city.landmarks, 3);
    setLandmarkOptions(randomLandmarks);
    
    setGameState(GameState.LANDMARK_SELECTION);
  };

  const handleLandmarkSelect = async (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setGameState(GameState.PHOTO_GENERATION);
    setIsLoading(true);
    setLoadingMessage(`${AILISHA_NAME} 正在 ${landmark.name} 架設相機準備自拍... 📸`);

    try {
        if (!userData.selfieBase64 || !selectedCity) return;
        
        // 1. Generate Photo with Vibe
        const photoUrl = await generateSouvenirPhoto(
            userData.selfieBase64,
            selectedCity.name,
            landmark.name,
            landmark.description,
            selectedCity.vibe // Pass the vibe for outfit generation
        );
        setGeneratedPhoto(photoUrl);

        // 2. Generate Diary Text
        const diary = await generateDiaryEntry(selectedCity.name, landmark.name);

        // 3. Save to history
        const newEntry: TravelHistoryItem = {
            round: currentRound,
            city: selectedCity,
            landmark: landmark,
            photoUrl: photoUrl,
            diaryEntry: diary
        };
        setHistory(prev => [...prev, newEntry]);
        
        setGameState(GameState.PHOTO_RESULT);

    } catch (e) {
        console.error(e);
        alert("生成照片時發生錯誤，請檢查網路連線或稍後再試。");
        setGameState(GameState.LANDMARK_SELECTION);
    } finally {
        setIsLoading(false);
    }
  };

  const handleNextRound = () => {
    if (currentRound >= TOTAL_ROUNDS) {
        setGameState(GameState.SUMMARY);
    } else {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        if (selectedCity) {
            setCurrentLocation(selectedCity.name);
            loadCityOptionsForRound(nextRound);
        }
    }
  };

  const handleDownloadItinerary = () => {
    if (history.length === 0) return;

    // Create a standalone HTML string
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <title>我的世界之旅 - ${userData.nickname}</title>
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
          <p class="subtitle">冒險家: ${userData.nickname} • 日期: ${new Date().toLocaleDateString()}</p>
        </div>
        ${history.map((item, idx) => `
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
    a.download = `world_tour_${userData.nickname}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Renders ---

  const renderHeader = () => (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm p-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 ring-2 ring-pink-100">
           {/* Direct URL usage prevents CORS issues during rendering */}
           <img src={AILISHA_AVATAR_URL} alt="Ailisha" className="w-full h-full object-cover" />
        </div>
        <div>
           <h1 className="font-bold text-pink-600 text-lg leading-tight">與 Ailisha 艾莉莎環遊世界</h1>
           <p className="text-xs text-gray-500">{currentRound <= TOTAL_ROUNDS ? `第 ${currentRound} / ${TOTAL_ROUNDS} 站` : '旅程結束'}</p>
        </div>
      </div>
      {userData.selfieBase64 && (
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={userData.selfieBase64} alt="You" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  const renderStart = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            與 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ailisha</span><br/>一起環遊世界
        </h1>
        <p className="text-gray-600 leading-relaxed">
            嗨！我是 Ailisha 艾莉莎。<br/>
            上傳一張自拍，我們馬上從 <b className="text-gray-800">台北 101</b> 出發！ 🌍 ✨
        </p>
      </div>

      <div className="w-full space-y-5 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">您的暱稱</label>
            <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-gray-800 font-medium placeholder-gray-400 transition-all"
                placeholder="例如：冒險家小明"
                value={userData.nickname}
                onChange={(e) => setUserData({...userData, nickname: e.target.value})}
            />
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">您的自拍照</label>
            <PhotoUpload onImageSelected={(base64) => setUserData({...userData, selfieBase64: base64})} />
        </div>
        
        {userData.selfieBase64 && (
             <div className="flex justify-center">
                 <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                    <img src={userData.selfieBase64} className="w-full h-full object-cover" alt="Preview" />
                 </div>
             </div>
        )}

        <Button 
            disabled={!userData.nickname || !userData.selfieBase64} 
            onClick={handleStart}
            className="text-lg py-4 shadow-pink-500/20"
        >
            出發去旅行！ ✈️
        </Button>
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center animate-fade-in">
       <div className="text-6xl mb-6 animate-bounce">🇹🇼 ➡️ 🌏</div>
       <h2 className="text-3xl font-bold mb-4 text-gray-800">起點：台北 101！</h2>
       <p className="text-gray-600 mb-8 max-w-xs mx-auto leading-relaxed">
         太興奮了，{userData.nickname}！我們將從台北出發。
         我正在計算最佳的順時針飛行路線...
       </p>
       <div className="animate-spin text-pink-500 text-5xl">✈️</div>
    </div>
  );

  const renderCitySelection = () => (
    <div className="p-6 pb-32 max-w-lg mx-auto">
       <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex gap-4 items-start border border-gray-100">
         <img src={AILISHA_AVATAR_URL} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-pink-100" alt="Ailisha" />
         <div className="bg-pink-50 p-4 rounded-2xl rounded-tl-none">
            <p className="text-gray-800 font-medium leading-relaxed">
                我們現在位於 <span className="font-bold text-pink-600">{currentLocation}</span>。
                <br/>
                往東飛的話，這三個地方最吸引我，你想去哪裡？
            </p>
         </div>
       </div>

       <div className="space-y-6">
        {cityOptions.map((city, idx) => (
            <div key={idx} onClick={() => handleCitySelect(city)} className="group bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-pink-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl">✈️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{city.name}</h3>
                <p className="text-sm text-pink-500 font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    {city.country}
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-4">{city.description}</p>
                <div className="flex justify-end">
                    <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold text-sm group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        出發 &rarr;
                    </span>
                </div>
            </div>
        ))}
       </div>
    </div>
  );

  const renderLandmarkSelection = () => (
    <div className="p-6 pb-32 max-w-lg mx-auto">
         <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 flex flex-col gap-4 border border-gray-100">
            <div className="flex gap-4 items-start">
                <img src={AILISHA_AVATAR_URL} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-pink-100" alt="Ailisha" />
                <div className="bg-pink-50 p-4 rounded-2xl rounded-tl-none w-full">
                    <p className="text-gray-800 leading-relaxed">{cityIntro}</p>
                </div>
            </div>
            <p className="text-center text-sm font-bold text-gray-500 mt-1">✨ 我挑了三個最棒的拍照點，選一個吧！ ✨</p>
       </div>

       <div className="grid grid-cols-1 gap-6">
            {landmarkOptions.map((landmark, idx) => {
                // Generate a dynamic placeholder image URL based on the landmark name
                // Encode the name to ensure URL safety
                const bgImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(landmark.name + ' scenery realistic 4k')}`;
                
                return (
                <div key={idx} onClick={() => handleLandmarkSelect(landmark)} className="relative overflow-hidden rounded-3xl shadow-lg aspect-[4/3] cursor-pointer group isolation-auto">
                    <img 
                        src={bgImage} 
                        alt={landmark.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />
                    
                    <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-0 transition-transform">
                        <h3 className="text-white font-bold text-2xl mb-1 shadow-black drop-shadow-md">{landmark.name}</h3>
                        <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md line-clamp-2">{landmark.description}</p>
                    </div>
                </div>
            )})}
       </div>
    </div>
  );

  const renderPhotoResult = () => (
    <div className="p-6 pb-32 max-w-lg mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📸 我們的回憶</h2>
        
        <div className="w-full bg-white p-4 rounded-3xl shadow-2xl rotate-1 transform hover:rotate-0 transition-transform duration-500 mb-8 border border-gray-100">
            {generatedPhoto && (
                <div className="rounded-2xl overflow-hidden aspect-square relative bg-gray-100">
                    <img src={generatedPhoto} alt="Souvenir" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="mt-5 px-3 pb-3">
                <p className="font-handwriting text-gray-700 text-center text-lg italic leading-relaxed">
                    "{history[history.length - 1]?.diaryEntry}"
                </p>
                <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
                    <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
                        {selectedCity?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex flex-col w-full gap-3">
            <Button onClick={handleNextRound} className="w-full py-4 text-lg shadow-pink-500/30">
                {currentRound >= TOTAL_ROUNDS ? "完成旅程 🎉" : "前往下一站 ✈️"}
            </Button>
            <a 
                href={generatedPhoto || '#'} 
                download={`ailisha_travel_${currentRound}.png`}
                className="w-full bg-white text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                儲存這張照片
            </a>
        </div>
    </div>
  );

  const renderSummary = () => (
    <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">我的世界之旅</h1>
            <p className="text-gray-500 font-medium">與 Ailisha 艾莉莎 • {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pink-200 before:via-pink-400 before:to-pink-200">
            {history.map((item, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-pink-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                       <span className="text-sm font-bold">{idx + 1}</span>
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-lg border border-gray-50 hover:-translate-y-1 transition-transform duration-300">
                        <div className="mb-4 rounded-xl overflow-hidden h-48 shadow-inner">
                            <img src={item.photoUrl} alt={item.landmark.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-800 mb-1">{item.city.name}, {item.city.country}</h3>
                        <p className="text-sm text-pink-500 font-bold mb-3 flex items-center gap-1">
                            📍 {item.landmark.name}
                        </p>
                        <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg">"{item.diaryEntry}"</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-16 text-center flex flex-col sm:flex-row gap-4 justify-center pb-12">
            <Button variant="secondary" onClick={handleDownloadItinerary} className="py-4">
                📥 下載完整遊記 (HTML)
            </Button>
            <Button onClick={() => window.location.reload()} className="py-4">
                🔄 開始新的旅程
            </Button>
        </div>
    </div>
  );

  const renderLoading = () => (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 mb-8 relative">
             <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-3xl">✈️</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">請稍候...</h3>
        <p className="text-gray-500 animate-pulse font-medium">{loadingMessage}</p>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans" ref={scrollRef}>
        <BackgroundMusic gameState={gameState} />
        {gameState !== GameState.START && renderHeader()}
        
        <main className="container mx-auto">
            {isLoading && renderLoading()}
            
            {gameState === GameState.START && renderStart()}
            {gameState === GameState.INTRO && renderIntro()}
            {gameState === GameState.CITY_SELECTION && renderCitySelection()}
            {gameState === GameState.LANDMARK_SELECTION && renderLandmarkSelection()}
            {gameState === GameState.PHOTO_GENERATION && renderLoading()} 
            {gameState === GameState.PHOTO_RESULT && renderPhotoResult()}
            {gameState === GameState.SUMMARY && renderSummary()}
        </main>
    </div>
  );
};

export default App;