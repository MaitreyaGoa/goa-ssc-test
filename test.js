// test.js – Universal Test Engine

var currentTest   = null;
var currentStudent = "";
var currentQ      = 0;
var userAnswers   = {};
var timerInterval = null;
var timeLeft      = 3600;
var questions     = [];

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  var params = new URLSearchParams(window.location.search);
  var testId = params.get("id");

  // Find test in config
  currentTest = null;
  for (var i = 0; i < TESTS.length; i++) {
    if (TESTS[i].id === testId) { currentTest = TESTS[i]; break; }
  }

  if (!currentTest || !currentTest.live) {
    document.getElementById("loginPage").innerHTML =
      '<div class="card login-card"><a href="index.html" class="back-link">← All Tests</a>' +
      '<h2 class="card-title" style="color:#dc2626;">Test Not Available</h2>' +
      '<p class="card-subtitle">This test is not live yet. Please check back later.</p></div>';
    return;
  }

  // Set login page text
  document.getElementById("loginTestBadge").textContent = currentTest.title;
  document.getElementById("loginSubtitle").textContent  = currentTest.subtitle + " · " + (currentTest.duration/60) + " Minutes";
  document.title = currentTest.title + " – Dr Shetye Academic Program";

  // Keyboard shortcuts
  document.getElementById("studentPassword").addEventListener("keydown", function(e) { if (e.key==="Enter") login(); });
  document.getElementById("studentName").addEventListener("keydown", function(e) { if (e.key==="Enter") login(); });

  // Dynamically load question file
  loadQuestions(currentTest.questionsFile);
});

function loadQuestions(filename) {
  var script = document.createElement("script");
  script.src = filename;
  script.onload = function() {
    console.log("Questions loaded: " + (typeof questions !== "undefined" ? questions.length : 0));
  };
  script.onerror = function() {
    document.getElementById("loginPage").innerHTML =
      '<div class="card login-card"><a href="index.html" class="back-link">← All Tests</a>' +
      '<h2 class="card-title" style="color:#dc2626;">Questions Not Found</h2>' +
      '<p class="card-subtitle">Question file <strong>' + filename + '</strong> is missing. Please upload it to the repository.</p></div>';
  };
  document.body.appendChild(script);
}

// ── PAGE ROUTING ──────────────────────────────────────────
function showPage(id) {
  ["loginPage","testPage","resultPage","answerPage"].forEach(function(p) {
    document.getElementById(p).style.display = "none";
  });
  document.getElementById(id).style.display = "block";
  window.scrollTo(0, 0);
}

// ── LOGIN ─────────────────────────────────────────────────
function login() {
  var name = document.getElementById("studentName").value.trim();
  var pass = document.getElementById("studentPassword").value.trim();
  var err  = document.getElementById("loginError");

  if (!name) { err.textContent = "Please enter your full name."; err.style.display = "block"; return; }
  if (pass !== currentTest.password) {
    err.textContent = "Incorrect password. Please check with your coordinator.";
    err.style.display = "block"; return;
  }
  if (!questions || questions.length === 0) {
    err.textContent = "Questions not loaded yet. Please refresh the page.";
    err.style.display = "block"; return;
  }

  err.style.display = "none";
  currentStudent = name;
  userAnswers = {};
  currentQ = 0;
  timeLeft = currentTest.duration;
  startTest();
}

// ── START TEST ────────────────────────────────────────────
function startTest() {
  document.getElementById("topStudentName").textContent = "👤 " + currentStudent;
  document.getElementById("topTestName").textContent    = currentTest.title;

  // Build section jump buttons dynamically
  var secLinks = document.getElementById("sectionLinks");
  secLinks.innerHTML = "";
  var secs = getSections();
  secs.forEach(function(s) {
    var btn = document.createElement("button");
    btn.className = "section-btn";
    btn.textContent = s.name + " (" + (s.start+1) + "–" + s.end + ")";
    btn.onclick = (function(start) { return function() { renderQuestion(start); }; })(s.start);
    secLinks.appendChild(btn);
  });

  showPage("testPage");
  buildPalette();
  renderQuestion(0);
  startTimer();
}

function getSections() {
  var secs = [], idx = 0;
  var order = ["English","Maths","Reasoning"];
  order.forEach(function(sec) {
    var start = idx;
    var count = 0;
    questions.forEach(function(q) { if (q.section === sec) count++; });
    if (count > 0) {
      secs.push({ name: sec, start: start, end: start + count });
      idx += count;
    }
  });
  return secs;
}

