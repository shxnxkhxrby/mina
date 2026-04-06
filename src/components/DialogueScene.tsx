import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueLine { speaker: string; text: string; }
interface Props {
  lines: DialogueLine[];
  speakerEmoji: string;
  speakerImage?: string;
  title?: string;
  onFinish: () => void;
}

export default function DialogueScene({ lines, speakerEmoji, speakerImage, onFinish, title }: Props) {
  const [idx, setIdx] = useState(0);
  const current = lines[idx];
  const isLast = idx===lines.length-1;
  const advance = () => { if(isLast) onFinish(); else setIdx(i=>i+1); };

  return (
    <div onClick={advance} style={{ position:'fixed', inset:0, cursor:'pointer', overflow:'hidden',
      background:'linear-gradient(160deg,#FFF8E7 0%,#F0EBD8 40%,#E8D8B8 100%)' }}>
      {[
        {size:'200px',top:'-50px',left:'-50px',color:'rgba(245,197,24,0.12)'},
        {size:'140px',bottom:'100px',right:'-30px',color:'rgba(232,84,122,0.08)'},
        {size:'100px',top:'35%',right:'18%',color:'rgba(91,122,61,0.08)'},
      ].map((c,i)=>(
        <div key={i} style={{ position:'absolute', width:c.size, height:c.size, borderRadius:'50%',
          background:c.color, top:c.top, bottom:c.bottom, left:c.left, right:c.right }}/>
      ))}
      <div className="bunting"/>
      {title && (
        <div style={{
          position:'absolute', top:'clamp(40px,7.5vh,66px)', left:'50%', transform:'translateX(-50%)',
          fontFamily:'var(--font-title)', fontSize:'clamp(0.85rem,2vw,1.3rem)',
          color:'var(--olive-brown)', background:'rgba(255,248,231,0.92)',
          padding:'4px 18px', borderRadius:'50px', border:'2px solid var(--golden)',
          whiteSpace:'nowrap', zIndex:10, boxShadow:'0 2px 12px var(--shadow)',
        }}>{title}</div>
      )}
      {/* Portrait */}
      <motion.div key={`p-${idx}`} initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}}
        style={{
          position:'absolute', bottom:'clamp(110px,22vh,230px)', left:'clamp(16px,4vw,52px)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
        }}>
        <div style={{
          width:'clamp(90px,17vw,190px)', height:'clamp(90px,17vw,190px)',
          borderRadius:'20px', border:'4px solid var(--golden)',
          background:'rgba(255,248,231,0.95)', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'clamp(3rem,8vw,6rem)', boxShadow:'0 6px 24px var(--shadow)',
          animation:'float 3s ease-in-out infinite',
        }}>
          {speakerImage
            ? <img src={speakerImage} alt={current.speaker} style={{width:'100%',height:'100%',objectFit:'cover'}}
                onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
            : speakerEmoji}
        </div>
        <div style={{
          fontFamily:'var(--font-accent)', fontWeight:700,
          fontSize:'clamp(0.58rem,1.2vw,0.78rem)',
          color:'white', background:'var(--olive-brown)',
          padding:'2px 12px', borderRadius:'50px',
        }}>{current.speaker}</div>
      </motion.div>
      {/* Dialogue */}
      <div style={{
        position:'absolute', bottom:'clamp(12px,3vh,32px)',
        left:'clamp(12px,3vw,32px)', right:'clamp(12px,3vw,32px)',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={idx} className="dialogue-box"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-5}} transition={{duration:0.22}}>
            <div className="speaker-name">{current.speaker}</div>
            <div className="dialogue-text">{current.text}</div>
            <div className="click-hint">{isLast?'Click to continue →':'Click to continue ▶'}</div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{
        position:'absolute', bottom:'clamp(88px,17vh,180px)',
        left:'50%', transform:'translateX(-50%)', display:'flex', gap:'5px',
      }}>
        {lines.map((_,i)=>(
          <div key={i} style={{
            width:i===idx?'18px':'7px', height:'7px', borderRadius:'4px',
            background:i<=idx?'var(--golden)':'rgba(122,107,61,0.3)', transition:'all 0.3s',
          }}/>
        ))}
      </div>
    </div>
  );
}
