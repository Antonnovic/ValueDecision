// app.js

// DOM Elements
const app = document.getElementById("app");
const logo = "GLOASIS LOGO.svg"; // Passe ggf. den Pfad an

// State
let questions = [];
let currentQuestion = 0;
let answers = [];

// Fetch questions
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data.questions || data; // unterstützt beide Formate
    renderStart();
  })
  .catch(error => {
    app.innerHTML = `<div class="error">Fehler beim Laden der Fragen: ${error}</div>`;
  });

// Render Start Screen
function renderStart() {
  app.innerHTML = `
    <div class="center">
      <img src="${logo}" alt="Logo" class="logo"/>
      <h1>Entscheidungsmatrix</h1>
      <p>Finde heraus, was wirklich zählt.<br>Mit ein bisschen KI-Flow & Humor.</p>
      <button onclick="startQuestions()" class="btn">Jetzt starten 🚀</button>
    </div>
  `;
}

// Start Question Flow
window.startQuestions = function() {
  currentQuestion = 0;
  answers = [];
  renderQuestion();
};

// Render Question
function renderQuestion() {
  const q = questions[currentQuestion];
  if (!q) return renderResult();

  // Antworthandler als separate Funktion
  function answerHandler(value) {
    answers.push({ id: q.id, value: value });
    currentQuestion++;
    renderQuestion();
  }

  // UI bauen
  app.innerHTML = `
    <div class="question-card">
      <div class="progress">Frage ${currentQuestion + 1} von ${questions.length}</div>
      <h2>${q.text || q.frage}</h2>
      ${renderOptions(q, answerHandler)}
    </div>
  `;
}

// Render Answer Options
function renderOptions(q, answerHandler) {
  if (q.options) {
    // Multiple-Choice
    return q.options
      .map(
        (opt, idx) =>
          `<button class="btn" onclick="window.answerHandler_${currentQuestion}('${opt.value ?? opt}')">${opt.text ?? opt}</button>`
      )
      .join("<br>");
  } else if (q.scale) {
    // Skalenfrage (0-100)
    window[`answerHandler_${currentQuestion}`] = answerHandler;
    return `
      <input type="range" min="${q.scale.min || 0}" max="${q.scale.max || 100}" value="50" id="slider_${currentQuestion}" oninput="document.getElementById('val_${currentQuestion}').innerText = this.value">
      <span id="val_${currentQuestion}">50</span>
      <br><button class="btn" onclick="window.answerHandler_${currentQuestion}(document.getElementById('slider_${currentQuestion}').value)">Weiter</button>
    `;
  } else {
    // Freitext
    window[`answerHandler_${currentQuestion}`] = answerHandler;
    return `
      <input type="text" id="input_${currentQuestion}" class="input"/>
      <br><button class="btn" onclick="window.answerHandler_${currentQuestion}(document.getElementById('input_${currentQuestion}').value)">Weiter</button>
    `;
  }
}

// Render Result
function renderResult() {
  // Score-Berechnung (Beispiel)
  let score = answers.reduce((acc, a) => acc + Number(a.value || 0), 0);
  let maxScore = questions.reduce(
    (acc, q) => acc + (q.scale?.max || 100), 0
  );
  let percent = Math.round((score / maxScore) * 100);

  app.innerHTML = `
    <div class="center">
      <h2>Dein Ergebnis</h2>
      <p>Deine Entscheidungswerte: <strong>${percent}%</strong> Superwichtig!</p>
      <pre style="text-align:left;">${JSON.stringify(answers, null, 2)}</pre>
      <button class="btn" onclick="startQuestions()">Nochmal!</button>
      <p style="margin-top:2em;font-size:small;color:#888;">
        <i>Hinweis: Ergebnis, Humor und Flow noch in Entwicklung.<br>
        Bei Nebenwirkungen fragen Sie Ihren inneren Schweinehund oder KI-Berater.</i>
      </p>
    </div>
  `;
}

