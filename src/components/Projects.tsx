import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "פלטפורמת E-Commerce",
    description: "חנות אונליין מתקדמת עם מערכת ניהול מלאי וסליקה מאובטחת",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "bg-gradient-to-br from-primary/20 to-primary/5",
  },
  {
    title: "אפליקציית ניהול משימות",
    description: "כלי לניהול פרויקטים וצוותים עם יכולות שיתוף פעולה בזמן אמת",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "WebSocket"],
    image: "bg-gradient-to-br from-primary/30 to-primary/10",
  },
  {
    title: "דשבורד אנליטיקס",
    description: "מערכת ויזואליזציה של נתונים עם גרפים אינטראקטיביים ודוחות",
    tags: ["React", "D3.js", "Python", "FastAPI"],
    image: "bg-gradient-to-br from-primary/25 to-primary/5",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            הפרויקטים שלי
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            מבחר מהעבודות האחרונות שלי שמציגות את הכישורים והניסיון שצברתי
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group card-elevated overflow-hidden hover:border-primary/50 border border-transparent transition-all duration-500"
            >
              <div className={`aspect-video ${project.image} flex items-center justify-center`}>
                <span className="font-display text-4xl text-primary/50 group-hover:scale-110 transition-transform duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Github className="w-4 h-4" />
                    קוד
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    צפייה
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
