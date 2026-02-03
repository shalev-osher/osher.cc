import { Code2, Palette, Database, Smartphone, Cloud, GitBranch } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "פיתוח Frontend",
    description: "React, TypeScript, Next.js, Tailwind CSS",
  },
  {
    icon: Database,
    title: "פיתוח Backend",
    description: "Node.js, Python, PostgreSQL, MongoDB",
  },
  {
    icon: Palette,
    title: "עיצוב UI/UX",
    description: "Figma, Adobe XD, עיצוב רספונסיבי",
  },
  {
    icon: Smartphone,
    title: "אפליקציות מובייל",
    description: "React Native, Flutter",
  },
  {
    icon: Cloud,
    title: "ענן ו-DevOps",
    description: "AWS, Docker, Kubernetes, CI/CD",
  },
  {
    icon: GitBranch,
    title: "בקרת גרסאות",
    description: "Git, GitHub, GitLab",
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
            טכנולוגיות וכלים שאני משתמש בהם ליצירת פתרונות דיגיטליים מתקדמים
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
