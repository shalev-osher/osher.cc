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
import { WindowManagerProvider } from "@/components/desktop/WindowManager";

const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));

const KonamiEasterEgg = lazy(() => import("@/components/KonamiEasterEgg"));
const SnakeEasterEgg = lazy(() => import("@/components/SnakeEasterEgg"));
const TelegramChatWidget = lazy(() => import("@/components/TelegramChatWidget"));

const SectionFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isDesktop;
};

const Index = () => {
  const [deferReady, setDeferReady] = useState(false);
  useIsDesktop();

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
      <MacMenuBar />
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
