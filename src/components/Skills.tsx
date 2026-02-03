import { Server, Network, Database, Shield, Cloud, Headphones } from "lucide-react";

const skills = [
  {
    icon: Server,
    title: "ניהול שרתים",
    description: "פתרון בעיות, ניטור שרתים, ביצוע שאילתות",
  },
  {
    icon: Network,
    title: "רשתות ו-VoIP",
    description: "ASTERISK, VoIP, אבטחת רשת, פרוטוקולים",
  },
  {
    icon: Database,
    title: "מסדי נתונים",
    description: "SQL, MongoDB, ניתוח לוגים עם Kibana",
  },
  {
    icon: Cloud,
    title: "שירותי ענן",
    description: "AWS, API Integrations, DevOps",
  },
  {
    icon: Shield,
    title: "אבטחת סייבר",
    description: "MCSA, Linux, Cyber Security Specialist",
  },
  {
    icon: Headphones,
    title: "תמיכה טכנית",
    description: "ניהול מוקד, Jira, SLA, לקוחות VIP",
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            הכישורים שלי
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            טכנולוגיות וכלים שאני משתמש בהם לפתרון בעיות טכניות מורכבות
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.title}
              className="group p-8 card-elevated hover:border-primary/50 border border-transparent transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <skill.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {skill.title}
              </h3>
              <p className="text-muted-foreground">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
