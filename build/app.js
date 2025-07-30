// app.js

let userValues = []; // Wird aus questions.json geladen

// Hilfsfunktion: Daten laden (async)
async function loadQuestions() {
    const res = await fetch("questions.json");
    return await res.json();
}

// Initialisiert die Werte-Matrix-UI
function renderValuesMatrix(questions) {
    const app = document.getElementById("decision-app");
    if (!app) return;

    let html = `<h2>Deine Werte-Matrix</h2>
    <form id="valuesForm">
      <table>
        <tr>
          <th>Wert</th>
          <th>Bedeutung</th>
          <th>Wichtigkeit (0–100)</th>
        </tr>
    `;

    questions.forEach((q, i) => {
        html += `
        <tr>
          <td>${q.key}</td>
          <td>${q.label}</td>
          <td><input type="number" min="0" max="100" name="weight_${i}" value="${q.weight || 50}" style="width:60px"></td>
        </tr>
        `;
    });

    html += `</table>
      <button type="submit">Speichern & Weiter zur Entscheidung</button>
    </form>`;

    app.innerHTML = html;

    document.getElementById("valuesForm").onsubmit = function (e) {
        e.preventDefault();
        userValues = questions.map((q, i) => ({
            key: q.key,
            name: q.label,
            weight: parseInt(document.querySelector(`[name="weight_${i}"]`).value)
        }));
        localStorage.setItem("userValues", JSON.stringify(userValues));
        setupDecisionModule(); // Starte Entscheidungsmodul (aus decision.js)
    };
}

// App-Startpunkt: Werte laden, ggf. aus LocalStorage
async function main() {
    // Prüfe, ob Werte schon gespeichert sind
    let stored = localStorage.getItem("userValues");
    if (stored) {
        userValues = JSON.parse(stored);
        setupDecisionModule(); // Direkt zur Entscheidungsmatrix
    } else {
        // Fragen laden und Werte-Matrix anzeigen
        const questions = await loadQuestions();
        renderValuesMatrix(questions);
    }
}

// **Starte die App**
main();
