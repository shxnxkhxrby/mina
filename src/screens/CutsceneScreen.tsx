import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTION_D } from '../data/sectionD';

// ── Audio for Mina's closing speech (files 20–26) ─────────────────────────
const MINA_CLOSING_AUDIO = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563620/20_arukqm.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/21_ht1kj7.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/22_sx7vkx.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/23_oxr6hf.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563622/24_qwsdwu.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563622/25_xf1dkb.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563623/26_fegdul.m4a',
];

// ── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'DANCER_SELECT'   // show 3 dancer cards
  | 'QUESTION'        // active quiz for current dancer
  | 'DANCER_RESULT'   // score card after each dancer
  | 'MINA_CLOSING'    // Mina's 7-line closing speech
  | 'DONE';           // triggers SCORE_SUMMARY

// ── Mina closing speech lines ────────────────────────────────────────────────
const MINA_LINES = [
  "Congratulations! 🎉 You have completed learning the three major grammar areas: subject-verb agreement, prepositions of time and manner, and perfect tenses.",
  "Throughout your adventure, you explored different challenges, made careful choices, and applied important grammar rules in real situations.",
  "You didn't just answer questions — you understood how grammar works and how it brings clarity and meaning to communication.",
  "You showed discipline in following rules, creativity in expressing ideas, and unity in connecting different concepts together.",
  "Take a moment to be proud of what you've accomplished today. Every correct answer, every mistake you learned from, and every concept you mastered has helped you grow stronger in grammar.",
  "But remember — this achievement is only the beginning. If you're ready for a greater challenge, you can try Professional Mode and test your skills at a higher level.",
  "Keep going, keep learning, and keep challenging yourself. Your grammar adventure doesn't end here — it's just getting started! I'll see you in your next adventure! ✨",
];

