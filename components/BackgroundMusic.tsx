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
    masterGain.gain.value = 0.3; // Default low volume
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Start Engines
    startAmbience(ctx, masterGain);
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
        masterGainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current.currentTime, 0.1);
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

  // --- Generative Audio Logic ---

  // 1. Ambience: Filtered White Noise (Wind/Ocean effect)
  const startAmbience = (ctx: AudioContext, output: AudioNode) => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to make it sound like wind/ocean
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // LFO to modulate filter (Wind breeze effect)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow modulation
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300; // Modulation depth

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15; // Background level
    ambienceGainRef.current = noiseGain;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);

    noise.start();
    lfo.start();
  };

  // 2. Melody: Procedural Notes
  const scheduleNote = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    const currentMode = modeRef.current;

    // Config based on mode
    // Active: Higher pitch, faster, triangle wave (brighter)
    // Calm: Lower pitch, slower, sine wave (softer)
    const config = currentMode === 'ACTIVE' 
      ? {
          scale: [523.25, 587.33, 659.25, 783.99, 880.00], // C Major Pentatonic (C5 octave)
          wave: 'triangle' as OscillatorType,
          minInterval: 400,
          maxInterval: 1200,
          duration: 1.5,
          gain: 0.1
        }
      : {
          scale: [261.63, 293.66, 329.63, 392.00, 440.00, 196.00], // C Major Pentatonic (C4 octave + G3)
          wave: 'sine' as OscillatorType,
          minInterval: 2000,
          maxInterval: 4000,
          duration: 3,
          gain: 0.15
        };

    // Pick random note
    const noteFreq = config.scale[Math.floor(Math.random() * config.scale.length)];
    
    // Play Note
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = config.wave;
    osc.frequency.value = noteFreq;
    
    // Envelope (Attack -> Decay)
    const now = ctx.currentTime;
    const attack = currentMode === 'ACTIVE' ? 0.05 : 0.5;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(config.gain, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
    
    osc.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    
    osc.start(now);
    osc.stop(now + config.duration);

    // Schedule next
    const nextTime = Math.random() * (config.maxInterval - config.minInterval) + config.minInterval;
    schedulerTimeoutRef.current = window.setTimeout(scheduleNote, nextTime);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {/* 音樂風格切換按鈕 */}
      {isPlaying && !isMuted && (
        <button
          onClick={toggleMusicStyle}
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 bg-white/80 text-pink-600 border border-pink-200 hover:bg-pink-50"
          title={`切換到${musicStyle === 'ACTIVE' ? '平靜' : '活躍'}風格`}
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