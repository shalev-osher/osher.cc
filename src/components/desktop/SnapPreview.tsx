import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Rect { x: number; y: number; w: number; h: number; }

const SnapPreview = () => {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    const onDrag = (e: Event) => {
      const { x, y } = (e as CustomEvent).detail as { x: number; y: number };
      const W = window.innerWidth, H = window.innerHeight;
      const topBar = 32, bottomPad = 110;
      const EDGE = 24;
      if (y <= EDGE) {
        setRect({ x: 8, y: topBar, w: W - 16, h: H - bottomPad });
      } else if (x <= EDGE) {
        setRect({ x: 0, y: topBar, w: Math.floor(W / 2), h: H - bottomPad });
      } else if (x >= W - EDGE) {
        setRect({ x: Math.floor(W / 2), y: topBar, w: Math.floor(W / 2), h: H - bottomPad });
      } else {
        setRect(null);
      }
    };
    const onEnd = () => setRect(null);
    window.addEventListener("desktop-drag", onDrag);
    window.addEventListener("desktop-drag-end", onEnd);
    return () => {
      window.removeEventListener("desktop-drag", onDrag);
      window.removeEventListener("desktop-drag-end", onEnd);
    };
  }, []);

  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
          className="fixed pointer-events-none z-[5] rounded-xl border-2 border-primary/70
                     bg-primary/10 backdrop-blur-sm shadow-[0_0_40px_-5px_hsl(var(--primary))]"
        />
      )}
    </AnimatePresence>
  );
};

export default SnapPreview;