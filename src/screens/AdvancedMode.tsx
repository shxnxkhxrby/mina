import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import type { Question } from '../types';
import { getLevelTheme } from '../data/levelThemes';
import { getNpcCandidates } from '../data/assets';

// Sprite image for each store: /imgs/levels/{sectionId}/level{n}.png
function getNpcSpriteSrc(sectionId: string, storeIndex: number): string {
  return `/imgs/levels/${sectionId}/level${storeIndex + 1}.png`;
}

// ─── Flatten all questions from all sections/stores (Set A only) ────────────
interface FlatQuestion extends Question {
  sectionId: string;
  sectionName: string;
  storeId: string;
  storeName: string;
  storeIndex: number;
  npcName: string;
  storeEmoji: string;
  grammarTopic: string;
  sectionColor: string;
}

function buildAllQuestions(): FlatQuestion[] {
  const all: FlatQuestion[] = [];
  for (const section of SECTIONS) {
    for (let si = 0; si < section.stores.length; si++) {
      const store = section.stores[si];
      const setA = store.questionSets.find(qs => qs.id === 'A');
      if (!setA) continue;
      for (const q of setA.questions) {
        all.push({
          ...q,
          sectionId: section.id,
          sectionName: section.name,
          storeId: store.id,
          storeName: store.name,
          storeIndex: si,
          npcName: store.npcName,
          storeEmoji: store.emoji,
          grammarTopic: section.grammarTopic,
          sectionColor: section.color,
        });
      }
    }
  }
  return all;
}

// ─── Compact rule tag per grammar topic ─────────────────────────────────────
const TOPIC_TAG: Record<string, string> = {
  'Perfect Tenses': '⏳ Perfect Tenses',
  'Subject-Verb Agreement': '🔗 SVA',
  'Prepositions of Time and Manner': '📍 Prepositions',
};

