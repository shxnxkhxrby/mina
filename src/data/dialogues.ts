// Exact scripts from project_specification.md and storyline document

export const TEACHER_DIALOGUES = [
  { speaker:'Teacher', text:"Class, today we'll learn about Minasa, a traditional cookie from Bustos, Bulacan. Minasa is known for its soft, crumbly texture and was first made during the Spanish colonial era." },
  { speaker:'Teacher', text:"Locals used leftover egg yolks — from construction practices using egg whites — to create pastries. Originally, Minasa was made with arrowroot or sago flour, but today it's commonly made with cassava flour." },
  { speaker:'Teacher', text:"Its name comes from the Filipino word 'minasa,' meaning 'kneaded,' which reflects its preparation process." },
  { speaker:'Teacher', text:"Minasa isn't just a cookie — it's part of Bulacan's heritage, celebrated annually during the Minasa Festival, and often served during special occasions." },
  { speaker:'Teacher', text:"One of its keepers, Lilibeth Carangan, learned the craft from her parents and has continued the tradition for nearly 40 years. Making Minasa started as a way to survive poverty and eventually became a livelihood." },
  { speaker:'Teacher', text:"Today, her business, Aling Liling Minasa, is famous for its unique taste and quality." },
  { speaker:'Teacher', text:"Now, as the Minasa Festival approaches, your task is twofold: First, create or bake a sample Minasa, following the traditional steps." },
  { speaker:'Teacher', text:"Second, document some of the events happening during the festival." },
  { speaker:'Teacher', text:"This will give you a hands-on experience of both the heritage and celebration of Minasa, and help you understand why it's such an important part of Bulacan's culture." },
];

export const MINA_INTRO_DIALOGUES = [
  { speaker:'Mina', text:"Hello! I'm Mina, here to guide you through your Minasa Festival tasks. I see you've learned about the history of Minasa and your assignments, but maybe you're wondering where to start." },
  { speaker:'Mina', text:"No worries! First, we'll visit local shops in Bustos that sell Minasa. Talking to the shop owners will help you practice your English by asking questions and reporting answers." },
  { speaker:'Mina', text:"You'll also observe how Minasa is made and sold, which will help with your documentation task." },
  { speaker:'Mina', text:"Along the way, I'll guide you through different places in Bustos while also teaching important grammar areas such as Tenses, Subject-Verb Agreement, and Prepositions." },
  { speaker:'Mina', text:"Ready? Let's begin your adventure! 🌸" },
];

// Store greeting dialogues — shown BEFORE questions start
export const STORE_GREETINGS: Record<string, { lines: {speaker:string; text:string}[] }> = {
  // Section A
  'A1': { lines: [
    { speaker:'Aling Liling', text:"Oh, hello there! How can I help you, my dear?" },
    { speaker:'Student', text:"Oh hi! I want to learn about the history of Minasa." },
    { speaker:'Aling Liling', text:"Well, before the festival became popular, our ancestors had already created special recipes. Let's see if you understand." },
  ]},
  'A2': { lines: [
    { speaker:'Zeny', text:"Hello! Looking for ingredients?" },
    { speaker:'Student', text:"Yes! What makes Minasa special?" },
    { speaker:'Zeny', text:"I have used fresh coconut for many years. Let's test your knowledge." },
  ]},
  'A3': { lines: [
    { speaker:'Elsa', text:"Welcome! Timing is everything in baking." },
    { speaker:'Student', text:"I want to learn the process!" },
    { speaker:'Elsa', text:"By tomorrow, I will have completed all preparations. Let's see if you can apply future perfect." },
  ]},
  // Section B
  'B1': { lines: [
    { speaker:'Flour Shopkeeper', text:"Hello! Are you looking for flour?" },
    { speaker:'Student', text:"Yes! I need flour to make Minasa." },
    { speaker:'Flour Shopkeeper', text:"Great! Let me test you on subject-verb agreement while you shop." },
  ]},
  'B2': { lines: [
    { speaker:'Milk Shopkeeper', text:"Good day! Looking for milk?" },
    { speaker:'Student', text:"Yes! Milk is one of the ingredients for Minasa." },
    { speaker:'Milk Shopkeeper', text:"Wonderful! Let's see if you know your singular and plural quantifiers." },
  ]},
  'B3': { lines: [
    { speaker:'Egg Shopkeeper', text:"Good day! Are you looking for eggs?" },
    { speaker:'Student', text:"Yes! I need eggs for the Minasa recipe." },
    { speaker:'Egg Shopkeeper', text:"Perfect! Let's test your knowledge of noncount nouns and plural-only nouns." },
  ]},
  // Section C
  'C1': { lines: [
    { speaker:'John Ray', text:"Hello there! I just finished the Juan Ride on the Go cycling event around Bustos!" },
    { speaker:'Student', text:"That sounds exciting! Can I ask you about the ride?" },
    { speaker:'John Ray', text:"Of course! Let's see if you remember the schedule of the ride!" },
  ]},
  'C2': { lines: [
    { speaker:'Al', text:"Hey there! What a great ride that was!" },
    { speaker:'Student', text:"I'd love to document how the ride went. Can I ask you some questions?" },
    { speaker:'Al', text:"Alright! Let's focus on how things were done during the ride." },
  ]},
  'C3': { lines: [
    { speaker:'Karen', text:"Hi! I just finished the Juan Ride on the Go. What an experience!" },
    { speaker:'Student', text:"Amazing! Can I ask you about both the time and the way you joined?" },
    { speaker:'Karen', text:"Now let's see if you can combine both time and manner!" },
  ]},
};

