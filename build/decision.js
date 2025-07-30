// decision.js

// Dummy: Werte aus questions.json, hier als Beispiel eingebettet (später via fetch laden)
const userValues = [
  { key: "nachhaltigkeit", name: "Nachhaltigkeit", weight: 90 },
  { key: "gerechtigkeit", name: "Gerechtigkeit", weight: 80 },
  { key: "freiheit", name: "Freiheit", weight: 70 },
];

// Ampelfarben nach Score
function getTrafficLightColor(score) {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

// Hauptfunktion für das Entscheidungsmodul
function setupDecisionModule() {
  const app = document.getElementById("decision-app");
  if (!app) return;

  app.innerHTML = `
    <h2>Entscheidungs-Assistent 🚦</h2>
    <form id="decisionForm">
      <label>Beschreibe deine Entscheidungsfrage:</label><br>
      <input type="text" id="decisionQuestion" required style="width:90%"><br><br>
      <label>Alternativen (je Zeile eine Option):</label><br>
      <textarea id="decisionOptions" rows="3" required style="width:90%"></textarea><br><br>
      <button type="submit">Matrix anzeigen</button>
    </form>
    <div id="decisionMatrix"></div>
  `;

  document.getElementById("decisionForm").onsubmit = function (e) {
    e.preventDefault();
    const question = document.getElementById("decisionQuestion").value.trim();
    const options = document.getElementById("decisionOptions").value
      .split("\n")
      .map(o => o.trim())
      .filter(o => o.length > 0);

    renderDecisionMatrix(options, userValues);
  };
}

// Dummy: Bewertungslogik, simuliert die Erfüllung jeder Alternative (Randomwert, später GPT)
function rateAlternativeForValue(option, value) {
  // Ersetze dies später durch GPT/API-Auswertung!
  return Math.round(
    Math.random() * value.weight + (Math.random() - 0.5) * 20
  );
}

// Darstellung der Ampelmatrix
function renderDecisionMatrix(options, values) {
  const matrixDiv = document.getElementById("decisionMatrix");
  let html = `<table border="1" style="border-collapse:collapse; width:100%"><tr><th>Alternative</th>`;
  values.forEach(v => (html += `<th>${v.name}</th>`));
  html += "</tr>";

  options.forEach(option => {
    html += `<tr><td>${option}</td>`;
    values.forEach(value => {
      const score = rateAlternativeForValue(option, value);
      const color = getTrafficLightColor(score);
      html += `<td style="background:${color};color:#fff;text-align:center;">${score}</td>`;
    });
    html += "</tr>";
  });

  html += "</table><br>";
  html += `<small><b>Hinweis:</b> Die Ampelfarben zeigen, wie stark die Alternative jeweils deinem Wert entspricht (später via GPT-Analyse automatisierbar).</small>`;
  matrixDiv.innerHTML = html;
}

// Exportiert die Funktion fürs Hauptscript (optional, je nach Modulstruktur)
window.setupDecisionModule = setupDecisionModule;
