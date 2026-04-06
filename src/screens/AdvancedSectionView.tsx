import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';

function getSpriteSrc(sectionId: string, storeIndex: number): string {
  return `/imgs/levels/${sectionId}/level${storeIndex + 1}.png`;
}

// ── Safe asset lookup ─────────────────────────────────────────────────────────
function getSectionBg(sectionId: string): string {
  return (ASSETS as Record<string, string>)[`section${sectionId}`] ?? '';
}

const FALLBACK_GRADIENT: Record<string, string> = {
  A: 'linear-gradient(160deg,#FFE090,#F5C84A 40%,#E8A830)',
  B: 'linear-gradient(160deg,#A8D8A0,#7CBB70 40%,#5B9A50)',
  C: 'linear-gradient(160deg,#A0C8F0,#70A8DC 40%,#4088C0)',
  D: 'linear-gradient(160deg,#E0A0F0,#B060D0 40%,#8B1A8B)',
};

export default function AdvancedSectionView() {
  const {
    currentSection,
    setStoreIndex,
    goToScene,
    isStoreUnlocked,
    sectionProgress,
    setQuestionSet,
  } = useGameStore();

  const [lockedMsg, setLockedMsg] = useState('');
  const [spriteErrors, setSpriteErrors] = useState<Record<number, boolean>>({});
  const [bgImgFailed, setBgImgFailed] = useState(false);

  const section = SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;

  const bg = getSectionBg(section.id);
  const prog = sectionProgress[section.id] || {};
  const showBgImage = !!bg && !bgImgFailed;

  const handleStore = (i: number) => {
    if (!isStoreUnlocked(section.id, i)) {
      setLockedMsg(
        i === 0
          ? 'Complete a previous level first!'
          : `Complete ${section.stores[i - 1].name} first!`,
      );
      setTimeout(() => setLockedMsg(''), 2500);
      return;
    }
    setStoreIndex(i);
    setQuestionSet('A');
    goToScene('ADVANCED_STORE'); // all sections including D use AdvancedStore
  };

  const STORE_POSITIONS: Record<string, { left: string; bottom: string }[]> = {
    A: [
      { left: '26%', bottom: '28%' },
      { left: '52%', bottom: '28%' },
      { left: '82%', bottom: '28%' },
    ],
    B: [
      { left: '22%', bottom: '28%' },
      { left: '52%', bottom: '28%' },
      { left: '80%', bottom: '28%' },
    ],
    C: [
      { left: '25%', bottom: '28%' },
      { left: '50%', bottom: '28%' },
      { left: '75%', bottom: '28%' },
    ],
    D: [
      { left: '25%', bottom: '28%' },
      { left: '50%', bottom: '28%' },
      { left: '75%', bottom: '28%' },
    ],
  };

  const positions =
    STORE_POSITIONS[section.id] ??
    section.stores.map((_, i) => ({
      left: `${(100 / (section.stores.length + 1)) * (i + 1)}%`,
      bottom: '28%',
    }));

  return (
    <div className="scene">
      {/* ── Background ── */}
      {showBgImage ? (
        <img
          src={bg}
          alt={section.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
          }}
          onError={() => setBgImgFailed(true)}
        />
      ) : (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: FALLBACK_GRADIENT[section.id] ?? FALLBACK_GRADIENT.A,
          }}
        />
      )}

      {/* Bottom vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="bunting" />

      {/* ── Header ── */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(40px,7.5vh,66px)',
          left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.1rem,2.8vw,1.9rem)',
            color: 'white',
            textShadow: '2px 3px 0 rgba(0,0,0,0.5)',
          }}
        >
          {section.emoji} {section.name} — {section.location}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.6rem,1.3vw,0.82rem)',
            color: 'rgba(255,248,231,0.95)',
            marginTop: '3px',
            background: 'rgba(0,0,0,0.35)',
            borderRadius: '20px', padding: '2px 12px',
            display: 'inline-block',
          }}
        >
          ⚡ Advanced Mode · <strong>{section.grammarTopic}</strong>
        </div>
      </div>

      {/* ── Store cards ── */}
      {section.stores.map((store, i) => {
        const unlocked = isStoreUnlocked(section.id, i);
        const completed = prog[store.id]?.completed;
        const bestScore = prog[store.id]?.bestScore ?? 0;
        const spriteSrc = getSpriteSrc(section.id, i);
        const showEmoji = spriteErrors[i];

        return (
          <motion.div
            key={store.id}
            style={{
              position: 'absolute',
              bottom: positions[i].bottom,
              left: positions[i].left,
              transform: 'translateX(-50%)',
              zIndex: 10,
              cursor: unlocked ? 'pointer' : 'not-allowed',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
            onClick={() => handleStore(i)}
            whileHover={unlocked ? { y: -10, scale: 1.06 } : {}}
            whileTap={unlocked ? { scale: 0.96 } : {}}
          >
            {/* Card body */}
            <div
              style={{
                width: 'clamp(110px,18vw,190px)',
                background: completed
                  ? 'rgba(255,248,220,0.97)'
                  : unlocked
                  ? 'rgba(255,255,255,0.96)'
                  : 'rgba(200,200,200,0.85)',
                borderRadius: '16px',
                border: completed
                  ? '3px solid #F5C84A'
                  : unlocked
                  ? '3px solid var(--teal)'
                  : '3px solid #aaa',
                boxShadow: unlocked
                  ? '0 8px 28px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.3) inset'
                  : '0 4px 12px rgba(0,0,0,0.2)',
                padding: 'clamp(10px,1.8vh,18px) clamp(8px,1.5vw,14px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '5px',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              {/* Completed shimmer */}
              {completed && (
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, transparent 50%, rgba(255,215,0,0.08) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Level badge */}
              <div
                style={{
                  position: 'absolute', top: '6px', right: '6px',
                  background: unlocked ? 'var(--teal)' : '#aaa',
                  color: 'white', borderRadius: '8px', padding: '1px 7px',
                  fontFamily: 'var(--font-char)', fontWeight: 700,
                  fontSize: 'clamp(0.44rem,0.9vw,0.58rem)', letterSpacing: '0.5px',
                }}
              >
                LVL {i + 1}
              </div>

              {/* Sprite / emoji */}
              <div
                style={{
                  width: 'clamp(52px,10vw,88px)',
                  height: 'clamp(52px,10vw,88px)',
                  borderRadius: '12px', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: showEmoji ? 'transparent' : 'rgba(0,0,0,0.04)',
                  filter: unlocked ? 'none' : 'grayscale(0.7)',
                  flexShrink: 0,
                }}
              >
                {showEmoji ? (
                  <span style={{ fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1 }}>
                    {store.emoji}
                  </span>
                ) : (
                  <img
                    src={spriteSrc}
                    alt={store.npcName}
                    onError={() =>
                      setSpriteErrors(prev => ({ ...prev, [i]: true }))
                    }
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', borderRadius: '10px',
                    }}
                  />
                )}
              </div>

              {/* Store name */}
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(0.62rem,1.3vw,0.85rem)',
                  color: unlocked ? 'var(--olive-brown)' : '#888',
                  textAlign: 'center', fontWeight: 700,
                }}
              >
                {store.name}
              </div>

              {/* Grammar topic tag */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.48rem,0.95vw,0.62rem)',
                  color: 'white',
                  background: unlocked ? 'var(--teal)' : '#aaa',
                  borderRadius: '20px', padding: '2px 8px',
                  textAlign: 'center',
                }}
              >
                {store.description}
              </div>

              {/* Stars if completed */}
              {completed && (
                <div style={{ display: 'flex', gap: '1px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} style={{ fontSize: 'clamp(0.5rem,1vw,0.75rem)' }}>
                      {n <= bestScore ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              )}

              {/* Lock overlay */}
              {!unlocked && (
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.22)', borderRadius: '14px',
                    fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                  }}
                >
                  🔒
                </div>
              )}
            </div>

            {/* Bounce arrow */}
            {unlocked && !completed && (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                style={{
                  textAlign: 'center',
                  fontSize: 'clamp(0.8rem,1.6vw,1.1rem)',
                  marginTop: '4px', color: 'white',
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))',
                }}
              >
                ▼ Enter
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Locked message toast */}
      <AnimatePresence>
        {lockedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: 'clamp(70px,12vh,110px)',
              left: '50%', transform: 'translateX(-50%)',
              background: 'var(--error)', color: 'white',
              padding: '9px 18px', borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.65rem,1.4vw,0.85rem)',
              zIndex: 30,
            }}
          >
            🔒 {lockedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(12px,2.5vh,24px)',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: '10px',
          zIndex: 10,
        }}
      >
        <button className="btn btn-ghost btn-sm" onClick={() => goToScene('MAP')}>
          ← Map
        </button>
      </div>
    </div>
  );
}