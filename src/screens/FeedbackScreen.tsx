import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { SECTION_D } from '../data/sectionD';
import { ASSETS } from '../data/assets';

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
    currentSection, currentStoreIndex, sectionProgress, goToScene,
    setStoreIndex, setQuestionSet, setSection, isAdvancedMode,
  } = useGameStore();

  const ALL_SECTIONS = [...SECTIONS, SECTION_D];
  const section = ALL_SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;

  const store = section.stores[currentStoreIndex];
  if (!store) return null;

  const prog = sectionProgress[currentSection!] || {};
  const score = prog[store.id]?.bestScore || 0;
  const passed = score >= 4;
  const nextStoreIndex = currentStoreIndex + 1;
  const hasNextStore = nextStoreIndex < section.stores.length;
  const isSectionComplete = passed && !hasNextStore;
  const isSectionD = currentSection === 'D';

  const dProgress = sectionProgress['D'] || {};
  const dFullyDone = SECTION_D.stores.every(st => dProgress[st.id]?.completed);

  const justCompletedC =
    currentSection === 'C' && isSectionComplete && !dFullyDone &&
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

  const handleContinue = () => {
    if (hasNextStore) {
      setStoreIndex(nextStoreIndex);
      setQuestionSet('A');
      goToScene(isAdvancedMode ? 'ADVANCED_STORE' : 'STORE');
      return;
    }
    if (isSectionD) { goToScene('SCORE_SUMMARY'); return; }
    if (justCompletedC) { setSection('D' as any); goToScene('SECTION_D_VIDEO'); return; }
    goToScene('MAP');
  };

  const getContinueLabel = () => {
    if (hasNextStore) return `Next: ${section.stores[nextStoreIndex].name} →`;
    if (isSectionD) return '🎓 See Final Score';
    if (justCompletedC) return '🎉 Enter Section D!';
    return '🗺 Back to Map';
  };

  if (phase === 'congrats' && congratsData) {
    const { accentColor, scallop, bgGradient } = congratsData;
    return (
      <div
        className="scene"
        style={{ background: bgGradient, cursor: 'pointer', overflow: 'hidden' }}
        onClick={advanceMina}
      >
        <div className="bunting" />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(60px,10vh,80px) clamp(14px,4vw,48px) 20px',
          zIndex: 10,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            style={{
              display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px,3vw,28px)',
              width: '100%', maxWidth: '680px',
              /* Stack vertically on narrow screens */
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 'min(200px, 100%)' }}>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(1.3rem,3.5vw,2.4rem)',
                color: accentColor, textShadow: '2px 3px 0 rgba(0,0,0,0.12)',
                marginBottom: '6px', fontWeight: 900,
              }}>
                {congratsData.subline}
              </div>

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
                style={{ width: 'clamp(80px,18vw,200px)', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.2))', display: 'block' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </motion.div>
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

  // Normal feedback screen
  const sectionAccent = congratsData?.accentColor ?? 'var(--pink-btn)';

  return (
    <div className="scene" style={{ overflowY: 'auto', padding: 'clamp(38px,8vh,68px) clamp(10px,3vw,24px) clamp(14px,3.5vh,36px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bunting" />
      <motion.div className="panel"
        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        style={{
          /* Fixed: was clamp(320px,70vw,680px) — 320px min-width can overflow on 320px phones */
          width: 'clamp(290px,90vw,660px)',
          maxHeight: '82vh', overflowY: 'auto',
          border: `3px solid ${sectionAccent}`, position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', marginBottom: '5px' }}>{passed ? '🎊' : '😊'}</div>
          <div className="panel-title" style={{ color: sectionAccent }}>{passed ? 'Stage Complete!' : "Don't Give Up!"}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.6vw,1rem)', color: 'var(--text-muted)', marginTop: '3px' }}>
            {store.emoji} {store.name} — {store.npcName}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div className="score-badge" style={{ fontSize: 'clamp(1rem,2.2vw,1.4rem)', padding: '10px 24px' }}>⭐ {score} / 5</div>
        </div>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '12px' }}>
          {[1,2,3,4,5].map(n => (
            <motion.span key={n}
              initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: n * 0.1, type: 'spring', stiffness: 300 }}
              style={{ fontSize: 'clamp(1.2rem,2.8vw,2rem)' }}>
              {n <= score ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <div style={{ background: passed ? '#E8F5E9' : '#FFF3E0', border: `2px solid ${passed ? 'var(--success)' : 'var(--golden)'}`, borderRadius: '12px', padding: '10px 14px', marginBottom: '12px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.6vw,1rem)', color: 'var(--text-dark)', textAlign: 'center' }}>
          {passed
            ? `${store.npcName} is proud of you! You passed with ${score}/5. Keep going! 🌟`
            : `${store.npcName} says: "You got ${score}/5. You need 4 to pass. Review the lesson and try the next set!"`}
        </div>

        {TIPS[store.id] && (
          <div style={{ background: 'rgba(245,197,24,0.12)', border: '1.5px solid var(--golden)', borderRadius: '10px', padding: '9px 13px', marginBottom: '12px' }}>
            <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 'clamp(0.78rem,1.5vw,0.95rem)', color: 'var(--olive-brown)', marginBottom: '3px' }}>
              💡 Grammar Tip — {store.description}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.75rem,1.4vw,0.92rem)', color: 'var(--text-dark)' }}>
              {TIPS[store.id]}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 'clamp(0.78rem,1.5vw,0.95rem)', color: 'var(--olive-brown)', marginBottom: '6px' }}>
            {section.name} Progress:
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
            {section.stores.map((st, i) => {
              const done = prog[st.id]?.completed;
              const isCurr = st.id === store.id;
              return (
                <div key={i} style={{
                  flex: '1 1 auto', borderRadius: '8px', padding: '5px', textAlign: 'center',
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(0.68rem,1.2vw,0.85rem)',
                  background: done ? 'var(--success)' : isCurr ? 'var(--golden)' : 'var(--surface)',
                  border: `2px solid ${done ? 'var(--success)' : isCurr ? 'var(--olive-brown)' : 'rgba(122,107,61,0.3)'}`,
                  color: done ? 'white' : 'var(--text-dark)',
                  minWidth: '80px',
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