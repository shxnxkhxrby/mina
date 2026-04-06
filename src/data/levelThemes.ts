// Per-level color themes applied to question box + choices.
// storeIndex 0 → Option 1 (Parchment & Terracotta)
// storeIndex 1 → Option 2 (Deep Teal & Gold)
// storeIndex 2 → Option 4 (Coral & Cream)

export interface LevelTheme {
  // Question bubble
  qBg: string;
  qBorder: string;
  qSpeakerColor: string;
  qTextColor: string;
  qSubColor: string;
  // Bubble tail border color (matches qBorder)
  tailColor: string;
  // Choice rows
  choiceBg: string;
  choiceBorder: string;
  badgeBg: string;
  badgeText: string;
  choiceText: string;
  // Hover/selected states (wrong = red overlay, correct = green overlay – keep as-is)
}

export const LEVEL_THEMES: LevelTheme[] = [
  // Level 1 — Parchment & Terracotta
  {
    qBg: '#FFF8E8',
    qBorder: '#E8A830',
    qSpeakerColor: '#A0522D',
    qTextColor: '#3D2205',
    qSubColor: '#7A6B3D',
    tailColor: '#E8A830',
    choiceBg: '#FDECD4',
    choiceBorder: '#D4894A',
    badgeBg: '#D4894A',
    badgeText: '#FFF8E8',
    choiceText: '#5C2E00',
  },
  // Level 2 — Deep Teal & Gold
  {
    qBg: 'rgba(255,248,225,0.97)',
    qBorder: '#F5C84A',
    qSpeakerColor: '#0F6E56',
    qTextColor: '#1A2E20',
    qSubColor: '#4A7A5A',
    tailColor: '#F5C84A',
    choiceBg: '#E1F5EE',
    choiceBorder: '#1D9E75',
    badgeBg: '#1D9E75',
    badgeText: '#E1F5EE',
    choiceText: '#085041',
  },
  // Level 3 — Coral & Cream
  {
    qBg: '#FFF5F0',
    qBorder: '#D85A30',
    qSpeakerColor: '#993C1D',
    qTextColor: '#2D0A00',
    qSubColor: '#993C1D',
    tailColor: '#D85A30',
    choiceBg: '#FAECE7',
    choiceBorder: '#D85A30',
    badgeBg: '#D85A30',
    badgeText: '#FAECE7',
    choiceText: '#4A1B0C',
  },
];

export function getLevelTheme(storeIndex: number): LevelTheme {
  return LEVEL_THEMES[storeIndex % LEVEL_THEMES.length];
}
