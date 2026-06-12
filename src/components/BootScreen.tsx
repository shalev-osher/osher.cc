import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Brief, branded boot moment — "Shalev OS" wordmark + progress bar.
 * Replaces the heavier login window for a clean entry.
 */
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [done, setDone] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const id = setTimeout(() => { setDone(true); onComplete(); }, 1400);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          aria-label="Booting"
        >
          {/* Desktop-style wallpaper */}
          <div className="absolute inset-0 -z-10" style={{
            background: "radial-gradient(120% 100% at 30% 10%, #1a2350 0%, #0a0f2a 45%, #050614 80%)",
          }} />
          <div className="absolute inset-0 -z-10 mix-blend-screen opacity-70" style={{
            background:
              "radial-gradient(40% 35% at 75% 25%, rgba(255,120,180,0.4) 0%, transparent 60%)," +
              "radial-gradient(50% 40% at 25% 85%, rgba(80,180,255,0.4) 0%, transparent 65%)",
          }} />

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-end gap-2 text-white"
          >
            <span className="font-display text-[44px] font-bold tracking-tight leading-none">Shalev</span>
            <span className="font-display text-[44px] font-light tracking-tight leading-none opacity-80">OS</span>
          </motion.div>
          <p className="text-white/60 text-[11px] tracking-[0.3em] uppercase mt-3">
            {lang === "he" ? "טוען חוויה" : "Loading experience"}
          </p>

          {/* Thin progress bar */}
          <div className="mt-10 w-[180px] h-[3px] rounded-full overflow-hidden bg-white/15">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: [0.45, 0.05, 0.55, 0.95] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;