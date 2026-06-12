import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wifi, Battery, Moon, RotateCcw, Power, ArrowRight, User as UserIcon } from "lucide-react";

/**
 * macOS-style Login Window — wallpaper, centered avatar + name + password,
 * Sleep / Restart / Shut Down at the bottom. Reopenable via "show-lock-screen".
 */
const LockScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [now, setNow] = useState(new Date());
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    const open = () => { setVisible(true); setPassword(""); setTimeout(() => inputRef.current?.focus(), 100); };
    window.addEventListener("show-lock-screen", open);
    onComplete();
    setTimeout(() => inputRef.current?.focus(), 200);
    return () => { clearInterval(id); window.removeEventListener("show-lock-screen", open); };
  }, [onComplete]);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const t = (en: string, he: string) => (lang === "he" ? he : en);

  const login = () => {
    // Any input unlocks; empty triggers shake hint
    if (password.trim().length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Login Window"
        >
          {/* macOS-style desktop wallpaper (original gradient — not Apple artwork) */}
          <div className="absolute inset-0 -z-10" style={{
            background:
              "radial-gradient(140% 100% at 20% 0%, #1f2a5e 0%, #0a0f2a 40%, #050614 75%)",
          }} />
          <div className="absolute inset-0 -z-10 mix-blend-screen opacity-80" style={{
            background:
              "radial-gradient(50% 40% at 80% 25%, rgba(255,120,180,0.45) 0%, transparent 60%)," +
              "radial-gradient(60% 50% at 20% 90%, rgba(80,180,255,0.45) 0%, transparent 65%)," +
              "radial-gradient(40% 30% at 60% 70%, rgba(160,120,255,0.35) 0%, transparent 60%)",
          }} />
          <div className="absolute inset-0 -z-10 opacity-[0.06]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          {/* Top menu bar (login style: just clock + status) */}
          <div className="absolute top-0 inset-x-0 h-7 px-4 flex items-center text-[12px] bg-black/30 backdrop-blur-xl border-b border-white/10">
            <span className="font-semibold">Shalev OS</span>
            <div className="ms-auto flex items-center gap-3 opacity-90">
              <Battery size={16} />
              <Wifi size={13} />
              <span className="tabular-nums">{date}  {time}</span>
            </div>
          </div>

          {/* Centered login card */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-[13px] opacity-80">{date}</div>
              <div className="font-light tabular-nums leading-none mt-1" style={{ fontSize: "clamp(56px, 9vw, 96px)", letterSpacing: "-0.04em" }}>
                {time}
              </div>
            </div>

            {/* Avatar */}
            <div className="mt-2 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-white/30 flex items-center justify-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <UserIcon size={56} className="opacity-90" />
            </div>
            <div className="text-[18px] font-medium">Shalev Osher</div>

            {/* Password field */}
            <form onSubmit={(e) => { e.preventDefault(); login(); }} className="flex items-center gap-2">
              <div className="flex items-center bg-white/15 backdrop-blur-xl rounded-full border border-white/25 ps-4 pe-1 py-1 w-[260px]">
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Enter Password", "הזן סיסמה")}
                  className="flex-1 bg-transparent outline-none text-[13px] placeholder-white/55"
                  aria-label="Password"
                  autoFocus
                />
                <button type="submit" className="w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors" aria-label={t("Log in","כניסה")}>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
            <button type="button" onClick={login} className="text-[11px] opacity-70 hover:opacity-100 underline-offset-4 hover:underline">
              {t("Touch ID or any password to log in", "כל סיסמה תפתח — או לחץ Enter")}
            </button>
          </motion.div>

          {/* Bottom system buttons */}
          <div className="absolute bottom-8 inset-x-0 flex items-center justify-center gap-12 text-[11px]">
            <SystemAction icon={<Moon size={18} />}    label={t("Sleep","שינה")}     onClick={login} />
            <SystemAction icon={<RotateCcw size={18} />} label={t("Restart","הפעלה מחדש")} onClick={login} />
            <SystemAction icon={<Power size={18} />}   label={t("Shut Down","כיבוי")} onClick={login} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SystemAction = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
    <span className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-md border border-white/20 flex items-center justify-center">
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

export default LockScreen;