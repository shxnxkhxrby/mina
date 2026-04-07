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
    <div className="scene" style={{ background: 'linear-gradient(160deg,#FFF8E7,#F0EBD8 50%,#E8D8B8)' }}>
      <div className="bunting"/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(54px,10vh,88px) clamp(14px,4vw,48px) clamp(16px,4vh,40px)',
        gap: 'clamp(14px,3vw,32px)',
      }}>

        {/*
          On wider screens: flex row (input left, Mina right).
          On narrow mobile: column (input on top, no Mina to avoid crowding).
          We achieve this with a flex row that wraps, with Mina hidden below a min-width.
        */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px,4vw,44px)',
          width: '100%',
          maxWidth: '760px',
          flexWrap: 'wrap',
        }}>
          {/* Input panel */}
          <motion.div
            className="panel"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{
              /* Was clamp(260px,42vw,460px) — 260px min can overflow on 300px screens */
              width: 'clamp(240px,90vw,440px)',
              flexShrink: 0,
            }}
          >
            <div className="panel-title" style={{ marginBottom: '8px' }}>What's your name?</div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.68rem,1.4vw,0.85rem)',
              color: '#7A6355', marginBottom: '16px', lineHeight: 1.5,
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
                width: '100%', padding: '11px 16px', borderRadius: '12px',
                border: `2px solid ${error ? 'var(--error)' : 'var(--olive-brown)'}`,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.82rem,1.8vw,1rem)',
                color: 'var(--dark-brown)', background: 'white', outline: 'none',
                marginBottom: '6px', transition: 'border-color 0.2s',
              }}
              autoFocus
            />
            {error && (
              <p style={{ color: 'var(--error)', fontSize: '0.78rem', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                ⚠ {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => goToScene('MAIN_MENU')}>← Back</button>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
              >
                Start Adventure! 🎉
              </motion.button>
            </div>
          </motion.div>

          {/* Mina mascot — only visible when there's horizontal space */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '10px',
              flexShrink: 0,
              /* Hide on very narrow screens where Mina would crowd the form */
              minWidth: '100px',
            }}
          >
            <div style={{
              background: '#FFFDE7', border: '2px solid var(--golden)',
              borderRadius: '16px', padding: '10px 14px',
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.65rem,1.3vw,0.85rem)',
              color: 'var(--olive-brown)', fontWeight: 600,
              maxWidth: 'clamp(120px,18vw,200px)',
              textAlign: 'center', lineHeight: 1.4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative',
            }}>
              "What's your name, adventurer?" 🌸
              <div style={{
                position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid var(--golden)',
              }}/>
            </div>

            <img
              src={ASSETS.minaMascot}
              alt="Mina"
              style={{
                width: 'clamp(80px,16vw,180px)',
                height: 'auto', objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                animation: 'float 3s ease-in-out infinite',
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}