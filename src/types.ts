export type SceneName =
  | 'MAIN_MENU'
  | 'NAME_INPUT'
  | 'TEACHER_INTRO'
  | 'MINA_INTRO'
  | 'VIDEO_INTRO'
  | 'MAP'
  | 'SECTION_VIEW'
  | 'GRAMMAR_LESSON'
  | 'STORE'
  | 'FEEDBACK'
  | 'CUTSCENE'
  | 'SCORE_SUMMARY'
  | 'CERTIFICATE'
  | 'PROFESSIONAL_PLACEHOLDER'
  | 'ADVANCED_SECTION_VIEW'
  | 'ADVANCED_STORE'
  | 'SECTION_D_VIDEO';  // ← video intro before Section D (skips to GRAMMAR_LESSON if no file)

export type SectionId = 'A' | 'B' | 'C' | 'D';  // ← added 'D'

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  npcDialogueBefore: string;
  questionText: string;
  choices: Choice[];
  feedbackCorrect: string;
  feedbackWrong: string;
  grammarRule: string;
}

export interface QuestionSet {
  id: 'A' | 'B';
  questions: Question[];
}

export interface Store {
  id: string;
  name: string;
  npcName: string;
  emoji: string;
  description: string;
  questionSets: QuestionSet[];
}

export interface GrammarLesson {
  topic: string;
  intro: string;
  rule: string;
  rule2?: string;   // second rule (e.g. Present Perfect for Section A)
  rule3?: string;   // third rule (e.g. Future Perfect for Section A)
  summary?: string; // closing summary page
  formula: string;
  examples: string[];
}

export interface Section {
  id: SectionId;
  name: string;
  location: string;
  grammarTopic: string;
  lesson: GrammarLesson;
  stores: Store[];
  emoji: string;
  color: string;
}

export interface StoreProgress {
  completed: boolean;
  bestScore: number;
  attempts: number;
}

export interface SectionProgress {
  [storeId: string]: StoreProgress;
}

export interface GameState {
  playerName: string;
  currentScene: SceneName;
  currentSection: SectionId | null;
  currentStoreIndex: number;
  currentQuestionSet: 'A' | 'B';
  sectionProgress: { [sectionId: string]: SectionProgress };
  overallScore: { total: number; correct: number };
  firstPlay: boolean;
  isAdvancedMode: boolean;

  // actions
  setPlayerName: (name: string) => void;
  goToScene: (scene: SceneName) => void;
  setSection: (id: SectionId) => void;
  setStoreIndex: (i: number) => void;
  setQuestionSet: (s: 'A' | 'B') => void;
  completeStore: (sectionId: SectionId, storeId: string, score: number) => void;
  addScore: (correct: number, total: number) => void;
  isSectionUnlocked: (id: SectionId) => boolean;
  isStoreUnlocked: (sectionId: SectionId, storeIndex: number) => boolean;
  resetGame: () => void;
  setAdvancedMode: (val: boolean) => void;
}