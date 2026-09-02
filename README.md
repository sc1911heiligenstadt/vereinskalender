# 📅 Vereinskalender

Alle anstehenden Vereinstermine an einer Stelle: gesperrte Hallen und Plätze,
Trainingszeiten, Veranstaltungen. Gepflegt wird zentral, gelesen von allen — und
wer mag, abonniert den Kalender einmal und hat die Termine danach automatisch im
eigenen Handy-Kalender.

**➡️ [Vereinskalender öffnen](https://sc1911heiligenstadt.github.io/vereinskalender/)**

## Was drin ist

| Reiter | Wofür |
|---|---|
| **Termine** | Die kommenden Termine, chronologisch. Der nächste steht oben als hervorgehobene Karte, der Rest nach Monat gruppiert. Vergangene Termine verschwinden von selbst |
| **Einstellungen** | Die Kategorien pflegen, mit denen Termine eingeordnet werden |
| **Info** | Beschreibung, Änderungen — und die Karte **In den eigenen Kalender übernehmen** |

Ein Termin trägt Titel, Kategorie, Datum (auch mehrtägig), wahlweise Uhrzeit oder
ganztägig, Ort und Notiz. Dateien lassen sich anhängen — PDF, Bilder oder andere
Formate, bis 10 MB je Datei; öffnen kann sie jeder Angemeldete.

## Privattermine und Teilen

Ein Termin lässt sich als **privat** markieren — dann sieht ihn nur, wer ihn
angelegt hat. Gezielt teilen geht mit einzelnen Personen (über ein Suchfeld) oder
mit ganzen Gruppen; die Beteiligten bekommen eine **E-Mail** mit Titel, Tag,
Uhrzeit und Ort — beim ersten Teilen und bei späteren Änderungen. Die Notiz
bleibt bewusst draußen und steht weiterhin nur in der App.

## Nachrichten sammeln sich zehn Minuten

E-Mail und Push gehen nicht sofort beim Speichern raus, sondern **zehn Minuten
nach der letzten Änderung**. Wer einen Termin anlegt und ihn gleich danach noch
nachbessert, löst damit nur eine Nachricht aus statt einer je Speichern — und
verschickt wird immer der Stand von zuletzt, nicht der vom Anfang. Wird der
Termin in dieser Zeit wieder gelöscht oder jemand wieder ausgetragen, geht
dafür gar nichts mehr raus.

## Terminumfragen

Statt eines festen Datums lassen sich mehrere **Vorschläge** eintragen, jeder mit
eigener Uhrzeit („von“ und „bis“, beides freiwillig). Abgestimmt wird direkt auf
der Terminkarte per Haken oder Kreuz — auch ohne Bearbeiten-Recht, sofern man den
Termin sehen darf. Ein zweiter Klick zieht die eigene Stimme zurück; ein weiterer
Knopf zeigt, wer zu- und wer abgesagt hat. Vergangene Vorschläge verschwinden am
Folgetag von der Karte, die übrigen bleiben stehen.

## Termine aus anderen Werkzeugen

Anstehende **Fußballcamps** stehen von selbst im Kalender und tragen auf der
Karte das Zeichen „Aus dem Fußballcamp“. Gepflegt werden sie dort; Titel, Datum,
Ort, Zeit und Notiz werden hier bei jeder Änderung überschrieben. Kategorie und
Anhänge gehören dagegen dem Kalender und bleiben stehen. Löschen geht ganz
normal — der Termin kommt dann nicht wieder.

## Einmal abonnieren statt jedes Mal nachsehen

Der Kalender bietet einen Abo-Link (`webcal://`) an. Einmal im Handy oder in
Outlook eingetragen, kommen neue und geänderte Termine von selbst hinterher.
Der Link steht im Reiter **Info**.

Beim Erzeugen ist wählbar, ob nur die allgemeinen Vereinstermine mitkommen oder
zusätzlich die eigenen privaten und die geteilten. **Der Link ist der Ausweis:**
wer ihn hat, sieht diese Termine — er lässt sich jederzeit entwerten und neu
erzeugen, und mit dem Konto oder dem Zugang zum Kalender erlischt er sofort.

## Benachrichtigung aufs Handy

Wird ein Termin angelegt oder inhaltlich geändert (Titel, Datum, Ort, Uhrzeit,
Umfrage-Vorschläge), bekommt das Personal eine Push-Nachricht — sofern in der
Tools-Übersicht unter *Mein Konto* eingeschaltet. Sie wartet dieselben zehn
Minuten wie die E-Mail. Die Nachricht nennt weder Titel noch Ort, weil sie auf
dem Sperrbildschirm steht. Spielerkonten werden nicht benachrichtigt, und an
alle geht nie eine E-Mail.

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Die Rechte gelten in drei Stufen: **Sehen** (Termine ansehen, Anhänge öffnen, bei
Umfragen abstimmen, den Kalender-Link erzeugen), **Bearbeiten** (Termine anlegen,
ändern, löschen, Dateien anhängen, teilen) und **Administrieren** (Reiter
*Einstellungen*: die Kategorien). Wer welche Stufe hat, legt die Tools-Übersicht fest.

Fällt die Anmeldung weg, während die App offen ist, wird der Bildschirm samt
Termin-Dialog geräumt; zurück geht es über ein Neuladen der Seite.

## Lokal starten

Über den Eintrag `vereinskalender` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8777/`.

## Technik

| Datei | Zweck |
|---|---|
| `index.html` | drei Reiter (Termine, Einstellungen, Info), ein Termin-Dialog |
| `config.js` | Version, Datei-Obergrenze, Standard-Kategorien, Changelog |
| `db.js` | Anbindung an das Gateway der Tools-Übersicht |
| `app.js` | Terminliste, Formular, Umfragen, Teilen, Abo-Link, Rechte |
| `style.css` | Gestaltung |

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser. Ändern zwei Geräte gleichzeitig denselben Stand, erkennt die App das, lädt den fremden Stand nach und sagt Bescheid.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).
