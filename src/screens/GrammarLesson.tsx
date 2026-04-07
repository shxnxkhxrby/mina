import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';

// ── Audio URLs — one per lesson page, 3 pages total ────────────────────────
// File 9 = Grammar Rule page, File 10 = Formula page, File 11 = Examples page
const GRAMMAR_LESSON_AUDIO = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/9_spph6a.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/10_ldciim.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563617/11_ktrb9e.m4a',
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

function ScallopedBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={Array.from({ length: 60 }, (_, i) => `M${i * 20},24 Q${i * 20 + 10},0 ${i * 20 + 20},24`).join(' ')} fill="#F5C84A" />
        </svg>
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #FFF8D6 0%, #FFEEA0 100%)',
        border: '4px solid #F5C84A', borderTop: 'none',
        borderRadius: '0 0 20px 20px',
        padding: 'clamp(14px,3vh,24px) clamp(16px,4vw,32px) clamp(14px,3vh,24px)',
        position: 'relative', boxShadow: '0 6px 28px rgba(180,120,0,0.18)', zIndex: 1,
      }}>
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={Array.from({ length: 60 }, (_, i) => `M${i * 20},24 Q${i * 20 + 10},0 ${i * 20 + 20},24`).join(' ')} fill="#F5C84A" />
        </svg>
      </div>
    </div>
  );
}

type LessonPage = {
  badge: string;
  badgeColor: [string, string];
  title: string;
  render: (lesson: any, showCursor: boolean) => React.ReactNode;
};

const LESSON_PAGES: LessonPage[] = [
  {
    badge: '📚 LESSON',
    badgeColor: ['#FF7A1A', '#E85D10'],
    title: 'Grammar Rule',
    render: (lesson, showCursor) => (
      <>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1.3rem,3.2vw,2.1rem)',
          color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px',
        }}>
          {lesson.topic}
          <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.9rem,2vw,1.15rem)',
          color: '#6B4A00', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.5,
        }}>
          {lesson.intro}
        </div>
        <div style={{
          background: 'rgba(232,93,16,0.1)', border: '2.5px solid #E85D10',
          borderRadius: '12px', padding: '10px 14px',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.9rem,1.9vw,1.1rem)',
          color: '#2A1800', lineHeight: 1.6,
        }}>
          <strong style={{ color: '#E85D10' }}>📖 Rule:</strong> {lesson.rule}
        </div>
      </>
    ),
  },
  {
    badge: '✏️ FORMULA',
    badgeColor: ['#3A9E5C', '#217A42'],
    title: 'The Formula',
    render: (lesson, showCursor) => (
      <>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1.1rem,2.4vw,1.45rem)',
          color: '#2A1800', fontWeight: 800, marginBottom: '14px',
        }}>
          Remember this formula!
          <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)',
          border: '3px solid #3A9E5C', borderRadius: '14px',
          padding: '14px 18px',
          fontFamily: 'var(--font-char)',
          fontSize: 'clamp(1.05rem,2.5vw,1.5rem)',
          fontWeight: 700, color: '#1A5C30',
          textAlign: 'center', letterSpacing: '0.5px',
          boxShadow: '0 4px 16px rgba(58,158,92,0.15)',
          whiteSpace: 'pre-line',
        }}>
          {lesson.formula}
        </div>
      </>
    ),
  },
  {
    badge: '💡 EXAMPLES',
    badgeColor: ['#5B6FD4', '#3A4DB8'],
    title: 'See It in Action',
    render: (lesson, showCursor) => (
      <>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1.1rem,2.4vw,1.45rem)',
          color: '#2A1800', fontWeight: 800, marginBottom: '12px',
        }}>
          Examples from Bustos:
          <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#5B6FD4' }}>▌</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lesson.examples.map((ex: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              style={{
                background: 'linear-gradient(135deg, #EEF0FF 0%, #DDE1FF 100%)',
                border: '2.5px solid #5B6FD4', borderRadius: '12px',
                padding: '9px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.88rem,1.9vw,1.08rem)',
                color: '#2A1800', lineHeight: 1.55,
              }}
            >
              💬 {ex}
            </motion.div>
          ))}
        </div>
      </>
    ),
  },
];

