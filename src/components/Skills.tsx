import { Server, Network, Database, Shield, Cloud, Headphones } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

const skills = [
  {
    icon: Server,
    title: "Server Management",
    description: "Troubleshooting, server monitoring, query execution",
  },
  {
    icon: Network,
    title: "Networking & VoIP",
    description: "ASTERISK, VoIP, network security, protocols",
  },
  {
    icon: Database,
    title: "Databases",
    description: "SQL, MongoDB, log analysis with Kibana",
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description: "AWS, API Integrations, DevOps",
  },
  {
    icon: Shield,
    title: "Cyber Security",
    description: "MCSA, Linux, Cyber Security Specialist",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "Call center management, Jira, SLA, VIP clients",
  },
];

const Skills = () => {
  const titleTypewriter = useTypewriter({
    text: "My Skills",
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  const subtitleTypewriter = useTypewriter({
    text: "Technologies and tools I use to solve complex technical challenges",
    speed: 25,
    delay: 1000,
    loop: true,
    pauseDuration: 5000,
  });

  return (
    <section id="skills" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {titleTypewriter.displayedText}
            <span className={`inline-block w-[3px] h-[0.8em] bg-primary ml-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
            {subtitleTypewriter.displayedText}
            <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ml-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
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
