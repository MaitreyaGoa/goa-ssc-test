// ============================================================
// GOA SSC PC Mock Test 3 – App Logic
// ============================================================

const STUDENT_PASSWORD = "1234";
const ADMIN_PASSWORD   = "shetye@admin";
const STORAGE_KEY      = "goa_ssc_merit_list";
const TEST_DURATION    = 60 * 60; // 60 minutes in seconds

let currentStudent = "";
let currentQ = 0;
let userAnswers = {};     // { questionId: "A"/"B"/"C"/"D" }
let timerInterval = null;
let timeLeft = TEST_DURATION;

// ── PAGE ROUTING ──────────────────────────────────────────

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
    p.style.display = "none";
  });
  const el = document.getElementById(id);
  el.style.display = "block";
  el.classList.add("active");
  window.scrollTo(0, 0);
}

// ── LOGIN ─────────────────────────────────────────────────

function login() {
  const name = document.getElementById("studentName").value.trim();
  const pass = document.getElementById("studentPassword").value.trim();
  const err  = document.getElementById("loginError");

  if (!name) { err.textContent = "❌ Please enter your name."; err.classList.remove("hidden"); return; }
  if (pass !== STUDENT_PASSWORD) { err.classList.remove("hidden"); err.textContent = "❌ Incorrect password. Password is 1234."; return; }

  err.classList.add("hidden");
  currentStudent = name;
  userAnswers = {};
  currentQ = 0;
  timeLeft = TEST_DURATION;
  startTest();
}

// Allow Enter key on login
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("studentPassword").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
  document.getElementById("studentName").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
  buildPalette();
});

// ── TEST ──────────────────────────────────────────────────

function startTest() {
  document.getElementById("topStudentName").textContent = "👤 " + currentStudent;
  showPage("testPage");
  renderQuestion(0);
  buildPalette();
  startTimer();
}

function renderQuestion(idx) {
  currentQ = idx;
  const q = questions[idx];
  const box = document.getElementById("questionBox");

  // Section badge
  const secLabel = q.section === "English" ? "Section A – English (30 Marks)" :
                   q.section === "Maths"   ? "Section B – Mathematics (10 Marks)" :
                                             "Section C – Reasoning (10 Marks)";
  document.getElementById("sectionBadge").textContent = secLabel;

  // Build HTML
  let html = `<div class="question-num">Question ${idx + 1} of ${questions.length}</div>`;

  if (q.passage && idx < 5) {
    html += `<div class="passage-box">${q.passage}</div>`;
  }
  if (q.clozeContext) {
    html += `<div class="passage-box" style="font-style:italic;">${q.clozeContext}</div>`;
  }

  html += `<div class="question-text">${idx + 1}. ${q.text}</div>`;
  html += `<ul class="options-list">`;

  const labels = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const lbl = labels[i];
    const selected = userAnswers[q.id] === lbl ? "selected" : "";
    html += `<li class="option-item ${selected}" onclick="selectAnswer(${q.id}, '${lbl}', this)">
      <input type="radio" name="q${q.id}" value="${lbl}" ${selected ? "checked" : ""} />
      <span><strong>${lbl}.</strong> ${opt}</span>
    </li>`;
  });
  html += `</ul>`;
  box.innerHTML = html;

  // Nav buttons
  document.getElementById("prevBtn").disabled = idx === 0;
  document.getElementById("nextBtn").textContent = idx === questions.length - 1 ? "Review" : "Next ▶";

  updatePalette();
}

function selectAnswer(qId, label, el) {
  userAnswers[qId] = label;
  // Clear all selected in this question
  document.querySelectorAll(".option-item").forEach(li => li.classList.remove("selected"));
  el.classList.add("selected");
  el.querySelector("input").checked = true;
  updatePalette();
}

function prevQuestion() {
  if (currentQ > 0) renderQuestion(currentQ - 1);
}

