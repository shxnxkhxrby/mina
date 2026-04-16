import type { Section } from '../types';

export const SECTION_D: Section = {
  id: 'D',
  name: 'Grammar Street Dance Challenge',
  location: 'Festival Stage',
  grammarTopic: 'Mixed Grammar Review',
  emoji: '💃',
  color: '#8B1A8B',
  lesson: {
    topic: 'Mixed Grammar Review',
    intro: "Welcome to the Grammar Street Dance Challenge! Before our dancers show their moves, let's review today's grammar focus.",
    rule: "We'll review three areas:\n1. Prepositions of time and manner (at, on, in, by, with)\n2. Subject-Verb Agreement (proximity rule, indefinite pronouns, noncount nouns)\n3. Perfect Tenses (past perfect, present perfect, future perfect)",
    formula: "PREPOSITIONS: at = exact time · on = days/dates · in = months/years/periods · by = mode · with = manner\n\nSVA RULES: verb follows closest subject (or/nor) · each/everyone = singular · both/many = plural · noncount nouns = singular · goods/earnings/surroundings = plural\n\nPERFECT TENSES: had + pp (past perfect) · have/has + pp (present perfect) · will have + pp (future perfect)",
    examples: [
      "Neither the dancers nor the coach is ready. (SVA – nearest subject 'coach' is singular)",
      "We had practiced for weeks before the audition. (Past Perfect)",
      "We danced at midnight with passion. (Prepositions of time and manner)"
    ]
  },
  stores: [
    // ── DANCER 1: CHRISTINE ──────────────────────────────────────────────────
    {
      id: 'D1',
      name: 'Christine',
      npcName: 'Christine',
      emoji: '💃',
      description: 'Discipline · Mixed Grammar',
      questionSets: [
        {
          id: 'A',
          questions: [
            {
              id: 'D1A1',
              npcDialogueBefore: "Hi! I'm Christine. Discipline is the key to every great performance. Let's see if you can keep up!",
              questionText: '"Which sentence is correct?"',
              choices: [
                { text: 'A. Neither the dancers nor the coach is ready.', isCorrect: true },
                { text: 'B. Neither the dancers nor the coach are ready.', isCorrect: false },
              ],
              feedbackCorrect: "Great! The verb agrees with the closest subject, 'coach,' which is singular.",
              feedbackWrong: "That's not quite correct, but that's okay! Remember, with 'neither...nor,' the verb follows the nearest subject. 'Coach' is singular → 'is.'",
              grammarRule: "SVA Rule 3: With or/nor, the verb agrees with the closest subject.",
            },
            {
              id: 'D1A2',
              npcDialogueBefore: "Each one matters in the performance. Discipline keeps us precise.",
              questionText: '"Each of the performers ___ proud of their effort."',
              choices: [
                { text: 'A. are', isCorrect: false },
                { text: 'B. is', isCorrect: true },
              ],
              feedbackCorrect: "Well done! 'Each' is always singular and takes a singular verb.",
              feedbackWrong: "Not quite, but don't worry! 'Each' always takes a singular verb → 'is.'",
              grammarRule: "SVA Rule 4: 'Each' is singular.",
            },
            {
              id: 'D1A3',
              npcDialogueBefore: "Our costumes are ready. Hard work made it possible.",
              questionText: '"The earnings from the fundraiser ___ enough for costumes."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Correct! 'Earnings' is always plural and takes a plural verb.",
              feedbackWrong: "That's not quite correct, but keep going! 'Earnings' is a plural-only noun → 'are.'",
              grammarRule: "SVA Rule 5: 'Earnings' is always plural.",
            },
            {
              id: 'D1A4',
              npcDialogueBefore: "Preparation leads to success. Just like practice before performance.",
              questionText: '"Identify the tense: We had practiced for weeks before the audition."',
              choices: [
                { text: 'A. Present perfect', isCorrect: false },
                { text: 'B. Future perfect', isCorrect: false },
                { text: 'C. Past perfect', isCorrect: true },
              ],
              feedbackCorrect: "Excellent! That's past perfect — an action completed before another past action.",
              feedbackWrong: "Not quite, but that's okay! 'Had + past participle' before another past event = Past Perfect.",
              grammarRule: "Past Perfect: had + past participle for the earlier of two past actions.",
            },
            {
              id: 'D1A5',
              npcDialogueBefore: "Nice! Discipline and grammar go hand in hand.",
              questionText: '"We danced ___ midnight ___ passion."',
              choices: [
                { text: 'A. in midnight, with passion', isCorrect: false },
                { text: 'B. on midnight, with passion', isCorrect: false },
                { text: 'C. at midnight, by passion', isCorrect: false },
                { text: 'D. at midnight, with passion', isCorrect: true },
              ],
              feedbackCorrect: "Perfect! 'At' for exact time and 'with' for manner. Excellent grammar!",
              feedbackWrong: "That's not quite correct, but don't worry! 'At' = exact time; 'with' = manner or attitude. Answer: at midnight, with passion.",
              grammarRule: "AT + exact time; WITH + manner or attitude.",
            },
          ],
        },
        {
          id: 'B',
          questions: [
            {
              id: 'D1B1',
              npcDialogueBefore: "Let's try another round! Which verb is correct?",
              questionText: '"Either the music or the dancers ___ setting the mood."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Correct! The verb agrees with the nearest subject 'dancers,' which is plural.",
              feedbackWrong: "A — 'are.' Nearest subject is 'dancers' (plural) → 'are.'",
              grammarRule: "SVA: with either/or, verb agrees with closest subject.",
            },
            {
              id: 'D1B2',
              npcDialogueBefore: "What about quantifiers?",
              questionText: '"Several of the performers ___ already on stage."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Great! 'Several' is plural → 'are.'",
              feedbackWrong: "A — 'are.' 'Several' always takes a plural verb.",
              grammarRule: "SVA Rule 4: 'Several' is plural.",
            },
            {
              id: 'D1B3',
              npcDialogueBefore: "Let's check a noncount noun.",
              questionText: '"The music from the speakers ___ amazing."',
              choices: [
                { text: 'A. sounds', isCorrect: true },
                { text: 'B. sound', isCorrect: false },
              ],
              feedbackCorrect: "'Music' is a noncount noun and takes a singular verb.",
              feedbackWrong: "A — 'sounds.' 'Music' is noncount → singular verb.",
              grammarRule: "SVA Rule 5: Noncount nouns take singular verbs.",
            },
            {
              id: 'D1B4',
              npcDialogueBefore: "Now a perfect tense check.",
              questionText: '"By the time the judges arrive, we ___ our performance."',
              choices: [
                { text: 'A. have finished', isCorrect: false },
                { text: 'B. will have finished', isCorrect: true },
                { text: 'C. had finished', isCorrect: false },
              ],
              feedbackCorrect: "Excellent! Future perfect — completed before a future event.",
              feedbackWrong: "B — 'will have finished.' 'By the time' + future = Future Perfect.",
              grammarRule: "Future Perfect: will have + past participle before a future deadline.",
            },
            {
              id: 'D1B5',
              npcDialogueBefore: "Last one — prepositions!",
              questionText: '"The rehearsal was held ___ Friday ___ a serious tone."',
              choices: [
                { text: 'A. in Friday, with a serious tone', isCorrect: false },
                { text: 'B. at Friday, with a serious tone', isCorrect: false },
                { text: 'C. on Friday, by a serious tone', isCorrect: false },
                { text: 'D. on Friday, with a serious tone', isCorrect: true },
              ],
              feedbackCorrect: "ON = day; WITH = manner. Well done!",
              feedbackWrong: "D — 'on Friday, with a serious tone.' ON = day; WITH = manner.",
              grammarRule: "ON + day of week; WITH + manner or attitude.",
            },
          ],
        },
      ],
    },

    // ── DANCER 2: KATHLEEN ───────────────────────────────────────────────────
    {
      id: 'D2',
      name: 'Kathleen',
      npcName: 'Kathleen',
      emoji: '🩰',
      description: 'Creativity · Mixed Grammar',
      questionSets: [
        {
          id: 'A',
          questions: [
            {
              id: 'D2A1',
              npcDialogueBefore: "Hey there! I'm Kathleen. Creativity is all about expression — let's see how creative your grammar is!",
              questionText: '"Which is correct?"',
              choices: [
                { text: 'A. Either the costumes or the music inspires us.', isCorrect: true },
                { text: 'B. Either the costumes or the music inspire us.', isCorrect: false },
              ],
              feedbackCorrect: "Great! The verb agrees with 'music,' the closest subject.",
              feedbackWrong: "Not quite, but that's okay! Always check the subject nearest the verb. 'Music' is singular → 'inspires.'",
              grammarRule: "SVA Rule 3: With either/or, verb agrees with closest subject.",
            },
            {
              id: 'D2A2',
              npcDialogueBefore: "Creativity fuels readiness. And grammar keeps it clear.",
              questionText: '"Many of the dancers ___ ready to perform."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Correct! 'Many' is plural and takes a plural verb.",
              feedbackWrong: "That's not quite correct, but keep going! 'Many' always takes a plural verb → 'are.'",
              grammarRule: "SVA Rule 4: 'Many' is plural.",
            },
            {
              id: 'D2A3',
              npcDialogueBefore: "Our props arrived just in time. Everything is set!",
              questionText: '"The goods ___ delivered yesterday."',
              choices: [
                { text: 'A. were', isCorrect: true },
                { text: 'B. was', isCorrect: false },
              ],
              feedbackCorrect: "Exactly! 'Goods' is always plural and takes a plural verb.",
              feedbackWrong: "Not quite, but don't worry! 'Goods' is a plural-only noun → 'were.'",
              grammarRule: "SVA Rule 5: 'Goods' is always plural.",
            },
            {
              id: 'D2A4',
              npcDialogueBefore: "Practice never stops. Creativity keeps growing.",
              questionText: '"Identify the tense: We have practiced every day this week."',
              choices: [
                { text: 'A. Future perfect', isCorrect: false },
                { text: 'B. Past perfect', isCorrect: false },
                { text: 'C. Present perfect', isCorrect: true },
              ],
              feedbackCorrect: "Well done! Present perfect shows an action continuing up to now.",
              feedbackWrong: "That's not quite correct, but you're learning! 'Have + past participle' connected to the present = Present Perfect.",
              grammarRule: "Present Perfect: have/has + past participle for actions connected to now.",
            },
            {
              id: 'D2A5',
              npcDialogueBefore: "Nice work! Creativity shines with correct grammar.",
              questionText: '"We danced ___ the morning ___ energy."',
              choices: [
                { text: 'A. on the morning, with energy', isCorrect: false },
                { text: 'B. in the morning, by energy', isCorrect: false },
                { text: 'C. at the morning, by energy', isCorrect: false },
                { text: 'D. in the morning, with energy', isCorrect: true },
              ],
              feedbackCorrect: "Perfect! 'In' for parts of the day and 'with' for manner. Excellent!",
              feedbackWrong: "That's not quite correct, but no worries! 'In' = parts of the day; 'with' = manner. Answer: in the morning, with energy.",
              grammarRule: "IN + part of day; WITH + manner or attitude.",
            },
          ],
        },
        {
          id: 'B',
          questions: [
            {
              id: 'D2B1',
              npcDialogueBefore: "Round 2! Let's keep going.",
              // BUG FIX: original had A marked correct but feedback says answer is B/'are'.
              // Nearest subject is 'backup dancers' (plural) → 'are' is correct.
              questionText: '"Neither the captain nor the backup dancers ___ nervous."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Correct! The nearest subject is 'backup dancers' (plural) → 'are.'",
              feedbackWrong: "Check the nearest subject — 'backup dancers' is plural → 'are.'",
              grammarRule: "SVA: verb agrees with the nearest subject in or/nor constructions.",
            },
            {
              id: 'D2B2',
              npcDialogueBefore: "What about these pronouns?",
              questionText: '"Somebody ___ left a costume backstage."',
              choices: [
                { text: 'A. have', isCorrect: false },
                { text: 'B. has', isCorrect: true },
              ],
              feedbackCorrect: "'Somebody' is singular → 'has.'",
              feedbackWrong: "B — 'has.' 'Somebody' is an indefinite pronoun → singular.",
              grammarRule: "SVA Rule 4: Indefinite pronouns like somebody are singular.",
            },
            {
              id: 'D2B3',
              npcDialogueBefore: "How about this one?",
              questionText: '"The proceeds from ticket sales ___ used for new equipment."',
              choices: [
                { text: 'A. were', isCorrect: true },
                { text: 'B. was', isCorrect: false },
              ],
              feedbackCorrect: "'Proceeds' is always plural → 'were.'",
              feedbackWrong: "A — 'were.' 'Proceeds' is a plural-only noun.",
              grammarRule: "SVA Rule 5: 'Proceeds' is always plural.",
            },
            {
              id: 'D2B4',
              npcDialogueBefore: "Perfect tense check!",
              questionText: '"She was thrilled because she ___ finally mastered the routine."',
              choices: [
                { text: 'A. will have mastered', isCorrect: false },
                { text: 'B. had finally mastered', isCorrect: true },
                { text: 'C. has finally mastered', isCorrect: false },
              ],
              feedbackCorrect: "Past perfect! The mastering happened before the thrilling past feeling.",
              feedbackWrong: "B — 'had finally mastered.' Action before a past reaction = Past Perfect.",
              grammarRule: "Past Perfect for the earlier of two past events.",
            },
            {
              id: 'D2B5',
              npcDialogueBefore: "Last question!",
              questionText: '"The competition starts ___ 3 PM ___ great excitement."',
              choices: [
                { text: 'A. in 3 PM, with great excitement', isCorrect: false },
                { text: 'B. at 3 PM, by great excitement', isCorrect: false },
                { text: 'C. on 3 PM, with great excitement', isCorrect: false },
                { text: 'D. at 3 PM, with great excitement', isCorrect: true },
              ],
              feedbackCorrect: "AT = exact time; WITH = manner. You nailed it!",
              feedbackWrong: "D — 'at 3 PM, with great excitement.' AT = exact clock time; WITH = manner.",
              grammarRule: "AT + exact clock time; WITH + manner.",
            },
          ],
        },
      ],
    },

    // ── DANCER 3: CHRISTIAN ──────────────────────────────────────────────────
    {
      id: 'D3',
      name: 'Christian',
      npcName: 'Christian',
      emoji: '🕺',
      description: 'Unity · Mixed Grammar',
      questionSets: [
        {
          id: 'A',
          questions: [
            {
              id: 'D3A1',
              npcDialogueBefore: "Hello! I'm Christian. Unity makes every performance stronger. Let's work together on this!",
              questionText: '"Which is correct?"',
              choices: [
                { text: 'A. Either the captain or the dancers leads the routine.', isCorrect: false },
                { text: 'B. Either the captain or the dancers lead the routine.', isCorrect: true },
              ],
              feedbackCorrect: "Great! The verb agrees with 'dancers,' the closest subject — and 'dancers' is plural.",
              feedbackWrong: "Not quite, but that's okay! Nearest subject is 'dancers' (plural) → 'lead.'",
              grammarRule: "SVA Rule 3: With either/or, verb agrees with closest subject.",
            },
            {
              id: 'D3A2',
              npcDialogueBefore: "Everyone plays a part. Unity brings strength.",
              questionText: '"Everybody ___ excited for the contest."',
              choices: [
                { text: 'A. are', isCorrect: false },
                { text: 'B. is', isCorrect: true },
              ],
              feedbackCorrect: "Correct! 'Everybody' is singular and takes a singular verb.",
              feedbackWrong: "That's not quite correct, but don't worry! 'Everybody' is an indefinite pronoun → singular verb 'is.'",
              grammarRule: "SVA Rule 4: 'Everybody' is singular.",
            },
            {
              id: 'D3A3',
              npcDialogueBefore: "The energy fills the place. We feel it together.",
              questionText: '"The surroundings ___ lively during practice."',
              choices: [
                { text: 'A. are', isCorrect: true },
                { text: 'B. is', isCorrect: false },
              ],
              feedbackCorrect: "Exactly! 'Surroundings' is a plural-only noun and takes a plural verb.",
              feedbackWrong: "Not quite, but that's okay! 'Surroundings' is always plural → 'are.'",
              grammarRule: "SVA Rule 5: 'Surroundings' is always plural.",
            },
            {
              id: 'D3A4',
              npcDialogueBefore: "We'll be ready on time. Unity keeps us strong.",
              questionText: '"Identify the tense: We will have finished our routine before the contest begins."',
              choices: [
                { text: 'A. Present perfect', isCorrect: false },
                { text: 'B. Past perfect', isCorrect: false },
                { text: 'C. Future perfect', isCorrect: true },
              ],
              feedbackCorrect: "Excellent! Future perfect shows completion before a future event.",
              feedbackWrong: "That's not quite correct, but keep going! 'Will have + past participle' completed before a future time = Future Perfect.",
              grammarRule: "Future Perfect: will have + past participle for actions completed before a future point.",
            },
            {
              id: 'D3A5',
              npcDialogueBefore: "Great teamwork! Unity and grammar go together.",
              questionText: '"We danced ___ the afternoon ___ unity."',
              choices: [
                { text: 'A. at the afternoon, by unity', isCorrect: false },
                { text: 'B. on the afternoon, with unity', isCorrect: false },
                { text: 'C. in the afternoon, by unity', isCorrect: false },
                { text: 'D. in the afternoon, with unity', isCorrect: true },
              ],
              feedbackCorrect: "Perfect! You combined time and manner correctly. 'In' for parts of the day; 'with' for manner.",
              feedbackWrong: "Not quite, but don't worry! 'In' = parts of the day; 'with' = manner. Answer: in the afternoon, with unity.",
              grammarRule: "IN + part of day; WITH + manner.",
            },
          ],
        },
        {
          id: 'B',
          questions: [
            {
              id: 'D3B1',
              npcDialogueBefore: "One more round! You're almost there.",
              questionText: '"Neither the judges nor the host ___ announced the winner yet."',
              choices: [
                { text: 'A. have', isCorrect: false },
                { text: 'B. has', isCorrect: true },
              ],
              feedbackCorrect: "Nearest subject is 'host' (singular) → 'has.'",
              feedbackWrong: "B — 'has.' Nearest subject 'host' is singular → 'has.'",
              grammarRule: "SVA: verb agrees with nearest subject in neither/nor.",
            },
            {
              id: 'D3B2',
              npcDialogueBefore: "What about this one?",
              questionText: '"Both of the dance captains ___ checked the roster."',
              choices: [
                { text: 'A. have', isCorrect: true },
                { text: 'B. has', isCorrect: false },
              ],
              feedbackCorrect: "'Both' is plural → 'have.'",
              feedbackWrong: "A — 'have.' 'Both' is always plural.",
              grammarRule: "SVA Rule 4: 'Both' is plural.",
            },
            {
              id: 'D3B3',
              npcDialogueBefore: "Noncount noun check!",
              questionText: '"The advice from the coach ___ very helpful."',
              choices: [
                { text: 'A. are', isCorrect: false },
                { text: 'B. is', isCorrect: true },
              ],
              feedbackCorrect: "'Advice' is a noncount noun → singular verb 'is.'",
              feedbackWrong: "B — 'is.' 'Advice' is noncount → singular.",
              grammarRule: "SVA Rule 5: Noncount nouns like 'advice' are singular.",
            },
            {
              id: 'D3B4',
              npcDialogueBefore: "Final tense question!",
              questionText: '"By next month, the team ___ performed in three competitions."',
              choices: [
                { text: 'A. has performed', isCorrect: false },
                { text: 'B. will have performed', isCorrect: true },
                { text: 'C. had performed', isCorrect: false },
              ],
              feedbackCorrect: "Future perfect — completed before a future deadline. Excellent!",
              feedbackWrong: "B — 'will have performed.' 'By next month' = future deadline → Future Perfect.",
              grammarRule: "Future Perfect: will have + past participle.",
            },
            {
              id: 'D3B5',
              npcDialogueBefore: "Last question — you've got this!",
              questionText: '"The final performance was held ___ December ___ great pride."',
              choices: [
                { text: 'A. on December, with great pride', isCorrect: false },
                { text: 'B. at December, with great pride', isCorrect: false },
                { text: 'C. in December, by great pride', isCorrect: false },
                { text: 'D. in December, with great pride', isCorrect: true },
              ],
              feedbackCorrect: "IN = month; WITH = manner. You've mastered both prepositions!",
              feedbackWrong: "D — 'in December, with great pride.' IN = month; WITH = manner.",
              grammarRule: "IN + month; WITH + manner.",
            },
          ],
        },
      ],
    },
  ],
};