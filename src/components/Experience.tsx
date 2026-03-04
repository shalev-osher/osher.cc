import { Briefcase, Calendar, ChevronDown } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const experiencesData = {
  en: [
    {
      company: "Voicenter", role: "Technical Support Specialist Tier 2", period: "2023 - Present", year: "2023",
      description: [
        "Collaborating closely with Development and DevOps teams using Jira to address issues and enhance workflows",
        "Delivering comprehensive support to VIP and standard clients across the company's suite of products",
        "Working with API integrations (leveraging Kibana), networking, and Amazon Web Services (AWS)",
        "Conducting rigorous QA testing on features and servers as per requests from Development and DevOps teams",
        "Co-developing a troubleshooting tool in collaboration with the Development team",
        "Proactively diagnosing and resolving live issues across a multitude of servers using PRTG",
      ],
    },
    {
      company: "Voicenter", role: "Technical Support Specialist - Strategic Customers", period: "2021 - 2023", year: "2021",
      description: [
        "Provided technical support for telephone systems on the cloud",
        "Wrote guides and presentations, conducted apprenticeships, and administered exercises",
        "Managed the accounts of the largest clients on-site",
        "Worked with ASTERISK, SQL, alongside IT, engineering, and development departments",
      ],
    },
    {
      company: "Voicenter", role: "Technical Support Engineer Tier 1", period: "2021", year: "2021",
      description: [
        "Conducted analysis of current VoIP networks and computer systems",
        "Resolved VoIP network complications through troubleshooting",
        "Evaluated and enhanced network security measures and protocols",
        "Offered initial technical support to clients via calls, emails, or tickets",
      ],
    },
    {
      company: "ILDC", role: "Quality Assurance Tester", period: "2018 - 2021", year: "2018",
      description: [
        "Executed QA tests within Sagemcom LAB for Altice (HOT) company's products",
        "Performed daily quality assurance testing of set-top boxes to ensure adherence to standards",
      ],
    },
    {
      company: "IDF", role: "Military Service", period: "2015 - 2018", year: "2015",
      description: [
        "Performed vehicle treatments and utilized test equipment to ensure optimal functionality",
        "Removed and installed vehicle assemblies in accordance with established procedures",
      ],
    },
  ],
  he: [
    {
      company: "Voicenter", role: "מומחה תמיכה טכנית שכבה 2", period: "2023 - היום", year: "2023",
      description: [
        "שיתוף פעולה צמוד עם צוותי פיתוח ו-DevOps באמצעות Jira לטיפול בבעיות ושיפור תהליכי עבודה",
        "מתן תמיכה מקיפה ללקוחות VIP ולקוחות רגילים במגוון מוצרי החברה",
        "עבודה עם אינטגרציות API (בשימוש Kibana), רשתות ו-Amazon Web Services (AWS)",
        "ביצוע בדיקות QA קפדניות על פיצ'רים ושרתים לפי בקשות צוותי פיתוח ו-DevOps",
        "פיתוח משותף של כלי לפתרון תקלות בשיתוף עם צוות הפיתוח",
        "אבחון וטיפול פרואקטיבי בתקלות חיות במגוון שרתים באמצעות PRTG",
      ],
    },
    {
      company: "Voicenter", role: "מומחה תמיכה טכנית - לקוחות אסטרטגיים", period: "2021 - 2023", year: "2021",
      description: [
        "מתן תמיכה טכנית למערכות טלפוניה בענן",
        "כתיבת מדריכים ומצגות, הנחיית חניכים וניהול תרגולים",
        "ניהול חשבונות הלקוחות הגדולים ביותר באתר",
        "עבודה עם ASTERISK, SQL, לצד מחלקות IT, הנדסה ופיתוח",
      ],
    },
    {
      company: "Voicenter", role: "מהנדס תמיכה טכנית שכבה 1", period: "2021", year: "2021",
      description: [
        "ביצוע ניתוח של רשתות VoIP ומערכות מחשוב קיימות",
        "פתרון תקלות ברשתות VoIP באמצעות troubleshooting",
        "הערכה ושיפור אמצעי אבטחת רשת ופרוטוקולים",
        "מתן תמיכה טכנית ראשונית ללקוחות דרך שיחות, מיילים או פניות",
      ],
    },
    {
      company: "ILDC", role: "בודק אבטחת איכות", period: "2018 - 2021", year: "2018",
      description: [
        "ביצוע בדיקות QA במעבדת Sagemcom עבור מוצרי חברת Altice (HOT)",
        "ביצוע בדיקות אבטחת איכות יומיות של ממירים להבטחת עמידה בסטנדרטים",
      ],
    },
    {
      company: "צה\"ל", role: "שירות צבאי", period: "2015 - 2018", year: "2015",
      description: [
        "ביצוע טיפולים ברכבים ושימוש בציוד בדיקה להבטחת תפקוד מיטבי",
        "הסרה והתקנה של מכלולי רכב בהתאם לנהלים מבוססים",
      ],
    },
  ],
};

