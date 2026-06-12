import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { lang } = useLanguage();
  const isHebrew = lang === "he";
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 900);
    return () => clearTimeout(id);
  }, [onComplete]);

  const name = isHebrew ? "שליו אושר" : "Shalev Osher";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-background overflow-hidden no-glass"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <motion.div
              className="mac-window w-[min(420px,88vw)] p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div className="mac-traffic-lights mx-auto mb-7" aria-hidden="true" />
              <h1 className="font-display text-4xl font-bold text-gradient-warm md:text-5xl">{name}</h1>
              <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-gold)" }}
                  initial={{ width: "18%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
