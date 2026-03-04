import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1800);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

          {/* Animated center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Gold line expanding */}
            <motion.div
              className="h-px mb-8"
              style={{ background: 'var(--gradient-gold-warm)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Name */}
            <motion.h1
              className="font-display text-4xl md:text-6xl font-bold text-gradient-warm"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Shalev Osher
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-muted-foreground text-sm tracking-[0.4em] uppercase mt-4"
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1.2, delay: 0.7 }}
            >
              Portfolio
            </motion.p>

            {/* Bottom line */}
            <motion.div
              className="h-px mt-8"
              style={{ background: 'var(--gradient-gold-warm)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Reveal curtains */}
          {phase === "reveal" && (
            <>
              <motion.div
                className="absolute inset-0 bg-background origin-top"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                style={{ transformOrigin: "top" }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