const Experience = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const { t, lang } = useLanguage();
  const experiences = experiencesData[lang];

  const titleTypewriter = useTypewriter({ text: t("exp.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("exp.subtitle"), speed: 25, delay: 1200, loop: true, pauseDuration: 5000 });

  return (
    <section id="experience" className="py-24 section-glow relative overflow-hidden" aria-labelledby="experience-heading">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--gradient-radial)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="fadeDown">
          <div className="text-center mb-20">
            <h2 id="experience-heading" className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ms-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="relative" role="list" aria-label="Work experience timeline">
            <div className="absolute start-[28px] md:start-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] timeline-line" aria-hidden="true" />

            <div className="space-y-0">
              {experiences.map((exp, index) => {
                const isExpanded = expandedIndex === index;
                const isEven = index % 2 === 0;

                return (
                  <AnimatedSection key={`${exp.company}-${exp.role}`} delay={index * 0.1} animation={isEven ? "slideLeft" : "slideRight"}>
                    <div className={`relative flex items-start gap-8 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`} role="listitem">
                      <div className="md:hidden flex-shrink-0 relative z-10">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold font-display transition-all duration-500 ${
                            isExpanded ? 'bg-primary text-primary-foreground timeline-dot-active' : 'bg-card border-2 border-primary/30 text-primary timeline-dot'
                          }`}
                          aria-expanded={isExpanded}
                          aria-label={`${exp.role} at ${exp.company}, ${exp.period}`}
                        >
                          {exp.year}
                        </button>
                      </div>

                      <div className={`flex-1 md:w-[calc(50%-40px)] ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                        <motion.div
                          className={`card-premium p-6 cursor-pointer ${isExpanded ? 'border-primary/30' : ''}`}
                          onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                          layout
                          role="button"
                          tabIndex={0}
                          aria-expanded={isExpanded}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setExpandedIndex(isExpanded ? -1 : index);
                            }
                          }}
                        >
                          <div className={`flex flex-wrap items-start justify-between gap-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <div className={isEven ? 'md:text-right' : ''}>
                              <h3 className="font-display text-lg font-semibold text-foreground">{exp.role}</h3>
                              <div className={`flex items-center gap-2 text-primary mt-1 ${isEven ? 'md:justify-end' : ''}`}>
                                <Briefcase className="w-4 h-4" aria-hidden="true" />
                                <span className="font-medium text-sm">{exp.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <Calendar className="w-3 h-3" aria-hidden="true" />
                              <span>{exp.period}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                className={`space-y-2 mt-4 pt-4 border-t border-border/50 ${isEven ? 'md:text-left' : ''}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {exp.description.map((item, i) => (
                                  <motion.li
                                    key={i}
                                    className="text-muted-foreground text-sm flex gap-2"
                                    initial={{ opacity: 0, x: isEven ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                  >
                                    <span className="text-primary flex-shrink-0" aria-hidden="true">▸</span>
                                    {item}
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold font-display transition-all duration-500 ${
                            isExpanded ? 'bg-primary text-primary-foreground timeline-dot-active scale-110' : 'bg-card border-2 border-primary/30 text-primary hover:border-primary hover:scale-105 timeline-dot'
                          }`}
                          aria-expanded={isExpanded}
                          aria-label={`${exp.role} at ${exp.company}, ${exp.period}`}
                        >
                          {exp.year}
                        </button>
                      </div>

                      <div className="hidden md:block md:w-[calc(50%-40px)]" />
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
