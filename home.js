// home.js – Home page logic

document.addEventListener("DOMContentLoaded", function() {
  renderTestCards();
  document.getElementById("adminPass").addEventListener("keydown", function(e) {
    if (e.key === "Enter") adminLogin();
  });
});

// ── RENDER TEST CARDS ─────────────────────────────────────
function renderTestCards() {
  var grid = document.getElementById("testsGrid");
  grid.innerHTML = "";

  TESTS.forEach(function(test) {
    var card = document.createElement("div");
    card.className = "test-card" + (test.live ? "" : " test-card-locked");

    var badge = test.live
      ? '<span class="card-badge badge-live">● Live</span>'
      : '<span class="card-badge badge-soon">Coming Soon</span>';

    var sectionInfo = "";
    if (test.sections) {
      sectionInfo = '<div class="card-sections">'
        + '<span>📘 English: ' + test.sections.english + '</span>'
        + '<span>📐 Maths: ' + test.sections.maths + '</span>'
        + '<span>🧠 Reasoning: ' + test.sections.reasoning + '</span>'
        + '</div>';
    }

    var btn = test.live
      ? '<button class="btn btn-primary card-btn" onclick="goToTest(\'' + test.id + '\')">Start Test →</button>'
      : '<button class="btn btn-disabled card-btn" disabled>Coming Soon</button>';

    card.innerHTML =
      '<div class="card-top">' +
        '<div class="card-icon">📝</div>' + badge +
      '</div>' +
      '<h3 class="card-title">' + test.title + '</h3>' +
      '<p class="card-subtitle">' + test.subtitle + '</p>' +
      sectionInfo +
      '<div class="card-meta">' +
        '<span>⏱ ' + (test.duration/60) + ' Minutes</span>' +
        '<span>🏆 ' + test.totalMarks + ' Marks</span>' +
      '</div>' +
      btn;

    grid.appendChild(card);
  });
}

// ── NAVIGATE TO TEST ──────────────────────────────────────
function goToTest(testId) {
  window.location.href = "test.html?id=" + testId;
}

// ── ADMIN MODAL ───────────────────────────────────────────
function openAdminModal() {
  var modal = document.getElementById("adminModal");
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  document.getElementById("adminPass").value = "";
  document.getElementById("adminError").style.display = "none";
  setTimeout(function() { document.getElementById("adminPass").focus(); }, 100);
}

function closeModal() {
  document.getElementById("adminModal").style.display = "none";
}

function adminLogin() {
  if (document.getElementById("adminPass").value === ADMIN_PASSWORD) {
    closeModal();
    window.location.href = "admin.html";
  } else {
    document.getElementById("adminError").style.display = "block";
  }
}
