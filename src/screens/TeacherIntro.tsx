import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { TEACHER_DIALOGUES } from '../data/dialogues';
import { useVoiceAudio } from '../components/AudioManager';

// ── Audio for Teacher's 9 dialogue lines ─────────────────────────────────
const TEACHER_AUDIO = [
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563623/27_j7h9zv.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563623/28_w9z2vq.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563624/29_ehqqkk.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563624/30_rjo7it.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/31_ytdesq.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/32_jeswzg.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563625/33_evwij9.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563626/34_r6qfin.m4a',
  'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563657/35_qtd4eo.m4a',
];

export default function TeacherIntro() {
  const { goToScene } = useGameStore();
  const [idx, setIdx] = useState(0);
  const { play: playVoice, stop: stopVoice } = useVoiceAudio();

  const current = TEACHER_DIALOGUES[idx];
  const isLast = idx === TEACHER_DIALOGUES.length - 1;

  // Play audio for each teacher dialogue line
  useEffect(() => {
    playVoice(TEACHER_AUDIO[idx]);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    stopVoice();
    if (isLast) goToScene('MINA_INTRO');
    else setIdx(i => i + 1);
  };

  return (
    <div className="scene" style={{ cursor:'pointer', background:'linear-gradient(180deg,#E8D5A3 0%,#D4B896 40%,#C4A882 100%)' }} onClick={advance}>
      <div className="bunting"/>
      {/* Classroom label */}
      <div style={{
        position:'absolute', top:'clamp(38px,7vh,60px)', left:'50%', transform:'translateX(-50%)',
        fontFamily:'var(--font-title)', fontSize:'clamp(0.85rem,2vw,1.3rem)',
        color:'var(--olive-brown)', background:'rgba(255,248,231,0.9)',
        padding:'4px 18px', borderRadius:'50px', border:'2px solid var(--golden)',
        whiteSpace:'nowrap', zIndex:10,
      }}>📚 Classroom — Bustos National High School</div>

      {/* Teacher portrait — bottom left */}
      <motion.div key={`t-${idx}`} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
        style={{
          position:'absolute', bottom:'clamp(100px,20vh,200px)', left:'clamp(16px,4vw,48px)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:'5px',
        }}>
        <div style={{
          width:'clamp(80px,15vw,170px)', height:'clamp(80px,15vw,170px)',
          borderRadius:'16px', border:'4px solid var(--golden)',
          background:'rgba(255,248,231,0.95)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'clamp(2.5rem,7vw,5.5rem)',
          boxShadow:'0 6px 20px var(--shadow)',
          animation:'float 3s ease-in-out infinite',
        }}>👩‍🏫</div>
        <div style={{
          fontFamily:'var(--font-char)', fontWeight:700,
          fontSize:'clamp(0.58rem,1.2vw,0.78rem)',
          color:'white', background:'var(--olive-brown)',
          padding:'2px 12px', borderRadius:'50px',
        }}>Teacher</div>
      </motion.div>

      {/* Dialogue box at bottom */}
      <div style={{
        position:'absolute', bottom:'clamp(12px,3vh,28px)',
        left:'clamp(12px,3vw,28px)', right:'clamp(12px,3vw,28px)',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={idx} className="chat-bubble"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-5}} transition={{duration:0.22}}>
            <div className="bubble-speaker">Teacher</div>
            <div className="bubble-text">{current.text}</div>
            <div className="bubble-continue">{isLast ? 'Click to continue →' : 'Click to continue ▶'}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div style={{
        position:'absolute', bottom:'clamp(80px,16vh,170px)',
        left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px',
      }}>
        {TEACHER_DIALOGUES.map((_,i) => (
          <div key={i} style={{
            width:i===idx?'18px':'7px', height:'7px', borderRadius:'4px',
            background:i<=idx?'var(--golden)':'rgba(122,107,61,0.3)',
            transition:'all 0.3s',
          }}/>
        ))}
      </div>
    </div>
  );
}