// admin.js – Admin panel logic

var activeTestId = null;

document.addEventListener("DOMContentLoaded", function() {
  buildTabs();
  // Auto-load first live test
  var firstLive = TESTS.find(function(t) { return t.live; });
  if (firstLive) loadResults(firstLive.id);
});

// ── BUILD TEST TABS ───────────────────────────────────────
function buildTabs() {
  var tabsEl = document.getElementById("adminTabs");
  tabsEl.innerHTML = "";
  TESTS.forEach(function(test) {
    var btn = document.createElement("button");
    btn.className = "admin-tab" + (test.live ? "" : " tab-inactive");
    btn.id = "tab-" + test.id;
    btn.innerHTML = test.title + (test.live ? ' <span class="tab-live">Live</span>' : ' <span class="tab-soon">Soon</span>');
    btn.onclick = function() { loadResults(test.id); };
    if (!test.live) btn.title = "Not live yet";
    tabsEl.appendChild(btn);
  });
}

// ── LOAD RESULTS FOR A TEST ───────────────────────────────
function loadResults(testId) {
  activeTestId = testId;

  // Highlight active tab
  document.querySelectorAll(".admin-tab").forEach(function(t) { t.classList.remove("active"); });
  var activeTab = document.getElementById("tab-" + testId);
  if (activeTab) activeTab.classList.add("active");

  var test = TESTS.find(function(t) { return t.id === testId; });
  var panel = document.getElementById("adminResultsPanel");

  if (!test.live) {
    panel.innerHTML = '<p style="color:#6b7280;text-align:center;padding:40px;">⏳ This test is not live yet.</p>';
    return;
  }

  panel.innerHTML = '<p style="color:#6b7280;text-align:center;padding:40px;">⏳ Loading results for ' + test.title + '...</p>';

  if (!SCRIPT_URL || SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
    panel.innerHTML = renderConfigWarning();
    return;
  }

  fetch(SCRIPT_URL + "?testId=" + testId)
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (!res.success) { panel.innerHTML = renderError("Server error: " + res.error); return; }
    renderResultsTable(test, res.data || []);
  })
  .catch(function(err) {
    panel.innerHTML = renderError("Could not connect to server. Check SCRIPT_URL in config.js.");
  });
}

// ── RENDER RESULTS TABLE ──────────────────────────────────
function renderResultsTable(test, data) {
  var panel = document.getElementById("adminResultsPanel");

  var headerRow = '<th>Rank</th><th>Student Name</th>';
  var secKeys = Object.keys(test.sections);
  secKeys.forEach(function(sec) {
    headerRow += '<th>' + sec.charAt(0).toUpperCase()+sec.slice(1) + ' (/'+test.sections[sec]+')</th>';
  });
  headerRow += '<th>Total (/'+test.totalMarks+')</th><th>%</th><th>Date &amp; Time</th>';

  var rows = "";
  if (data.length === 0) {
    rows = '<tr><td colspan="'+(4+secKeys.length)+'" style="text-align:center;color:#6b7280;padding:30px;">No submissions yet for ' + test.title + '</td></tr>';
  } else {
    data.forEach(function(r, i) {
      rows += '<tr><td>'+(i+1)+'</td><td><strong>'+r.name+'</strong></td>';
      secKeys.forEach(function(sec) { rows += '<td>'+(r.scores ? (r.scores[sec.charAt(0).toUpperCase()+sec.slice(1)] || 0) : (r[sec] || 0))+'</td>'; });
      rows += '<td><strong>'+r.total+'</strong></td><td>'+r.percent+'</td>'
            + '<td style="font-size:.78rem;color:#6b7280;">'+r.timestamp+'</td></tr>';
    });
  }

  panel.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">' +
      '<div>' +
        '<h3 style="font-family:\'Playfair Display\',serif;color:#0d2b55;">'+test.title+' Results</h3>' +
        '<p style="color:#6b7280;font-size:.84rem;">'+data.length+' submission(s) · Sorted by score</p>' +
      '</div>' +
      '<button class="btn btn-outline" onclick="exportCSV(\''+test.id+'\')">📥 Export CSV</button>' +
    '</div>' +
    '<div style="overflow-x:auto;">' +
    '<table class="merit-table"><thead><tr>'+headerRow+'</tr></thead><tbody>'+rows+'</tbody></table>' +
    '</div>';
}

// ── EXPORT CSV ────────────────────────────────────────────
function exportCSV(testId) {
  var test = TESTS.find(function(t) { return t.id === testId; });
  if (!SCRIPT_URL || SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") { alert("SCRIPT_URL not configured."); return; }

  fetch(SCRIPT_URL + "?testId=" + testId)
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (!res.success || !res.data || res.data.length === 0) { alert("No data to export."); return; }
    var secKeys = Object.keys(test.sections);
    var header = "Rank,Name," + secKeys.map(function(s) { return s+'(/'+test.sections[s]+')'; }).join(",") + ",Total(/"+test.totalMarks+"),Percentage,DateTime\n";
    var csv = header;
    res.data.forEach(function(r, i) {
      var secVals = secKeys.map(function(sec) {
        return r.scores ? (r.scores[sec.charAt(0).toUpperCase()+sec.slice(1)] || 0) : (r[sec] || 0);
      }).join(",");
      csv += (i+1)+',"'+r.name+'",'+secVals+','+r.total+','+r.percent+',"'+r.timestamp+'"\n';
    });
    var blob = new Blob([csv], {type:"text/csv"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "Merit_" + test.id + ".csv";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  });
}

// ── HELPERS ───────────────────────────────────────────────
function renderConfigWarning() {
  return '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:20px;border-radius:8px;margin:20px 0;">'
    + '<strong style="color:#92400e;">⚠️ SCRIPT_URL not configured</strong><br>'
    + '<p style="color:#92400e;font-size:.88rem;margin-top:6px;">Open <code>config.js</code> and paste your Google Apps Script URL in the SCRIPT_URL variable.</p>'
    + '</div>';
}

function renderError(msg) {
  return '<div style="background:#fee2e2;border-left:4px solid #dc2626;padding:20px;border-radius:8px;margin:20px 0;">'
    + '<strong style="color:#991b1b;">❌ Error</strong><br>'
    + '<p style="color:#991b1b;font-size:.88rem;margin-top:6px;">'+msg+'</p>'
    + '</div>';
}
