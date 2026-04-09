import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

export default function MainMenu() {
  const {
    goToScene, playerName, setAdvancedMode,
    musicVolume, voiceVolume, setMusicVolume, setVoiceVolume,
  } = useGameStore();
  const [showVolume, setShowVolume] = useState(false);

  const handleStoryMode = () => {
    setAdvancedMode(false);
    goToScene(playerName ? 'MAP' : 'VIDEO_INTRO');
  };

  const handleNewGame = () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().goToScene('VIDEO_INTRO');
  };

  const handleAdvanced = () => {
    setAdvancedMode(true);
    goToScene('MAP');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      fontFamily: '"Fredoka One", "Baloo 2", cursive',
    }}>
      {/* Background */}
      <img
        src={ASSETS.logo}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Blur + dim overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(2.5px)',
        WebkitBackdropFilter: 'blur(2.5px)',
        background: 'rgba(0,0,0,0.42)',
        zIndex: 1,
      }} />

      {/* Title — M.I.N.A. */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'clamp(14px, 3vh, 30px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          whiteSpace: 'nowrap',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
        }}
      >
        {/* Decorative rule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '2px',
        }}>
          <div style={{
            width: 'clamp(24px, 5vw, 48px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(232,101,10,0.8))',
            borderRadius: '2px',
          }} />
          <div style={{
            width: 'clamp(4px, 0.8vw, 6px)',
            height: 'clamp(4px, 0.8vw, 6px)',
            borderRadius: '50%',
            background: '#F5C84A',
            boxShadow: '0 0 8px rgba(245,200,74,0.9)',
          }} />
          <div style={{
            width: 'clamp(24px, 5vw, 48px)',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(232,101,10,0.8), transparent)',
            borderRadius: '2px',
          }} />
        </div>

        {/* M.I.N.A. wordmark */}
        <div style={{ position: 'relative', lineHeight: 1 }}>
          <span style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
            color: '#E8650A',
            fontWeight: 900,
            textShadow: '3px 4px 0 rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.4)',
            letterSpacing: '5px',
            display: 'block',
          }}>
            M.I.N.A.
          </span>
          {/* Gold underline accent */}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #F5C84A 25%, #F5C84A 75%, transparent)',
            borderRadius: '2px',
          }} />
        </div>

        {/* Subtitle tagline */}
        <span style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 'clamp(0.5rem, 1.1vw, 0.78rem)',
          color: 'rgba(255,248,220,0.88)',
          letterSpacing: '5px',
          textTransform: 'uppercase' as const,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          marginTop: '6px',
          display: 'block',
        }}>
          Grammar Quest
        </span>
      </motion.div>

      {/* Main layout */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px, 14vh, 120px) 0 clamp(28px, 5vh, 64px)',
        boxSizing: 'border-box',
        gap: 0,
      }}>

        {/* Tile grid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 'clamp(8px, 1.2vw, 16px)',
            width: 'clamp(280px, 38vw, 480px)',
            height: 'clamp(240px, 40vh, 460px)',
            flexShrink: 0,
            zIndex: 11,
            marginLeft: 'clamp(16px, 6vw, 80px)',
            marginRight: 'clamp(-40px, -4vw, -16px)',
          }}
          className="menu-grid"
        >
          {playerName ? (
            <Tile onClick={handleStoryMode} delay={0.18} label="Continue" />
          ) : (
            <Tile onClick={handleStoryMode} delay={0.18} label="Story Mode" wide />
          )}

          {playerName ? (
            <Tile onClick={handleNewGame} delay={0.24} label="New Game" />
          ) : null}

          <Tile onClick={handleAdvanced} delay={0.30} label="Mastery Checkpoint" />

          <Tile
            onClick={() => setShowVolume(v => !v)}
            delay={0.36}
            label="Volume Settings"
            isVolume
            showVolume={showVolume}
            musicVolume={musicVolume}
            voiceVolume={voiceVolume}
            setMusicVolume={setMusicVolume}
            setVoiceVolume={setVoiceVolume}
          />
        </motion.div>

        {/* Mina mascot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 70, damping: 14 }}
          style={{
            flex: '0 0 auto',
            alignSelf: 'flex-end',
            marginBottom: '-8px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          className="mina-wrap"
        >
          <motion.img
            src={ASSETS.minaMascot}
            alt="Mina"
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: 'clamp(380px, 88vh, 900px)',
              width: 'auto',
              maxWidth: 'clamp(260px, 48vw, 560px)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 14px 36px rgba(0,0,0,0.28))',
              display: 'block',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

        @media (max-width: 560px) {
          .menu-grid {
            width: 56vw !important;
            height: auto !important;
            margin-left: clamp(12px, 4vw, 24px) !important;
            margin-right: 0 !important;
            z-index: 11;
          }
          .mina-wrap {
            position: absolute !important;
            right: 0 !important;
            bottom: 0 !important;
            pointer-events: none;
          }
          .mina-wrap img {
            height: clamp(220px, 58vw, 340px) !important;
            max-width: 52vw !important;
          }
        }

        @media (min-width: 561px) and (max-width: 860px) {
          .menu-grid {
            width: 46vw !important;
            height: clamp(220px, 44vw, 400px) !important;
            margin-right: clamp(-24px, -2vw, -8px) !important;
          }
          .mina-wrap img {
            height: clamp(300px, 62vw, 500px) !important;
            max-width: 42vw !important;
          }
        }

        input[type='range'].vol-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }
        input[type='range'].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 6px rgba(0,0,0,0.30);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid rgba(255,255,255,0.8);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

interface TileProps {
  onClick: () => void;
  delay: number;
  label: string;
  wide?: boolean;
  isVolume?: boolean;
  showVolume?: boolean;
  musicVolume?: number;
  voiceVolume?: number;
  setMusicVolume?: (v: number) => void;
  setVoiceVolume?: (v: number) => void;
}

function Tile({
  onClick, delay, label, wide,
  isVolume, showVolume,
  musicVolume, voiceVolume, setMusicVolume, setVoiceVolume,
}: TileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.38, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        gridColumn: wide ? '1 / -1' : undefined,
        width: '100%',
        height: '100%',
      }}
    >
      <motion.button
        whileHover={{ scale: 1.05, filter: 'brightness(1.12)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 'clamp(80px, 14vh, 140px)',
          background: 'linear-gradient(160deg, #F07820 0%, #E8650A 50%, #CF5508 100%)',
          border: '3.5px solid rgba(255,255,255,0.55)',
          borderRadius: 'clamp(12px, 1.8vw, 22px)',
          boxShadow: '0 6px 22px rgba(0,0,0,0.30), inset 0 2px 0 rgba(255,255,255,0.40), inset 0 -3px 0 rgba(0,0,0,0.18)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isVolume && showVolume
            ? 'clamp(10px, 1.6vh, 18px) clamp(12px, 1.8vw, 20px)'
            : 'clamp(8px, 1.2vh, 14px) clamp(8px, 1.2vw, 14px)',
          gap: '6px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.18s',
        }}
      >
        {/* Sheen highlight */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />

        {isVolume && showVolume ? (
          <div
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.2vh,12px)', zIndex: 2 }}
            onClick={e => e.stopPropagation()}
          >
            <span style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(0.8rem, 1.9vw, 1.1rem)',
              color: '#fff',
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 1px 3px rgba(0,0,0,0.30)',
            }}>
              Volume Settings
            </span>
            <VolumeSlider
              icon="🎵"
              label="Game music"
              value={musicVolume ?? 0.5}
              onChange={setMusicVolume ?? (() => {})}
            />
            <VolumeSlider
              icon="🎙"
              label="Mina's voice"
              value={voiceVolume ?? 0.8}
              onChange={setVoiceVolume ?? (() => {})}
            />
          </div>
        ) : (
          <span style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)',
            color: '#fff',
            fontWeight: 900,
            textShadow: '0 2px 4px rgba(0,0,0,0.30), 0 1px 0 rgba(0,0,0,0.15)',
            textAlign: 'center',
            lineHeight: 1.2,
            zIndex: 2,
          }}>
            {label}
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}

function VolumeSlider({
  icon, label, value, onChange,
}: {
  icon: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: '"Fredoka One", cursive',
        fontSize: 'clamp(0.55rem, 1.1vw, 0.75rem)',
        color: 'rgba(255,255,255,0.92)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>{icon}</span>
          {label}
        </span>
        <span style={{ fontWeight: 700, color: '#fff', minWidth: '28px', textAlign: 'right' }}>
          {pct}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>🔈</span>
        <input
          type="range"
          className="vol-slider"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: `linear-gradient(to right, rgba(255,255,255,0.95) ${pct}%, rgba(255,255,255,0.30) ${pct}%)`,
          }}
        />
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>🔊</span>
      </div>
    </div>
  );
}