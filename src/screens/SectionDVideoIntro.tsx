import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

// ─── Place your video at: public/videos/section_d_intro.mp4
//
//     Project structure:
//       your-project/
//         public/
//           videos/
//             section_d_intro.mp4   ← put it here
//             section_d_intro.webm  ← optional (better browser support)
//         src/
//           scenes/
//             SectionDVideoIntro.tsx
//
//     The file is served at runtime as: /videos/section_d_intro.mp4
//     Supported formats tried in order: .mp4 → .webm → .ogg
//     If none load, the screen is skipped automatically and the app continues.
//
//     AUDIO NOTE: Browsers block autoplay with sound until the user has
//     interacted with the page. By the time this screen is reached the user
//     has already tapped/clicked, so audio should play normally. If you still
//     get no sound, make sure the video file itself has an audio track and
//     that your browser's site settings allow autoplay with sound.
// ────────────────────────────────────────────────────────────────────────────

const VIDEO_CANDIDATES = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775504921/section_d_intro_b1cokk.mp4'
];

export default function SectionDVideoIntro() {
  const { goToScene } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [srcIndex, setSrcIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(false); // start unmuted; fallback to muted if autoplay blocked

  // After video (or skip/fail) go to CUTSCENE — the Section D dancer quiz screen.
  const nextScene = 'CUTSCENE';

  // Attempt unmuted autoplay; if browser blocks it, retry muted so video still plays.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay with audio blocked — mute and retry so video at least plays.
        setMuted(true);
        video.muted = true;
        video.play().catch(() => {
          // If even muted autoplay fails, skip to next src or scene.
          handleError();
        });
      });
    }
  }, [srcIndex]);

  useEffect(() => {
    if (videoFailed) {
      goToScene(nextScene);
    }
  }, [videoFailed]);

  function handleError() {
    if (srcIndex + 1 < VIDEO_CANDIDATES.length) {
      setSrcIndex(i => i + 1);
    } else {
      setVideoFailed(true);
    }
  }

  function handleEnded() {
    goToScene(nextScene);
  }

  function handleSkip() {
    goToScene(nextScene);
  }

  // User taps screen — unmute if we had to mute for autoplay
  function handleUnmute() {
    const video = videoRef.current;
    if (video && muted) {
      video.muted = false;
      setMuted(false);
    }
  }

  if (videoFailed) return null;

  return (
    <div
      className="scene"
      style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={handleUnmute}
    >
      <video
        ref={videoRef}
        key={srcIndex}
        src={VIDEO_CANDIDATES[srcIndex]}
        playsInline
        onEnded={handleEnded}
        onError={handleError}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Tap-to-unmute hint — shown only when browser forced mute */}
      {muted && (
        <div style={{
          position: 'absolute',
          top: 'clamp(16px,3vh,28px)',
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: 'clamp(0.6rem,1.2vw,0.78rem)',
          fontFamily: 'var(--font-body)',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          🔇 Tap anywhere to unmute
        </div>
      )}

      <button
        onClick={e => { e.stopPropagation(); handleSkip(); }}
        className="btn btn-ghost btn-sm"
        style={{
          position: 'absolute',
          bottom: 'clamp(16px,3vh,28px)',
          right: 'clamp(16px,3vw,28px)',
          color: 'rgba(255,255,255,0.8)',
          background: 'rgba(0,0,0,0.45)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          borderRadius: '20px',
          zIndex: 10,
        }}
      >
        Skip ➜
      </button>
    </div>
  );
}