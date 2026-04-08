import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { ASSETS } from '../data/assets';
import { SECTION_D } from '../data/sectionD';
import type { SectionId } from '../types';

const ZONE_BG_IMAGE: Record<string, string> = {
  A: ASSETS.sectionA ?? '',
  B: ASSETS.sectionB ?? '',
  C: ASSETS.sectionC ?? '',
  D: ASSETS.sectionD ?? '',
};

const ZONE_COLORS: Record<string, string> = {
  A: '#E85D26',
  B: '#5B7A3D',
  C: '#2E75B6',
  D: '#8B1A8B',
};

const ZONE_GRADIENTS: Record<string, string> = {
  A: 'linear-gradient(160deg,#FFE090,#F5C84A)',
  B: 'linear-gradient(160deg,#A8D8A0,#5B9A50)',
  C: 'linear-gradient(160deg,#A0C8F0,#4088C0)',
  D: 'linear-gradient(160deg,#E0A0F0,#8B1A8B)',
};

// Absolute positions only used on larger screens (>=600px)
const ZONE_POSITIONS: Record<string, { x: string; y: string }> = {
  A: { x: '15%', y: '35%' },
  B: { x: '25%', y: '66%' },
  C: { x: '73%', y: '50%' },
  D: { x: '83%', y: '80%' },
};

const SECTION_D_ENTRY = {
  id: 'D',
  name: 'Minasa Festival',
  emoji: '🎉',
  grammarTopic: 'Festival Grammar Review',
  storeCount: 3,
};

