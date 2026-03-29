import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { lang } = useLanguage();
  const isHebrew = lang === "he";
  const [phase, setPhase] = useState<"logo" | "skeleton" | "reveal" | "done">("logo");

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("skeleton"), 900);
    const t1 = setTimeout(() => setPhase("reveal"), 2200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2800);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  const nameLetters = (isHebrew ? "שליו אושר" : "Shalev Osher").split("");

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-background overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Logo reveal phase */}
            <AnimatePresence>
              {phase === "logo" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center">
                    {/* Animated name letters */}
                    <h1 className="font-display text-5xl md:text-7xl font-bold">
                      {nameLetters.map((letter, i) => (
                        <motion.span
                          key={i}
                          className="inline-block text-gradient-warm"
                          initial={{ opacity: 0, y: 30, rotateX: -90 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{
                            delay: i * 0.05,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                      ))}
                    </h1>
                    {/* Underline sweep */}
                    <motion.div
                      className="h-0.5 mx-auto mt-4 rounded-full"
                      style={{ background: "var(--gradient-gold)" }}
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skeleton layout phase */}
            {(phase === "skeleton" || phase === "reveal") && (
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Navbar skeleton */}
                <div className="flex items-center justify-between px-8 py-5">
                  <motion.div className="h-3 w-28 rounded-full bg-muted-foreground/10 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
                    <motion.div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                  </motion.div>
                  <div className="hidden md:flex gap-6">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i} className="h-3 w-14 rounded-full bg-muted-foreground/10 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}>
                        <motion.div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div className="w-8 h-8 rounded-full bg-muted-foreground/10" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} />
                </div>

                {/* Hero skeleton */}
                <div className="flex flex-col items-center justify-center mt-[12vh] gap-6 px-6">
                  <motion.div className="h-4 w-20 rounded-full bg-muted-foreground/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} />
                  <motion.div
                    className="h-14 md:h-20 rounded-xl overflow-hidden"
                    style={{ width: "min(420px, 72vw)", background: "linear-gradient(90deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.08))", backgroundSize: "200% 100%" }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ opacity: { delay: 0.25 }, scale: { delay: 0.25 }, backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" } }}
                  />
                  <motion.div className="h-4 w-56 rounded-full bg-muted-foreground/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} />
                  <div className="flex gap-4 mt-4">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="h-12 w-32 rounded-lg bg-muted-foreground/8 overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.1 }}>
                        <motion.div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)" }} animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Loading dots */}
                <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Reveal wipe */}
            {phase === "reveal" && (
              <motion.div
                className="absolute inset-0 bg-background origin-top z-20"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                style={{ transformOrigin: "top" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
