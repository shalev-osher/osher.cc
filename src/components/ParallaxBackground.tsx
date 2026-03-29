import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.04, 0.02]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 0.1, 0.06, 0.03]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.03, 0.07, 0.04, 0.01]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 0.95]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary warm blob - top left */}
      <motion.div
        className="absolute -top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ y: y3, opacity: opacity1, scale: scale1, background: "hsl(var(--primary))" }}
      />

      {/* Amber accent - right side */}
      <motion.div
        className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ y: y1, opacity: opacity2, background: "hsl(var(--primary))" }}
      />

      {/* Deep gold - center left */}
      <motion.div
        className="absolute top-[60%] left-[20%] w-[350px] h-[350px] rounded-full blur-[90px]"
        style={{ y: y2, opacity: opacity1, background: "hsl(var(--primary))" }}
      />

      {/* Warm secondary blob */}
      <motion.div
        className="absolute top-[80%] right-[30%] w-[250px] h-[250px] rounded-full blur-[80px]"
        style={{ y: y1, opacity: opacity2, background: "hsl(28 85% 50%)" }}
      />

      {/* NEW: Top-right subtle violet tint */}
      <motion.div
        className="absolute top-[5%] right-[15%] w-[300px] h-[300px] rounded-full blur-[130px]"
        style={{ y: y4, opacity: opacity3, background: "hsl(280 40% 50%)" }}
      />

      {/* NEW: Mid-page warm glow */}
      <motion.div
        className="absolute top-[45%] left-[50%] w-[600px] h-[300px] rounded-full blur-[140px] -translate-x-1/2"
        style={{ y: y5, opacity: opacity3, background: "hsl(var(--primary))" }}
      />

      {/* NEW: Bottom rose tint */}
      <motion.div
        className="absolute top-[90%] left-[5%] w-[200px] h-[200px] rounded-full blur-[100px]"
        style={{ y: y4, opacity: opacity3, background: "hsl(15 70% 50%)" }}
      />

      {/* Vertical decorative lines */}
      <motion.div
        className="absolute top-0 left-[15%] w-px h-[200vh] opacity-[0.03]"
        style={{ y: y3, background: "linear-gradient(180deg, transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), transparent)" }}
      />
      <motion.div
        className="absolute top-0 right-[25%] w-px h-[200vh] opacity-[0.025]"
        style={{ y: y1, background: "linear-gradient(180deg, transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), transparent)" }}
      />
      {/* NEW: Additional subtle line */}
      <motion.div
        className="absolute top-0 left-[55%] w-px h-[200vh] opacity-[0.02]"
        style={{ y: y5, background: "linear-gradient(180deg, transparent, hsl(var(--primary)), transparent)" }}
      />

      {/* NEW: Horizontal accent line */}
      <motion.div
        className="absolute top-[40%] left-0 h-px w-[100vw] opacity-[0.02]"
        style={{ y: y3, background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
      />
    </div>
  );
};

export default ParallaxBackground;
