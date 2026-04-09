import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import OrientationGuard from './components/OrientationGuard';
import AudioManager from './components/AudioManager';
import MainMenu from './screens/MainMenu';
import NameInput from './screens/NameInput';
import TeacherIntro from './screens/TeacherIntro';
import MinaIntro from './screens/MinaIntro';
import GrammarLesson from './screens/GrammarLesson';
import MapScreen from './screens/MapScreen';
import SectionView from './screens/SectionView';
import StoreScreen from './screens/StoreScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import CutsceneScreen from './screens/CutsceneScreen';
import ScoreSummary from './screens/ScoreSummary';
import ProfessionalPlaceholder from './screens/ProfessionalPlaceholder';
import AdvancedSectionView from './screens/AdvancedSectionView';
import AdvancedStore from './screens/AdvancedStore';
import VideoIntro from './screens/VideoIntro';
import SectionDVideoIntro from './screens/SectionDVideoIntro';

function SceneContent() {
  const { currentScene } = useGameStore();
  switch (currentScene) {
    case 'MAIN_MENU':               return <MainMenu />;
    case 'NAME_INPUT':              return <NameInput />;
    case 'TEACHER_INTRO':           return <TeacherIntro />;
    case 'MINA_INTRO':              return <MinaIntro />;
    case 'VIDEO_INTRO':             return <VideoIntro />;
    case 'MAP':                     return <MapScreen />;
    case 'GRAMMAR_LESSON':          return <GrammarLesson />;
    case 'SECTION_VIEW':            return <SectionView />;
    case 'STORE':                   return <StoreScreen />;
    case 'FEEDBACK':                return <FeedbackScreen />;
    case 'CUTSCENE':                return <CutsceneScreen />;
    case 'SCORE_SUMMARY':           return <ScoreSummary />;
    case 'PROFESSIONAL_PLACEHOLDER': return <ProfessionalPlaceholder />;
    case 'ADVANCED_SECTION_VIEW':   return <AdvancedSectionView />;
    case 'ADVANCED_STORE':          return <AdvancedStore />;
    case 'SECTION_D_VIDEO':         return <SectionDVideoIntro />;
    default:                        return <MainMenu />;
  }
}

export default function App() {
  const { currentScene } = useGameStore();
  return (
    <OrientationGuard>
      {/* AudioManager lives outside the scene switcher so BGM never restarts on scene change */}
      <AudioManager />
      <div className="game-shell">
        <div className="game-canvas">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <SceneContent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </OrientationGuard>
  );
}