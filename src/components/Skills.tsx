import { Server, Network, Database, Shield, Cloud, Headphones } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import SkillsHeatmap from "@/components/SkillsHeatmap";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";

const SkillCard3D = ({ skill, index }: { skill: { icon: any; title: string; description: string }; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(x, [-100, 100], [0, 100]);
  const glowY = useTransform(y, [-100, 100], [0, 100]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <AnimatedSection key={skill.title} delay={index * 0.1} animation="scaleUp">
      <motion.div
        className="group p-8 h-full relative overflow-hidden rounded-xl border border-border/30 backdrop-blur-md"
        style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d", background: "hsl(var(--card) / 0.4)" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="listitem"
      >
        {/* Dynamic glow overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, hsl(var(--primary) / 0.12) 0%, transparent 60%)`
            ),
          }}
        />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)]" aria-hidden="true">
            <skill.icon className="w-7 h-7 text-primary transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-3">{skill.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

const Skills = () => {
  const { t } = useLanguage();

  const skills = [
    { icon: Server, title: t("skills.serverMgmt"), description: t("skills.serverDesc") },
    { icon: Network, title: t("skills.networking"), description: t("skills.networkDesc") },
    { icon: Database, title: t("skills.databases"), description: t("skills.dbDesc") },
    { icon: Cloud, title: t("skills.cloud"), description: t("skills.cloudDesc") },
    { icon: Shield, title: t("skills.cyber"), description: t("skills.cyberDesc") },
    { icon: Headphones, title: t("skills.support"), description: t("skills.supportDesc") },
  ];

  const titleTypewriter = useTypewriter({ text: t("skills.title"), speed: 80, loop: true, pauseDuration: 5000 });
  const subtitleTypewriter = useTypewriter({ text: t("skills.subtitle"), speed: 25, delay: 1000, loop: true, pauseDuration: 5000 });

  return (
    <section id="skills" className="py-24 relative overflow-hidden section-glow" aria-labelledby="skills-heading">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection animation="blur">
          <div className="text-center mb-16">
            <h2 id="skills-heading" className="font-display text-4xl md:text-5xl font-bold mb-4">
              <GradientText>{titleTypewriter.displayedText}</GradientText>
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto min-h-[1.75rem]">
              {subtitleTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ms-1 align-middle transition-opacity duration-100 ${subtitleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Skills">
          {skills.map((skill, index) => (
            <SkillCard3D key={skill.title} skill={skill} index={index} />
          ))}
        </div>

        <SkillsHeatmap />
      </div>
    </section>
  );
};

export default Skills;
