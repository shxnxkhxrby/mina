import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

// ── Lessons Library Modal ──────────────────────────────────────────────────

// Helper: try multiple extensions in order
function tryExts(base: string, exts = ['png', 'jpg', 'jpeg', 'webp', 'gif']) {
  return exts.map(e => `${base}.${e}`);
}

const LESSON_SECTIONS = [
  {
    id: 'A',
    color: '#E85D26',
    gradient: 'linear-gradient(135deg,#FF9A5C,#E85D26)',
    emoji: '⏳',
    topic: 'Perfect Tenses of the Verb',
    // public/imgs/lessons/lesson1/ptotv1.png … ptotv7.png
    slides: Array.from({ length: 7 }, (_, i) =>
      tryExts(`/imgs/lessons/lesson1/ptotv${i + 1}`)
    ),
  },
  {
    id: 'C',
    color: '#2E75B6',
    gradient: 'linear-gradient(135deg,#5BA3E0,#2E75B6)',
    emoji: '📍',
    topic: 'Prepositions',
    // public/imgs/lessons/lesson2/prepositions1.png … prepositions20.png
    slides: Array.from({ length: 20 }, (_, i) =>
      tryExts(`/imgs/lessons/lesson2/prepositions${i + 1}`)
    ),
  },
  {
    id: 'B',
    color: '#5B7A3D',
    gradient: 'linear-gradient(135deg,#8BBB60,#5B7A3D)',
    emoji: '🔗',
    topic: 'Subject-Verb Agreement',
    // public/imgs/lessons/lesson3/sva1.png … sva7.png
    slides: Array.from({ length: 7 }, (_, i) =>
      tryExts(`/imgs/lessons/lesson3/sva${i + 1}`)
    ),
  },
];

function SlideImage({ candidates }: { candidates: string[] }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (idx + 1 < candidates.length) {
      setIdx(i => i + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(0,0,0,0.3)', fontSize: '0.75rem', fontFamily: 'var(--font-body)',
      }}>
        Image not found
      </div>
    );
  }

  return (
    <img
      key={candidates[idx]}
      src={candidates[idx]}
      alt="Lesson slide"
      onError={handleError}
      style={{
        width: '100%', height: '100%',
        objectFit: 'contain',
        display: 'block',
        borderRadius: '8px',
      }}
    />
  );
}

