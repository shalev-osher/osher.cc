import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Authentic macOS boot screen.
 * Pure black canvas, centered white Apple silhouette, thin progress bar below.
 */
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 1800);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black overflow-hidden no-glass flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-label="Booting"
        >
          {/* Apple logo — silhouette path drawn in pure white */}
          <motion.svg
            viewBox="0 0 170 170"
            width={92}
            height={92}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-hidden="true"
          >
            <path
              fill="#ffffff"
              d="M130.7 90.4c-.2-19.9 16.2-29.4 17-29.9-9.3-13.5-23.7-15.4-28.8-15.6-12.3-1.2-23.9 7.2-30.2 7.2-6.2 0-15.8-7-26-6.8-13.4.2-25.7 7.8-32.6 19.7-13.9 24.1-3.6 59.8 10 79.4 6.6 9.6 14.5 20.4 24.9 20 10-.4 13.8-6.5 25.9-6.5 12 0 15.4 6.5 26 6.3 10.7-.2 17.5-9.8 24.1-19.4 7.6-11.2 10.8-22.1 11-22.6-.2-.1-21.1-8.1-21.3-32zM111.4 32.9c5.5-6.6 9.1-15.8 8.1-25-7.8.3-17.2 5.2-22.9 11.8-5.1 5.8-9.5 15.1-8.3 24.1 8.7.7 17.6-4.4 23.1-10.9z"
            />
          </motion.svg>

          {/* Progress bar */}
          <div className="mt-[88px] w-[160px] h-[5px] rounded-full overflow-hidden bg-white/15">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: [0.45, 0.05, 0.55, 0.95] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
