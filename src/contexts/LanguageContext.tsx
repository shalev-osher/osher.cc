import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "he";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.about": { en: "About", he: "אודות" },
  "nav.skills": { en: "Skills", he: "כישורים" },
  "nav.experience": { en: "Experience", he: "ניסיון" },
  "nav.certifications": { en: "Certifications", he: "הסמכות" },
  "nav.contact": { en: "Contact", he: "צור קשר" },

  // Hero
  "hero.portfolio": { en: "Portfolio", he: "תיק עבודות" },
  "hero.hello": { en: "Hello, I'm", he: "שלום, אני" },
  "hero.viewExperience": { en: "View Experience", he: "צפה בניסיון" },
  "hero.getInTouch": { en: "Get in Touch", he: "צור קשר" },
  "hero.downloadCV": { en: "Download CV", he: "הורד קו\"ח" },
  "hero.role1": { en: "Technical Support Specialist", he: "מומחה תמיכה טכנית" },
  "hero.role2": { en: "System Administrator", he: "מנהל מערכות" },
  "hero.role3": { en: "DevOps Enthusiast", he: "חובב DevOps" },
  "hero.role4": { en: "Full Stack Developer", he: "מפתח Full Stack" },

  // About
  "about.title": { en: "About Me", he: "אודותיי" },
  "about.p1": {
    en: "Experienced Technical Support Specialist with a proven track record of ensuring smooth operation of servers and microservices. Skilled in troubleshooting and resolving technical issues promptly, with extensive networking and system administration expertise.",
    he: "מומחה תמיכה טכנית מנוסה עם רקורד מוכח בהבטחת פעולה חלקה של שרתים ומיקרו-שירותים. בעל מיומנויות בפתרון תקלות טכניות במהירות, עם מומחיות נרחבת ברשתות ובניהול מערכות.",
  },
  "about.p2": {
    en: "Adept at utilizing SQL databases, Kibana, and AWS for log analysis and service recording. Successfully manages a technical department, fostering efficient workflow and effective issue resolution. Demonstrates proficiency in working with internal ticketing systems and adhering to SLA workflows.",
    he: "מיומן בשימוש במסדי נתונים SQL, Kibana ו-AWS לניתוח לוגים ותיעוד שירות. מנהל בהצלחה מחלקה טכנית, מקדם זרימת עבודה יעילה ופתרון בעיות אפקטיבי. מפגין מיומנות בעבודה עם מערכות פנימיות ועמידה בתהליכי SLA.",
  },
  "about.yearsExp": { en: "Years Experience", he: "שנות ניסיון" },
  "about.companies": { en: "Companies", he: "חברות" },
  "about.certHours": { en: "Cert. Hours", he: "שעות הסמכה" },

  // Skills
  "skills.title": { en: "My Skills", he: "הכישורים שלי" },
  "skills.subtitle": {
    en: "Technologies and tools I use to solve complex technical challenges",
    he: "טכנולוגיות וכלים שאני משתמש בהם כדי לפתור אתגרים טכניים מורכבים",
  },
  "skills.serverMgmt": { en: "Server Management", he: "ניהול שרתים" },
  "skills.serverDesc": { en: "Troubleshooting, server monitoring, query execution", he: "פתרון תקלות, ניטור שרתים, הרצת שאילתות" },
  "skills.networking": { en: "Networking & VoIP", he: "רשתות ו-VoIP" },
  "skills.networkDesc": { en: "ASTERISK, VoIP, network security, protocols", he: "ASTERISK, VoIP, אבטחת רשת, פרוטוקולים" },
  "skills.databases": { en: "Databases", he: "מסדי נתונים" },
  "skills.dbDesc": { en: "SQL, MongoDB, log analysis with Kibana", he: "SQL, MongoDB, ניתוח לוגים עם Kibana" },
  "skills.cloud": { en: "Cloud Services", he: "שירותי ענן" },
  "skills.cloudDesc": { en: "AWS, API Integrations, DevOps", he: "AWS, אינטגרציות API, DevOps" },
  "skills.cyber": { en: "Cyber Security", he: "אבטחת סייבר" },
  "skills.cyberDesc": { en: "MCSA, Linux, Cyber Security Specialist", he: "MCSA, Linux, מומחה אבטחת סייבר" },
  "skills.support": { en: "Technical Support", he: "תמיכה טכנית" },
  "skills.supportDesc": { en: "Call center management, Jira, SLA, VIP clients", he: "ניהול מוקד שירות, Jira, SLA, לקוחות VIP" },
  "skills.heatmapTitle": { en: "Skills Proficiency Map", he: "מפת מיומנויות" },
  "skills.beginner": { en: "Beginner", he: "מתחיל" },
  "skills.expert": { en: "Expert", he: "מומחה" },

  // GitHub
  "github.title": { en: "GitHub Projects", he: "פרויקטים ב-GitHub" },
  "github.subtitle": { en: "Open source projects and repositories from my GitHub", he: "פרויקטים וריפוזיטוריות קוד פתוח מה-GitHub שלי" },
  "github.noDesc": { en: "No description available", he: "אין תיאור זמין" },

  // Experience
  "exp.title": { en: "Work Experience", he: "ניסיון תעסוקתי" },
  "exp.subtitle": { en: "My professional journey in technology and technical support", he: "המסע המקצועי שלי בטכנולוגיה ותמיכה טכנית" },

  // Education
  "edu.title": { en: "Education & Certifications", he: "השכלה והסמכות" },
  "edu.subtitle": { en: "Professional training and certifications in cyber security and technology", he: "הכשרות מקצועיות והסמכות באבטחת סייבר וטכנולוגיה" },
  "edu.certifications": { en: "Certifications", he: "הסמכות" },
  "edu.languages": { en: "Languages", he: "שפות" },
  "edu.fluent": { en: "Fluent", he: "שוטף" },
  "edu.native": { en: "Native", he: "שפת אם" },
  "edu.viewCert": { en: "View Certificate", he: "צפה בתעודה" },

  // Contact
  "contact.title": { en: "Let's Connect", he: "בואו נתחבר" },
  "contact.subtitle": {
    en: "Looking for a Technical Support Specialist? I'd love to hear from you",
    he: "מחפשים מומחה תמיכה טכנית? אשמח לשמוע מכם",
  },
  "contact.email": { en: "Email", he: "אימייל" },
  "contact.phone": { en: "Phone", he: "טלפון" },
  "contact.location": { en: "Location", he: "מיקום" },
  "contact.locationVal": { en: "Ashkelon, Israel", he: "אשקלון, ישראל" },
  "contact.fullName": { en: "Full Name", he: "שם מלא" },
  "contact.emailPlaceholder": { en: "Email", he: "אימייל" },
  "contact.messagePlaceholder": { en: "How can I help you?", he: "איך אוכל לעזור?" },
  "contact.send": { en: "Send Message", he: "שלח הודעה" },
  "contact.sending": { en: "Sending...", he: "שולח..." },
  "contact.openTo": {
    en: "I'm open to new opportunities in Technical Support, DevOps, and Cyber Security. If you have a suitable role or project that requires my skills, fill out the form and I'll get back to you promptly.",
    he: "אני פתוח להזדמנויות חדשות בתמיכה טכנית, DevOps ואבטחת סייבר. אם יש לכם תפקיד או פרויקט שמתאים לכישורים שלי, מלאו את הטופס ואחזור אליכם בהקדם.",
  },

  // Footer
  "footer.rights": { en: "© 2026 All rights reserved", he: "© 2026 כל הזכויות שמורות" },

  // Accessibility
  "a11y.title": { en: "Accessibility", he: "נגישות" },
  "a11y.contentAdj": { en: "Content Adjustments", he: "התאמות תוכן" },
  "a11y.visualAdj": { en: "Visual Adjustments", he: "התאמות חזותיות" },
  "a11y.navigation": { en: "Navigation & Orientation", he: "ניווט וכיוון" },
  "a11y.reset": { en: "Reset All Settings", he: "איפוס הגדרות" },
  "a11y.textSize": { en: "Text Size", he: "גודל טקסט" },
  "a11y.lineHeight": { en: "Line Height", he: "גובה שורה" },
  "a11y.highContrast": { en: "High Contrast", he: "ניגודיות גבוהה" },
  "a11y.invertColors": { en: "Invert Colors", he: "היפוך צבעים" },
  "a11y.hideImages": { en: "Hide Images", he: "הסתר תמונות" },
  "a11y.highlightTitles": { en: "Highlight Titles", he: "הדגש כותרות" },
  "a11y.highlightLinks": { en: "Highlight Links", he: "הדגש קישורים" },
  "a11y.largeCursor": { en: "Large Cursor", he: "סמן גדול" },
  "a11y.readingGuide": { en: "Reading Guide", he: "מדריך קריאה" },
  "a11y.focusHighlight": { en: "Focus Highlight", he: "הדגשת מיקוד" },
  "a11y.stopAnimations": { en: "Stop Animations", he: "עצור אנימציות" },
  "a11y.textSpacing": { en: "Text Spacing", he: "ריווח טקסט" },
  "a11y.readableFont": { en: "Readable Font", he: "פונט קריא" },
  "a11y.dyslexia": { en: "Dyslexia Friendly", he: "ידידותי לדיסלקציה" },
  "a11y.saturation": { en: "Saturation", he: "רוויה" },
  "a11y.normal": { en: "Normal", he: "רגיל" },
  "a11y.large": { en: "Large", he: "גדול" },
  "a11y.xLarge": { en: "X-Large", he: "גדול מאוד" },
  "a11y.low": { en: "Low", he: "נמוך" },
  "a11y.grayscale": { en: "Grayscale", he: "גווני אפור" },
  "a11y.extraLarge": { en: "Extra Large", he: "גדול במיוחד" },
  "a11y.default": { en: "Default", he: "ברירת מחדל" },
  "a11y.left": { en: "Left", he: "שמאל" },
  "a11y.center": { en: "Center", he: "מרכז" },
  "a11y.right": { en: "Right", he: "ימין" },
  "a11y.align": { en: "Align", he: "יישור" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("site-lang") as Lang) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("site-lang", l);
  };

  useEffect(() => {
    const dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
