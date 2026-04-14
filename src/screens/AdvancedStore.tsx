import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ADVANCED_PASS_SCORE } from '../store/gameStore';
import { SECTIONS } from '../data/sections';
import { getLevelBgCandidates } from '../data/assets';

type Phase = 'question' | 'answered' | 'done';

// ── Mastery Checkpoint question bank ─────────────────────────────────────

interface MCQuestion {
  questionText: string;
  npcDialogueBefore?: string;
  choices: { text: string; isCorrect: boolean }[];
  feedbackCorrect: string;
  feedbackWrong: string;
}

interface MasteryQuiz {
  id: string;
  title: string;
  topic: string;
  questions: MCQuestion[];
}

const MASTERY_QUIZZES: MasteryQuiz[] = [
  // ── Quiz 1: Perfect Tenses (20 questions) ────────────────────────────────
  {
    id: 'perfect_tenses',
    title: 'Perfect Tenses Mastery Quiz',
    topic: 'Perfect Tenses',
    questions: [
      // Level 1 — Easy (7)
      {
        questionText: 'I (have / has) finished my homework for today.',
        choices: [
          { text: 'have', isCorrect: true },
          { text: 'has', isCorrect: false },
        ],
        feedbackCorrect: '"I" always takes "have" in the present perfect.',
        feedbackWrong: '"I" always takes "have" — not "has". Only third-person singular (he/she/it) uses "has".',
      },
      {
        questionText: 'The teacher (has / have) already started the lesson.',
        choices: [
          { text: 'has', isCorrect: true },
          { text: 'have', isCorrect: false },
        ],
        feedbackCorrect: '"The teacher" is third-person singular → "has".',
        feedbackWrong: '"The teacher" is singular → use "has", not "have".',
      },
      {
        questionText: 'We (had / have) already eaten lunch before the bell rang.',
        choices: [
          { text: 'had', isCorrect: true },
          { text: 'have', isCorrect: false },
        ],
        feedbackCorrect: 'The action happened before another past event → Past Perfect "had eaten".',
        feedbackWrong: '"Before the bell rang" signals a past-before-past action → use "had", not "have".',
      },
      {
        questionText: 'By next week, I (will have / have) completed my project.',
        choices: [
          { text: 'will have', isCorrect: true },
          { text: 'have', isCorrect: false },
        ],
        feedbackCorrect: '"By next week" signals a future deadline → Future Perfect "will have".',
        feedbackWrong: '"By next week" points to a future deadline → use "will have", not "have".',
      },
      {
        questionText: 'They (has / have) been friends since first grade.',
        choices: [
          { text: 'have', isCorrect: true },
          { text: 'has', isCorrect: false },
        ],
        feedbackCorrect: '"They" is plural → "have".',
        feedbackWrong: '"They" is plural → use "have", not "has".',
      },
      {
        questionText: 'My classmate (had / has) lost his pen before the exam began.',
        choices: [
          { text: 'had', isCorrect: true },
          { text: 'has', isCorrect: false },
        ],
        feedbackCorrect: 'Losing the pen happened before the exam (past event) → Past Perfect "had lost".',
        feedbackWrong: '"Before the exam began" signals past-before-past → use "had", not "has".',
      },
      {
        questionText: '(Have / Has) you ever visited the school library?',
        choices: [
          { text: 'Have', isCorrect: true },
          { text: 'Has', isCorrect: false },
        ],
        feedbackCorrect: '"You" takes "have" in the present perfect.',
        feedbackWrong: '"You" always takes "have" — not "has".',
      },
      // Level 2 — Average (8)
      {
        questionText: 'Which sentence is in the Present Perfect tense?',
        choices: [
          { text: 'I am going to school.', isCorrect: false },
          { text: 'I have gone to school.', isCorrect: true },
          { text: 'I went to school.', isCorrect: false },
        ],
        feedbackCorrect: '"Have gone" = present perfect (have/has + past participle).',
        feedbackWrong: 'Present Perfect uses have/has + past participle. Only "I have gone to school" fits.',
      },
      {
        questionText: 'By the time the bell rings, I __________ my lunch.',
        choices: [
          { text: 'will have eaten', isCorrect: true },
          { text: 'have eaten', isCorrect: false },
          { text: 'had eaten', isCorrect: false },
        ],
        feedbackCorrect: '"By the time the bell rings" = future deadline → Future Perfect "will have eaten".',
        feedbackWrong: '"By the time + present tense" signals a future deadline → "will have eaten".',
      },
      {
        questionText: 'My parents __________ to the PTA meeting already.',
        choices: [
          { text: 'has gone', isCorrect: false },
          { text: 'have gone', isCorrect: true },
          { text: 'gone', isCorrect: false },
        ],
        feedbackCorrect: '"My parents" is plural → "have gone".',
        feedbackWrong: '"My parents" is plural → use "have gone", not "has gone".',
      },
      {
        questionText: 'She was sad because she __________ her favorite pen.',
        choices: [
          { text: 'has lost', isCorrect: false },
          { text: 'will have lost', isCorrect: false },
          { text: 'had lost', isCorrect: true },
        ],
        feedbackCorrect: '"Was sad" is simple past; the loss happened before that → Past Perfect "had lost".',
        feedbackWrong: '"Was sad" is simple past; the cause happened even earlier → Past Perfect "had lost".',
      },
      {
        questionText: 'We __________ for the exam for two hours now.',
        choices: [
          { text: 'had reviewed', isCorrect: false },
          { text: 'have reviewed', isCorrect: true },
          { text: 'will have reviewed', isCorrect: false },
        ],
        feedbackCorrect: '"For two hours now" = ongoing until present → Present Perfect "have reviewed".',
        feedbackWrong: '"For two hours now" shows action continuing to the present → "have reviewed".',
      },
      {
        questionText: 'The library __________ its doors by 5:00 PM today.',
        choices: [
          { text: 'will have closed', isCorrect: true },
          { text: 'had closed', isCorrect: false },
          { text: 'has closed', isCorrect: false },
        ],
        feedbackCorrect: '"By 5:00 PM today" = future deadline → Future Perfect "will have closed".',
        feedbackWrong: '"By 5:00 PM today" is a future deadline → Future Perfect "will have closed".',
      },
      {
        questionText: 'Have you __________ your school uniform yet?',
        choices: [
          { text: 'wash', isCorrect: false },
          { text: 'washing', isCorrect: false },
          { text: 'washed', isCorrect: true },
        ],
        feedbackCorrect: 'Present Perfect = have/has + past participle → "washed".',
        feedbackWrong: 'After "have/has", use the past participle → "washed", not "wash" or "washing".',
      },
      {
        questionText: 'Before the program started, the performers __________ their costumes.',
        choices: [
          { text: 'have prepared', isCorrect: false },
          { text: 'had prepared', isCorrect: true },
          { text: 'will have prepared', isCorrect: false },
        ],
        feedbackCorrect: '"Before the program started" = past-before-past → Past Perfect "had prepared".',
        feedbackWrong: '"Before [past event]" signals Past Perfect → "had prepared".',
      },
      // Level 3 — Difficult (5)
      {
        questionText: '(Present Perfect) The students are happy because they __________ (clean) the whole campus.',
        choices: [
          { text: 'have cleaned', isCorrect: true },
          { text: 'had cleaned', isCorrect: false },
          { text: 'will have cleaned', isCorrect: false },
          { text: 'has cleaned', isCorrect: false },
        ],
        feedbackCorrect: 'Present Perfect = have/has + past participle → "have cleaned".',
        feedbackWrong: 'Present Perfect = have/has + past participle → "have cleaned" (plural subject "they").',
      },
      {
        questionText: '(Past Perfect) I couldn\'t enter the room because I __________ (forget) my key.',
        choices: [
          { text: 'had forgotten', isCorrect: true },
          { text: 'have forgotten', isCorrect: false },
          { text: 'will have forgotten', isCorrect: false },
          { text: 'forgot', isCorrect: false },
        ],
        feedbackCorrect: 'Past Perfect = had + past participle → "had forgotten".',
        feedbackWrong: 'The forgetting happened before "couldn\'t enter" → Past Perfect "had forgotten".',
      },
      {
        questionText: '(Future Perfect) By the end of this semester, our class __________ (read) ten different stories.',
        choices: [
          { text: 'will have read', isCorrect: true },
          { text: 'have read', isCorrect: false },
          { text: 'had read', isCorrect: false },
          { text: 'has read', isCorrect: false },
        ],
        feedbackCorrect: '"By the end of this semester" = future deadline → Future Perfect "will have read".',
        feedbackWrong: '"By the end of this semester" is a future point → Future Perfect "will have read".',
      },
      {
        questionText: '(Past Perfect) The janitor __________ (lock) the gate before I arrived at school.',
        choices: [
          { text: 'had locked', isCorrect: true },
          { text: 'has locked', isCorrect: false },
          { text: 'will have locked', isCorrect: false },
          { text: 'locked', isCorrect: false },
        ],
        feedbackCorrect: '"Before I arrived" = locking happened earlier → Past Perfect "had locked".',
        feedbackWrong: '"Before I arrived" signals past-before-past → Past Perfect "had locked".',
      },
      {
        questionText: '(Future Perfect) I __________ (finish) my research paper by the time the deadline arrives.',
        choices: [
          { text: 'will have finished', isCorrect: true },
          { text: 'have finished', isCorrect: false },
          { text: 'had finished', isCorrect: false },
          { text: 'finish', isCorrect: false },
        ],
        feedbackCorrect: '"By the time + present tense" = future deadline → Future Perfect "will have finished".',
        feedbackWrong: '"By the time the deadline arrives" signals a future point → "will have finished".',
      },
    ],
  },

  // ── Quiz 2: Prepositions (20 questions) ──────────────────────────────────
  {
    id: 'prepositions',
    title: 'Prepositions Mastery Quiz',
    topic: 'Prepositions of Time and Manner',
    questions: [
      {
        questionText: 'Our English class starts __________ 8:30 AM sharp.',
        choices: [
          { text: 'at', isCorrect: true },
          { text: 'on', isCorrect: false },
          { text: 'in', isCorrect: false },
          { text: 'by', isCorrect: false },
        ],
        feedbackCorrect: 'Use "at" for specific clock times.',
        feedbackWrong: 'Use "at" for specific times (e.g., at 8:30 AM).',
      },
      {
        questionText: 'I usually do my heaviest studying __________ the evening.',
        choices: [
          { text: 'in', isCorrect: true },
          { text: 'at', isCorrect: false },
          { text: 'on', isCorrect: false },
          { text: 'by', isCorrect: false },
        ],
        feedbackCorrect: 'Use "in" for parts of the day (morning, afternoon, evening).',
        feedbackWrong: 'Use "in" for parts of the day → "in the evening".',
      },
      {
        questionText: 'We don\'t have classes __________ Saturdays and Sundays.',
        choices: [
          { text: 'on', isCorrect: true },
          { text: 'at', isCorrect: false },
          { text: 'in', isCorrect: false },
          { text: 'by', isCorrect: false },
        ],
        feedbackCorrect: 'Use "on" for specific days of the week.',
        feedbackWrong: 'Use "on" for days of the week → "on Saturdays".',
      },
      {
        questionText: 'The graduation ceremony is scheduled __________ June.',
        choices: [
          { text: 'in', isCorrect: true },
          { text: 'at', isCorrect: false },
          { text: 'on', isCorrect: false },
          { text: 'by', isCorrect: false },
        ],
        feedbackCorrect: 'Use "in" for months and years.',
        feedbackWrong: 'Use "in" for months → "in June".',
      },
      {
        questionText: 'She traveled to the university __________ bus.',
        choices: [
          { text: 'by', isCorrect: true },
          { text: 'on', isCorrect: false },
          { text: 'in', isCorrect: false },
          { text: 'at', isCorrect: false },
        ],
        feedbackCorrect: 'Use "by" to indicate mode of transport.',
        feedbackWrong: 'Use "by" for modes of transport → "by bus".',
      },
      {
        questionText: 'Please submit your reaction paper __________ Monday.',
        choices: [
          { text: 'by', isCorrect: true },
          { text: 'on', isCorrect: false },
          { text: 'at', isCorrect: false },
          { text: 'in', isCorrect: false },
        ],
        feedbackCorrect: '"By Monday" means no later than Monday — a deadline.',
        feedbackWrong: '"By" sets a deadline → "by Monday" (not "on Monday").',
      },
      {
        questionText: 'The student solved the difficult math problem __________ himself.',
        choices: [
          { text: 'by', isCorrect: true },
          { text: 'with', isCorrect: false },
          { text: 'in', isCorrect: false },
          { text: 'on', isCorrect: false },
        ],
        feedbackCorrect: '"By himself" = alone, without help (manner).',
        feedbackWrong: '"By himself" expresses manner (unaided) → use "by".',
      },
      {
        questionText: 'The students watched the documentary __________ great interest.',
        choices: [
          { text: 'by', isCorrect: false },
          { text: 'with', isCorrect: true },
          { text: 'in', isCorrect: false },
          { text: 'at', isCorrect: false },
        ],
        feedbackCorrect: '"With great interest" expresses manner/attitude.',
        feedbackWrong: '"With" expresses accompanying attitude or manner → "with great interest".',
      },
      {
        questionText: 'We are expected to finish the board exam __________ three hours.',
        choices: [
          { text: 'within', isCorrect: true },
          { text: 'at', isCorrect: false },
          { text: 'on', isCorrect: false },
          { text: 'during', isCorrect: false },
        ],
        feedbackCorrect: '"Within three hours" = inside a time limit.',
        feedbackWrong: '"Within" means inside a time limit → "within three hours".',
      },
      {
        questionText: 'He spoke __________ a whisper so he wouldn\'t disturb the library.',
        choices: [
          { text: 'with', isCorrect: false },
          { text: 'by', isCorrect: false },
          { text: 'in', isCorrect: true },
          { text: 'at', isCorrect: false },
        ],
        feedbackCorrect: '"In a whisper" describes the manner of speaking.',
        feedbackWrong: '"In" is used for manner of voice/tone → "in a whisper".',
      },
      {
        questionText: 'My professor has been teaching here __________ 2015.',
        choices: [
          { text: 'for', isCorrect: false },
          { text: 'since', isCorrect: true },
          { text: 'during', isCorrect: false },
          { text: 'at', isCorrect: false },
        ],
        feedbackCorrect: '"Since" marks the starting point of a period continuing to now.',
        feedbackWrong: '"Since" + specific year marks the starting point → "since 2015".',
      },
      {
        questionText: 'You can improve your English vocabulary __________ reading every day.',
        choices: [
          { text: 'by', isCorrect: true },
          { text: 'with', isCorrect: false },
          { text: 'like', isCorrect: false },
          { text: 'in', isCorrect: false },
        ],
        feedbackCorrect: '"By reading" expresses the method/means of achieving something.',
        feedbackWrong: '"By + gerund" expresses method → "by reading".',
      },
      {
        questionText: 'The school foundation day falls __________ the 15th of October.',
        choices: [
          { text: 'in', isCorrect: false },
          { text: 'at', isCorrect: false },
          { text: 'on', isCorrect: true },
          { text: 'by', isCorrect: false },
        ],
        feedbackCorrect: '"On" is used for specific dates.',
        feedbackWrong: '"On" is used for specific dates → "on the 15th of October".',
      },
      {
        questionText: 'She handled the upset student __________ a professional manner.',
        choices: [
          { text: 'by', isCorrect: false },
          { text: 'in', isCorrect: true },
          { text: 'with', isCorrect: false },
          { text: 'at', isCorrect: false },
        ],
        feedbackCorrect: '"In a professional manner" = describes how something is done.',
        feedbackWrong: '"In a … manner" expresses manner → "in a professional manner".',
      },
      {
        questionText: 'I stayed awake __________ the entire lecture despite being tired.',
        choices: [
          { text: 'throughout', isCorrect: true },
          { text: 'between', isCorrect: false },
          { text: 'among', isCorrect: false },
          { text: 'during', isCorrect: false },
        ],
        feedbackCorrect: '"Throughout" = from beginning to end of a period.',
        feedbackWrong: '"Throughout" means for the entire duration → "throughout the entire lecture".',
      },
      {
        questionText: 'The students arrived __________ the venue __________ a very organized manner.',
        choices: [
          { text: 'on / in', isCorrect: false },
          { text: 'at / in', isCorrect: true },
          { text: 'in / with', isCorrect: false },
          { text: 'to / by', isCorrect: false },
        ],
        feedbackCorrect: '"At" for specific location; "in" for manner.',
        feedbackWrong: '"Arrive at" a specific place; "in an organized manner" → at / in.',
      },
      {
        questionText: '__________ the long summer break, he improved his English __________ reading classic novels.',
        choices: [
          { text: 'During / by', isCorrect: true },
          { text: 'In / with', isCorrect: false },
          { text: 'At / by', isCorrect: false },
          { text: 'On / in', isCorrect: false },
        ],
        feedbackCorrect: '"During" for a period; "by" for method/means.',
        feedbackWrong: '"During" marks a time period; "by reading" = method → During / by.',
      },
      {
        questionText: 'The guest speaker will arrive __________ exactly 9:00 AM __________ invitation of the Principal.',
        choices: [
          { text: 'in / by', isCorrect: false },
          { text: 'at / at the', isCorrect: false },
          { text: 'at / by', isCorrect: true },
          { text: 'on / with', isCorrect: false },
        ],
        feedbackCorrect: '"At" for specific time; "by invitation" = manner/means.',
        feedbackWrong: '"At 9:00 AM" (specific time); "by invitation" (means) → at / by.',
      },
      {
        questionText: 'She finished the difficult exam __________ the time limit __________ great ease.',
        choices: [
          { text: 'within / with', isCorrect: true },
          { text: 'by / in', isCorrect: false },
          { text: 'on / with', isCorrect: false },
          { text: 'in / by', isCorrect: false },
        ],
        feedbackCorrect: '"Within" = inside the time limit; "with ease" = manner.',
        feedbackWrong: '"Within the time limit" (inside a limit); "with great ease" (manner) → within / with.',
      },
      {
        questionText: '__________ the end of the semester, we will have mastered the lessons __________ hard work.',
        choices: [
          { text: 'In / with', isCorrect: false },
          { text: 'By / through', isCorrect: true },
          { text: 'On / by', isCorrect: false },
          { text: 'At / with', isCorrect: false },
        ],
        feedbackCorrect: '"By" marks a future deadline; "through hard work" = means.',
        feedbackWrong: '"By the end" = future deadline; "through hard work" = means → By / through.',
      },
    ],
  },

  // ── Quiz 3: Subject-Verb Agreement (20 questions) ────────────────────────
  {
    id: 'subject_verb',
    title: 'Subject-Verb Agreement Mastery Quiz',
    topic: 'Subject-Verb Agreement',
    questions: [
      {
        questionText: 'Neither the students nor the teacher ( is / are ) ready for the exam.',
        choices: [
          { text: 'is', isCorrect: true },
          { text: 'are', isCorrect: false },
        ],
        feedbackCorrect: 'With "neither…nor", the verb agrees with the nearest subject ("teacher" is singular → "is").',
        feedbackWrong: 'With "neither…nor", the verb agrees with the closest subject. "Teacher" is singular → "is".',
      },
      {
        questionText: 'Everyone in the English Club ( wants / want ) to join the outreach program.',
        choices: [
          { text: 'wants', isCorrect: true },
          { text: 'want', isCorrect: false },
        ],
        feedbackCorrect: '"Everyone" is an indefinite pronoun → always singular → "wants".',
        feedbackWrong: '"Everyone" is always singular → "wants".',
      },
      {
        questionText: 'The information found in these modules ( is / are ) very helpful.',
        choices: [
          { text: 'is', isCorrect: true },
          { text: 'are', isCorrect: false },
        ],
        feedbackCorrect: '"Information" is a noncount noun → always singular → "is".',
        feedbackWrong: '"Information" is uncountable/singular → "is".',
      },
      {
        questionText: 'Many of the applicants ( has / have ) submitted their requirements.',
        choices: [
          { text: 'have', isCorrect: true },
          { text: 'has', isCorrect: false },
        ],
        feedbackCorrect: '"Many" refers to a plural quantity → "have".',
        feedbackWrong: '"Many" is plural → "have", not "has".',
      },
      {
        questionText: 'The proceeds from the school fair ( was / were ) given to the charity.',
        choices: [
          { text: 'were', isCorrect: true },
          { text: 'was', isCorrect: false },
        ],
        feedbackCorrect: '"Proceeds" is always plural → "were".',
        feedbackWrong: '"Proceeds" is always plural → "were".',
      },
      {
        questionText: 'Either the principal or the teachers ( leads / lead ) the morning assembly.',
        choices: [
          { text: 'lead', isCorrect: true },
          { text: 'leads', isCorrect: false },
        ],
        feedbackCorrect: 'With "either…or", the verb agrees with the nearest subject ("teachers" is plural → "lead").',
        feedbackWrong: '"Either…or" → verb agrees with the closer subject. "Teachers" is plural → "lead".',
      },
      {
        questionText: 'Several of my classmates ( is / are ) planning a study group.',
        choices: [
          { text: 'are', isCorrect: true },
          { text: 'is', isCorrect: false },
        ],
        feedbackCorrect: '"Several" is plural → "are".',
        feedbackWrong: '"Several" is plural → "are".',
      },
      {
        questionText: 'Each of the participants ( receives / receive ) a certificate of membership.',
        choices: [
          { text: 'receives', isCorrect: true },
          { text: 'receive', isCorrect: false },
        ],
        feedbackCorrect: '"Each" is always singular → "receives".',
        feedbackWrong: '"Each" is always singular → "receives".',
      },
      {
        questionText: 'The furniture in the faculty room __________ to be dusted. (need)',
        choices: [
          { text: 'needs', isCorrect: true },
          { text: 'need', isCorrect: false },
          { text: 'are needing', isCorrect: false },
        ],
        feedbackCorrect: '"Furniture" is a noncount noun → singular → "needs".',
        feedbackWrong: '"Furniture" is uncountable/singular → "needs".',
      },
      {
        questionText: 'Somebody among the student leaders __________ in the new policy. (believe)',
        choices: [
          { text: 'believes', isCorrect: true },
          { text: 'believe', isCorrect: false },
          { text: 'are believing', isCorrect: false },
        ],
        feedbackCorrect: '"Somebody" is singular → "believes".',
        feedbackWrong: '"Somebody" is always singular → "believes".',
      },
      {
        questionText: 'The goods delivered to the canteen __________ fresh. (be)',
        choices: [
          { text: 'are', isCorrect: true },
          { text: 'is', isCorrect: false },
          { text: 'was', isCorrect: false },
        ],
        feedbackCorrect: '"Goods" is always plural → "are".',
        feedbackWrong: '"Goods" is always plural → "are".',
      },
      {
        questionText: 'Neither the captain nor the players __________ the new schedule. (have)',
        choices: [
          { text: 'have', isCorrect: true },
          { text: 'has', isCorrect: false },
          { text: 'is having', isCorrect: false },
        ],
        feedbackCorrect: 'With "neither…nor", verb agrees with the closer subject ("players" = plural → "have").',
        feedbackWrong: '"Neither…nor" → agree with the closer subject. "Players" is plural → "have".',
      },
      {
        questionText: 'The news about the upcoming holidays __________ exciting. (sound)',
        choices: [
          { text: 'sounds', isCorrect: true },
          { text: 'sound', isCorrect: false },
          { text: 'are sounding', isCorrect: false },
        ],
        feedbackCorrect: '"News" is a noncount noun → singular → "sounds".',
        feedbackWrong: '"News" is always singular (noncount) → "sounds".',
      },
      {
        questionText: 'No one in the class __________ the answer to the bonus question. (do)',
        choices: [
          { text: 'does', isCorrect: true },
          { text: 'do', isCorrect: false },
          { text: 'are doing', isCorrect: false },
        ],
        feedbackCorrect: '"No one" is singular → "does".',
        feedbackWrong: '"No one" is always singular → "does".',
      },
      {
        questionText: 'Both of the candidates __________ qualified for the position. (be)',
        choices: [
          { text: 'are', isCorrect: true },
          { text: 'is', isCorrect: false },
          { text: 'was', isCorrect: false },
        ],
        feedbackCorrect: '"Both" is always plural → "are".',
        feedbackWrong: '"Both" is plural → "are".',
      },
      {
        questionText: 'Which is the CORRECTED version? "Either the students or the monitor are responsible for the classroom\'s cleanliness."',
        choices: [
          { text: 'Either the students or the monitor is responsible for the classroom\'s cleanliness.', isCorrect: true },
          { text: 'Either the students or the monitor are responsible for the classroom\'s cleanliness.', isCorrect: false },
          { text: 'Either the students or the monitor were responsible for the classroom\'s cleanliness.', isCorrect: false },
        ],
        feedbackCorrect: '"Either…or" → verb agrees with the nearer subject "monitor" (singular) → "is".',
        feedbackWrong: '"Either…or" → verb agrees with the closer subject "monitor" (singular) → "is responsible".',
      },
      {
        questionText: 'Which is the CORRECTED version? "The earnings from the small business is enough to cover the tuition fees."',
        choices: [
          { text: 'The earnings from the small business are enough to cover the tuition fees.', isCorrect: true },
          { text: 'The earnings from the small business is enough to cover the tuition fees.', isCorrect: false },
          { text: 'The earnings from the small business were enough to cover the tuition fees.', isCorrect: false },
        ],
        feedbackCorrect: '"Earnings" is always plural → "are".',
        feedbackWrong: '"Earnings" is always plural → "are enough".',
      },
      {
        questionText: 'Which is the CORRECTED version? "Everyone, including the teachers and the staff, were invited to the gala."',
        choices: [
          { text: 'Everyone, including the teachers and the staff, was invited to the gala.', isCorrect: true },
          { text: 'Everyone, including the teachers and the staff, were invited to the gala.', isCorrect: false },
          { text: 'Everyone, including the teachers and the staff, are invited to the gala.', isCorrect: false },
        ],
        feedbackCorrect: '"Everyone" (singular) is the real subject → "was". Intervening phrases don\'t change it.',
        feedbackWrong: '"Including the teachers…" is an intervening phrase. "Everyone" is singular → "was".',
      },
      {
        questionText: 'Which is the CORRECTED version? "Few of the respondents knows the importance of portfolio assessment."',
        choices: [
          { text: 'Few of the respondents know the importance of portfolio assessment.', isCorrect: true },
          { text: 'Few of the respondents knows the importance of portfolio assessment.', isCorrect: false },
          { text: 'Few of the respondents is knowing the importance of portfolio assessment.', isCorrect: false },
        ],
        feedbackCorrect: '"Few" is plural → "know".',
        feedbackWrong: '"Few" is plural → "know", not "knows".',
      },
      {
        questionText: 'Which is the CORRECTED version? "The contents of the research portfolio, along with the abstract, is complete."',
        choices: [
          { text: 'The contents of the research portfolio, along with the abstract, are complete.', isCorrect: true },
          { text: 'The contents of the research portfolio, along with the abstract, is complete.', isCorrect: false },
          { text: 'The contents of the research portfolio, along with the abstract, was complete.', isCorrect: false },
        ],
        feedbackCorrect: '"Contents" is always plural → "are". "Along with the abstract" is an intervening phrase.',
        feedbackWrong: '"Contents" is always plural; "along with…" is an intervening phrase → "are complete".',
      },
    ],
  },
];

