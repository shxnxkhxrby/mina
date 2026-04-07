import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ASSETS } from '../data/assets';

// ── Mina audio for Chapter 2 slides only (slides index 0, 1, 2 of chapter 2)
// File 6 = Mina slide 1, File 7 = Mina slide 2, File 8 = Mina slide 3
const MINA_CHAPTER2_AUDIO = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563615/6_l06ibr.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/7_mehoew.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/8_xtlyka.m4a',
];

const CHAPTERS = [
  {
    chapter: 'Chapter 1',
    chapterTitle: 'The Classroom Assignment',
    bg: 'linear-gradient(180deg,#E8D5A3 0%,#D4B896 40%,#C4A882 100%)',
    location: '📚 Classroom — Bustos National High School',
    speaker: 'Teacher',
    speakerEmoji: '👩‍🏫',
    speakerColor: '#6B4E1E',
    bubbleAccent: '#C8860A',
    slides: [
      { text: "Class, today we'll learn about Minasa — a traditional cookie from Bustos, Bulacan. Minasa is known for its soft, crumbly texture and was first made during the Spanish colonial era.", visual: '🏫' },
      { text: "Locals used leftover egg yolks — from construction practices that used egg whites — to create pastries. Originally made with arrowroot or sago flour, today it's commonly made with cassava flour.", visual: '🥚' },
      { text: "Its name comes from the Filipino word 'minasa,' meaning 'kneaded,' which reflects its preparation process. Minasa isn't just a cookie — it's part of Bulacan's living heritage.", visual: '🍪' },
      { text: "One of its keepers, Lilibeth Carangan, learned the craft from her parents and has continued the tradition for nearly 40 years. Today, her business — Aling Liling Minasa — is famous for its unique taste and quality.", visual: '👵' },
      { text: "Now, as the Minasa Festival approaches, your task is twofold: First, create or bake a sample Minasa following the traditional steps. Second, document some of the events happening during the festival.", visual: '📋' },
      { text: "This will give you a hands-on experience of both the heritage and the celebration of Minasa, and help you understand why it's such an important part of Bulacan's culture!", visual: '🌟' },
    ],
  },
  {
    chapter: 'Chapter 2',
    chapterTitle: 'Meet Mina!',
    bg: 'linear-gradient(180deg,#2C1810 0%,#4A2C18 40%,#6B3D1E 100%)',
    location: '🎪 Festival Streets — Bustos, Bulacan',
    speaker: 'Mina',
    speakerEmoji: null,
    speakerColor: '#E85D26',
    bubbleAccent: '#F5C518',
    slides: [
      { text: "Hello! I'm Mina, here to guide you through your Minasa Festival tasks! I see you've learned about the history of Minasa and your assignments — but maybe you're wondering where to start?", visual: '👋' },
      { text: "No worries! First, we'll visit local Minasa shops in Bustos. Talking to the shop owners will help you practice your English — asking questions, reporting answers, and learning grammar along the way!", visual: '🗺️' },
      { text: "Along the way, I'll guide you through different places in Bustos while teaching important grammar areas: Perfect Tenses, Subject-Verb Agreement, and Prepositions. Ready? Let's go! 🌸", visual: '✨' },
    ],
  },
  {
    chapter: 'Chapter 3',
    chapterTitle: 'To the Pamilihang Bayan!',
    bg: 'linear-gradient(180deg,#1A3A1A 0%,#2D5A2D 40%,#4A7A3D 100%)',
    location: '🏬 Pamilihang Bayan ng Bustos',
    speaker: 'Narrator',
    speakerEmoji: '📖',
    speakerColor: '#2D5A2D',
    bubbleAccent: '#5B7A3D',
    slides: [
      { text: "Motivated and excited, you head to the Pamilihang Bayan ng Bustos to gather ingredients. The market is alive with the sounds and smells of fresh produce!", visual: '🛒' },
      { text: "You visit Ate Marie's cassava store for fresh cassava, stop by Mang Berto's Egg Shop to buy egg yolks, and complete your list at Gregorio's Milk Shop.", visual: '🥛' },
      { text: "Each stop introduces you to the warmth and stories of local vendors — and tests your grammar skills! With ingredients in hand, the real adventure begins.", visual: '🎒' },
    ],
  },
  {
    chapter: 'Chapter 4',
    chapterTitle: "Bustos' Best Bakers",
    bg: 'linear-gradient(180deg,#3A1A0A 0%,#6B2D0A 40%,#8B4A1A 100%)',
    location: "🍪 Bustos' Famous Minasa Shops",
    speaker: 'Narrator',
    speakerEmoji: '📖',
    speakerColor: '#8B4A1A',
    bubbleAccent: '#E85D26',
    slides: [
      { text: "With ingredients ready, you seek inspiration from the town's most famous Minasa makers. You visit Zeny's Minasa, Elsa's Minasa, and Bernardo's Pasalubong.", visual: '🏪' },
      { text: "You observe traditional baking methods and learn the secrets behind the perfect Minasa — the right flour, the precise measurements, the patience required for every batch.", visual: '🔥' },
      { text: "Each baker shares stories of their craft and tests your grammar knowledge. The lessons you learn here will help you document the festival and bake your own Minasa!", visual: '💡' },
    ],
  },
  {
    chapter: 'Chapter 5',
    chapterTitle: 'The Minasa Festival!',
    bg: 'linear-gradient(180deg,#1A0A3A 0%,#2D1A6B 40%,#4A1A8B 100%)',
    location: '🎉 Minasa Festival — Bustos, Bulacan',
    speaker: 'Narrator',
    speakerEmoji: '📖',
    speakerColor: '#6A1A8B',
    bubbleAccent: '#F5C518',
    slides: [
      { text: "The much-awaited Minasa Festival has arrived! The streets burst with color, music, and the sweet smell of freshly baked Minasa. You document the vibrant bazaar where local products shine.", visual: '🎊' },
      { text: "You watch the energetic dance showdown filled with color and rhythm, and attend the festive DepEd Night celebrating education and community.", visual: '💃' },
      { text: "As the celebration comes to a close, Mayor Iskul Juan delivers heartfelt closing remarks — reminding everyone that Minasa is more than a delicacy. It is a reflection of Bustos' unity, heritage, and pride.", visual: '🏆' },
      { text: "You present your outputs and realize: through Minasa, you didn't just complete a task — you experienced the true spirit of your community. Now, let your grammar adventure begin! 🌟", visual: '🌟' },
    ],
  },
];

