import { useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import profilePhoto from "@/assets/profile-photo.jpeg";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const titleTypewriter = useTypewriter({
    text: t("about.title"),
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  const yearsExp = useCountUp({ end: 7, suffix: "+", duration: 1500 });
  const companies = useCountUp({ end: 4, duration: 1200 });
  const certHours = useCountUp({ end: 450, suffix: "+", duration: 2000 });

  const stats = [
    { ref: yearsExp.ref, display: yearsExp.display, label: t("about.yearsExp") },
    { ref: companies.ref, display: companies.display, label: t("about.companies") },
    { ref: certHours.ref, display: certHours.display, label: t("about.certHours") },
  ];

  return (
    <section id="about" className="py-24 relative section-glow" aria-labelledby="about-heading">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slideLeft">
            <div className="relative">
              <motion.div
                className="aspect-square rounded-2xl overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <img 
                  src={profilePhoto} 
                  alt="Shalev Osher - System Administrator and DevOps Engineer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              </motion.div>
              <div className="absolute -bottom-6 -start-6 w-48 h-48 border border-primary/20 rounded-2xl -z-10" aria-hidden="true" />
              <div className="absolute -top-4 -end-4 w-32 h-32 border border-primary/10 rounded-2xl -z-10" aria-hidden="true" />
              <div className="absolute -bottom-3 -end-3 w-24 h-24 rounded-full -z-10 animate-pulse-glow" style={{ background: 'hsl(var(--primary) / 0.05)' }} aria-hidden="true" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="slideRight">
            <div className="space-y-6">
              <h2 id="about-heading" className="font-display text-4xl md:text-5xl font-bold line-decoration">
                <GradientText>{titleTypewriter.displayedText}</GradientText>
                <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mt-8">
                {t("about.p1")}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("about.p2")}
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-8" role="list" aria-label="Key statistics">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-5 card-premium"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    role="listitem"
                  >
                    <span ref={stat.ref as any} className="font-display text-3xl font-bold text-gradient-warm">{stat.display}</span>
                    <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default About;
