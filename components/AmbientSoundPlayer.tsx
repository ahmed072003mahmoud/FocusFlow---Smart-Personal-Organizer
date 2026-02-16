
import React, { useEffect, useRef } from 'react';
import { useApp } from '../AppContext';

const SOUNDS = {
  rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder, using Helix for stability
  cafe: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  white: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
};

export const AmbientSoundPlayer: React.FC = () => {
  const { ambientSound } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (ambientSound !== 'none' && audioRef.current) {
      audioRef.current.src = (SOUNDS as any)[ambientSound];
      audioRef.current.play().catch(() => console.warn('Autoplay blocked'));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [ambientSound]);

  return <audio ref={audioRef} loop hidden />;
};
