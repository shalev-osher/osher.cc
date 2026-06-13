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
import ParallaxBackground from "@/components/ParallaxBackground";
import GitHubProjects from "@/components/GitHubProjects";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import SnakeEasterEgg from "@/components/SnakeEasterEgg";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SkipToContent from "@/components/SkipToContent";
import TelegramChatWidget from "@/components/TelegramChatWidget";
import CommandPalette from "@/components/CommandPalette";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="min-h-screen bg-background relative">
      <SkipToContent />
      <LoadingScreen onComplete={handleLoadComplete} />
      <ParallaxBackground />
      <KonamiEasterEgg />
      <SnakeEasterEgg />
      <ScrollProgressBar />
      <TelegramChatWidget />
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
