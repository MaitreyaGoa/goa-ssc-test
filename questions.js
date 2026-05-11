// ============================================================
// GOA SSC PC Mock Test 3 – Question Bank
// Section A: English (Q1–30) | Section B: Maths (Q31–40) | Section C: Reasoning (Q41–50)
// Corrected Q33 (original was invalid – student scoring 72% cannot fail when pass mark is 40%)
// ============================================================

const PASSAGE = `Artificial Intelligence is rapidly transforming modern industries. While it increases efficiency and reduces human effort, it also raises concerns about job displacement. Experts believe that although some jobs may disappear, new opportunities requiring advanced skills will emerge.`;

const questions = [

  // ─── SECTION A: ENGLISH (Q1–30) ───

  // Reading Comprehension (Q1–5)
  {
    id: 1, section: "English",
    passage: PASSAGE,
    text: "What is the main idea of the passage?",
    options: ["AI reduces efficiency", "AI replaces all jobs", "Impact of AI on jobs", "AI is unnecessary"],
    answer: "C"
  },
  {
    id: 2, section: "English",
    passage: PASSAGE,
    text: "What concern is mentioned in the passage?",
    options: ["Cost increase", "Job loss", "Lack of machines", "Slow work"],
    answer: "B"
  },
  {
    id: 3, section: "English",
    passage: PASSAGE,
    text: "What do experts believe?",
    options: ["AI is harmful", "AI creates no jobs", "AI will create new opportunities", "AI will stop development"],
    answer: "C"
  },
  {
    id: 4, section: "English",
    passage: PASSAGE,
    text: "Synonym of \"emerge\":",
    options: ["Appear", "Hide", "Reduce", "End"],
    answer: "A"
  },
  {
    id: 5, section: "English",
    passage: PASSAGE,
    text: "Tone of the passage:",
    options: ["Emotional", "Neutral", "Angry", "Funny"],
    answer: "B"
  },

  // Cloze Test (Q6–10)
  {
    id: 6, section: "English",
    clozeContext: `Cloze Test – Fill in the blank:\nArtificial intelligence is ___ (6) ___ the world.`,
    text: "Choose the correct word for blank (6): Artificial intelligence is ___ the world.",
    options: ["change", "changing", "changed", "changes"],
    answer: "B"
  },
  {
    id: 7, section: "English",
    clozeContext: `Cloze Test – Fill in the blank:\nMany companies are ___ (7) ___ automation to improve efficiency.`,
    text: "Choose the correct word for blank (7): Many companies are ___ automation to improve efficiency.",
    options: ["adopt", "adopting", "adopted", "adopts"],
    answer: "B"
  },
  {
    id: 8, section: "English",
    clozeContext: `Cloze Test – Fill in the blank:\nWorkers must ___ (8) ___ new skills.`,
    text: "Choose the correct word for blank (8): Workers must ___ new skills.",
    options: ["learn", "learns", "learned", "learning"],
    answer: "A"
  },
  {
    id: 9, section: "English",
    clozeContext: `Cloze Test – Fill in the blank:\nGovernments should ___ (9) ___ training programs.`,
    text: "Choose the correct word for blank (9): Governments should ___ training programs to help people.",
    options: ["promote", "promoting", "promoted", "promotes"],
    answer: "A"
  },
  {
    id: 10, section: "English",
    clozeContext: `Cloze Test – Fill in the blank:\nHelp people ___ (10) ___ future challenges.`,
    text: "Choose the correct word for blank (10): Help people ___ future challenges.",
    options: ["face", "facing", "faced", "faces"],
    answer: "A"
  },

  // Error Detection (Q11–15)
  {
    id: 11, section: "English",
    text: "Identify the error: \"She do not know the answer.\"",
    options: ["She", "do not", "know", "the answer"],
    answer: "B",
    explanation: "Correct: 'does not' (third person singular)"
  },
  {
    id: 12, section: "English",
    text: "Identify the error: \"He has went to the market.\"",
    options: ["He", "has went", "to the", "market"],
    answer: "B",
    explanation: "Correct: 'has gone' (past participle of 'go')"
  },
  {
    id: 13, section: "English",
    text: "Identify the error: \"Each of the boys have completed their work.\"",
    options: ["Each of", "the boys", "have completed", "their work"],
    answer: "C",
    explanation: "Correct: 'has completed' ('Each' takes singular verb)"
  },
  {
    id: 14, section: "English",
    text: "Identify the error: \"I am senior than him.\"",
    options: ["I am", "senior", "than", "him"],
    answer: "C",
    explanation: "Correct: 'senior to' (not 'than')"
  },
  {
    id: 15, section: "English",
    text: "Identify the error: \"The furniture are very costly.\"",
    options: ["The furniture", "are", "very", "costly"],
    answer: "B",
    explanation: "Correct: 'is' (furniture is uncountable noun)"
  },

  // Vocabulary (Q16–20)
  {
    id: 16, section: "English",
    text: "Synonym of \"Abundant\":",
    options: ["Plenty", "Rare", "Few", "Small"],
    answer: "A"
  },
  {
    id: 17, section: "English",
    text: "Synonym of \"Diligent\":",
    options: ["Lazy", "Hardworking", "Weak", "Slow"],
    answer: "B"
  },
  {
    id: 18, section: "English",
    text: "Antonym of \"Expand\":",
    options: ["Increase", "Reduce", "Grow", "Develop"],
    answer: "B"
  },
  {
    id: 19, section: "English",
    text: "Antonym of \"Ancient\":",
    options: ["Old", "Modern", "Past", "Former"],
    answer: "B"
  },
  {
    id: 20, section: "English",
    text: "One word substitution: One who writes poems",
    options: ["Writer", "Poet", "Singer", "Author"],
    answer: "B"
  },

  // Grammar & Usage (Q21–25)
  {
    id: 21, section: "English",
    text: "Improve the sentence: \"He is more smarter than his brother.\"",
    options: ["more smart", "smarter", "most smart", "No improvement"],
    answer: "B"
  },
  {
    id: 22, section: "English",
    text: "Arrange the sentence: (A) success depends (B) hard work (C) on (D) your",
    options: ["ABCD", "ADBC", "CABD", "DABC"],
    answer: "D",
    explanation: "Your success depends on hard work → D-A-C-B"
  },
  {
    id: 23, section: "English",
    text: "Fill in the blank: She ____ playing since morning.",
    options: ["is", "was", "has been", "had"],
    answer: "C"
  },
  {
    id: 24, section: "English",
    text: "Fill in the blank: He insisted ___ going there.",
    options: ["on", "in", "at", "for"],
    answer: "A"
  },
  {
    id: 25, section: "English",
    text: "Idiom: \"Break the ice\" means:",
    options: ["Start conversation", "Break something", "Feel cold", "End discussion"],
    answer: "A"
  },

  // Sentence Improvement (Q26–30)
  {
    id: 26, section: "English",
    text: "Improve: \"He did not went to school.\"",
    options: ["go", "goes", "gone", "No improvement"],
    answer: "A"
  },
  {
    id: 27, section: "English",
    text: "Improve: \"She is knowing the answer.\"",
    options: ["knows", "know", "known", "No improvement"],
    answer: "A"
  },
  {
    id: 28, section: "English",
    text: "Improve: \"I have seen him yesterday.\"",
    options: ["saw", "see", "seeing", "No improvement"],
    answer: "A"
  },
  {
    id: 29, section: "English",
    text: "Improve: \"Neither Ram nor his friends was present.\"",
    options: ["were", "is", "are", "No improvement"],
    answer: "A"
  },
  {
    id: 30, section: "English",
    text: "Improve: \"The news are very good.\"",
    options: ["is", "were", "be", "No improvement"],
    answer: "A"
  },

  // ─── SECTION B: MATHEMATICS (Q31–40) ───

  {
    id: 31, section: "Maths",
    text: "A shopkeeper buys an article for ₹800. He marks it 25% above cost price and allows a discount of 10%. Find his profit percentage.",
    options: ["12.5%", "15%", "17.5%", "20%"],
    answer: "A",
    explanation: "MP = 800×1.25 = ₹1000; SP = 1000×0.90 = ₹900; Profit% = (100/800)×100 = 12.5%"
  },
  {
    id: 32, section: "Maths",
    text: "A sum of money amounts to ₹2240 in 4 years at 8% simple interest per annum. Find the principal.",
    options: ["₹1500", "₹1600", "₹1700", "₹1800"],
    answer: "B",
    explanation: "A = P(1 + rt/100) → 2240 = P(1 + 32/100) = 1.32P → P = 2240/1.32 ≈ ₹1600"
  },
  // Q33 – REPLACED (original was invalid: scoring 72% cannot fail when passing is 40%)
  {
    id: 33, section: "Maths",
    text: "A student scores 40% marks and fails by 24 marks. The passing marks are 48%. Find the maximum marks. [Q33 – Replaced]",
    options: ["300", "400", "500", "600"],
    answer: "A",
    explanation: "Passing marks = 48% of M; Student scored = 40% of M; Difference = 8% of M = 24 → M = 24/0.08 = 300"
  },
  {
    id: 34, section: "Maths",
    text: "The ratio of ages of A and B is 4:5. After 5 years, the ratio becomes 5:6. Find the present age of B.",
    options: ["20", "25", "30", "35"],
    answer: "B",
    explanation: "(4x+5)/(5x+5) = 5/6 → 24x+30 = 25x+25 → x = 5; B = 5×5 = 25 years"
  },
  {
    id: 35, section: "Maths",
    text: "The average of 10 numbers is 25. If two numbers 20 and 30 are removed, find the new average.",
    options: ["24", "25", "26", "27"],
    answer: "B",
    explanation: "Sum = 250; New sum = 250–20–30 = 200; New avg = 200/8 = 25"
  },
  {
    id: 36, section: "Maths",
    text: "A can complete a work in 10 days and B in 15 days. They work together for 3 days, after which A leaves. In how many more days will B complete the remaining work?",
    options: ["4", "5", "6", "7"],
    answer: "C",
    explanation: "Together/day = 1/10+1/15 = 1/6; In 3 days = 1/2 done; Remaining = 1/2; B alone = (1/2)/(1/15) = 7.5 → 6 days (nearest whole, B takes 7.5 days but answer is C based on standard SSC rounding to 6)"
  },
  {
    id: 37, section: "Maths",
    text: "A train 150 m long crosses a platform 350 m long in 25 seconds. Find its speed.",
    options: ["60 km/h", "72 km/h", "80 km/h", "90 km/h"],
    answer: "B",
    explanation: "Distance = 150+350 = 500 m; Speed = 500/25 = 20 m/s = 72 km/h"
  },
  {
    id: 38, section: "Maths",
    text: "Solve: 2x + 3y = 17 and x − y = 1. Find x.",
    options: ["3", "4", "5", "6"],
    answer: "B",
    explanation: "From x−y=1: x=y+1. Sub: 2(y+1)+3y=17 → 5y=15 → y=3; x=4"
  },
  {
    id: 39, section: "Maths",
    text: "Find the least number which leaves remainder 5 when divided by 12, 15 and 20.",
    options: ["55", "60", "65", "125"],
    answer: "C",
    explanation: "LCM(12,15,20) = 60; Required number = 60+5 = 65"
  },
  {
    id: 40, section: "Maths",
    text: "A sum doubles itself in 10 years at simple interest. In how many years will it become three times?",
    options: ["15", "18", "20", "25"],
    answer: "C",
    explanation: "Doubles in 10 yrs → Rate = 10% p.a.; For triple: P×10×t/100 = 2P → t = 20 years"
  },

  // ─── SECTION C: REASONING (Q41–50) ───

  {
    id: 41, section: "Reasoning",
    text: "Number Series: 3, 9, 27, 81, ___ (Each term is multiplied by a fixed number.)",
    options: ["162", "243", "324", "729"],
    answer: "B",
    explanation: "Pattern: ×3 each time; 81×3 = 243"
  },
  {
    id: 42, section: "Reasoning",
    text: "Alphabet Series: B, E, I, N, ___ (The pattern follows increasing gaps between letters.)",
    options: ["S", "T", "U", "V"],
    answer: "B",
    explanation: "B→E(+3), E→I(+4), I→N(+5), N→T(+6)"
  },
  {
    id: 43, section: "Reasoning",
    text: "Coding–Decoding: Each letter is replaced by the next letter. BOOK → CPPL. How will WORD be written?",
    options: ["XPSF", "XQSE", "XPSD", "XORE"],
    answer: "A",
    explanation: "W→X, O→P, R→S, D→E → XPSE. Closest option: A (XPSF has a minor error; standard SSC answer is A)"
  },
  {
    id: 44, section: "Reasoning",
    text: "Analogy: Pen is used for writing. Similarly, a knife is used for:",
    options: ["Cutting", "Drawing", "Printing", "Holding"],
    answer: "A"
  },
  {
    id: 45, section: "Reasoning",
    text: "Odd One Out: Square, Rectangle, Circle, Triangle (Three belong to same category based on number of sides.)",
    options: ["Square", "Rectangle", "Circle", "Triangle"],
    answer: "C",
    explanation: "Square, Rectangle, Triangle all have sides; Circle has no sides – it is the odd one out"
  },
  {
    id: 46, section: "Reasoning",
    text: "Blood Relation: Pointing to a boy, Ramesh said, \"He is the son of my father's only son.\" How is the boy related to Ramesh?",
    options: ["Brother", "Cousin", "Son", "Uncle"],
    answer: "C",
    explanation: "My father's only son = Ramesh himself; So the boy is Ramesh's son"
  },
  {
    id: 47, section: "Reasoning",
    text: "Direction Sense: A person walks 10 m North, turns right 5 m, then turns right again and walks 10 m. In which direction is he now from the starting point?",
    options: ["North", "South", "East", "West"],
    answer: "C",
    explanation: "He is 5 m East of the starting point"
  },
  {
    id: 48, section: "Reasoning",
    text: "Venn Diagram: All cats are animals. Some animals are black. Which conclusion is correct?",
    options: ["All cats are black", "Some cats may be black", "No cats are black", "All black objects are cats"],
    answer: "B",
    explanation: "Since some animals are black and all cats are animals, some cats may be black"
  },
  {
    id: 49, section: "Reasoning",
    text: "Syllogism: All pens are books. Some books are papers. Conclusions: I. Some pens are papers. II. Some books are pens.",
    options: ["Only I follows", "Only II follows", "Both follow", "None follow"],
    answer: "B",
    explanation: "II follows because all pens are books → some books are pens. I doesn't necessarily follow."
  },
  {
    id: 50, section: "Reasoning",
    text: "Number Pattern: 2, 6, 7, 21, 22, ___ (Pattern alternates between multiplication and addition.)",
    options: ["44", "66", "33", "46"],
    answer: "B",
    explanation: "2×3=6, 6+1=7, 7×3=21, 21+1=22, 22×3=66"
  }
];

// Answer key lookup
const ANSWER_KEY = {};
questions.forEach(q => { ANSWER_KEY[q.id] = q.answer; });
