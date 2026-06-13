import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { iosIcons, type IosIconKey } from "@/components/ios/iconSet";
import { useLanguage } from "@/contexts/LanguageContext";

const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));
const Hero = lazy(() => import("@/components/Hero"));

type AppKey =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "contact"
  | "home"
  | "safari"
  | "github"
  | "linkedin";

interface AppDef {
  id: AppKey;
  icon: IosIconKey;
  labelEn: string;
  labelHe: string;
  external?: string;
  render?: () => JSX.Element;
}

const APPS: AppDef[] = [
  { id: "home",       icon: "finder",     labelEn: "Welcome",        labelHe: "ברוכים הבאים", render: () => <Hero /> },
  { id: "about",      icon: "about",      labelEn: "About",          labelHe: "אודות",        render: () => <About /> },
  { id: "skills",     icon: "skills",     labelEn: "Skills",         labelHe: "מיומנויות",    render: () => <Skills /> },
  { id: "projects",   icon: "projects",   labelEn: "Projects",       labelHe: "פרויקטים",     render: () => <GitHubProjects /> },
  { id: "experience", icon: "experience", labelEn: "Experience",     labelHe: "ניסיון",       render: () => <Experience /> },
  { id: "education",  icon: "education",  labelEn: "Certifications", labelHe: "תעודות",       render: () => <Education /> },
  { id: "contact",    icon: "mail",       labelEn: "Contact",        labelHe: "צור קשר",      render: () => <Contact /> },
  { id: "safari",     icon: "safari",     labelEn: "osher.cc",       labelHe: "osher.cc",     external: "https://osher.cc" },
  { id: "github",     icon: "github",     labelEn: "GitHub",         labelHe: "GitHub",       external: "https://github.com/mazonhaosher" },
  { id: "linkedin",   icon: "linkedin",   labelEn: "LinkedIn",       labelHe: "LinkedIn",     external: "https://www.linkedin.com/in/shalev-osher/" },
];

const DOCK_IDS: AppKey[] = ["about", "projects", "experience", "contact"];

const StatusBar = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  return (
    <div className="absolute top-0 inset-x-0 h-9 z-40 px-6 flex items-center justify-between text-white text-[13px] font-semibold pointer-events-none select-none">
      <span className="tabular-nums tracking-tight">{hh}:{mm}</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="white"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round"><path d="M1 4.5c4-3.5 10-3.5 14 0"/><path d="M3.5 7c2.6-2.3 6.4-2.3 9 0"/><circle cx="8" cy="10" r="0.9" fill="white" stroke="none"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" fill="none" stroke="white" strokeOpacity="0.6"/><rect x="2" y="2" width="19" height="8" rx="1.4" fill="white"/><rect x="23.2" y="3.6" width="1.8" height="4.8" rx="0.8" fill="white" fillOpacity="0.6"/></svg>
      </div>
    </div>
  );
};

const IconTile = ({ app, onOpen, size = 76 }: { app: AppDef; onOpen: (id: AppKey) => void; size?: number }) => {
  const { lang } = useLanguage();
  const Icon = iosIcons[app.icon];
  const label = lang === "he" ? app.labelHe : app.labelEn;
  return (
    <button
      onClick={() => {
        if (app.external) {
          window.open(app.external, "_blank", "noopener,noreferrer");
        } else {
          onOpen(app.id);
        }
      }}
      className="group flex flex-col items-center gap-1.5 outline-none"
      aria-label={label}
    >
      <motion.div
        layoutId={`app-icon-${app.id}`}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        style={{ width: size, height: size }}
      >
        <Icon />
      </motion.div>
      <span className="text-white text-[13px] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)] max-w-[88px] truncate">
        {label}
      </span>
    </button>
  );
};

const Dock = ({ onOpen }: { onOpen: (id: AppKey) => void }) => {
  const dockApps = DOCK_IDS.map((id) => APPS.find((a) => a.id === id)!).filter(Boolean);
  return (
    <div className="absolute bottom-3 inset-x-0 z-30 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 px-5 py-3 rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]">
        {dockApps.map((a) => {
          const Icon = iosIcons[a.icon];
          return (
            <button
              key={a.id}
              onClick={() => (a.external ? window.open(a.external, "_blank", "noopener,noreferrer") : onOpen(a.id))}
              className="block"
              aria-label={a.labelEn}
            >
              <motion.div whileTap={{ scale: 0.86 }} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 380, damping: 20 }} style={{ width: 60, height: 60 }}>
                <Icon />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PageDots = ({ count, active }: { count: number; active: number }) => (
  <div className="absolute bottom-[110px] inset-x-0 z-20 flex justify-center gap-1.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === active ? "bg-white" : "bg-white/40"}`} />
    ))}
  </div>
);

const AppView = ({ app, onClose }: { app: AppDef; onClose: () => void }) => {
  const { lang } = useLanguage();
  const label = lang === "he" ? app.labelHe : app.labelEn;
  return (
    <motion.div
      key={`app-${app.id}`}
      layoutId={`app-icon-${app.id}`}
      initial={{ borderRadius: 18 }}
      animate={{ borderRadius: 0 }}
      exit={{ borderRadius: 18, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="absolute inset-0 z-30 bg-background overflow-hidden flex flex-col"
    >
      {/* App header */}
      <div className="h-11 shrink-0 flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl border-b border-border/40 z-10">
        <button
          onClick={onClose}
          className="text-sm font-medium text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          {lang === "he" ? "מסך הבית" : "Home"}
        </button>
        <span className="text-sm font-semibold">{label}</span>
        <span className="w-12" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
          {app.render?.()}
        </Suspense>
      </div>
      {/* Home indicator */}
      <button
        onClick={onClose}
        aria-label="Home"
        className="absolute bottom-1.5 inset-x-0 mx-auto h-1.5 w-32 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
      />
    </motion.div>
  );
};

const IPadOS = () => {
  const { lang } = useLanguage();
  const [openId, setOpenId] = useState<AppKey | null>(null);

  const homeApps = useMemo(() => APPS.filter((a) => !DOCK_IDS.includes(a.id)), []);
  const activeApp = openId ? APPS.find((a) => a.id === openId) ?? null : null;

  // Esc to close app
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" dir={lang === "he" ? "rtl" : "ltr"}>
      {/* Wallpaper */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 10%, #3a2810 0%, #1a1208 45%, #050403 85%)," +
            "radial-gradient(60% 50% at 80% 80%, rgba(212,170,80,0.35) 0%, transparent 70%)",
        }}
      />

      <StatusBar />

      {/* Home Screen */}
      <div className="absolute inset-0 pt-16 pb-32 px-10 overflow-hidden">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-y-8 gap-x-4 max-w-3xl mx-auto">
          {homeApps.map((a) => (
            <IconTile key={a.id} app={a} onOpen={setOpenId} />
          ))}
        </div>
      </div>

      <PageDots count={1} active={0} />
      <Dock onOpen={setOpenId} />

      <AnimatePresence>
        {activeApp && <AppView app={activeApp} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default IPadOS;