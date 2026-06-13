import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock } from "lucide-react";

const LockScreen = () => {
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(new Date());
  const { lang } = useLanguage();

  useEffect(() => {
    const onLock = () => setLocked(true);
    window.addEventListener("lock-screen", onLock);
    return () => window.removeEventListener("lock-screen", onLock);
  }, []);

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === "Escape") setLocked(false); };
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(id); window.removeEventListener("keydown", onKey); };
  }, [locked]);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });

  return (
    <AnimatePresence>
      {locked && (
        <motion.div
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center cursor-pointer text-white"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
          style={{ background: "rgba(4,3,2,0.65)" }}
          onClick={() => setLocked(false)}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center"
          >
            <div className="text-[12vw] leading-none font-light tabular-nums tracking-tighter">{time}</div>
            <div className="text-base text-white/80 mt-2">{date}</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="absolute bottom-20 flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center shadow-2xl">
              <Lock size={28} />
            </div>
            <p className="text-sm text-white/80 font-display">Shalev Osher</p>
            <p className="text-xs text-white/50">
              {lang === "he" ? "לחץ במקום כלשהו או הקש Enter לפתיחה" : "Click anywhere or press Enter to unlock"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockScreen;