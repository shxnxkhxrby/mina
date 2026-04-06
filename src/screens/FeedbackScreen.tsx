import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { SECTION_D } from '../data/sectionD';
import { ASSETS } from '../data/assets';

// ── Per-section congrats data ─────────────────────────────────────────────
const SECTION_CONGRATS: Record<string, {
  subline: string;
  minaLines: string[];
  accentColor: string;
  scallop: string;
  bgGradient: string;
}> = {
  A: {
    subline: 'Section A — Perfect Tenses Complete!',
    accentColor: '#C05010',
    scallop: '#E8A830',
    bgGradient: 'linear-gradient(160deg,#FFF3D0 0%,#FFE090 60%,#F5C84A 100%)',
    minaLines: [
      "Amazing job! 🎉 You've explored the Minasa Festival and mastered all three perfect tenses.",
      "Aling Liling, Zeny, and Elsa are all so proud of you! The market awaits — keep going! 🌸",
    ],
  },
  B: {
    subline: 'Section B — Subject-Verb Agreement Complete!',
    accentColor: '#1E6E3A',
    scallop: '#5B9A50',
    bgGradient: 'linear-gradient(160deg,#D4EED0 0%,#A8D8A0 60%,#5B9A50 100%)',
    minaLines: [
      "Wonderful! 🥳 You navigated Subject–Verb Agreement like a true grammar pro!",
      "The Pamilihang Bayan vendors are cheering for you! Section C is now unlocked — let's explore! ✨",
    ],
  },
  C: {
    subline: 'Section C — Prepositions of Time & Manner Complete!',
    accentColor: '#1A4E8A',
    scallop: '#4088C0',
    bgGradient: 'linear-gradient(160deg,#D0E8FF 0%,#A0C8F0 60%,#4088C0 100%)',
    minaLines: [
      "Incredible! 🏆 You've conquered Prepositions of Time and Manner!",
      "All three grammar areas mastered! The Minasa Festival awaits — Section D is now unlocked! 🎊",
    ],
  },
  D: {
    subline: 'Section D — Grammar Street Dance Challenge Complete!',
    accentColor: '#5A0A7A',
    scallop: '#8B1A8B',
    bgGradient: 'linear-gradient(160deg,#F0D0FF 0%,#D090E8 60%,#9040B0 100%)',
    minaLines: [
      "Fantastic work! 🎉 You applied prepositions, subject-verb agreement, and perfect tenses correctly!",
      "Just like dancing, grammar needs rhythm, discipline, creativity, and unity. You've shown all of those today! ✨",
    ],
  },
};

const TIPS: Record<string, string> = {
  A1: 'Past Perfect (had + past participle) = action completed BEFORE another past action. Key signals: before, after, already, by the time.',
  A2: 'Present Perfect (have/has + past participle) = past action relevant NOW. Key signals: already, just, yet, since, for, ever, never, this week.',
  A3: 'Future Perfect (will have + past participle) = action completed BEFORE a future deadline. Key signals: by the time, by tomorrow, by next [time].',
  B1: "Either/Or and Neither/Nor: the verb agrees with the subject NEAREST to it. Phrases like 'along with' do NOT change the main subject.",
  B2: 'Each, every, everyone, someone, nobody = SINGULAR verb. Both, few, many, several = PLURAL verb.',
  B3: 'Noncount nouns (information, advice, news, rice, flour, sugar) = singular verb. Plural-only nouns (goods, proceeds, valuables) = plural verb.',
  C1: 'AT = clock time. ON = day/date. IN = month/year/season.',
  C2: 'BY = mode/method. WITH = tool, companionship, or attitude. IN = style or manner.',
  C3: 'Combine both: check if the blank needs WHEN (time) or HOW (manner). Read the full sentence for clues!',
  D1: 'SVA: With either/or and neither/nor, the verb agrees with the NEAREST subject.',
  D2: 'SVA: Indefinite pronouns (each, everyone, somebody) = singular. Both, many, several = plural.',
  D3: 'SVA: Noncount nouns (advice, music) = singular. Plural-only nouns (surroundings, earnings, goods, proceeds) = plural.',
};

