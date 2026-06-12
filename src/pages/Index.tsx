import { lazy, Suspense, useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ParallaxBackground from "@/components/ParallaxBackground";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SkipToContent from "@/components/SkipToContent";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import MissionControl from "@/components/MissionControl";
import MacDock from "@/components/MacDock";
import MacMenuBar from "@/components/MacMenuBar";
import ControlCenter from "@/components/ControlCenter";
import NotificationCenter from "@/components/NotificationCenter";

// Below-the-fold sections — split into separate chunks
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));

// Non-critical widgets — defer until the browser is idle
const KonamiEasterEgg = lazy(() => import("@/components/KonamiEasterEgg"));
const SnakeEasterEgg = lazy(() => import("@/components/SnakeEasterEgg"));
const TelegramChatWidget = lazy(() => import("@/components/TelegramChatWidget"));

const SectionFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

const Index = () => {
  const [deferReady, setDeferReady] = useState(false);

  // Mount non-critical widgets after first paint to keep LCP/INP fast
  useEffect(() => {
    const ric =
      (window as any).requestIdleCallback ||
      ((cb: () => void) => setTimeout(cb, 1200));
    const id = ric(() => setDeferReady(true));
    return () => {
      const cic = (window as any).cancelIdleCallback || clearTimeout;
      cic(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <SkipToContent />
      <MacMenuBar />
      <ParallaxBackground />
      <ScrollProgressBar />
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
      <CommandPalette />
      <MissionControl />
      <MacDock />
      <ControlCenter />
      <NotificationCenter />
      {deferReady && (
        <Suspense fallback={null}>
          <KonamiEasterEgg />
          <SnakeEasterEgg />
          <TelegramChatWidget />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
