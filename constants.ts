import { SectionDefinition } from './types';

export const COMPANY_SIZES = [
  'weniger als 50 Mitarbeitende',
  '50–249 Mitarbeitende',
  '250–999 Mitarbeitende',
  "1'000 oder mehr Mitarbeitende",
];

export const ROLES = [
  'Geschäftsleitung',
  'Verwaltungsrat / Beirat',
  'Bereichsleitung',
  'Andere Führungsfunktion',
];

export const INDUSTRIES = [
  { value: 'financial-services', label: 'Finanzdienstleistungen (Banken, Versicherungen, Vorsorge)' },
  { value: 'manufacturing', label: 'Industrie & Produktion' },
  { value: 'mem', label: 'Maschinen-, Elektro- & Metallindustrie (MEM)' },
  { value: 'construction', label: 'Bau, Immobilien & Infrastruktur' },
  { value: 'retail', label: 'Handel & E-Commerce' },
  { value: 'healthcare', label: 'Gesundheitswesen & Life Sciences' },
  { value: 'energy', label: 'Energie, Versorgung & Umwelt' },
  { value: 'logistics', label: 'Logistik, Transport & Mobilität' },
  { value: 'public-sector', label: 'Öffentliche Verwaltung & staatsnahe Organisationen' },
  { value: 'education', label: 'Bildung, Forschung & Wissenschaft' },
  { value: 'it-services', label: 'IT, Software & digitale Dienstleistungen' },
  { value: 'media', label: 'Medien, Kommunikation & Marketing' },
  { value: 'consulting', label: 'Beratung & professionelle Dienstleistungen' },
  { value: 'tourism', label: 'Tourismus, Hospitality & Freizeit' },
  { value: 'agriculture', label: 'Landwirtschaft & Lebensmittelindustrie' },
  { value: 'other', label: 'Andere Branche (bitte spezifizieren)' },
];

export const SECTIONS: SectionDefinition[] = [
  {
    key: 'strategy',
    title: 'B. Strategie & Führung',
    description: 'Die folgenden Aussagen beziehen sich auf Führung, strategische Klarheit und den Umgang mit KI auf oberster Ebene.',
    questions: [
      { id: 'q1', text: 'Unsere Geschäftsleitung hat ein gemeinsames Verständnis davon, welche Rolle KI für die zukünftige Entwicklung unserer Organisation spielt.' },
      { id: 'q2', text: 'KI-Initiativen sind bei uns klar mit strategischen Zielen verknüpft und keine isolierten Einzelmassnahmen.' },
      { id: 'q3', text: 'Verantwortung und Entscheidungsrechte im Umgang mit KI sind auf Führungsebene klar geregelt.' },
    ],
    freetextQuestion: 'Welche Spannungsfelder, Unsicherheiten oder offenen Fragen sehen Sie in Bezug auf Strategie und Führung?'
  },
  {
    key: 'useCases',
    title: 'C. Wertschöpfung & Use Cases',
    description: 'Dieser Abschnitt betrachtet den Beitrag von KI zur Wertschöpfung.',
    questions: [
      { id: 'q1', text: 'Wir haben eine klare Vorstellung davon, in welchen Bereichen KI für uns den grössten Mehrwert schaffen kann.' },
      { id: 'q2', text: 'KI-Anwendungen werden bei uns nach geschäftlichem Nutzen priorisiert, nicht nach technologischer Machbarkeit.' },
      { id: 'q3', text: 'Der Nutzen von KI-Initiativen wird systematisch überprüft und nicht nur initial angenommen.' },
    ],
    freetextQuestion: 'Wo sehen Sie aktuell ungenutztes Potenzial oder unklare Prioritäten?'
  },
  {
    key: 'organization',
    title: 'D. Organisation & Kultur',
    description: 'Hier geht es um die organisationale Verankerung von KI.',
    questions: [
      { id: 'q1', text: 'Der Einsatz von KI wird organisationsweit abgestimmt und nicht nur in einzelnen Teams vorangetrieben.' },
      { id: 'q2', text: 'Mitarbeitende verstehen grundsätzlich, warum KI eingeführt wird und was dies für ihre Arbeit bedeutet.' },
      { id: 'q3', text: 'Veränderungen durch KI werden aktiv begleitet und nicht dem Zufall überlassen.' },
    ],
    freetextQuestion: 'Wo erleben Sie aktuell Widerstände, Unsicherheiten oder kulturelle Spannungen?'
  },
  {
    key: 'competencies',
    title: 'E. Kompetenzen & Workforce',
    description: 'Dieser Abschnitt betrachtet Fähigkeiten, Lernen und Befähigung.',
    questions: [
      { id: 'q1', text: 'Wir verfügen über ausreichende Kompetenzen, um KI sinnvoll zu nutzen und weiterzuentwickeln.' },
      { id: 'q2', text: 'Der Aufbau von KI-bezogenen Fähigkeiten ist systematisch geplant und nicht rein individuell.' },
      { id: 'q3', text: 'Führungskräfte fühlen sich befähigt, fundierte Entscheidungen im Kontext von KI zu treffen.' },
    ],
    freetextQuestion: 'Welche Kompetenzen oder Fähigkeiten fehlen aktuell am stärksten?'
  },
  {
    key: 'technology',
    title: 'F. Daten, Technologie & Architektur',
    description: 'Dieser Abschnitt betrachtet die daten- und technologiebezogene Basis.',
    questions: [
      { id: 'q1', text: 'Die Qualität und Verfügbarkeit unserer Daten ermöglicht grundsätzlich den sinnvollen Einsatz von KI.' },
      { id: 'q2', text: 'Unsere IT- und Datenarchitektur ist ausreichend anschlussfähig für KI-Anwendungen.' },
      { id: 'q3', text: 'Technologische Entscheidungen im KI-Kontext werden bewusst und nicht opportunistisch getroffen.' },
    ],
    freetextQuestion: 'Wo sehen Sie aktuell die grössten daten- oder technologiebezogenen Hürden?'
  },
  {
    key: 'governance',
    title: 'G. Governance, Ethik & Sicherheit',
    description: 'Zum Abschluss geht es um Leitplanken, Verantwortung und Vertrauen.',
    questions: [
      { id: 'q1', text: 'Es existieren klare Prinzipien oder Leitlinien für den verantwortungsvollen Einsatz von KI.' },
      { id: 'q2', text: 'Risiken in Bezug auf Datenschutz, Sicherheit und ethische Fragestellungen werden aktiv adressiert.' },
      { id: 'q3', text: 'Wir fühlen uns im Umgang mit regulatorischen Anforderungen im KI-Kontext ausreichend orientiert.' },
    ],
    freetextQuestion: 'Welche offenen Fragen, Bedenken oder Unsicherheiten bestehen hier?'
  },
];