function nextQuestion() {
  if (currentQ < questions.length - 1) renderQuestion(currentQ + 1);
}

function goToSection(startIdx) {
  renderQuestion(startIdx);
}

// ── PALETTE ──────────────────────────────────────────────

function buildPalette() {
  const grid = document.getElementById("palette");
  if (!grid) return;
  grid.innerHTML = "";
  questions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.className = "palette-btn";
    btn.textContent = i + 1;
    btn.onclick = () => renderQuestion(i);
    btn.id = `pal-${i}`;
    grid.appendChild(btn);
  });
}

function updatePalette() {
  questions.forEach((q, i) => {
    const btn = document.getElementById(`pal-${i}`);
    if (!btn) return;
    btn.className = "palette-btn";
    if (i === currentQ) btn.classList.add("current");
    else if (userAnswers[q.id]) btn.classList.add("answered");
  });
}

// ── TIMER ────────────────────────────────────────────────

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const el = document.getElementById("timer");
    if (!el) { clearInterval(timerInterval); return; }
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    el.textContent = `${m}:${s}`;
    if (timeLeft <= 300) el.classList.add("urgent");
    if (timeLeft <= 0) { clearInterval(timerInterval); submitTest(); }
  }, 1000);
}

// ── SUBMIT ───────────────────────────────────────────────

function confirmSubmit() {
  const answered = Object.keys(userAnswers).length;
  const skipped  = questions.length - answered;
  if (skipped > 0) {
    const ok = confirm(`You have ${skipped} unanswered question(s). Do you want to submit anyway?`);
    if (!ok) return;
  } else {
    const ok = confirm("Submit the test now?");
    if (!ok) return;
  }
  submitTest();
}

function submitTest() {
  clearInterval(timerInterval);
  const result = calculateScore();
  saveToMeritList(result);
  showResult(result);
}

function calculateScore() {
  let engScore = 0, mathScore = 0, reasonScore = 0;
  questions.forEach(q => {
    const given = userAnswers[q.id];
    if (given && given === q.answer) {
      if (q.section === "English")   engScore++;
      if (q.section === "Maths")     mathScore++;
      if (q.section === "Reasoning") reasonScore++;
    }
  });
  return {
    name: currentStudent,
    timestamp: new Date().toLocaleString("en-IN"),
    engScore, mathScore, reasonScore,
    total: engScore + mathScore + reasonScore,
    answers: { ...userAnswers }
  };
}

function showResult(result) {
  document.getElementById("resultName").textContent = "🎉 " + result.name;
  document.getElementById("totalScore").textContent  = result.total;
  document.getElementById("engScore").textContent    = result.engScore;
  document.getElementById("mathScore").textContent   = result.mathScore;
  document.getElementById("reasonScore").textContent = result.reasonScore;

  const pct = (result.total / 50) * 100;
  const badge = document.getElementById("rankBadge");
  if (pct >= 80)      { badge.textContent = "🥇 Excellent Performance"; badge.className = "rank-badge excellent"; }
  else if (pct >= 60) { badge.textContent = "🥈 Good Performance";      badge.className = "rank-badge good"; }
  else if (pct >= 40) { badge.textContent = "🥉 Average Performance";   badge.className = "rank-badge average"; }
  else                { badge.textContent = "📚 Needs More Practice";   badge.className = "rank-badge below"; }

  showPage("resultPage");
}

// ── ANSWER REVIEW ─────────────────────────────────────────

