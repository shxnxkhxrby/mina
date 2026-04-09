import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const BGM_URL = 'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775740394/MINASA_BGM_c1dgyc.mp3';

/**
 * AudioManager — mount this ONCE at the app root (e.g. inside App.tsx / main layout).
 * It creates a single looping <audio> element that persists for the entire session.
 * Volume is driven by the musicVolume value from the game store.
 */
export default function AudioManager() {
  const musicVolume = useGameStore(s => s.musicVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(BGM_URL);
    audio.loop = true;
    audio.volume = useGameStore.getState().musicVolume;
    audioRef.current = audio;

    // Try autoplay; if blocked, start on first user interaction
    const tryPlay = () => {
      if (!startedRef.current) {
        startedRef.current = true;
        audio.play().catch(() => {});
      }
    };

    audio.play().then(() => {
      startedRef.current = true;
    }).catch(() => {
      // Autoplay blocked — wait for first interaction
      const events = ['click', 'touchstart', 'keydown'];
      const handler = () => {
        tryPlay();
        events.forEach(e => document.removeEventListener(e, handler));
      };
      events.forEach(e => document.addEventListener(e, handler, { once: true }));
    });

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync volume whenever musicVolume changes in the store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  return null;
}

/**
 * Helper hook — call this inside any component that plays Mina's voice lines.
 * It returns a `play(src)` function that respects voiceVolume from the store.
 *
 * Usage:
 *   const { play, stop } = useVoiceAudio();
 *   useEffect(() => { play(MINA_INTRO_DIALOGUES[idx].audio); }, [idx]);
 */
export function useVoiceAudio() {
  const voiceVolume = useGameStore(s => s.voiceVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const play = (src: string | undefined) => {
    stop();
    if (!src) return;
    const audio = new Audio(src);
    audio.volume = useGameStore.getState().voiceVolume;
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  // Keep volume in sync even mid-playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = voiceVolume;
    }
  }, [voiceVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play, stop };
}