const PARTICLES = [
  { delay: 0, x: '8%', size: 10 }, { delay: 0.8, x: '15%', size: 7 },
  { delay: 1.5, x: '22%', size: 12 }, { delay: 0.3, x: '35%', size: 8 },
  { delay: 2.1, x: '45%', size: 6 }, { delay: 1.2, x: '55%', size: 10 },
  { delay: 0.6, x: '68%', size: 7 },
];

export default function GrammarLesson() {
  const { currentSection, goToScene } = useGameStore();
  const [page, setPage] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const section = SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;
  const lesson = section.lesson;

  const isLast = page === LESSON_PAGES.length - 1;
  const current = LESSON_PAGES[page];
  const [gradStart, gradEnd] = current.badgeColor;

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Play audio per page
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const src = GRAMMAR_LESSON_AUDIO[page];
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [page]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const advance = () => {
    stopAudio();
    if (isLast) goToScene('SECTION_VIEW');
    else setPage(p => p + 1);
  };

  return (
    <div
      className="scene"
      style={{ cursor: 'pointer', overflow: 'hidden' }}
      onClick={advance}
    >
      <img
        src={ASSETS.map}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(6px) brightness(0.48) saturate(0.7)',
          transform: 'scale(1.04)', zIndex: 0,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,248,220,0.82) 0%, rgba(30,18,0,0.28) 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(30,18,0,0.28) 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      <div className="bunting" style={{ zIndex: 5 }} />

      {/* Mina mascot */}
      <motion.div
        style={{ position: 'absolute', right: 'clamp(-20px, -1vw, 0px)', bottom: 0, zIndex: 10, pointerEvents: 'none' }}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 }}
      >
        <motion.img
          src={ASSETS.minaMascot}
          alt="Mina"
          style={{
            width: 'clamp(70px,12vw,160px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))', display: 'block',
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </motion.div>

      {/* Lesson box */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(280px, 88vw, 820px)', zIndex: 20,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${gradStart}, ${gradEnd})`,
                border: '3px solid #FFD700', borderRadius: '10px',
                padding: '4px 18px 4px 14px',
                marginBottom: '0px', position: 'relative', zIndex: 3,
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                clipPath: 'polygon(8px 0%, 100% 0%, 100% 100%, 8px 100%, 0% 50%)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
                color: 'white', fontWeight: 900, letterSpacing: '2px',
                textShadow: '1px 2px 0 rgba(0,0,0,0.3)',
              }}>
                {current.badge}
              </span>
            </motion.div>

            <ScallopedBubble>
              {current.render(lesson, showCursor)}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {LESSON_PAGES.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i === page ? 1.3 : 1 }}
                      style={{
                        width: i === page ? '20px' : '7px', height: '7px', borderRadius: '4px',
                        background: i <= page ? gradStart : 'rgba(180,120,0,0.3)',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.7rem, 1.3vw, 0.9rem)',
                  color: '#8A6000', marginLeft: 'auto',
                }}>
                  {isLast ? "Click to start! →" : 'Click to continue ▶'}
                </div>
              </div>
            </ScallopedBubble>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back button */}
      {page > 0 && (
        <button
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute', bottom: 'clamp(12px,3vh,28px)',
            left: 'clamp(14px,3vw,32px)', opacity: 0.85, zIndex: 30,
          }}
          onClick={e => { e.stopPropagation(); stopAudio(); setPage(p => p - 1); }}
        >
          ← Back
        </button>
      )}

      {/* Skip button */}
      {!isLast && (
        <button
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute', top: 'clamp(40px,7.5vh,66px)',
            right: 'clamp(10px,2vw,20px)', opacity: 0.8, zIndex: 30,
          }}
          onClick={e => { e.stopPropagation(); stopAudio(); goToScene('SECTION_VIEW'); }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}