// ─── Certificate PNG export ──────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function exportAdvancedCertificate(
  playerName: string,
  correct: number,
  total: number,
  pct: number,
  grade: string,
  dateStr: string,
): Promise<void> {
  const W = 1120, H = 760;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0D0D1A');
  bg.addColorStop(0.5, '#1A1A2E');
  bg.addColorStop(1, '#16213E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#F5C518'; ctx.lineWidth = 8;
  roundRect(ctx, 16, 16, W - 32, H - 32, 26); ctx.stroke();
  ctx.strokeStyle = '#5B6FD4'; ctx.lineWidth = 2;
  roundRect(ctx, 30, 30, W - 60, H - 60, 20); ctx.stroke();

  ctx.fillStyle = 'rgba(91,111,212,0.2)';
  [[55,55],[W-55,55],[55,H-55],[W-55,H-55]].forEach(([cx,cy]) => {
    ctx.save(); ctx.translate(cx as number, cy as number); ctx.rotate(Math.PI/4);
    ctx.fillRect(-8,-8,16,16); ctx.restore();
  });

  const hLine = (y: number) => {
    const g = ctx.createLinearGradient(80,y,W-80,y);
    g.addColorStop(0,'transparent'); g.addColorStop(0.12,'#F5C518');
    g.addColorStop(0.88,'#F5C518'); g.addColorStop(1,'transparent');
    ctx.strokeStyle = g; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80,y); ctx.lineTo(W-80,y); ctx.stroke();
  };
  hLine(140); hLine(H - 140);

  ctx.textAlign = 'center';
  ctx.font = '80px serif';
  ctx.fillText('⚡', W/2, 128);

  ctx.font = 'bold 17px Arial, sans-serif';
  ctx.fillStyle = '#F5C518';
  ctx.fillText('C E R T I F I C A T E   O F   A D V A N C E D   M A S T E R Y', W/2, 175);

  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('This is to certify that', W/2, 218);

  const nameSize = Math.max(36, Math.min(80, Math.floor(1400 / Math.max(playerName.length, 1))));
  ctx.font = `bold ${nameSize}px Georgia, serif`;
  ctx.fillStyle = '#E8547A';
  ctx.fillText(playerName, W/2, 318);

  ctx.font = '18px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('has successfully completed', W/2, 365);
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = '#F5C518';
  ctx.fillText('Minasa: Grammar Quest — Advanced Mode', W/2, 398);

  ctx.font = '15px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Exploring the Minasa Festival in Bustos, Bulacan', W/2, 434);
  ctx.fillText('Perfect Tenses  ·  Subject-Verb Agreement  ·  Prepositions', W/2, 458);

  const bW = 380, bH = 46, bX = (W-bW)/2, bY = 486;
  const badgeGrad = ctx.createLinearGradient(bX,0,bX+bW,0);
  badgeGrad.addColorStop(0,'#3A4DB8'); badgeGrad.addColorStop(1,'#F5C518');
  ctx.fillStyle = badgeGrad;
  roundRect(ctx, bX, bY, bW, bH, 23); ctx.fill();
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText(`⚡  ${correct}/${total}  ·  ${pct}%  ·  ${grade}`, W/2, bY+31);

  ctx.font = '13px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText(`${dateStr}   ·   EL306 Language Learning Materials`, W/2, H - 58);

  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_Advanced_${playerName.replace(/\s+/g,'_')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// ─── Component ───────────────────────────────────────────────────────────────
type Phase = 'menu' | 'quiz' | 'summary';

export default function AdvancedMode() {
  const { goToScene, playerName, addAdvancedScore } = useGameStore();
  const allQuestions = useMemo(buildAllQuestions, []);

  const [phase, setPhase] = useState<Phase>('menu');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [score, setScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; topic: string; qText: string; correctAns: string }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [npcSpriteErrors, setNpcSpriteErrors] = useState<Record<string, boolean>>({});
  const [npcIndexMap, setNpcIndexMap] = useState<Record<string, number>>({});
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const total = allQuestions.length;
  const currentQ = allQuestions[qIdx];

  const sectionColors: Record<string, string> = { A: '#E85D26', B: '#5B7A3D', C: '#1A72B8' };
  const sectionBgs: Record<string, string> = {
    A: 'linear-gradient(160deg,#FFF3D0 0%,#FFE090 50%,#F5C84A 100%)',
    B: 'linear-gradient(160deg,#D4EED0 0%,#A8D8A0 50%,#7CBB70 100%)',
    C: 'linear-gradient(160deg,#D0E8FF 0%,#A0C8F0 50%,#70A8DC 100%)',
  };

  const startQuiz = () => {
    setPhase('quiz');
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setLastAnswerCorrect(false);
    setResults([]);
    setShowFeedback(false);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = currentQ.choices[i].isCorrect;
    setIsCorrect(correct);
    setLastAnswerCorrect(correct);
    setFeedbackText(correct ? currentQ.feedbackCorrect : currentQ.feedbackWrong);
    if (correct) setScore(s => s + 1);
    const correctChoice = currentQ.choices.find(c => c.isCorrect)!;
    setResults(r => [...r, {
      correct,
      topic: currentQ.grammarTopic,
      qText: currentQ.questionText || currentQ.npcDialogueBefore,
      correctAns: correctChoice.text,
    }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (qIdx + 1 >= total) {
      // Bug fix: score state is stale here due to async React batching.
      // Compute final score synchronously using lastAnswerCorrect.
      const finalScore = score + (lastAnswerCorrect ? 1 : 0);
      addAdvancedScore(finalScore, total);
      setPhase('summary');
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
      setShowFeedback(false);
      setLastAnswerCorrect(false);
    }
  };

  const choiceLabels = ['A', 'B', 'C', 'D'];
  const progressPct = total > 0 ? ((qIdx + (selected !== null ? 1 : 0)) / total) * 100 : 0;

  // Group results by topic for summary
  const byTopic = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const r of results) {
      if (!map[r.topic]) map[r.topic] = { correct: 0, total: 0 };
      map[r.topic].total++;
      if (r.correct) map[r.topic].correct++;
    }
    return map;
  }, [results]);

  // ── MENU ──────────────────────────────────────────────────────────────────
  if (phase === 'menu') {
    return (
      <div className="scene" style={{ background: 'linear-gradient(160deg,#0D0D1A 0%,#1A1A2E 40%,#16213E 100%)' }}>
        <div className="bunting" />
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              borderRadius: '50%',
              background: 'white',
              opacity: Math.random() * 0.6 + 0.2,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(50px,10vh,80px) clamp(20px,5vw,60px)',
          zIndex: 5,
        }}>
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            style={{
              width: 'clamp(280px,54vw,560px)',
              textAlign: 'center',
              background: 'rgba(15,15,35,0.92)',
              border: '2px solid rgba(245,197,24,0.5)',
              boxShadow: '0 0 60px rgba(245,197,24,0.15)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', marginBottom: '8px' }}
            >⚡</motion.div>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.3rem,3vw,2rem)',
              color: '#F5C518', marginBottom: '4px',
              textShadow: '0 0 20px rgba(245,197,24,0.4)',
            }}>Advanced Mode</div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(245,197,24,0.15)',
              border: '1px solid rgba(245,197,24,0.4)',
              color: '#F5C518',
              fontFamily: 'var(--font-accent)', fontWeight: 700,
              fontSize: 'clamp(0.55rem,1vw,0.68rem)',
              padding: '3px 14px', borderRadius: '50px',
              letterSpacing: '2px', marginBottom: '16px',
            }}>
              NO GUIDES · NO LESSONS · PURE GRAMMAR
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.66rem,1.4vw,0.84rem)',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7, marginBottom: '18px',
            }}>
              Jump straight into all <strong style={{ color: '#F5C518' }}>{total} questions</strong> across every grammar topic — no instructions, no hints, no guides.
              Your score and progress are tracked <strong style={{ color: '#F5C518' }}>separately</strong> from Story Mode.
            </p>
            {/* Topic breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', textAlign: 'left' }}>
              {SECTIONS.map((sec, i) => {
                const qCount = sec.stores.reduce((n, st) => n + (st.questionSets.find(qs => qs.id === 'A')?.questions.length || 0), 0);
                return (
                  <motion.div key={sec.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${sec.color}44`,
                      borderRadius: '10px', padding: '10px 14px',
                    }}
                  >
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: sec.color, flexShrink: 0,
                      boxShadow: `0 0 8px ${sec.color}88`,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-accent)', fontWeight: 700,
                        fontSize: 'clamp(0.62rem,1.2vw,0.78rem)', color: sec.color,
                      }}>{sec.grammarTopic}</div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.56rem,1vw,0.68rem)',
                        color: 'rgba(255,255,255,0.45)',
                      }}>{sec.stores.map(s => s.name).join(' · ')}</div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-accent)', fontWeight: 700,
                      fontSize: 'clamp(0.7rem,1.3vw,0.85rem)',
                      color: 'rgba(255,255,255,0.5)',
                    }}>{qCount}q</div>
                  </motion.div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <motion.button className="btn btn-ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => goToScene('MAIN_MENU')}
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>
                ← Back
              </motion.button>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245,197,24,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={startQuiz}
                style={{ background: '#F5C518', color: '#1A1A2E', border: 'none', fontWeight: 800 }}
              >
                {playerName ? `Start, ${playerName}! ⚡` : 'Start Now ⚡'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const secId = currentQ.sectionId;
    const bg = sectionBgs[secId] || sectionBgs.A;
    const accentColor = sectionColors[secId] || '#E85D26';

    return (
      <div className="scene" style={{ background: bg }}>
        <div className="bunting" />
        {/* Header strip */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 'clamp(52px,10vh,72px)',
          background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center',
          padding: '0 clamp(12px,3vw,24px)', gap: 'clamp(8px,1.5vw,16px)', zIndex: 10,
        }}>
          <div style={{
            background: accentColor, color: 'white',
            fontFamily: 'var(--font-accent)', fontWeight: 700,
            fontSize: 'clamp(0.52rem,1vw,0.66rem)',
            padding: '3px 10px', borderRadius: '50px',
            letterSpacing: '1px', flexShrink: 0,
          }}>⚡ ADVANCED</div>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.52rem,0.9vw,0.64rem)',
              color: 'rgba(255,255,255,0.9)', marginBottom: '3px',
            }}>
              <span>Q {qIdx + 1} of {total}</span>
              <span>⭐ {score} correct</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
                style={{ height: '100%', background: accentColor, borderRadius: '3px' }}
              />
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.52rem,0.95vw,0.66rem)',
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(0,0,0,0.25)',
            padding: '3px 10px', borderRadius: '50px', flexShrink: 0,
          }}>
            {TOPIC_TAG[currentQ.grammarTopic] || currentQ.grammarTopic}
          </div>
        </div>

        {/* Main content */}
        <div style={{
          position: 'absolute',
          top: 'clamp(52px,10vh,72px)', bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'stretch',
          flexWrap: 'wrap',
          padding: 'clamp(10px,2vh,18px) clamp(14px,3vw,28px) clamp(12px,2.5vh,22px)',
          gap: 'clamp(10px,2vw,20px)', overflowY: 'auto',
        }}>
          {/* Left: NPC */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-end', gap: '6px', flexShrink: 0,
            width: 'clamp(64px,14vw,150px)',
          }}>
            <div style={{
              height: 'clamp(140px,26vh,240px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end',
            }}>
              {npcSpriteErrors[currentQ.storeId] ? (
                <span style={{
                  fontSize: 'clamp(3.5rem,9vw,6rem)', lineHeight: 1,
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                  animation: 'float 3s ease-in-out infinite',
                }}>{currentQ.storeEmoji}</span>
              ) : (
                <img
                  src={getNpcCandidates(currentQ.sectionId, currentQ.storeIndex)[(npcIndexMap[currentQ.storeId] || 0)]}
                  alt={currentQ.npcName}
                  onError={() => {
                    const candidates = getNpcCandidates(currentQ.sectionId, currentQ.storeIndex);
                    const cur = npcIndexMap[currentQ.storeId] || 0;
                    if (cur + 1 < candidates.length) {
                      setNpcIndexMap(prev => ({ ...prev, [currentQ.storeId]: cur + 1 }));
                    } else {
                      setNpcSpriteErrors(prev => ({ ...prev, [currentQ.storeId]: true }));
                    }
                  }}
                  style={{
                    height: '100%', width: 'auto', objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
                    animation: 'float 3s ease-in-out infinite',
                  }}
                />
              )}
            </div>
            <div style={{
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.52rem,1vw,0.66rem)',
              color: 'white', background: 'var(--olive-brown)',
              padding: '2px 10px', borderRadius: '50px',
              textAlign: 'center', whiteSpace: 'nowrap',
            }}>{currentQ.npcName}</div>

            {/* Inline feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: isCorrect ? 'var(--success-light)' : 'var(--error-light)',
                    border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
                    borderRadius: '12px', padding: '8px 10px', width: '100%',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-char)', fontWeight: 700,
                    fontSize: 'clamp(0.55rem,1vw,0.68rem)',
                    color: isCorrect ? '#2e7d32' : '#c62828', marginBottom: '3px',
                  }}>{isCorrect ? '✅ Correct!' : '❌ Wrong'}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.52rem,0.9vw,0.64rem)',
                    color: 'var(--dark-brown)', lineHeight: 1.4,
                  }}>{feedbackText}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <motion.button className="btn btn-primary btn-sm"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                    >
                      {qIdx + 1 >= total ? 'Finish →' : 'Next →'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: question + choices */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(7px,1.4vh,12px)', minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                style={{
                  background: getLevelTheme(currentQ.storeIndex).qBg,
                  border: `2px solid ${getLevelTheme(currentQ.storeIndex).qBorder}`,
                  borderRadius: '16px', padding: '14px 18px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)', position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '20px', left: '-13px', width: 0, height: 0,
                  borderTop: '9px solid transparent', borderBottom: '9px solid transparent',
                  borderRight: `13px solid ${getLevelTheme(currentQ.storeIndex).tailColor}`,
                }} />
                <div style={{ position: 'absolute', top: '22px', left: '-9px', width: 0, height: 0,
                  borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
                  borderRight: `10px solid ${getLevelTheme(currentQ.storeIndex).qBg}`, zIndex: 1,
                }} />
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(0.52rem,0.9vw,0.64rem)',
                  color: accentColor, fontWeight: 700, marginBottom: '6px', letterSpacing: '0.5px',
                }}>
                  {currentQ.storeEmoji} {currentQ.storeName}
                </div>
                {currentQ.npcDialogueBefore && (
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(0.66rem,1.3vw,0.82rem)',
                    color: '#5A4535', marginBottom: '6px', lineHeight: 1.5,
                  }}>{currentQ.npcDialogueBefore}</div>
                )}
                {currentQ.questionText && currentQ.questionText !== currentQ.npcDialogueBefore && (
                  <div style={{
                    fontFamily: 'var(--font-char)', fontWeight: 700,
                    fontSize: 'clamp(0.72rem,1.4vw,0.9rem)', color: 'var(--olive-brown)',
                  }}>{currentQ.questionText}</div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px,1vh,8px)' }}>
              {currentQ.choices.map((choice, i) => {
                let cls = 'choice-bubble';
                if (selected !== null) {
                  if (choice.isCorrect) cls += ' correct';
                  else if (i === selected && !choice.isCorrect) cls += ' wrong';
                  else cls += ' dimmed';
                }
                return (
                  <motion.button key={i} className={cls}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(i)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.07 } }}
                    whileHover={selected === null ? { x: -3, scale: 1.01 } : {}}
                  >
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 'clamp(18px,2.5vw,24px)', height: 'clamp(18px,2.5vw,24px)',
                      background: 'rgba(122,107,61,0.15)', borderRadius: '50%',
                      fontWeight: 700, fontSize: 'clamp(0.58rem,1.05vw,0.74rem)', flexShrink: 0,
                    }}>{choiceLabels[i]}</span>
                    <span style={{ fontSize: 'clamp(0.66rem,1.3vw,0.84rem)' }}>
                      {choice.text.replace(/^[A-D]\.\s*/, '')}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 90 ? { label: 'Outstanding!', emoji: '🏆', color: '#FFD700' }
    : pct >= 75 ? { label: 'Excellent!', emoji: '🌟', color: '#4CAF50' }
    : pct >= 60 ? { label: 'Good Job!', emoji: '👍', color: '#2196F3' }
    : { label: 'Keep Practicing!', emoji: '💪', color: '#FF9800' };

  const today = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await exportAdvancedCertificate(playerName || 'Student', score, total, pct, grade.label.replace('!',''), today);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = certRef.current; if (!el) return;
    const win = window.open('', '_blank'); if (!win) return;
    win.document.write(`<html><head><title>Advanced Certificate — ${playerName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;700&display=swap" rel="stylesheet"/>
      <style>@media print{@page{size:landscape;margin:0.4in}}body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0D0D1A}</style>
    </head><body>${el.outerHTML}</body></html>`);
    win.document.close(); win.print();
  };

  return (
    <div className="scene" style={{ background: 'linear-gradient(160deg,#0D0D1A 0%,#1A1A2E 40%,#16213E 100%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="bunting" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: 'clamp(36px,6.5vh,54px) 16px clamp(4px,1vh,8px)',
          zIndex: 1, position: 'relative', flexShrink: 0,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.5vw,1.9rem)',
          color: '#F5C518', textShadow: '0 0 20px rgba(245,197,24,0.4)',
        }}>
          ⚡ Advanced Mode Complete!
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(0.52rem,1vw,0.68rem)',
          color: 'rgba(255,255,255,0.5)', marginTop: '2px',
        }}>
          {grade.emoji} Congratulations, {playerName || 'Student'}! — Your advanced score is saved separately.
        </div>
      </motion.div>

      {/* Two-column body */}
      <div style={{
        flex: 1, display: 'flex', gap: 'clamp(8px,1.8vw,18px)',
        flexWrap: 'wrap',
        padding: '0 clamp(10px,2vw,22px) clamp(8px,1.5vh,14px)',
        zIndex: 1, position: 'relative', overflowY: 'auto', minHeight: 0,
      }}>

        {/* ── LEFT: Score + Topic Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
          style={{
            flex: '1 1 240px',
            display: 'flex', flexDirection: 'column',
            gap: 'clamp(5px,0.9vh,8px)', overflow: 'hidden',
          }}
        >
          {/* Big score card */}
          <div style={{
            background: 'rgba(15,15,35,0.96)',
            border: `2.5px solid ${grade.color}66`,
            borderRadius: '14px',
            padding: 'clamp(8px,1.5vh,14px) clamp(10px,1.8vw,16px)',
            textAlign: 'center', flexShrink: 0,
            boxShadow: `0 0 40px ${grade.color}22`,
          }}>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.7rem,1.3vw,0.9rem)',
              color: grade.color, marginBottom: '5px',
            }}>⚡ Advanced Score</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px,1.5vw,18px)', marginBottom: '7px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.5rem,3.5vw,2.8rem)', color: grade.color, lineHeight: 1 }}>
                  {pct}%
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.48rem,0.9vw,0.62rem)', color: 'rgba(255,255,255,0.5)' }}>
                  {score}/{total} correct
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(0.78rem,1.7vw,1.2rem)', color: grade.color }}>{grade.label}</div>
                <div style={{ fontSize: 'clamp(1rem,2vw,1.6rem)' }}>{grade.emoji}</div>
              </div>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, #3A4DB8, #F5C518)`, borderRadius: '3px' }}
              />
            </div>
          </div>

          {/* Per-topic breakdown */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'clamp(4px,0.8vh,7px)' }}>
            <div style={{
              fontFamily: 'var(--font-accent)', fontWeight: 700,
              fontSize: 'clamp(0.55rem,1vw,0.7rem)',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase', letterSpacing: '1px',
              marginBottom: '2px', flexShrink: 0,
            }}>By Grammar Topic</div>
            {Object.entries(byTopic).map(([topic, stat], i) => {
              const topicPct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
              const secColor = topic === 'Perfect Tenses' ? sectionColors.A
                : topic === 'Subject-Verb Agreement' ? sectionColors.B
                : sectionColors.C;
              return (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${secColor}33`,
                    borderRadius: '10px', padding: '10px 14px', flexShrink: 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ fontFamily: 'var(--font-char)', fontWeight: 700, fontSize: 'clamp(0.6rem,1.1vw,0.74rem)', color: secColor }}>
                      {topic}
                    </div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 'clamp(0.62rem,1.1vw,0.76rem)', color: 'rgba(255,255,255,0.7)' }}>
                      {stat.correct}/{stat.total}
                    </div>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${topicPct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      style={{ height: '100%', background: secColor, borderRadius: '2px' }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Weak areas */}
            {Object.entries(byTopic).some(([, s]) => s.correct / s.total < 0.6) && (
              <div style={{
                background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)',
                borderRadius: '10px', padding: '10px 14px', flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: 'var(--font-char)', fontWeight: 700,
                  fontSize: 'clamp(0.6rem,1.1vw,0.72rem)', color: '#FF9800', marginBottom: '4px',
                }}>📚 Areas to review:</div>
                {Object.entries(byTopic)
                  .filter(([, s]) => s.correct / s.total < 0.6)
                  .map(([topic]) => (
                    <div key={topic} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.56rem,1vw,0.68rem)',
                      color: 'rgba(255,255,255,0.55)', padding: '2px 0',
                    }}>• {topic}</div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT: Certificate + Buttons ── */}
        <motion.div
          initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{
            flex: '1 1 240px', display: 'flex', flexDirection: 'column',
            gap: 'clamp(6px,1.1vh,10px)', minWidth: 0, overflow: 'hidden',
          }}
        >
          {/* Certificate preview — fixed height, no overflow */}
          <div
            ref={certRef}
            style={{
              maxHeight: 'clamp(260px,44vh,380px)',
              flexShrink: 0,
              background: 'linear-gradient(135deg,#0D0D1A 0%,#1A1A2E 60%,#16213E 100%)',
              border: '3px solid #F5C518',
              borderRadius: '14px',
              padding: 'clamp(8px,1.5vh,16px) clamp(10px,2vw,22px)',
              textAlign: 'center',
              boxShadow: '0 6px 22px rgba(245,197,24,0.2), inset 0 0 0 1.5px rgba(91,111,212,0.25)',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 'clamp(2px,0.4vh,5px)',
            }}
          >
            {/* Corner marks */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <span key={c} style={{
                position: 'absolute',
                top: c.startsWith('t') ? 6 : 'auto', bottom: c.startsWith('b') ? 6 : 'auto',
                left: c.endsWith('l') ? 6 : 'auto', right: c.endsWith('r') ? 6 : 'auto',
                fontSize: 'clamp(10px,1.4vw,14px)', opacity: 0.35, lineHeight: 1, color: '#F5C518',
              }}>✦</span>
            ))}

            <div style={{ width: '82%', height: '1px', flexShrink: 0, background: 'linear-gradient(90deg,transparent,#F5C518 15%,#F5C518 85%,transparent)' }} />

            <div style={{ fontSize: 'clamp(1.2rem,2.8vw,2.2rem)', lineHeight: 1, flexShrink: 0 }}>⚡</div>

            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: 'clamp(0.55rem,0.7vw,0.62rem)',
              color: '#F5C518', letterSpacing: '2px', textTransform: 'uppercase' as const,
            }}>Certificate of Advanced Mastery</div>

            <div style={{
              fontFamily: 'Georgia,serif', fontSize: 'clamp(0.52rem,0.65vw,0.6rem)',
              color: 'rgba(255,255,255,0.5)', fontStyle: 'italic',
            }}>This is to certify that</div>

            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.85rem,2.2vw,1.8rem)',
              color: '#E8547A', lineHeight: 1.1,
              wordBreak: 'break-word' as const, maxWidth: '90%',
            }}>{playerName || 'Student'}</div>

            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.52rem,0.65vw,0.6rem)',
              color: 'rgba(255,255,255,0.75)', lineHeight: 1.4,
            }}>
              has successfully completed <strong>Minasa: Grammar Quest — Advanced Mode</strong>
            </div>

            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.48rem,0.62vw,0.56rem)',
              color: 'rgba(255,255,255,0.4)', lineHeight: 1.4,
            }}>
              Exploring the Minasa Festival in Bustos, Bulacan<br />
              Perfect Tenses · Subject-Verb Agreement · Prepositions
            </div>

            {/* Score badge */}
            <div style={{
              background: 'linear-gradient(135deg,#3A4DB8,#F5C518)',
              color: 'white', fontFamily: 'var(--font-title)', fontWeight: 700,
              fontSize: 'clamp(0.52rem,0.65vw,0.6rem)',
              padding: 'clamp(2px,0.4vh,5px) clamp(8px,1.5vw,16px)',
              borderRadius: '50px',
              boxShadow: '0 3px 8px rgba(245,197,24,0.35)',
              flexShrink: 0,
            }}>
              ⚡ {score}/{total} · {pct}% · {grade.label.replace('!', '')}
            </div>

            <div style={{ width: '82%', height: '1px', flexShrink: 0, background: 'linear-gradient(90deg,transparent,#F5C518 15%,#F5C518 85%,transparent)' }} />

            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.46rem,0.56vw,0.52rem)',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {today} · EL306 Language Learning Materials
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: 'clamp(4px,0.8vw,8px)',
            flexWrap: 'wrap', justifyContent: 'center', flexShrink: 0,
          }}>
            <motion.button
              className="btn btn-primary btn-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={downloading}
              style={{ fontSize: 'clamp(0.52rem,0.95vw,0.7rem)', padding: '6px 12px', background: '#F5C518', color: '#1A1A2E', border: 'none', fontWeight: 800 }}
            >
              {downloading ? '⏳ Saving…' : '⬇ Download PNG'}
            </motion.button>
            <motion.button
              className="btn btn-secondary btn-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              style={{ fontSize: 'clamp(0.52rem,0.95vw,0.7rem)', padding: '6px 12px' }}
            >
              🖨 Print
            </motion.button>
            <motion.button
              className="btn btn-ghost btn-sm"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => goToScene('MAP')}
              style={{ fontSize: 'clamp(0.52rem,0.95vw,0.7rem)', padding: '6px 12px', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
            >
              🗺 Map
            </motion.button>
            <motion.button
              className="btn btn-ghost btn-sm"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => goToScene('MAIN_MENU')}
              style={{ fontSize: 'clamp(0.52rem,0.95vw,0.7rem)', padding: '6px 12px', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
            >
              ← Main Menu
            </motion.button>
            <motion.button
              className="btn btn-primary btn-sm"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245,197,24,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={startQuiz}
              style={{ fontSize: 'clamp(0.52rem,0.95vw,0.7rem)', padding: '6px 12px', background: '#F5C518', color: '#1A1A2E', border: 'none', fontWeight: 800 }}
            >
              ⚡ Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}