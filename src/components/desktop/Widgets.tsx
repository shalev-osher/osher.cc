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
  const hAng = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
  const mAng = (now.getMinutes() + now.getSeconds() / 60) * 6;
  const sAng = now.getSeconds() * 6;
  const city = lang === "he" ? "תל אביב" : "Tel Aviv";
  return (
    <div className="w-44 h-44 p-3 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] text-white flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        <circle cx="50" cy="50" r="46" fill="#0c1117" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          return (
            <line key={i}
              x1={50 + Math.cos(a) * 38} y1={50 + Math.sin(a) * 38}
              x2={50 + Math.cos(a) * 43} y2={50 + Math.sin(a) * 43}
              stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          );
        })}
        <g transform={`rotate(${hAng} 50 50)`}><line x1="50" y1="50" x2="50" y2="26" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g>
        <g transform={`rotate(${mAng} 50 50)`}><line x1="50" y1="50" x2="50" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></g>
        <g transform={`rotate(${sAng} 50 50)`}><line x1="50" y1="55" x2="50" y2="12" stroke="#ff9f0a" strokeWidth="1" strokeLinecap="round" /></g>
        <circle cx="50" cy="50" r="2.6" fill="#ff9f0a" />
      </svg>
      <div className="text-[10px] text-white/70 mt-1">{city}</div>
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
    <Widget id="calendar" defaultPos={{ x: 24, y: 240 }}><CalendarWidget /></Widget>
    <Widget id="weather" defaultPos={{ x: 24, y: 420 }}><WeatherWidget /></Widget>
    <Widget id="stats" defaultPos={{ x: 220, y: 56 }}><StatsWidget /></Widget>
    <Widget id="links" defaultPos={{ x: 220, y: 200 }}><QuickLinksWidget /></Widget>
  </>
);

export default Widgets;