// ── Sprite helper ────────────────────────────────────────────────────────────
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const prog = sectionProgress['D'] || {};

  // ── Derived ────────────────────────────────────────────────────────────────
  const dancer = SECTION_D.stores[activeDancerIdx];
  const qSet = dancer?.questionSets.find(qs => qs.id === currentQuestionSet) ?? dancer?.questionSets[0];
  const question = qSet?.questions[questionIdx];
  const totalQ = qSet?.questions.length ?? 5;

  // ── Unlock logic: next dancer unlocks once previous is ATTEMPTED (bestScore recorded)
  function isDancerUnlocked(i: number): boolean {
    if (i === 0) return true;
    const prev = prog[SECTION_D.stores[i - 1].id];
    // Unlocked if previous dancer has been attempted (has a bestScore or completed)
    return (prev?.completed === true) || (prev?.bestScore !== undefined && prev.bestScore >= 0 && prev.attempts > 0);
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
    setFinalScore(0);
    setPhase('QUESTION');
  }

  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [finalScore, setFinalScore] = useState(0); // the score actually saved to store

  function handleChoice(choiceIdx: number) {
    if (showFeedback) return;
    const correct = question.choices[choiceIdx].isCorrect;
    setSelected(choiceIdx);
    setShowFeedback(true);
    setLastAnswerCorrect(correct);
    if (correct) {
      setSessionScore(s => s + 1);
    }
  }

  function handleNext() {
    if (questionIdx + 1 < totalQ) {
      setQuestionIdx(q => q + 1);
      setSelected(null);
      setShowFeedback(false);
      setLastAnswerCorrect(false);
    } else {
      // Bug fix: sessionScore state is stale here (React async batching).
      // Compute the real final score synchronously using lastAnswerCorrect.
      const isLastCorrect = lastAnswerCorrect ? 1 : 0;
      const computedFinalScore = sessionScore + isLastCorrect;
      setFinalScore(computedFinalScore);
      completeStore('D', dancer.id, computedFinalScore);
      addScore(computedFinalScore, totalQ);
      setPhase('DANCER_RESULT');
    }
  }

  function handleAfterResult() {
    // Reset all quiz state for next dancer
    setQuestionIdx(0);
    setSessionScore(0);
    setSelected(null);
    setShowFeedback(false);
    setLastAnswerCorrect(false);
    setFinalScore(0);

    const nextIdx = activeDancerIdx + 1;
    if (nextIdx < SECTION_D.stores.length) {
      // More dancers remain - go back to select screen
      setPhase('DANCER_SELECT');
    } else {
      // All dancers done → Mina closing speech
      setMinaLineIdx(0);
      setPhase('MINA_CLOSING');
    }
  }

  function handleMinaNext() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (minaLineIdx + 1 < MINA_LINES.length) {
      setMinaLineIdx(l => l + 1);
    } else {
      setPhase('DONE');
    }
  }

  // Trigger scene change when DONE
  useEffect(() => {
    if (phase === 'DONE') {
      const t = setTimeout(() => goToScene('SCORE_SUMMARY'), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Play Mina closing audio per line
  useEffect(() => {
    if (phase !== 'MINA_CLOSING') return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const src = MINA_CLOSING_AUDIO[minaLineIdx];
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [phase, minaLineIdx]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ── Re-check after result to go to next dancer ─────────────────────────────
  // When returning to DANCER_SELECT after a result, we want to auto-advance
  // if all previous dancers done. Let's just show select screen always.

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div className="scene" style={{ background: 'linear-gradient(160deg,#E0A0F0,#B060D0 40%,#8B1A8B)' }}>
      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 'clamp(16px,3.5vh,32px)',
        left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', zIndex: 10,
      }}>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1rem,2.4vw,1.6rem)',
          color: 'white',
          textShadow: '2px 3px 0 rgba(0,0,0,0.5)',
        }}>
          💃 Grammar Street Dance Challenge
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.55rem,1.1vw,0.75rem)',
          color: 'rgba(255,248,231,0.9)',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '20px', padding: '2px 12px',
          display: 'inline-block', marginTop: '3px',
        }}>
          Mixed Grammar Review · Section D
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── DANCER SELECT ── */}
        {phase === 'DANCER_SELECT' && (
          <motion.div key="select"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              gap: 'clamp(12px,3vw,32px)',
              paddingBottom: 'clamp(60px,11vh,100px)',
              zIndex: 5,
            }}
          >
            {SECTION_D.stores.map((store, i) => {
              const unlocked = isDancerUnlocked(i);
              const completed = prog[store.id]?.completed;
              const best = prog[store.id]?.bestScore ?? 0;
              const showEmoji = spriteErrors[i];

              return (
                <motion.div key={store.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                  onClick={() => handleDancerSelect(i)}
                  whileHover={unlocked ? { y: -10, scale: 1.06 } : {}}
                  whileTap={unlocked ? { scale: 0.96 } : {}}
                  style={{ cursor: unlocked ? 'pointer' : 'not-allowed' }}
                >
                  <div style={{
                    width: 'clamp(110px,18vw,190px)',
                    background: completed ? 'rgba(255,248,220,0.97)' : unlocked ? 'rgba(255,255,255,0.96)' : 'rgba(200,200,200,0.85)',
                    borderRadius: '16px',
                    border: completed ? '3px solid #F5C84A' : unlocked ? '3px solid #fff' : '3px solid #aaa',
                    boxShadow: unlocked ? '0 8px 28px rgba(0,0,0,0.35)' : '0 4px 12px rgba(0,0,0,0.2)',
                    padding: 'clamp(10px,1.8vh,18px) clamp(8px,1.5vw,14px)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '5px',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Shimmer */}
                    {completed && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, transparent 50%)',
                        pointerEvents: 'none',
                      }} />
                    )}
                    {/* Sprite */}
                    <div style={{
                      width: 'clamp(52px,10vw,88px)', height: 'clamp(52px,10vw,88px)',
                      borderRadius: '12px', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: showEmoji ? 'transparent' : 'rgba(0,0,0,0.04)',
                      filter: unlocked ? 'none' : 'grayscale(0.7)',
                    }}>
                      {showEmoji ? (
                        <span style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>{store.emoji}</span>
                      ) : (
                        <img src={getDancerSprite(i)} alt={store.npcName}
                          onError={() => setSpriteErrors(p => ({ ...p, [i]: true }))}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        />
                      )}
                    </div>
                    {/* Name */}
                    <div style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 'clamp(0.62rem,1.3vw,0.85rem)',
                      color: unlocked ? 'var(--olive-brown)' : '#888',
                      textAlign: 'center', fontWeight: 700,
                    }}>{store.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.48rem,0.95vw,0.62rem)',
                      color: 'white',
                      background: unlocked ? '#B060D0' : '#aaa',
                      borderRadius: '20px', padding: '2px 8px', textAlign: 'center',
                    }}>{store.description}</div>
                    {/* Stars */}
                    {completed && (
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1,2,3,4,5].map(n => (
                          <span key={n} style={{ fontSize: 'clamp(0.5rem,1vw,0.75rem)' }}>
                            {n <= best ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Lock */}
                    {!unlocked && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.22)', borderRadius: '14px',
                        fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                      }}>🔒</div>
                    )}
                  </div>
                  {unlocked && !completed && (
                    <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ textAlign: 'center', fontSize: 'clamp(0.8rem,1.6vw,1.1rem)', marginTop: '4px', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
                    >▼ Dance!</motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── QUESTION ── */}
        {phase === 'QUESTION' && question && (
          <motion.div key={`q-${activeDancerIdx}-${questionIdx}`}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(60px,10vh,80px) clamp(16px,4vw,48px) clamp(16px,4vw,32px)',
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
                  width: `${((questionIdx) / totalQ) * 100}%`,
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
              color: 'white', marginBottom: '10px',
              lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 700, color: '#FFD700' }}>{dancer.npcName}: </span>
              {question.npcDialogueBefore}
            </div>

            {/* Question */}
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
                  border = '2px solid #B060D0';
                }
                return (
                  <motion.button key={ci}
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

        {/* ── DANCER RESULT ── */}
        {phase === 'DANCER_RESULT' && (
          <motion.div key="result"
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
                {finalScore >= 4 ? '🎉' : '💪'}
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
                Score: <strong style={{ color: finalScore >= 4 ? '#28a745' : '#dc3545' }}>
                  {finalScore}/{totalQ}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map(n => (
                  <span key={n} style={{ fontSize: 'clamp(1rem,2.2vw,1.6rem)' }}>
                    {n <= finalScore ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.62rem,1.2vw,0.78rem)',
                color: '#666', marginBottom: '16px',
                background: '#f8f9fa', borderRadius: '10px', padding: '10px 14px',
              }}>
                {finalScore >= 4
                  ? `Great job! You've completed ${dancer.npcName}'s challenge.`
                  : `Keep practicing! You need 4/5 to pass. You can try again from the dancer select.`}
              </div>
              <button className="btn btn-primary" onClick={handleAfterResult}
                style={{ fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}>
                {activeDancerIdx + 1 < SECTION_D.stores.length ? 'Next Dancer ➜' : 'Continue ➜'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MINA CLOSING SPEECH ── */}
        {phase === 'MINA_CLOSING' && (
          <motion.div key={`mina-${minaLineIdx}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 10, padding: 'clamp(60px,10vh,80px) clamp(20px,5vw,60px) 20px',
              cursor: 'pointer',
            }}
            onClick={handleMinaNext}
          >
            {/* Mina mascot */}
            <div style={{ marginBottom: '16px' }}>
              <img
                src="/imgs/mina-mascot.png"
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

            {/* Speech bubble */}
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
                lineHeight: 1.7,
                marginBottom: '20px',
              }}>
                <span style={{ fontWeight: 700, color: '#B060D0' }}>Mina: </span>
                {MINA_LINES[minaLineIdx]}
              </div>
              {/* Progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                {MINA_LINES.map((_, i) => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: i === minaLineIdx ? '#B060D0' : 'rgba(176,96,208,0.3)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <button className="btn btn-primary" onClick={e => { e.stopPropagation(); handleMinaNext(); }}
                style={{ fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}>
                {minaLineIdx + 1 < MINA_LINES.length ? 'Continue ➜' : '🎓 See Results'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── DONE (transitioning) ── */}
        {phase === 'DONE' && (
          <motion.div key="done"
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

      {/* Locked toast */}
      <AnimatePresence>
        {lockedMsg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', bottom: 'clamp(70px,12vh,110px)',
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

      {/* Back to Map (only on dancer select) */}
      {phase === 'DANCER_SELECT' && (
        <div style={{
          position: 'absolute', bottom: 'clamp(12px,2.5vh,24px)',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 10,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={() => goToScene('MAP')}>
            ← Map
          </button>
        </div>
      )}
    </div>
  );
}