import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCvDownload } from "@/lib/trackCvDownload";
import MacWindow from "./MacWindow";

const Hero = () => {
  const { t, lang } = useLanguage();

  const roles = [t("hero.role1"), t("hero.role2"), t("hero.role3"), t("hero.role4")];

  const nameText = lang === "he" ? "שליו אושר" : "Shalev Osher";
  const helloText = lang === "he" ? "שלום, אני" : "Hello, I'm";

  const helloTypewriter = useTypewriter({
    text: helloText,
    speed: 80,
    delay: 300,
    loop: true,
    pauseDuration: 3000,
  });

  const nameTypewriter = useTypewriter({
    text: nameText,
    speed: 100,
    delay: 800 + helloText.length * 80 + 200,
    loop: true,
    pauseDuration: 3000,
  });

  const roleTypewriter = useTypewriter({
    texts: roles,
    speed: 80,
    delay: 1200,
    pauseDuration: 2500,
  });

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" aria-label="Hero section">
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight" id="hero-title">
            <motion.span
              className="block text-foreground/80 text-3xl md:text-4xl lg:text-5xl font-light mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {helloTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[0.8em] bg-foreground/60 ms-1 align-middle transition-opacity duration-100 ${helloTypewriter.showCursor && !nameTypewriter.displayedText ? 'opacity-100' : 'opacity-0'}`} />
            </motion.span>
            <motion.span
              className="block text-gradient-warm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {nameTypewriter.displayedText}
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-1 align-middle transition-opacity duration-100 ${nameTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
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
              <span className={`inline-block w-[2px] h-[1em] bg-primary ms-1 align-middle transition-opacity duration-100 ${roleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <MagneticButton>
              <Button variant="hero" size="xl" asChild>
                <a href="#experience">{t("hero.viewExperience")}</a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#contact">{t("hero.getInTouch")}</a>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="heroOutline" size="xl" asChild>
                <a
                  href="/cv/shalev-osher-cv.pdf"
                  download
                  onClick={() => trackCvDownload(lang)}
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  {t("hero.downloadCV")}
                </a>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <MacWindow
              variant="terminal"
              app="zsh"
              title="shalev — -zsh — 80×8"
              bodyClassName="px-4 py-3 font-mono text-[12px] sm:text-[13px] leading-relaxed text-start"
            >
              <div>
                <span className="text-[hsl(140_60%_55%)]">shalev@osher.cc</span>
                <span className="text-[hsl(60_20%_92%)]"> ~ % </span>
                <span>whoami</span>
              </div>
              <div className="text-[hsl(60_20%_92%)]">
                {lang === "he" ? "מהנדס DevOps ותמיכה טכנית" : "DevOps & Tech Support Engineer"}
              </div>
              <div className="mt-1">
                <span className="text-[hsl(140_60%_55%)]">shalev@osher.cc</span>
                <span className="text-[hsl(60_20%_92%)]"> ~ % </span>
                <span>cat skills.txt</span>
              </div>
              <div className="text-[hsl(60_20%_92%)]">
                Linux · AWS · Networking · PRTG · Asterisk · SQL · Bash
              </div>
              <div className="mt-1">
                <span className="text-[hsl(140_60%_55%)]">shalev@osher.cc</span>
                <span className="text-[hsl(60_20%_92%)]"> ~ % </span>
                <span className="inline-block w-2 h-[14px] bg-[hsl(60_20%_92%)] align-middle animate-pulse" />
              </div>
            </MacWindow>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
