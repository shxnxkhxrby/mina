import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

// ── The three mastery levels (no story sections, no stores) ──────────────
const MASTERY_LEVELS = [
  {
    id: 'perfect_tenses',
    level: 1,
    title: 'Perfect Tenses',
    subtitle: 'Past · Present · Future Perfect',
    emoji: '⏳',
    color: '#E85D26',
    gradient: 'linear-gradient(160deg,#FFE090,#F5C84A 40%,#E8A830)',
    badge: 'Section A Grammar',
    storeIndex: 0,
    sectionId: 'A',
    description: '20 questions on perfect tense forms and usage',
  },
  {
    id: 'prepositions',
    level: 2,
    title: 'Prepositions',
    subtitle: 'Time · Manner · Method',
    emoji: '📍',
    color: '#2E75B6',
    gradient: 'linear-gradient(160deg,#A0C8F0,#70A8DC 40%,#4088C0)',
    badge: 'Section C Grammar',
    storeIndex: 1,
    sectionId: 'C',
    description: '20 questions on prepositions of time and manner',
  },
  {
    id: 'subject_verb',
    level: 3,
    title: 'Subject-Verb Agreement',
    subtitle: 'Proximity · Quantifiers · Nouns',
    emoji: '🔗',
    color: '#5B7A3D',
    gradient: 'linear-gradient(160deg,#A8D8A0,#7CBB70 40%,#5B9A50)',
    badge: 'Section B Grammar',
    storeIndex: 2,
    sectionId: 'B',
    description: '20 questions on subject-verb agreement rules',
  },
];

const SCENE_BG = 'linear-gradient(160deg,#0D0D1A 0%,#1A1A2E 50%,#16213E 100%)';

