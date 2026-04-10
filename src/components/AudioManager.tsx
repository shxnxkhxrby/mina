import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

//https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775740394/MINASA_BGM_c1dgyc.mp3

const BGM_URL =
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775800697/Pufino_-_Enlivening_freetouse.com_hwfxmb.mp3';

// ── Global singleton audio refs (survive re-renders / HMR) ────────────────
let bgmInstance: HTMLAudioElement | null = null;

function getBgm(): HTMLAudioElement {
  if (!bgmInstance) {
    bgmInstance = new Audio(BGM_URL);
    bgmInstance.loop = true;
    bgmInstance.preload = 'auto';
  }
  return bgmInstance;
}

// ── AudioManager component — mount ONCE in App.tsx ────────────────────────
export default function AudioManager() {
  const musicVolume = useGameStore(s => s.musicVolume);
  const startedRef = useRef(false);

  // Start BGM on first user interaction if not already playing
  useEffect(() => {
    const bgm = getBgm();
    bgm.volume = musicVolume;

    const startBgm = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      bgm.play().catch(() => {});
      // Remove all listeners once started
      document.removeEventListener('click', startBgm);
      document.removeEventListener('keydown', startBgm);
      document.removeEventListener('touchstart', startBgm);
    };

    // Try immediate autoplay first
    bgm.play()
      .then(() => { startedRef.current = true; })
      .catch(() => {
        // Autoplay blocked — wait for interaction
        document.addEventListener('click', startBgm);
        document.addEventListener('keydown', startBgm);
        document.addEventListener('touchstart', startBgm);
      });

    return () => {
      document.removeEventListener('click', startBgm);
      document.removeEventListener('keydown', startBgm);
      document.removeEventListener('touchstart', startBgm);
    };
  }, []);

  // Sync volume whenever it changes in the store
  useEffect(() => {
    const bgm = getBgm();
    bgm.volume = Math.max(0, Math.min(1, musicVolume));
  }, [musicVolume]);

  return null; // purely side-effect component
}

// ── Hook: voice audio that respects voiceVolume from the store ────────────
export function useVoiceAudio() {
  const voiceVolume = useGameStore(s => s.voiceVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const play = useCallback(
    (src: string | undefined) => {
      stop();
      if (!src) return;
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, voiceVolume));
      audioRef.current = audio;
      audio.play().catch(() => {});
    },
    [voiceVolume, stop],
  );

  // Keep live audio in sync if volume slider moves mid-play
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, voiceVolume));
    }
  }, [voiceVolume]);

  // Stop on unmount
  useEffect(() => () => stop(), [stop]);

  return { play, stop };
}