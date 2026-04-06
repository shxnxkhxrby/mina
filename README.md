# Minasa: Grammar Quest 🌸

An educational RPG-style web game for Grade 8 Filipino learners, set during the Minasa Festival in Bustos, Bulacan.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel (connect GitHub repo for auto-deploy).

## Project Structure

```
src/
├── App.tsx                  # Scene router
├── main.tsx                 # Entry point
├── index.css                # All styles + design tokens
├── types.ts                 # TypeScript interfaces
├── store/
│   └── gameStore.ts         # Zustand state (persisted to localStorage)
├── data/
│   ├── sections.ts          # All 3 sections, 9 stores, ~59 questions (Set A+B each)
│   └── dialogues.ts         # Teacher intro, Mina intro, cutscene transcript
├── components/
│   ├── DialogueScene.tsx    # Reusable dialogue/cutscene component
│   └── OrientationGuard.tsx # Mobile landscape enforcement
└── screens/
    ├── MainMenu.tsx
    ├── NameInput.tsx
    ├── GrammarLesson.tsx    # Mina's lesson before each section
    ├── MapScreen.tsx        # Bustos map with 3 clickable zones
    ├── SectionView.tsx      # 3 stores per section with lock/unlock
    ├── StoreScreen.tsx      # NPC dialogue + 5 questions gameplay
    ├── FeedbackScreen.tsx   # Score, tips, progress after each store
    ├── CutsceneScreen.tsx   # Ending cutscene + interactive transcript
    ├── ScoreSummary.tsx     # Overall score + printable certificate
    └── ProfessionalPlaceholder.tsx
```

## Grammar Content

| Section | Location | Topic | Stores |
|---------|----------|-------|--------|
| A | Minasa Shops | Perfect Tenses | Aling Liling (Past), Zeny (Present), Elsa (Future) |
| B | Pamilihang Bayan | Subject-Verb Agreement | Purity Flour (Proximity), Gatas Tindhan (Quantifiers), Sariwang Itlog (Noncount) |
| C | Juan Ride on the Go | Prepositions | John Ray (Time), Al (Manner), Karen (Integrated) |

- **~118 total questions** (Set A + Set B per store, 5 questions each)
- Pass requirement: **4/5** per store
- Retry system: fail Set A → try Set B → fail → review lesson → repeat

## Tech Stack

- React 18 + Vite + TypeScript
- Zustand (state + localStorage persistence)
- Framer Motion (scene transitions, animations)
- Google Fonts: Fredoka One, Baloo 2, Nunito

## Deployment (Vercel)

1. Push to GitHub
2. Import repo at vercel.com
3. Framework: Vite — auto-detected
4. Deploy!
