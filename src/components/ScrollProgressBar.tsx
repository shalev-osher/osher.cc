import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[4px] z-[60] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--gradient-gold)",
        boxShadow: "0 0 8px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.2)",
      }}
      role="progressbar"
      aria-label="Scroll progress"
    />
  );
};

export default ScrollProgressBar;