function viewAnswers() {
  const list = document.getElementById("answerList");
  const labels = ["A", "B", "C", "D"];
  list.innerHTML = "";

  questions.forEach((q, i) => {
    const given   = userAnswers[q.id];
    const correct = q.answer;
    const optText = opt => q.options[labels.indexOf(opt)] || "—";

    let status = "skipped", statusLabel = "⬜ Skipped";
    if (given === correct) { status = "correct";   statusLabel = "✅ Correct"; }
    else if (given)        { status = "incorrect"; statusLabel = "❌ Incorrect"; }

    const div = document.createElement("div");
    div.className = `answer-item ${status}`;
    div.innerHTML = `
      <div class="answer-q">${i + 1}. ${q.text}</div>
      <div class="answer-detail">
        ${statusLabel} &nbsp;·&nbsp;
        Your answer: <span class="${given === correct ? 'correct-ans' : 'wrong-ans'}">${given ? given + ". " + optText(given) : "Not Attempted"}</span>
        &nbsp;·&nbsp;
        Correct: <span class="correct-ans">${correct}. ${optText(correct)}</span>
        ${q.explanation ? `<br><em style="color:#6b7280;">💡 ${q.explanation}</em>` : ""}
      </div>`;
    list.appendChild(div);
  });

  showPage("answerPage");
}

// ── MERIT LIST STORAGE ────────────────────────────────────

function saveToMeritList(result) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const list = raw ? JSON.parse(raw) : [];
  // Avoid exact duplicate submissions (same name + same timestamp)
  const exists = list.some(r => r.name === result.name && r.timestamp === result.timestamp);
  if (!exists) {
    list.push({
      name: result.name,
      timestamp: result.timestamp,
      total: result.total,
      english: result.engScore,
      maths: result.mathScore,
      reasoning: result.reasonScore
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

function loadMeritList() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// ── ADMIN ─────────────────────────────────────────────────

function openAdminModal() {
  document.getElementById("adminModal").classList.remove("hidden");
  document.getElementById("adminPass").value = "";
  document.getElementById("adminError").classList.add("hidden");
  setTimeout(() => document.getElementById("adminPass").focus(), 100);
}

function closeModal() {
  document.getElementById("adminModal").classList.add("hidden");
}

function adminLogin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASSWORD) {
    closeModal();
    showAdminPanel();
  } else {
    document.getElementById("adminError").classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminPass").addEventListener("keydown", e => { if (e.key === "Enter") adminLogin(); });
});

function showAdminPanel() {
  const list = loadMeritList();
  const wrap = document.getElementById("meritTableWrap");

  if (list.length === 0) {
    wrap.innerHTML = "<p style='color:#6b7280;margin-bottom:16px;'>No test submissions yet.</p>";
    showPage("adminPage");
    return;
  }

  // Sort by total desc
  const sorted = [...list].sort((a, b) => b.total - a.total);

  let html = `<table class="merit-table">
    <thead><tr>
      <th>Rank</th><th>Student Name</th><th>English (/30)</th>
      <th>Maths (/10)</th><th>Reasoning (/10)</th>
      <th>Total (/50)</th><th>%</th><th>Date & Time</th>
    </tr></thead><tbody>`;

  sorted.forEach((r, i) => {
    const pct = ((r.total / 50) * 100).toFixed(1);
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.english}</td>
      <td>${r.maths}</td>
      <td>${r.reasoning}</td>
      <td><strong>${r.total}</strong></td>
      <td>${pct}%</td>
      <td style="font-size:0.78rem;color:#6b7280;">${r.timestamp}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  wrap.innerHTML = html;
  showPage("adminPage");
}

function exportCSV() {
  const list = loadMeritList();
  if (list.length === 0) { alert("No data to export."); return; }

  const sorted = [...list].sort((a, b) => b.total - a.total);
  let csv = "Rank,Name,English(/30),Maths(/10),Reasoning(/10),Total(/50),Percentage,DateTime\n";
  sorted.forEach((r, i) => {
    const pct = ((r.total / 50) * 100).toFixed(1);
    csv += `${i + 1},"${r.name}",${r.english},${r.maths},${r.reasoning},${r.total},${pct}%,"${r.timestamp}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "GOA_SSC_Merit_List.csv";
  a.click(); URL.revokeObjectURL(url);
}

function restartTest() {
  showPage("loginPage");
  document.getElementById("studentName").value = "";
  document.getElementById("studentPassword").value = "";
}
