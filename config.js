const APP_VERSION = "1.0";

// Größenlimit pro hochgeladener Datei. base64 im Request bläht ~+33 % auf, bleibt
// damit klar unter dem Cloudflare-Free-Limit. Muss zum Worker-Cap passen.
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

// Startbestand der Termin-Kategorien — greift, wenn im Gateway noch keine bzw.
// leere Daten liegen. Im Einstellungen-Tab (nur Administrieren-Stufe) frei anpassbar.
const DEFAULT_KATEGORIEN = [
  { id: "halle",         name: "Halle gesperrt",          farbe: "#c0392b" },
  { id: "platz",         name: "Kunstrasen/Platz gesperrt", farbe: "#e08a1e" },
  { id: "training",      name: "Training",                farbe: "#1a56a0" },
  { id: "veranstaltung", name: "Veranstaltung",           farbe: "#2d8c4e" },
  { id: "sonstiges",     name: "Sonstiges",               farbe: "#6b7280" }
];

const APP_CHANGELOG = [
  {
    version: "1.1",
    groups: [
      {
        title: "Ausführlichere E-Mails beim Teilen",
        items: [
          "Die E-Mail an die Personen, mit denen ein privater Termin geteilt wird, nennt jetzt Titel, Tag, Uhrzeit und Ort direkt in der Nachricht — vorher stand dort nur ein Satz mit dem Titel und ein Link.",
          "Bei einer Terminumfrage listet die E-Mail alle zur Auswahl stehenden Tage samt Uhrzeiten auf und bittet um die Abstimmung.",
          "Wird ein bereits geteilter Termin geändert, steht der neue Stand mit allen Eckdaten in der E-Mail, nicht nur der Hinweis, dass sich etwas geändert hat.",
          "Die Notiz zum Termin bleibt bewusst draußen: Titel, Tag und Ort reichen zum Einordnen, alle Einzelheiten stehen weiterhin nur in der App."
        ]
      }
    ]
  },
  {
    version: "1.0",
    groups: [
      {
        title: "Vereinskalender",
        items: [
          "Übersicht der als Nächstes anstehenden Vereinstermine — bewusst kein voller Kalender, sondern die kommenden Termine auf einen Blick, chronologisch sortiert.",
          "Der nächste Termin steht oben als hervorgehobene Karte, danach folgen die weiteren nach Monat gruppiert.",
          "Vergangene Termine verschwinden von selbst aus der Ansicht, samt der zu ihnen hochgeladenen Dateien.",
          "Jede Karte zeigt, von wem und wann der Termin angelegt wurde."
        ]
      },
      {
        title: "Termine eintragen",
        items: [
          "Titel, Kategorie, Datum — auch mehrtägig —, wahlweise Uhrzeit oder ganztägig, Ort und Notiz.",
          "Zu jedem Termin lassen sich Dateien anhängen: PDF, Bilder oder andere Formate. Alle angemeldeten Nutzer können sie öffnen oder herunterladen."
        ]
      },
      {
        title: "Privattermine und Teilen",
        items: [
          "Ein Termin lässt sich als Privattermin markieren — dann sieht ihn nur, wer ihn angelegt hat.",
          "Private Termine lassen sich gezielt mit einzelnen Personen über ein Suchfeld oder mit ganzen Gruppen teilen. Diese sehen den Termin dann zusätzlich.",
          "Wer einen privaten Termin geteilt bekommt, erhält eine E-Mail — beim ersten Teilen und bei späteren Änderungen."
        ]
      },
      {
        title: "Umfrage-Termine",
        items: [
          "Statt eines festen Datums lassen sich mehrere Terminvorschläge eintragen, über die abgestimmt wird.",
          "Jeder Vorschlag kann eine eigene Uhrzeit haben, „von“ und „bis“, beides freiwillig. Ohne Uhrzeit bleibt er ein Tagestermin.",
          "Dadurch sind auch mehrere Vorschläge am selben Tag zu verschiedenen Zeiten möglich — sie erscheinen als getrennte Zeilen zum Abstimmen.",
          "Abgestimmt wird direkt auf der Terminkarte per Haken oder Kreuz, ohne das Formular zu öffnen. Ein weiterer Knopf zeigt die Namen der Zu- und Absagen je Vorschlag.",
          "Abstimmen darf jeder, der den Termin sehen darf — also genau die eingeladenen Personen, auch ohne Bearbeiten-Recht.",
          "Die Stimmen anderer werden beim eigenen Abstimmen sofort mit übernommen; die Zähler zeigen den aktuellen Stand.",
          "Ein zweiter Klick auf denselben Knopf zieht die eigene Stimme zurück.",
          "Uhrzeiten lassen sich bei laufender Umfrage nachtragen, ohne dass abgegebene Stimmen verloren gehen. Wer den Termin geteilt bekommen hat, wird über die Änderung informiert.",
          "Angezeigt werden nur die Terminvorschläge, die noch bevorstehen. Ein Vorschlagstag, der vorbei ist, verschwindet am Folgetag von der Karte — auch wenn weitere Vorschläge desselben Termins noch kommen.",
          "Datum und Einordnung in der Liste richten sich nach dem nächsten noch offenen Vorschlag, nicht nach dem ersten überhaupt. Die Übersicht zeigt damit dasselbe wie das Fenster „Nächste Termine“ auf der Startseite."
        ]
      },
      {
        title: "In den eigenen Kalender übernehmen",
        items: [
          "Im Reiter „Info“ lässt sich ein persönlicher Kalender-Link erzeugen. Damit erscheinen die Vereinstermine dauerhaft im eigenen Kalender — am Handy, im Google-Konto oder in Outlook.",
          "Das ist keine einmalige Kopie: der eigene Kalender ruft den Link von selbst regelmäßig ab, neue und geänderte Termine kommen also von allein dazu.",
          "Beim Erzeugen ist wählbar, ob nur die allgemeinen Vereinstermine übernommen werden oder zusätzlich die eigenen privaten und die mit einem geteilten. Ohne Haken bleiben private Termine außen vor.",
          "Umfrage-Termine erscheinen mit jedem Vorschlag als eigener Eintrag und sind als unbestätigt gekennzeichnet.",
          "Den Link darf sich jeder erzeugen, der den Kalender sehen darf — er zeigt genau die Termine, die man auch in der App sieht.",
          "Der Link ist der Ausweis: wer ihn hat, sieht die Termine. Er lässt sich jederzeit entwerten und neu erzeugen.",
          "Wird das Konto gelöscht oder der Zugang zum Vereinskalender entzogen, hört der Link im selben Moment auf zu funktionieren.",
          "Wie schnell Änderungen ankommen, bestimmt das eigene Kalenderprogramm. Apple und Outlook fragen im Minutenabstand nach, Google nur alle paar Stunden."
        ]
      },
      {
        title: "Benachrichtigung aufs Handy",
        items: [
          "Wird ein Termin angelegt oder inhaltlich geändert, bekommt das Personal eine Benachrichtigung aufs Handy — vorausgesetzt, es hat sie in der Tools-Übersicht unter „Mein Konto“ eingeschaltet.",
          "Gemeldet werden Änderungen an Titel, Datum, Ort, Uhrzeit oder den Terminvorschlägen einer Umfrage. Eine korrigierte Notiz oder ein ausgetauschter Anhang lösen bewusst nichts aus.",
          "Wer den Termin selbst anlegt, bekommt keine Meldung darüber.",
          "Die Nachricht nennt weder Titel noch Ort — sie steht auf dem Sperrbildschirm. Was ansteht, sieht man nach dem Antippen im Kalender.",
          "Spielerkonten werden nicht benachrichtigt.",
          "Bei privat geteilten Terminen gehen E-Mail und Benachrichtigung nur an die Personen, mit denen der Termin geteilt wurde.",
          "Es geht keine E-Mail an alle — ein öffentlicher Termin ist kein Rundschreiben."
        ]
      },
      {
        title: "Kategorien",
        items: [
          "Kategorien für Termine anlegen, umbenennen, umfärben und löschen. Sie stehen danach im Termin-Formular zur Auswahl."
        ]
      },
      {
        title: "Wer darf was",
        items: [
          "Sehen: alle Termine, Anhänge öffnen und bei Umfragen abstimmen.",
          "Bearbeiten: Termine anlegen, ändern und löschen, Dateien anhängen, Termine teilen.",
          "Administrieren: die Kategorien im Reiter „Einstellungen“ pflegen.",
          "Der Reiter „Info“ ist für alle sichtbar."
        ]
      },
      {
        title: "Bedienung am Handy",
        items: [
          "Die Ansicht ist für das Handy gebaut und funktioniert dort vollständig.",
          "Eingabefelder sind mindestens 16 Pixel groß, damit der iPhone-Browser beim Antippen nicht ungefragt in die Seite hineinzoomt und verschoben stehen bleibt."
        ]
      },
      {
        title: "Daten & Speicherung",
        items: [
          "Gespeichert wird in der Vereins-Nextcloud über die zentrale Anmeldung der Tools-Übersicht — ein eigenes Passwort braucht es nicht.",
          "Ändern zwei Geräte gleichzeitig denselben Stand, erkennt die App das, lädt den fremden Stand nach und sagt Bescheid."
        ]
      }
    ]
  }
];
