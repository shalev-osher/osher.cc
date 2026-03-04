import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";
import ParallaxBackground from "@/components/ParallaxBackground";
import GitHubProjects from "@/components/GitHubProjects";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="min-h-screen bg-background relative">
      <LoadingScreen onComplete={handleLoadComplete} />
      <ParallaxBackground />
      <KonamiEasterEgg />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <GitHubProjects />
      <Experience />
      <Education />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
