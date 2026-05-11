// GOA SSC PC Mock Test 3 – App Logic

var STUDENT_PASSWORD = "1234";
var ADMIN_PASSWORD   = "shetye@admin";
var STORAGE_KEY      = "goa_ssc_merit_list";
var TEST_DURATION    = 3600; // 60 minutes

var currentStudent = "";
var currentQ = 0;
var userAnswers = {};
var timerInterval = null;
var timeLeft = TEST_DURATION;

// ── PAGE ROUTING ──────────────────────────────────────────
function showPage(id) {
  ["loginPage","testPage","resultPage","answerPage","adminPage"].forEach(function(p) {
    document.getElementById(p).style.display = "none";
  });
  document.getElementById(id).style.display = "block";
  window.scrollTo(0, 0);
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  showPage("loginPage");
  document.getElementById("studentPassword").addEventListener("keydown", function(e) { if (e.key==="Enter") login(); });
  document.getElementById("studentName").addEventListener("keydown", function(e) { if (e.key==="Enter") login(); });
  document.getElementById("adminPass").addEventListener("keydown", function(e) { if (e.key==="Enter") adminLogin(); });
});

// ── LOGIN ─────────────────────────────────────────────────
function login() {
  var name = document.getElementById("studentName").value.trim();
  var pass = document.getElementById("studentPassword").value.trim();
  var err  = document.getElementById("loginError");
  if (!name) { err.textContent = "Please enter your full name."; err.style.display = "block"; return; }
  if (pass !== STUDENT_PASSWORD) { err.textContent = "Incorrect password. Password is 1234."; err.style.display = "block"; return; }
  err.style.display = "none";
  currentStudent = name;
  userAnswers = {};
  currentQ = 0;
  timeLeft = TEST_DURATION;
  startTest();
}

// ── START TEST ────────────────────────────────────────────
function startTest() {
  document.getElementById("topStudentName").textContent = "Student: " + currentStudent;
  showPage("testPage");
  buildPalette();
  renderQuestion(0);
  startTimer();
}

// ── RENDER QUESTION ───────────────────────────────────────
function renderQuestion(idx) {
  currentQ = idx;
  var q = questions[idx];
  var box = document.getElementById("questionBox");

  var secLabel = q.section === "Maths" ? "Section B – Mathematics (10 Marks)"
               : q.section === "Reasoning" ? "Section C – Reasoning (10 Marks)"
               : "Section A – English (30 Marks)";
  document.getElementById("sectionBadge").textContent = secLabel;

  var html = '<div class="question-num">Question ' + (idx+1) + ' of ' + questions.length + '</div>';
  if (q.passage && idx < 5) html += '<div class="passage-box">' + q.passage + '</div>';
  if (q.clozeContext) html += '<div class="passage-box" style="font-style:italic;">' + q.clozeContext + '</div>';
  html += '<div class="question-text">' + (idx+1) + '. ' + q.text + '</div>';
  html += '<ul class="options-list">';

  var labels = ["A","B","C","D"];
  for (var i = 0; i < q.options.length; i++) {
    var lbl = labels[i];
    var sel = userAnswers[q.id] === lbl ? "selected" : "";
    html += '<li class="option-item ' + sel + '" data-qid="' + q.id + '" data-lbl="' + lbl + '" onclick="selectAnswer(this)">'
          + '<span class="opt-label">' + lbl + '.</span><span>' + q.options[i] + '</span></li>';
  }
  html += '</ul>';
  box.innerHTML = html;

  document.getElementById("prevBtn").disabled = (idx === 0);
  document.getElementById("nextBtn").textContent = (idx === questions.length-1) ? "Review All" : "Next \u25ba";
  updatePalette();
}

// ── SELECT ANSWER ─────────────────────────────────────────
function selectAnswer(el) {
  userAnswers[parseInt(el.getAttribute("data-qid"))] = el.getAttribute("data-lbl");
  document.querySelectorAll(".option-item").forEach(function(li) { li.classList.remove("selected"); });
  el.classList.add("selected");
  updatePalette();
}

// ── NAVIGATION ────────────────────────────────────────────
function prevQuestion() { if (currentQ > 0) renderQuestion(currentQ - 1); }
function nextQuestion() { if (currentQ < questions.length-1) renderQuestion(currentQ + 1); }
function goToSection(idx) { renderQuestion(idx); }

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
    if (timeLeft <= 0) { clearInterval(timerInterval); submitTest(); }
  }, 1000);
}

// ── SUBMIT ────────────────────────────────────────────────
function confirmSubmit() {
  var skipped = questions.length - Object.keys(userAnswers).length;
  var msg = skipped > 0 ? "You have " + skipped + " unanswered question(s). Submit anyway?" : "Submit the test now?";
  if (confirm(msg)) submitTest();
}

function submitTest() {
  clearInterval(timerInterval);
  var result = calculateScore();
  saveToMeritList(result);
  showResult(result);
}

function calculateScore() {
  var eng = 0, math = 0, reason = 0;
  questions.forEach(function(q) {
    var given = userAnswers[q.id];
    if (given && given === q.answer) {
      if (q.section==="English") eng++;
      if (q.section==="Maths") math++;
      if (q.section==="Reasoning") reason++;
    }
  });
  return { name: currentStudent, timestamp: new Date().toLocaleString("en-IN"),
           engScore: eng, mathScore: math, reasonScore: reason, total: eng+math+reason };
}