function LessonsLibraryModal({ onClose }: { onClose: () => void }) {
  const [activeSec, setActiveSec] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);

  const sec = LESSON_SECTIONS[activeSec];
  const total = sec.slides.length;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx(i => Math.max(0, i - 1));
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx(i => Math.min(total - 1, i + 1));
  };
  const switchSection = (i: number) => {
    setActiveSec(i);
    setSlideIdx(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(8px,2vw,24px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: 'linear-gradient(160deg,#FFFDF0,#FFF8D6)',
          borderRadius: 'clamp(14px,2vw,24px)',
          border: '3px solid #F5C84A',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          width: 'min(96vw, 720px)',
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#F07820,#E8650A)',
          padding: 'clamp(10px,1.8vh,16px) clamp(14px,2.5vw,22px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.9rem,2.2vw,1.3rem)',
              color: 'white', fontWeight: 900,
              textShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}>📖 Lessons Library</div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.5rem,1vw,0.68rem)',
              color: 'rgba(255,255,255,0.85)', marginTop: '2px',
            }}>Review grammar lessons from M.I.N.A. — Grammar Quest</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '50%',
            width: 'clamp(28px,3.5vw,36px)', height: 'clamp(28px,3.5vw,36px)',
            color: 'white', fontSize: 'clamp(0.8rem,1.5vw,1rem)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Section tabs — 3 only */}
        <div style={{
          display: 'flex', borderBottom: '2px solid #F5C84A',
          overflowX: 'auto', flexShrink: 0,
        }}>
          {LESSON_SECTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => switchSection(i)}
              style={{
                flex: '1 0 auto',
                padding: 'clamp(8px,1.4vh,12px) clamp(8px,1.5vw,16px)',
                border: 'none',
                borderBottom: activeSec === i ? `3px solid ${s.color}` : '3px solid transparent',
                background: activeSec === i ? `${s.color}18` : 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.55rem,1.1vw,0.75rem)',
                fontWeight: 700,
                color: activeSec === i ? s.color : '#9A8060',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {s.emoji} {s.topic}
            </button>
          ))}
        </div>

        {/* Slideshow area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', minHeight: 0,
        }}>
          {/* Slide counter pill */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: 'clamp(6px,1vh,10px) clamp(10px,2vw,18px)',
            flexShrink: 0,
          }}>
            <div style={{
              background: sec.gradient, color: 'white',
              borderRadius: '50px', padding: '3px 14px',
              fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: 'clamp(0.52rem,1vw,0.7rem)',
              letterSpacing: '0.5px',
            }}>
              {sec.emoji} Slide {slideIdx + 1} of {total}
            </div>
          </div>

          {/* Image frame */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSec}-${slideIdx}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              style={{
                flex: 1, minHeight: 0,
                margin: '0 clamp(10px,2vw,20px)',
                background: 'rgba(255,255,255,0.85)',
                borderRadius: '12px',
                border: `2px solid ${sec.color}44`,
                boxShadow: `0 4px 18px ${sec.color}22`,
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <SlideImage candidates={sec.slides[slideIdx]} />
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(3px,0.5vw,6px)',
            padding: 'clamp(6px,1vh,10px) clamp(10px,2vw,18px)',
            flexShrink: 0,
          }}>
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                style={{
                  width: slideIdx === i ? 'clamp(16px,2vw,20px)' : 'clamp(7px,1vw,9px)',
                  height: 'clamp(7px,1vw,9px)',
                  borderRadius: '50px',
                  background: slideIdx === i ? sec.color : `${sec.color}44`,
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer nav */}
        <div style={{
          padding: 'clamp(8px,1.4vh,12px) clamp(14px,2.5vw,22px)',
          borderTop: '2px solid #F5C84A',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
          background: 'rgba(255,248,200,0.6)',
        }}>
          <motion.button
            whileHover={{ scale: slideIdx > 0 ? 1.05 : 1 }}
            whileTap={{ scale: slideIdx > 0 ? 0.95 : 1 }}
            onClick={goPrev}
            disabled={slideIdx === 0}
            style={{
              background: slideIdx > 0 ? sec.gradient : 'rgba(0,0,0,0.08)',
              border: 'none', borderRadius: '10px',
              padding: 'clamp(7px,1.2vh,10px) clamp(14px,2vw,22px)',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.65rem,1.3vw,0.85rem)',
              color: slideIdx > 0 ? 'white' : 'rgba(0,0,0,0.25)',
              fontWeight: 900, cursor: slideIdx > 0 ? 'pointer' : 'default',
              boxShadow: slideIdx > 0 ? `0 4px 14px ${sec.color}44` : 'none',
              transition: 'all 0.2s',
            }}
          >
            ← Prev
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              background: 'linear-gradient(160deg,#F07820,#E8650A)',
              border: 'none', borderRadius: '10px',
              padding: 'clamp(7px,1.2vh,10px) clamp(14px,2vw,22px)',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.65rem,1.3vw,0.85rem)',
              color: 'white', fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(232,100,10,0.4)',
            }}
          >
            Close ✕
          </motion.button>

          <motion.button
            whileHover={{ scale: slideIdx < total - 1 ? 1.05 : 1 }}
            whileTap={{ scale: slideIdx < total - 1 ? 0.95 : 1 }}
            onClick={goNext}
            disabled={slideIdx === total - 1}
            style={{
              background: slideIdx < total - 1 ? sec.gradient : 'rgba(0,0,0,0.08)',
              border: 'none', borderRadius: '10px',
              padding: 'clamp(7px,1.2vh,10px) clamp(14px,2vw,22px)',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.65rem,1.3vw,0.85rem)',
              color: slideIdx < total - 1 ? 'white' : 'rgba(0,0,0,0.25)',
              fontWeight: 900, cursor: slideIdx < total - 1 ? 'pointer' : 'default',
              boxShadow: slideIdx < total - 1 ? `0 4px 14px ${sec.color}44` : 'none',
              transition: 'all 0.2s',
            }}
          >
            Next →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Volume Gear Popup ──────────────────────────────────────────────────────
