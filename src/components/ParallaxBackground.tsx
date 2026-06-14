import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxBackground = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -450]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Floating gold orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -start-32 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -end-40 h-[520px] w-[520px] rounded-full bg-primary/[0.08] blur-[140px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-0 start-1/3 h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[120px]"
      />

      {/* Subtle moving lines grid */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 opacity-[0.05]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;