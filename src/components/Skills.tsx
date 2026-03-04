import { Server, Network, Database, Shield, Cloud, Headphones } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion } from "framer-motion";

const skills = [
  { icon: Server, title: "Server Management", description: "Troubleshooting, server monitoring, query execution" },
  { icon: Network, title: "Networking & VoIP", description: "ASTERISK, VoIP, network security, protocols" },
  { icon: Database, title: "Databases", description: "SQL, MongoDB, log analysis with Kibana" },
  { icon: Cloud, title: "Cloud Services", description: "AWS, API Integrations, DevOps" },
  { icon: Shield, title: "Cyber Security", description: "MCSA, Linux, Cyber Security Specialist" },
  { icon: Headphones, title: "Technical Support", description: "Call center management, Jira, SLA, VIP clients" },
];

const Skills = () => {
  const titleTypewriter = useTypewriter({ text: "My Skills", speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: "Technologies and tools I use to solve complex technical challenges", speed: 25, delay: 1000, loop: true, pauseDuration: 5000 });

  return (
    <section id="skills" className="py-24 relative overflow-hidden section-glow">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="blur">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ml-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ml-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <AnimatedSection key={skill.title} delay={index * 0.1} animation="scaleUp">
              <motion.div
                className="group card-premium p-8 h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                  <skill.icon className="w-7 h-7 text-primary transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{skill.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