// ── Fisher-Yates shuffle ──────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleChoices(choices: { text: string; isCorrect: boolean }[]) {
  return shuffleArray(choices);
}

const LEVEL_META: Record<number, { title: string; emoji: string; color: string; bg: string }> = {
  0: { title: 'Level 1 — Perfect Tenses',         emoji: '⏳', color: '#E85D26', bg: 'linear-gradient(160deg,#FFF3D0,#FFE090 50%,#F5C84A)' },
  1: { title: 'Level 2 — Prepositions',             emoji: '📍', color: '#2E75B6', bg: 'linear-gradient(160deg,#D0E8FF,#A0C8F0 50%,#70A8DC)' },
  2: { title: 'Level 3 — Subject-Verb Agreement',   emoji: '🔗', color: '#5B7A3D', bg: 'linear-gradient(160deg,#D4EED0,#A8D8A0 50%,#7CBB70)' },
};

export default function AdvancedStore() {
  const {
    currentSection, currentStoreIndex,
    completeStore, addScore, addAdvancedScore, setAdvancedLevelScore,
    advancedLevelScores, goToScene,
  } = useGameStore();

  const section = SECTIONS.find(s => s.id === currentSection);
  if (!section) return null;
  const store = section.stores[currentStoreIndex];
  if (!store) return null;

  // storeIndex 0 → Perfect Tenses, 1 → Prepositions, 2 → SVA
  const quizIndex = currentStoreIndex;
  const masteryQuiz = MASTERY_QUIZZES[quizIndex] ?? MASTERY_QUIZZES[0];
  const meta = LEVEL_META[quizIndex] ?? LEVEL_META[0];

  const bgCandidates = getLevelBgCandidates(section.id, currentStoreIndex);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgFailed, setBgFailed] = useState(false);

  // Randomize questions + choices once per mount
  const shuffledQuestions = useMemo(
    () => shuffleArray(masteryQuiz.questions).map(q => ({
      ...q,
      choices: shuffleChoices(q.choices),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masteryQuiz.id],
  );

  const [phase, setPhase] = useState<Phase>('question');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const scoreRef = useRef(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; correctAns: string }[]>([]);
  // Guard: only allow navigating to summary after quiz is genuinely finished
  const [quizFinished, setQuizFinished] = useState(false);

  const totalQ = shuffledQuestions.length;
  const currentQ = shuffledQuestions[qIdx];
  const choiceLabels = ['A', 'B', 'C', 'D'];
  const PASS_THRESHOLD = ADVANCED_PASS_SCORE; // 15 out of 20

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = currentQ.choices[i].isCorrect;
    setIsCorrect(correct);
    setFeedbackText(correct ? currentQ.feedbackCorrect : currentQ.feedbackWrong);
    if (correct) { scoreRef.current += 1; setScoreDisplay(scoreRef.current); }
    const correctChoice = currentQ.choices.find(c => c.isCorrect)!;
    setResults(r => [...r, { correct, correctAns: correctChoice.text }]);
    setPhase('answered');
  };

  const handleNext = () => {
    if (qIdx + 1 >= totalQ) {
      // All questions answered — mark quiz done
      setQuizFinished(true);
      setPhase('done');
      return;
    }
    setQIdx(i => i + 1);
    setSelected(null);
    setFeedbackText('');
    setIsCorrect(false);
    setPhase('question');
  };

  // Only called from the results screen — after quiz is done
  const handleFinish = () => {
    if (!quizFinished) return; // safety guard
    completeStore(section.id, store.id, scoreRef.current);
    addScore(scoreRef.current, totalQ);
    addAdvancedScore(scoreRef.current, totalQ);
    // Save this level's score independently
    setAdvancedLevelScore(quizIndex as 0 | 1 | 2, scoreRef.current);
    goToScene('ADVANCED_SECTION_VIEW');
  };

  const handleRetry = () => {
    setQIdx(0);
    setSelected(null);
    scoreRef.current = 0;
    setScoreDisplay(0);
    setFeedbackText('');
    setResults([]);
    setIsCorrect(false);
    setQuizFinished(false);
    setPhase('question');
  };

  const progressPct = totalQ > 0 ? ((qIdx + (selected !== null ? 1 : 0)) / totalQ) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      background: meta.bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {!bgFailed && (
        <img
          key={`${currentStoreIndex}-${bgIndex}`}
          src={bgCandidates[bgIndex]}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            filter: 'blur(6px) brightness(0.55)', transform: 'scale(1.08)',
            zIndex: 0,
          }}
          onError={() => {
            if (bgIndex < bgCandidates.length - 1) setBgIndex(b => b + 1);
            else setBgFailed(true);
          }}
        />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.72)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0, background: 'white',
        borderBottom: `3px solid ${meta.color}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: 'clamp(8px,1.6vh,16px) clamp(10px,2.5vw,24px)',
        display: 'flex', alignItems: 'center', gap: 'clamp(6px,1.2vw,12px)',
        zIndex: 10, position: 'relative',
      }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flexShrink: 0, fontSize: 'clamp(0.68rem,1.2vw,0.85rem)', padding: '6px 10px' }}
          onClick={() => goToScene('ADVANCED_SECTION_VIEW')}
        >← Levels</button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-title)', fontSize: 'clamp(0.7rem,1.4vw,1rem)',
              color: meta.color, fontWeight: 700,
            }}>
              {meta.emoji} {meta.title}
            </span>
            <span style={{
              flexShrink: 0, background: meta.color, color: 'white',
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.4rem,0.75vw,0.56rem)',
              padding: '2px 7px', borderRadius: '20px', letterSpacing: '1px',
            }}>⚡ MASTERY</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: meta.color, borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{
          flexShrink: 0, fontFamily: 'var(--font-char)', fontWeight: 700,
          fontSize: 'clamp(0.6rem,1.1vw,0.8rem)', color: meta.color,
          background: `${meta.color}15`, border: `1.5px solid ${meta.color}44`,
          borderRadius: '10px', padding: 'clamp(3px,0.5vh,5px) clamp(8px,1.2vw,12px)',
          textAlign: 'center', lineHeight: 1.3,
        }}>
          <div>Q {qIdx + 1}/{totalQ}</div>
          <div style={{ fontSize: 'clamp(0.52rem,0.9vw,0.66rem)', opacity: 0.75 }}>⭐ {scoreDisplay} pts</div>
        </div>
      </div>

      {/* ── Question area ── */}
      {(phase === 'question' || phase === 'answered') && (
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: 'clamp(12px,2.5vh,28px) clamp(12px,3.5vw,44px)',
          display: 'flex', flexDirection: 'column', gap: 'clamp(10px,1.8vh,18px)',
          maxWidth: '760px', width: '100%', margin: '0 auto', boxSizing: 'border-box',
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: meta.color, color: 'white',
              fontFamily: 'var(--font-char)', fontWeight: 700,
              fontSize: 'clamp(0.58rem,1vw,0.72rem)',
              padding: '3px 12px', borderRadius: '20px', flexShrink: 0,
            }}>Question {qIdx + 1} of {totalQ}</div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.54rem,0.9vw,0.66rem)',
              color: 'rgba(0,0,0,0.4)', flexShrink: 0,
            }}>{masteryQuiz.topic}</div>
            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${meta.color}44, transparent)` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
              style={{
                background: 'white', border: `2px solid ${meta.color}33`,
                borderRadius: '16px',
                padding: 'clamp(14px,2.5vh,26px) clamp(14px,2.5vw,26px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(0.88rem,1.8vw,1.2rem)',
                color: '#1A1200', fontWeight: 800, lineHeight: 1.55,
              }}>
                {currentQ.questionText}
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.1vh,10px)' }}>
            {currentQ.choices.map((choice, i) => {
              const isCorrectChoice = choice.isCorrect;
              let bg = 'white', border = 'rgba(0,0,0,0.12)', labelBg = meta.color, textColor = '#1A1200', opacity = 1;
              if (selected !== null) {
                if (isCorrectChoice) { bg = '#D4EDDA'; border = '#28A745'; labelBg = '#28A745'; textColor = '#155724'; }
                else if (i === selected) { bg = '#F8D7DA'; border = '#DC3545'; labelBg = '#DC3545'; textColor = '#721c24'; }
                else { opacity = 0.35; }
              }
              return (
                <motion.button key={i}
                  disabled={selected !== null} onClick={() => handleAnswer(i)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity, x: 0, transition: { delay: i * 0.06 } }}
                  whileHover={selected === null ? { x: 3, boxShadow: `0 4px 16px ${meta.color}33` } : {}}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.5vw,16px)',
                    background: bg, border: `2px solid ${border}`, borderRadius: '12px',
                    padding: 'clamp(9px,1.6vh,15px) clamp(10px,1.8vw,18px)',
                    cursor: selected !== null ? 'default' : 'pointer',
                    textAlign: 'left', width: '100%', transition: 'all 0.18s',
                    boxShadow: selected === null ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 'clamp(26px,3.2vw,34px)', height: 'clamp(26px,3.2vw,34px)',
                    background: labelBg, color: 'white', borderRadius: '8px',
                    fontFamily: 'var(--font-char)', fontWeight: 800,
                    fontSize: 'clamp(0.62rem,1.1vw,0.8rem)', flexShrink: 0, transition: 'background 0.18s',
                  }}>{choiceLabels[i]}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(0.74rem,1.4vw,0.94rem)',
                    color: textColor, lineHeight: 1.5,
                    fontWeight: selected !== null && isCorrectChoice ? 700 : 400, transition: 'color 0.18s',
                  }}>{choice.text}</span>
                  {selected !== null && isCorrectChoice && <span style={{ marginLeft: 'auto', flexShrink: 0 }}>✓</span>}
                  {selected !== null && i === selected && !isCorrectChoice && <span style={{ marginLeft: 'auto', flexShrink: 0 }}>✗</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', paddingTop: '4px', flexWrap: 'wrap' }}>
            {Array.from({ length: totalQ }).map((_, i) => (
              <div key={i} style={{
                width: i === qIdx ? '20px' : '7px', height: '7px', borderRadius: '4px',
                background: i < qIdx ? '#28A745' : i === qIdx ? meta.color : 'rgba(0,0,0,0.12)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Feedback overlay ── */}
      <AnimatePresence>
        {phase === 'answered' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'rgba(0,0,0,0.45)', zIndex: 40,
              padding: 'clamp(14px,3vw,32px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                background: isCorrect ? 'linear-gradient(160deg,#F0FFF4,#D4EDDA)' : 'linear-gradient(160deg,#FFF5F5,#F8D7DA)',
                border: `3px solid ${isCorrect ? '#28A745' : '#DC3545'}`,
                borderRadius: '20px',
                padding: 'clamp(18px,3.5vh,38px) clamp(20px,4.5vw,50px)',
                width: 'clamp(260px,55vw,520px)', maxWidth: '92vw', textAlign: 'center',
                boxShadow: '0 16px 56px rgba(0,0,0,0.35)',
              }}
            >
              <div style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', marginBottom: '10px', lineHeight: 1 }}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(1rem,2.4vw,1.8rem)',
                color: isCorrect ? '#155724' : '#721c24', marginBottom: '12px',
              }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(0.72rem,1.4vw,0.9rem)',
                color: isCorrect ? '#1a5c2e' : '#7a2030',
                lineHeight: 1.7, marginBottom: '22px',
                background: isCorrect ? 'rgba(40,167,69,0.07)' : 'rgba(220,53,69,0.07)',
                borderRadius: '10px', padding: '10px 14px',
              }}>{feedbackText}</div>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                style={{ minWidth: '130px', background: isCorrect ? '#28A745' : meta.color, borderColor: isCorrect ? '#28A745' : meta.color }}
              >
                {qIdx + 1 >= totalQ ? 'See Results →' : 'Next Question →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results overlay (only shown after ALL questions answered) ── */}
      {phase === 'done' && quizFinished && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'rgba(0,0,0,0.55)',
          padding: 'clamp(12px,2.5vw,36px)', overflowY: 'auto', zIndex: 50,
        }}>
          <motion.div
            className="panel"
            initial={{ scale: 0.85, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 'clamp(280px,90vw,520px)', maxWidth: '94vw',
              maxHeight: '88vh', overflowY: 'auto',
              textAlign: 'center', margin: '0 auto', border: `3px solid ${meta.color}`,
            }}
          >
            <div style={{ height: '6px', background: meta.color, borderRadius: '12px 12px 0 0', marginTop: '-1px', marginLeft: '-1px', marginRight: '-1px' }} />
            <div style={{ padding: 'clamp(14px,2.5vh,26px) clamp(14px,2.5vw,22px)' }}>

              <div style={{ marginBottom: '6px' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(0.78rem,1.5vw,1.1rem)', color: meta.color, marginBottom: '4px' }}>
                  {meta.emoji} {meta.title} — Complete!
                </div>
                <div style={{
                  fontFamily: 'var(--font-title)', lineHeight: 1,
                  fontSize: 'clamp(2rem,5vw,3.8rem)',
                  color: scoreRef.current >= PASS_THRESHOLD ? '#28A745' : meta.color,
                }}>
                  {scoreRef.current}/{totalQ}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.6rem,1.1vw,0.76rem)', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {Math.round((scoreRef.current / totalQ) * 100)}% correct
                  {scoreRef.current >= PASS_THRESHOLD ? ' — 🎉 Passed!' : ` — Need ${PASS_THRESHOLD}/${totalQ} to pass`}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <motion.span key={n}
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: n * 0.08, type: 'spring', stiffness: 300 }}
                    style={{ fontSize: 'clamp(1.2rem,2.8vw,2.1rem)' }}>
                    {n <= scoreRef.current ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>

              {/* Per-question results */}
              <div style={{
                background: 'var(--surface)', borderRadius: '12px',
                padding: 'clamp(8px,1.5vh,14px) clamp(10px,1.8vw,16px)',
                marginBottom: '16px', textAlign: 'left',
                maxHeight: '240px', overflowY: 'auto',
              }}>
                <div style={{
                  fontFamily: 'var(--font-char)', fontWeight: 700,
                  fontSize: 'clamp(0.62rem,1.1vw,0.78rem)', color: 'var(--olive-brown)',
                  marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}>Question Results ({results.length}/{totalQ} answered)</div>
                {results.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: 'clamp(4px,0.8vh,7px) 0',
                    borderBottom: i < results.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', flexWrap: 'wrap',
                  }}>
                    <span style={{ fontFamily: 'var(--font-char)', fontWeight: 700, fontSize: 'clamp(0.58rem,1vw,0.72rem)', color: 'var(--text-muted)', flexShrink: 0, minWidth: '24px' }}>Q{i + 1}</span>
                    <span style={{ fontSize: 'clamp(0.82rem,1.4vw,1rem)', flexShrink: 0 }}>{r.correct ? '✅' : '❌'}</span>
                    {!r.correct && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.56rem,1vw,0.7rem)', color: '#28A745' }}>
                        Correct: {r.correctAns}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => goToScene('ADVANCED_SECTION_VIEW')}>
                  ← Back to Levels
                </button>
                <motion.button className="btn btn-primary btn-sm"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={handleRetry}
                  style={{ background: meta.color, borderColor: meta.color }}>
                  🔄 Retry
                </motion.button>
                {/* Certificate button — only available after ALL 3 levels are passed (≥15/20 each) */}
                {(() => {
                  // Compute updated scores including current result
                  const updatedScores: [number, number, number] = [...advancedLevelScores] as [number, number, number];
                  updatedScores[quizIndex] = Math.max(updatedScores[quizIndex], scoreRef.current);
                  const allPassed = updatedScores.every(s => s >= ADVANCED_PASS_SCORE);
                  if (allPassed) {
                    return (
                      <motion.button className="btn btn-success"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (!quizFinished) return;
                          completeStore(section.id, store.id, scoreRef.current);
                          addScore(scoreRef.current, totalQ);
                          addAdvancedScore(scoreRef.current, totalQ);
                          setAdvancedLevelScore(quizIndex as 0 | 1 | 2, scoreRef.current);
                          goToScene('SCORE_SUMMARY');
                        }}>
                        📜 Get Certificate →
                      </motion.button>
                    );
                  }
                  // Show which levels still need to be passed
                  const remaining = updatedScores.filter(s => s < ADVANCED_PASS_SCORE).length;
                  return (
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.56rem,1vw,0.7rem)',
                      color: 'var(--text-muted)',
                      padding: '8px 14px',
                      background: 'rgba(0,0,0,0.06)',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}>
                      🔒 Pass all 3 levels ({remaining} remaining) to unlock certificate
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}