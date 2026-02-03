import { ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";

const Hero = () => {
  const nameTypewriter = useTypewriter({
    text: "Shalev Osher",
    speed: 100,
    loop: true,
    pauseDuration: 3000,
  });

  const descriptionTypewriter = useTypewriter({
    text: "Experienced Technical Support Specialist with a proven track record of ensuring smooth operation of servers and microservices. Skilled in troubleshooting, networking, and system administration.",
    speed: 30,
    delay: 1500,
    loop: true,
    pauseDuration: 4000,
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-up">
          <p className="text-primary font-medium mb-4 tracking-widest uppercase text-sm">
            Technical Support Specialist
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Hello, I'm
            <span className="block text-gradient">
              {nameTypewriter.displayedText}
              <span className={`inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-middle transition-opacity duration-100 ${nameTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light min-h-[4.5rem] md:min-h-[3.5rem]">
            {descriptionTypewriter.displayedText}
            <span className={`inline-block w-[2px] h-[1em] bg-muted-foreground ml-1 align-middle transition-opacity duration-100 ${descriptionTypewriter.showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <ArrowDown size={24} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