export default function FeedbackScreen() {
  const {
    currentSection,
    currentStoreIndex,
    sectionProgress,
    goToScene,
    setStoreIndex,
    setQuestionSet,
    setSection,
    isAdvancedMode,
  } = useGameStore();

  // Use ALL_SECTIONS so Section D is found when currentSection === 'D'
  const ALL_SECTIONS = [...SECTIONS, SECTION_D];
  const section = ALL_SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;

  const store = section.stores[currentStoreIndex];
  if (!store) return null; // guard: storeIndex out of range

  const prog = sectionProgress[currentSection!] || {};
  const score = prog[store.id]?.bestScore || 0;
  const passed = score >= 4;
  const nextStoreIndex = currentStoreIndex + 1;
  const hasNextStore = nextStoreIndex < section.stores.length;

  // True only when the player just finished the LAST store of THIS section with a pass
  const isSectionComplete = passed && !hasNextStore;
  const isSectionD = currentSection === 'D';

  // True ONLY when:
  //   • the player is currently in Section C
  //   • they just completed its last store FOR THE FIRST TIME (Section D not yet started)
  //   • ALL stores of A, B, and C are now marked completed
  // We guard with !dFullyDone so replaying C only re-triggers D if D isn't fully complete.
  const dProgress = sectionProgress['D'] || {};
  const dFullyDone = SECTION_D.stores.every(st => dProgress[st.id]?.completed);

  const justCompletedC =
    currentSection === 'C' &&
    isSectionComplete &&
    !dFullyDone &&
    ['A', 'B', 'C'].every(id => {
      const sec = SECTIONS.find(s => s.id === id);
      if (!sec) return false;
      const sp = sectionProgress[id] || {};
      return sec.stores.every(st => sp[st.id]?.completed);
    });

  const congratsData = SECTION_CONGRATS[currentSection ?? 'A'];
  const shouldShowCongrats = isSectionComplete && !!congratsData;

  const [phase, setPhase] = useState<'congrats' | 'feedback'>(
    shouldShowCongrats ? 'congrats' : 'feedback',
  );
  const [minaLineIdx, setMinaLineIdx] = useState(0);
  const minaLines = congratsData?.minaLines ?? [];
  const isLastMinaLine = minaLineIdx >= minaLines.length - 1;

  const advanceMina = () => {
    if (!isLastMinaLine) setMinaLineIdx(i => i + 1);
    else setPhase('feedback');
  };

  // ── Routing after a passed level ──────────────────────────────────────────
  const handleContinue = () => {
    if (hasNextStore) {
      // More stores remain in this section — go to the next one
      setStoreIndex(nextStoreIndex);
      setQuestionSet('A');
      goToScene(isAdvancedMode ? 'ADVANCED_STORE' : 'STORE');
      return;
    }

    if (isSectionD) {
      // Finished all of Section D → final score / certificate
      goToScene('SCORE_SUMMARY');
      return;
    }

    if (justCompletedC) {
      // First-time completion of Section C — unlock and enter Section D.
      setSection('D' as any);
      goToScene('SECTION_D_VIDEO');
      return;
    }

    // Default for all other cases (replay, A→map, B→map, etc.)
    goToScene('MAP');
  };

  // ── Continue-button label (always accurate) ───────────────────────────────
  const getContinueLabel = () => {
    if (hasNextStore) return `Next: ${section.stores[nextStoreIndex].npcName} →`;
    if (isSectionD)    return '🏆 See Final Score!';
    if (justCompletedC) return '🎉 Go to Section D!';
    return '🗺 Back to Map';
  };

  // ════════════════════════════════════════════════════════════════════════════
  // CONGRATS SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'congrats' && congratsData) {
    const { subline, accentColor, scallop, bgGradient } = congratsData;

    return (
      <div
        className="scene"
        style={{ background: bgGradient, overflow: 'hidden', cursor: 'pointer' }}
        onClick={advanceMina}
      >
        {/* Confetti */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.div key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 10 + 4}px`,
                height: `${Math.random() * 10 + 4}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: ['#FFD700','#FF69B4','#FF6347','#FFFFFF','#00BFFF','#98FB98'][Math.floor(Math.random() * 6)],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{ opacity: [0, 1, 0], y: [0, -70, -150], rotate: [0, 180, 360] }}
              transition={{ duration: 2 + Math.random() * 2.5, delay: Math.random() * 3, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Scallop top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 'clamp(28px,5vh,48px)', zIndex: 4, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1200 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d={Array.from({ length: 30 }, (_, i) => `M${i*40},0 Q${i*40+20},50 ${i*40+40},0`).join(' ') + ' L1200,0 L0,0 Z'} fill={scallop} />
          </svg>
        </div>

        {/* Scallop bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'clamp(28px,5vh,48px)', zIndex: 4, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1200 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d={Array.from({ length: 30 }, (_, i) => `M${i*40},50 Q${i*40+20},0 ${i*40+40},50`).join(' ') + ' L1200,50 L0,50 Z'} fill={scallop} />
          </svg>
        </div>

        {/* Central panel */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(60px,12vh,100px) clamp(16px,4vw,40px)',
          zIndex: 2,
        }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{
              width: 'clamp(300px,72vw,760px)',
              background: 'rgba(255,255,255,0.92)',
              border: `3px solid ${scallop}`,
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
              padding: 'clamp(20px,4vh,36px) clamp(20px,4vw,36px)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginBottom: '6px' }}>🏆</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.8vw,1.9rem)', color: accentColor, fontWeight: 900 }}>
                {subline}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'clamp(12px,2.5vw,24px)', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: bgGradient, border: `2.5px solid ${scallop}`, borderRadius: '16px', padding: 'clamp(12px,2.5vh,22px) clamp(14px,2.5vw,22px)' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={minaLineIdx}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
                    >
                      <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(0.85rem,2vw,1.25rem)', color: '#2A1800', lineHeight: 1.55, fontWeight: 800, marginBottom: '12px' }}>
                        {minaLines[minaLineIdx]}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {minaLines.map((_, i) => (
                        <motion.div key={i}
                          animate={{ scale: i === minaLineIdx ? 1.3 : 1 }}
                          style={{ width: i === minaLineIdx ? '18px' : '7px', height: '7px', borderRadius: '4px', background: i <= minaLineIdx ? accentColor : 'rgba(180,120,0,0.3)', transition: 'all 0.3s' }}
                        />
                      ))}
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.55rem,1.1vw,0.72rem)', color: accentColor, marginLeft: 'auto', opacity: 0.8 }}>
                      {isLastMinaLine ? 'Click to see results →' : 'Click to continue ▶'}
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.18 }}
                style={{ flexShrink: 0, alignSelf: 'flex-end' }}
              >
                <motion.img
                  src={ASSETS.minaMascot} alt="Mina"
                  style={{ width: 'clamp(90px,20vw,220px)', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.2))', display: 'block' }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ position: 'absolute', bottom: 'clamp(16px,3.5vh,32px)', right: 'clamp(16px,3vw,28px)', zIndex: 10, opacity: 0.75, color: accentColor }}
          onClick={e => { e.stopPropagation(); setPhase('feedback'); }}
        >
          Skip →
        </button>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // NORMAL FEEDBACK SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  const sectionAccent = congratsData?.accentColor ?? 'var(--pink-btn)';

  return (
    <div className="scene" style={{ overflowY: 'auto', padding: 'clamp(38px,8vh,68px) clamp(12px,3vw,28px) clamp(14px,3.5vh,36px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bunting" />
      <motion.div className="panel"
        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        style={{ width: 'clamp(320px,70vw,680px)', maxHeight: '82vh', overflowY: 'auto', border: `3px solid ${sectionAccent}`, position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: 'clamp(2.8rem,6.5vw,5.5rem)', marginBottom: '5px' }}>{passed ? '🎊' : '😊'}</div>
          <div className="panel-title" style={{ color: sectionAccent }}>{passed ? 'Stage Complete!' : "Don't Give Up!"}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.6vw,1rem)', color: 'var(--text-muted)', marginTop: '3px' }}>
            {store.emoji} {store.name} — {store.npcName}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div className="score-badge" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', padding: '10px 28px' }}>⭐ {score} / 5</div>
        </div>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '14px' }}>
          {[1,2,3,4,5].map(n => (
            <motion.span key={n}
              initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: n * 0.1, type: 'spring', stiffness: 300 }}
              style={{ fontSize: 'clamp(1.3rem,3vw,2.1rem)' }}>
              {n <= score ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <div style={{ background: passed ? '#E8F5E9' : '#FFF3E0', border: `2px solid ${passed ? 'var(--success)' : 'var(--golden)'}`, borderRadius: '12px', padding: '10px 14px', marginBottom: '12px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.85rem,1.7vw,1.05rem)', color: 'var(--text-dark)', textAlign: 'center' }}>
          {passed
            ? `${store.npcName} is proud of you! You passed with ${score}/5. Keep going! 🌟`
            : `${store.npcName} says: "You got ${score}/5. You need 4 to pass. Review the lesson and try the next set!"`}
        </div>

        {TIPS[store.id] && (
          <div style={{ background: 'rgba(245,197,24,0.12)', border: '1.5px solid var(--golden)', borderRadius: '10px', padding: '9px 13px', marginBottom: '14px' }}>
            <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 'clamp(0.8rem,1.6vw,1rem)', color: 'var(--olive-brown)', marginBottom: '3px' }}>
              💡 Grammar Tip — {store.description}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.5vw,0.95rem)', color: 'var(--text-dark)' }}>
              {TIPS[store.id]}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 'clamp(0.8rem,1.6vw,1rem)', color: 'var(--olive-brown)', marginBottom: '6px' }}>
            {section.name} Progress:
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {section.stores.map((st, i) => {
              const done = prog[st.id]?.completed;
              const isCurr = st.id === store.id;
              return (
                <div key={i} style={{
                  flex: 1, borderRadius: '8px', padding: '5px', textAlign: 'center',
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(0.72rem,1.3vw,0.88rem)',
                  background: done ? 'var(--success)' : isCurr ? 'var(--golden)' : 'var(--surface)',
                  border: `2px solid ${done ? 'var(--success)' : isCurr ? 'var(--olive-brown)' : 'rgba(122,107,61,0.3)'}`,
                  color: done ? 'white' : 'var(--text-dark)',
                }}>
                  {done ? '✓' : isCurr ? '◉' : '○'} {st.npcName}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {passed ? (
            <>
              <button className="btn btn-ghost btn-sm"
                onClick={() => goToScene(isAdvancedMode ? 'ADVANCED_SECTION_VIEW' : 'SECTION_VIEW')}>
                ← Section
              </button>
              <motion.button className="btn btn-success"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={handleContinue}>
                {getContinueLabel()}
              </motion.button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm"
                onClick={() => goToScene(isAdvancedMode ? 'ADVANCED_SECTION_VIEW' : 'GRAMMAR_LESSON')}>
                {isAdvancedMode ? '← Section' : '📚 Review Lesson'}
              </button>
              <motion.button className="btn btn-pink btn-sm"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setQuestionSet('B'); goToScene(isAdvancedMode ? 'ADVANCED_STORE' : 'STORE'); }}>
                🔄 Try New Questions
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}