// decision.js

// Referenz auf das App-Div
const app = document.getElementById("decision-app");

// State
let values = [];
let alternatives = [];
let ratings = {};

// Lade gespeicherte Werte aus localStorage (aus der Werte-Matrix-Phase)
function loadValues() {
  try {
    const v = localStorage.getItem("user_values_matrix");
    if (v) values = JSON.parse(v);
  } catch (e) {
    values = [];
  }
}

// Schritt 1: Alternativen abfragen
function renderAlternativeInput() {
  app.innerHTML = `
    <h2>Welche Alternativen möchtest du vergleichen?</h2>
    <input type="text" id="altInput" placeholder="z.B. Elektroauto, Zug, Fahrrad"/>
    <button class="btn" onclick="addAlternative()">Alternative hinzufügen</button>
    <ul id="altList">${alternatives.map(a => `<li>${a}</li>`).join("")}</ul>
    <br>
    <button class="btn" onclick="alternatives.length ? renderRatingMatrix() : null" ${alternatives.length ? "" : "disabled"}>Weiter</button>
  `;
}

// Hinzufügen von Alternativen
window.addAlternative = function() {
  const input = document.getElementById("altInput");
  if (input.value.trim()) {
    alternatives.push(input.value.trim());
    input.value = "";
    renderAlternativeInput();
  }
};

// Schritt 2: Matrix anzeigen und Bewertungen erfassen
function renderRatingMatrix() {
  let matrixHTML = `
    <h2>Wie sehr erfüllt jede Alternative deine Werte?</h2>
    <table border="1" cellpadding="5">
      <tr>
        <th>Wert</th>
        ${alternatives.map(a => `<th>${a}</th>`).join("")}
      </tr>
      ${values.map((v, vi) => `
        <tr>
          <td>${v.name || v.text || v.frage}</td>
          ${alternatives.map((alt, ai) => `
            <td>
              <input type="range" min="0" max="100" value="${(ratings[`${vi}_${ai}`] ?? 50)}" 
                id="rate_${vi}_${ai}" 
                oninput="updateRating(${vi},${ai},this.value)">
              <span id="label_${vi}_${ai}">${(ratings[`${vi}_${ai}`] ?? 50)}</span>
            </td>
          `).join("")}
        </tr>
      `).join("")}
    </table>
    <br>
    <button class="btn" onclick="renderAmpelMatrix()">Ampelmatrix anzeigen 🚦</button>
  `;
  app.innerHTML = matrixHTML;
}

// Bewertung aktualisieren
window.updateRating = function(vi, ai, val) {
  ratings[`${vi}_${ai}`] = Number(val);
  document.getElementById(`label_${vi}_${ai}`).innerText = val;
};

// Schritt 3: Ergebnisse als Ampel-Matrix
function renderAmpelMatrix() {
  // Score je Alternative berechnen
  const scores = alternatives.map((alt, ai) => {
    let total = 0;
    let max = 0;
    values.forEach((v, vi) => {
      const w = Number(v.value || v.wert || v.score || 50);
      const r = Number(ratings[`${vi}_${ai}`] ?? 50);
      total += w * r;
      max += w * 100;
    });
    return { alt, score: Math.round((total / max) * 100) };
  });

  // Ampelfarbe je nach Score
  function ampelfarbe(score) {
    if (score >= 70) return "🟢";
    if (score >= 40) return "🟡";
    return "🔴";
  }

  // Tabelle mit Ampeln
  let resultHTML = `
    <h2>Ergebnis: Ampelmatrix</h2>
    <table border="1" cellpadding="8" style="font-size:1.2em;">
      <tr>
        <th>Alternative</th>
        <th>Score</th>
        <th>Ampel</th>
      </tr>
      ${scores.map(s => `
        <tr>
          <td>${s.alt}</td>
          <td>${s.score} %</td>
          <td style="font-size:2em;">${ampelfarbe(s.score)}</td>
        </tr>
      `).join("")}
    </table>
    <br>
    <button class="btn" onclick="renderAlternativeInput()">Neu vergleichen</button>
  `;
  app.innerHTML = resultHTML;
}

// Initialisieren, wenn Werte vorhanden
window.setupDecisionModule = function() {
  loadValues();
  if (!values.length) {
    app.innerHTML = `<div class="error">Bitte erst eine Werte-Matrix erstellen!</div>`;
    return;
  }
  renderAlternativeInput();
};
