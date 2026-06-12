import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, ChevronUp, Flashlight, Camera } from "lucide-react";

/** iOS-style Lock Screen — replaces boot loader and can be reopened via "show-lock-screen". */
const LockScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [now, setNow] = useState(new Date());
  const { lang } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    const open = () => setVisible(true);
    window.addEventListener("show-lock-screen", open);
    // First mount: auto-complete loader callback right away so site mounts behind
    onComplete();
    return () => { clearInterval(id); window.removeEventListener("show-lock-screen", open); };
  }, [onComplete]);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

  const t = (en: string, he: string) => (lang === "he" ? he : en);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-between py-12 px-6 text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wallpaper */}
          <div className="absolute inset-0 -z-10" style={{
            background: "radial-gradient(120% 80% at 30% 20%, #5b3df0 0%, #2a1aa3 35%, #0a0a1a 75%)",
          }} />
          <div className="absolute inset-0 -z-10 opacity-60" style={{
            background: "radial-gradient(60% 50% at 80% 80%, #ff6ec4 0%, transparent 60%)",
          }} />

          {/* Top status */}
          <div className="w-full flex items-center justify-between text-[12px] font-medium tabular-nums opacity-90">
            <span>{time.split(":")[0]}:{time.split(":")[1]}</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-2 rounded-sm border border-white/70 relative">
                <span className="absolute inset-0.5 bg-white rounded-[1px]" />
              </span>
            </span>
          </div>

          {/* Center: lock + time + date */}
          <div className="flex flex-col items-center gap-2">
            <Lock size={18} className="opacity-90" />
            <div className="text-[15px] font-medium opacity-90">{date}</div>
            <div className="font-light tabular-nums" style={{ fontSize: "clamp(80px, 18vw, 160px)", lineHeight: 1, letterSpacing: "-0.04em" }}>
              {time}
            </div>
          </div>

          {/* Bottom: actions + swipe */}
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center justify-between w-full max-w-[320px]">
              <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center" aria-label="Flashlight">
                <Flashlight size={18} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center" aria-label="Camera">
                <Camera size={18} />
              </button>
            </div>
            <motion.button
              onClick={() => setVisible(false)}
              className="flex flex-col items-center gap-1 opacity-80"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              aria-label={t("Swipe up to unlock","החלק למעלה כדי לפתוח")}
            >
              <ChevronUp size={20} />
              <span className="text-[12px]">{t("Swipe up to open","החלק למעלה לכניסה")}</span>
            </motion.button>
            <div className="h-1 w-32 rounded-full bg-white/70" aria-hidden />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockScreen;