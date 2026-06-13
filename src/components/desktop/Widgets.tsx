import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Pos { x: number; y: number; }
const STORAGE = "osher-os-widgets-v1";

const load = (): Record<string, Pos> => {
  try { return JSON.parse(localStorage.getItem(STORAGE) || "{}"); } catch { return {}; }
};
const save = (p: Record<string, Pos>) => {
  try { localStorage.setItem(STORAGE, JSON.stringify(p)); } catch {}
};

const Widget = ({ id, defaultPos, children }: { id: string; defaultPos: Pos; children: React.ReactNode }) => {
  const [positions, setPositions] = useState<Record<string, Pos>>(() => load());
  const pos = positions[id] ?? defaultPos;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={false}
      animate={{ x: pos.x, y: pos.y }}
      onDragEnd={(_, info) => {
        const next = { x: pos.x + info.offset.x, y: pos.y + info.offset.y };
        const merged = { ...positions, [id]: next };
        setPositions(merged); save(merged);
      }}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      className="absolute z-20 cursor-grab select-none"
    >
      {children}
    </motion.div>
  );
};

const ClockWidget = () => {
  const [now, setNow] = useState(new Date());
  const { lang } = useLanguage();
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "long", month: "short", day: "numeric" });
  return (
    <div className="w-44 p-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] text-white">
      <div className="text-[11px] text-white/70 uppercase tracking-wider">{date}</div>
      <div className="text-4xl font-light tabular-nums tracking-tight mt-1">{time}</div>
    </div>
  );
};

const StatsWidget = () => {
  const { lang } = useLanguage();
  const stats = [
    { value: "6+", label: lang === "he" ? "שנות ניסיון" : "Years XP" },
    { value: "12", label: lang === "he" ? "תעודות" : "Certs" },
    { value: "30+", label: lang === "he" ? "פרויקטים" : "Projects" },
  ];
  return (
    <div className="w-44 p-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] text-white">
      <div className="text-[11px] text-white/70 uppercase tracking-wider mb-2">
        {lang === "he" ? "סטטיסטיקה" : "At a glance"}
      </div>
      <div className="space-y-1.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between">
            <span className="text-xl font-display font-semibold text-primary">{s.value}</span>
            <span className="text-[11px] text-white/70">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickLinksWidget = () => {
  const { lang } = useLanguage();
  const links = [
    { label: "GitHub", url: "https://github.com/Shalev-osher" },
    { label: "LinkedIn", url: "https://linkedin.com/in/shalev-osher/" },
    { label: "Email", url: "mailto:shalev@osher.cc" },
  ];
  return (
    <div className="w-44 p-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] text-white">
      <div className="text-[11px] text-white/70 uppercase tracking-wider mb-2">
        {lang === "he" ? "קישורים" : "Quick Links"}
      </div>
      <div className="flex flex-col gap-1.5">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            className="text-sm hover:text-primary transition-colors"
          >
            {l.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
};

const Widgets = () => (
  <>
    <Widget id="clock" defaultPos={{ x: 24, y: 56 }}><ClockWidget /></Widget>
    <Widget id="stats" defaultPos={{ x: 24, y: 200 }}><StatsWidget /></Widget>
    <Widget id="links" defaultPos={{ x: 24, y: 360 }}><QuickLinksWidget /></Widget>
  </>
);

export default Widgets;