import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

export default function MainMenu() {
  const {
    goToScene, playerName, setAdvancedMode,
    musicVolume, voiceVolume, setMusicVolume, setVoiceVolume,
  } = useGameStore();

  const startAdvanced = () => {
    setAdvancedMode(true);
    goToScene('MAP');
  };

  const handleStoryMode = () => {
    setAdvancedMode(false);
    goToScene(playerName ? 'MAP' : 'VIDEO_INTRO');
  };

  const handleNewGame = () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().goToScene('VIDEO_INTRO');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          backgroundImage: `url(${ASSETS.logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'blur(4px) brightness(0.45)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div className="bunting" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginBottom: 'clamp(10px,2vh,20px)',
        }}
      >
        <div className="welcome-banner">
          <div className="welcome-banner-title">MINA App</div>
          <div className="welcome-banner-sub">Explore the Minasa Festival in Bustos, Bulacan!</div>
        </div>
      </motion.div>

      {/* Main layout: grid + Mina */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 'clamp(10px,3vw,32px)',
          width: '100%',
          padding: '0 clamp(10px,3vw,24px)',
        }}
      >
        {/* Button grid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 'clamp(6px,1.2vw,12px)',
            width: 'clamp(280px,46vw,520px)',
            flexShrink: 0,
          }}
        >
          {/* Story Mode / Continue */}
          <GridButton
            onClick={handleStoryMode}
            color="#E85D26"
            hoverColor="#FF7A40"
            delay={0.2}
            gridArea={playerName ? undefined : '1 / 1 / 2 / 3'}
          >
            <span style={{ fontSize: 'clamp(1.4rem,3.5vw,2.6rem)' }}>🌸</span>
            <span style={labelStyle}>{playerName ? 'Continue' : 'Story Mode'}</span>
          </GridButton>

          {/* New Game — only shown when playerName exists */}
          {playerName && (
            <GridButton
              onClick={handleNewGame}
              color="#4A8F3F"
              hoverColor="#5CAF4F"
              delay={0.25}
            >
              <span style={{ fontSize: 'clamp(1.4rem,3.5vw,2.6rem)' }}>🔄</span>
              <span style={labelStyle}>New Game</span>
            </GridButton>
          )}

          {/* Advanced Mode */}
          <GridButton
            onClick={startAdvanced}
            color="#8B1A8B"
            hoverColor="#A930A9"
            delay={0.3}
          >
            <span style={{ fontSize: 'clamp(1.4rem,3.5vw,2.6rem)' }}>⚡</span>
            <span style={labelStyle}>Advanced Mode</span>
          </GridButton>

          {/* Volume settings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{
              background: 'rgba(20,12,0,0.82)',
              border: '3px solid rgba(245,200,74,0.6)',
              borderRadius: 'clamp(10px,1.5vw,18px)',
              padding: 'clamp(10px,1.8vw,18px) clamp(10px,1.8vw,16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(8px,1.4vh,14px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.58rem,1.3vw,0.82rem)',
                color: '#F5C84A',
                textAlign: 'center',
                letterSpacing: '0.5px',
                marginBottom: '2px',
              }}
            >
              🔊 Volume settings
            </div>

            <VolumeSlider
              label="Game music"
              icon="🎵"
              value={musicVolume}
              onChange={setMusicVolume}
            />
            <VolumeSlider
              label="Mina's voice"
              icon="🎙"
              value={voiceVolume}
              onChange={setVoiceVolume}
            />
          </motion.div>
        </motion.div>

        {/* Mina mascot */}
        <motion.img
          src={ASSETS.minaMascot}
          alt="Mina"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 16 }}
          style={{
            height: 'clamp(220px,58vh,640px)',
            width: 'auto',
            maxWidth: '45vw',
            objectFit: 'contain',
            objectPosition: 'bottom',
            filter: 'drop-shadow(0 10px 32px rgba(0,0,0,0.55))',
            animation: 'float 3s ease-in-out infinite',
            flexShrink: 0,
            alignSelf: 'flex-end',
            marginBottom: '-4px',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.44rem,0.85vw,0.6rem)',
          color: 'rgba(255,248,231,0.3)',
          textAlign: 'center',
          marginTop: 'clamp(8px,1.4vh,16px)',
        }}
      >
        EL306 — Language Learning Materials · Bustos, Bulacan
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* Mobile: stack grid above Mina, Mina smaller */
        @media (max-width: 520px) {
          .menu-layout {
            flex-direction: column !important;
            align-items: center !important;
          }
        }

        /* Custom range slider styling */
        input[type='range'].vol-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 3px;
          background: rgba(255,255,255,0.18);
          outline: none;
          cursor: pointer;
        }
        input[type='range'].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #F5C84A;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #F5C84A;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Shared label style ────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-title)',
  fontSize: 'clamp(0.7rem,1.8vw,1.15rem)',
  color: 'white',
  fontWeight: 800,
  textShadow: '1px 2px 0 rgba(0,0,0,0.45)',
  textAlign: 'center',
  lineHeight: 1.2,
};

// ── Grid button ───────────────────────────────────────────────────────────
function GridButton({
  children, onClick, color, hoverColor, delay, gridArea,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
  hoverColor: string;
  delay: number;
  gridArea?: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.38, type: 'spring', stiffness: 220 }}
      whileHover={{ scale: 1.04, y: -3, background: hoverColor }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        gridArea,
        background: color,
        border: '3px solid rgba(255,255,255,0.25)',
        borderRadius: 'clamp(10px,1.5vw,18px)',
        padding: 'clamp(14px,2.8vw,28px) clamp(10px,2vw,20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(5px,1vw,10px)',
        cursor: 'pointer',
        boxShadow: `0 6px 24px ${color}66, 0 2px 0 rgba(255,255,255,0.15) inset`,
        backdropFilter: 'blur(4px)',
        transition: 'background 0.18s ease',
        minHeight: 'clamp(80px,14vh,130px)',
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Volume slider ─────────────────────────────────────────────────────────
function VolumeSlider({
  label, icon, value, onChange,
}: {
  label: string;
  icon: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.5rem,1.1vw,0.68rem)',
        color: 'rgba(255,248,231,0.8)',
      }}>
        <span style={{ fontSize: 'clamp(0.7rem,1.3vw,0.85rem)' }}>{icon}</span>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: 'clamp(0.65rem,1.2vw,0.8rem)', color: 'rgba(255,248,231,0.5)' }}>
          🔈
        </span>
        <input
          type="range"
          className="vol-slider"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            // fill track up to thumb with gold color
            background: `linear-gradient(to right, #F5C84A ${value * 100}%, rgba(255,255,255,0.18) ${value * 100}%)`,
          }}
        />
        <span style={{ fontSize: 'clamp(0.65rem,1.2vw,0.8rem)', color: 'rgba(255,248,231,0.5)' }}>
          🔊
        </span>
      </div>
    </div>
  );
}