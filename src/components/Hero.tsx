import { ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";
import Particles from "./Particles";
import CursorGlow from "./CursorGlow";

const roles = [
  "Technical Support Specialist",
  "System Administrator",
  "DevOps Enthusiast",
  "Full Stack Developer",
];

const Hero = () => {
  const roleTypewriter = useTypewriter({
    texts: roles,
    speed: 80,
    delay: 1200,
    pauseDuration: 2500,
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden noise-texture">
      {/* Radial glow from top */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'hsl(var(--primary) / 0.06)' }}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'hsl(var(--primary) / 0.08)' }}
          animate={{ y: [20, -20, 20], x: [10, -10, 10], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'hsl(var(--primary) / 0.04)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <Particles count={40} />

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full opacity-[0.04]" style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--primary)), transparent)' }} />
        <div className="absolute top-0 right-1/3 w-px h-full opacity-[0.03]" style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--primary)), transparent)' }} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-primary font-medium mb-6 tracking-[0.3em] uppercase text-xs"
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Portfolio
          </motion.p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <motion.span
              className="block text-foreground/80 text-3xl md:text-4xl lg:text-5xl font-light mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Hello, I'm
            </motion.span>
            <motion.span
              className="block text-gradient-warm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Shalev Osher
            </motion.span>
          </h1>
          
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light min-h-[2.5rem]">
              <span className="text-primary">{roleTypewriter.displayedText}</span>
              <span className={`inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle transition-opacity duration-100 ${roleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#experience">View Experience</a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="/cv/shalev-osher-cv.pdf" download className="gap-2">
                <Download className="w-5 h-5" />
                Download CV
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-50 glass-effect animate-pulse-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <ArrowDown size={24} />
      </motion.a>
    </section>
  );
};

export default Hero;