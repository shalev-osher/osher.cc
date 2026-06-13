import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCvDownload } from "@/lib/trackCvDownload";

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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden noise-texture" aria-label="Hero section">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight" id="hero-title">
            <span className="block text-foreground/80 text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              {helloTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[0.8em] bg-foreground/60 ms-1 align-middle transition-opacity duration-100 ${helloTypewriter.showCursor && !nameTypewriter.displayedText ? 'opacity-100' : 'opacity-0'}`} />
            </span>
            <span className="block text-primary">
              {nameTypewriter.displayedText}
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-1 align-middle transition-opacity duration-100 ${nameTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </h1>
          
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light min-h-[2.5rem]">
              <span className="text-primary">{roleTypewriter.displayedText}</span>
              <span className={`inline-block w-[2px] h-[1em] bg-primary ms-1 align-middle transition-opacity duration-100 ${roleTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
