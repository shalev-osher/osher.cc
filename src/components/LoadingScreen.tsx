import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SkeletonLine = ({ width, delay }: { width: string; delay: number }) => (
  <motion.div
    className="h-3 rounded-full bg-muted-foreground/10 overflow-hidden"
    style={{ width }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <motion.div
      className="h-full w-full"
      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);

const SkeletonCircle = ({ size, delay }: { size: number; delay: number }) => (
  <motion.div
    className="rounded-full bg-muted-foreground/10 overflow-hidden"
    style={{ width: size, height: size }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
  >
    <motion.div
      className="h-full w-full"
      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"skeleton" | "reveal" | "done">("skeleton");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1600);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-background overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0" style={{ background: 'var(--gradient-radial)' }} />

          {/* Skeleton layout mimicking the real page */}
          <div className="relative z-10 w-full h-full">
            {/* Navbar skeleton */}
            <div className="flex items-center justify-between px-8 py-5">
              <SkeletonLine width="120px" delay={0} />
              <div className="hidden md:flex gap-6">
                {[0, 1, 2, 3, 4].map(i => (
                  <SkeletonLine key={i} width="60px" delay={0.05 * i} />
                ))}
              </div>
              <SkeletonCircle size={32} delay={0.1} />
            </div>

            {/* Hero skeleton */}
            <div className="flex flex-col items-center justify-center mt-[15vh] gap-6 px-6">
              {/* Small tag */}
              <SkeletonLine width="80px" delay={0.2} />

              {/* Subtitle */}
              <motion.div
                className="h-6 rounded-full bg-muted-foreground/10 overflow-hidden"
                style={{ width: "180px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Name - large skeleton */}
              <motion.div
                className="h-12 md:h-16 rounded-xl overflow-hidden"
                style={{
                  width: "min(400px, 70vw)",
                  background: "linear-gradient(90deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.08))",
                  backgroundSize: "200% 100%",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{
                  opacity: { delay: 0.4, duration: 0.4 },
                  scale: { delay: 0.4, duration: 0.4 },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
                }}
              />

              {/* Role line */}
              <SkeletonLine width="240px" delay={0.5} />

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="h-12 w-32 rounded-lg bg-muted-foreground/8 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                  >
                    <motion.div
                      className="h-full w-full"
                      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)" }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/30"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>

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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
