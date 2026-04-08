import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';

// ── Audio URLs per section — one entry per lesson page ────────────────────
// Section A (Perfect Tenses): Voices 6–13 → files 8,7,9,10,11,12,13,14
//   Page 0 (Intro/Preamble):  file 8  — "Before you talk to shop owners, let's review perfect tenses"
//   Page 1 (Past Perfect):    file 7  — Past Perfect rule + file 9 = example (play both → use 8_xtlyka first then 9)
//   Page 2 (Present Perfect): file 10 — Present Perfect rule
//   Page 3 (Future Perfect):  file 11 — Future Perfect rule
//   Page 4 (Summary):         file 13 — Summary of all three tenses
// Section B (SVA): Voices 15–18 → files 16,17,18,19
//   Page 0: file 16 — Rule 1 (Proximity)
//   Page 1: file 17 — Rule 2 (Quantifiers)
//   Page 2: file 18 — Rule 3 (Noncount/Plural-only)
// Section C (Prepositions): Voices 20–24 → files 21,22,23,24,25
//   Page 0: file 21 — Prepositions of time intro + examples
//   Page 1: file 23 — Prepositions of manner
//   Page 2: file 25 — "Now that you understand, you're ready"

const GRAMMAR_LESSON_AUDIO: Record<string, string[]> = {
  A: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/8_xtlyka.m4a',  // Page 0 — Preamble
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/7_mehoew.m4a',  // Page 1 — Past Perfect rule
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563616/10_ldciim.m4a', // Page 2 — Present Perfect rule
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563617/11_ktrb9e.m4a', // Page 3 — Future Perfect rule
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563618/13_ycrq7v.m4a', // Page 4 — Summary
  ],
  B: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563619/16_eibuny.m4a', // Page 0 — SVA Rule 1 (Proximity)
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563619/17_ov5yvd.m4a', // Page 1 — SVA Rule 2 (Quantifiers)
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563620/18_rldz2p.m4a', // Page 2 — SVA Rule 3 (Noncount)
  ],
  C: [
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/21_ht1kj7.m4a', // Page 0 — Voice 20: "Hi! Before you start conversing with the riders, let's review prepositions of time and manner"
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563621/23_oxr6hf.m4a', // Page 1 — Voice 22: "Prepositions of manner tell us how something happens"
    'https://res.cloudinary.com/dh2nmgq2m/video/upload/v1775563622/25_xf1dkb.m4a', // Page 2 — Voice 24: "Now that you understand prepositions of time and manner, you're ready to converse with the riders"
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

// Build pages dynamically from lesson data so each page matches its voice-over exactly
function buildLessonPages(lesson: any, sectionId: string): LessonPage[] {
  const pages: LessonPage[] = [];

  if (sectionId === 'A') {
    // Page 0 — Preamble (Voice 6 / file 8)
    pages.push({
      badge: '📚 PERFECT TENSES',
      badgeColor: ['#FF7A1A', '#E85D10'],
      title: 'Introduction',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.3rem,3.2vw,2.1rem)', color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px' }}>
            {_lesson.topic}
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,2vw,1.15rem)', color: '#6B4A00', fontStyle: 'italic', lineHeight: 1.6 }}>
            {_lesson.intro}
          </div>
        </>
      ),
    });

    // Page 1 — Past Perfect (Voice 7 / file 7)
    pages.push({
      badge: '⏮ PAST PERFECT',
      badgeColor: ['#C0392B', '#96281B'],
      title: 'Past Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Past Perfect Tense
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#C0392B' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(192,57,43,0.08)', border: '2.5px solid #C0392B', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#C0392B' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FDECEA 0%, #F9CCCA 100%)', border: '2.5px solid #C0392B', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(1rem,2.2vw,1.3rem)', fontWeight: 700, color: '#7B1C14', textAlign: 'center' as const }}>
            had + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[0]}
          </div>
        </>
      ),
    });

    // Page 2 — Present Perfect (Voice 9 / file 10)
    pages.push({
      badge: '⏺ PRESENT PERFECT',
      badgeColor: ['#27AE60', '#1E8449'],
      title: 'Present Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Present Perfect Tense
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#27AE60' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(39,174,96,0.08)', border: '2.5px solid #27AE60', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#27AE60' }}>📖 Rule:</strong> {_lesson.rule2}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '2.5px solid #27AE60', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(1rem,2.2vw,1.3rem)', fontWeight: 700, color: '#1A5C30', textAlign: 'center' as const }}>
            have / has + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[1]}
          </div>
        </>
      ),
    });

    // Page 3 — Future Perfect (Voice 11 / file 12)
    pages.push({
      badge: '⏭ FUTURE PERFECT',
      badgeColor: ['#2980B9', '#1F618D'],
      title: 'Future Perfect Tense',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Future Perfect Tense
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#2980B9' }}>📖 Rule:</strong> {_lesson.rule3}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #EAF2FF 0%, #C8DEFF 100%)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-char)', fontSize: 'clamp(1rem,2.2vw,1.3rem)', fontWeight: 700, color: '#1A3A6B', textAlign: 'center' as const }}>
            will have + past participle
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[2]}
          </div>
        </>
      ),
    });

    // Page 4 — Summary (Voice 13 / file 14)
    pages.push({
      badge: '✅ SUMMARY',
      badgeColor: ['#8E44AD', '#6C3483'],
      title: 'Summary',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '12px' }}>
            Remember All Three!
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#8E44AD' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #F5EEF8 0%, #E8DAEF 100%)', border: '2.5px solid #8E44AD', borderRadius: '14px', padding: '14px 18px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.88rem,1.8vw,1.1rem)', fontWeight: 700, color: '#4A235A', whiteSpace: 'pre-line' as const, lineHeight: 1.7 }}>
            {_lesson.formula}
          </div>
        </>
      ),
    });

  } else if (sectionId === 'B') {
    // Page 0 — Rule 1: Proximity (Voice 15 / file 16)
    pages.push({
      badge: '📚 RULE 1',
      badgeColor: ['#FF7A1A', '#E85D10'],
      title: 'Rule of Proximity',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.2rem,2.8vw,1.7rem)', color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px' }}>
            {_lesson.topic}
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(232,93,16,0.08)', border: '2.5px solid #E85D10', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#E85D10' }}>📖 Rule 1:</strong> {_lesson.rule}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[0]}
          </div>
        </>
      ),
    });

    // Page 1 — Rule 2: Quantifiers (Voice 16 / file 17)
    pages.push({
      badge: '✏️ RULE 2',
      badgeColor: ['#3A9E5C', '#217A42'],
      title: 'Quantifiers',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Quantifier Rule
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(58,158,92,0.08)', border: '2.5px solid #3A9E5C', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#3A9E5C' }}>📖 Rule 2:</strong> {_lesson.rule2}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[1]}
          </div>
        </>
      ),
    });

    // Page 2 — Rule 3: Noncount & Plural-only (Voice 17 / file 18)
    pages.push({
      badge: '💡 RULE 3',
      badgeColor: ['#5B6FD4', '#3A4DB8'],
      title: 'Noncount & Plural-only Nouns',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Noncount & Plural-only Nouns
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#5B6FD4' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(91,111,212,0.08)', border: '2.5px solid #5B6FD4', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#5B6FD4' }}>📖 Rule 3:</strong> {_lesson.rule3}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[2]}
          </div>
        </>
      ),
    });

  } else if (sectionId === 'C') {
    // Page 0 — Prepositions of Time (Voice 20 / file 21)
    pages.push({
      badge: '📚 PREPOSITIONS',
      badgeColor: ['#2980B9', '#1F618D'],
      title: 'Prepositions of Time',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.2rem,2.8vw,1.7rem)', color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px' }}>
            {_lesson.topic}
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#2980B9' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#6B4A00', fontStyle: 'italic', marginBottom: '10px', lineHeight: 1.5 }}>
            {_lesson.intro}
          </div>
          <div style={{ background: 'rgba(41,128,185,0.08)', border: '2.5px solid #2980B9', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#2980B9' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', marginTop: '8px', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            💬 {_lesson.examples[0]} &nbsp;|&nbsp; 💬 {_lesson.examples[1]} &nbsp;|&nbsp; 💬 {_lesson.examples[2]}
          </div>
        </>
      ),
    });

    // Page 1 — Prepositions of Manner (Voice 22 / file 23)
    pages.push({
      badge: '✏️ MANNER',
      badgeColor: ['#3A9E5C', '#217A42'],
      title: 'Prepositions of Manner',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '10px' }}>
            Prepositions of Manner
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'rgba(58,158,92,0.08)', border: '2.5px solid #3A9E5C', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong style={{ color: '#3A9E5C' }}>📖 Rule:</strong> {_lesson.rule2}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {[_lesson.examples[3], _lesson.examples[4], _lesson.examples[5]].filter(Boolean).map((ex: string, i: number) => (
              <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '7px 12px' }}>
                💬 {ex}
              </div>
            ))}
          </div>
        </>
      ),
    });

    // Page 2 — Ready to practice (Voice 24 / file 25)
    pages.push({
      badge: '💡 EXAMPLES',
      badgeColor: ['#8E44AD', '#6C3483'],
      title: 'See It in Action',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '12px' }}>
            Quick Reference
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#8E44AD' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #F5EEF8 0%, #E8DAEF 100%)', border: '2.5px solid #8E44AD', borderRadius: '14px', padding: '14px 18px', fontFamily: 'var(--font-char)', fontSize: 'clamp(0.88rem,1.8vw,1.08rem)', fontWeight: 700, color: '#4A235A', whiteSpace: 'pre-line' as const, lineHeight: 1.7, marginBottom: '10px' }}>
            {_lesson.formula}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem,1.7vw,1rem)', color: '#5A3A00', lineHeight: 1.55, background: 'rgba(255,248,220,0.8)', borderRadius: '10px', padding: '8px 12px' }}>
            {_lesson.summary}
          </div>
        </>
      ),
    });

  } else {
    // Fallback: original 3-page layout for any other section
    pages.push({
      badge: '📚 LESSON',
      badgeColor: ['#FF7A1A', '#E85D10'],
      title: 'Grammar Rule',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.3rem,3.2vw,2.1rem)', color: '#2A1800', fontWeight: 900, lineHeight: 1.35, marginBottom: '10px' }}>
            {_lesson.topic}
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#E85D10' }}>▌</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,2vw,1.15rem)', color: '#6B4A00', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.5 }}>
            {_lesson.intro}
          </div>
          <div style={{ background: 'rgba(232,93,16,0.1)', border: '2.5px solid #E85D10', borderRadius: '12px', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem,1.9vw,1.1rem)', color: '#2A1800', lineHeight: 1.6 }}>
            <strong style={{ color: '#E85D10' }}>📖 Rule:</strong> {_lesson.rule}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '✏️ FORMULA',
      badgeColor: ['#3A9E5C', '#217A42'],
      title: 'The Formula',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '14px' }}>
            Remember this formula!
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#3A9E5C' }}>▌</span>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #E8F8EE 0%, #C8F0D8 100%)', border: '3px solid #3A9E5C', borderRadius: '14px', padding: '14px 18px', fontFamily: 'var(--font-char)', fontSize: 'clamp(1.05rem,2.5vw,1.5rem)', fontWeight: 700, color: '#1A5C30', textAlign: 'center' as const, whiteSpace: 'pre-line' as const }}>
            {_lesson.formula}
          </div>
        </>
      ),
    });
    pages.push({
      badge: '💡 EXAMPLES',
      badgeColor: ['#5B6FD4', '#3A4DB8'],
      title: 'See It in Action',
      render: (_lesson, showCursor) => (
        <>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.1rem,2.4vw,1.45rem)', color: '#2A1800', fontWeight: 800, marginBottom: '12px' }}>
            Examples from Bustos:
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '4px', color: '#5B6FD4' }}>▌</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {_lesson.examples.map((ex: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                style={{ background: 'linear-gradient(135deg, #EEF0FF 0%, #DDE1FF 100%)', border: '2.5px solid #5B6FD4', borderRadius: '12px', padding: '9px 14px', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem,1.9vw,1.08rem)', color: '#2A1800', lineHeight: 1.55 }}>
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
  if (!section) return null;
  const lesson = section.lesson;

  const LESSON_PAGES = buildLessonPages(lesson, currentSection);
  const isLast = page === LESSON_PAGES.length - 1;
  const current = LESSON_PAGES[page];
  const [gradStart, gradEnd] = current.badgeColor;

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  // Play audio per page (section-keyed)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const sectionAudio = GRAMMAR_LESSON_AUDIO[currentSection] ?? GRAMMAR_LESSON_AUDIO.A;
    const src = sectionAudio[page];
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [page, currentSection]);

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