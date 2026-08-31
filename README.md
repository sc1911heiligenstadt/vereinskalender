# 📅 Vereinskalender

Alle anstehenden Vereinstermine an einer Stelle: gesperrte Hallen und Plätze,
Trainingszeiten, Veranstaltungen. Gepflegt wird zentral, gelesen von allen — und
wer mag, abonniert den Kalender einmal und hat die Termine danach automatisch im
eigenen Handy-Kalender.

**➡️ [Vereinskalender öffnen](https://sc1911heiligenstadt.github.io/vereinskalender/)**

## Was drin ist

| Reiter | Wofür |
|---|---|
| **Termine** | Die kommenden Termine, nach Kategorie sortierbar. Vergangene Termine verschwinden von selbst |
| **Einstellungen** | Die Kategorien pflegen, mit denen Termine eingeordnet werden |
| **Info** | Beschreibung, Änderungen — und die Karte **In den eigenen Kalender übernehmen** |

## Einmal abonnieren statt jedes Mal nachsehen

Der Kalender bietet einen Abo-Link (`webcal://`) an. Einmal im Handy oder in
Outlook eingetragen, kommen neue und geänderte Termine von selbst hinterher.
Der Link steht im Reiter **Info**.

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Die Rechte gelten in drei Stufen: **Sehen** (Termine ansehen und abonnieren),
**Bearbeiten** (Termine anlegen und pflegen) und **Administrieren** (Reiter
*Einstellungen*: die Kategorien). Wer welche Stufe hat, legt die Tools-Übersicht fest.

## Lokal starten

Über den Eintrag `vereinskalender` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8777/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).
