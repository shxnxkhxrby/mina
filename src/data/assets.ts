const BASE = '/imgs';

export const ASSETS = {
  logo:       `${BASE}/logo.png`,
  map:        `${BASE}/map-view(no-stores_yet).png`,
  minaMascot: `${BASE}/mina-mascot.png`,
  mina:       `${BASE}/mina.png`,
  sectionA:   `${BASE}/section_a.png`,
  sectionB:   `${BASE}/section_b.png`,
  sectionC: '/imgs/section_c.png',   // ← new
  sectionD: '/imgs/section_d.png',   // ← new
};

// Level backgrounds: /imgs/levels/{sectionId}/level{n}.{ext}
// Returns candidates to try in order: png → jpg → jpeg → webp
export function getLevelBgCandidates(sectionId: string, storeIndex: number): string[] {
  const base = `/imgs/levels/${sectionId}/level${storeIndex + 1}`;
  return [`${base}.png`, `${base}.jpg`, `${base}.jpeg`, `${base}.webp`];
}

// First candidate (png). AdvancedStore's onError chain tries the rest.
export function getLevelBg(sectionId: string, storeIndex: number): string {
  return getLevelBgCandidates(sectionId, storeIndex)[0];
}

// NPC full-body sprites: /imgs/npcs/{sectionId}/npc{n}.{ext}
// Separate from the level background — these are cutout character images.
// Falls back to emoji if none found.
export function getNpcCandidates(sectionId: string, storeIndex: number): string[] {
  const base = `/imgs/npcs/${sectionId}/npc${storeIndex + 1}`;
  return [`${base}.png`, `${base}.jpg`, `${base}.jpeg`, `${base}.webp`];
}
