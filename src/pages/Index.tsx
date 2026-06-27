import { useState, useCallback, lazy, Suspense, useEffect, type ComponentType } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import SkipToContent from "@/components/SkipToContent";
import NetworkBackground from "@/components/NetworkBackground";

// Defer heavy below-the-fold sections to shrink the initial bundle.
// Retry on transient "Importing a module script failed" errors (stale chunks).
const lazyWithRetry = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) =>
  lazy(async () => {
    try {
      return await factory();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 250));
      try {
        return await factory();
      } catch (e2) {
        // Force a hard reload once if the module truly cannot be fetched
        if (typeof window !== "undefined" && !sessionStorage.getItem("chunkReload")) {
          sessionStorage.setItem("chunkReload", "1");
          window.location.reload();
        }
        throw e2;
      }
    }
  });

const importExperience = () => import("@/components/Experience");
const importEducation = () => import("@/components/Education");
const importContact = () => import("@/components/Contact");
const importGitHubProjects = () => import("@/components/GitHubProjects");
const importKonami = () => import("@/components/KonamiEasterEgg");
const importSnake = () => import("@/components/SnakeEasterEgg");
const importCommandPalette = () => import("@/components/CommandPalette");

const Experience = lazyWithRetry(importExperience);
const Education = lazyWithRetry(importEducation);
const Contact = lazyWithRetry(importContact);
const GitHubProjects = lazyWithRetry(importGitHubProjects);
const KonamiEasterEgg = lazyWithRetry(importKonami);
const SnakeEasterEgg = lazyWithRetry(importSnake);
const CommandPalette = lazyWithRetry(importCommandPalette);

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  // Warm up lazy chunks during idle time so they're ready by the time
  // the user scrolls to certificates etc.
  useEffect(() => {
    const warm = () => {
      importGitHubProjects();
      importExperience();
      importEducation();
      importContact();
      importCommandPalette();
      importKonami();
      importSnake();
    };
    const w = window as any;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(warm, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(warm, 800);
    return () => clearTimeout(t);
  }, []);

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
