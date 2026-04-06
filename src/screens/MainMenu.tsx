import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

export default function MainMenu() {
  const { goToScene, playerName, setAdvancedMode } = useGameStore();

  const startAdvanced = () => {
    setAdvancedMode(true);
    // Go straight to MAP — MapScreen will then route to ADVANCED_SECTION_VIEW
    // skipping all intros, lessons, stories, and guides
    goToScene('MAP');
  };

  return (
    <div className="scene">
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

      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
      }}/>

      <div className="bunting"/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(16px,3vh,28px)',
        padding: 'clamp(60px,11vh,100px) clamp(20px,4vw,40px) clamp(80px,12vh,120px)',
        zIndex: 10,
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
            gap: 'clamp(10px,1.8vh,14px)',
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

      <motion.img
        src={ASSETS.minaMascot}
        alt="Mina"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 'clamp(10px,4vw,60px)',
          width: 'clamp(700px,22vw,260px)',
          height: 'auto',
          filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.5))',
          animation: 'float 3s ease-in-out infinite',
          zIndex: 10,
          pointerEvents: 'none',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}