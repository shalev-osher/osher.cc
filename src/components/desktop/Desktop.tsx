import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindows, type AppId } from "./WindowManager";
import DesktopWindow from "./DesktopWindow";
import DesktopDock from "./DesktopDock";
import TerminalApp from "./apps/TerminalApp";
import FinderApp from "./apps/FinderApp";
import CalculatorApp from "./apps/CalculatorApp";
import NotesApp from "./apps/NotesApp";
import SettingsApp from "./apps/SettingsApp";
import HomelabApp from "./apps/HomelabApp";
import SafariApp from "./apps/SafariApp";
import Launchpad from "./Launchpad";
import DesktopContextMenu, { applyStoredWallpaper } from "./DesktopContextMenu";
import MissionControlDesktop from "./MissionControlDesktop";
import StageManager from "./StageManager";
import Widgets from "./Widgets";
import SnapPreview from "./SnapPreview";
import HotCorners from "./HotCorners";
import ForceQuitDialog from "./ForceQuitDialog";
import CmdTabSwitcher from "./CmdTabSwitcher";
import LockScreen from "./LockScreen";
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
  homelab:    { id: "homelab",    title: "Homelab",          app: "Homelab",    defaults: { w: 1040, h: 700 }, dark: true, render: () => <HomelabApp /> },
  terminal:   { id: "terminal",   title: "shalev — zsh",    app: "Terminal",   defaults: { w: 720, h: 440 }, dark: true, render: () => <TerminalApp /> },
  calculator: { id: "calculator", title: "Calculator",       app: "Calculator", defaults: { w: 252, h: 388 }, dark: true, render: () => <CalculatorApp /> },
  notes:      { id: "notes",      title: "Notes",            app: "Notes",      defaults: { w: 820, h: 540 }, dark: true, render: () => <NotesApp /> },
  settings:   { id: "settings",   title: "System Settings",  app: "Settings",   defaults: { w: 720, h: 600 }, dark: true, render: () => <SettingsApp /> },
  safari:     { id: "safari",     title: "Safari",           app: "Safari",     defaults: { w: 1080, h: 700 }, render: () => <SafariApp /> },
};

export const APP_ORDER: AppId[] = ["finder", "safari", "home", "about", "skills", "projects", "homelab", "experience", "education", "contact", "notes", "calculator", "terminal", "settings"];
export const APP_META = APPS;

const Desktop = () => {
  const { state, close, minimize } = useWindows();

  useEffect(() => {
    applyStoredWallpaper();
    const shown = sessionStorage.getItem("osher-os-welcomed");
    if (!shown) {
      sessionStorage.setItem("osher-os-welcomed", "1");
      // Auto-open Welcome window on first visit, centered
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-app", { detail: "home" }));
      }, 500);
      setTimeout(() => {
        toast("F4 Launchpad · F3 Mission Control · ⌘K Spotlight", { duration: 4000 });
      }, 1400);
    }
  }, []);

  // Global window keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (!state.focus) return;
      const k = e.key.toLowerCase();
      // Avoid stomping inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (k === "w") { e.preventDefault(); close(state.focus); }
      else if (k === "m") { e.preventDefault(); minimize(state.focus); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.focus, close, minimize]);

  return (
    <div className="fixed inset-0 overflow-hidden" id="desktop-root">
      {/* Widgets layer */}
      <Widgets />

      {/* Stage Manager strip */}
      <StageManager />

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
      <SnapPreview />
      <Launchpad />
      <MissionControlDesktop />
      <DesktopContextMenu />
      <ForceQuitDialog />
      <HotCorners />
      <CmdTabSwitcher />
      <LockScreen />
    </div>
  );
};

export default Desktop;
