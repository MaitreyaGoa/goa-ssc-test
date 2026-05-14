// ============================================================
// MASTER CONFIG – Dr Shetye Academic Program
// To add a new test: add an entry to TESTS array below
// To make a test live: set "live: true"
// To hide a test:     set "live: false"
// ============================================================

var ADMIN_PASSWORD = "shetye@admin";

// ▼▼▼ PASTE YOUR GOOGLE APPS SCRIPT URL HERE (one URL serves all tests) ▼▼▼
var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAGHazCLiLjEJkePvWO8HdqF_mN5ILsXajjERlBCrWyzxxy_dkJ5p3Cv_1poTE5mNknA/exec";
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

var TESTS = [
  {
    id:       "test1",
    title:    "Mock Test 1",
    subtitle: "Section Test – 50 Marks",
    password: "ssc001",
    duration: 3600,       // seconds (3600 = 60 min)
    sections: { english: 30, maths: 10, reasoning: 10 },
    totalMarks: 50,
    questionsFile: "questions_test1.js",
    live: true            // ← set false to show as "Coming Soon"
  },
  {
    id:       "test2",
    title:    "Mock Test 2",
    subtitle: "Section Test – 50 Marks",
    password: "ssc002",
    duration: 3600,
    sections: { english: 30, maths: 10, reasoning: 10 },
    totalMarks: 50,
    questionsFile: "questions_test2.js",
    live: false           // ← not live yet
  },
  {
    id:       "test3",
    title:    "Mock Test 3",
    subtitle: "Section Test – 50 Marks",
    password: "ssc003",
    duration: 3600,
    sections: { english: 30, maths: 10, reasoning: 10 },
    totalMarks: 50,
    questionsFile: "questions_test3.js",
    live: false
  }
  // To add Test 4, copy one block above and change id, title, password, questionsFile
];