export default function StorylineScreen() {
  const { goToScene } = useGameStore();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const chapter = CHAPTERS[chapterIdx];
  const slide = chapter.slides[slideIdx];
  const isLastSlide = slideIdx === chapter.slides.length - 1;
  const isLastChapter = chapterIdx === CHAPTERS.length - 1;
  const isVeryLast = isLastChapter && isLastSlide;

  // Play Mina audio only for Chapter 2 slides
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (chapterIdx === 1) {
      // Chapter 2 = index 1
      const src = MINA_CHAPTER2_AUDIO[slideIdx];
      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.play().catch(() => {});
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [chapterIdx, slideIdx]);

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
    if (showSkipConfirm) return;
    stopAudio();
    if (!isLastSlide) {
      setSlideIdx(i => i + 1);
    } else if (!isLastChapter) {
      setChapterIdx(i => i + 1);
      setSlideIdx(0);
    } else {
      proceedToGame();
    }
  };

  const proceedToGame = () => {
    stopAudio();
    goToScene('TEACHER_INTRO');
  };

  const totalSlides = CHAPTERS.reduce((sum, c) => sum + c.slides.length, 0);
  const slidesBeforeThisChapter = CHAPTERS.slice(0, chapterIdx).reduce((sum, c) => sum + c.slides.length, 0);
  const globalSlide = slidesBeforeThisChapter + slideIdx + 1;

  return (
    <div
      className="scene"
      style={{ cursor: showSkipConfirm ? 'default' : 'pointer', background: chapter.bg }}
      onClick={showSkipConfirm ? undefined : advance}
    >
      <div className="bunting" />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: 'clamp(8rem,20vw,18rem)', opacity: 0.06,
        userSelect: 'none', pointerEvents: 'none',
        filter: 'blur(2px)', zIndex: 0,
      }}>{slide.visual}</div>

      {/* Location badge */}
      <motion.div
        key={`loc-${chapterIdx}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute', top: 'clamp(38px,7vh,60px)',
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          border: `1.5px solid ${chapter.bubbleAccent}`,
          borderRadius: '50px', padding: '4px 18px',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.55rem,1.1vw,0.72rem)',
          color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      >
        {chapter.location}
      </motion.div>

      {/* Chapter tag */}
      <motion.div
        key={`ch-${chapterIdx}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: 'clamp(38px,7vh,60px)',
          left: 'clamp(12px,3vw,24px)',
          zIndex: 10,
        }}
      >
        <div style={{
          background: chapter.bubbleAccent,
          borderRadius: '8px', padding: '3px 12px',
          fontFamily: 'var(--font-char)', fontWeight: 700,
          fontSize: 'clamp(0.52rem,1vw,0.68rem)',
          color: chapterIdx === 0 ? '#3A2200' : 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {chapter.chapter}: {chapter.chapterTitle}
        </div>
      </motion.div>

      {/* Speaker portrait */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`speaker-${chapterIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(110px,22vh,220px)',
            left: chapter.speaker === 'Mina' ? undefined : 'clamp(16px,4vw,48px)',
            right: chapter.speaker === 'Mina' ? 'clamp(16px,4vw,48px)' : undefined,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            zIndex: 5,
          }}
        >
          {chapter.speakerEmoji === null ? (
            <img
              src={ASSETS.minaMascot}
              alt="Mina"
              style={{
                width: 'clamp(90px,16vw,180px)', height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
                animation: 'float 3s ease-in-out infinite',
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: 'clamp(70px,13vw,150px)', height: 'clamp(70px,13vw,150px)',
              borderRadius: '16px', border: `3px solid ${chapter.bubbleAccent}`,
              background: 'rgba(255,248,231,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(2rem,6vw,5rem)',
              boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
              animation: 'float 3s ease-in-out infinite',
            }}>
              {chapter.speakerEmoji}
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-char)', fontWeight: 700,
            fontSize: 'clamp(0.55rem,1.1vw,0.72rem)', color: 'white',
            background: chapter.speakerColor,
            padding: '2px 12px', borderRadius: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {chapter.speaker}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dialogue bubble */}
      <div style={{
        position: 'absolute', bottom: 'clamp(12px,3vh,28px)',
        left: 'clamp(12px,3vw,28px)', right: 'clamp(12px,3vw,28px)', zIndex: 10,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chapterIdx}-${slideIdx}`}
            className="chat-bubble"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            style={{ borderColor: chapter.bubbleAccent }}
          >
            <div className="bubble-speaker" style={{ color: chapter.speakerColor }}>
              {chapter.speaker}
            </div>
            <div className="bubble-text">{slide.text}</div>
            <div className="bubble-continue">
              {isVeryLast ? 'Click to begin your adventure! 🌸' : 'Click to continue ▶'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 'clamp(86px,17vh,180px)',
        left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(160px,30vw,280px)', height: '5px',
        background: 'rgba(255,255,255,0.15)', borderRadius: '3px',
        overflow: 'hidden', zIndex: 10,
      }}>
        <motion.div
          animate={{ width: `${(globalSlide / totalSlides) * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: chapter.bubbleAccent, borderRadius: '3px' }}
        />
      </div>

      {/* Skip button */}
      {!showSkipConfirm && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={e => { e.stopPropagation(); stopAudio(); setShowSkipConfirm(true); }}
          style={{
            position: 'absolute', top: 'clamp(38px,7vh,60px)',
            right: 'clamp(12px,3vw,24px)',
            background: 'rgba(0,0,0,0.45)', border: '1.5px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-accent)', fontWeight: 700,
            fontSize: 'clamp(0.6rem,1.1vw,0.72rem)', padding: '5px 14px',
            borderRadius: '50px', cursor: 'pointer', backdropFilter: 'blur(4px)',
            letterSpacing: '0.5px', zIndex: 20,
          }}
        >
          Skip Story ⏭
        </motion.button>
      )}

      {/* Skip confirmation overlay */}
      <AnimatePresence>
        {showSkipConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 30, backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                background: 'var(--surface)', border: `3px solid ${chapter.bubbleAccent}`,
                borderRadius: '20px', padding: 'clamp(20px,4vh,36px) clamp(24px,5vw,48px)',
                textAlign: 'center', width: 'clamp(260px,42vw,420px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '8px' }}>⏭️</div>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.4vw,1.5rem)',
                color: 'var(--olive-brown)', marginBottom: '8px',
              }}>
                Skip the Story?
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(0.66rem,1.4vw,0.84rem)',
                color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px',
              }}>
                You'll jump straight to the grammar tutorial before your first quiz.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <motion.button
                  className="btn btn-ghost"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSkipConfirm(false)}
                >
                  ← Keep Reading
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowSkipConfirm(false); proceedToGame(); }}
                >
                  Skip to Tutorial ⚡
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}