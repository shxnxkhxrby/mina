import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MINA_INTRO_DIALOGUES } from '../data/dialogues';
import { ASSETS } from '../data/assets';

// ── Floating particle ──────────────────────────────────────────────────────
function Particle({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: x, bottom: '10%',
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(255, 220, 100, 0.55)',
        pointerEvents: 'none', zIndex: 1,
      }}
      animate={{ y: [0, -80, -160], opacity: [0, 0.7, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

// ── Scalloped bubble ───────────────────────────────────────────────────────
function ScallopedBubble({ children }: { children: React.ReactNode }) {
  const scallopTop = Array.from({ length: 60 }, (_, i) => `M${i * 20},24 Q${i * 20 + 10},0 ${i * 20 + 20},24`).join(' ');
  const scallopBottom = Array.from({ length: 60 }, (_, i) => `M${i * 20},0 Q${i * 20 + 10},24 ${i * 20 + 20},0`).join(' ');
  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '0 0 20px 20px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={scallopTop} fill="#F5C84A" />
        </svg>
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #FFF8D6 0%, #FFEEA0 100%)',
        border: '4px solid #F5C84A', borderTop: 'none', borderBottom: 'none',
        borderRadius: 0,
        padding: 'clamp(14px,3vh,24px) clamp(16px,4vw,32px) clamp(22px,4vh,36px)',
        position: 'relative', boxShadow: '0 6px 28px rgba(180,120,0,0.18)', zIndex: 1,
      }}>
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={scallopBottom} fill="#F5C84A" />
        </svg>
      </div>
    </div>
  );
}

const PARTICLES = [
  { delay: 0, x: '8%', size: 10 }, { delay: 0.8, x: '15%', size: 7 },
  { delay: 1.5, x: '22%', size: 12 }, { delay: 0.3, x: '35%', size: 8 },
  { delay: 2.1, x: '45%', size: 6 }, { delay: 1.2, x: '55%', size: 10 },
  { delay: 0.6, x: '68%', size: 7 },
];

export default function MinaIntro() {
  const { goToScene } = useGameStore();
  const [idx, setIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = MINA_INTRO_DIALOGUES[idx];
  const isLast = idx === MINA_INTRO_DIALOGUES.length - 1;

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Play audio for the current line — read directly from the dialogue data
  // so the URL always matches the text, with no separate array to keep in sync.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const src = MINA_INTRO_DIALOGUES[idx].audio;
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {/* autoplay blocked — silent fail */});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [idx]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const advance = () => {
    stopAudio();
    if (isLast) {
      useGameStore.getState().setSection('A');
      goToScene('GRAMMAR_LESSON');
    } else {
      setIdx(i => i + 1);
    }
  };

  return (
    <div
      className="scene"
      style={{ cursor: 'pointer', overflow: 'hidden' }}
      onClick={advance}
    >
      <img
        src="/imgs/mina-bg.png"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top', zIndex: 0,
        }}
        onError={e => {
          const img = e.target as HTMLImageElement;
          if (img.src.endsWith('.png')) img.src = '/imgs/mina-bg.jpg';
          else if (img.src.endsWith('.jpg')) img.src = '/imgs/mina-bg.webp';
          else img.style.display = 'none';
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(30,18,0,0.28) 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      <div className="bunting" style={{ zIndex: 5 }} />

      {/* Mina mascot */}
      <motion.div
        style={{ position: 'absolute', right: 'clamp(-20px, -1vw, 0px)', bottom: 0, zIndex: 10, pointerEvents: 'none' }}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 }}
      >
        <motion.img
          src={ASSETS.minaMascot}
          alt="Mina"
          style={{
            width: 'clamp(220px,40vw,500px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.4))', display: 'block',
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </motion.div>

      {/* Dialogue box */}
      <div style={{
        position: 'absolute',
        top: 'clamp(64px, 13vh, 110px)',
        left: 'clamp(14px, 3vw, 32px)',
        right: 'clamp(90px,28vw,380px)',
        zIndex: 20,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FF7A1A, #E85D10)',
                border: '3px solid #FFD700', borderRadius: '10px',
                padding: '4px 18px 4px 14px',
                position: 'relative', zIndex: 3,
                boxShadow: '0 3px 10px rgba(200,60,0,0.35)',
                clipPath: 'polygon(8px 0%, 100% 0%, 100% 100%, 8px 100%, 0% 50%)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(0.75rem, 1.8vw, 1.1rem)',
                color: 'white', fontWeight: 900, letterSpacing: '2px',
                textShadow: '1px 2px 0 rgba(0,0,0,0.3)',
              }}>MINA</span>
            </motion.div>

            <ScallopedBubble>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.88rem, 2.2vw, 1.35rem)',
                color: '#2A1800', lineHeight: 1.55, fontWeight: 800, letterSpacing: '0.2px',
              }}>
                {current.text}
                <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '3px', color: '#E85D10' }}>▌</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {MINA_INTRO_DIALOGUES.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i === idx ? 1.3 : 1 }}
                      style={{
                        width: i === idx ? '20px' : '7px', height: '7px', borderRadius: '4px',
                        background: i <= idx ? '#E85D10' : 'rgba(180,120,0,0.3)',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(0.52rem, 1vw, 0.7rem)',
                  color: '#8A6000', marginLeft: 'auto',
                }}>
                  {isLast ? 'Click to continue →' : 'Click to continue ▶'}
                </div>
              </div>
            </ScallopedBubble>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip button */}
      {!isLast && (
        <button
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute', top: 'clamp(40px,7.5vh,66px)',
            right: 'clamp(10px,2vw,20px)', opacity: 0.8, zIndex: 30,
          }}
          onClick={e => {
            e.stopPropagation();
            stopAudio();
            useGameStore.getState().setSection('A');
            goToScene('GRAMMAR_LESSON');
          }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}