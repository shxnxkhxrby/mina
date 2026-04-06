import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { SECTION_D } from '../data/sectionD';

// ── Canvas roundRect helper ────────────────────────────────────────────────
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

// ── PNG certificate generator ──────────────────────────────────────────────
async function exportCertificateAsPng(
  playerName: string,
  correct: number,
  total: number,
  pct: number,
  grade: string,
  dateStr: string,
  isAdvanced: boolean,
): Promise<void> {
  const W = 1120, H = 760;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  if (isAdvanced) {
    bg.addColorStop(0, '#EEF2FF'); bg.addColorStop(0.5, '#E8EEFF'); bg.addColorStop(1, '#DDE3FF');
  } else {
    bg.addColorStop(0, '#FFFDE7'); bg.addColorStop(0.5, '#FFF8C4'); bg.addColorStop(1, '#FFEEA0');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const accent  = isAdvanced ? '#3A4DB8' : '#C8860A';
  const accent2 = isAdvanced ? '#5B6FD4' : '#F5C518';

  ctx.strokeStyle = accent; ctx.lineWidth = 8;
  roundRect(ctx, 16, 16, W - 32, H - 32, 26); ctx.stroke();
  ctx.strokeStyle = accent2; ctx.lineWidth = 2;
  roundRect(ctx, 30, 30, W - 60, H - 60, 20); ctx.stroke();

  ctx.fillStyle = isAdvanced ? 'rgba(58,77,184,0.18)' : 'rgba(200,134,10,0.28)';
  [[55,55],[W-55,55],[55,H-55],[W-55,H-55]].forEach(([cx,cy]) => {
    ctx.save(); ctx.translate(cx as number, cy as number); ctx.rotate(Math.PI/4);
    ctx.fillRect(-8,-8,16,16); ctx.restore();
  });

  const hLine = (y: number) => {
    const g = ctx.createLinearGradient(80,y,W-80,y);
    g.addColorStop(0,'transparent'); g.addColorStop(0.12,accent);
    g.addColorStop(0.88,accent); g.addColorStop(1,'transparent');
    ctx.strokeStyle = g; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80,y); ctx.lineTo(W-80,y); ctx.stroke();
  };
  hLine(140); hLine(H - 140);

  ctx.textAlign = 'center';
  ctx.font = '80px serif';
  ctx.fillText(isAdvanced ? '⚡' : '🏆', W/2, 128);

  ctx.font = 'bold 17px Arial, sans-serif';
  ctx.fillStyle = isAdvanced ? '#2A3580' : '#8A6000';
  ctx.fillText(
    isAdvanced
      ? 'C E R T I F I C A T E   O F   A D V A N C E D   M A S T E R Y'
      : 'C E R T I F I C A T E   O F   C O M P L E T I O N',
    W/2, 175,
  );

  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillStyle = isAdvanced ? '#4A5AC0' : '#9A7A40';
  ctx.fillText('This is to certify that', W/2, 218);

  const nameSize = Math.max(36, Math.min(80, Math.floor(1400 / Math.max(playerName.length, 1))));
  ctx.font = `bold ${nameSize}px Georgia, serif`;
  ctx.fillStyle = '#C8547A';
  ctx.fillText(playerName, W/2, 318);

  ctx.font = '18px Arial, sans-serif';
  ctx.fillStyle = '#4A3000';
  ctx.fillText('has successfully completed', W/2, 365);
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = '#2A1800';
  ctx.fillText(isAdvanced ? 'Minasa: Grammar Quest \u2014 Advanced Mode' : 'Minasa: Grammar Quest', W/2, 398);

  ctx.font = '15px Arial, sans-serif';
  ctx.fillStyle = isAdvanced ? '#4A5AC0' : '#8A6A30';
  ctx.fillText('Exploring the Minasa Festival in Bustos, Bulacan', W/2, 434);
  ctx.fillText('Perfect Tenses  \u00b7  Subject-Verb Agreement  \u00b7  Prepositions', W/2, 458);

  const bW = 380, bH = 46, bX = (W-bW)/2, bY = 486;
  const badgeGrad = ctx.createLinearGradient(bX,0,bX+bW,0);
  badgeGrad.addColorStop(0, accent); badgeGrad.addColorStop(1, accent2);
  ctx.fillStyle = badgeGrad;
  roundRect(ctx, bX, bY, bW, bH, 23); ctx.fill();
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText(`\uD83C\uDFC6  ${correct}/${total}  \u00b7  ${pct}%  \u00b7  ${grade}`, W/2, bY+31);

  ctx.font = '13px Arial, sans-serif';
  ctx.fillStyle = isAdvanced ? '#4A5AC0' : '#9A7A40';
  ctx.fillText(`${dateStr}   \u00b7   EL306 Language Learning Materials`, W/2, H - 58);

  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${isAdvanced ? 'Advanced_' : ''}${playerName.replace(/\s+/g,'_')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// ── Print: fully self-contained HTML that mirrors the PNG exactly ──────────
//    No dependency on app CSS variables or viewport units. All sizes fixed.
function printCertificate(
  playerName: string,
  correct: number,
  total: number,
  pct: number,
  grade: string,
  dateStr: string,
  isAdvanced: boolean,
): void {
  const accent   = isAdvanced ? '#3A4DB8' : '#C8860A';
  const accent2  = isAdvanced ? '#5B6FD4' : '#F5C518';
  const bgStart  = isAdvanced ? '#EEF2FF' : '#FFFDE7';
  const bgMid    = isAdvanced ? '#E8EEFF' : '#FFF8C4';
  const bgEnd    = isAdvanced ? '#DDE3FF' : '#FFEEA0';
  const titleCol  = isAdvanced ? '#2A3580' : '#8A6000';
  const italicCol = isAdvanced ? '#4A5AC0' : '#9A7A40';
  const subCol    = isAdvanced ? '#4A5AC0' : '#8A6A30';
  const hRule     = `linear-gradient(90deg,transparent,${accent} 15%,${accent} 85%,transparent)`;
  const badgeBg   = `linear-gradient(135deg,${accent},${accent2})`;
  const iconChar  = isAdvanced ? '\u26A1' : '\uD83C\uDFC6';
  const certLabel = isAdvanced
    ? 'C E R T I F I C A T E &nbsp; O F &nbsp; A D V A N C E D &nbsp; M A S T E R Y'
    : 'C E R T I F I C A T E &nbsp; O F &nbsp; C O M P L E T I O N';
  const questTitle = isAdvanced
    ? 'Minasa: Grammar Quest \u2014 Advanced Mode'
    : 'Minasa: Grammar Quest';
  const nameSize = Math.max(36, Math.min(72, Math.floor(1000 / Math.max(playerName.length, 1))));

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Certificate</title>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    @page{size:landscape;margin:0;}
    html,body{
      width:100%;height:100%;
      display:flex;align-items:center;justify-content:center;
      background:#fff;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
    }
    .cert{
      width:1050px;height:700px;
      background:linear-gradient(135deg,${bgStart},${bgMid} 50%,${bgEnd});
      border:8px solid ${accent};
      border-radius:24px;
      outline:2px solid ${accent2};
      outline-offset:-18px;
      position:relative;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      gap:12px;
      padding:52px 64px 42px;
      font-family:'Nunito',Arial,sans-serif;
    }
    .corner{
      position:absolute;width:14px;height:14px;
      background:${isAdvanced ? 'rgba(58,77,184,0.4)' : 'rgba(200,134,10,0.45)'};
      transform:rotate(45deg);
    }
    .tl{top:22px;left:22px;} .tr{top:22px;right:22px;}
    .bl{bottom:22px;left:22px;} .br{bottom:22px;right:22px;}
    .hrule{width:75%;height:1.5px;background:${hRule};flex-shrink:0;}
    .icon{font-size:56px;line-height:1;}
    .cert-title{font-weight:700;font-size:13.5px;color:${titleCol};letter-spacing:3px;text-transform:uppercase;text-align:center;}
    .certify{font-family:Georgia,serif;font-style:italic;font-size:15px;color:${italicCol};}
    .name{font-family:'Baloo 2',Georgia,serif;font-weight:800;font-size:${nameSize}px;color:#C8547A;line-height:1.1;text-align:center;word-break:break-word;max-width:90%;}
    .completed{font-size:16px;color:#4A3000;text-align:center;}
    .completed strong{font-weight:700;color:#2A1800;}
    .subline{font-size:14px;color:${subCol};text-align:center;line-height:1.65;}
    .badge{background:${badgeBg};color:white;font-family:'Baloo 2',Georgia,serif;font-weight:800;font-size:17px;padding:9px 36px;border-radius:50px;text-align:center;flex-shrink:0;}
    .dateline{font-size:13px;color:${italicCol};text-align:center;}
  </style>
</head>
<body>
<div class="cert">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="hrule"></div>
  <div class="icon">${iconChar}</div>
  <div class="cert-title">${certLabel}</div>
  <div class="certify">This is to certify that</div>
  <div class="name">${playerName}</div>
  <div class="completed">has successfully completed <strong>${questTitle}</strong></div>
  <div class="subline">Exploring the Minasa Festival in Bustos, Bulacan<br/>Perfect Tenses &middot; Subject-Verb Agreement &middot; Prepositions</div>
  <div class="badge">\uD83C\uDFC6 &nbsp;${correct}/${total} &middot; ${pct}% &middot; ${grade}</div>
  <div class="hrule"></div>
  <div class="dateline">${dateStr} &middot; EL306 Language Learning Materials</div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print();},800);};</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ScoreSummary() {
  const { overallScore, advancedScore, sectionProgress, advancedSectionProgress, playerName, goToScene, isAdvancedMode } = useGameStore();
  const [downloading, setDownloading] = useState(false);

  const score    = isAdvancedMode ? (advancedScore ?? overallScore) : overallScore;
  const progress = isAdvancedMode ? (advancedSectionProgress ?? sectionProgress) : sectionProgress;

  const pct   = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const today = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
  const grade =
    pct >= 90 ? 'Outstanding' :
    pct >= 80 ? 'Excellent'   :
    pct >= 70 ? 'Very Good'   :
    pct >= 60 ? 'Good'        : 'Keep Practicing';
  const gradeEmoji = pct >= 90 ? '🏆' : pct >= 80 ? '🌟' : pct >= 70 ? '⭐' : pct >= 60 ? '👍' : '💪';

  const handleDownloadPng = async () => {
    setDownloading(true);
    try { await exportCertificateAsPng(playerName, score.correct, score.total, pct, grade, today, isAdvancedMode); }
    finally { setDownloading(false); }
  };

  const handlePrint = () => {
    printCertificate(playerName, score.correct, score.total, pct, grade, today, isAdvancedMode);
  };

  const sectionRows = isAdvancedMode
    ? SECTIONS.map(s => {
        const prog = progress[s.id] || {};
        const completed = s.stores.filter(st => prog[st.id]?.completed).length;
        const pts = s.stores.reduce((a, st) => a + (prog[st.id]?.bestScore || 0), 0);
        return { emoji: s.emoji, name: `${s.name} \u2014 ${s.grammarTopic}`, sub: `${completed}/${s.stores.length} levels \u00b7 ${pts}/${s.stores.length * 5} pts`, stars: s.stores.map(st => !!prog[st.id]?.completed) };
      })
    : [
        ...SECTIONS.map(s => {
          const prog = progress[s.id] || {};
          const completed = s.stores.filter(st => prog[st.id]?.completed).length;
          const pts = s.stores.reduce((a, st) => a + (prog[st.id]?.bestScore || 0), 0);
          return { emoji: s.emoji, name: `${s.name} \u2014 ${s.grammarTopic}`, sub: `${completed}/${s.stores.length} stores \u00b7 ${pts}/${s.stores.length * 5} pts`, stars: s.stores.map(st => !!prog[st.id]?.completed) };
        }),
        (() => {
          const prog = progress['D'] || {};
          const completed = SECTION_D.stores.filter(st => prog[st.id]?.completed).length;
          const pts = SECTION_D.stores.reduce((a, st) => a + (prog[st.id]?.bestScore || 0), 0);
          return { emoji: '💃', name: 'Grammar Street Dance Challenge \u2014 Mixed Grammar Review', sub: `${completed}/${SECTION_D.stores.length} stores \u00b7 ${pts}/${SECTION_D.stores.length * 5} pts`, stars: SECTION_D.stores.map(st => !!prog[st.id]?.completed) };
        })(),
      ];

  const advancedAccent  = '#5B6FD4';
  const advancedAccent2 = '#3A4DB8';
  const accentColor = isAdvancedMode ? advancedAccent : 'var(--pink-btn)';
  const certBorder  = isAdvancedMode ? '#3A4DB8' : '#C8860A';
  const certInner   = isAdvancedMode ? 'rgba(91,111,212,0.5)' : 'rgba(200,134,10,0.5)';
  const certDiamond = isAdvancedMode ? 'rgba(58,77,184,0.4)' : 'rgba(200,134,10,0.5)';
  const hRule  = isAdvancedMode
    ? 'linear-gradient(90deg,transparent,#3A4DB8 20%,#3A4DB8 80%,transparent)'
    : 'linear-gradient(90deg,transparent,#C8860A 20%,#C8860A 80%,transparent)';
  const titleCol  = isAdvancedMode ? '#2A3580' : '#8A6000';
  const italicCol = isAdvancedMode ? '#4A5AC0' : '#9A7A40';
  const subCol    = isAdvancedMode ? '#4A5AC0' : '#8A6A30';

  return (
    <div className="scene" style={{
      background: isAdvancedMode
        ? 'linear-gradient(160deg,#EEF2FF,#E0E6FF 50%,#D4DAFF)'
        : 'linear-gradient(160deg,#FFF8E7,#F0EBD8 50%,#E8D8B8)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div className="bunting" />

      {/* Confetti */}
      {Array.from({length:16}).map((_,i) => (
        <div key={i} style={{
          position:'fixed', left:`${(i*6.25)%100}%`, top:'-20px',
          width:`${6+(i%3)*3}px`, height:`${6+(i%3)*3}px`,
          borderRadius:i%2===0?'50%':'2px',
          background: isAdvancedMode
            ? ['#5B6FD4','#F5C518','#3A9E5C','#E8547A','#fff'][i%5]
            : ['#E85D26','#F5C518','#5B7A3D','#E8547A','#fff'][i%5],
          animation:`confetti-fall ${2+(i%3)}s ${(i*0.18)%2}s ease-out forwards`,
          zIndex:0, pointerEvents:'none',
        }}/>
      ))}

      {/* Header */}
      <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}
        style={{ textAlign:'center', padding:'clamp(28px,5vh,44px) 16px clamp(4px,1vh,8px)', zIndex:1, position:'relative', flexShrink:0 }}
      >
        <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(1.1rem,2.5vw,1.9rem)', color:accentColor, textShadow:isAdvancedMode?'2px 3px 0 rgba(58,77,184,0.25)':'2px 3px 0 rgba(196,56,96,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
          {isAdvancedMode ? '⚡ Advanced Mode Complete!' : `Quest Complete! ${gradeEmoji}`}
          {isAdvancedMode && <span style={{ fontSize:'clamp(0.55rem,1vw,0.7rem)', background:'rgba(91,111,212,0.92)', color:'white', padding:'2px 10px', borderRadius:'20px', fontFamily:'var(--font-char)', fontWeight:700, letterSpacing:'1px' }}>⚡ ADVANCED</span>}
        </div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.52rem,1vw,0.68rem)', color:'var(--text-muted)', marginTop:'2px' }}>
          Congratulations, {playerName}! {isAdvancedMode ? "You've mastered the grammar challenges!" : "You've explored the Minasa Festival!"}
        </div>
      </motion.div>

      {/* Two-column body */}
      <div style={{
        flex:1, display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:'clamp(8px,1.6vw,18px)',
        padding:'0 clamp(12px,2.5vw,28px) clamp(10px,2vh,18px)',
        zIndex:1, position:'relative', minHeight:0, overflow:'hidden', alignItems:'center',
      }}>

        {/* LEFT: Score + Sections */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(6px,1.2vh,12px)', height:'100%', justifyContent:'center', minHeight:0 }}>

          {/* Score card */}
          <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.1}}
            className="panel"
            style={{ border:`2.5px solid ${accentColor}`, textAlign:'center', padding:'clamp(10px,1.8vh,18px) clamp(12px,2vw,22px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'clamp(4px,0.8vh,10px)', flexShrink:0 }}
          >
            <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(0.9rem,1.8vw,1.3rem)', color:accentColor }}>
              {isAdvancedMode ? '⚡ Advanced Score' : 'Overall Score'}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'clamp(10px,2vw,22px)' }}>
              <div>
                <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(2.2rem,4.5vw,3.8rem)', color:isAdvancedMode?advancedAccent:'var(--orange-red)', lineHeight:1 }}>{pct}%</div>
                <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.65rem,1.1vw,0.85rem)', color:'var(--text-muted)' }}>{score.correct}/{score.total} correct</div>
              </div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(0.9rem,1.8vw,1.35rem)', color:'var(--olive-brown)' }}>{grade}</div>
                <div style={{ fontSize:'clamp(1.3rem,2.5vw,2rem)' }}>{gradeEmoji}</div>
              </div>
            </div>
            <div className="progress-bar" style={{ width:'100%' }}>
              <motion.div className="progress-fill" initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ delay:0.5, duration:1, ease:'easeOut' }}
                style={isAdvancedMode ? { background:`linear-gradient(90deg,${advancedAccent},${advancedAccent2})` } : undefined}
              />
            </div>
            <div style={{ display:'flex', gap:'4px', justifyContent:'center', flexWrap:'wrap' }}>
              {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize:'clamp(1rem,2vw,1.6rem)' }}>{n <= Math.round(pct/20) ? '⭐' : '☆'}</span>)}
            </div>
            {isAdvancedMode && overallScore.total > 0 && (
              <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.44rem,0.85vw,0.6rem)', color:'var(--text-muted)', background:'rgba(91,111,212,0.07)', borderRadius:'8px', padding:'4px 10px', border:`1px solid ${advancedAccent}22` }}>
                📖 Story mode: {overallScore.correct}/{overallScore.total} ({Math.round((overallScore.correct/overallScore.total)*100)}%)
              </div>
            )}
          </motion.div>

          {/* Section breakdown */}
          <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.18}}
            style={{ display:'flex', flexDirection:'column', gap:'clamp(4px,0.7vh,7px)', flex:1, minHeight:0, overflow:'hidden' }}
          >
            <div style={{ fontFamily:'var(--font-accent)', fontWeight:700, fontSize:'clamp(0.68rem,1.2vw,0.88rem)', color:'var(--olive-brown)', letterSpacing:'1px', textTransform:'uppercase' as const, flexShrink:0 }}>
              📊 Section Breakdown
            </div>
            <div style={{ flex:1, minHeight:0, overflow:'hidden', display:'flex', flexDirection:'column', gap:'clamp(4px,0.6vh,6px)' }}>
              {sectionRows.map((row, ri) => (
                <motion.div key={ri} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:0.25+ri*0.05}}
                  style={{ background:'rgba(255,255,255,0.84)', borderRadius:'9px', padding:'clamp(6px,1vh,10px) clamp(10px,1.5vw,14px)', display:'flex', alignItems:'center', gap:'8px', border:'1.5px solid rgba(200,160,0,0.18)', flex:'1 1 0', minHeight:0, overflow:'hidden' }}
                >
                  <span style={{ fontSize:'clamp(1rem,1.8vw,1.3rem)', flexShrink:0 }}>{row.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-accent)', fontWeight:700, fontSize:'clamp(0.62rem,1.1vw,0.82rem)', color:'var(--olive-brown)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{row.name}</div>
                    <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.54rem,0.9vw,0.7rem)', color:'var(--text-muted)' }}>{row.sub}</div>
                  </div>
                  <div style={{ display:'flex', gap:'2px', flexShrink:0 }}>
                    {row.stars.map((s, si) => <span key={si} style={{ fontSize:'clamp(0.65rem,1.1vw,0.85rem)' }}>{s ? '⭐' : '☆'}</span>)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Certificate + Buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(6px,1.2vh,12px)', height:'100%', justifyContent:'center', minHeight:0 }}>

          {/* Certificate preview — all text sizes bumped up from previous version */}
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:0.12}}
            style={{
              flex:1, minHeight:0,
              background: isAdvancedMode ? 'linear-gradient(135deg,#EEF2FF 0%,#E8EEFF 50%,#DDE3FF 100%)' : 'linear-gradient(135deg,#FFFDE7 0%,#FFF8C4 50%,#FFEEA0 100%)',
              border:`4px solid ${certBorder}`,
              borderRadius:'12px',
              boxShadow: isAdvancedMode ? '0 4px 20px rgba(58,77,184,0.2), inset 0 0 0 2px rgba(91,111,212,0.3)' : '0 4px 20px rgba(180,120,0,0.18), inset 0 0 0 2px #F5C518',
              position:'relative', overflow:'hidden',
              display:'flex', flexDirection:'column', alignItems:'stretch',
            }}
          >
            {/* Inner border */}
            <div style={{ position:'absolute', inset:'8px', border:`1.5px solid ${certInner}`, borderRadius:'7px', pointerEvents:'none', zIndex:1 }} />
            {/* Corner diamonds */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <div key={c} style={{ position:'absolute', zIndex:2, top:c.startsWith('t')?13:'auto', bottom:c.startsWith('b')?13:'auto', left:c.endsWith('l')?13:'auto', right:c.endsWith('r')?13:'auto', width:10, height:10, background:certDiamond, transform:'rotate(45deg)' }} />
            ))}

            {/* Content */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'clamp(5px,0.85vh,9px)', padding:'clamp(18px,3vh,30px) clamp(18px,2.8vw,32px)', textAlign:'center', zIndex:3 }}>

              <div style={{ width:'75%', height:'1.5px', flexShrink:0, background:hRule }} />

              <div style={{ fontSize:'clamp(2.2rem,4vw,3.5rem)', lineHeight:1, flexShrink:0 }}>
                {isAdvancedMode ? '⚡' : '🏆'}
              </div>

              {/* Bumped: was 0.58–0.78rem, now 0.75–0.96rem */}
              <div style={{ fontFamily:'var(--font-body)', fontWeight:700, fontSize:'clamp(0.75rem,1.25vw,0.96rem)', color:titleCol, letterSpacing:'2.5px', textTransform:'uppercase' as const }}>
                {isAdvancedMode ? 'Certificate of Advanced Mastery' : 'Certificate of Completion'}
              </div>

              {/* Bumped: was 0.6–0.78rem, now 0.75–0.92rem */}
              <div style={{ fontFamily:'Georgia,serif', fontStyle:'italic', fontSize:'clamp(0.75rem,1.2vw,0.92rem)', color:italicCol }}>
                This is to certify that
              </div>

              {/* Bumped: was 1.4–2.6rem, now 1.7–3.2rem */}
              <div style={{ fontFamily:'var(--font-title)', fontSize:'clamp(1.7rem,3.8vw,3.2rem)', color:'var(--pink-btn)', lineHeight:1.1, wordBreak:'break-word' as const, maxWidth:'90%' }}>
                {playerName}
              </div>

              {/* Bumped: was 0.6–0.8rem, now 0.75–0.96rem */}
              <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.75rem,1.25vw,0.96rem)', color:'#4A3000', lineHeight:1.5 }}>
                has successfully completed <strong>{isAdvancedMode ? 'Minasa: Grammar Quest \u2014 Advanced Mode' : 'Minasa: Grammar Quest'}</strong>
              </div>

              {/* Bumped: was 0.55–0.72rem, now 0.68–0.85rem */}
              <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.68rem,1.1vw,0.85rem)', color:subCol, lineHeight:1.55 }}>
                Exploring the Minasa Festival in Bustos, Bulacan<br/>
                Perfect Tenses · Subject-Verb Agreement · Prepositions
              </div>

              {/* Score badge — bumped: was 0.6–0.8rem, now 0.75–0.96rem */}
              <div style={{
                background: isAdvancedMode ? 'linear-gradient(135deg,#3A4DB8,#5B6FD4)' : 'linear-gradient(135deg,#C8860A,#F5C518)',
                color:'white', fontFamily:'var(--font-title)', fontWeight:700,
                fontSize:'clamp(0.75rem,1.25vw,0.96rem)',
                padding:'clamp(6px,1vh,10px) clamp(18px,3vw,32px)',
                borderRadius:'50px', flexShrink:0,
                boxShadow: isAdvancedMode ? '0 2px 8px rgba(58,77,184,0.4)' : '0 2px 8px rgba(200,134,10,0.4)',
              }}>
                🏆 {score.correct}/{score.total} · {pct}% · {grade}
              </div>

              <div style={{ width:'75%', height:'1.5px', flexShrink:0, background:hRule }} />

              {/* Bumped: was 0.5–0.65rem, now 0.62–0.78rem */}
              <div style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.62rem,1vw,0.78rem)', color:italicCol }}>
                {today} · EL306 Language Learning Materials
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
            style={{ display:'flex', gap:'clamp(4px,0.7vw,8px)', flexWrap:'wrap', justifyContent:'center', flexShrink:0 }}
          >
            <motion.button className="btn btn-primary btn-sm" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
              onClick={handleDownloadPng} disabled={downloading}
              style={{ fontSize:'clamp(0.6rem,1vw,0.76rem)', padding:'7px 13px', ...(isAdvancedMode ? { background:advancedAccent, borderColor:advancedAccent } : {}) }}>
              {downloading ? '⏳ Saving…' : '⬇ Download PNG'}
            </motion.button>
            <motion.button className="btn btn-secondary btn-sm" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
              onClick={handlePrint}
              style={{ fontSize:'clamp(0.6rem,1vw,0.76rem)', padding:'7px 13px' }}>
              🖨 Print
            </motion.button>
            <motion.button className="btn btn-ghost btn-sm" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
              onClick={() => goToScene('MAP')}
              style={{ fontSize:'clamp(0.6rem,1vw,0.76rem)', padding:'7px 13px' }}>
              🗺 Map
            </motion.button>
            <motion.button className="btn btn-ghost btn-sm" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
              onClick={() => { useGameStore.getState().resetGame(); useGameStore.getState().goToScene('MAIN_MENU'); }}
              style={{ fontSize:'clamp(0.6rem,1vw,0.76rem)', padding:'7px 13px' }}>
              🔄 Play Again
            </motion.button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}