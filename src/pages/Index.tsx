import { lazy, Suspense, useState, useEffect } from "react";
import Hero from "@/components/Hero";
import SkipToContent from "@/components/SkipToContent";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));

const KonamiEasterEgg = lazy(() => import("@/components/KonamiEasterEgg"));
const TelegramChatWidget = lazy(() => import("@/components/TelegramChatWidget"));

const SectionFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

const Index = () => {
  const [deferReady, setDeferReady] = useState(false);

  useEffect(() => {
    const ric = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1200));
    const id = ric(() => setDeferReady(true));
    return () => {
      const cic = (window as any).cancelIdleCallback || clearTimeout;
      cic(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <SkipToContent />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
          <Skills />
          <GitHubProjects />
          <Experience />
          <Education />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      {deferReady && (
        <Suspense fallback={null}>
          <KonamiEasterEgg />
          <TelegramChatWidget />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