export default function MapScreen() {
  const {
    isSectionUnlocked, setSection, goToScene,
    sectionProgress, playerName, isAdvancedMode,
  } = useGameStore();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const isDSectionUnlocked = () => {
    return ['A', 'B', 'C'].every(id => {
      const sec = SECTIONS.find(s => s.id === id);
      if (!sec) return false;
      const prog = sectionProgress[id] || {};
      return sec.stores.every(st => prog[st.id]?.completed);
    });
  };

  const handleZone = (id: string) => {
    if (id === 'D') {
      if (!isDSectionUnlocked()) {
        setTooltip('Complete Sections A, B, and C to unlock the Festival!');
        setTimeout(() => setTooltip(null), 2800);
        return;
      }
      setSection('D' as any);
      goToScene(isAdvancedMode ? 'ADVANCED_SECTION_VIEW' : 'SECTION_D_VIDEO');
      return;
    }
    const sId = id as SectionId;
    if (!isSectionUnlocked(sId)) {
      const prev = id === 'B' ? 'A' : id === 'C' ? 'B' : 'A';
      setTooltip(`Complete Section ${prev} first to unlock this area!`);
      setTimeout(() => setTooltip(null), 2500);
      return;
    }
    setSection(sId);
    goToScene(isAdvancedMode ? 'ADVANCED_SECTION_VIEW' : 'GRAMMAR_LESSON');
  };

  const getStars = (id: string) => {
    if (id === 'D') {
      const prog = sectionProgress['D'] || {};
      return SECTION_D.stores.filter(st => prog[st.id]?.completed).length;
    }
    const sec = SECTIONS.find(s => s.id === id);
    if (!sec) return 0;
    const prog = sectionProgress[id] || {};
    return sec.stores.filter(st => prog[st.id]?.completed).length;
  };

  const getTotalStores = (id: string) => {
    if (id === 'D') return SECTION_D.stores.length;
    const sec = SECTIONS.find(s => s.id === id);
    return sec ? sec.stores.length : 3;
  };

  const allZones = [
    ...SECTIONS.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, grammarTopic: s.grammarTopic })),
    SECTION_D_ENTRY,
  ];

  const dUnlocked = isDSectionUnlocked();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <img
        src={ASSETS.map}
        alt="Bustos Map"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.20) 100%)',
        pointerEvents: 'none',
      }} />

      <div className="bunting" />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 'clamp(38px,7vh,60px)',
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, textAlign: 'center',
        width: '100%', pointerEvents: 'none',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(42,26,14,0.88)', border: '2px solid var(--golden)',
          borderRadius: '50px', padding: '4px 20px',
          fontFamily: 'var(--font-title)', fontSize: 'clamp(0.78rem,2vw,1.3rem)',
          color: 'var(--golden)', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80vw',
          pointerEvents: 'auto',
        }}>🗺 Bustos, Bulacan — Festival Map</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(0.54rem,1.1vw,0.72rem)',
          color: 'rgba(255,248,231,0.9)', marginTop: '3px',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        }}>
          {isAdvancedMode
            ? '⚡ Advanced Mode — Select a section'
            : `Welcome, ${playerName}! Tap a zone to explore 🌸`}
        </div>
      </div>

      {isAdvancedMode && (
        <div style={{
          position: 'absolute', top: 'clamp(38px,7vh,60px)',
          right: 'clamp(10px,2vw,16px)', zIndex: 20,
        }}>
          <div style={{
            background: 'rgba(232,93,38,0.92)', border: '2px solid #FFD700',
            borderRadius: '20px', padding: '3px 12px',
            fontFamily: 'var(--font-char)', fontWeight: 700,
            fontSize: 'clamp(0.52rem,1vw,0.68rem)', color: 'white', letterSpacing: '1px',
          }}>⚡ ADVANCED</div>
        </div>
      )}

      {/* Zone markers — absolute on large screens, responsive grid on small */}
      {/* Large screen: absolute positioned on map */}
      <div className="map-zones-desktop">
        {allZones.map(zone => {
          const pos = ZONE_POSITIONS[zone.id];
          if (!pos) return null;
          const unlocked = zone.id === 'D' ? dUnlocked : isSectionUnlocked(zone.id as SectionId);
          const stars = getStars(zone.id);
          const totalStores = getTotalStores(zone.id);
          const bgImage = ZONE_BG_IMAGE[zone.id];
          const color = ZONE_COLORS[zone.id];
          const gradient = ZONE_GRADIENTS[zone.id];

          return (
            <div
              key={zone.id}
              style={{
                position: 'absolute',
                left: pos.x, top: pos.y,
                transform: 'translate(-50%, -50%)',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                zIndex: 5,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px',
              }}
              onClick={() => handleZone(zone.id)}
            >
              <ZoneCard
                zone={zone} unlocked={unlocked} stars={stars}
                totalStores={totalStores} bgImage={bgImage}
                color={color} gradient={gradient}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: scrollable row at bottom */}
      <div className="map-zones-mobile">
        {allZones.map(zone => {
          const unlocked = zone.id === 'D' ? dUnlocked : isSectionUnlocked(zone.id as SectionId);
          const stars = getStars(zone.id);
          const totalStores = getTotalStores(zone.id);
          const bgImage = ZONE_BG_IMAGE[zone.id];
          const color = ZONE_COLORS[zone.id];
          const gradient = ZONE_GRADIENTS[zone.id];
          return (
            <div
              key={zone.id}
              style={{
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px',
                flexShrink: 0,
              }}
              onClick={() => handleZone(zone.id)}
            >
              <ZoneCard
                zone={zone} unlocked={unlocked} stars={stars}
                totalStores={totalStores} bgImage={bgImage}
                color={color} gradient={gradient}
                mobile
              />
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', bottom: 'clamp(80px,14vh,110px)',
              left: '50%', transform: 'translateX(-50%)',
              background: 'var(--error)', color: 'white',
              padding: '8px 16px', borderRadius: '12px',
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.62rem,1.3vw,0.82rem)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)', zIndex: 20,
              maxWidth: '90vw', textAlign: 'center', whiteSpace: 'normal',
            }}>⚠ {tooltip}</motion.div>
        )}
      </AnimatePresence>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => goToScene('MAIN_MENU')}
        style={{
          position: 'absolute', top: 'clamp(38px,7vh,60px)',
          left: 'clamp(10px,2vw,16px)', zIndex: 20,
        }}>
        ← Menu
      </button>

      <style>{`
        .map-zones-mobile {
          display: none;
        }
        @media (max-width: 600px) {
          .map-zones-desktop {
            display: none;
          }
          .map-zones-mobile {
            display: flex;
            position: absolute;
            bottom: clamp(48px,9vh,80px);
            left: 0; right: 0;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-end;
            gap: 10px;
            padding: 0 12px 10px;
            overflow-x: auto;
            overflow-y: visible;
            z-index: 5;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
}

function ZoneCard({
  zone, unlocked, stars, totalStores, bgImage, color, gradient, mobile = false,
}: {
  zone: { id: string; name: string; emoji: string; grammarTopic: string };
  unlocked: boolean; stars: number; totalStores: number;
  bgImage: string; color: string; gradient: string; mobile?: boolean;
}) {
  return (
    <>
      <motion.div
        whileHover={unlocked ? { y: -6, scale: 1.07 } : {}}
        whileTap={unlocked ? { scale: 0.95 } : {}}
        animate={unlocked ? { y: [0, -4, 0] } : {}}
        transition={unlocked ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 } : {}}
        style={{
          width: mobile ? 'clamp(100px,22vw,140px)' : 'clamp(110px,13vw,180px)',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `3px solid ${unlocked ? color : '#888'}`,
          boxShadow: unlocked
            ? `0 6px 22px ${color}88, 0 2px 8px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.3)',
          position: 'relative',
          background: bgImage
            ? `url(${bgImage}) center/cover no-repeat`
            : gradient,
          filter: unlocked ? 'none' : 'grayscale(0.8) brightness(0.55)',
        }}
      >
        <div style={{ height: mobile ? 'clamp(70px,18vw,110px)' : 'clamp(80px,11vw,150px)', position: 'relative' }}>
          {!bgImage && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: mobile ? 'clamp(1.4rem,4vw,2.2rem)' : 'clamp(1.6rem,3.5vw,2.8rem)',
              background: gradient,
            }}>{zone.emoji}</div>
          )}
          {!unlocked && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(3px)',
              fontSize: mobile ? 'clamp(1.2rem,3.5vw,2rem)' : 'clamp(1.4rem,3vw,2.2rem)',
            }}>🔒</div>
          )}
          {unlocked && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to bottom, transparent 50%, ${color}44 100%)`,
              pointerEvents: 'none',
            }} />
          )}
        </div>
        <div style={{
          background: unlocked ? color : '#555',
          padding: '4px 6px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-title)',
            fontSize: mobile ? 'clamp(0.4rem,1.8vw,0.6rem)' : 'clamp(0.42rem,0.85vw,0.68rem)',
            color: 'white', fontWeight: 700, lineHeight: 1.2,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
          }}>
            {zone.emoji} {zone.name}
          </div>
          {!mobile && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.38rem,0.75vw,0.54rem)',
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {zone.id === 'D' ? '🎉 Final Chapter' : zone.grammarTopic}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stars */}
      {unlocked && (
        <div style={{
          display: 'flex', gap: '1px',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: '20px', padding: '2px 6px',
        }}>
          {Array.from({ length: totalStores }).map((_, i) => (
            <span key={i} style={{
              fontSize: mobile ? 'clamp(0.44rem,1.8vw,0.7rem)' : 'clamp(0.55rem,1.1vw,0.8rem)',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
      )}

      {/* Section pin */}
      <div style={{
        width: 'clamp(18px,3vw,26px)', height: 'clamp(18px,3vw,26px)',
        borderRadius: '50%',
        background: unlocked ? color : '#666',
        border: '2px solid white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(0.5rem,0.95vw,0.7rem)',
        color: 'white', fontWeight: 800,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        marginTop: '-2px',
      }}>
        {zone.id}
      </div>
    </>
  );
}