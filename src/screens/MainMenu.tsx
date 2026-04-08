import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

export default function MainMenu() {
  const { goToScene, playerName, setAdvancedMode } = useGameStore();

  const startAdvanced = () => {
    setAdvancedMode(true);
    goToScene('MAP');
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
      {/* Festival background */}
      <div style={{
        position: 'absolute',
        top: '-20px', left: '-20px',
        right: '-20px', bottom: '-20px',
        backgroundImage: `url(${ASSETS.logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        filter: 'blur(5px) brightness(0.4)',
      }}/>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}/>

      <div className="bunting"/>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(14px,2.8vh,26px)',
        padding: 'clamp(60px,11vh,100px) clamp(20px,5vw,48px) clamp(80px,13vh,130px)',
        width: '100%',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="welcome-banner">
            <div className="welcome-banner-title">MINA App</div>
            <div className="welcome-banner-sub">Explore the Minasa Festival in Bustos, Bulacan!</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 'clamp(10px,1.6vh,14px)',
            width: 'clamp(220px,30vw,340px)',
          }}
        >
          <motion.button
            className="btn btn-primary btn-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setAdvancedMode(false);
              goToScene(playerName ? 'MAP' : 'VIDEO_INTRO');
            }}
          >
            {playerName ? `▶ Continue as ${playerName}` : '▶ Story Mode'}
          </motion.button>

          {playerName && (
            <motion.button
              className="btn btn-ghost"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                useGameStore.getState().resetGame();
                useGameStore.getState().goToScene('VIDEO_INTRO');
              }}
            >
              🔄 New Game
            </motion.button>
          )}

          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={startAdvanced}
          >
            ⚡ Advanced Mode
          </motion.button>
        </motion.div>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.48rem,0.9vw,0.64rem)',
          color: 'rgba(255,248,231,0.35)',
          textAlign: 'center',
        }}>
          EL306 — Language Learning Materials · Bustos, Bulacan
        </div>
      </div>

      {/* Mina mascot — bottom right, fully dynamic sizing */}
      <motion.img
        src={ASSETS.minaMascot}
        alt="Mina"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 18 }}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 'clamp(0px,2vw,40px)',
          height: 'clamp(260px,72vh,720px)',
          width: 'auto',
          maxWidth: '52vw',
          filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.55))',
          animation: 'float 3s ease-in-out infinite',
          zIndex: 10,
          pointerEvents: 'none',
          objectFit: 'contain',
          objectPosition: 'bottom right',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}