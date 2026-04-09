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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* ── Background image ── */}
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
      {/* Light overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.06)',
        zIndex: 1,
      }} />

      {/* ── Title ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'clamp(10px, 3vh, 24px)',
          left: 'clamp(12px, 3vw, 32px)',
          zIndex: 20,
        }}
      >
        <span style={{
          fontFamily: '"Fredoka One", "Baloo 2", "Comic Sans MS", cursive',
          fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
          color: '#E8650A',
          fontWeight: 900,
          textShadow: '2px 3px 0 rgba(0,0,0,0.18), 0 1px 0 #fff',
          letterSpacing: '1px',
        }}>
          Mina App
        </span>
      </motion.div>

      {/* ── Main layout: Grid LEFT + Mina RIGHT ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 'clamp(60px, 10vh, 90px) clamp(8px, 2vw, 24px) clamp(12px, 2vh, 24px)',
        boxSizing: 'border-box',
        gap: 0,
      }}>
        {/* ── Left: 2×2 tile grid ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 'clamp(4px, 0.8vw, 8px)',
            width: 'clamp(280px, 50vw, 540px)',
            alignSelf: 'center',
            flexShrink: 0,
          }}
          className="menu-grid"
        >
          {/* TOP-LEFT: Story Mode or Continue */}
          <TileButton
            onClick={handleStoryMode}
            delay={0.2}
            label={playerName ? 'Continue' : 'Story Mode'}
          />

          {/* TOP-RIGHT: New Game (if save exists) or empty slot */}
          {playerName ? (
            <TileButton
              onClick={handleNewGame}
              delay={0.26}
              label="New Game"
            />
          ) : (
            <div style={{ background: 'transparent' }} />
          )}

          {/* BOTTOM-LEFT: Advanced Mode */}
          <TileButton
            onClick={handleAdvanced}
            delay={0.32}
            label="Advanced Mode"
          />

          {/* BOTTOM-RIGHT: Volume Settings */}
          <div style={{ position: 'relative' }}>
            <TileButton
              onClick={() => setShowVolume(v => !v)}
              delay={0.38}
              label="Volume settings"
              isVolume
              showVolume={showVolume}
              musicVolume={musicVolume}
              voiceVolume={voiceVolume}
              setMusicVolume={setMusicVolume}
              setVoiceVolume={setVoiceVolume}
            />
          </div>
        </motion.div>

        {/* ── Right: Mina mascot ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 80, damping: 16 }}
          style={{
            flexShrink: 0,
            alignSelf: 'flex-end',
            marginBottom: '-4px',
            marginLeft: 'clamp(-20px, -2vw, 0px)',
          }}
          className="mina-mascot-wrap"
        >
          <motion.img
            src={ASSETS.minaMascot}
            alt="Mina"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: 'clamp(220px, 70vh, 680px)',
              width: 'auto',
              maxWidth: 'clamp(180px, 38vw, 400px)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
              display: 'block',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

        /* Mobile: stack vertically */
        @media (max-width: 540px) {
          .menu-grid {
            width: 92vw !important;
            grid-template-columns: 1fr 1fr !important;
          }
          .mina-mascot-wrap {
            display: none !important;
          }
        }

        /* Tablet portrait */
        @media (min-width: 541px) and (max-width: 768px) {
          .menu-grid {
            width: 54vw !important;
          }
          .mina-mascot-wrap img {
            height: clamp(200px, 55vw, 380px) !important;
          }
        }

        input[type='range'].vol-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          background: rgba(255,255,255,0.4);
        }
        input[type='range'].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #E8650A;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #E8650A;
          border: 2px solid #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Tile button ─────────────────────────────────────────────────────────────
interface TileButtonProps {
  onClick: () => void;
  delay: number;
  label: string;
  color?: string;           // optional — was previously required, caused TS2741
  isVolume?: boolean;
  showVolume?: boolean;
  musicVolume?: number;
  voiceVolume?: number;
  setMusicVolume?: (v: number) => void;
  setVoiceVolume?: (v: number) => void;
}

function TileButton({
  onClick, delay, label, isVolume, showVolume,
  musicVolume, voiceVolume, setMusicVolume, setVoiceVolume,
}: TileButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
      style={{ width: '100%' }}
    >
      <motion.button
        whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        style={{
          width: '100%',
          aspectRatio: isVolume && showVolume ? 'auto' : '1 / 0.72',
          minHeight: 'clamp(80px, 14vh, 140px)',
          background: 'linear-gradient(160deg, rgba(180,230,120,0.82) 0%, rgba(120,200,80,0.85) 100%)',
          border: '3.5px solid rgba(255,255,255,0.55)',
          borderRadius: 'clamp(10px, 1.8vw, 18px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isVolume && showVolume
            ? 'clamp(10px,1.8vh,18px) clamp(10px,1.8vw,18px)'
            : 'clamp(8px,1.4vh,14px) clamp(8px,1.4vw,14px)',
          backdropFilter: 'blur(6px)',
          gap: '6px',
          transition: 'box-shadow 0.2s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grass texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(ellipse at 30% 80%, rgba(80,160,40,0.3) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {isVolume && showVolume ? (
          /* Volume panel inside the tile */
          <div
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.4vh,14px)', zIndex: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(0.7rem, 1.8vw, 1rem)',
              color: '#5A2D00',
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 1px 0 rgba(255,255,255,0.5)',
            }}>
              Volume settings
            </div>
            <MiniSlider
              icon="🎵"
              label="Game music"
              value={musicVolume ?? 0.5}
              onChange={setMusicVolume ?? (() => {})}
            />
            <MiniSlider
              icon="🎙"
              label="Mina's voice"
              value={voiceVolume ?? 0.8}
              onChange={setVoiceVolume ?? (() => {})}
            />
          </div>
        ) : (
          <span style={{
            fontFamily: '"Fredoka One", "Baloo 2", cursive',
            fontSize: 'clamp(0.9rem, 2.4vw, 1.5rem)',
            color: '#5A2D00',
            fontWeight: 900,
            textShadow: '0 1px 0 rgba(255,255,255,0.55)',
            textAlign: 'center',
            lineHeight: 1.2,
            zIndex: 1,
          }}>
            {label}
          </span>
        )}

        {isVolume && !showVolume && (
          <span style={{
            fontFamily: '"Fredoka One", cursive',
            fontSize: 'clamp(0.9rem, 2.4vw, 1.5rem)',
            color: '#5A2D00',
            fontWeight: 900,
            textShadow: '0 1px 0 rgba(255,255,255,0.55)',
            textAlign: 'center',
            lineHeight: 1.2,
            zIndex: 1,
          }}>
            {label}
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Mini slider inside tile ─────────────────────────────────────────────────
function MiniSlider({
  icon, label, value, onChange,
}: {
  icon: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: 'clamp(0.5rem, 1vw, 0.65rem)',
        color: '#5A2D00',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)' }}>{icon}</span>
          {label}
        </span>
        <span style={{ fontWeight: 700, color: '#E8650A', minWidth: '26px', textAlign: 'right' }}>
          {pct}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>🔈</span>
        <input
          type="range"
          className="vol-slider"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: `linear-gradient(to right, #E8650A ${pct}%, rgba(255,255,255,0.4) ${pct}%)`,
          }}
        />
        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>🔊</span>
      </div>
    </div>
  );
}