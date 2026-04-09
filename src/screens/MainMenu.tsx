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
        background: 'rgba(0,0,0,0.10)',
        zIndex: 1,
      }} />

      {/* Title top-left */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'clamp(14px, 3vh, 30px)',
          left: 'clamp(20px, 4vw, 48px)',
          zIndex: 20,
        }}
      >
        <span style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
          color: '#E8650A',
          fontWeight: 900,
          textShadow: '3px 4px 0 rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.5)',
          letterSpacing: '1px',
          lineHeight: 1,
          display: 'block',
        }}>
          Mina App
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
        justifyContent: 'space-between',
        padding: 'clamp(80px, 14vh, 120px) clamp(32px, 6vw, 80px) clamp(28px, 5vh, 64px)',
        boxSizing: 'border-box',
        gap: 'clamp(16px, 3vw, 48px)',
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
            width: 'clamp(300px, 44vw, 560px)',
            height: 'clamp(260px, 44vh, 500px)',
            flexShrink: 0,
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

          <Tile onClick={handleAdvanced} delay={0.30} label="Advanced Mode" />

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
              height: 'clamp(300px, 78vh, 760px)',
              width: 'auto',
              maxWidth: 'clamp(220px, 40vw, 500px)',
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
            width: 88vw !important;
            height: auto !important;
          }
          .mina-wrap {
            display: none !important;
          }
        }

        @media (min-width: 561px) and (max-width: 860px) {
          .menu-grid {
            width: 54vw !important;
            height: clamp(230px, 46vw, 420px) !important;
          }
          .mina-wrap img {
            height: clamp(240px, 52vw, 400px) !important;
            max-width: 38vw !important;
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
          minHeight: 'clamp(90px, 16vh, 160px)',
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
            fontSize: 'clamp(1rem, 2.6vw, 1.7rem)',
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