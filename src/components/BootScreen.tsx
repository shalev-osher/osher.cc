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
          {/* Gold desktop wallpaper */}
          <div className="absolute inset-0 -z-10" style={{
            background: "radial-gradient(120% 100% at 30% 10%, #2a1f0a 0%, #14100a 45%, #050403 80%)",
          }} />
          <div className="absolute inset-0 -z-10 mix-blend-screen opacity-70" style={{
            background:
              "radial-gradient(40% 35% at 75% 25%, rgba(212,170,80,0.45) 0%, transparent 60%)," +
              "radial-gradient(50% 40% at 25% 85%, rgba(184,148,46,0.35) 0%, transparent 65%)",
          }} />

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-end gap-2 text-white"
          >
            <span className="font-display text-[44px] font-bold tracking-tight leading-none">Shalev</span>
            <span className="font-display text-[44px] font-light tracking-tight leading-none opacity-80 bg-gradient-to-b from-[#f0d27d] to-[#b8942e] bg-clip-text text-transparent">OS</span>
          </motion.div>
          <p className="text-[#d4aa50]/70 text-[11px] tracking-[0.3em] uppercase mt-3">
            {lang === "he" ? "טוען חוויה" : "Loading experience"}
          </p>

          {/* Thin progress bar */}
          <div className="mt-10 w-[180px] h-[3px] rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #b8942e 0%, #f0d27d 50%, #b8942e 100%)", boxShadow: "0 0 12px rgba(212,170,80,0.6)" }}
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