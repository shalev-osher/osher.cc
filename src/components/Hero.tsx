import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
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
            <span className="block text-gradient">Shalev Osher</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light">
            Experienced Technical Support Specialist with a proven track record of ensuring 
            smooth operation of servers and microservices. Skilled in troubleshooting, 
            networking, and system administration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <a href="#experience">View Experience</a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 animate-bounce"
        >
          <ArrowDown size={32} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