function VolumeGearPopup({
  musicVolume, voiceVolume, setMusicVolume, setVoiceVolume, onClose,
}: {
  musicVolume: number; voiceVolume: number;
  setMusicVolume: (v: number) => void;
  setVoiceVolume: (v: number) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '0',
        background: 'linear-gradient(160deg,#F07820,#E8650A)',
        borderRadius: '14px',
        border: '2.5px solid rgba(255,255,255,0.45)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.30)',
        padding: 'clamp(10px,1.6vh,16px) clamp(14px,2vw,20px)',
        width: 'clamp(200px,28vw,260px)',
        zIndex: 50,
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(0.72rem,1.4vw,0.9rem)',
        color: '#fff',
        fontWeight: 900,
        marginBottom: 'clamp(8px,1.2vh,12px)',
        textAlign: 'center',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}>
        ⚙ Volume Settings
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.4vh,12px)' }}
        onClick={e => e.stopPropagation()}>
        <VolumeSlider icon="🎵" label="Game music" value={musicVolume} onChange={setMusicVolume} />
        <VolumeSlider icon="🎙" label="Mina's voice" value={voiceVolume} onChange={setVoiceVolume} />
      </div>
    </motion.div>
  );
}

export default function MainMenu() {
  const {
    goToScene, playerName, setAdvancedMode,
    musicVolume, voiceVolume, setMusicVolume, setVoiceVolume,
  } = useGameStore();

  const [showVolume, setShowVolume] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleStoryMode = () => {
    setAdvancedMode(false);
    goToScene(playerName ? 'MAP' : 'VIDEO_INTRO');
  };

  const handleNewGame = () => {
    useGameStore.getState().resetGame();
    useGameStore.getState().goToScene('VIDEO_INTRO');
  };

  const handleAdvanced = () => {
    setAdvancedMode(true);
    goToScene('ADVANCED_SECTION_VIEW');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: '"Fredoka One", "Baloo 2", cursive',
      }}
      onClick={() => showVolume && setShowVolume(false)}
    >
      {/* Background */}
      <img
        src={ASSETS.logo}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center', zIndex: 0,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Blur + dim overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: 'blur(2.5px)', WebkitBackdropFilter: 'blur(2.5px)',
        background: 'rgba(0,0,0,0.42)', zIndex: 1,
      }} />

      {/* ── CENTERED M.I.N.A. TITLE ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -28, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: 'clamp(10px, 2.5vh, 28px)',
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0px',
          pointerEvents: 'none',
        }}
      >
        {/* ── Decorative banner pill ── */}
        <div style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(160deg, #F07820 0%, #E8650A 50%, #CF5508 100%)',
          border: '3.5px solid rgba(255,255,255,0.55)',
          borderRadius: 'clamp(16px,3vw,28px)',
          padding: 'clamp(10px,1.8vh,18px) clamp(28px,5.5vw,60px) clamp(10px,1.6vh,16px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.38), inset 0 2px 0 rgba(255,255,255,0.40), inset 0 -4px 0 rgba(0,0,0,0.20)',
        }}>

          {/* Sheen highlight — mirrors the Tile buttons */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
            pointerEvents: 'none', borderRadius: 'inherit',
          }} />

          {/* Inner border inset */}
          <div style={{
            position: 'absolute', inset: '4px',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 'clamp(12px,2.5vw,22px)',
            pointerEvents: 'none',
          }} />

          {/* Corner diamonds */}
          {[
            { top: '8px', left: '12px' },
            { top: '8px', right: '12px' },
            { bottom: '8px', left: '12px' },
            { bottom: '8px', right: '12px' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: 'clamp(5px,0.8vw,7px)', height: 'clamp(5px,0.8vw,7px)',
              background: 'rgba(255,255,255,0.75)',
              transform: 'rotate(45deg)',
            }} />
          ))}

          {/* Top rule with stars */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 'clamp(6px,1.2vw,14px)',
            marginBottom: 'clamp(3px,0.6vh,6px)',
            width: '100%', justifyContent: 'center',
          }}>
            <div style={{
              flex: 1, height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(0.48rem,0.85vw,0.66rem)' }}>★</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.36rem,0.6vw,0.5rem)' }}>✦</span>
            <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(0.48rem,0.85vw,0.66rem)' }}>★</span>
            <div style={{
              flex: 1, height: '1.5px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)',
            }} />
          </div>

          {/* M.I.N.A. wordmark */}
          <motion.div
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', lineHeight: 1, textAlign: 'center' }}
          >
            {/* Glow layer */}
            <span style={{
              position: 'absolute', inset: 0,
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(2rem,5.5vw,4rem)',
              color: 'transparent',
              letterSpacing: 'clamp(4px,1vw,10px)',
              whiteSpace: 'nowrap',
              textShadow: '0 0 24px rgba(255,255,255,0.55), 0 0 48px rgba(255,200,80,0.35)',
              display: 'block',
              pointerEvents: 'none',
            }}>M.I.N.A.</span>

            {/* Main text */}
            <span style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(2rem,5.5vw,4rem)',
              color: '#fff',
              fontWeight: 900,
              letterSpacing: 'clamp(4px,1vw,10px)',
              whiteSpace: 'nowrap',
              display: 'block',
              textShadow: '0 2px 4px rgba(0,0,0,0.30), 0 1px 0 rgba(0,0,0,0.15)',
            }}>M.I.N.A.</span>

            {/* White underline bar */}
            <div style={{
              position: 'absolute', bottom: '-2px', left: '5%', right: '5%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 75%, transparent)',
              borderRadius: '2px',
            }} />
          </motion.div>

          {/* Subtitle */}
          <div style={{
            marginTop: 'clamp(6px,1.1vh,10px)',
            display: 'flex', alignItems: 'center',
            gap: 'clamp(6px,1.2vw,12px)',
          }}>
            <div style={{ width: 'clamp(14px,2.5vw,24px)', height: '1px', background: 'rgba(255,255,255,0.45)' }} />
            <span style={{
              fontFamily: '"Fredoka One", cursive',
              fontSize: 'clamp(0.46rem,0.9vw,0.7rem)',
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: 'clamp(3px,0.7vw,7px)',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
              textShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}>
              Grammar Quest
            </span>
            <div style={{ width: 'clamp(14px,2.5vw,24px)', height: '1px', background: 'rgba(255,255,255,0.45)' }} />
          </div>

          {/* Bottom rule with dots */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 'clamp(5px,1vw,10px)',
            marginTop: 'clamp(4px,0.8vh,8px)',
            width: '100%', justifyContent: 'center',
          }}>
            <div style={{
              flex: 1, height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5))',
            }} />
            {['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.9)'].map((c, i) => (
              <div key={i} style={{
                width: 'clamp(3px,0.5vw,5px)', height: 'clamp(3px,0.5vw,5px)',
                borderRadius: '50%', background: c,
              }} />
            ))}
            <div style={{
              flex: 1, height: '1.5px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.5), transparent)',
            }} />
          </div>
        </div>
      </motion.div>

      {/* ── GEAR ICON (bottom-left) ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(12px,2.5vh,24px)',
        left: 'clamp(12px,2.5vw,24px)',
        zIndex: 30,
      }}>
        <div style={{ position: 'relative' }}>
          <AnimatePresence>
            {showVolume && (
              <VolumeGearPopup
                musicVolume={musicVolume}
                voiceVolume={voiceVolume}
                setMusicVolume={setMusicVolume}
                setVoiceVolume={setVoiceVolume}
                onClose={() => setShowVolume(false)}
              />
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.93 }}
            onClick={e => { e.stopPropagation(); setShowVolume(v => !v); }}
            style={{
              width: 'clamp(36px,4.5vw,50px)',
              height: 'clamp(36px,4.5vw,50px)',
              borderRadius: '50%',
              background: showVolume
                ? 'linear-gradient(135deg,#F07820,#CF5508)'
                : 'rgba(0,0,0,0.55)',
              border: '2.5px solid rgba(255,255,255,0.45)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(1rem,2vw,1.4rem)',
              transition: 'background 0.2s',
            }}
          >
            ⚙️
          </motion.button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px,17vh,140px) 0 clamp(20px,3vh,48px)',
        paddingRight: 0,
        boxSizing: 'border-box',
        gap: 0,
      }}>
        {/* Tile grid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto',
            gap: 'clamp(10px, 1.5vw, 20px)',
            width: 'clamp(320px, 44vw, 580px)',
            flexShrink: 0, zIndex: 11,
            marginLeft: 'clamp(16px, 5vw, 72px)',
            marginRight: 'clamp(-50px, -5vw, -20px)',
          }}
          className="menu-grid"
        >
          {playerName ? (
            <Tile onClick={handleStoryMode} delay={0.18} label="Continue" />
          ) : (
            <Tile onClick={handleStoryMode} delay={0.18} label="Story Mode" wide />
          )}

          {playerName ? (
            <Tile onClick={handleNewGame} delay={0.24} label="New Game" />
          ) : null}

          <Tile onClick={handleAdvanced} delay={0.30} label="Mastery Checkpoint" />

          <Tile
            onClick={() => setShowLibrary(true)}
            delay={0.36}
            label="Lessons Library"
          />
        </motion.div>

        {/* Mina mascot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 70, damping: 14 }}
          style={{
            flex: '0 0 auto',
            alignSelf: 'flex-end',
            marginBottom: '-10px',
            marginRight: 'clamp(-40px, -4vw, -10px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
          className="mina-wrap"
        >
          <motion.img
            src={ASSETS.minaMascot}
            alt="Mina"
            animate={{ y: [0, -26, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: 'clamp(780px, 172vh, 1600px)',
              width: 'auto',
              maxWidth: 'clamp(480px, 78vw, 920px)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 22px 50px rgba(0,0,0,0.32))',
              display: 'block',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </motion.div>
      </div>

      {/* Lessons Library Modal */}
      <AnimatePresence>
        {showLibrary && <LessonsLibraryModal onClose={() => setShowLibrary(false)} />}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

        @media (max-width: 560px) {
          .menu-grid {
            width: 58vw !important;
            height: auto !important;
            margin-left: clamp(10px, 3vw, 20px) !important;
            margin-right: 0 !important;
            z-index: 11;
            gap: 8px !important;
          }
          .menu-grid button {
            min-height: clamp(64px, 11vh, 100px) !important;
            font-size: clamp(0.72rem, 3.8vw, 1rem) !important;
          }
          .mina-wrap {
            position: absolute !important;
            right: 0 !important;
            bottom: 0 !important;
            pointer-events: none;
          }
          .mina-wrap img {
            height: clamp(520px, 130vw, 780px) !important;
            max-width: 90vw !important;
          }
        }

        @media (min-width: 561px) and (max-width: 860px) {
          .menu-grid {
            width: 50vw !important;
            height: auto !important;
            margin-right: clamp(-24px, -2vw, -8px) !important;
          }
          .mina-wrap img {
            height: clamp(640px, 128vw, 1000px) !important;
            max-width: 58vw !important;
          }
        }

        input[type='range'].vol-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }
        input[type='range'].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 6px rgba(0,0,0,0.30);
          cursor: pointer;
        }
        input[type='range'].vol-slider::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid rgba(255,255,255,0.8);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

