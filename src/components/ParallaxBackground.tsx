import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.04, 0.02]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 0.1, 0.06, 0.03]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep slow layer */}
      <motion.div
        className="absolute -top-20 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          y: y3,
          opacity: opacity1,
          background: "hsl(var(--primary))",
        }}
      />

      {/* Mid layer */}
      <motion.div
        className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          y: y1,
          opacity: opacity2,
          background: "hsl(var(--primary))",
        }}
      />

      {/* Fast foreground layer */}
      <motion.div
        className="absolute top-[60%] left-[20%] w-[350px] h-[350px] rounded-full blur-[90px]"
        style={{
          y: y2,
          opacity: opacity1,
          background: "hsl(var(--primary))",
        }}
      />

      {/* Additional accent blob */}
      <motion.div
        className="absolute top-[80%] right-[30%] w-[250px] h-[250px] rounded-full blur-[80px]"
        style={{
          y: y1,
          opacity: opacity2,
          background: "hsl(28 85% 50%)",
        }}
      />

      {/* Vertical decorative lines with parallax */}
      <motion.div
        className="absolute top-0 left-[15%] w-px h-[200vh] opacity-[0.03]"
        style={{
          y: y3,
          background: "linear-gradient(180deg, transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), transparent)",
        }}
      />
      <motion.div
        className="absolute top-0 right-[25%] w-px h-[200vh] opacity-[0.025]"
        style={{
          y: y1,
          background: "linear-gradient(180deg, transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), transparent)",
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
