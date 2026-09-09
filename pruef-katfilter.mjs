// Prueft den Kategorie-Filter der Terminliste mit dem ECHTEN Quelltext aus
// app.js: die Funktionen werden aus der Datei geschnitten und ausgefuehrt, nicht
// nachgebaut. Kein Netz, keine Daten, laeuft unter einer Sekunde.
//
// Gestubbt sind nur Dinge, die mit dem Filter nichts zu tun haben (isUpcoming,
// terminVisibleFor, terminCardHtml, Monatsueberschriften). Alles, worum es hier
// geht -- welche Termine durchkommen, was der Zaehler sagt, welcher Satz im
// Leerzustand steht, was beim Sprung auf einen ausgeblendeten Termin passiert --
// laeuft im Originalcode.
//
// Aufruf: node pruef-katfilter.mjs [pfad/zu/app.js]
import fs from "fs";
import vm from "vm";

const PFAD = process.argv[2] || new URL("./app.js", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
// Zeilenenden vereinheitlichen: die Schnittmarken unten suchen eine Zeile, die
// genau aus einer schliessenden Klammer besteht -- mit LF geschrieben. Liegt die
// Datei mit CRLF im Arbeitsverzeichnis, faende die Suche sonst nichts und der
// Lauf braeche ab, statt zu messen.
const app = fs.readFileSync(PFAD, "utf8").replace(/\r\n/g, "\n");

function schneide(startMarke) {
  const i = app.indexOf(startMarke);
  if (i < 0) throw new Error("ABBRUCH: nicht gefunden: " + startMarke);
  const ende = app.indexOf("\n}\n", i);
  if (ende < 0) throw new Error("ABBRUCH: Ende nicht gefunden: " + startMarke);
  return app.slice(i, ende + 2);
}
function schneideZeile(marke) {
  const i = app.indexOf(marke);
  if (i < 0) throw new Error("ABBRUCH: nicht gefunden: " + marke);
  return app.slice(i, app.indexOf("\n", i));
}

const echterCode = [
  schneideZeile("function kategorieById("),
  schneideZeile("function katFarbe("),
  schneideZeile("function katName("),
  schneideZeile('const KAT_FILTER_KEY ='),
  schneideZeile("let katFilterOffen ="),
  schneide("function ladeKatFilter("),
  schneide("function speichereKatFilter("),
  schneide("function terminPasstZumKatFilter("),
  schneide("function renderKatFilter("),
  schneide("function schliesseKatFilterBeiKlickDaneben("),
  schneide("function onKatFilterClick("),
  schneide("function onKatFilterChange("),
  schneide("function renderTermine("),
  schneide("function springeZuTermin(")
].join("\n\n");

// ---------- Winziger DOM-Ersatz: nur was die Funktionen anfassen ----------
function machKnoten(id) {
  return {
    id,
    innerHTML: "",
    textContent: "",
    dataset: {},
    _klassen: new Set(),
    classList: {
      add: function (c) { this._el._klassen.add(c); },
      remove: function (c) { this._el._klassen.delete(c); },
      toggle: function (c, an) { if (an) this._el._klassen.add(c); else this._el._klassen.delete(c); },
      contains: function (c) { return this._el._klassen.has(c); }
    }
  };
}
const knoten = {};
["kat-filter", "hero", "termin-list", "termine-empty", "termine-count", "weitere-heading", "sprung-hinweis"]
  .forEach((id) => { knoten[id] = machKnoten(id); knoten[id].classList._el = knoten[id]; });

// Karten, die renderTermine "gezeichnet" hat -- daraus bedient sich
// querySelectorAll(".termin-card"), damit springeZuTermin echt suchen kann.
let gezeichneteIds = [];

// Die Klappliste fragt nach dem gerade fokussierten Element und sucht darin
// weiter. Beides muss der Ersatz koennen, sonst faellt renderKatFilter() aus.
knoten["kat-filter"].querySelector = () => null;
knoten["kat-filter"].contains = (n) => n === knoten["kat-filter"] || !!(n && n.imFilter);

const speicher = {};
const sandbox = {
  console,
  localStorage: {
    getItem: (k) => (k in speicher ? speicher[k] : null),
    setItem: (k, v) => { speicher[k] = String(v); },
    removeItem: (k) => { delete speicher[k]; }
  },
  document: {
    activeElement: null,
    getElementById: (id) => knoten[id] || null,
    querySelectorAll: (sel) => {
      if (sel !== ".termin-card") return { forEach: () => {} };
      const liste = gezeichneteIds.map((id) => ({
        dataset: { id },
        scrollIntoView: () => {},
        classList: { add: () => {}, remove: () => {} }
      }));
      return { forEach: (fn) => liste.forEach(fn) };
    }
  },
  setTimeout: () => 0,
  // --- Stubs: mit dem Filter nicht verwandt ---
  bildschirmGeraeumt: false,
  appData: { meta: {}, kategorien: [], termine: [] },
  sprungTerminId: null,
  escapeHtml: (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
  isUpcoming: (t) => !t.vorbei,
  terminVisibleFor: (t) => !t.versteckt,
  sortTermine: (a, b) => String(a.datum).localeCompare(String(b.datum)),
  terminAnzeigeStartIso: (t) => t.datum,
  monthKey: (iso) => String(iso).slice(0, 7),
  monthLabel: (iso) => String(iso).slice(0, 7),
  terminCardHtml: (t) => { gezeichneteIds.push(t.id); return '<div class="termin-card" data-id="' + t.id + '"></div>'; }
};
vm.createContext(sandbox);
vm.runInContext(echterCode, sandbox);

// renderTermine() ruft als Erstes renderKatFilter(). Dort haengt sich der Zaehler
// der "gezeichneten" Karten auf null zurueck -- sonst wuchse die Liste ueber
// mehrere Laeufe hinweg an und ein zweiter Aufruf sae wie ein erfolgreicher aus,
// obwohl er gar nichts gezeichnet hat.
const echtRenderKatFilter = sandbox.renderKatFilter;
sandbox.renderKatFilter = function () { gezeichneteIds = []; return echtRenderKatFilter.apply(null, arguments); };

// ---------- Zusagen ----------
let fehler = 0;
const pruefe = (name, bedingung, zusatz) => {
  if (bedingung) { console.log("  [ok]   " + name); return; }
  fehler++;
  console.log("  [FEHL] " + name + (zusatz === undefined ? "" : "  ->  " + JSON.stringify(zusatz)));
};

const KATS = [
  { id: "halle", name: "Halle gesperrt", farbe: "#c0392b" },
  { id: "training", name: "Training", farbe: "#1a56a0" },
  { id: "veranstaltung", name: "Veranstaltung", farbe: "#2d8c4e" }
];
const TERMINE = [
  { id: "t1", datum: "2026-10-01", titel: "A", kategorie: "halle" },
  { id: "t2", datum: "2026-10-02", titel: "B", kategorie: "training" },
  { id: "t3", datum: "2026-10-03", titel: "C", kategorie: "training" },
  { id: "t4", datum: "2026-10-04", titel: "D", kategorie: "veranstaltung" },
  { id: "t5", datum: "2026-10-05", titel: "E", kategorie: "geloescht-kat" }
];
function stelleEin(ausgeblendet, termine) {
  sandbox.appData = { meta: {}, kategorien: KATS.slice(), termine: (termine || TERMINE).slice() };
  sandbox.katAus = new Set(ausgeblendet || []);
  sandbox.renderTermine();
}

console.log("== 1. Ohne Filter ist alles da");
stelleEin([]);
pruefe("alle fuenf gezeichnet", gezeichneteIds.length === 5, gezeichneteIds);
pruefe("Zaehler ohne 'von'", knoten["termine-count"].textContent === "5 anstehende Termine", knoten["termine-count"].textContent);
pruefe("kein Leerzustand", knoten["termine-empty"].classList.contains("hidden"));
pruefe("kein 'Alle zeigen'", !knoten["kat-filter"].innerHTML.includes("Alle zeigen"));

console.log("== 2. Eine Kategorie aus");
stelleEin(["training"]);
pruefe("die zwei Trainingstermine fehlen", !gezeichneteIds.includes("t2") && !gezeichneteIds.includes("t3"), gezeichneteIds);
pruefe("der Rest ist da", gezeichneteIds.length === 3, gezeichneteIds);
pruefe("Zaehler sagt 3 von 5", knoten["termine-count"].textContent === "3 von 5 anstehenden Terminen", knoten["termine-count"].textContent);
pruefe("'Alle zeigen' erscheint", knoten["kat-filter"].innerHTML.includes("Alle zeigen"));
pruefe("der Haken bei Training ist raus", knoten["kat-filter"].innerHTML.includes('data-kat="training">'), knoten["kat-filter"].innerHTML);
pruefe("die anderen sind angehakt", knoten["kat-filter"].innerHTML.includes('data-kat="halle" checked'));
pruefe("die Zeile ist als aus gekennzeichnet", knoten["kat-filter"].innerHTML.includes('class="kf-zeile aus"'));
pruefe("am Knopf steht, wie viele aus sind", knoten["kat-filter"].innerHTML.includes(">1 aus<"));

console.log("== 3. Termin mit geloeschter Kategorie bleibt sichtbar");
stelleEin(["halle", "training", "veranstaltung"]);
pruefe("nur t5 ist uebrig", gezeichneteIds.length === 1 && gezeichneteIds[0] === "t5", gezeichneteIds);

console.log("== 4. Filter blendet ALLES aus -> anderer Satz");
stelleEin(["halle", "training", "veranstaltung"], TERMINE.filter((t) => t.kategorie !== "geloescht-kat"));
pruefe("Leerzustand sichtbar", !knoten["termine-empty"].classList.contains("hidden"));
pruefe("sagt, dass der FILTER es ist", knoten["termine-empty"].textContent.includes("Kategorien"), knoten["termine-empty"].textContent);
pruefe("nicht der Satz fuer 'gar nichts eingetragen'", !knoten["termine-empty"].textContent.includes("keine anstehenden Termine eingetragen"));

console.log("== 5. Gar keine Termine -> der andere Satz");
stelleEin([], []);
pruefe("Leerzustand sichtbar", !knoten["termine-empty"].classList.contains("hidden"));
pruefe("sagt, dass nichts eingetragen ist", knoten["termine-empty"].textContent.includes("keine anstehenden Termine eingetragen"), knoten["termine-empty"].textContent);
pruefe("Zaehler leer", knoten["termine-count"].textContent === "");

console.log("== 6. Die Zahl in der Liste zaehlt OHNE den Filter");
stelleEin(["training"]);
const nachTraining = knoten["kat-filter"].innerHTML.slice(knoten["kat-filter"].innerHTML.indexOf('data-kat="training"'));
pruefe("Training zeigt weiter 2", nachTraining.indexOf('kf-zahl">2<') > -1 && nachTraining.indexOf('kf-zahl">2<') < nachTraining.indexOf("</label>"), nachTraining.slice(0, 300));

console.log("== 7. Nur eine Kategorie -> keine Leiste");
sandbox.appData = { meta: {}, kategorien: [KATS[0]], termine: TERMINE.slice() };
sandbox.katAus = new Set();
sandbox.renderTermine();
pruefe("Leiste ausgeblendet", knoten["kat-filter"].classList.contains("hidden"));
pruefe("und leer", knoten["kat-filter"].innerHTML === "");

console.log("== 8. Haken setzen schaltet um und merkt es sich");
stelleEin([]);
// Ein Haken, wie ihn der Browser meldet: das <input> traegt data-kat und den
// neuen Zustand in .checked.
const machHaken = (kat, angehakt) => ({ target: { closest: (sel) => (sel === "input[data-kat]" ? { dataset: { kat }, checked: angehakt } : null) } });
const machKlick = (ziel) => ({ target: { closest: (sel) => (sel === ".kat-filter-toggle" ? (ziel === "toggle" ? {} : null) : sel === "[data-kat-alle]" ? (ziel === "alle" ? {} : null) : null) }, imFilter: true });
sandbox.onKatFilterChange(machHaken("halle", false));
pruefe("Halle ist jetzt aus", sandbox.katAus.has("halle"));
pruefe("im Speicher steht sie auch", JSON.parse(speicher["vk-kat-ausgeblendet"] || "[]").includes("halle"), speicher["vk-kat-ausgeblendet"]);
pruefe("Liste ist neu gezeichnet", !gezeichneteIds.includes("t1"), gezeichneteIds);
sandbox.onKatFilterChange(machHaken("halle", true));
pruefe("Haken zurueck holt sie wieder", !sandbox.katAus.has("halle") && gezeichneteIds.includes("t1"));
sandbox.onKatFilterChange(machHaken("training", false));
sandbox.onKatFilterClick(machKlick("alle"));
pruefe("'Alle zeigen' raeumt den Filter", sandbox.katAus.size === 0);
pruefe("und schreibt das auch weg", JSON.parse(speicher["vk-kat-ausgeblendet"] || "[]").length === 0, speicher["vk-kat-ausgeblendet"]);

console.log("== 8b. Auf- und Zuklappen");
stelleEin([]);
pruefe("startet zu", knoten["kat-filter"].innerHTML.includes("kat-filter-menu") && knoten["kat-filter"].innerHTML.includes(" hidden>"));
sandbox.onKatFilterClick(machKlick("toggle"));
pruefe("Knopf macht auf", !knoten["kat-filter"].innerHTML.includes(" hidden>") && knoten["kat-filter"].innerHTML.includes('aria-expanded="true"'));
// ⚠️ Der Kern: ein Haken darf die Liste NICHT zuklappen -- man haekelt meist
// mehrere hintereinander an.
sandbox.onKatFilterChange(machHaken("training", false));
pruefe("ein Haken laesst sie offen", !knoten["kat-filter"].innerHTML.includes(" hidden>"), knoten["kat-filter"].innerHTML.slice(0, 200));
sandbox.schliesseKatFilterBeiKlickDaneben({ target: { irgendwo: true } });
pruefe("Klick daneben macht zu", knoten["kat-filter"].innerHTML.includes(" hidden>"));
sandbox.onKatFilterClick(machKlick("toggle"));
sandbox.schliesseKatFilterBeiKlickDaneben({ target: { imFilter: true } });
pruefe("Klick IN der Liste macht nicht zu", !knoten["kat-filter"].innerHTML.includes(" hidden>"));
sandbox.onKatFilterClick(machKlick("toggle"));
pruefe("Knopf macht wieder zu", knoten["kat-filter"].innerHTML.includes(" hidden>"));

console.log("== 9. Gemerkter Filter wird beim Start gelesen");
speicher["vk-kat-ausgeblendet"] = JSON.stringify(["veranstaltung"]);
pruefe("liest die Liste", sandbox.ladeKatFilter().has("veranstaltung"));
speicher["vk-kat-ausgeblendet"] = "{kein json";
pruefe("kaputter Eintrag kippt nichts", sandbox.ladeKatFilter().size === 0);
speicher["vk-kat-ausgeblendet"] = JSON.stringify({ nicht: "array" });
pruefe("falscher Typ kippt auch nichts", sandbox.ladeKatFilter().size === 0);

console.log("== 10. Sprung auf einen ausgeblendeten Termin");
stelleEin(["training"]);
speicher["vk-kat-ausgeblendet"] = JSON.stringify(["training"]);
sandbox.sprungTerminId = "t2";
knoten["sprung-hinweis"].textContent = "";
sandbox.springeZuTermin();
pruefe("Kategorie wieder eingeschaltet", !sandbox.katAus.has("training"), Array.from(sandbox.katAus));
pruefe("Termin steht jetzt in der Liste", gezeichneteIds.includes("t2"), gezeichneteIds);
pruefe("und es steht dran, warum", knoten["sprung-hinweis"].textContent.includes("ausgeblendet"), knoten["sprung-hinweis"].textContent);
pruefe("NICHT die Meldung 'vorbei oder geloescht'", !knoten["sprung-hinweis"].textContent.includes("vorbei"), knoten["sprung-hinweis"].textContent);

console.log("== 11. Sprung auf einen Termin, den es wirklich nicht gibt");
stelleEin([]);
sandbox.sprungTerminId = "gibtsnicht";
knoten["sprung-hinweis"].textContent = "";
sandbox.springeZuTermin();
pruefe("meldet den verwaisten Verweis", knoten["sprung-hinweis"].textContent.includes("nicht (mehr)"), knoten["sprung-hinweis"].textContent);

console.log("== 12. Sprung auf einen sichtbaren Termin laesst den Filter in Ruhe");
stelleEin(["training"]);
sandbox.sprungTerminId = "t1";
knoten["sprung-hinweis"].textContent = "vorher";
sandbox.springeZuTermin();
pruefe("Filter unveraendert", sandbox.katAus.has("training"), Array.from(sandbox.katAus));
pruefe("Hinweiszeile geraeumt", knoten["sprung-hinweis"].textContent === "" && knoten["sprung-hinweis"].classList.contains("hidden"), knoten["sprung-hinweis"].textContent);

console.log("");
if (fehler) { console.log(fehler + " FEHLER"); process.exit(1); }
console.log("ALLES GRUEN");