// ── RENDER QUESTION ───────────────────────────────────────
function renderQuestion(idx) {
  currentQ = idx;
  var q = questions[idx];
  var box = document.getElementById("questionBox");

  var secLabel = q.section === "Maths"     ? "Section B – Mathematics"
               : q.section === "Reasoning" ? "Section C – Reasoning"
               :                             "Section A – English";
  document.getElementById("sectionBadge").textContent = secLabel;

  var html = '<div class="question-num">Question '+(idx+1)+' of '+questions.length+'</div>';
  if (q.passage && idx < 5) html += '<div class="passage-box">'+q.passage+'</div>';
  if (q.clozeContext) html += '<div class="passage-box" style="font-style:italic;">'+q.clozeContext+'</div>';
  html += '<div class="question-text">'+(idx+1)+'. '+q.text+'</div>';
  html += '<ul class="options-list">';
  var labels = ["A","B","C","D"];
  for (var i = 0; i < q.options.length; i++) {
    var lbl = labels[i];
    var sel = userAnswers[q.id] === lbl ? "selected" : "";
    html += '<li class="option-item '+sel+'" data-qid="'+q.id+'" data-lbl="'+lbl+'" onclick="selectAnswer(this)">'
          + '<span class="opt-label">'+lbl+'.</span><span>'+q.options[i]+'</span></li>';
  }
  html += '</ul>';
  box.innerHTML = html;
  document.getElementById("prevBtn").disabled = (idx === 0);
  document.getElementById("nextBtn").textContent = (idx === questions.length-1) ? "Review All" : "Next ▶";
  updatePalette();
}

function selectAnswer(el) {
  userAnswers[parseInt(el.getAttribute("data-qid"))] = el.getAttribute("data-lbl");
  document.querySelectorAll(".option-item").forEach(function(li) { li.classList.remove("selected"); });
  el.classList.add("selected");
  updatePalette();
}

function prevQuestion() { if (currentQ > 0) renderQuestion(currentQ - 1); }
function nextQuestion() { if (currentQ < questions.length-1) renderQuestion(currentQ + 1); }

// ── PALETTE ──────────────────────────────────────────────
function buildPalette() {
  var grid = document.getElementById("palette");
  grid.innerHTML = "";
  for (var i = 0; i < questions.length; i++) {
    (function(idx) {
      var btn = document.createElement("button");
      btn.className = "palette-btn";
      btn.textContent = idx + 1;
      btn.id = "pal-" + idx;
      btn.onclick = function() { renderQuestion(idx); };
      grid.appendChild(btn);
    })(i);
  }
}

function updatePalette() {
  for (var i = 0; i < questions.length; i++) {
    var btn = document.getElementById("pal-" + i);
    if (!btn) continue;
    btn.className = "palette-btn";
    if (i === currentQ) btn.classList.add("current");
    else if (userAnswers[questions[i].id]) btn.classList.add("answered");
  }
}

// ── TIMER ─────────────────────────────────────────────────
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    timeLeft--;
    var el = document.getElementById("timer");
    if (!el) { clearInterval(timerInterval); return; }
    var m = Math.floor(timeLeft/60).toString().padStart(2,"0");
    var s = (timeLeft%60).toString().padStart(2,"0");
    el.textContent = m + ":" + s;
    if (timeLeft <= 300) el.classList.add("urgent");
    if (timeLeft <= 0)   { clearInterval(timerInterval); submitTest(); }
  }, 1000);
}

// ── SUBMIT ────────────────────────────────────────────────
function confirmSubmit() {
  var skipped = questions.length - Object.keys(userAnswers).length;
  var msg = skipped > 0
    ? "You have " + skipped + " unanswered question(s). Submit anyway?"
    : "Submit the test now?";
  if (confirm(msg)) submitTest();
}

function submitTest() {
  clearInterval(timerInterval);
  var result = calculateScore();
  saveResultCentral(result);
}

