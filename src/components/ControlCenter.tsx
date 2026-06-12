import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Bluetooth, Plane, Moon, Music2, Sun, Volume2, Lock, Bell, ScreenShare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/** iOS-style Control Center sheet — opens from the top-end of the menu bar. */
const ControlCenter = () => {
  const [open, setOpen] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);
  const [wifi, setWifi] = useState(true);
  const [bt, setBt] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [dnd, setDnd] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);
    window.addEventListener("toggle-control-center", toggle);
    window.addEventListener("close-control-center", close);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("toggle-control-center", toggle);
      window.removeEventListener("close-control-center", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const t = (en: string, he: string) => (lang === "he" ? he : en);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[220]"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          />
          <motion.div
            dir="ltr"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed top-9 right-3 z-[230] w-[340px] p-3 rounded-3xl
                       bg-[hsl(220_15%_12%/0.72)] backdrop-blur-2xl border border-white/15
                       shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] text-white"
            role="dialog" aria-label="Control Center"
          >
            <div className="grid grid-cols-4 gap-2">
              {/* Connectivity cluster */}
              <div className="col-span-2 row-span-2 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
                <Pill icon={<Wifi size={16} />} label="Wi-Fi" active={wifi} sub="Shalev-5G" onClick={() => setWifi(v => !v)} accent="#3b82f6" />
                <Pill icon={<Bluetooth size={16} />} label="Bluetooth" active={bt} sub={t("On", "מופעל")} onClick={() => setBt(v => !v)} accent="#3b82f6" />
                <Pill icon={<Plane size={16} />} label={t("Airplane", "טיסה")} active={airplane} sub={airplane ? t("On","מופעל") : t("Off","כבוי")} onClick={() => setAirplane(v => !v)} accent="#ff9500" />
                <Pill icon={<ScreenShare size={16} />} label="AirDrop" active sub={t("Everyone","לכולם")} accent="#3b82f6" />
              </div>

              {/* Music tile */}
              <div className="col-span-2 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center"><Music2 size={16} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium truncate">{t("Now Playing","מתנגן עכשיו")}</div>
                  <div className="text-[10px] text-white/60 truncate">Shalev · Portfolio Mix</div>
                </div>
              </div>

              {/* DND + Lock */}
              <SquareTile icon={<Moon size={18} />} label={t("Focus","פוקוס")} active={dnd} onClick={() => setDnd(v => !v)} accent="#7e57ff" />
              <SquareTile icon={<Lock size={18} />} label={t("Lock","נעילה")} onClick={() => window.dispatchEvent(new CustomEvent("show-lock-screen"))} accent="#8e8e93" />

              {/* Brightness */}
              <div className="col-span-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Sun size={16} />
                  <Slider value={brightness} onChange={setBrightness} />
                </div>
                <div className="text-[10px] text-white/55 mt-1">{t("Brightness","בהירות")}</div>
              </div>

              {/* Volume */}
              <div className="col-span-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Volume2 size={16} />
                  <Slider value={volume} onChange={setVolume} />
                </div>
                <div className="text-[10px] text-white/55 mt-1">{t("Sound","עוצמה")}</div>
              </div>

              <SquareTile icon={<Bell size={18} />} label={t("Notify","התראות")} onClick={() => window.dispatchEvent(new CustomEvent("toggle-notification-center"))} accent="#ff3b30" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Pill = ({ icon, label, sub, active, onClick, accent }: any) => (
  <button onClick={onClick} className="flex items-center gap-2 text-left">
    <span className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
      style={{ background: active ? accent : "rgba(255,255,255,0.12)" }}>
      {icon}
    </span>
    <span className="flex flex-col leading-tight">
      <span className="text-[11px] font-medium">{label}</span>
      <span className="text-[9px] text-white/55">{sub}</span>
    </span>
  </button>
);

const SquareTile = ({ icon, label, active, onClick, accent }: any) => (
  <button onClick={onClick}
    className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors">
    <span className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: active ? accent : "rgba(255,255,255,0.12)" }}>{icon}</span>
    <span className="text-[10px] text-white/80">{label}</span>
  </button>
);

const Slider = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex-1 h-7 rounded-full bg-white/10 overflow-hidden relative cursor-pointer"
    onClick={(e) => {
      const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      onChange(Math.round(((e.clientX - r.left) / r.width) * 100));
    }}>
    <div className="absolute inset-y-0 left-0 bg-white/90" style={{ width: `${value}%` }} />
  </div>
);

export default ControlCenter;