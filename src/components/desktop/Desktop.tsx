import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindows, type AppId } from "./WindowManager";
import DesktopWindow from "./DesktopWindow";
import DesktopIcons from "./DesktopIcons";
import DesktopDock from "./DesktopDock";
import TerminalApp from "./apps/TerminalApp";
import FinderApp from "./apps/FinderApp";
import Launchpad from "./Launchpad";
import DesktopContextMenu, { applyStoredWallpaper } from "./DesktopContextMenu";
import { toast } from "sonner";

const Hero = lazy(() => import("@/components/Hero"));
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));

const Fallback = () => <div className="p-8 text-muted-foreground text-sm">Loading…</div>;

interface AppDef {
  id: AppId;
  title: string;
  app: string;
  defaults: { w: number; h: number };
  dark?: boolean;
  render: () => JSX.Element;
}

const APPS: Record<AppId, AppDef> = {
  home:       { id: "home",       title: "Welcome",         app: "Home",       defaults: { w: 980, h: 640 }, render: () => <Hero /> },
  about:      { id: "about",      title: "About Me",        app: "About",      defaults: { w: 920, h: 640 }, render: () => <About /> },
  skills:     { id: "skills",     title: "Skills",          app: "Skills",     defaults: { w: 960, h: 640 }, render: () => <Skills /> },
  projects:   { id: "projects",   title: "Projects",        app: "Projects",   defaults: { w: 1040, h: 680 }, render: () => <GitHubProjects /> },
  experience: { id: "experience", title: "Experience",      app: "Experience", defaults: { w: 920, h: 640 }, render: () => <Experience /> },
  education:  { id: "education",  title: "Certifications",  app: "Education",  defaults: { w: 920, h: 600 }, render: () => <Education /> },
  contact:    { id: "contact",    title: "Contact",         app: "Mail",       defaults: { w: 760, h: 620 }, render: () => <Contact /> },
  finder:     { id: "finder",     title: "Finder — Portfolio", app: "Finder",  defaults: { w: 760, h: 480 }, render: () => <FinderApp /> },
  terminal:   { id: "terminal",   title: "shalev — zsh",    app: "Terminal",   defaults: { w: 720, h: 440 }, dark: true, render: () => <TerminalApp /> },
};

export const APP_ORDER: AppId[] = ["finder", "home", "about", "skills", "projects", "experience", "education", "contact", "terminal"];
export const APP_META = APPS;

const Desktop = () => {
  const { state } = useWindows();

  useEffect(() => {
    applyStoredWallpaper();
    const shown = sessionStorage.getItem("osher-os-welcomed");
    if (!shown) {
      sessionStorage.setItem("osher-os-welcomed", "1");
      setTimeout(() => {
        toast.success("Welcome to osher.cc OS", {
          description: "Right-click the desktop · F4 Launchpad · ⌘K Spotlight",
          duration: 5000,
        });
      }, 600);
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" id="desktop-root">
      {/* Desktop layer — icons */}
      <DesktopIcons />

      {/* Window layer */}
      <AnimatePresence>
        {state.order.map((id) => {
          const def = APPS[id];
          if (!def) return null;
          return (
            <DesktopWindow key={id} id={id} title={def.title} app={def.app} dark={def.dark}>
              <Suspense fallback={<Fallback />}>
                <div className="min-h-full">{def.render()}</div>
              </Suspense>
            </DesktopWindow>
          );
        })}
      </AnimatePresence>

      {/* Dock */}
      <DesktopDock />

      {/* Overlays */}
      <Launchpad />
      <DesktopContextMenu />
    </div>
  );
};

export default Desktop;
