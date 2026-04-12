import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

export default function NameInput() {
  const { setPlayerName, goToScene } = useGameStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const clean = name.trim().replace(/<[^>]*>/g, '').slice(0, 30);
    if (!clean) { setError('Please enter your name!'); return; }
    setPlayerName(clean);
    goToScene('MINA_INTRO');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      overflow: 'hidden',
      background: '#1a0e00',
    }}>

      {/* Background image — same source as MainMenu, fills 100% */}
      <img
        src={ASSETS.logo}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 0,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Blur + dim overlay — identical to MainMenu */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: 'blur(2.5px)', WebkitBackdropFilter: 'blur(2.5px)',
        background: 'rgba(0,0,0,0.42)', zIndex: 1,
      }} />

      <div className="bunting" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(54px,10vh,88px) clamp(14px,4vw,48px) clamp(16px,4vh,40px)',
        gap: 'clamp(14px,3vw,32px)',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 'clamp(20px,4vw,52px)',
          width: '100%',
          maxWidth: '900px',
          flexWrap: 'wrap',
        }}>

          {/* Input panel */}
          <motion.div
            className="panel"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              width: 'clamp(280px,90vw,500px)',
              flexShrink: 0,
              padding: 'clamp(24px,4vh,40px) clamp(22px,4vw,38px)',
              background: 'rgba(255,253,245,0.97)',
            }}
          >
            <div
              className="panel-title"
              style={{
                marginBottom: '10px',
                fontSize: 'clamp(1.4rem,3.5vw,2.2rem)',
              }}
            >
              What's your name? 🌸
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem,1.8vw,1.05rem)',
              color: '#7A6355', marginBottom: '22px', lineHeight: 1.6,
            }}>
              Enter your name to begin your journey through the Minasa Festival!
            </p>

            <input
              type="text" value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Your name here..."
              maxLength={30}
              style={{
                width: '100%', padding: 'clamp(12px,1.8vh,16px) 20px',
                borderRadius: '14px',
                border: `2.5px solid ${error ? 'var(--error)' : 'var(--olive-brown)'}`,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem,2.2vw,1.2rem)',
                color: 'var(--dark-brown)', background: 'white', outline: 'none',
                marginBottom: '8px', transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            {error && (
              <p style={{
                color: 'var(--error)',
                fontSize: 'clamp(0.78rem,1.4vw,0.9rem)',
                marginBottom: '8px',
                fontFamily: 'var(--font-body)',
              }}>
                ⚠ {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 'clamp(0.82rem,1.6vw,0.95rem)', padding: '10px 22px' }}
                onClick={() => goToScene('MAIN_MENU')}
              >
                ← Back
              </button>
              <motion.button
                className="btn btn-primary"
                style={{ fontSize: 'clamp(0.92rem,1.9vw,1.08rem)', padding: '12px 28px' }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
              >
                Start Adventure! 🎉
              </motion.button>
            </div>
          </motion.div>

          {/* Mina mascot — hidden on narrow screens to prevent overflow */}
          <style>{`
            @media (max-width: 560px) { .mina-col { display: none !important; } }
          `}</style>
          <motion.div
            className="mina-col"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0px',
              flexShrink: 0,
            }}
          >
            {/* Speech bubble */}
            <div style={{
              background: '#FFFDE7',
              border: '2.5px solid var(--golden)',
              borderRadius: '18px',
              padding: 'clamp(10px,1.8vh,16px) clamp(14px,2.5vw,22px)',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem,1.8vw,1.05rem)',
              color: 'var(--olive-brown)', fontWeight: 700,
              maxWidth: 'clamp(160px,22vw,240px)',
              textAlign: 'center', lineHeight: 1.5,
              boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              marginBottom: '12px',
            }}>
              "What's your name, adventurer?" 🌸
              {/* Arrow pointing down */}
              <div style={{
                position: 'absolute', bottom: '-13px', left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '13px solid var(--golden)',
              }}/>
              <div style={{
                position: 'absolute', bottom: '-9px', left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid #FFFDE7',
                zIndex: 1,
              }}/>
            </div>

            {/* Mina image — bigger */}
            <motion.img
              src={ASSETS.minaMascot}
              alt="Mina"
              style={{
                width: 'clamp(160px,28vw,320px)',
                height: 'auto', objectFit: 'contain',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.22))',
              }}
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            {/* Name tag */}
            <div style={{
              fontFamily: 'var(--font-char)',
              fontWeight: 700,
              fontSize: 'clamp(0.68rem,1.3vw,0.88rem)',
              color: 'white',
              background: 'var(--teal)',
              borderRadius: '50px',
              padding: '3px 18px',
              letterSpacing: '1.5px',
              marginTop: '-6px',
            }}>
              MINA
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}