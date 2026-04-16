import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';



const BGM_URL =
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1776356694/MINASA_rmup6q.mp3';

// ── BGM behaviour per scene ───────────────────────────────────────────────
//   'mute'  → pause BGM entirely (video scenes with their own audio/music)
//   'duck'  → lower BGM to DUCK_RATIO of the user's set volume (voiceover scenes)
//   'normal'→ full user-set volume (everything else)

const DUCK_RATIO = 0.25; // BGM plays at 25 % of user volume while ducked

type BgmMode = 'normal' | 'duck' | 'mute';

function getBgmMode(scene: string): BgmMode {
  switch (scene) {
    // Video scenes — silence BGM completely
    case 'VIDEO_INTRO':
    case 'SECTION_D_VIDEO':
      return 'mute';

    // Voiceover / Mina appearance scenes — duck BGM
    case 'TEACHER_INTRO':
    case 'MINA_INTRO':
    case 'STORYLINE':
    case 'GRAMMAR_LESSON':
      return 'duck';

    default:
      return 'normal';
  }
}

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
  const currentScene = useGameStore(s => s.currentScene);
  const startedRef = useRef(false);

  // Start BGM on first user interaction if not already playing
  useEffect(() => {
    const bgm = getBgm();
    bgm.volume = musicVolume;

    const startBgm = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      bgm.play().catch(() => {});
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

  // React to scene changes — mute, duck, or restore BGM
  useEffect(() => {
    const bgm = getBgm();
    const mode = getBgmMode(currentScene);

    if (mode === 'mute') {
      // Pause the BGM entirely for video scenes
      bgm.pause();
    } else if (mode === 'duck') {
      // Lower to DUCK_RATIO of the user's chosen volume
      bgm.volume = Math.max(0, Math.min(1, musicVolume * DUCK_RATIO));
      // Resume in case it was paused by a previous mute scene
      if (startedRef.current && bgm.paused) {
        bgm.play().catch(() => {});
      }
    } else {
      // Normal — restore full user volume and resume if needed
      bgm.volume = Math.max(0, Math.min(1, musicVolume));
      if (startedRef.current && bgm.paused) {
        bgm.play().catch(() => {});
      }
    }
  }, [currentScene, musicVolume]);

  // Sync volume whenever the user's slider changes (respects current mode)
  useEffect(() => {
    const bgm = getBgm();
    const mode = getBgmMode(currentScene);

    if (mode === 'mute') return; // keep paused, no volume update needed
    const target = mode === 'duck'
      ? musicVolume * DUCK_RATIO
      : musicVolume;
    bgm.volume = Math.max(0, Math.min(1, target));
  }, [musicVolume, currentScene]);

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