import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTypewriter } from "@/hooks/useTypewriter";
import MagneticButton from "./MagneticButton";
import Particles from "./Particles";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCvDownload } from "@/lib/trackCvDownload";

const Hero = () => {
  const { t, lang } = useLanguage();
  const [cvOpen, setCvOpen] = useState(false);

  const handleDownload = () => {
    trackCvDownload(lang);
    const a = document.createElement("a");
    a.href = "/cv/shalev-osher-cv.pdf";
    a.download = "shalev-osher-cv.pdf";
    a.click();
  };

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
    <section className="min-h-screen pb-40 md:pb-32 flex items-center justify-center relative overflow-hidden noise-texture" aria-label="Hero section">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
      <Particles count={28} />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight" id="hero-title">
            <span className="block text-foreground/80 text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              {helloTypewriter.displayedText}
              <span className={`inline-block w-[2px] h-[0.8em] bg-foreground/60 ms-1 align-middle transition-opacity duration-100 ${helloTypewriter.showCursor && !nameTypewriter.displayedText ? 'opacity-100' : 'opacity-0'}`} />
            </span>
            <span className="block text-gradient">
              {nameTypewriter.displayedText}
              <span className={`inline-block w-[3px] h-[0.8em] bg-primary ms-1 align-middle transition-opacity duration-100 ${nameTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </h1>
          
          <div className="mb-12" />

          <div className="flex items-center justify-center">
            <MagneticButton>
              <Button
                variant="heroOutline"
                size="xl"
                onClick={() => setCvOpen(true)}
                className="min-w-[18rem] sm:min-w-[24rem] text-lg"
              >
                {t("hero.viewCV")}
              </Button>
            </MagneticButton>
          </div>
        </div>
      </div>

      <Dialog open={cvOpen} onOpenChange={setCvOpen}>
        <DialogContent className="max-w-2xl w-[90vw] h-[75vh] p-0 overflow-hidden flex flex-col bg-card border-border/50 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>{t("hero.cvPreview")}</DialogTitle>
          </VisuallyHidden>
          <div className="flex-1 bg-muted/20">
            <iframe
              src="/cv/shalev-osher-cv.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
              title="CV Preview"
              className="w-full h-full"
            />
          </div>
          <div className="px-6 py-3 border-t border-border/50 flex justify-center">
            <Button variant="heroOutline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              {t("hero.downloadPdf")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default Hero;
