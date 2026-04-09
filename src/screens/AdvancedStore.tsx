import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { getLevelBgCandidates } from '../data/assets';

type Phase = 'question' | 'answered' | 'done';

const SECTION_ACCENT: Record<string, string> = {
  A: '#E85D26',
  B: '#3A9E5C',
  C: '#3A4DB8',
  D: '#8B1A8B',
};

const SECTION_FALLBACK: Record<string, string> = {
  A: 'linear-gradient(135deg,#FFE090,#F5C84A)',
  B: 'linear-gradient(135deg,#A8D8A0,#5B9A50)',
  C: 'linear-gradient(135deg,#A0C8F0,#4088C0)',
  D: 'linear-gradient(135deg,#E0A0F0,#8B1A8B)',
};

export default function AdvancedStore() {
  const {
    currentSection, currentStoreIndex, currentQuestionSet,
    completeStore, addScore, goToScene, setQuestionSet,
  } = useGameStore();

  const section = SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;
  const store = section.stores[currentStoreIndex];
  if (!store) return null;
  const qSet = store.questionSets.find(qs => qs.id === currentQuestionSet) ?? store.questionSets[0];
  if (!qSet) return null;

  const accent = SECTION_ACCENT[section.id] ?? '#E85D26';
  const fallbackBg = SECTION_FALLBACK[section.id] ?? SECTION_FALLBACK.A;

  const bgCandidates = getLevelBgCandidates(section.id, currentStoreIndex);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);

  const [phase, setPhase] = useState<Phase>('question');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const scoreRef = useRef(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; correctAns: string }[]>([]);

  const currentQ = qSet.questions[qIdx];
  const totalQ = qSet.questions.length;
  const choiceLabels = ['A', 'B', 'C', 'D'];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = currentQ.choices[i].isCorrect;
    setIsCorrect(correct);
    setFeedbackText(correct ? currentQ.feedbackCorrect : currentQ.feedbackWrong);
    if (correct) { scoreRef.current += 1; setScoreDisplay(scoreRef.current); }
    const correctChoice = currentQ.choices.find(c => c.isCorrect)!;
    setResults(r => [...r, { correct, correctAns: correctChoice.text }]);
    setPhase('answered');
  };

  const handleNext = () => {
    if (qIdx + 1 >= totalQ) { setPhase('done'); return; }
    setQIdx(i => i + 1);
    setSelected(null);
    setFeedbackText('');
    setPhase('question');
  };

  const handleFinish = () => {
    completeStore(section.id, store.id, scoreRef.current);
    addScore(scoreRef.current, totalQ);
    goToScene('SCORE_SUMMARY');
  };

  const handleRetry = () => {
    const next = currentQuestionSet === 'A' ? 'B' : 'A';
    setQuestionSet(next);
    setQIdx(0); setSelected(null);
    scoreRef.current = 0; setScoreDisplay(0);
    setFeedbackText(''); setResults([]);
    setIsCorrect(false);
    setPhase('question');
  };

  const progressPct = totalQ > 0 ? ((qIdx + (selected !== null ? 1 : 0)) / totalQ) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      background: fallbackBg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Blurred backdrop image (same as original AdvancedStore) */}
      {!bgFailed && (
        <img
          key={`${currentStoreIndex}-${bgIndex}`}
          src={bgCandidates[bgIndex]}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            filter: 'blur(6px) brightness(0.55)', transform: 'scale(1.08)',
            zIndex: 0,
          }}
          onError={() => {
            if (bgIndex < bgCandidates.length - 1) setBgIndex(b => b + 1);
            else setBgFailed(true);
          }}
        />
      )}
      {/* Overlay so text remains readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.72)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* ── Header bar ── */}
      <div style={{
        flexShrink: 0,
        background: 'white',
        borderBottom: `3px solid ${accent}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: 'clamp(10px,2vh,16px) clamp(14px,3vw,28px)',
        display: 'flex', alignItems: 'center', gap: '12px',
        zIndex: 10,
        position: 'relative',
      }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flexShrink: 0, fontSize: 'clamp(0.7rem,1.3vw,0.85rem)' }}
          onClick={() => goToScene('ADVANCED_SECTION_VIEW')}
        >← Back</button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <span style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.75rem,1.5vw,1rem)',
              color: accent, fontWeight: 700,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {section.emoji} {store.name} — {section.grammarTopic}
            </span>
            <span style={{
              flexShrink: 0,
              background: accent, color: 'white',
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.42rem,0.8vw,0.58rem)',
              padding: '2px 8px', borderRadius: '20px', letterSpacing: '1px',
            }}>⚡ MASTERY CHECKPOINT</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: accent, borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{
          flexShrink: 0,
          fontFamily: 'var(--font-char)', fontWeight: 700,
          fontSize: 'clamp(0.65rem,1.2vw,0.82rem)',
          color: accent,
          background: `${accent}15`,
          border: `1.5px solid ${accent}44`,
          borderRadius: '10px', padding: '4px 12px',
          textAlign: 'center', lineHeight: 1.3,
        }}>
          <div>Q {qIdx + 1}/{totalQ}</div>
          <div style={{ fontSize: 'clamp(0.55rem,1vw,0.68rem)', opacity: 0.75 }}>⭐ {scoreDisplay} pts</div>
        </div>
      </div>

      {/* ── Question area ── */}
      {(phase === 'question' || phase === 'answered') && (
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: 'clamp(16px,3vh,32px) clamp(16px,4vw,48px)',
          display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vh,20px)',
          maxWidth: '760px', width: '100%', margin: '0 auto', boxSizing: 'border-box',
          position: 'relative', zIndex: 2,
        }}>

          {/* Question number tag */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              background: accent, color: 'white',
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.6rem,1.1vw,0.75rem)',
              padding: '3px 12px', borderRadius: '20px',
              letterSpacing: '0.5px', flexShrink: 0,
            }}>Question {qIdx + 1} of {totalQ}</div>
            <div style={{
              height: '1px', flex: 1,
              background: `linear-gradient(90deg, ${accent}44, transparent)`,
            }} />
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              style={{
                background: 'white',
                border: `2px solid ${accent}33`,
                borderRadius: '16px',
                padding: 'clamp(16px,3vh,28px) clamp(16px,3vw,28px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              }}
            >
              {/* Context / dialogue (if any) */}
              {currentQ.npcDialogueBefore && currentQ.npcDialogueBefore !== currentQ.questionText && (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.72rem,1.4vw,0.9rem)',
                  color: '#6B5B45',
                  lineHeight: 1.65,
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: `1px dashed ${accent}33`,
                  fontStyle: 'italic',
                }}>
                  {currentQ.npcDialogueBefore}
                </div>
              )}

              {/* Main question text */}
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.9rem,1.9vw,1.2rem)',
                color: '#1A1200',
                fontWeight: 800,
                lineHeight: 1.55,
              }}>
                {currentQ.questionText || currentQ.npcDialogueBefore}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.2vh,10px)' }}>
            {currentQ.choices.map((choice, i) => {
              const isCorrectChoice = choice.isCorrect;
              let bg = 'white';
              let border = 'rgba(0,0,0,0.12)';
              let labelBg = accent;
              let textColor = '#1A1200';
              let opacity = 1;

              if (selected !== null) {
                if (isCorrectChoice) {
                  bg = '#D4EDDA'; border = '#28A745'; labelBg = '#28A745'; textColor = '#155724';
                } else if (i === selected) {
                  bg = '#F8D7DA'; border = '#DC3545'; labelBg = '#DC3545'; textColor = '#721c24';
                } else {
                  opacity = 0.35;
                }
              }

              return (
                <motion.button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => handleAnswer(i)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity, x: 0, transition: { delay: i * 0.06 } }}
                  whileHover={selected === null ? { x: 3, boxShadow: `0 4px 16px ${accent}33` } : {}}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 'clamp(10px,1.8vw,16px)',
                    background: bg,
                    border: `2px solid ${border}`,
                    borderRadius: '12px',
                    padding: 'clamp(10px,1.8vh,16px) clamp(12px,2vw,20px)',
                    cursor: selected !== null ? 'default' : 'pointer',
                    textAlign: 'left', width: '100%',
                    transition: 'all 0.18s',
                    boxShadow: selected === null ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 'clamp(28px,3.5vw,36px)', height: 'clamp(28px,3.5vw,36px)',
                    background: labelBg, color: 'white',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-char)', fontWeight: 800,
                    fontSize: 'clamp(0.65rem,1.2vw,0.82rem)',
                    flexShrink: 0, transition: 'background 0.18s',
                  }}>{choiceLabels[i]}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.75rem,1.5vw,0.95rem)',
                    color: textColor, lineHeight: 1.5,
                    fontWeight: selected !== null && isCorrectChoice ? 700 : 400,
                    transition: 'color 0.18s',
                  }}>
                    {choice.text.replace(/^[A-D]\.\s*/, '')}
                  </span>
                  {selected !== null && isCorrectChoice && (
                    <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 'clamp(0.9rem,1.6vw,1.1rem)' }}>✓</span>
                  )}
                  {selected !== null && i === selected && !isCorrectChoice && (
                    <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 'clamp(0.9rem,1.6vw,1.1rem)' }}>✗</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', paddingTop: '4px' }}>
            {Array.from({ length: totalQ }).map((_, i) => (
              <div key={i} style={{
                width: i === qIdx ? '20px' : '7px', height: '7px',
                borderRadius: '4px',
                background: i < qIdx ? '#28A745' : i === qIdx ? accent : 'rgba(0,0,0,0.12)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Feedback overlay ── */}
      <AnimatePresence>
        {phase === 'answered' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)', zIndex: 40,
              padding: 'clamp(14px,3vw,32px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: isCorrect
                  ? 'linear-gradient(160deg,#F0FFF4,#D4EDDA)'
                  : 'linear-gradient(160deg,#FFF5F5,#F8D7DA)',
                border: `3px solid ${isCorrect ? '#28A745' : '#DC3545'}`,
                borderRadius: '20px',
                padding: 'clamp(20px,4vh,40px) clamp(24px,5vw,52px)',
                width: 'clamp(280px,55vw,520px)', maxWidth: '92vw',
                textAlign: 'center',
                boxShadow: '0 16px 56px rgba(0,0,0,0.35)',
              }}
            >
              <div style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', marginBottom: '10px', lineHeight: 1 }}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.1rem,2.5vw,1.8rem)',
                color: isCorrect ? '#155724' : '#721c24',
                marginBottom: '12px',
              }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.72rem,1.4vw,0.9rem)',
                color: isCorrect ? '#1a5c2e' : '#7a2030',
                lineHeight: 1.7, marginBottom: '22px',
                background: isCorrect ? 'rgba(40,167,69,0.07)' : 'rgba(220,53,69,0.07)',
                borderRadius: '10px', padding: '10px 14px',
              }}>{feedbackText}</div>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                style={{
                  minWidth: '130px',
                  background: isCorrect ? '#28A745' : accent,
                  borderColor: isCorrect ? '#28A745' : accent,
                }}
              >
                {qIdx + 1 >= totalQ ? 'See Results →' : 'Next Question →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Done / Results overlay ── */}
      {phase === 'done' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)', padding: 'clamp(14px,3vw,36px)',
          overflowY: 'auto', zIndex: 50,
        }}>
          <motion.div
            className="panel"
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 'clamp(280px,90vw,520px)', maxWidth: '94vw',
              maxHeight: '88vh', overflowY: 'auto',
              textAlign: 'center', margin: '0 auto',
              border: `3px solid ${accent}`,
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height: '6px', background: accent,
              borderRadius: '12px 12px 0 0',
              marginTop: '-1px', marginLeft: '-1px', marginRight: '-1px',
            }} />

            <div style={{ padding: 'clamp(16px,3vh,28px) clamp(16px,3vw,24px)' }}>

              {/* Score */}
              <div style={{ marginBottom: '6px' }}>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(0.8rem,1.6vw,1.1rem)',
                  color: accent, marginBottom: '6px',
                }}>
                  ⚡ Mastery Checkpoint Complete
                </div>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(2.2rem,5vw,3.8rem)',
                  color: scoreRef.current >= 4 ? '#28A745' : accent,
                  lineHeight: 1,
                }}>
                  {scoreRef.current}/{totalQ}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.62rem,1.2vw,0.78rem)',
                  color: 'var(--text-muted)', marginTop: '2px',
                }}>
                  {Math.round((scoreRef.current / totalQ) * 100)}% — {store.name}
                </div>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '18px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <motion.span key={n}
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: n * 0.08, type: 'spring', stiffness: 300 }}
                    style={{ fontSize: 'clamp(1.3rem,3vw,2.1rem)' }}>
                    {n <= scoreRef.current ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>

              {/* Results table */}
              <div style={{
                background: 'var(--surface)', borderRadius: '12px',
                padding: 'clamp(10px,1.8vh,16px) clamp(12px,2vw,18px)',
                marginBottom: '18px', textAlign: 'left',
              }}>
                <div style={{
                  fontFamily: 'var(--font-char)', fontWeight: 700,
                  fontSize: 'clamp(0.65rem,1.2vw,0.8rem)',
                  color: 'var(--olive-brown)', marginBottom: '10px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}>Results</div>
                {results.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: 'clamp(5px,0.9vh,8px) 0',
                    borderBottom: i < results.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-char)', fontWeight: 700,
                      fontSize: 'clamp(0.6rem,1.1vw,0.75rem)',
                      color: 'var(--text-muted)', flexShrink: 0, minWidth: '24px',
                    }}>Q{i + 1}</span>
                    <span style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', flexShrink: 0 }}>
                      {r.correct ? '✅' : '❌'}
                    </span>
                    {!r.correct && (
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.58rem,1vw,0.72rem)',
                        color: '#28A745',
                      }}>
                        Correct: {r.correctAns.replace(/^[A-D]\.\s*/, '')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {scoreRef.current >= 4 ? (
                  <motion.button className="btn btn-success"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={handleFinish}>
                    ✅ Continue →
                  </motion.button>
                ) : (
                  <>
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => goToScene('ADVANCED_SECTION_VIEW')}>
                      ← Back to Section
                    </button>
                    <motion.button className="btn btn-primary btn-sm"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={handleRetry}
                      style={{ background: accent, borderColor: accent }}>
                      🔄 Try Again
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}