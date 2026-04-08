import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTION_D } from '../data/sectionD';
import { ASSETS } from '../data/assets';
import { useMinaBg } from '../hooks/useMinaBg';

// ── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'DANCER_SELECT'   // show 3 dancer cards (matches SectionView layout)
  | 'QUESTION'        // active quiz for current dancer
  | 'DANCER_RESULT'   // score card after each dancer
  | 'MINA_CLOSING'    // Mina's closing speech
  | 'DONE';           // triggers SCORE_SUMMARY

// ── Mina closing speech lines ─────────────────────────────────────────────────
const MINA_LINES = [
  "Congratulations! 🎉 You have completed learning the three major grammar areas: subject-verb agreement, prepositions of time and manner, and perfect tenses.",
  "Throughout your adventure, you explored different challenges, made careful choices, and applied important grammar rules in real situations.",
  "You didn't just answer questions — you understood how grammar works and how it brings clarity and meaning to communication.",
  "You showed discipline in following rules, creativity in expressing ideas, and unity in connecting different concepts together.",
  "Take a moment to be proud of what you've accomplished today. Every correct answer, every mistake you learned from, and every concept you mastered has helped you grow stronger in grammar.",
  "But remember — this achievement is only the beginning. If you're ready for a greater challenge, you can try Professional Mode and test your skills at a higher level.",
  "Keep going, keep learning, and keep challenging yourself. Your grammar adventure doesn't end here — it's just getting started! I'll see you in your next adventure! ✨",
];

// ── Dancer positions — mirrors SectionView exactly ────────────────────────────
const DANCER_POSITIONS = [
  { left: '25%', bottom: '28%' },
  { left: '50%', bottom: '28%' },
  { left: '75%', bottom: '28%' },
];

// ── Sprite helper ─────────────────────────────────────────────────────────────
function getDancerSprite(storeIndex: number): string {
  return `/imgs/levels/D/level${storeIndex + 1}.png`;
}

