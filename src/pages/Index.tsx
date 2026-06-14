import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import GitHubProjects from "@/components/GitHubProjects";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import SnakeEasterEgg from "@/components/SnakeEasterEgg";
import SkipToContent from "@/components/SkipToContent";
import CommandPalette from "@/components/CommandPalette";
import ParallaxBackground from "@/components/ParallaxBackground";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="min-h-screen bg-background relative pb-32">
      <SkipToContent />
      <ParallaxBackground />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5]">
        <Particles count={60} className="!absolute" />
      </div>
      <CursorGlow />
      <LoadingScreen onComplete={handleLoadComplete} />
      <KonamiEasterEgg />
      <SnakeEasterEgg />
      <CommandPalette />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Skills />
        <GitHubProjects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