function calculateScore() {
  var scores = {};
  questions.forEach(function(q) {
    if (!scores[q.section]) scores[q.section] = 0;
    if (userAnswers[q.id] && userAnswers[q.id] === q.answer) scores[q.section]++;
  });
  var total = 0;
  Object.keys(scores).forEach(function(k) { total += scores[k]; });
  return {
    testId:    currentTest.id,
    testTitle: currentTest.title,
    name:      currentStudent,
    timestamp: new Date().toLocaleString("en-IN"),
    scores:    scores,
    total:     total,
    outOf:     currentTest.totalMarks
  };
}

// ── CENTRAL SAVE ─────────────────────────────────────────
function saveResultCentral(result) {
  showPage("resultPage");
  renderResult(result);

  var statusEl = document.getElementById("savingStatus");
  statusEl.style.display = "block";
  statusEl.style.background = "#dbeafe";
  statusEl.style.color = "#1e3a8a";
  statusEl.textContent = "⏳ Saving your result...";

  if (!SCRIPT_URL || SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
    statusEl.textContent = "⚠️ Admin: Please configure SCRIPT_URL in config.js";
    statusEl.style.background = "#fef3c7"; statusEl.style.color = "#92400e";
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(result)
  })
  .then(function() {
    statusEl.textContent = "✅ Result saved successfully!";
    statusEl.style.background = "#dcfce7"; statusEl.style.color = "#166534";
  })
  .catch(function() {
    statusEl.textContent = "⚠️ Could not save online. Inform coordinator.";
    statusEl.style.background = "#fef3c7"; statusEl.style.color = "#92400e";
  });
}

// ── RENDER RESULT ─────────────────────────────────────────
function renderResult(result) {
  document.getElementById("resultName").textContent      = "Well done, " + result.name + "!";
  document.getElementById("resultTestLabel").textContent = result.testTitle;
  document.getElementById("totalScore").textContent      = result.total;
  document.getElementById("totalMarksDisplay").textContent = result.outOf;

  // Section breakdown
  var bk = document.getElementById("scoreBreakdown");
  bk.innerHTML = "";
  Object.keys(result.scores).forEach(function(sec) {
    var max = currentTest.sections[sec.toLowerCase()] || "?";
    var div = document.createElement("div");
    div.className = "breakdown-item";
    div.innerHTML = '<span class="bd-label">'+sec+'</span>'
      + '<span class="bd-val">'+result.scores[sec]+'</span>'
      + '<span style="font-size:.8rem;color:#6b7280;">/'+max+'</span>';
    bk.appendChild(div);
  });

  var pct = (result.total / result.outOf) * 100;
  var badge = document.getElementById("rankBadge");
  if      (pct >= 80) { badge.textContent = "🥇 Excellent Performance"; badge.className = "rank-badge excellent"; }
  else if (pct >= 60) { badge.textContent = "🥈 Good Performance";      badge.className = "rank-badge good"; }
  else if (pct >= 40) { badge.textContent = "🥉 Average Performance";   badge.className = "rank-badge average"; }
  else                { badge.textContent = "📚 Needs More Practice";   badge.className = "rank-badge below"; }
}

// ── ANSWER REVIEW ─────────────────────────────────────────
function viewAnswers() {
  var list = document.getElementById("answerList");
  var labels = ["A","B","C","D"];
  list.innerHTML = "";
  questions.forEach(function(q, i) {
    var given = userAnswers[q.id], correct = q.answer;
    var optText = function(lbl) { return lbl ? q.options[labels.indexOf(lbl)] : "—"; };
    var status = given === correct ? "correct" : given ? "incorrect" : "skipped";
    var statusLabel = given === correct ? "✅ Correct" : given ? "❌ Incorrect" : "⬜ Skipped";
    var div = document.createElement("div");
    div.className = "answer-item " + status;
    div.innerHTML = '<div class="answer-q">'+(i+1)+'. '+q.text+'</div>'
      + '<div class="answer-detail"><strong>'+statusLabel+'</strong> &nbsp;|&nbsp; '
      + 'Your answer: <span class="'+(given===correct?'correct-ans':'wrong-ans')+'">'+(given ? given+'. '+optText(given) : 'Not Attempted')+'</span>'
      + ' &nbsp;|&nbsp; Correct: <span class="correct-ans">'+correct+'. '+optText(correct)+'</span>'
      + (q.explanation ? '<br><em style="color:#6b7280;font-size:.82rem;">💡 '+q.explanation+'</em>' : '')
      + '</div>';
    list.appendChild(div);
  });
  showPage("answerPage");
}

function goHome() { window.location.href = "index.html"; }