export default function AdvancedSectionView() {
  const {
    setStoreIndex, setSection, goToScene,
    playerName,
    // ── FIX: use advancedLevelScores for unlock/completion, not sectionProgress ──
    advancedLevelScores,
  } = useGameStore();

  const [lockedMsg, setLockedMsg] = useState('');

  // A level is "completed" (and unlocks the next) only if the player scored ≥ 15/20
  const PASS_SCORE = 15;
  const isLevelCompleted = (index: number): boolean => {
    return advancedLevelScores[index] >= PASS_SCORE;
  };

  // ── FIX: best score comes directly from advancedLevelScores ──────────────
  const getBestScore = (index: number): number => {
    return advancedLevelScores[index] ?? 0;
  };

  // Level 1 always unlocked; Level N requires Level N-1 completed
  const isLevelUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    return isLevelCompleted(index - 1);
  };

  const handleLevel = (lvl: typeof MASTERY_LEVELS[number], index: number) => {
    if (!isLevelUnlocked(index)) {
      const prevLevel = MASTERY_LEVELS[index - 1];
      setLockedMsg(`Complete Section ${prevLevel.level} (${prevLevel.title}) first!`);
      setTimeout(() => setLockedMsg(''), 2500);
      return;
    }
    setSection(lvl.sectionId as any);
    setStoreIndex(lvl.storeIndex);
    goToScene('ADVANCED_STORE');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: SCENE_BG,
      }}
    >
      {/* Star field */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.15 + (i % 5) * 0.08,
              top: `${(i * 2.4) % 92}%`,
              left: `${(i * 2.7) % 100}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      <div className="bunting" />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingTop: 'clamp(44px,8vh,70px)',
          paddingBottom: '10px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,197,24,0.12)',
            border: '1.5px solid rgba(245,197,24,0.4)',
            borderRadius: '50px',
            padding: '4px 18px',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: 'clamp(0.6rem,1.2vw,0.78rem)', color: '#F5C518', fontFamily: 'var(--font-char)', fontWeight: 700, letterSpacing: '2px' }}>
            ⚡ MASTERY CHECKPOINT
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.1rem,2.8vw,2rem)',
            color: 'white',
            textShadow: '0 0 24px rgba(245,197,24,0.3)',
          }}
        >
          Choose Your Section
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.6rem,1.2vw,0.78rem)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '4px',
          }}
        >
          {playerName ? `Welcome back, ${playerName}!` : 'No guides · No lessons · Pure grammar'} — Answer all 20 questions to unlock your certificate
        </div>
      </div>

      {/* Level cards */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(16px,3vh,36px) clamp(14px,3vw,40px)',
          gap: 'clamp(12px,2.5vw,28px)',
          flexWrap: 'wrap',
          overflowY: 'auto',
        }}
      >
        {MASTERY_LEVELS.map((lvl, i) => {
          const completed = isLevelCompleted(i);
          const unlocked = isLevelUnlocked(i);
          const best = getBestScore(i);

          return (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
              whileHover={unlocked ? { y: -8, scale: 1.03 } : {}}
              whileTap={unlocked ? { scale: 0.97 } : {}}
              onClick={() => handleLevel(lvl, i)}
              style={{
                cursor: unlocked ? 'pointer' : 'not-allowed',
                width: 'clamp(200px,28vw,300px)',
                flexShrink: 0,
                opacity: unlocked ? 1 : 0.5,
                filter: unlocked ? 'none' : 'grayscale(60%)',
              }}
            >
              {/* Card */}
              <div
                style={{
                  background: completed
                    ? 'rgba(255,248,200,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  border: `2.5px solid ${
                    !unlocked
                      ? 'rgba(255,255,255,0.15)'
                      : completed
                      ? lvl.color
                      : `${lvl.color}66`
                  }`,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: completed
                    ? `0 0 32px ${lvl.color}44, 0 8px 24px rgba(0,0,0,0.5)`
                    : `0 8px 24px rgba(0,0,0,0.4)`,
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                }}
              >
                {/* Gradient top strip */}
                <div
                  style={{
                    background: lvl.gradient,
                    padding: 'clamp(14px,2.5vh,24px) clamp(14px,2.2vw,22px) clamp(10px,1.8vh,18px)',
                    position: 'relative',
                  }}
                >
                  {/* Level number + emoji or lock */}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 'clamp(0.58rem,1.1vw,0.78rem)',
                        color: 'rgba(255,255,255,0.85)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Section {lvl.level}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(2.6rem,5.5vw,4rem)',
                        lineHeight: 1,
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                      }}
                    >
                      {unlocked ? lvl.emoji : '🔒'}
                    </div>
                  </div>

                  {/* Completion badge */}
                  {completed && unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#F5C518',
                        color: '#1A1200',
                        fontFamily: 'var(--font-char)',
                        fontWeight: 800,
                        fontSize: 'clamp(0.42rem,0.8vw,0.58rem)',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ✓ DONE
                    </div>
                  )}

                  {/* Locked badge */}
                  {!unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-char)',
                        fontWeight: 800,
                        fontSize: 'clamp(0.42rem,0.8vw,0.58rem)',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        letterSpacing: '0.5px',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      🔒 LOCKED
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: 'clamp(12px,2vh,20px) clamp(14px,2.2vw,22px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 'clamp(0.82rem,1.6vw,1.15rem)',
                        color: unlocked ? 'white' : 'rgba(255,255,255,0.4)',
                        fontWeight: 700,
                        marginBottom: '2px',
                      }}
                    >
                      {lvl.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.52rem,0.95vw,0.68rem)',
                        color: unlocked ? `${lvl.color}cc` : 'rgba(255,255,255,0.25)',
                      }}
                    >
                      {lvl.subtitle}
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.5rem,0.9vw,0.64rem)',
                      color: unlocked ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)',
                      lineHeight: 1.4,
                    }}
                  >
                    {unlocked
                      ? lvl.description
                      : `Complete Section ${i} — ${MASTERY_LEVELS[i - 1]?.title} to unlock`}
                  </div>

                  {/* Best score + stars row (only if attempted) */}
                  {completed && unlocked && (
                    <>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.5rem,0.9vw,0.64rem)',
                        color: best >= 15 ? '#4ade80' : 'rgba(255,255,255,0.5)',
                        fontWeight: 700,
                      }}>
                        Best: {best}/20{best >= 15 ? ' ✓ Passed' : ` (need 15)`}
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <span key={n} style={{ fontSize: 'clamp(0.58rem,1.1vw,0.82rem)' }}>
                            {n <= Math.round((best / 20) * 5) ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* CTA button */}
                  <motion.div
                    whileHover={unlocked ? { scale: 1.04 } : {}}
                    whileTap={unlocked ? { scale: 0.97 } : {}}
                    style={{
                      marginTop: '4px',
                      background: !unlocked
                        ? 'rgba(255,255,255,0.08)'
                        : completed
                        ? `linear-gradient(135deg, ${lvl.color}cc, ${lvl.color})`
                        : `linear-gradient(135deg, ${lvl.color}, ${lvl.color}dd)`,
                      borderRadius: '12px',
                      padding: 'clamp(8px,1.4vh,12px)',
                      textAlign: 'center',
                      fontFamily: 'var(--font-title)',
                      fontSize: 'clamp(0.64rem,1.2vw,0.88rem)',
                      color: unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      boxShadow: unlocked ? `0 4px 14px ${lvl.color}55` : 'none',
                      border: !unlocked ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    }}
                  >
                    {!unlocked
                      ? '🔒 Locked'
                      : completed
                      ? '🔄 Retry Quiz →'
                      : '▶ Start Quiz →'}
                  </motion.div>
                </div>
              </div>

              {/* Bounce arrow when unlocked and not completed */}
              {unlocked && !completed && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                  style={{
                    textAlign: 'center',
                    fontSize: 'clamp(0.7rem,1.3vw,0.95rem)',
                    marginTop: '6px',
                    color: 'rgba(255,255,255,0.6)',
                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                  }}
                >
                  ▼ Tap to begin
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

      {/* Footer nav */}
      <div
        style={{
          position: 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          padding: 'clamp(10px,2vh,20px)',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => goToScene('MAIN_MENU')}
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
        >
          ← Main Menu
        </button>
      </div>
    </div>
  );
}