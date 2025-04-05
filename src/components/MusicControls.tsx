import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}

export function MusicControls({
  isPlaying,
  onPlayPause,
  onNext,
  volume,
  onVolumeChange,
}: MusicControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      <button
        onClick={onPlayPause}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-gray-800" />
        ) : (
          <Play className="w-8 h-8 text-gray-800" />
        )}
      </button>
      
      <button
        onClick={onNext}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <SkipForward className="w-6 h-6 text-gray-600" />
      </button>

      <div className="flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}