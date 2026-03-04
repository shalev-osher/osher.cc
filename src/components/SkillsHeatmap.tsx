import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number; // 1-5
  category: string;
}

const skillsData: Skill[] = [
  // Systems & Infrastructure
  { name: "Linux", level: 5, category: "Systems" },
  { name: "Windows Server", level: 5, category: "Systems" },
  { name: "Active Directory", level: 4, category: "Systems" },
  { name: "VMware", level: 4, category: "Systems" },
  { name: "Docker", level: 3, category: "Systems" },
  // Networking
  { name: "TCP/IP", level: 5, category: "Networking" },
  { name: "VoIP/Asterisk", level: 5, category: "Networking" },
  { name: "DNS", level: 4, category: "Networking" },
  { name: "VPN", level: 4, category: "Networking" },
  { name: "Firewalls", level: 4, category: "Networking" },
  // Cloud & DevOps
  { name: "AWS", level: 4, category: "Cloud" },
  { name: "CI/CD", level: 3, category: "Cloud" },
  { name: "Terraform", level: 3, category: "Cloud" },
  { name: "Kubernetes", level: 3, category: "Cloud" },
  { name: "Git", level: 4, category: "Cloud" },
  // Databases & Monitoring
  { name: "SQL", level: 4, category: "Data" },
  { name: "MongoDB", level: 3, category: "Data" },
  { name: "Kibana", level: 4, category: "Data" },
  { name: "Grafana", level: 3, category: "Data" },
  { name: "Jira", level: 5, category: "Data" },
  // Security
  { name: "Penetration Testing", level: 3, category: "Security" },
  { name: "SIEM", level: 3, category: "Security" },
  { name: "Incident Response", level: 4, category: "Security" },
  { name: "Network Security", level: 4, category: "Security" },
  { name: "MCSA", level: 4, category: "Security" },
];

const categories = ["Systems", "Networking", "Cloud", "Data", "Security"];

const levelColors = [
  "hsl(var(--muted))",
  "hsl(42 75% 55% / 0.2)",
  "hsl(42 75% 55% / 0.4)",
  "hsl(42 75% 55% / 0.6)",
  "hsl(42 75% 55% / 0.8)",
  "hsl(42 75% 55% / 1)",
];

const SkillsHeatmap = () => {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  return (
    <div className="mt-16">
      <AnimatedSection animation="fadeUp">
        <h3 className="font-display text-2xl font-semibold text-center mb-8">
          <GradientText>Skills Proficiency Map</GradientText>
        </h3>
      </AnimatedSection>

      <AnimatedSection animation="scaleUp" delay={0.2}>
        <div className="card-premium p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid gap-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-20 text-right shrink-0">
                  {category}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {skillsData
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <motion.div
                        key={skill.name}
                        className="relative cursor-pointer rounded-md px-3 py-2 text-xs font-medium transition-all"
                        style={{ backgroundColor: levelColors[skill.level] }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onHoverStart={() => setHoveredSkill(skill)}
                        onHoverEnd={() => setHoveredSkill(null)}
                      >
                        <span
                          className={
                            skill.level >= 4 ? "text-primary-foreground" : "text-foreground"
                          }
                        >
                          {skill.name}
                        </span>

                        {hoveredSkill?.name === skill.name && (
                          <motion.div
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border rounded-md px-3 py-1.5 text-xs whitespace-nowrap shadow-lg z-20"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <span className="text-primary font-semibold">{skill.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {"●".repeat(skill.level)}
                              {"○".repeat(5 - skill.level)}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <span>Beginner</span>
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-5 h-5 rounded"
                style={{ backgroundColor: levelColors[level] }}
              />
            ))}
            <span>Expert</span>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default SkillsHeatmap;
