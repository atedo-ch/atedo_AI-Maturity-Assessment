import React, { useState, useMemo, useEffect } from 'react';
import { SurveyData, LikertValue, DimensionData } from './types';
import { SECTIONS, COMPANY_SIZES, ROLES, INDUSTRIES } from './constants';
import LikertScale from './components/LikertScale';

// Initial State Configuration
const INITIAL_DIMENSION: DimensionData = {
  q1: LikertValue.UNSELECTED,
  q2: LikertValue.UNSELECTED,
  q3: LikertValue.UNSELECTED,
  comments: '',
};

const INITIAL_STATE: SurveyData = {
  context: {
    companySize: '',
    role: '',
    industry: '',
    industryOther: '',
  },
  strategy: { ...INITIAL_DIMENSION },
  useCases: { ...INITIAL_DIMENSION },
  organization: { ...INITIAL_DIMENSION },
  competencies: { ...INITIAL_DIMENSION },
  technology: { ...INITIAL_DIMENSION },
  governance: { ...INITIAL_DIMENSION },
  contact: {
    email: '',
  },
};

// Updated to the PNG version and converted to correct Raw URL format
const LOGO_URL = "https://raw.githubusercontent.com/atedo-ch/ai-maturity-tool/logoset/atedo_Logo_kosmos_RGB.png";

// --- Helper for Progress Calculation ---
const calculateProgress = (data: SurveyData): number => {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  // Context (3 fields)
  totalQuestions += 3;
  if (data.context.companySize) answeredQuestions++;
  if (data.context.role) answeredQuestions++;
  if (data.context.industry) {
      answeredQuestions++;
      // Handle conditional other logic for progress if strictness needed, but keep simple for now
  }

  // Likert Sections (6 sections * 3 questions)
  const sections: (keyof SurveyData)[] = ['strategy', 'useCases', 'organization', 'competencies', 'technology', 'governance'];
  sections.forEach(key => {
    const dim = data[key] as DimensionData;
    totalQuestions += 3;
    if (dim.q1 !== LikertValue.UNSELECTED) answeredQuestions++;
    if (dim.q2 !== LikertValue.UNSELECTED) answeredQuestions++;
    if (dim.q3 !== LikertValue.UNSELECTED) answeredQuestions++;
  });

  // Contact (1 field)
  totalQuestions += 1;
  if (data.contact.email) answeredQuestions++;

  return Math.round((answeredQuestions / totalQuestions) * 100);
};

// --- UI Components ---

const AtedoButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  variant?: 'light' | 'dark' | 'orange' | 'outline-white';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'light', className = '', disabled = false }) => {
  
  // Removed rounded-lg
  const baseStyles = "group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyles = "";
  switch (variant) {
    case 'light':
      // Changed from bg-white to bg-atedo-gray
      variantStyles = "bg-atedo-gray text-atedo-dark hover:shadow-lg hover:-translate-y-0.5";
      break;
    case 'dark':
      variantStyles = "bg-atedo-dark text-white shadow-lg hover:shadow-xl hover:bg-[#1f3d61] hover:-translate-y-0.5";
      break;
    case 'orange':
      variantStyles = "bg-atedo-orange text-white shadow-lg shadow-atedo-orange/30 hover:shadow-xl hover:shadow-atedo-orange/40 hover:bg-[#ff7a5c] hover:-translate-y-0.5";
      break;
    case 'outline-white':
      variantStyles = "bg-transparent border border-white/30 text-white hover:bg-white/10";
      break;
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variantStyles} ${className}`}>
      <span>{children}</span>
      {/* Replaced text arrow with thicker SVG arrow, removed rounded-full */}
      <span className={`flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:translate-x-1`}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
         </svg>
      </span>
    </button>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold italic text-atedo-dark mb-3 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 text-lg font-light leading-relaxed">{subtitle}</p>}
        {/* Removed rounded-full */}
        <div className="w-12 h-1 bg-atedo-orange mt-6 opacity-80"></div>
    </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<SurveyData>(INITIAL_STATE);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(calculateProgress(data));
  }, [data]);

  // --- Handlers ---

  const startAssessment = () => {
    setShowAssessment(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateContext = (field: keyof typeof INITIAL_STATE.context, value: string) => {
    setData((prev) => ({
      ...prev,
      context: { ...prev.context, [field]: value },
    }));
  };

  const updateDimension = (
    section: keyof SurveyData,
    field: keyof DimensionData,
    value: LikertValue | string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as DimensionData),
        [field]: value,
      },
    }));
  };

  const updateContact = (value: string) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, email: value },
    }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    console.log('--- SURVEY SUBMISSION ---', JSON.stringify(data, null, 2));
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Validation ---

  const isValid = useMemo(() => {
    if (!data.context.companySize || !data.context.role || !data.context.industry) return false;
    // Check if industry is "other" and if so, check if industryOther is filled
    if (data.context.industry === 'other' && !data.context.industryOther.trim()) return false;
    
    const dimensions: (keyof SurveyData)[] = ['strategy', 'useCases', 'organization', 'competencies', 'technology', 'governance'];
    for (const key of dimensions) {
      const section = data[key] as DimensionData;
      if (section.q1 === 0 || section.q2 === 0 || section.q3 === 0) return false;
    }
    if (!data.contact.email.trim() || !data.contact.email.includes('@')) return false;
    return true;
  }, [data]);


  // --- Views ---

  // 1. Success View
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-atedo-gray-bg px-6 animate-fade-in-up">
        {/* Card: bg-atedo-gray, removed rounded-2xl */}
        <div className="max-w-xl w-full bg-atedo-gray shadow-soft p-12 text-center border border-slate-200">
          {/* Removed rounded-full */}
          <div className="w-20 h-20 bg-atedo-orange/10 text-atedo-orange flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold italic text-atedo-dark mb-4">Vielen Dank.</h2>
          <p className="text-slate-600 mb-10 leading-relaxed text-lg">
            Ihre Daten wurden sicher übermittelt. Ihr persönlicher KI-Reifegrad-Report wird erstellt und Ihnen in Kürze per E-Mail zugesendet.
          </p>
          <AtedoButton onClick={() => window.location.reload()} variant="dark">
            Zurück zur Startseite
          </AtedoButton>
        </div>
      </div>
    );
  }

  // 2. Landing Page
  if (!showAssessment) {
    return (
      // Changed main background to atedo-dark so cards float on dark blue
      <div className="min-h-screen bg-atedo-dark selection:bg-atedo-orange selection:text-white">
        {/* Navigation */}
        <header className="absolute top-0 left-0 w-full z-50 py-8">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
            <img 
              src={LOGO_URL}
              alt="atedo" 
              className="h-10 w-auto brightness-0 invert" 
            />
            <nav className="hidden md:flex gap-10 text-sm font-medium opacity-90 tracking-wide">
                {['Services', 'Cases', 'Über uns', 'Insights'].map((item) => (
                    <a key={item} href="#" className="hover:text-atedo-orange-light transition-colors relative group">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-atedo-orange-light transition-all group-hover:w-full"></span>
                    </a>
                ))}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        {/* Increased bottom padding to pb-72 to create more space and push the white box down */}
        <section className="bg-atedo-hero text-white min-h-[90vh] flex items-center relative overflow-hidden pt-20 pb-72">
          {/* Removed rounded-full */}
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-white/5 translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              {/* Removed rounded-full */}
              {/* Added mt-32 to create spacing above the badge */}
              {/* Changed styling: removed uppercase, added italic, adjusted tracking */}
              {/* Removed border and border-white/20 as requested */}
              <div className="inline-block px-3 py-1 text-xs font-bold italic tracking-wider mb-6 bg-white/5 backdrop-blur-sm mt-32">
                KI-Maturitäts-Analyse
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold italic leading-[1.1] mb-16">
                Klarheit über den tatsächlichen <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-atedo-orange-light to-white">KI-Reifegrad Ihrer Organisation.</span>
              </h1>
              {/* Updated paragraph margin to mb-16 as requested */}
              <p className="text-lg text-white/80 leading-relaxed mb-16 max-w-lg font-light">
                Künstliche Intelligenz verändert Wertschöpfung, Entscheidungsfindung und Arbeitsweisen grundlegend. 
                Die atedo KI-Maturitäts-Analyse schafft Orientierung jenseits von Hype und Buzzwords.
              </p>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-sm font-medium text-white/70">
                   {/* Removed rounded-full */}
                   <span className="w-1.5 h-1.5 bg-atedo-orange"></span>
                   <span>Dauer der Analyse: ca. 10–15 Minuten</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                    {/* Changed variant to orange as requested for "Analyse starten" */}
                    <AtedoButton onClick={startAssessment} variant="orange">
                    Analyse starten
                    </AtedoButton>
                    <AtedoButton onClick={() => {}} variant="outline-white">
                    Mehr erfahren
                    </AtedoButton>
                </div>
              </div>

            </div>
            {/* Visual Abstract - Removed rounded-full from all divs */}
            <div className="hidden lg:flex justify-center items-center h-full relative">
                <div className="w-[500px] h-[500px] border border-white/10 flex items-center justify-center relative animate-spin-slow" style={{animationDuration: '60s'}}>
                    <div className="absolute w-4 h-4 bg-white/40 top-0 left-1/2 -translate-x-1/2"></div>
                    <div className="w-[350px] h-[350px] border border-white/20 flex items-center justify-center">
                        <div className="w-[200px] h-[200px] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md flex items-center justify-center">
                             <span className="text-white/30 font-serif font-bold text-2xl">AI</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Floating Box */}
        <section className="relative z-20 px-6 -mt-24 mb-24">
          {/* Removed rounded-3xl */}
          <div className="max-w-7xl mx-auto bg-atedo-gray p-8 md:p-16 shadow-xl border border-white/50">
             <div className="grid lg:grid-cols-2 gap-16">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold italic text-atedo-dark mb-8">
                     Warum viele KI-Initiativen nicht die erwartete Wirkung entfalten
                   </h2>
                   <p className="text-lg text-slate-600 leading-relaxed mb-8">
                     In der Praxis scheitern KI-Vorhaben selten an der Technologie. 
                     Sie scheitern an fehlender strategischer Einbettung, unklarer Verantwortung, 
                     kulturellen Spannungen oder unrealistischen Erwartungen.
                   </p>
                   <p className="text-lg text-slate-600 leading-relaxed font-medium">
                     Ohne eine ehrliche Standortbestimmung entsteht Aktionismus statt Fortschritt.
                   </p>
                </div>
                {/* Inner card: atedo-gray-bg, removed rounded-2xl */}
                <div className="bg-atedo-gray-bg p-10 border border-gray-200">
                    <h3 className="text-xl font-bold italic text-atedo-dark mb-6">Typische Muster</h3>
                    <ul className="space-y-4">
                        {[
                            "KI wird als Tool-Thema behandelt, nicht als Führungs- und Organisationsthema",
                            "Einzelne Use Cases werden umgesetzt, ohne Gesamtbild und Zielarchitektur",
                            "Mitarbeitende sind verunsichert oder nicht ausreichend befähigt",
                            "Governance, Ethik und Sicherheit werden zu spät adressiert"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                {/* Removed rounded-full */}
                                <span className="flex-shrink-0 w-6 h-6 bg-atedo-dark/10 flex items-center justify-center text-atedo-dark text-xs mt-0.5">✕</span>
                                <span className="text-slate-700 leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
          </div>
        </section>

        {/* Approach Section - Dark Blue */}
        <section className="bg-atedo-dark py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <span className="text-atedo-orange text-sm font-bold uppercase tracking-wider mb-4 block">Unser Ansatz</span>
              <h2 className="text-3xl lg:text-5xl font-bold italic text-white mb-6">
                KI als organisationsweites Betriebssystem denken
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                atedo betrachtet KI nicht als isolierte Technologie, sondern als Betriebssystem für Organisationen.
                Reife entsteht nicht durch einzelne Anwendungen, sondern durch das Zusammenspiel mehrerer Dimensionen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                    title: "Hybrid Intelligence",
                    desc: "KI ergänzt menschliche Fähigkeiten, sie ersetzt sie nicht.",
                },
                {
                    title: "Führung vor Technologie",
                    desc: "Strategische Klarheit ist Voraussetzung für Wirkung.",
                },
                {
                    title: "Evolution statt Big Bang",
                    desc: "Nachhaltige Integration erfolgt schrittweise.",
                },
                {
                    title: "Mensch im Zentrum",
                    desc: "Akzeptanz, Kompetenzen und Kultur sind entscheidend.",
                }
              ].map((card, idx) => (
                // Removed rounded-2xl
                <div key={idx} className="bg-[#213b5c] p-8 md:p-10 border-t-4 border-white/10 hover:border-atedo-orange transition-colors duration-300">
                    <h3 className="text-xl md:text-2xl font-bold italic text-white mb-4">
                        {card.title}
                    </h3>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        {card.desc}
                    </p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
                 <p className="text-slate-400 italic">
                    Die Analyse verbindet quantitative Einschätzungen mit qualitativer Reflexion und ordnet die Ergebnisse in einen realistischen organisatorischen Kontext ein.
                 </p>
            </div>
          </div>
        </section>

        {/* Benefits & Output Section - Box Container */}
        <section className="px-6 py-24">
            {/* Removed rounded-3xl */}
            <div className="max-w-7xl mx-auto bg-atedo-gray p-8 md:p-16 shadow-soft border border-gray-200">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Benefits */}
                    <div>
                        <h2 className="text-3xl font-bold italic text-atedo-dark mb-8">Klarheit, Orientierung und Entscheidungsreife</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold italic text-lg mb-4 flex items-center gap-2">
                                    <span className="text-atedo-orange">✓</span> Was die Analyse leistet
                                </h3>
                                <ul className="space-y-3 text-slate-600">
                                    {/* Removed rounded-full */}
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 bg-slate-300 mt-2"></span>Strukturierte Standortbestimmung Ihres KI-Reifegrads</li>
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 bg-slate-300 mt-2"></span>Einordnung entlang zentraler Dimensionen (Führung, Wertschöpfung, Org, etc.)</li>
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 bg-slate-300 mt-2"></span>Identifikation von Spannungsfeldern und Risiken</li>
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 bg-slate-300 mt-2"></span>Fundierte Grundlage für strategische Entscheidungen</li>
                                </ul>
                            </div>
                            
                            <div className="pt-8 border-t border-gray-200">
                                <h3 className="font-bold italic text-lg mb-4 flex items-center gap-2 text-slate-400">
                                    <span>✕</span> Was die Analyse bewusst nicht ist
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {["Kein Tool-Vergleich", "Keine Technologie-Empfehlung", "Kein Ersatz für persönliche Beratung"].map(tag => (
                                        // Removed rounded-full
                                        <span key={tag} className="px-3 py-1 bg-atedo-gray-bg text-slate-500 text-sm">{tag}</span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-slate-500">
                                    Sie standardisiert Diagnose und Vorarbeit – die Entscheidung bleibt bei Ihnen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Report Preview Card */}
                    <div className="relative">
                        {/* Removed rounded-3xl */}
                        <div className="absolute inset-0 bg-atedo-orange/5 transform rotate-3"></div>
                        {/* Removed rounded-3xl */}
                        <div className="relative bg-atedo-dark text-white p-10 md:p-12 shadow-xl h-full flex flex-col justify-between">
                            <div>
                                {/* Removed rounded-xl */}
                                <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold italic mb-4">Ihr persönlicher <br/>KI-Maturitäts-Report</h3>
                                <p className="text-slate-300 mb-8 leading-relaxed">
                                    Auf Basis Ihrer Angaben erhalten Sie einen strukturierten Ergebnisreport. Er ist so aufbereitet, dass er als Entscheidungsgrundlage auf Geschäftsleitungs- oder Verwaltungsratsebene genutzt werden kann.
                                </p>
                                <ul className="space-y-4 mb-8">
                                     {["Transparenter KI-Reifegrad", "Zentrale Handlungsfelder", "Strategische Fragestellungen", "Orientierung für 12–36 Monate"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                            <span className="w-4 h-[1px] bg-atedo-orange"></span> {item}
                                        </li>
                                     ))}
                                </ul>
                            </div>
                            <AtedoButton onClick={startAssessment} variant="orange" className="w-full">
                                Report anfordern
                            </AtedoButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Logos / Trust - Dark Blue */}
        <section className="bg-atedo-dark py-24 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold italic text-white mb-16">
              Technologische Exzellenz durch starke Partner
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
               {['Microsoft', 'OpenAI', 'Google Cloud', 'Anthropic'].map(brand => (
                   <span key={brand} className="text-2xl md:text-3xl font-bold text-white">{brand}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Footer - Solid dark #193250 */}
        <footer className="bg-atedo-dark pt-12 pb-12 text-center text-white/80 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-6 mb-24">
                <blockquote className="text-2xl md:text-4xl font-sans font-bold italic leading-tight text-white mb-12 opacity-90">
                    &bdquo;Diese Analyse hilft nicht dabei, mehr KI zu machen, sondern bessere Entscheidungen über KI zu treffen.&rdquo;
                </blockquote>
                
                {/* Removed rounded-2xl */}
                <div className="bg-[#213b5c] p-8 inline-block w-full max-w-2xl border border-white/5">
                    <h2 className="text-xl font-bold italic text-white mb-6">Starten Sie die KI-Maturitäts-Analyse</h2>
                    <p className="text-slate-300 text-sm mb-8 max-w-md mx-auto">
                        Dauer: ca. 10–15 Minuten. Strukturierte Fragen, keine technischen Vorkenntnisse erforderlich.
                    </p>
                    <AtedoButton onClick={startAssessment} variant="orange">
                        Analyse starten
                    </AtedoButton>
                     <p className="mt-8 text-xs text-slate-500">
                        Hinweis: Zur Zustellung des Ergebnisreports wird am Ende eine E-Mail-Adresse benötigt.
                    </p>
                </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 text-xs text-white/50">
                <p>&copy; {new Date().getFullYear()} atedo AG. Alle Rechte vorbehalten.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Impressum</a>
                    <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
                </div>
            </div>
        </footer>
      </div>
    );
  }

  // 3. Assessment View
  return (
    <div className="min-h-screen bg-atedo-gray-bg font-sans text-atedo-dark">
      {/* Sticky Header: bg-atedo-gray/90 */}
      <header className="sticky top-0 z-40 bg-atedo-gray/90 backdrop-blur-md border-b border-gray-200 transition-all">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <img 
                    src={LOGO_URL}
                    alt="atedo" 
                    className="h-8 w-auto" 
                 />
                 <div className="h-6 w-[1px] bg-gray-300 hidden sm:block"></div>
                 <span className="text-sm font-medium text-slate-500 hidden sm:block">Maturity Assessment</span>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-xs font-bold text-atedo-orange">{progress}%</div>
                {/* Removed rounded-full */}
                <div className="w-24 sm:w-48 h-2 bg-gray-200 overflow-hidden">
                    <div 
                        className="h-full bg-atedo-orange transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 pb-32 animate-fade-in-up">
        
        {/* Intro */}
        <div className="mb-12">
            <button 
                onClick={() => setShowAssessment(false)} 
                className="text-sm text-slate-400 hover:text-atedo-dark mb-4 flex items-center gap-2 transition-colors font-semibold"
            >
                ← Zurück
            </button>
            <h1 className="text-4xl font-bold italic mb-4 text-atedo-dark">KI-Maturitäts-Assessment</h1>
            <p className="text-lg text-slate-500 leading-relaxed font-light">
                Dieses Assessment dient der strukturierten Erfassung Ihrer Einschätzungen zur aktuellen Position Ihrer Organisation im Kontext von Künstlicher Intelligenz. 
                Es richtet sich an Führungskräfte und Entscheidungsträger und bildet die Grundlage für eine differenzierte Standortbestimmung.
            </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-16">
            
            {/* Section A: Context - Card: bg-atedo-gray, removed rounded-2xl */}
            <div className="bg-atedo-gray p-8 md:p-12 shadow-soft border border-gray-200">
                <SectionHeader title="A. Organisationskontext" subtitle="Damit wir Ihre Ergebnisse im Branchenvergleich einordnen können." />
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="group">
                        <label className="block text-sm font-bold text-atedo-dark mb-2 group-focus-within:text-atedo-orange transition-colors">Grösse der Organisation</label>
                        {/* Removed rounded-lg */}
                        <select 
                            className="w-full bg-atedo-gray-bg border-transparent px-4 py-4 text-atedo-dark font-medium focus:bg-atedo-gray focus:ring-2 focus:ring-atedo-orange/20 focus:border-atedo-orange transition-all outline-none appearance-none"
                            value={data.context.companySize}
                            onChange={(e) => updateContext('companySize', e.target.value)}
                        >
                            <option value="" disabled>Bitte wählen...</option>
                            {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-atedo-dark mb-2 group-focus-within:text-atedo-orange transition-colors">Ihre Rolle</label>
                        {/* Removed rounded-lg */}
                        <select 
                            className="w-full bg-atedo-gray-bg border-transparent px-4 py-4 text-atedo-dark font-medium focus:bg-atedo-gray focus:ring-2 focus:ring-atedo-orange/20 focus:border-atedo-orange transition-all outline-none appearance-none"
                            value={data.context.role}
                            onChange={(e) => updateContext('role', e.target.value)}
                        >
                            <option value="" disabled>Bitte wählen...</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
                <div className="group">
                    <label className="block text-sm font-bold text-atedo-dark mb-2 group-focus-within:text-atedo-orange transition-colors">Branche</label>
                    {/* Removed rounded-lg */}
                    <select 
                        className="w-full bg-atedo-gray-bg border-transparent px-4 py-4 text-atedo-dark font-medium focus:bg-atedo-gray focus:ring-2 focus:ring-atedo-orange/20 focus:border-atedo-orange transition-all outline-none appearance-none"
                        value={data.context.industry}
                        onChange={(e) => updateContext('industry', e.target.value)}
                    >
                        <option value="" disabled>Bitte wählen...</option>
                        {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                    </select>
                </div>
                
                {data.context.industry === 'other' && (
                  <div className="group mt-8 animate-fade-in-up">
                    <label className="block text-sm font-bold text-atedo-dark mb-2 group-focus-within:text-atedo-orange transition-colors">Bitte beschreiben Sie Ihre Branche kurz</label>
                    {/* Removed rounded-lg */}
                    <textarea 
                        className="w-full bg-atedo-gray-bg border-transparent p-4 text-atedo-dark font-medium focus:bg-atedo-gray focus:ring-2 focus:ring-atedo-orange/20 focus:border-atedo-orange transition-all outline-none resize-y"
                        rows={3}
                        value={data.context.industryOther}
                        onChange={(e) => updateContext('industryOther', e.target.value)}
                    />
                  </div>
                )}
            </div>

            {/* Dynamic Sections - Card: bg-atedo-gray, removed rounded-2xl */}
            {SECTIONS.map((sectionConfig) => {
              const sectionData = data[sectionConfig.key] as DimensionData;
              return (
                <div key={sectionConfig.key} className="bg-atedo-gray p-8 md:p-12 shadow-soft border border-gray-200 transition-shadow hover:shadow-soft-hover">
                   <SectionHeader title={sectionConfig.title} subtitle={sectionConfig.description} />
                   
                   <div className="space-y-4">
                     {sectionConfig.questions?.map((q) => (
                       <LikertScale
                         key={q.id}
                         questionText={q.text}
                         value={sectionData[q.id]}
                         onChange={(val) => updateDimension(sectionConfig.key, q.id, val)}
                       />
                     ))}
                   </div>
                   
                   <div className="mt-12 pt-8 border-t border-gray-100">
                      <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                          {sectionConfig.freetextQuestion || "Ergänzungen (Optional)"}
                      </label>
                      {/* Removed rounded-lg */}
                      <textarea
                        className="w-full bg-atedo-gray-bg border-transparent p-4 text-atedo-dark focus:bg-atedo-gray focus:ring-2 focus:ring-atedo-orange/20 focus:border-atedo-orange transition-all outline-none min-h-[100px] resize-y"
                        value={sectionData.comments}
                        onChange={(e) => updateDimension(sectionConfig.key, 'comments', e.target.value)}
                      />
                   </div>
                </div>
              );
            })}

            {/* Contact Section, removed rounded-2xl */}
            <div className="bg-atedo-dark text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold italic mb-4">Kontakt</h2>
                    
                    <div className="mb-10">
                        <label className="block text-sm font-bold text-slate-300 mb-2">E-Mail-Adresse *</label>
                        {/* Removed rounded-lg */}
                        <input 
                          type="email" 
                          placeholder="name@company.com"
                          className="w-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder-slate-400 focus:bg-white/20 focus:border-atedo-orange focus:ring-1 focus:ring-atedo-orange transition-all outline-none"
                          value={data.contact.email}
                          onChange={(e) => updateContact(e.target.value)}
                        />
                         <p className="mt-2 text-sm text-slate-400 font-light italic">
                           Die E-Mail-Adresse wird verwendet, um den Ergebnisreport bereitzustellen.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        {!isValid && (
                             <span className="text-atedo-orange text-sm font-medium animate-pulse">
                                Bitte füllen Sie alle Pflichtfelder aus.
                             </span>
                        )}
                        <div className={!isValid ? 'sm:ml-auto' : 'w-full flex justify-end'}>
                            <AtedoButton 
                                onClick={handleSubmit} 
                                variant="orange" 
                                disabled={!isValid}
                                className="w-full sm:w-auto"
                            >
                                Assessment abschliessen
                            </AtedoButton>
                        </div>
                    </div>
                </div>
                {/* Decoration, removed rounded-none as it's a blur blob, but prompt said "edges and corners", blobs don't have edges. 
                    Wait, if I remove rounded-full from a div, it becomes square. 
                    Strict interpretation: make everything square. */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-atedo-orange blur-[100px] opacity-20 pointer-events-none"></div>
            </div>

        </form>
      </main>
    </div>
  );
};

export default App;