import { useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import SkipToContent from "@/components/SkipToContent";
import NetworkBackground from "@/components/NetworkBackground";

// Defer heavy below-the-fold sections to shrink the initial bundle
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const KonamiEasterEgg = lazy(() => import("@/components/KonamiEasterEgg"));
const SnakeEasterEgg = lazy(() => import("@/components/SnakeEasterEgg"));
const CommandPalette = lazy(() => import("@/components/CommandPalette"));

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <div className="min-h-screen relative pb-32">
      <SkipToContent />
      <NetworkBackground />
      <LoadingScreen onComplete={handleLoadComplete} />
      <Suspense fallback={null}>
        <KonamiEasterEgg />
        <SnakeEasterEgg />
        <CommandPalette />
      </Suspense>
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Skills />
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <GitHubProjects />
          <Experience />
          <Education />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
