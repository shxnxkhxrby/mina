import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';

const GRAMMAR_LESSON_AUDIO: Record<string, string[]> = {
  A: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563615/6_l06ibr.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/7_mehoew.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/8_xtlyka.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/9_spph6a.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/10_ldciim.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563617/11_ktrb9e.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563617/12_cduwtz.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563618/13_ycrq7v.m4a',
  ],
  B: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563618/15_xd8vmw.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563619/16_eibuny.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563619/17_ov5yvd.m4a',
  ],
  C: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563620/20_arukqm.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/21_ht1kj7.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/22_sx7vkx.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/23_oxr6hf.m4a',
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563622/24_qwsdwu.m4a',
  ],
};

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
  const scallopTop = Array.from({ length: 60 }, (_, i) => `M${i * 20},24 Q${i * 20 + 10},0 ${i * 20 + 20},24`).join(' ');
  const scallopBottom = Array.from({ length: 60 }, (_, i) => `M${i * 20},0 Q${i * 20 + 10},24 ${i * 20 + 20},0`).join(' ');
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Top scallop — peaks pointing up */}
      <div style={{ position: 'absolute', top: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={scallopTop} fill="#F5C84A" />
        </svg>
      </div>
      <div style={{
        background: 'linear-gradient(180deg, #FFF8D6 0%, #FFEEA0 100%)',
        border: '4px solid #F5C84A', borderTop: 'none',
        borderRadius: '0 0 20px 20px',
        padding: 'clamp(12px,2.5vh,22px) clamp(14px,3.5vw,30px) clamp(12px,2.5vh,22px)',
        position: 'relative', boxShadow: '0 6px 28px rgba(180,120,0,0.18)', zIndex: 1,
      }}>
        {children}
      </div>
      {/* Bottom scallop — peaks pointing down */}
      <div style={{ position: 'absolute', bottom: '-18px', left: 0, right: 0, height: '20px', overflow: 'hidden', zIndex: 2 }}>
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path d={scallopBottom} fill="#F5C84A" />
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

function buildLessonPages(lesson: any, sectionId: string): LessonPage[] {
  const pages: LessonPage[] = [];

  if (sectionId === 'A') {
    pages.push({
      badge: '📚 PERFECT TENSES', badgeColor: ['#FF7A1A', '#E85D10'], title: 'Introduction',
      render: (_lesson, showCursor) => (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,2vw,1.15rem)', color: '#4A2800', lineHeight: 1.75, fontStyle: 'italic' }}>
          {_lesson.intro}<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10', fontStyle: 'normal' }}>▌</span>
        </div>
      ),
    });
    pages.push({
      badge: '⏮ PAST PERFECT', badgeColor: ['#C0392B', '#96281B'], title: 'Past Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Past Perfect Tense<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#C0392B' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(192,57,43,0.08)', border: '2.5px solid #C0392B', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#C0392B' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FDECEA 0%, #F9CCCA 100%)', border: '2.5px solid #C0392B', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#7B1C14', textAlign: 'center' as const }}>
            had + past participle
          </div>
        </>
      ),
    });
    pages.push({
      badge: '⏮ PAST PERFECT', badgeColor: ['#C0392B', '#96281B'], title: 'Past Perfect — Example',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Past Perfect — Example<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#C0392B' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FDECEA 0%, #F9CCCA 100%)', border: '2.5px solid #C0392B', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#7B1C14', textAlign: 'center' as const, marginBottom: '10px' }}>
            had + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[0]}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '⏺ PRESENT PERFECT', badgeColor: ['#27AE60', '#1E8449'], title: 'Present Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Present Perfect Tense<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#27AE60' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(39,174,96,0.08)', border: '2.5px solid #27AE60', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#27AE60' }}>📖 Rule:</strong> {_lesson.rule2}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '2.5px solid #27AE60', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#1A5C30', textAlign: 'center' as const }}>
            have / has + past participle
          </div>
        </>
      ),
    });
    pages.push({
      badge: '⏺ PRESENT PERFECT', badgeColor: ['#27AE60', '#1E8449'], title: 'Present Perfect — Example',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Present Perfect — Example<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#27AE60' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '2.5px solid #27AE60', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#1A5C30', textAlign: 'center' as const, marginBottom: '10px' }}>
            have / has + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[1]}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '⏭ FUTURE PERFECT', badgeColor: ['#2980B9', '#1F618D'], title: 'Future Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Future Perfect Tense<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#2980B9' }}>📖 Rule:</strong> {_lesson.rule3}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #EAF2FF 0%, #C8DEFF 100%)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#1A3A6B', textAlign: 'center' as const }}>
            will have + past participle
          </div>
        </>
      ),
    });
    pages.push({
      badge: '⏭ FUTURE PERFECT', badgeColor: ['#2980B9', '#1F618D'], title: 'Future Perfect — Example',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Future Perfect — Example<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #EAF2FF 0%, #C8DEFF 100%)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.95rem,2vw,1.25rem)', fontWeight: 700, color: '#1A3A6B', textAlign: 'center' as const, marginBottom: '10px' }}>
            will have + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[2]}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✅ SUMMARY', badgeColor: ['#8E44AD', '#6C3483'], title: 'Summary',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Remember All Three!<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#8E44AD' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#4A2800', lineHeight: 1.65, marginBottom: '10px' }}>
            {_lesson.summary}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #F5EEF8 0%, #E8DAEF 100%)', border: '2.5px solid #8E44AD', borderRadius: '14px', padding: '12px 16px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.78rem,1.6vw,0.98rem)', fontWeight: 700, color: '#4A235A', whiteSpace: 'pre-line' as const, lineHeight: 1.8 }}>
            {_lesson.formula}
          </div>
        </>
      ),
    });
  } else if (sectionId === 'B') {
    pages.push({
      badge: '📚 RULE 1', badgeColor: ['#FF7A1A', '#E85D10'], title: 'Rule of Proximity',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Rule 1: Proximity &amp; Intervening Phrases<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(232,93,16,0.08)', border: '2.5px solid #E85D10', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#E85D10' }}>📖 Rule 1:</strong> {_lesson.rule}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[0]}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✏️ RULE 2', badgeColor: ['#3A9E5C', '#217A42'], title: 'Quantifiers',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Quantifier Rule<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(58,158,92,0.08)', border: '2.5px solid #3A9E5C', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#3A9E5C' }}>📖 Rule 2:</strong> {_lesson.rule2}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[1]}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '💡 RULE 3', badgeColor: ['#5B6FD4', '#3A4DB8'], title: 'Noncount & Plural-only Nouns',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Noncount & Plural-only Nouns<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#5B6FD4' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(91,111,212,0.08)', border: '2.5px solid #5B6FD4', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#5B6FD4' }}>📖 Rule 3:</strong> {_lesson.rule3}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[2]}
          </div>
        </>
      ),
    });
  } else if (sectionId === 'C') {
    pages.push({
      badge: '📚 PREPOSITIONS', badgeColor: ['#2980B9', '#1F618D'], title: 'Prepositions of Time',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.85rem,1.9vw,1.08rem)', color: '#4A2800', fontStyle: 'italic', marginBottom: '10px', lineHeight: 1.65 }}>
            {_lesson.intro}<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9', fontStyle: 'normal' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#2980B9' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '📚 PREPOSITIONS OF TIME', badgeColor: ['#2980B9', '#1F618D'], title: 'Prepositions of Time — Examples',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Examples<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9' }}>▌</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[_lesson.examples[0], _lesson.examples[1], _lesson.examples[2]].filter(Boolean).map((ex: string, i: number) => (
              <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem,1.7vw,1rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '7px 12px' }}>
                💬 {ex}
              </div>
            ))}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✏️ PREPOSITIONS OF MANNER', badgeColor: ['#3A9E5C', '#217A42'], title: 'Prepositions of Manner',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Prepositions of Manner<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(58,158,92,0.08)', border: '2.5px solid #3A9E5C', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#3A9E5C' }}>📖 Rule:</strong> {_lesson.rule2}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '2.5px solid #3A9E5C', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.88rem,1.9vw,1.12rem)', fontWeight: 700, color: '#1A5C30', whiteSpace: 'pre-line' as const, textAlign: 'center' as const }}>
            {_lesson.formula}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✏️ MANNER', badgeColor: ['#3A9E5C', '#217A42'], title: 'Prepositions of Manner — Examples',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Prepositions of Manner — Examples<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[_lesson.examples[3], _lesson.examples[4], _lesson.examples[5]].filter(Boolean).map((ex: string, i: number) => (
              <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.78rem,1.65vw,0.98rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '7px 12px' }}>
                💬 {ex}
              </div>
            ))}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '🚀 READY TO PRACTICE', badgeColor: ['#8E44AD', '#6C3483'], title: "You're Ready!",
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '12px' }}>
            You&apos;re Ready to Practice!<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#8E44AD' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.85rem,1.9vw,1.08rem)', color: '#4A2800', lineHeight: 1.7, background: 'linear-gradient(135deg, #F5EEF8 0%, #E8DAEF 100%)', border: '2.5px solid #8E44AD', borderRadius: '14px', padding: '14px 18px' }}>
            {_lesson.summary}
          </div>
        </>
      ),
    });
  } else {
    pages.push({
      badge: '📚 LESSON', badgeColor: ['#FF7A1A', '#E85D10'], title: 'Grammar Rule',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.8vw,1.9rem)', color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px' }}>
            {_lesson.topic}<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.85rem,1.9vw,1.1rem)', color: '#6B4A00', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.5 }}>{_lesson.intro}</div>
          <div style={{ background: 'rgba(232,93,16,0.1)', border: '2.5px solid #E85D10', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.85rem,1.9vw,1.05rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#E85D10' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✏️ FORMULA', badgeColor: ['#3A9E5C', '#217A42'], title: 'The Formula',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '14px' }}>
            Remember this formula!<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '3px solid #3A9E5C', borderRadius: '14px', padding: '14px 18px', fontFamily: 'var(--font-char)', fontSize: 'clamp(1rem,2.4vw,1.45rem)', fontWeight: 700, color: '#1A5C30', textAlign: 'center' as const, whiteSpace: 'pre-line' as const }}>
            {_lesson.formula}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '💡 EXAMPLES', badgeColor: ['#5B6FD4', '#3A4DB8'], title: 'See It in Action',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.2vw,1.4rem)', color: '#2A1800', fontWeight: 800, marginBottom: '12px' }}>
            Examples from Bustos:<span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#5B6FD4' }}>▌</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {_lesson.examples.map((ex: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                style={{ background: 'linear-gradient(135deg, #EEF0FF 0%, #DDE1FF 100%)', border: '2.5px solid #5B6FD4', borderRadius: '12px', padding: '9px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.8vw,1.05rem)', color: '#2A1800', lineHeight: 1.55 }}>
                💬 {ex}
              </motion.div>
            ))}
          </div>
        </>
      ),
    });
  }

  return pages;
}

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
  if (!section || !currentSection) return null;
  const lesson = section.lesson;

  const LESSON_PAGES = buildLessonPages(lesson, currentSection as string);
  const isLast = page === LESSON_PAGES.length - 1;
  const current = LESSON_PAGES[page];
  const [gradStart, gradEnd] = current.badgeColor;

  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const sectionAudio = GRAMMAR_LESSON_AUDIO[currentSection as string] ?? GRAMMAR_LESSON_AUDIO.A;
    const src = sectionAudio[page];
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.currentTime = 0; };
  }, [page, currentSection]);

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const advance = () => {
    stopAudio();
    if (isLast) goToScene('SECTION_VIEW');
    else setPage(p => p + 1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
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

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      <div className="bunting" style={{ zIndex: 5 }} />

      {/* Mina mascot — bottom right, bigger */}
      <motion.div
        style={{
          position: 'absolute',
          right: 0, bottom: 0,
          zIndex: 10, pointerEvents: 'none',
        }}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 }}
      >
        <motion.img
          src={ASSETS.minaMascot}
          alt="Mina"
          style={{
            width: 'clamp(160px,26vw,320px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))', display: 'block',
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </motion.div>

      {/* Lesson box — centered, leaves room for Mina */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        width: 'clamp(280px, 72vw, 720px)',
        maxWidth: 'calc(100vw - clamp(100px,20vw,220px) - 24px)',
        marginRight: 'clamp(90px,16vw,200px)',
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
                fontSize: 'clamp(0.82rem, 1.8vw, 1.15rem)',
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
                  fontSize: 'clamp(0.62rem, 1.2vw, 0.85rem)',
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