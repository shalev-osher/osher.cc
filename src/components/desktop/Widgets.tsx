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

const CalendarWidget = () => {
  const { lang } = useLanguage();
  const now = new Date();
  const month = now.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "long" });
  const weekday = now.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { weekday: "long" }).toUpperCase();
  return (
    <div className="w-44 rounded-3xl overflow-hidden border border-white/15 bg-white/[0.08] backdrop-blur-2xl
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] text-white">
      <div className="bg-[#ff453a] text-white text-center py-1 text-[11px] uppercase tracking-wider font-semibold">
        {weekday}
      </div>
      <div className="bg-white text-[#1a1a1f] flex flex-col items-center py-3">
        <div className="text-[10px] uppercase tracking-wider text-[#ff453a] font-semibold">{month}</div>
        <div className="text-6xl font-light leading-none tabular-nums mt-1">{now.getDate()}</div>
      </div>
    </div>
  );
};

const WeatherWidget = () => {
  const { lang } = useLanguage();
  // Mock — looks live, no external API
  const temp = 24;
  const cond = lang === "he" ? "בהיר" : "Mostly Clear";
  return (
    <div className="w-44 rounded-3xl border border-white/15 backdrop-blur-2xl text-white p-4
                    shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)]
                    bg-gradient-to-br from-[#3a8dde] via-[#1f63b8] to-[#0e3a73]">
      <div className="text-[11px] uppercase tracking-wider opacity-80">{lang === "he" ? "תל אביב" : "Tel Aviv"}</div>
      <div className="text-5xl font-light tabular-nums mt-1">{temp}°</div>
      <div className="text-[12px] opacity-90 mt-0.5">{cond}</div>
      <div className="flex items-center justify-between mt-2 text-[11px] opacity-90">
        <span>H:28°</span><span>L:19°</span>
      </div>
      {/* Sun arc */}
      <svg viewBox="0 0 100 30" className="w-full h-7 mt-2 opacity-80">
        <path d="M5 28 Q 50 -10 95 28" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" strokeDasharray="2 3" />
        <circle cx="60" cy="12" r="4" fill="#ffd96a" />
      </svg>
    </div>
  );
};

const Widgets = () => (
  <>
    {/* macOS Sonoma-style right-side widget rail */}
    <Widget id="clock"    defaultPos={{ x: window.innerWidth - 200, y: 56 }}><ClockWidget /></Widget>
    <Widget id="weather"  defaultPos={{ x: window.innerWidth - 200, y: 240 }}><WeatherWidget /></Widget>
    <Widget id="calendar" defaultPos={{ x: window.innerWidth - 200, y: 430 }}><CalendarWidget /></Widget>
    <Widget id="stats"    defaultPos={{ x: window.innerWidth - 400, y: 56 }}><StatsWidget /></Widget>
    <Widget id="links"    defaultPos={{ x: window.innerWidth - 400, y: 220 }}><QuickLinksWidget /></Widget>
  </>
);

export default Widgets;