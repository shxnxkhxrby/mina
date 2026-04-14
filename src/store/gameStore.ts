import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, SceneName, SectionId } from '../types';
import { SECTIONS } from '../data/sections';
import { SECTION_D } from '../data/sectionD';

// Passing score for each advanced level (out of 20)
export const ADVANCED_PASS_SCORE = 15;

// Merge Section D so allStoresComplete and isStoreUnlocked can find its stores
const ALL_SECTIONS = [...SECTIONS, SECTION_D];

function allStoresComplete(sectionId: SectionId, progress: GameState['sectionProgress']): boolean {
  const sec = ALL_SECTIONS.find(s => s.id === sectionId);
  if (!sec) return false;
  const prog = progress[sectionId] || {};
  return sec.stores.every(st => prog[st.id]?.completed);
}

const initialProgress: GameState['sectionProgress'] = {};

export const useGameStore = create<GameState & {
  advancedScore: { total: number; correct: number };
  advancedLevelScores: [number, number, number];
  addAdvancedScore: (correct: number, total: number) => void;
  setAdvancedLevelScore: (level: 0 | 1 | 2, score: number) => void;
  musicVolume: number;
  voiceVolume: number;
  setMusicVolume: (v: number) => void;
  setVoiceVolume: (v: number) => void;
}>()(
  persist(
    (set, get) => ({
      playerName: '',
      currentScene: 'MAIN_MENU' as SceneName,
      currentSection: null,
      currentStoreIndex: 0,
      currentQuestionSet: 'A' as 'A' | 'B',
      sectionProgress: initialProgress,
      overallScore: { total: 0, correct: 0 },
      advancedScore: { total: 0, correct: 0 },
      advancedLevelScores: [0, 0, 0] as [number, number, number],
      firstPlay: true,
      isAdvancedMode: false,

      // Audio volumes (0–1)
      musicVolume: 0.5,
      voiceVolume: 0.8,

      setPlayerName: (name) => set({ playerName: name }),
      goToScene: (scene) => set({ currentScene: scene }),
      setSection: (id) => set({ currentSection: id }),
      setStoreIndex: (i) => set({ currentStoreIndex: i }),
      setQuestionSet: (s) => set({ currentQuestionSet: s }),
      setAdvancedMode: (val) => set({ isAdvancedMode: val }),
      setMusicVolume: (v) => set({ musicVolume: Math.max(0, Math.min(1, v)) }),
      setVoiceVolume: (v) => set({ voiceVolume: Math.max(0, Math.min(1, v)) }),

      completeStore: (sectionId, storeId, score) => {
        const prev = get().sectionProgress;
        const secProg = prev[sectionId] || {};
        const existing = secProg[storeId] || { completed: false, bestScore: 0, attempts: 0 };
        set({
          sectionProgress: {
            ...prev,
            [sectionId]: {
              ...secProg,
              [storeId]: {
                completed: score >= 4,
                bestScore: Math.max(existing.bestScore, score),
                attempts: existing.attempts + 1,
              }
            }
          },
          firstPlay: false,
        });
      },

      addScore: (correct, total) => {
        const prev = get().overallScore;
        set({ overallScore: { total: prev.total + total, correct: prev.correct + correct } });
      },

      addAdvancedScore: (correct, total) => {
        const prev = get().advancedScore;
        set({ advancedScore: { total: prev.total + total, correct: prev.correct + correct } });
      },

      setAdvancedLevelScore: (level: 0 | 1 | 2, score: number) => {
        const prev = get().advancedLevelScores;
        const updated: [number, number, number] = [...prev] as [number, number, number];
        updated[level] = Math.max(updated[level], score); // keep best score
        set({ advancedLevelScores: updated });
      },

      isSectionUnlocked: (id) => {
        if (id === 'A') return true;
        if (id === 'B') return allStoresComplete('A', get().sectionProgress);
        if (id === 'C') return allStoresComplete('B', get().sectionProgress);
        if (id === 'D') return allStoresComplete('C', get().sectionProgress);
        return false;
      },

      isStoreUnlocked: (sectionId, storeIndex) => {
        if (!get().isSectionUnlocked(sectionId)) return false;
        if (storeIndex === 0) return true;
        const sec = ALL_SECTIONS.find(s => s.id === sectionId);
        if (!sec) return false;
        const prog = get().sectionProgress[sectionId] || {};
        return prog[sec.stores[storeIndex - 1].id]?.completed === true;
      },

      resetGame: () => set({
        playerName: '',
        currentScene: 'MAIN_MENU',
        currentSection: null,
        currentStoreIndex: 0,
        currentQuestionSet: 'A',
        sectionProgress: {},
        overallScore: { total: 0, correct: 0 },
        advancedScore: { total: 0, correct: 0 },
        advancedLevelScores: [0, 0, 0],
        firstPlay: true,
        isAdvancedMode: false,
      }),
    }),
    { name: 'minasa-save' }
  )
);