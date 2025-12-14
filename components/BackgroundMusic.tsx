import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState } from '../types';

// 音樂檔案路徑（assets 目錄是 publicDir，會複製到 dist 根目錄）
const music1 = '/Ailishamusic1.mp3';
const music2 = '/Ailishamusic2.mp3';

interface BackgroundMusicProps {
  gameState: GameState;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ gameState }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true); // 是否自動輪播
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracks = [music1, music2];
  
  // 切換到下一首歌曲
  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);
  
  // 切換到上一首歌曲
  const handlePrevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);
  
  // 初始化音頻元素
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = false; // 不循環單首歌曲，而是切換到下一首
      audio.volume = 0.5; // 設置音量為 50%
      audioRef.current = audio;
    }
    
    const audio = audioRef.current;
    
    // 當歌曲結束時，自動播放下一首（如果啟用自動播放）
    const handleEnded = () => {
      if (isAutoPlay && isPlaying) {
        handleNextTrack();
      }
    };
    
    // 當歌曲可以播放時
    const handleCanPlay = () => {
      if (isPlaying && !isMuted) {
        audio.play().catch(err => {
          console.error('播放音樂失敗:', err);
        });
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isAutoPlay, isPlaying, isMuted, handleNextTrack]);
  
  // 當切換歌曲時，更新音頻源
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.src = tracks[currentTrackIndex];
      audioRef.current.load();
      
      if (!isMuted) {
        audioRef.current.play().catch(err => {
          console.error('播放音樂失敗:', err);
        });
      }
    }
  }, [currentTrackIndex, isPlaying]);
  
  // 當靜音狀態改變時
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('播放音樂失敗:', err);
        });
      }
    }
  }, [isMuted, isPlaying]);
  
  // 切換播放/暫停
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (!isPlaying) {
      // 開始播放
      audioRef.current.src = tracks[currentTrackIndex];
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error('播放音樂失敗:', err);
      });
      setIsPlaying(true);
    } else {
      // 暫停播放
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // 切換靜音
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // 切換自動播放
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };
  
  // 獲取當前歌曲名稱
  const getCurrentTrackName = () => {
    return `Ailisha 音樂 ${currentTrackIndex + 1}`;
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {/* 音樂控制面板 */}
      {isPlaying && (
        <div className="flex flex-col gap-2 items-end">
          {/* 歌曲資訊和控制 */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md bg-white/90 border border-pink-200">
            {/* 上一首 */}
            <button
              onClick={handlePrevTrack}
              className="p-1 text-pink-600 hover:text-pink-700 transition-colors"
              title="上一首"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4 8v8a1 1 0 001.6.8l5.334-4a1 1 0 000-1.6L5.6 7.2A1 1 0 004 8z" />
              </svg>
            </button>
            
            {/* 歌曲名稱 */}
            <span className="text-xs font-medium text-gray-700 min-w-[100px] text-center">
              {getCurrentTrackName()}
            </span>
            
            {/* 下一首 */}
            <button
              onClick={handleNextTrack}
              className="p-1 text-pink-600 hover:text-pink-700 transition-colors"
              title="下一首"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19 8v8a1 1 0 01-1.6.8l-5.334-4a1 1 0 010-1.6l5.334-4A1 1 0 0019 8z" />
              </svg>
            </button>
          </div>
          
          {/* 自動播放切換 */}
          <button
            onClick={toggleAutoPlay}
            className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
              isAutoPlay 
                ? 'bg-pink-100 text-pink-700 border border-pink-300' 
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            title={isAutoPlay ? '關閉自動播放' : '開啟自動播放'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isAutoPlay ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span className="text-xs font-medium">自動</span>
          </button>
        </div>
      )}
      
      {/* 主控制按鈕 */}
      <div className="flex items-center gap-2">
        {/* 播放/暫停按鈕 */}
        <button 
          onClick={togglePlay}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
            ${!isPlaying 
              ? 'bg-pink-500 text-white hover:bg-pink-600 animate-pulse' 
              : 'bg-white/90 text-pink-600 border border-pink-200 hover:bg-pink-50'
            }
          `}
          title={isPlaying ? '暫停' : '播放'}
        >
          {!isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold">播放</span>
            </>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        {/* 靜音/取消靜音按鈕 */}
        {isPlaying && (
          <button 
            onClick={toggleMute}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
              ${isMuted 
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                : 'bg-white/90 text-pink-600 border border-pink-200 hover:bg-pink-50'
              }
            `}
            title={isMuted ? '取消靜音' : '靜音'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <>
                <div className="flex gap-1 h-3 items-end">
                  <div className="w-1 bg-pink-500 animate-[pulse_0.8s_ease-in-out_infinite] h-full"></div>
                  <div className="w-1 bg-pink-500 animate-[pulse_1.2s_ease-in-out_infinite] h-2/3"></div>
                  <div className="w-1 bg-pink-500 animate-[pulse_1.0s_ease-in-out_infinite] h-full"></div>
                </div>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
