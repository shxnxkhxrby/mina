import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { SECTION_D } from '../data/sectionD';
import { STORE_GREETINGS } from '../data/dialogues';

const ALL_SECTIONS = [...SECTIONS, SECTION_D];
import { getLevelBgCandidates, getNpcCandidates, ASSETS } from '../data/assets';
import { getLevelTheme } from '../data/levelThemes';

type Phase = 'greeting' | 'intro' | 'question' | 'answered' | 'done' | 'mina_closing';

const MINA_LINES = [
  "Congratulations! 🎉 You have completed learning the three major grammar areas: subject-verb agreement, prepositions of time and manner, and perfect tenses. That is not a small achievement—it’s a big step forward in your journey as a learner.",
  "Throughout your adventure, you explored different challenges, made careful choices, and applied important grammar rules in real situations. You didn't just answer questions — you understood how grammar works and how it brings clarity and meaning to communication.",
  "You showed discipline in following rules, creativity in expressing ideas, and unity in connecting different concepts together. These are the same qualities that make both great performers and great communicators.",
  "Take a moment to be proud of what you've accomplished today. Every correct answer, every mistake you learned from, and every concept you mastered has helped you grow stronger in grammar.",
  "But remember—this achievement is only the beginning. There is still more to discover, more to practice, and more to master. Each new lesson will build on what you’ve learned and take you even further.",
  "If you're ready for a greater challenge, you can try Mastery Checkpoint and test your skills at the higher level. It will push you to think deeper and apply everything you've learned in more complex situations.",
  "Keep going, keep learning, and keep challenging yourself. Your grammar adventure doesn't end here — it's just getting started! I'll see you in your next adventure! ✨"
];

const MINA_CLOSING_AUDIO = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563624/29_ehqqkk.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563624/30_rjo7it.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/31_ytdesq.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/32_jeswzg.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/33_evwij9.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563626/34_r6qfin.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563657/35_qtd4eo.m4a',
];

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

const SCALLOP_PATH = Array.from({ length: 60 }, (_, i) => `M${i * 20},24 Q${i * 20 + 10},0 ${i * 20 + 20},24`).join(' ');

function ScallopedBubble({ children, color = '#F5C84A' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={SCALLOP_PATH} fill={color} />
        </svg>
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #FFF8D6 0%, #FFEEA0 100%)',
        border: `4px solid ${color}`, borderTop: 'none',
        borderRadius: '0 0 20px 20px',
        padding: 'clamp(14px,3vh,22px) clamp(16px,3vw,28px) clamp(14px,3vh,22px)',
        position: 'relative', boxShadow: '0 6px 28px rgba(180,120,0,0.18)', zIndex: 1,
      }}>
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={SCALLOP_PATH} fill={color} />
        </svg>
      </div>
    </div>
  );
}

function SpeakerBadge({ label, gradStart, gradEnd }: { label: string; gradStart: string; gradEnd: string }) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.08, type: 'spring', stiffness: 300 }}
      style={{
        display: 'inline-block',
        background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
        border: '3px solid #FFD700', borderRadius: '10px',
        padding: '4px 18px 4px 14px',
        position: 'relative', zIndex: 3,
        boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
        clipPath: 'polygon(8px 0%, 100% 0%, 100% 100%, 8px 100%, 0% 50%)',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-title)', fontSize: 'clamp(0.88rem,1.9vw,1.2rem)',
        color: 'white', fontWeight: 900, letterSpacing: '2px',
        textShadow: '1px 2px 0 rgba(0,0,0,0.3)',
      }}>{label}</span>
    </motion.div>
  );
}

const PARTICLES = [
  { delay: 0,   x: '8%',  size: 10 },
  { delay: 0.8, x: '18%', size: 7  },
  { delay: 1.5, x: '32%', size: 12 },
  { delay: 0.3, x: '48%', size: 8  },
  { delay: 2.1, x: '62%', size: 6  },
  { delay: 1.2, x: '75%', size: 10 },
  { delay: 0.6, x: '88%', size: 7  },
];

const THEME_BADGE: Record<number, [string, string]> = {
  0: ['#FF7A1A', '#E85D10'],
  1: ['#3A9E5C', '#217A42'],
  2: ['#5B6FD4', '#3A4DB8'],
};

