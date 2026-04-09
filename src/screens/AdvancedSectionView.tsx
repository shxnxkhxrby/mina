import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';

function getSpriteSrc(sectionId: string, storeIndex: number): string {
  return `/imgs/levels/${sectionId}/level${storeIndex + 1}.png`;
}

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
    currentSection, setStoreIndex, goToScene,
    sectionProgress, setQuestionSet,
  } = useGameStore();

  const [lockedMsg, setLockedMsg] = useState('');
  const [spriteErrors, setSpriteErrors] = useState<Record<number, boolean>>({});
  const [bgImgFailed, setBgImgFailed] = useState(false);

  // ── Guard: section must exist ────────────────────────────────────────────
  const section = SECTIONS.find(s => s.id === currentSection);
  if (!section) {
    // Graceful fallback — go back to MAP instead of blank screen
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: FALLBACK_GRADIENT.A,
        gap: '16px',
      }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'white' }}>
          Section not found
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => goToScene('MAP')}
        >
          ← Back to Map
        </button>
      </div>
    );
  }

  const bg = getSectionBg(section.id);
  const prog = sectionProgress[section.id] || {};
  const showBgImage = !!bg && !bgImgFailed;

  // ── Store unlock logic ───────────────────────────────────────────────────
  // In Advanced Mode: store[0] is always unlocked.
  // store[i] is unlocked if store[i-1] is completed (bestScore exists & completed).
  const isAdvancedStoreUnlocked = (storeIndex: number): boolean => {
    if (storeIndex === 0) return true;
    const prevStore = section.stores[storeIndex - 1];
    if (!prevStore) return false;
    return !!(prog[prevStore.id]?.completed);
  };

  const handleStore = (i: number) => {
    if (!isAdvancedStoreUnlocked(i)) {
      const prevStoreName = section.stores[i - 1]?.name ?? 'the previous level';
      setLockedMsg(`Complete ${prevStoreName} first!`);
      setTimeout(() => setLockedMsg(''), 2500);
      return;
    }
    setStoreIndex(i);
    setQuestionSet('A');
    goToScene('ADVANCED_STORE');
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
      }}
    >
      {/* Background */}
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
          background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="bunting" />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingTop: 'clamp(44px,8vh,70px)',
          paddingBottom: '6px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1rem,2.8vw,1.9rem)',
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
            marginTop: '4px',
            background: 'rgba(0,0,0,0.35)',
            borderRadius: '20px', padding: '3px 14px',
            display: 'inline-block',
          }}
        >
          ⚡ Advanced Mode · <strong>{section.grammarTopic}</strong>
        </div>
      </div>

      {/* Store cards */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          paddingBottom: 'clamp(52px,10vh,88px)',
          paddingLeft: 'clamp(8px,2vw,20px)',
          paddingRight: 'clamp(8px,2vw,20px)',
          overflowX: 'auto',
          overflowY: 'visible',
          gap: 'clamp(8px,1.8vw,22px)',
        }}
      >
        {section.stores.map((store, i) => {
          const unlocked = isAdvancedStoreUnlocked(i);
          const completed = !!(prog[store.id]?.completed);
          const bestScore = prog[store.id]?.bestScore ?? 0;
          const spriteSrc = getSpriteSrc(section.id, i);
          const showEmoji = spriteErrors[i];

          return (
            <motion.div
              key={store.id}
              style={{
                flexShrink: 0,
                zIndex: 10,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
              onClick={() => handleStore(i)}
              whileHover={unlocked ? { y: -10, scale: 1.06 } : {}}
              whileTap={unlocked ? { scale: 0.96 } : {}}
            >
              <div
                style={{
                  width: 'clamp(150px,22vw,240px)',
                  background: completed
                    ? 'rgba(255,248,220,0.97)'
                    : unlocked
                    ? 'rgba(255,255,255,0.96)'
                    : 'rgba(200,200,200,0.85)',
                  borderRadius: '18px',
                  border: completed
                    ? '3px solid #F5C84A'
                    : unlocked
                    ? '3px solid var(--teal)'
                    : '3px solid #aaa',
                  boxShadow: unlocked
                    ? '0 10px 32px rgba(0,0,0,0.4), 0 2px 0 rgba(255,255,255,0.3) inset'
                    : '0 4px 12px rgba(0,0,0,0.2)',
                  padding: 'clamp(10px,1.8vh,18px) clamp(8px,1.5vw,14px)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '6px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {completed && (
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(255,215,0,0.14) 0%, transparent 50%, rgba(255,215,0,0.08) 100%)',
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
                    width: 'clamp(100px,18vw,160px)',
                    height: 'clamp(100px,18vw,160px)',
                    borderRadius: '14px', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: showEmoji ? 'transparent' : 'rgba(0,0,0,0.04)',
                    filter: unlocked ? 'none' : 'grayscale(0.7)',
                    flexShrink: 0,
                  }}
                >
                  {showEmoji ? (
                    <span style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 1 }}>
                      {store.emoji}
                    </span>
                  ) : (
                    <img
                      src={spriteSrc}
                      alt={store.npcName}
                      onError={() => setSpriteErrors(prev => ({ ...prev, [i]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  )}
                </div>

                {/* Store name */}
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(0.64rem,1.3vw,0.88rem)',
                    color: unlocked ? 'var(--olive-brown)' : '#888',
                    textAlign: 'center', fontWeight: 700,
                  }}
                >
                  {store.name}
                </div>

                {/* Description tag */}
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.5rem,0.95vw,0.64rem)',
                    color: 'white',
                    background: unlocked ? 'var(--teal)' : '#aaa',
                    borderRadius: '20px', padding: '2px 9px',
                    textAlign: 'center',
                  }}
                >
                  {store.description}
                </div>

                {/* Stars */}
                {completed && (
                  <div style={{ display: 'flex', gap: '1px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} style={{ fontSize: 'clamp(0.52rem,1vw,0.78rem)' }}>
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
                      background: 'rgba(0,0,0,0.22)', borderRadius: '16px',
                      fontSize: 'clamp(1.6rem,3.5vw,2.6rem)',
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
                    marginTop: '5px', color: 'white',
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
      </div>

      {/* Locked toast */}
      <AnimatePresence>
        {lockedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: 'clamp(80px,14vh,120px)',
              left: '50%', transform: 'translateX(-50%)',
              background: 'var(--error)', color: 'white',
              padding: '10px 20px', borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.66rem,1.4vw,0.85rem)',
              zIndex: 30, whiteSpace: 'nowrap',
            }}
          >
            🔒 {lockedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(10px,2vh,22px)',
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