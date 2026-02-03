import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    company: "Voicenter",
    role: "Technical Support Specialist Tier 2",
    period: "2023 - הווה",
    description: [
      "שיתוף פעולה עם צוותי Development ו-DevOps באמצעות Jira",
      "מתן תמיכה מקיפה ללקוחות VIP וסטנדרטיים",
      "עבודה עם API Integrations, Kibana ו-AWS",
      "ביצוע בדיקות QA מקיפות לפי דרישות הפיתוח",
      "פיתוח כלי troubleshooting בשיתוף עם צוות הפיתוח",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Specialist - Strategic Customers",
    period: "2021 - 2023",
    description: [
      "תמיכה טכנית במערכות טלפוניה בענן",
      "כתיבת מדריכים והדרכות לעובדים",
      "ניהול חשבונות הלקוחות הגדולים ביותר",
      "עבודה עם ASTERISK, SQL והנדסה",
    ],
  },
  {
    company: "Voicenter",
    role: "Technical Support Engineer Tier 1",
    period: "2021",
    description: [
      "ניתוח רשתות VoIP ומערכות מחשב",
      "פתרון בעיות ברשתות VoIP",
      "הערכה ושיפור אבטחת רשת",
      "מתן תמיכה טכנית ראשונית ללקוחות",
    ],
  },
  {
    company: "ILDC",
    role: "Quality Assurance Tester",
    period: "2018 - 2021",
    description: [
      "ביצוע בדיקות QA במעבדת Sagemcom עבור Altice (HOT)",
      "בדיקות יומיות של ממירי טלוויזיה",
    ],
  },
  {
    company: "צה\"ל",
    role: "שירות צבאי",
    period: "2015 - 2018",
    description: [
      "ביצוע טיפולים ברכבים ושימוש בציוד בדיקה",
      "התקנה והסרה של מכלולי רכב",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            ניסיון תעסוקתי
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            המסע המקצועי שלי בעולם הטכנולוגיה והתמיכה הטכנית
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={`${exp.company}-${exp.role}`}
                  className="relative md:pr-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute right-4 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background hidden md:block" />

                  <div className="card-elevated p-6 hover:border-primary/50 border border-transparent transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-primary mt-1">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-muted-foreground text-sm flex gap-2">
                          <span className="text-primary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
