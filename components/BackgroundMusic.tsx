import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';

interface BackgroundMusicProps {
  gameState: GameState;
}

type MusicMode = 'ACTIVE' | 'CALM';

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ gameState }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [manualStyle, setManualStyle] = useState<MusicMode | null>(null);
  
  // Refs to hold audio context and nodes so they persist across renders
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambienceGainRef = useRef<GainNode | null>(null);
  const schedulerTimeoutRef = useRef<number | null>(null);
  
  // Determine mode based on game state or user selection
  const getMode = (state: GameState): MusicMode => {
    // 如果用戶手動選擇了音樂風格，優先使用用戶選擇
    if (manualStyle) {
      return manualStyle;
    }
    // 否則根據遊戲狀態自動選擇
    switch (state) {
      case GameState.CITY_SELECTION:
      case GameState.LANDMARK_SELECTION:
        return 'ACTIVE';
      default:
        return 'CALM';
    }
  };

  const mode = getMode(gameState);
  const modeRef = useRef(mode); // Keep ref for timeout callbacks

  useEffect(() => {
    modeRef.current = mode;
    // 當模式改變時，重新調度音符以應用新風格
    if (isPlaying && !isMuted && schedulerTimeoutRef.current) {
      clearTimeout(schedulerTimeoutRef.current);
      scheduleNote();
    }
  }, [mode, isPlaying, isMuted]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (schedulerTimeoutRef.current) {
        clearTimeout(schedulerTimeoutRef.current);
      }
    };
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain (Volume Control)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.25; // 稍微降低音量，讓音樂更舒適
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Start Music Generation
    scheduleNote();
    
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioCtxRef.current) {
      initAudio();
      return;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (isMuted) {
      // Unmute
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.25, audioCtxRef.current.currentTime, 0.1);
      }
      setIsMuted(false);
    } else {
      // Mute
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      }
      setIsMuted(true);
    }
  };

  const toggleMusicStyle = () => {
    // 隨機切換音樂風格
    const styles: MusicMode[] = ['ACTIVE', 'CALM'];
    const currentStyle = manualStyle || mode;
    const availableStyles = styles.filter(s => s !== currentStyle);
    const newStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)] || styles[Math.floor(Math.random() * styles.length)];
    
    setManualStyle(newStyle);
    
    // 如果正在播放，重新調度音符以應用新風格
    if (isPlaying && !isMuted && schedulerTimeoutRef.current) {
      clearTimeout(schedulerTimeoutRef.current);
      scheduleNote();
    }
  };

  // --- Improved Generative Audio Logic ---

  // 創建更自然的音色（使用多個振盪器組合）
  const createTone = (ctx: AudioContext, freq: number, type: 'warm' | 'bright'): OscillatorNode => {
    const osc = ctx.createOscillator();
    
    if (type === 'warm') {
      // 溫暖的音色：使用正弦波 + 低八度
      osc.type = 'sine';
      osc.frequency.value = freq;
    } else {
      // 明亮的音色：使用三角波
      osc.type = 'triangle';
      osc.frequency.value = freq;
    }
    
    return osc;
  };

  // 播放和弦（多個音符同時播放）
  const playChord = (ctx: AudioContext, frequencies: number[], duration: number, gain: number, type: 'warm' | 'bright') => {
    const now = ctx.currentTime;
    const attack = 0.1;
    const release = 0.3;
    
    frequencies.forEach((freq, index) => {
      const osc = createTone(ctx, freq, type);
      const gainNode = ctx.createGain();
      
      // 稍微錯開音符開始時間，讓和弦更自然
      const startTime = now + (index * 0.02);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain * (0.7 + Math.random() * 0.3), startTime + attack);
      gainNode.gain.setTargetAtTime(0, startTime + duration - release, release / 3);
      
      osc.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  };

  // 播放單個音符（用於旋律）
  const playNote = (ctx: AudioContext, freq: number, duration: number, gain: number, type: 'warm' | 'bright') => {
    const now = ctx.currentTime;
    const attack = 0.15;
    const release = 0.2;
    
    const osc = createTone(ctx, freq, type);
    const gainNode = ctx.createGain();
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain, now + attack);
    gainNode.gain.setTargetAtTime(0, now + duration - release, release / 3);
    
    osc.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    
    osc.start(now);
    osc.stop(now + duration);
  };

  // 改進的音樂生成邏輯
  const scheduleNote = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const currentMode = modeRef.current;

    if (currentMode === 'ACTIVE') {
      // 活躍模式：更快的節奏，明亮的音色
      const majorScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77]; // C Major (C5-D5-E5-F5-G5-A5-B5)
      
      // 偶爾播放和弦
      if (Math.random() < 0.3) {
        // C Major 和弦：C-E-G
        const chordFreqs = [523.25, 659.25, 783.99];
        playChord(ctx, chordFreqs, 1.2, 0.08, 'bright');
      } else {
        // 播放單個音符，使用更流暢的旋律
        const noteIndex = Math.floor(Math.random() * majorScale.length);
        playNote(ctx, majorScale[noteIndex], 0.8, 0.12, 'bright');
      }
      
      // 下一個音符：較快節奏
      const nextTime = 600 + Math.random() * 800; // 0.6-1.4秒
      schedulerTimeoutRef.current = window.setTimeout(scheduleNote, nextTime);
    } else {
      // 平靜模式：緩慢的節奏，溫暖的音色
      const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00]; // C Major Pentatonic (C4-D4-E4-G4-A4)
      
      // 更常播放和弦，創造和諧感
      if (Math.random() < 0.5) {
        // C Major 和弦的低音版本：C-E-G
        const chordFreqs = [261.63, 329.63, 392.00];
        playChord(ctx, chordFreqs, 2.5, 0.1, 'warm');
      } else {
        // 播放單個音符
        const noteIndex = Math.floor(Math.random() * pentatonicScale.length);
        playNote(ctx, pentatonicScale[noteIndex], 2.0, 0.12, 'warm');
      }
      
      // 下一個音符：較慢節奏
      const nextTime = 2500 + Math.random() * 2000; // 2.5-4.5秒
      schedulerTimeoutRef.current = window.setTimeout(scheduleNote, nextTime);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {/* 音樂風格切換按鈕 */}
      {isPlaying && !isMuted && (
        <button
          onClick={toggleMusicStyle}
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 bg-white/80 text-pink-600 border border-pink-200 hover:bg-pink-50"
          title={`切換到${mode === 'ACTIVE' ? '平靜' : '活躍'}風格`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs font-medium">{mode === 'ACTIVE' ? '活躍' : '平靜'}</span>
        </button>
      )}
      
      {/* 播放/靜音按鈕 */}
      <button 
        onClick={toggleMute}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300
          ${!isPlaying 
            ? 'bg-pink-500 text-white animate-bounce' 
            : isMuted 
              ? 'bg-gray-800/50 text-gray-300' 
              : 'bg-white/80 text-pink-600 border border-pink-200'
          }
        `}
      >
        {!isPlaying ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold">開啟背景音樂</span>
          </>
        ) : isMuted ? (
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
    </div>
  );
};