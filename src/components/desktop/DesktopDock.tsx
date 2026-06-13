import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useWindows, type AppId } from "./WindowManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppIcon } from "./AppIcons";
import { LayoutGrid } from "lucide-react";

interface DockApp { id: AppId; label: string; }

const DesktopDock = () => {
  const { open, state, minimize, focus } = useWindows();
  const { lang } = useLanguage();

  const apps: DockApp[] = [
    { id: "finder",     label: "Finder" },
    { id: "safari",     label: "Safari" },
    { id: "about",      label: lang === "he" ? "אודות" : "About" },
    { id: "skills",     label: lang === "he" ? "מיומנויות" : "Skills" },
    { id: "projects",   label: lang === "he" ? "פרויקטים" : "Projects" },
    { id: "homelab",    label: lang === "he" ? "מעבדה" : "Homelab" },
    { id: "experience", label: lang === "he" ? "ניסיון" : "Experience" },
    { id: "education",  label: lang === "he" ? "תעודות" : "Certifications" },
    { id: "contact",    label: "Mail" },
    { id: "notes",      label: lang === "he" ? "פתקים" : "Notes" },
    { id: "calculator", label: lang === "he" ? "מחשבון" : "Calculator" },
    { id: "terminal",   label: "Terminal" },
    { id: "settings",   label: lang === "he" ? "הגדרות" : "Settings" },
  ];
  // Split: portfolio apps vs. system utilities (gives the dock a real separator)
  const utilityIds = new Set<AppId>(["notes", "calculator", "terminal", "settings"]);
  const portfolio = apps.filter((a) => !utilityIds.has(a.id));
  const utilities = apps.filter((a) => utilityIds.has(a.id));

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div dir="ltr" data-dock className="absolute bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-3">
      <motion.nav
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
        className="pointer-events-auto flex items-end gap-1.5 px-2.5 py-1.5 rounded-[22px]
                   border border-white/15 bg-white/10 backdrop-blur-2xl
                   shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]"
        aria-label="Dock"
      >
        <LaunchpadButton mouseX={mouseX} />
        <div className="w-px self-stretch bg-white/15 mx-1" />
        {portfolio.map((a) => (
          <DockIcon
            key={a.id}
            app={a}
            mouseX={mouseX}
            running={!!state.windows[a.id]}
            onActivate={() => {
              const w = state.windows[a.id];
              if (!w) return open(a.id);
              if (w.minimized) return open(a.id);
              if (state.focus === a.id) return minimize(a.id);
              focus(a.id);
            }}
          />
        ))}
        <div className="w-px self-stretch bg-white/15 mx-1" />
        {utilities.map((a) => (
          <DockIcon
            key={a.id}
            app={a}
            mouseX={mouseX}
            running={!!state.windows[a.id]}
            onActivate={() => {
              const w = state.windows[a.id];
              if (!w) return open(a.id);
              if (w.minimized) return open(a.id);
              if (state.focus === a.id) return minimize(a.id);
              focus(a.id);
            }}
          />
        ))}
      </motion.nav>
    </div>
  );
};

const LaunchpadButton = ({ mouseX }: { mouseX: ReturnType<typeof useMotionValue<number | null>> }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (mx) => {
    if (mx === null || !ref.current) return 9999;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(mx - (rect.left + rect.width / 2));
  });
  const sizeRaw = useTransform(distance, [0, 70, 150], [62, 50, 44]);
  const size = useSpring(sizeRaw, { stiffness: 240, damping: 18, mass: 0.4 });
  return (
    <motion.button
      ref={ref}
      onClick={() => window.dispatchEvent(new CustomEvent("toggle-launchpad"))}
      aria-label="Launchpad"
      title="Launchpad"
      style={{ width: size, height: size }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="group relative flex items-end justify-center"
    >
      <motion.div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20
                   backdrop-blur flex items-center justify-center shadow-lg"
      >
        <LayoutGrid className="w-6 h-6 text-white" />
      </motion.div>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 text-white text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap font-medium">
        Launchpad
      </span>
    </motion.button>
  );
};

const DockIcon = ({
  app, mouseX, running, onActivate,
}: { app: DockApp; mouseX: ReturnType<typeof useMotionValue<number | null>>; running: boolean; onActivate: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (mx) => {
    if (mx === null || !ref.current) return 9999;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(mx - (rect.left + rect.width / 2));
  });
  const sizeRaw = useTransform(distance, [0, 70, 150], [62, 50, 44]);
  const size = useSpring(sizeRaw, { stiffness: 240, damping: 18, mass: 0.4 });

  return (
    <motion.button
      ref={ref}
      onClick={onActivate}
      aria-label={app.label}
      title={app.label}
      style={{ width: size, height: size }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="group relative flex items-end justify-center"
    >
      <motion.div style={{ width: size, height: size }}>
        <AppIcon id={app.id} />
      </motion.div>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 text-white text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap font-medium">
        {app.label}
      </span>
      {running && (
        <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_3px_rgba(255,255,255,0.9)]" />
      )}
    </motion.button>
  );
};

export default DesktopDock;
