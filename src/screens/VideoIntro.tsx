import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

// Place your intro video at /videos/intro.mp4 (also supports .webm and .ogg).
// If no video is found or it fails to load, this screen is skipped automatically.
const VIDEO_CANDIDATES = ['https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775505066/intro_py5nfs.mp4'];

export default function VideoIntro() {
  const { goToScene } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);

  // If all candidates fail, skip straight to NAME_INPUT
  useEffect(() => {
    if (failed) {
      goToScene('NAME_INPUT');
    }
  }, [failed, goToScene]);

  const handleError = () => {
    if (srcIndex + 1 < VIDEO_CANDIDATES.length) {
      setSrcIndex(i => i + 1);
    } else {
      setFailed(true);
    }
  };

  const handleEnded = () => {
    goToScene('NAME_INPUT');
  };

  const handleSkip = () => {
    setVisible(false);
    goToScene('NAME_INPUT');
  };

  if (!visible || failed) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      <video
        ref={videoRef}
        key={srcIndex}
        src={VIDEO_CANDIDATES[srcIndex]}
        autoPlay
        playsInline
        onError={handleError}
        onEnded={handleEnded}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: 'clamp(16px,3vh,28px)',
          right: 'clamp(16px,3vw,28px)',
          background: 'rgba(0,0,0,0.55)',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '20px',
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.6rem,1.2vw,0.78rem)',
          padding: '5px 16px',
          cursor: 'pointer',
          zIndex: 10,
          letterSpacing: '0.5px',
        }}
      >
        Skip ▶▶
      </button>
    </div>
  );
}
