import { useRef, useCallback } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import GradientText from "@/components/GradientText";
import ScrollRevealText from "@/components/ScrollRevealText";
import profilePhoto from "@/assets/profile-photo.jpeg";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileTilt = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [12, -12]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-12, 12]), { stiffness: 200, damping: 25 });
  const glowX = useTransform(x, [-150, 150], [0, 100]);
  const glowY = useTransform(y, [-150, 150], [0, 100]);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <div className="relative">
      <motion.div
        className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer"
        style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
      >
        <img
          src={profilePhoto}
          alt="Shalev Osher - System Administrator and DevOps Engineer"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`
            ),
          }}
        />
      </motion.div>
      <div className="absolute -bottom-6 -start-6 w-48 h-48 border border-primary/20 rounded-2xl -z-10" aria-hidden="true" />
      <div className="absolute -top-4 -end-4 w-32 h-32 border border-primary/10 rounded-2xl -z-10" aria-hidden="true" />
      <div className="absolute -bottom-3 -end-3 w-24 h-24 rounded-full -z-10 animate-pulse-glow" style={{ background: 'hsl(var(--primary) / 0.05)' }} aria-hidden="true" />
    </div>
  );
};

const About = () => {
  const { t } = useLanguage();

  const titleTypewriter = useTypewriter({
    text: t("about.title"),
    speed: 80,
    loop: true,
    pauseDuration: 5000,
  });

  const p1Typewriter = useTypewriter({
    text: t("about.p1"),
    speed: 20,
    delay: 500,
    loop: true,
    pauseDuration: 4000,
  });

  const p2Typewriter = useTypewriter({
    text: t("about.p2"),
    speed: 20,
    delay: 500 + t("about.p1").length * 20 + 1000,
    loop: true,
    pauseDuration: 4000,
  });

  const yearsExp = useCountUp({ end: 7, suffix: "+", duration: 1500 });
  const companies = useCountUp({ end: 4, duration: 1200 });
  const certHours = useCountUp({ end: 450, suffix: "+", duration: 2000 });

  const label1Tw = useTypewriter({ text: t("about.yearsExp"), speed: 50, loop: true, pauseDuration: 4000 });
  const label2Tw = useTypewriter({ text: t("about.companies"), speed: 50, delay: 300, loop: true, pauseDuration: 4000 });
  const label3Tw = useTypewriter({ text: t("about.certHours"), speed: 50, delay: 600, loop: true, pauseDuration: 4000 });

  const stats = [
    { ref: yearsExp.ref, display: yearsExp.display, isComplete: yearsExp.isComplete, labelTw: label1Tw },
    { ref: companies.ref, display: companies.display, isComplete: companies.isComplete, labelTw: label2Tw },
    { ref: certHours.ref, display: certHours.display, isComplete: certHours.isComplete, labelTw: label3Tw },
  ];

  return (
    <section id="about" className="py-24 relative section-glow" aria-labelledby="about-heading">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slideLeft">
            <ProfileTilt />
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="slideRight">
            <div className="space-y-6">
              <h2 id="about-heading" className="font-display text-4xl md:text-5xl font-bold line-decoration">
                <GradientText>{titleTypewriter.displayedText}</GradientText>
                <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-2 align-middle transition-opacity duration-100 ${titleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mt-8 min-h-[6rem]">
                {p1Typewriter.displayedText}
                <span className={`inline-block w-[2px] h-[1em] bg-primary ms-1 align-middle transition-opacity duration-100 ${p1Typewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed min-h-[6rem]">
                {p2Typewriter.displayedText}
                <span className={`inline-block w-[2px] h-[1em] bg-primary ms-1 align-middle transition-opacity duration-100 ${p2Typewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-8" role="list" aria-label="Key statistics">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-5 card-premium relative overflow-hidden"
                    whileHover={{ y: -6, scale: 1.03 }}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                    role="listitem"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={stat.isComplete ? { opacity: [0, 0.3, 0] } : {}}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ background: "hsl(var(--primary) / 0.15)" }}
                    />
                    <motion.span
                      ref={stat.ref as any}
                      className="font-display text-3xl font-bold text-gradient-warm relative z-10 inline-block"
                      animate={stat.isComplete ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {stat.display}
                    </motion.span>
                    <p className="text-muted-foreground text-sm mt-2 relative z-10">{stat.label}</p>
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