export default function StoreScreen() {
  const {
    currentSection, currentStoreIndex, currentQuestionSet,
    completeStore, addScore, goToScene, setQuestionSet,
  } = useGameStore();

  const section = ALL_SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;
  const store = section.stores[currentStoreIndex];
  if (!store) return null;
  const qSet = store.questionSets.find(qs => qs.id === currentQuestionSet)
    ?? store.questionSets[0];
  if (!qSet) return null;

  const greetings = STORE_GREETINGS[store.id]?.lines || [];
  const theme = getLevelTheme(currentStoreIndex);
  const [badgeGradStart, badgeGradEnd] = THEME_BADGE[currentStoreIndex] ?? THEME_BADGE[0];

  const [phase, setPhase] = useState<Phase>(greetings.length > 0 ? 'greeting' : 'intro');
  const [greetIdx, setGreetIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // scoreRef avoids stale-closure bugs when calling completeStore/addScore at finish
  const scoreRef = useRef(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; correctAns: string }[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [minaLineIdx, setMinaLineIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bgCandidates = getLevelBgCandidates(section.id, currentStoreIndex);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);
  const npcCandidates = getNpcCandidates(section.id, currentStoreIndex);
  const [npcIndex, setNpcIndex] = useState(0);
  const [npcFailed, setNpcFailed] = useState(false);

  const secBg: Record<string, string> = {
    A: 'linear-gradient(160deg,#FFF3D0 0%,#FFE090 50%,#F5C84A 100%)',
    B: 'linear-gradient(160deg,#D4EED0 0%,#A8D8A0 50%,#7CBB70 100%)',
    C: 'linear-gradient(160deg,#D0E8FF 0%,#A0C8F0 50%,#70A8DC 100%)',
    D: 'linear-gradient(160deg,#F0D0FF 0%,#E0A0F0 50%,#B060D0 100%)',
  };

  const currentQ = qSet.questions[qIdx];
  const totalQ = qSet.questions.length;
  const currentGreet = greetings[greetIdx];

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Mina closing audio
  useEffect(() => {
    if (phase !== 'mina_closing') return;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const isLastSectionDStore =
    currentSection === 'D' &&
    currentStoreIndex === section.stores.length - 1;

  const advanceGreeting = () => {
    if (greetIdx + 1 < greetings.length) setGreetIdx(i => i + 1);
    else setPhase('intro');
  };

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = currentQ.choices[i].isCorrect;
    setIsCorrect(correct);
    setFeedbackText(correct ? currentQ.feedbackCorrect : currentQ.feedbackWrong);
    if (correct) {
      scoreRef.current += 1;
      setScoreDisplay(scoreRef.current);
    }
    const correctChoice = currentQ.choices.find(c => c.isCorrect)!;
    setResults(r => [...r, { correct, correctAns: correctChoice.text }]);
    setPhase('answered');
  };

  const handleNext = () => {
    if (qIdx + 1 >= totalQ) { setPhase('done'); return; }
    setQIdx(i => i + 1);
    setSelected(null); setFeedbackText('');
    setIsCorrect(false);
    setPhase('question');
  };

  const handleFinish = () => {
    completeStore(section.id, store.id, scoreRef.current);
    addScore(scoreRef.current, totalQ);
    if (isLastSectionDStore) {
      setMinaLineIdx(0);
      setPhase('mina_closing');
    } else {
      goToScene('FEEDBACK');
    }
  };

  const handleMinaNext = () => {
    stopAudio();
    if (minaLineIdx + 1 < MINA_LINES.length) {
      setMinaLineIdx(l => l + 1);
    } else {
      goToScene('SCORE_SUMMARY');
    }
  };

  const handleRetry = () => {
    const next = currentQuestionSet === 'A' ? 'B' : 'A';
    setQuestionSet(next);
    setQIdx(0); setSelected(null);
    scoreRef.current = 0; setScoreDisplay(0);
    setFeedbackText(''); setResults([]);
    setIsCorrect(false);
    setGreetIdx(0);
    setPhase(greetings.length > 0 ? 'greeting' : 'intro');
  };

  const choiceLabels = ['A', 'B', 'C', 'D'];

  const renderNpcSprite = () => (
    <motion.div
      style={{
        position: 'absolute', left: 'clamp(-20px,-1vw,0px)', bottom: 0,
        zIndex: 10, pointerEvents: 'none',
      }}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 }}
    >
      {npcFailed ? (
        <motion.span
          style={{
            display: 'block',
            fontSize: 'clamp(60px,14vw,160px)', lineHeight: 1,
            filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.5))',
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >{store.emoji}</motion.span>
      ) : (
        <motion.img
          src={npcCandidates[npcIndex]}
          alt={store.npcName}
          onError={() => {
            if (npcIndex + 1 < npcCandidates.length) setNpcIndex(n => n + 1);
            else setNpcFailed(true);
          }}
          style={{
            width: 'clamp(80px,22vw,260px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.45))',
            display: 'block',
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div style={{
        textAlign: 'center', marginTop: '4px', marginBottom: '8px',
        fontFamily: 'var(--font-char)', fontWeight: 700,
        fontSize: 'clamp(0.75rem,1.3vw,0.92rem)',
        color: 'white',
        background: 'rgba(0,0,0,0.55)',
        border: `1.5px solid ${theme.qBorder}`,
        padding: '2px 12px', borderRadius: '50px',
        display: 'inline-block',
        position: 'relative', left: '50%', transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}>{store.npcName}</div>
    </motion.div>
  );

  const renderDialoguePanel = (children: React.ReactNode, phaseKey: string | number) => (
    <div style={{
      position: 'absolute',
      top: 'clamp(64px,13vh,110px)',
      right: 'clamp(14px,2.5vw,28px)',
      left: 'clamp(100px,24vw,360px)',
      zIndex: 20,
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseKey}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderChoices = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px,1vh,9px)', marginTop: '10px' }}>
      {currentQ.choices.map((choice, i) => {
        const isCorrectChoice = choice.isCorrect;
        let bg = 'rgba(255,255,255,0.9)';
        let border = 'rgba(180,140,0,0.35)';
        let badgeBg = badgeGradStart;
        let opacity = 1;
        if (selected !== null) {
          if (isCorrectChoice) { bg = '#D4EDDA'; border = '#28A745'; badgeBg = '#28A745'; }
          else if (i === selected) { bg = '#F8D7DA'; border = '#DC3545'; badgeBg = '#DC3545'; }
          else { opacity = 0.4; }
        }
        return (
          <motion.button key={i}
            disabled={selected !== null}
            onClick={() => handleAnswer(i)}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity, x: 0, transition: { delay: i * 0.07 } }}
            whileHover={selected === null ? { x: -3, scale: 1.015 } : {}}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 'clamp(8px,1.5vw,12px)',
              background: bg, border: `2px solid ${border}`,
              borderRadius: '11px',
              padding: 'clamp(10px,1.8vh,15px) clamp(12px,2.2vw,20px)',
              cursor: selected !== null ? 'default' : 'pointer',
              textAlign: 'left', width: '100%',
              transition: 'background 0.2s, border-color 0.2s',
              boxShadow: selected === null ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 'clamp(22px,3vw,30px)', height: 'clamp(22px,3vw,30px)',
              background: badgeBg, color: 'white',
              borderRadius: '7px',
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.75rem,1.3vw,0.92rem)',
              flexShrink: 0, transition: 'background 0.2s',
            }}>{choiceLabels[i]}</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.85rem,1.7vw,1.05rem)',
              color: '#2A1800', lineHeight: 1.4,
            }}>
              {choice.text.replace(/^[A-D]\.\s*/, '')}
            </span>
          </motion.button>
        );
      })}
    </div>
  );

  const renderProgressStrip = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: totalQ }).map((_, i) => (
          <div key={i} style={{
            width: 'clamp(6px,1.2vw,10px)', height: 'clamp(6px,1.2vw,10px)',
            borderRadius: '50%',
            background: i < qIdx ? '#28A745' : i === qIdx ? badgeGradStart : 'rgba(180,140,0,0.25)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 'clamp(0.68rem,1.2vw,0.82rem)',
        color: '#8A6000', marginLeft: 'auto',
      }}>Q {qIdx + 1}/{totalQ} · ⭐ {scoreDisplay}</div>
    </div>
  );

  return (
    <div className="scene" style={{
      position: 'relative',
      background: bgFailed ? (secBg[section.id] || secBg.A) : undefined,
      overflow: 'hidden',
    }}>

      {/* Background */}
      {!bgFailed && (
        <img
          key={`${currentStoreIndex}-${bgIndex}`}
          src={bgCandidates[bgIndex]}
          alt={`Level ${currentStoreIndex + 1}`}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            filter: 'blur(6px) brightness(0.55)',
            transform: 'scale(1.08)',
          }}
          onError={() => {
            if (bgIndex < bgCandidates.length - 1) setBgIndex(b => b + 1);
            else setBgFailed(true);
          }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,248,220,0.78) 0%, rgba(30,18,0,0.32) 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      <div className="bunting" style={{ zIndex: 5 }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 'clamp(38px,7vh,60px)', left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-title)', fontSize: 'clamp(0.95rem,1.9vw,1.3rem)',
        color: 'white', background: 'rgba(0,0,0,0.55)',
        padding: '4px 18px', borderRadius: '50px',
        border: `2px solid ${theme.qBorder}`,
        whiteSpace: 'nowrap', zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
      }}>
        {store.emoji} {store.name} · {store.npcName}
      </div>

      {/* Back button */}
      <button className="btn btn-ghost btn-sm"
        style={{
          position: 'absolute', top: 'clamp(38px,7vh,60px)', left: 'clamp(10px,2vw,18px)',
          zIndex: 100, opacity: 0.95,
          fontSize: 'clamp(0.7rem,1.4vw,0.9rem)', fontWeight: 700,
          background: 'rgba(0,0,0,0.45)',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '20px', color: 'white', padding: '4px 14px',
        }}
        onClick={e => { e.stopPropagation(); goToScene('SECTION_VIEW'); }}>← Back</button>

      {/* NPC sprite — hidden during Mina closing */}
      {phase !== 'mina_closing' && renderNpcSprite()}

      {/* GREETING PHASE */}
      {phase === 'greeting' && (
        <div style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 15 }} onClick={advanceGreeting}>
          {renderDialoguePanel(
            <>
              <SpeakerBadge label={currentGreet?.speaker || store.npcName} gradStart={badgeGradStart} gradEnd={badgeGradEnd} />
              <ScallopedBubble>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(1.05rem,2.5vw,1.55rem)',
                  color: '#2A1800', lineHeight: 1.55, fontWeight: 800,
                }}>
                  {currentGreet?.text}
                  <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '3px', color: badgeGradStart }}>▌</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {greetings.map((_, i) => (
                      <motion.div key={i} animate={{ scale: i === greetIdx ? 1.3 : 1 }}
                        style={{
                          width: i === greetIdx ? '20px' : '7px', height: '7px', borderRadius: '4px',
                          background: i <= greetIdx ? badgeGradStart : 'rgba(180,120,0,0.3)',
                          transition: 'all 0.3s',
                        }} />
                    ))}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(0.52rem,1vw,0.7rem)',
                    color: '#8A6000', marginLeft: 'auto',
                  }}>
                    {greetIdx + 1 < greetings.length ? 'Click to continue ▶' : 'Click to start →'}
                  </div>
                </div>
              </ScallopedBubble>
            </>,
            `greet-${greetIdx}`
          )}
        </div>
      )}

      {/* INTRO PHASE */}
      {phase === 'intro' && renderDialoguePanel(
        <>
          <SpeakerBadge label={store.npcName} gradStart={badgeGradStart} gradEnd={badgeGradEnd} />
          <ScallopedBubble>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.88rem,2vw,1.2rem)',
              color: '#2A1800', lineHeight: 1.55, fontWeight: 800, marginBottom: '12px',
            }}>
              Ready for <strong style={{ color: badgeGradStart }}>{totalQ} questions</strong> about <strong>{store.description}</strong>?
              <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '3px', color: badgeGradStart }}>▌</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <motion.button className="btn btn-primary btn-sm"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('question')}>
                Let's Start! 🎉
              </motion.button>
            </div>
          </ScallopedBubble>
        </>,
        'intro'
      )}

      {/* QUESTION / ANSWERED PHASE */}
      {(phase === 'question' || phase === 'answered') && renderDialoguePanel(
        <>
          <SpeakerBadge label={store.npcName} gradStart={badgeGradStart} gradEnd={badgeGradEnd} />
          <ScallopedBubble>
            {currentQ.npcDialogueBefore && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.88rem,1.7vw,1.08rem)',
                color: '#5A3E00', lineHeight: 1.5,
                marginBottom: '8px', fontStyle: 'italic',
              }}>{currentQ.npcDialogueBefore}</div>
            )}
            {currentQ.questionText && currentQ.questionText !== currentQ.npcDialogueBefore && (
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1rem,2.1vw,1.3rem)',
                color: '#2A1800', fontWeight: 800, lineHeight: 1.4,
                marginBottom: '6px',
              }}>
                {currentQ.questionText}
                <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '3px', color: badgeGradStart }}>▌</span>
              </div>
            )}
            {renderChoices()}
            {renderProgressStrip()}
          </ScallopedBubble>
        </>,
        qIdx
      )}

      {/* ANSWER RESULT OVERLAY */}
      <AnimatePresence>
        {phase === 'answered' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)', zIndex: 40,
            }}
          >
            <motion.div
              initial={{ scale: 0.72, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.72, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: isCorrect
                  ? 'linear-gradient(180deg,#E8F8EE 0%,#D4EDDA 100%)'
                  : 'linear-gradient(180deg,#FFF0F0 0%,#F8D7DA 100%)',
                border: `4px solid ${isCorrect ? '#28A745' : '#DC3545'}`,
                borderRadius: '22px',
                padding: 'clamp(22px,4.5vh,42px) clamp(26px,5vw,56px)',
                width: 'clamp(270px,52vw,500px)', maxWidth: '90vw',
                textAlign: 'center',
                boxShadow: `0 14px 52px rgba(0,0,0,0.5), 0 0 0 6px ${isCorrect ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)'}`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', overflow: 'hidden' }}>
                <svg viewBox="0 0 400 12" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path d={Array.from({ length: 20 }, (_, i) => `M${i * 20},12 Q${i * 20 + 10},0 ${i * 20 + 20},12`).join(' ')}
                    fill={isCorrect ? '#28A745' : '#DC3545'} />
                </svg>
              </div>

              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                style={{ fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', marginBottom: '8px', lineHeight: 1 }}
              >
                {isCorrect ? '✅' : '❌'}
              </motion.div>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.1rem,2.5vw,1.8rem)',
                color: isCorrect ? '#155724' : '#721c24', marginBottom: '10px',
              }}>
                {isCorrect ? 'Correct! 🎉' : 'Wrong...'}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.68rem,1.4vw,0.88rem)',
                color: isCorrect ? '#1a5c2e' : '#7a2030',
                lineHeight: 1.65, marginBottom: '22px',
                background: isCorrect ? 'rgba(40,167,69,0.08)' : 'rgba(220,53,69,0.08)',
                borderRadius: '12px', padding: '10px 14px',
              }}>{feedbackText}</div>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                style={{ minWidth: '130px' }}
              >
                {qIdx + 1 >= totalQ ? 'Finish →' : 'Next →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DONE OVERLAY */}
      {phase === 'done' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', padding: 'clamp(16px,4vw,40px)',
          overflowY: 'auto', zIndex: 50,
        }}>
          <motion.div
            className="panel"
            initial={{ scale: 0.82, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 'clamp(280px,52vw,520px)', maxWidth: '94vw',
              maxHeight: '88vh', overflowY: 'auto',
              textAlign: 'center', margin: '0 auto',
              border: `3px solid ${badgeGradStart}`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12px', overflow: 'hidden' }}>
              <svg viewBox="0 0 520 14" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <path d={Array.from({ length: 26 }, (_, i) => `M${i * 20},14 Q${i * 20 + 10},0 ${i * 20 + 20},14`).join(' ')} fill={badgeGradStart} />
              </svg>
            </div>

            <div style={{ paddingTop: '16px' }}>
              <div style={{ fontSize: 'clamp(2.4rem,5.5vw,3.8rem)', marginBottom: '6px' }}>
                {scoreRef.current >= 4 ? '🎉' : '😊'}
              </div>
              <div className="panel-title" style={{ marginBottom: '8px' }}>
                {scoreRef.current >= 4 ? 'Excellent Work!' : 'Good Try!'}
              </div>
              <div className="score-badge" style={{ margin: '0 auto 14px' }}>
                Score: {scoreRef.current} / {totalQ}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <motion.span key={n}
                    initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: n * 0.1, type: 'spring', stiffness: 300 }}
                    style={{ fontSize: 'clamp(1.3rem,3.2vw,2.2rem)' }}>
                    {n <= scoreRef.current ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>

              <div style={{
                background: 'var(--surface)', borderRadius: '12px',
                padding: 'clamp(8px,1.5vh,12px) clamp(10px,2vw,14px)',
                marginBottom: '14px', textAlign: 'left',
              }}>
                <div style={{
                  fontFamily: 'var(--font-char)', fontWeight: 700,
                  fontSize: 'clamp(0.65rem,1.3vw,0.82rem)',
                  color: 'var(--olive-brown)', marginBottom: '8px',
                }}>Question Results:</div>
                {results.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: 'clamp(4px,0.8vh,6px) 0',
                    borderBottom: i < results.length - 1 ? '1px solid rgba(122,107,61,0.12)' : 'none',
                  }}>
                    <span style={{ fontSize: 'clamp(0.85rem,1.6vw,1.05rem)', flexShrink: 0 }}>
                      {r.correct ? '✅' : '❌'}
                    </span>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.6rem,1.1vw,0.74rem)', color: 'var(--dark-brown)' }}>
                      <strong>Q{i + 1}</strong>
                      {!r.correct && (
                        <span style={{ color: 'var(--forest)', marginLeft: '6px' }}>
                          → {r.correctAns.replace(/^[A-D]\.\s*/, '')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(0.65rem,1.3vw,0.82rem)',
                color: '#7A6355', marginBottom: '16px', lineHeight: 1.5,
              }}>
                {scoreRef.current >= 4
                  ? `${store.npcName} is impressed! You may proceed! 🌟`
                  : `${store.npcName} says: "Let's try again with new questions!" 💪`}
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {scoreRef.current >= 4 ? (
                  <motion.button className="btn btn-success"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={handleFinish}>✅ Continue →</motion.button>
                ) : (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => goToScene('GRAMMAR_LESSON')}>
                      📚 Review Lesson
                    </button>
                    <motion.button className="btn btn-primary btn-sm"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={handleRetry}>🔄 Try Again</motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MINA CLOSING SPEECH */}
      {phase === 'mina_closing' && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            padding: 'clamp(60px,10vh,80px) clamp(20px,5vw,60px) 20px',
            zIndex: 50,
            cursor: 'pointer',
          }}
          onClick={handleMinaNext}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`mina-${minaLineIdx}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', width: '100%', maxWidth: '580px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <img
                  src={(ASSETS as Record<string, string>).minaMascot ?? ''}
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

              <div style={{ alignSelf: 'flex-start', marginBottom: '4px' }}>
                <SpeakerBadge label="MINA" gradStart="#8B1A8B" gradEnd="#5B0A6B" />
              </div>

              <ScallopedBubble color="#C060D0">
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.72rem,1.5vw,0.95rem)',
                  color: '#2A1800',
                  lineHeight: 1.7, marginBottom: '20px',
                }}>
                  {MINA_LINES[minaLineIdx]}
                  <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '3px', color: '#8B1A8B' }}>▌</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {MINA_LINES.map((_, i) => (
                      <motion.div key={i} animate={{ scale: i === minaLineIdx ? 1.3 : 1 }}
                        style={{
                          width: i === minaLineIdx ? '20px' : '7px', height: '7px', borderRadius: '4px',
                          background: i <= minaLineIdx ? '#8B1A8B' : 'rgba(139,26,139,0.25)',
                          transition: 'all 0.3s',
                        }} />
                    ))}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(0.52rem,1vw,0.7rem)',
                    color: '#8A6000', marginLeft: 'auto',
                  }}>
                    {minaLineIdx + 1 < MINA_LINES.length ? 'Click to continue ▶' : 'Click to finish →'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button
                    className="btn btn-primary btn-sm"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={e => { e.stopPropagation(); handleMinaNext(); }}
                    style={{ fontSize: 'clamp(0.7rem,1.4vw,0.9rem)' }}
                  >
                    {minaLineIdx + 1 < MINA_LINES.length ? 'Continue ➜' : '🎓 See Results'}
                  </motion.button>
                </div>
              </ScallopedBubble>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}