import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxBackground = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -100]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Breathing gradient mesh */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-3" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        <div className="mesh-blob mesh-blob-2" />
      </motion.div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary) / 0.55) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Sweeping light beam */}
      <div className="light-beam" />

      {/* Fine grain texture */}
      <div className="noise-grain" />
    </div>
  );
};

export default ParallaxBackground;