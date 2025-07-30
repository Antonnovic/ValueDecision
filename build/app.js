// app.js

let userValues = []; // Hier werden die Werte gespeichert

// Hilfsfunktion: Daten laden (async)
async function loadQuestions() {
    const res = await fetch("questions.json");
    return await res.json();
}

// Werte-Matrix-UI anzeigen
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
          <td>
            <input type="number" min="0" max="100" name="weight_${i}" value="${q.weight || 50}" style="width:60px">
          </td>
        </tr>
        `;
    });

    html += `</table>
      <button type="submit" class="btn">Speichern & Weiter zur Entscheidung</button>
    </form>`;

    app.innerHTML = html;

    document.getElementById("valuesForm").onsubmit = function (e) {
        e.preventDefault();
        userValues = questions.map((q, i) => ({
            key: q.key,
            name: q.label,
            weight: parseInt(document.querySelector(`[name="weight_${i}"]`).value)
        }));
        // Speichern im localStorage
        localStorage.setItem("userValues", JSON.stringify(userValues));
        // Starte Entscheidungsmodul (aus decision.js)
        setupDecisionModule();
    };
}

// App-Startpunkt: Werte laden, ggf. aus LocalStorage
async function main() {
    let stored = localStorage.getItem("userValues");
    if (stored) {
        userValues = JSON.parse(stored);
        setupDecisionModule();
    } else {
        const questions = await loadQuestions();
        renderValuesMatrix(questions);
    }
}

// **Starte die App**
main();
