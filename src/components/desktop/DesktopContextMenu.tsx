import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Pos { x: number; y: number; }

const WALLPAPERS: { id: string; name: string; bg: string }[] = [
  { id: "gold-dusk",  name: "Gold Dusk",  bg: "radial-gradient(120% 100% at 30% 10%, #2a1f0a 0%, #14100a 45%, #050403 80%)" },
  { id: "midnight",   name: "Midnight",   bg: "radial-gradient(120% 100% at 70% 20%, #0a1530 0%, #060a18 50%, #02030a 85%)" },
  { id: "graphite",   name: "Graphite",   bg: "radial-gradient(120% 100% at 50% 0%, #2a2a2e 0%, #131316 55%, #060608 90%)" },
  { id: "ember",      name: "Ember",      bg: "radial-gradient(120% 100% at 20% 90%, #3a1208 0%, #18080a 55%, #050203 90%)" },
];

const STORAGE_KEY = "osher-os-wallpaper";

export const applyStoredWallpaper = () => {
  if (typeof window === "undefined") return;
  const id = localStorage.getItem(STORAGE_KEY);
  const w = WALLPAPERS.find((x) => x.id === id);
  if (w) document.documentElement.style.setProperty("--os-wallpaper", w.bg);
};

const DesktopContextMenu = () => {
  const [pos, setPos] = useState<Pos | null>(null);
  const [submenu, setSubmenu] = useState(false);
  const { open } = useWindows();
  const { lang } = useLanguage();

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only on the bare desktop / wallpaper area
      if (target.closest("[data-window], [data-dock], [data-menu-bar], button, a, input, textarea")) return;
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 260);
      const y = Math.min(e.clientY, window.innerHeight - 280);
      setPos({ x, y });
      setSubmenu(false);
    };
    const onClick = () => { setPos(null); setSubmenu(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setPos(null); setSubmenu(false); } };
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const setWallpaper = (id: string) => {
    const w = WALLPAPERS.find((x) => x.id === id);
    if (!w) return;
    document.documentElement.style.setProperty("--os-wallpaper", w.bg);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
    toast.success(`${lang === "he" ? "טפט הוחלף" : "Wallpaper"}: ${w.name}`);
    setPos(null);
  };

  const t = (en: string, he: string) => (lang === "he" ? he : en);

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          dir="ltr"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-[280] w-60 py-1.5 rounded-xl border border-white/15
                     bg-[hsl(220_15%_12%/0.9)] backdrop-blur-2xl text-white text-[13px]
                     shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <MenuItem onClick={() => { open("finder"); setPos(null); }}>{t("New Finder Window", "חלון Finder חדש")}</MenuItem>
          <MenuItem onClick={() => { open("terminal"); setPos(null); }}>{t("Open Terminal", "פתח Terminal")}</MenuItem>
          <Divider />
          <MenuItem onClick={() => { window.dispatchEvent(new CustomEvent("toggle-launchpad")); setPos(null); }}>{t("Open Launchpad", "פתח Launchpad")}</MenuItem>
          <MenuItem onClick={() => { window.dispatchEvent(new CustomEvent("open-command-palette")); setPos(null); }}>{t("Spotlight Search…", "חיפוש Spotlight…")}</MenuItem>
          <Divider />
          <div
            className="relative px-3 py-1.5 hover:bg-white/10 cursor-default flex items-center justify-between"
            onMouseEnter={() => setSubmenu(true)}
            onMouseLeave={() => setSubmenu(false)}
          >
            <span>{t("Change Wallpaper", "החלף טפט")}</span>
            <span className="opacity-60">▸</span>
            {submenu && (
              <div className="absolute left-full top-0 ms-1 w-44 py-1.5 rounded-xl border border-white/15
                              bg-[hsl(220_15%_12%/0.95)] backdrop-blur-2xl
                              shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                {WALLPAPERS.map((w) => (
                  <button
                    key={w.id}
                    onClick={(e) => { e.stopPropagation(); setWallpaper(w.id); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-primary/30 flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-md border border-white/20" style={{ background: w.bg }} />
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Divider />
          <MenuItem onClick={() => {
            try { localStorage.removeItem("osher-os-windows-v1"); } catch {}
            toast.message(t("Desktop reset — reloading…", "האיפוס בוצע — טוען מחדש…"));
            setTimeout(() => window.location.reload(), 600);
          }}>{t("Reset Desktop", "אפס שולחן עבודה")}</MenuItem>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MenuItem = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="w-full text-left px-3 py-1.5 hover:bg-primary/30 transition-colors">
    {children}
  </button>
);

const Divider = () => <div className="my-1 mx-2 h-px bg-white/10" />;

export default DesktopContextMenu;