export const CUTSCENE_PARAGRAPHS = [
  {
    title: 'Perfect Tenses',
    text: "After visiting local shops for tips, the student has gathered valuable advice from bakers. Early in the morning, she has prepared all ingredients. The flour, sugar, and egg yolks have been measured carefully, and she has combined the wet and dry ingredients into a smooth dough. She has rolled the dough, has placed it on the trel, and has pressed it with a rolling pin to imprint designs. Each design has been aligned. After separating the biscuits, she has arranged them on the tray, has set the oven, and as she has waited, she has reviewed all the tips she had collected. By the time the oven has reached the right temperature, she has placed the tray inside. She has baked the biscuits, and the aroma has filled the kitchen. By evening, she will have completed the batch. Throughout, she has worked carefully and has reflected on her learning.",
    highlights: [
      { word:'has gathered', rule:'Present Perfect', explanation:'has/have + past participle — the gathering started in the past and the result is relevant now.', formula:'have/has + past participle' },
      { word:'have been measured', rule:'Present Perfect Passive', explanation:'have/has + been + past participle — passive voice in present perfect.', formula:'have/has + been + past participle' },
      { word:'had collected', rule:'Past Perfect', explanation:'had + past participle — she collected tips BEFORE she waited, showing an earlier past action.', formula:'had + past participle' },
      { word:'will have completed', rule:'Future Perfect', explanation:'will + have + past participle — the batch will be done before evening arrives.', formula:'will + have + past participle' },
    ]
  },
  {
    title: 'Subject-Verb Agreement',
    text: "She has rolled the dough, making sure each piece is even in thickness. Each design is aligned so that none of the biscuits are damaged. She has realized that everyone she spoke to was eager to share tips. Finally, she ensured that each Minasa biscuit is perfect in shape and taste. The tray of ingredients and the batch of biscuits are ready for baking. The advice she received is clear and reliable.",
    highlights: [
      { word:'each piece is', rule:"SVA — 'Each' (Quantifiers)", explanation:"'Each' is always singular → takes singular verb 'is'.", formula:'each + singular noun → singular verb' },
      { word:'none of the biscuits are', rule:"SVA — 'None' (Quantifiers)", explanation:"'None' with plural nouns can take plural verb 'are'.", formula:'none of + plural noun → plural verb' },
      { word:'everyone she spoke to was', rule:"SVA — 'Everyone' (Quantifiers)", explanation:"'Everyone' is singular → takes singular verb 'was'.", formula:'everyone → singular verb' },
      { word:'The advice she received is', rule:"SVA — Noncount Noun", explanation:"'Advice' is a noncount noun → always takes singular verb.", formula:'noncount noun → singular verb' },
    ]
  },
  {
    title: 'Prepositions of Time & Manner',
    text: "Early in the morning, she prepared the ingredients. She has set the oven and, as she waited, followed tips according to advice collected. By the time the oven reached the right temperature, she has placed the tray inside. By the evening, she will finish baking. Throughout, she has worked carefully with patience, measuring ingredients by hand, and at each step has reflected on her learning.",
    highlights: [
      { word:'in the morning', rule:'Preposition of Time — IN', explanation:"'In' is used for parts of the day (in the morning, in the afternoon).", formula:'IN + part of day / month / year / season' },
      { word:'By the time', rule:'Preposition of Time — BY', explanation:"'By' indicates a deadline — before that point in time.", formula:'BY + deadline/time' },
      { word:'By the evening', rule:'Preposition of Time — BY', explanation:"'By' shows a deadline — the baking will be done before evening.", formula:'BY + deadline' },
      { word:'with patience', rule:'Preposition of Manner — WITH', explanation:"'With' shows HOW she worked — the manner or attitude of her actions.", formula:'WITH + manner/attitude/companionship' },
      { word:'by hand', rule:'Preposition of Manner — BY', explanation:"'By' shows the method/mode of action — measuring manually.", formula:'BY + method/mode' },
      { word:'at each step', rule:'Preposition of Time — AT', explanation:"'At' for specific points or moments.", formula:'AT + specific point/time' },
    ]
  }
];
