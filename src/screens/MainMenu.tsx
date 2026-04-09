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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}>
      {/* ── Background ── */}
      <div style={{
        position: 'absolute', inset: '-20px',
        backgroundImage: `url(${ASSETS.logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        filter: 'blur(6px) brightness(0.38) saturate(0.85)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(20,8,0,0.35) 0%, rgba(10,4,0,0.72) 100%)',
      }} />
      <div className="bunting" />

      {/* ── Title banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 'clamp(44px,8vh,72px)',
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(42,22,4,0.94) 0%, rgba(60,32,6,0.94) 100%)',
          border: '2.5px solid rgba(245,200,74,0.7)',
          borderRadius: '50px',
          padding: 'clamp(6px,1.2vh,10px) clamp(20px,4vw,40px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,200,60,0.15) inset',
        }}>
          <div style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.3rem,3.8vw,2.6rem)',
            color: '#F5C84A',
            fontWeight: 900,
            letterSpacing: '1px',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            lineHeight: 1.1,
          }}>🌸 MINA App</div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.55rem,1.2vw,0.75rem)',
            color: 'rgba(255,245,210,0.85)',
            marginTop: '3px',
            letterSpacing: '0.3px',
          }}>Explore the Minasa Festival in Bustos, Bulacan!</div>
        </div>
      </motion.div>

      {/* ── Main layout: Mina LEFT, buttons RIGHT ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 clamp(10px,2vw,24px)',
        paddingBottom: 'clamp(18px,3.5vh,36px)',
        gap: 'clamp(8px,2vw,20px)',
      }}>
        {/* Mina mascot — large, anchored to bottom */}
        <motion.div
          initial={{ opacity: 0, x: -40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 90, damping: 16 }}
          style={{
            flexShrink: 0,
            alignSelf: 'flex-end',
            marginBottom: '-4px',
          }}
        >
          <motion.img
            src={ASSETS.minaMascot}
            alt="Mina"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: 'clamp(260px,62vh,620px)',
              width: 'auto',
              maxWidth: 'clamp(180px,38vw,360px)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.65))',
              display: 'block',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </motion.div>

        {/* Button column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, duration: 0.48, ease: 'easeOut' }}
          style={{
            flex: 1,
            maxWidth: 'clamp(260px,44vw,440px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(8px,1.5vh,14px)',
          }}
        >
          {/* Story Mode / Continue */}
          <MenuButton
            onClick={handleStoryMode}
            color="#D94F1E"
            delay={0.22}
            emoji="🌸"
            label={playerName ? `Continue` : 'Story Mode'}
            sublabel={playerName ? `Welcome back, ${playerName}!` : 'Begin your festival journey'}
          />

          {/* New Game — only when save exists */}
          {playerName && (
            <MenuButton
              onClick={handleNewGame}
              color="#3A7D30"
              delay={0.28}
              emoji="🔄"
              label="New Game"
              sublabel="Start fresh from the beginning"
            />
          )}

          {/* Advanced Mode */}
          <MenuButton
            onClick={handleAdvanced}
            color="#7A148A"
            delay={0.34}
            emoji="⚡"
            label="Advanced Mode"
            sublabel="Skip story — go straight to practice"
          />

          {/* Volume Settings toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.40, duration: 0.38 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowVolume(v => !v)}
            style={{
              background: 'rgba(18,10,2,0.82)',
              border: '2.5px solid rgba(245,200,74,0.45)',
              borderRadius: 'clamp(10px,1.5vw,16px)',
              padding: 'clamp(10px,1.6vh,16px) clamp(14px,2vw,22px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s',
            }}
          >
            <span style={{ fontSize: 'clamp(1.2rem,2.8vw,1.8rem)' }}>🔊</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.72rem,1.6vw,1rem)',
                color: '#F5C84A',
                fontWeight: 800,
              }}>Volume Settings</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.52rem,1vw,0.68rem)',
                color: 'rgba(255,245,210,0.6)',
                marginTop: '1px',
              }}>Music & voice levels</div>
            </div>
            <span style={{
              color: 'rgba(245,200,74,0.7)',
              fontSize: '0.9rem',
              transform: showVolume ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s',
            }}>▼</span>
          </motion.button>

          {/* Volume panel — expands below button */}
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(14,8,2,0.9)',
                border: '2px solid rgba(245,200,74,0.35)',
                borderRadius: 'clamp(10px,1.5vw,16px)',
                padding: 'clamp(12px,2vh,20px) clamp(14px,2vw,22px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(10px,1.8vh,18px)',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
              }}
            >
              <VolumeSlider
                icon="🎵"
                label="Game Music"
                value={musicVolume}
                onChange={setMusicVolume}
              />
              <VolumeSlider
                icon="🎙"
                label="Mina's Voice"
                value={voiceVolume}
                onChange={setVoiceVolume}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(6px,1.2vh,12px)',
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 10,
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.42rem,0.8vw,0.58rem)',
        color: 'rgba(255,245,210,0.25)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        EL306 — Language Learning Materials · Bustos, Bulacan
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        /* On very small screens, stack vertically */
        @media (max-width: 480px) {
          .menu-main-row {
            flex-direction: column !important;
            align-items: center !important;
          }
          .menu-mina {
            height: clamp(160px,32vh,240px) !important;
            max-width: 60vw !important;
          }
          .menu-buttons {
            max-width: 92vw !important;
            width: 100% !important;
          }
        }
        input[type='range'].vol-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        input[type='range'].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #F5C84A;
          border: 2px solid #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.5);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #F5C84A;
          border: 2px solid #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Menu button ──────────────────────────────────────────────────────────
function MenuButton({
  onClick, color, delay, emoji, label, sublabel,
}: {
  onClick: () => void;
  color: string;
  delay: number;
  emoji: string;
  label: string;
  sublabel: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 30, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 200, damping: 22 }}
      whileHover={{ scale: 1.04, x: 4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${color}EE 0%, ${color}BB 100%)`,
        border: '2.5px solid rgba(255,255,255,0.22)',
        borderRadius: 'clamp(12px,1.8vw,20px)',
        padding: 'clamp(12px,2vh,20px) clamp(14px,2vw,24px)',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(10px,1.8vw,18px)',
        cursor: 'pointer',
        boxShadow: `0 8px 28px ${color}55, 0 1px 0 rgba(255,255,255,0.12) inset`,
        backdropFilter: 'blur(6px)',
        textAlign: 'left',
        width: '100%',
        transition: 'box-shadow 0.2s',
      }}
    >
      <span style={{ fontSize: 'clamp(1.5rem,3.5vw,2.4rem)', flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(0.82rem,2vw,1.22rem)',
          color: 'white',
          fontWeight: 900,
          textShadow: '1px 2px 0 rgba(0,0,0,0.4)',
          lineHeight: 1.15,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.5rem,1.1vw,0.7rem)',
          color: 'rgba(255,255,255,0.72)',
          marginTop: '2px',
          lineHeight: 1.3,
        }}>{sublabel}</div>
      </div>
      <span style={{
        color: 'rgba(255,255,255,0.55)',
        fontSize: 'clamp(0.8rem,1.5vw,1rem)',
        flexShrink: 0,
      }}>›</span>
    </motion.button>
  );
}

// ── Volume slider ────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.55rem,1.1vw,0.72rem)',
        color: 'rgba(255,245,210,0.85)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: 'clamp(0.8rem,1.4vw,0.95rem)' }}>{icon}</span>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-char)',
          fontWeight: 700,
          fontSize: 'clamp(0.52rem,1vw,0.68rem)',
          color: '#F5C84A',
          minWidth: '28px', textAlign: 'right',
        }}>{pct}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,245,210,0.35)' }}>🔈</span>
        <input
          type="range"
          className="vol-slider"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: `linear-gradient(to right, #F5C84A ${pct}%, rgba(255,255,255,0.15) ${pct}%)`,
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,245,210,0.35)' }}>🔊</span>
      </div>
    </div>
  );
}