// ── RESULT ────────────────────────────────────────────────
function showResult(result) {
  document.getElementById("resultName").textContent = "Well done, " + result.name + "!";
  document.getElementById("totalScore").textContent  = result.total;
  document.getElementById("engScore").textContent    = result.engScore;
  document.getElementById("mathScore").textContent   = result.mathScore;
  document.getElementById("reasonScore").textContent = result.reasonScore;
  var pct = (result.total/50)*100;
  var badge = document.getElementById("rankBadge");
  if      (pct>=80) { badge.textContent="Excellent Performance"; badge.className="rank-badge excellent"; }
  else if (pct>=60) { badge.textContent="Good Performance";      badge.className="rank-badge good"; }
  else if (pct>=40) { badge.textContent="Average Performance";   badge.className="rank-badge average"; }
  else              { badge.textContent="Needs More Practice";   badge.className="rank-badge below"; }
  showPage("resultPage");
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
    var statusLabel = given === correct ? "&#10003; Correct" : given ? "&#10007; Incorrect" : "&#9633; Skipped";
    var div = document.createElement("div");
    div.className = "answer-item " + status;
    div.innerHTML = '<div class="answer-q">' + (i+1) + '. ' + q.text + '</div>'
      + '<div class="answer-detail"><strong>' + statusLabel + '</strong> &nbsp;|&nbsp; '
      + 'Your answer: <span class="' + (given===correct?'correct-ans':'wrong-ans') + '">'
      + (given ? given+'. '+optText(given) : 'Not Attempted') + '</span>'
      + ' &nbsp;|&nbsp; Correct: <span class="correct-ans">' + correct + '. ' + optText(correct) + '</span>'
      + (q.explanation ? '<br><em style="color:#6b7280;font-size:.82rem;">Hint: ' + q.explanation + '</em>' : '')
      + '</div>';
    list.appendChild(div);
  });
  showPage("answerPage");
}

// ── MERIT LIST ────────────────────────────────────────────
function saveToMeritList(result) {
  var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list.push({ name:result.name, timestamp:result.timestamp, total:result.total,
              english:result.engScore, maths:result.mathScore, reasoning:result.reasonScore });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ── ADMIN MODAL ───────────────────────────────────────────
function openAdminModal() {
  var modal = document.getElementById("adminModal");
  modal.style.display = "flex";
  document.getElementById("adminPass").value = "";
  document.getElementById("adminError").style.display = "none";
  setTimeout(function() { document.getElementById("adminPass").focus(); }, 100);
}

function closeModal() {
  document.getElementById("adminModal").style.display = "none";
}

function adminLogin() {
  var pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASSWORD) {
    closeModal();
    showAdminPanel();
  } else {
    document.getElementById("adminError").style.display = "block";
  }
}

// ── ADMIN PANEL ───────────────────────────────────────────
function showAdminPanel() {
  var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  var wrap = document.getElementById("meritTableWrap");
  if (list.length === 0) {
    wrap.innerHTML = "<p style='color:#6b7280;margin-bottom:16px;'>No submissions yet.</p>";
    showPage("adminPage"); return;
  }
  var sorted = list.slice().sort(function(a,b) { return b.total - a.total; });
  var html = '<table class="merit-table"><thead><tr>'
    + '<th>Rank</th><th>Student Name</th><th>English (/30)</th><th>Maths (/10)</th>'
    + '<th>Reasoning (/10)</th><th>Total (/50)</th><th>%</th><th>Date &amp; Time</th>'
    + '</tr></thead><tbody>';
  sorted.forEach(function(r,i) {
    var pct = ((r.total/50)*100).toFixed(1);
    html += '<tr><td>'+(i+1)+'</td><td><strong>'+r.name+'</strong></td>'
      + '<td>'+r.english+'</td><td>'+r.maths+'</td><td>'+r.reasoning+'</td>'
      + '<td><strong>'+r.total+'</strong></td><td>'+pct+'%</td>'
      + '<td style="font-size:.78rem;color:#6b7280;">'+r.timestamp+'</td></tr>';
  });
  wrap.innerHTML = html + '</tbody></table>';
  showPage("adminPage");
}

function exportCSV() {
  var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (list.length === 0) { alert("No data to export yet."); return; }
  var sorted = list.slice().sort(function(a,b) { return b.total - a.total; });
  var csv = "Rank,Name,English(/30),Maths(/10),Reasoning(/10),Total(/50),Percentage,DateTime\n";
  sorted.forEach(function(r,i) {
    csv += (i+1)+',"'+r.name+'",'+r.english+','+r.maths+','+r.reasoning+','+r.total+','
         + ((r.total/50)*100).toFixed(1)+'%,"'+r.timestamp+'"\n';
  });
  var blob = new Blob([csv], {type:"text/csv"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "GOA_SSC_Merit_List.csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function restartTest() {
  showPage("loginPage");
  document.getElementById("studentName").value = "";
  document.getElementById("studentPassword").value = "";
}