export default function SectionDScreen() {
  const { goToScene, completeStore, addScore, sectionProgress, currentQuestionSet } = useGameStore();

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('DANCER_SELECT');
  const [activeDancerIdx, setActiveDancerIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [minaLineIdx, setMinaLineIdx] = useState(0);
  const [spriteErrors, setSpriteErrors] = useState<Record<number, boolean>>({});
  const [lockedMsg, setLockedMsg] = useState('');
  const [bgImgFailed, setBgImgFailed] = useState(false);
  const minaBg = useMinaBg();
  const [minaBgSrcIdx, setMinaBgSrcIdx] = useState(0);

  const prog = sectionProgress['D'] || {};

  // ── Background — same safe lookup as SectionView ───────────────────────────
  const bg = (ASSETS as Record<string, string>)['sectionD'] ?? '';
  const showBgImage = !!bg && !bgImgFailed;

  // ── Derived ────────────────────────────────────────────────────────────────
  const dancer = SECTION_D.stores[activeDancerIdx];
  const qSet = dancer?.questionSets.find(qs => qs.id === currentQuestionSet) ?? dancer?.questionSets[0];
  const question = qSet?.questions[questionIdx];
  const totalQ = qSet?.questions.length ?? 5;

  // ── Unlock logic: dancers unlock sequentially ──────────────────────────────
  function isDancerUnlocked(i: number): boolean {
    if (i === 0) return true;
    return prog[SECTION_D.stores[i - 1].id]?.completed === true;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleDancerSelect(i: number) {
    if (!isDancerUnlocked(i)) {
      setLockedMsg(`Complete ${SECTION_D.stores[i - 1].name} first!`);
      setTimeout(() => setLockedMsg(''), 2500);
      return;
    }
    setActiveDancerIdx(i);
    setQuestionIdx(0);
    setSessionScore(0);
    setSelected(null);
    setShowFeedback(false);
    setPhase('QUESTION');
  }

  function handleChoice(choiceIdx: number) {
    if (showFeedback) return;
    setSelected(choiceIdx);
    setShowFeedback(true);
    if (question.choices[choiceIdx].isCorrect) {
      setSessionScore(s => s + 1);
    }
  }

  function handleNext() {
    if (questionIdx + 1 < totalQ) {
      setQuestionIdx(q => q + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      completeStore('D', dancer.id, sessionScore);
      addScore(sessionScore, totalQ);
      setPhase('DANCER_RESULT');
    }
  }

  function handleAfterResult() {
    const nextIdx = activeDancerIdx + 1;
    if (nextIdx < SECTION_D.stores.length) {
      setActiveDancerIdx(nextIdx);
      setPhase('DANCER_SELECT');
    } else {
      setMinaLineIdx(0);
      setPhase('MINA_CLOSING');
    }
  }

  function handleMinaNext() {
    if (minaLineIdx + 1 < MINA_LINES.length) {
      setMinaLineIdx(l => l + 1);
    } else {
      setPhase('DONE');
    }
  }

  useEffect(() => {
    if (phase === 'DONE') {
      const t = setTimeout(() => goToScene('SCORE_SUMMARY'), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="scene">

      {/* ── Background — identical pattern to SectionView ── */}
      {showBgImage ? (
        <img
          src={bg}
          alt="Section D"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
          }}
          onError={() => setBgImgFailed(true)}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg,#E0A0F0,#B060D0 40%,#8B1A8B)',
        }} />
      )}

      {/* Bottom vignette — identical to SectionView */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bunting — identical to SectionView */}
      <div className="bunting" />

      {/* ── Header — identical structure to SectionView ── */}
      <div style={{
        position: 'absolute',
        top: 'clamp(40px,7.5vh,66px)',
        left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 10,
      }}>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1.3rem,3.2vw,2.2rem)',
          color: 'white',
          textShadow: '2px 3px 0 rgba(0,0,0,0.5)',
        }}>
          🎉 Minasa Festival — Grammar Street Dance Challenge
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.78rem,1.6vw,1rem)',
          color: 'rgba(255,248,231,0.95)',
          marginTop: '3px',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '20px', padding: '2px 12px',
          display: 'inline-block',
        }}>
          Grammar: <strong>SVA · Perfect Tenses · Prepositions</strong>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════════════
            DANCER SELECT — mirrors SectionView store cards exactly
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'DANCER_SELECT' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 5 }}
          >
            {SECTION_D.stores.map((store, i) => {
              const unlocked = isDancerUnlocked(i);
              const completed = prog[store.id]?.completed;
              const bestScore = prog[store.id]?.bestScore ?? 0;
              const showEmoji = spriteErrors[i];

              return (
                <motion.div
                  key={store.id}
                  style={{
                    position: 'absolute',
                    bottom: DANCER_POSITIONS[i].bottom,
                    left: DANCER_POSITIONS[i].left,
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                  onClick={() => handleDancerSelect(i)}
                  whileHover={unlocked ? { y: -10, scale: 1.06 } : {}}
                  whileTap={unlocked ? { scale: 0.96 } : {}}
                >
                  {/* Card body — identical to SectionView */}
                  <div style={{
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
                  }}>
                    {/* Completed shimmer */}
                    {completed && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, transparent 50%, rgba(255,215,0,0.08) 100%)',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Level badge — identical to SectionView */}
                    <div style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: unlocked ? 'var(--teal)' : '#aaa',
                      color: 'white', borderRadius: '8px', padding: '1px 7px',
                      fontFamily: 'var(--font-char)', fontWeight: 700,
                      fontSize: 'clamp(0.44rem,0.9vw,0.58rem)', letterSpacing: '0.5px',
                    }}>
                      LVL {i + 1}
                    </div>

                    {/* Sprite / emoji */}
                    <div style={{
                      width: 'clamp(52px,10vw,88px)',
                      height: 'clamp(52px,10vw,88px)',
                      borderRadius: '12px', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: showEmoji ? 'transparent' : 'rgba(0,0,0,0.04)',
                      filter: unlocked ? 'none' : 'grayscale(0.7)',
                      flexShrink: 0,
                    }}>
                      {showEmoji ? (
                        <span style={{ fontSize: 'clamp(2rem,5vw,4rem)', lineHeight: 1 }}>
                          {store.emoji}
                        </span>
                      ) : (
                        <img
                          src={getDancerSprite(i)}
                          alt={store.npcName}
                          onError={() => setSpriteErrors(p => ({ ...p, [i]: true }))}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        />
                      )}
                    </div>

                    {/* Store name */}
                    <div style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 'clamp(0.62rem,1.3vw,0.85rem)',
                      color: unlocked ? 'var(--olive-brown)' : '#888',
                      textAlign: 'center', fontWeight: 700,
                    }}>
                      {store.name}
                    </div>

                    {/* NPC name */}
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.48rem,0.95vw,0.62rem)',
                      color: unlocked ? 'var(--teal)' : '#aaa',
                      textAlign: 'center',
                    }}>
                      {store.npcName}
                    </div>

                    {/* Description tag */}
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.48rem,0.95vw,0.62rem)',
                      color: 'white',
                      background: unlocked ? 'var(--teal)' : '#aaa',
                      borderRadius: '20px', padding: '2px 8px',
                      textAlign: 'center',
                    }}>
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
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.22)', borderRadius: '14px',
                        fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                      }}>
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
                      ▼ Dance!
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            QUESTION PHASE
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'QUESTION' && question && (
          <motion.div
            key={`q-${activeDancerIdx}-${questionIdx}`}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(70px,11vh,90px) clamp(16px,4vw,48px) clamp(16px,4vw,32px)',
              zIndex: 5,
            }}
          >
            {/* Progress bar */}
            <div style={{
              width: '100%', maxWidth: '560px',
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'white' }}>
                {dancer.npcName}
              </span>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px' }}>
                <div style={{
                  width: `${(questionIdx / totalQ) * 100}%`,
                  height: '100%', background: '#F5C84A', borderRadius: '3px',
                  transition: 'width 0.4s',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'white' }}>
                {questionIdx + 1}/{totalQ}
              </span>
            </div>

            {/* NPC dialogue bubble */}
            <div style={{
              width: '100%', maxWidth: '560px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '14px', padding: 'clamp(8px,1.5vh,14px) clamp(12px,2vw,20px)',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.62rem,1.3vw,0.8rem)',
              color: 'white', marginBottom: '10px', lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 700, color: '#FFD700' }}>{dancer.npcName}: </span>
              {question.npcDialogueBefore}
            </div>

            {/* Question card */}
            <div style={{
              width: '100%', maxWidth: '560px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '14px', padding: 'clamp(10px,1.8vh,18px) clamp(12px,2vw,20px)',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.72rem,1.5vw,0.95rem)',
              color: 'var(--olive-brown)',
              marginBottom: '10px', textAlign: 'center',
            }}>
              {question.questionText}
            </div>

            {/* Choices */}
            <div style={{
              width: '100%', maxWidth: '560px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {question.choices.map((choice, ci) => {
                let bg = 'rgba(255,255,255,0.92)';
                let border = '2px solid transparent';
                if (showFeedback) {
                  if (choice.isCorrect) { bg = '#d4edda'; border = '2px solid #28a745'; }
                  else if (ci === selected && !choice.isCorrect) { bg = '#f8d7da'; border = '2px solid #dc3545'; }
                } else if (ci === selected) {
                  border = '2px solid var(--teal)';
                }
                return (
                  <motion.button
                    key={ci}
                    onClick={() => handleChoice(ci)}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    style={{
                      background: bg, border, borderRadius: '10px',
                      padding: 'clamp(8px,1.4vh,13px) clamp(12px,2vw,18px)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.65rem,1.3vw,0.82rem)',
                      color: '#333', cursor: showFeedback ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    {choice.text}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    width: '100%', maxWidth: '560px',
                    marginTop: '10px',
                    background: question.choices[selected!]?.isCorrect
                      ? 'rgba(40,167,69,0.92)' : 'rgba(220,53,69,0.92)',
                    borderRadius: '12px',
                    padding: 'clamp(8px,1.4vh,14px) clamp(12px,2vw,18px)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.62rem,1.2vw,0.78rem)',
                    color: 'white', lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                    {question.choices[selected!]?.isCorrect ? '✅ Correct!' : '❌ Not quite!'}
                  </div>
                  <div>
                    {question.choices[selected!]?.isCorrect
                      ? question.feedbackCorrect
                      : question.feedbackWrong}
                  </div>
                  <div style={{
                    marginTop: '4px', fontSize: 'clamp(0.55rem,1.1vw,0.7rem)',
                    opacity: 0.9, fontStyle: 'italic',
                  }}>
                    📖 {question.grammarRule}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {showFeedback && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={handleNext}
                className="btn btn-primary"
                style={{ marginTop: '12px', fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}
              >
                {questionIdx + 1 < totalQ ? 'Next ➜' : 'Finish 🎉'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            DANCER RESULT
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'DANCER_RESULT' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 10, padding: '20px',
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: '20px', padding: 'clamp(20px,4vh,36px) clamp(24px,5vw,48px)',
              textAlign: 'center', maxWidth: '420px', width: '100%',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '8px' }}>
                {sessionScore >= 4 ? '🎉' : '💪'}
              </div>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1rem,2.4vw,1.5rem)',
                color: 'var(--olive-brown)', marginBottom: '6px',
              }}>
                {dancer.npcName} — Done!
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.75rem,1.5vw,1rem)',
                color: '#555', marginBottom: '12px',
              }}>
                Score: <strong style={{ color: sessionScore >= 4 ? '#28a745' : '#dc3545' }}>
                  {sessionScore}/{totalQ}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} style={{ fontSize: 'clamp(1rem,2.2vw,1.6rem)' }}>
                    {n <= sessionScore ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.62rem,1.2vw,0.78rem)',
                color: '#666', marginBottom: '16px',
                background: '#f8f9fa', borderRadius: '10px', padding: '10px 14px',
              }}>
                {sessionScore >= 4
                  ? `Great job! You've completed ${dancer.npcName}'s challenge.`
                  : `Keep practicing! You need 4/5 to pass. You can try again from the dancer select.`}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAfterResult}
                style={{ fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}
              >
                {activeDancerIdx + 1 < SECTION_D.stores.length ? 'Next Dancer ➜' : 'Continue ➜'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MINA CLOSING SPEECH — uses MinaIntro-style scalloped bubble
        ══════════════════════════════════════════════════════════════════════ */}
        {phase === 'MINA_CLOSING' && (
          <motion.div
            key={`mina-${minaLineIdx}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 10, padding: 'clamp(60px,10vh,80px) clamp(20px,5vw,60px) 20px',
            }}
          >
            {/* Mina cycling background */}
            <img
              src={minaBg.candidates[minaBgSrcIdx]}
              alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                filter: 'blur(3px) brightness(0.72) saturate(0.9)',
                transform: 'scale(1.04)', zIndex: -1,
              }}
              onError={() => {
                if (minaBgSrcIdx + 1 < minaBg.candidates.length) setMinaBgSrcIdx(i => i + 1);
              }}
            />
            <div style={{ marginBottom: '16px' }}>
              <img
                src={ASSETS.minaMascot}
                alt="Mina"
                style={{
                  width: 'clamp(64px,12vw,110px)',
                  height: 'clamp(64px,12vw,110px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '20px',
              padding: 'clamp(18px,3.5vh,30px) clamp(20px,4vw,40px)',
              maxWidth: '560px', width: '100%',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.72rem,1.5vw,0.95rem)',
                color: 'var(--olive-brown)',
                lineHeight: 1.7, marginBottom: '20px',
              }}>
                <span style={{ fontWeight: 700, color: '#8B1A8B' }}>Mina: </span>
                {MINA_LINES[minaLineIdx]}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                {MINA_LINES.map((_, i) => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: i === minaLineIdx ? '#8B1A8B' : 'rgba(139,26,139,0.3)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleMinaNext}
                style={{ fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}
              >
                {minaLineIdx + 1 < MINA_LINES.length ? 'Continue ➜' : '🎓 See Results'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── DONE (transitioning) ── */}
        {phase === 'DONE' && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.2rem,2.8vw,2rem)',
              color: 'white',
              textShadow: '2px 3px 0 rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}>
              🎓 Loading your results…
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Locked toast — identical to SectionView */}
      <AnimatePresence>
        {lockedMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: 'clamp(70px,12vh,110px)',
              left: '50%', transform: 'translateX(-50%)',
              background: 'var(--error)', color: 'white',
              padding: '9px 18px', borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.65rem,1.4vw,0.85rem)',
              zIndex: 20,
            }}
          >
            🔒 {lockedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons — identical placement to SectionView */}
      {phase === 'DANCER_SELECT' && (
        <div style={{
          position: 'absolute',
          bottom: 'clamp(12px,2.5vh,24px)',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: '10px',
          zIndex: 10,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={() => goToScene('MAP')}>
            ← Map
          </button>
        </div>
      )}
    </div>
  );
}