import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, SceneName, SectionId } from '../types';
import { SECTIONS } from '../data/sections';

function allStoresComplete(sectionId: SectionId, progress: GameState['sectionProgress']): boolean {
  const sec = SECTIONS.find(s => s.id === sectionId);
  if (!sec) return false;
  const prog = progress[sectionId] || {};
  return sec.stores.every(st => prog[st.id]?.completed);
}

const initialProgress: GameState['sectionProgress'] = {};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: '',
      currentScene: 'MAIN_MENU' as SceneName,
      currentSection: null,
      currentStoreIndex: 0,
      currentQuestionSet: 'A' as 'A' | 'B',
      sectionProgress: initialProgress,
      overallScore: { total: 0, correct: 0 },
      firstPlay: true,
      isAdvancedMode: false,

      setPlayerName: (name) => set({ playerName: name }),
      goToScene: (scene) => set({ currentScene: scene }),
      setSection: (id) => set({ currentSection: id }),
      setStoreIndex: (i) => set({ currentStoreIndex: i }),
      setQuestionSet: (s) => set({ currentQuestionSet: s }),
      setAdvancedMode: (val) => set({ isAdvancedMode: val }),

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

      isSectionUnlocked: (id) => {
        if (id === 'A') return true;
        if (id === 'B') return allStoresComplete('A', get().sectionProgress);
        if (id === 'C') return allStoresComplete('B', get().sectionProgress);
        if (id === 'D') return allStoresComplete('C', get().sectionProgress); // ← NEW
        return false;
      },

      isStoreUnlocked: (sectionId, storeIndex) => {
        if (!get().isSectionUnlocked(sectionId)) return false;
        if (storeIndex === 0) return true;
        const sec = SECTIONS.find(s => s.id === sectionId);
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
        firstPlay: true,
        isAdvancedMode: false,
      }),
    }),
    { name: 'minasa-save' }
  )
);