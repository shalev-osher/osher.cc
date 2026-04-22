import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const matrixChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

interface MatrixDrop {
  id: number;
  x: number;
  chars: string;
  speed: number;
  delay: number;
}

const KonamiEasterEgg = () => {
  const [activated, setActivated] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activated) return;
      const newSequence = [...sequence, e.key].slice(-KONAMI_CODE.length);
      setSequence(newSequence);

      if (newSequence.length === KONAMI_CODE.length &&
          newSequence.every((key, i) => key === KONAMI_CODE[i])) {
        setActivated(true);
        setTimeout(() => setActivated(false), 6000);
        setSequence([]);
      }
    },
    [sequence, activated]
  );

  useEffect(() => {
    const externalTrigger = () => {
      setActivated(true);
      setTimeout(() => setActivated(false), 6000);
    };
    window.addEventListener("trigger-matrix", externalTrigger);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("trigger-matrix", externalTrigger);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const drops: MatrixDrop[] = activated
    ? Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        chars: Array.from(
          { length: 10 + Math.floor(Math.random() * 15) },
          () => matrixChars[Math.floor(Math.random() * matrixChars.length)]
        ).join("\n"),
        speed: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      }))
    : [];

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-background/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Matrix rain */}
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute top-0 text-xs font-mono leading-4 whitespace-pre"
              style={{
                left: `${drop.x}%`,
                color: "hsl(var(--primary))",
                textShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "120vh" }}
              transition={{
                duration: drop.speed,
                delay: drop.delay,
                ease: "linear",
              }}
            >
              {drop.chars}
            </motion.div>
          ))}

          {/* Center message */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <motion.h2
                className="font-display text-4xl md:text-6xl font-bold text-gradient-warm mb-4"
                animate={{ textShadow: ["0 0 20px hsl(42 75% 55% / 0.5)", "0 0 40px hsl(42 75% 55% / 0.8)", "0 0 20px hsl(42 75% 55% / 0.5)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮 You found it!
              </motion.h2>
              <p className="text-primary/80 text-lg font-mono">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;
