import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function ProfessionalPlaceholder() {
  const { goToScene } = useGameStore();
  return (
    <div className="scene" style={{
       background:'linear-gradient(160deg,#FFF8E7,#F0EBD8 50%,#E8D8B8)', overflow:'hidden',
    }}>
      <div className="bunting"/>
      <motion.div
        className="panel"
        initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
        transition={{type:'spring',stiffness:180,damping:18}}
        style={{ width:'clamp(270px,52vw,540px)', textAlign:'center', border:'3px solid var(--teal)', zIndex:1, position:'relative' }}
      >
        <div style={{ fontSize:'clamp(2.2rem,5.5vw,4.5rem)', marginBottom:'7px' }}>🚀</div>
        <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(1.1rem,2.8vw,1.9rem)', color:'var(--teal)', marginBottom:'5px' }}>
          Professional Mode
        </div>
        <div style={{
          display:'inline-block', background:'var(--teal)', color:'white',
          fontFamily:'var(--font-accent)', fontWeight:700,
          fontSize:'clamp(0.62rem,1.3vw,0.82rem)',
          padding:'3px 14px', borderRadius:'50px', marginBottom:'14px', letterSpacing:'2px',
        }}>COMING SOON</div>
        <p style={{
          fontFamily:'var(--font-body)', fontSize:'clamp(0.65rem,1.4vw,0.85rem)',
          color:'var(--text-muted)', lineHeight:1.7, marginBottom:'14px',
        }}>Here's what's planned for Professional Mode:</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'9px', marginBottom:'18px', textAlign:'left' }}>
          {[
            {icon:'🎯',title:'Adaptive Difficulty',desc:'Easy, Medium, and Hard levels — choose your challenge.'},
            {icon:'🤖',title:'AI-Powered Questions',desc:'An AI analyzes your weak areas and targets them specifically.'},
            {icon:'📊',title:'Personal Analytics',desc:'Track your grammar improvement over time.'},
            {icon:'🏫',title:'Teacher Dashboard',desc:'Teachers can monitor all students\' progress in real time.'},
          ].map((f,i)=>(
            <motion.div key={i}
              initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.1}}
              style={{
                display:'flex', gap:'10px', alignItems:'flex-start',
                background:'var(--surface)', borderRadius:'10px', padding:'9px 12px',
              }}
            >
              <span style={{ fontSize:'clamp(1rem,2.4vw,1.4rem)', flexShrink:0 }}>{f.icon}</span>
              <div>
                <div style={{ fontFamily:'var(--font-accent)', fontWeight:700, fontSize:'clamp(0.62rem,1.3vw,0.82rem)', color:'var(--olive-brown)' }}>{f.title}</div>
                <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.58rem,1.1vw,0.74rem)', color:'var(--text-muted)' }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button className="btn btn-pink" whileHover={{scale:1.05}} whileTap={{scale:0.97}} onClick={()=>goToScene('MAIN_MENU')}>
          ← Back to Menu
        </motion.button>
      </motion.div>
    </div>
  );
}
