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
      {/* Aurora waves */}
      <div className="absolute inset-0">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
      </div>

      {/* Twinkling starfield */}
      <div className="starfield" />
      <div className="starfield starfield-2" />

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden">
        <span className="shooting-star" style={{ top: "12%", animationDelay: "0s" }} />
        <span className="shooting-star" style={{ top: "32%", animationDelay: "2.4s" }} />
        <span className="shooting-star" style={{ top: "58%", animationDelay: "4.1s" }} />
        <span className="shooting-star" style={{ top: "78%", animationDelay: "6.8s" }} />
        <span className="shooting-star" style={{ top: "22%", animationDelay: "9.2s" }} />
        <span className="shooting-star" style={{ top: "48%", animationDelay: "11.5s" }} />
      </div>

      {/* Floating gold orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -start-32 h-[640px] w-[640px] rounded-full bg-primary/25 blur-[140px] animate-pulse-glow"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -end-40 h-[680px] w-[680px] rounded-full blur-[160px] bg-[hsl(28_90%_55%/0.18)]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-0 start-1/3 h-[560px] w-[560px] rounded-full bg-primary/20 blur-[130px]"
      />

      {/* Subtle moving lines grid */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 opacity-[0.14]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary) / 0.9) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.9) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </motion.div>

    </div>
  );
};

export default ParallaxBackground;