interface TileProps {
  onClick: () => void;
  delay: number;
  label: string;
  wide?: boolean;
}

function Tile({ onClick, delay, label, wide }: TileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.38, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        gridColumn: wide ? '1 / -1' : undefined,
        width: '100%', height: '100%',
      }}
    >
      <motion.button
        whileHover={{ scale: 1.05, filter: 'brightness(1.12)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
          width: '100%', height: '100%',
          minHeight: 'clamp(100px, 17vh, 180px)',
          background: 'linear-gradient(160deg, #F07820 0%, #E8650A 50%, #CF5508 100%)',
          border: '3.5px solid rgba(255,255,255,0.55)',
          borderRadius: 'clamp(14px, 2vw, 26px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.32), inset 0 2px 0 rgba(255,255,255,0.40), inset 0 -4px 0 rgba(0,0,0,0.20)',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(12px, 1.8vh, 22px) clamp(10px, 1.5vw, 18px)',
          gap: '4px', position: 'relative', overflow: 'hidden',
          transition: 'box-shadow 0.18s',
        }}
      >
        {/* Sheen highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
          pointerEvents: 'none', borderRadius: 'inherit',
        }} />
        <span style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 'clamp(1.05rem, 2.6vw, 1.9rem)',
          color: '#fff', fontWeight: 900,
          textShadow: '0 2px 4px rgba(0,0,0,0.30), 0 1px 0 rgba(0,0,0,0.15)',
          textAlign: 'center', lineHeight: 1.2, zIndex: 2,
        }}>
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}

function VolumeSlider({
  icon, label, value, onChange,
}: {
  icon: string; label: string; value: number; onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: '"Fredoka One", cursive',
        fontSize: 'clamp(0.55rem, 1.1vw, 0.75rem)',
        color: 'rgba(255,255,255,0.92)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}>{icon}</span>
          {label}
        </span>
        <span style={{ fontWeight: 700, color: '#fff', minWidth: '28px', textAlign: 'right' }}>
          {pct}%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>🔈</span>
        <input
          type="range" className="vol-slider"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            background: `linear-gradient(to right, rgba(255,255,255,0.95) ${pct}%, rgba(255,255,255,0.30) ${pct}%)`,
          }}
        />
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>🔊</span>
      </div>
    </div>
  );
}