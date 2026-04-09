import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {/* ── Background ── */}
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

      {/* Subtle blur + dim overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        background: 'rgba(0,0,0,0.08)',
        zIndex: 1,
      }} />

      {/* ── Title: top-left ── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'clamp(10px, 2.5vh, 22px)',
          left: 'clamp(14px, 3vw, 36px)',
          zIndex: 20,
        }}
      >
        <span style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
          color: '#E8650A',
          fontWeight: 900,
          textShadow: '3px 4px 0 rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.6)',
          letterSpacing: '1px',
          display: 'block',
          lineHeight: 1,
        }}>
          Mina App
        </span>
      </motion.div>

      {/* ── Main layout ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: 'clamp(72px, 12vh, 110px) clamp(10px, 3vw, 40px) clamp(16px, 4vh, 40px)',
        boxSizing: 'border-box',
        gap: 'clamp(0px, 2vw, 20px)',
      }}>

        {/* ── Left: tile grid ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 'clamp(5px, 0.8vw, 10px)',
            width: 'clamp(290px, 46vw, 560px)',
            height: 'clamp(240px, 46vh, 480px)',
            flexShrink: 0,
            alignSelf: 'flex-end',
          }}
          className="menu-grid"
        >
          {/* TOP-LEFT */}
          {playerName ? (
            <Tile onClick={handleStoryMode} delay={0.18} label="Continue" />
          ) : (
            /* Fresh start: Story Mode spans full top row */
            <Tile onClick={handleStoryMode} delay={0.18} label="Story Mode" wide />
          )}

          {/* TOP-RIGHT: New Game only if save exists */}
          {playerName ? (
            <Tile onClick={handleNewGame} delay={0.24} label="New Game" />
          ) : (
            /* empty slot — wide tile above already spans 2 cols */
            null
          )}

          {/* BOTTOM-LEFT: Advanced Mode */}
          <Tile onClick={handleAdvanced} delay={0.30} label="Advanced Mode" />

          {/* BOTTOM-RIGHT: Volume Settings */}
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

        {/* ── Right: Mina mascot ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 70, damping: 14 }}
          style={{
            flexShrink: 0,
            alignSelf: 'flex-end',
            marginBottom: '-6px',
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
          className="mina-wrap"
        >
          <motion.img
            src={ASSETS.minaMascot}
            alt="Mina"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: 'clamp(260px, 72vh, 700px)',
              width: 'auto',
              maxWidth: 'clamp(200px, 42vw, 480px)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.30))',
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
            width: 90vw !important;
            height: auto !important;
          }
          .mina-wrap {
            display: none !important;
          }
        }

        @media (min-width: 561px) and (max-width: 820px) {
          .menu-grid {
            width: 52vw !important;
            height: clamp(220px, 44vw, 400px) !important;
          }
          .mina-wrap img {
            height: clamp(220px, 55vw, 380px) !important;
            max-width: 36vw !important;
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
          background: #E8650A;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #E8650A;
          border: 2.5px solid #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Tile ─────────────────────────────────────────────────────────────────────
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
        whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 'clamp(90px, 16vh, 160px)',
          /* Scene-bleed: semi-transparent so bg shows through like screenshot */
          background: 'linear-gradient(160deg, rgba(160,218,100,0.72) 0%, rgba(100,185,55,0.78) 55%, rgba(70,150,30,0.82) 100%)',
          border: '4px solid rgba(255,255,255,0.60)',
          borderRadius: 'clamp(10px, 1.6vw, 20px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.28), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(0,0,0,0.10)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isVolume && showVolume
            ? 'clamp(10px,1.6vh,18px) clamp(12px,1.8vw,20px)'
            : 'clamp(8px,1.2vh,14px) clamp(8px,1.2vw,14px)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          gap: '6px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.18s',
        }}
      >
        {/* Inner sky-like gradient to mimic the scene showing through */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(180,230,255,0.25) 0%, rgba(120,200,80,0.10) 55%, rgba(60,140,20,0.20) 100%)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />
        {/* Grassy ground strip at bottom of tile */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '28%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(60,130,20,0.35) 100%)',
          borderRadius: '0 0 inherit inherit',
          pointerEvents: 'none',
        }} />

        {isVolume && showVolume ? (
          <div
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.2vh,12px)', zIndex: 2 }}
            onClick={e => e.stopPropagation()}
          >
            <span style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(0.75rem, 1.9vw, 1.1rem)',
              color: '#4A2000',
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 1px 0 rgba(255,255,255,0.6)',
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
            fontSize: 'clamp(1rem, 2.6vw, 1.65rem)',
            color: '#4A2000',
            fontWeight: 900,
            textShadow: '0 2px 0 rgba(255,255,255,0.65), 0 1px 4px rgba(0,0,0,0.15)',
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

// ── Volume slider ─────────────────────────────────────────────────────────────
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
        fontSize: 'clamp(0.55rem, 1.1vw, 0.72rem)',
        color: '#4A2000',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>{icon}</span>
          {label}
        </span>
        <span style={{ fontWeight: 700, color: '#E8650A', minWidth: '28px', textAlign: 'right' }}>
          {pct}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '0.65rem', opacity: 0.55 }}>🔈</span>
        <input
          type="range"
          className="vol-slider"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: `linear-gradient(to right, #E8650A ${pct}%, rgba(255,255,255,0.45) ${pct}%)`,
          }}
        />
        <span style={{ fontSize: '0.65rem', opacity: 0.55 }}>🔊</span>
      </div>
    </div>
  );
}