import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--gradient-gold)",
      }}
      role="progressbar"
      aria-label="Scroll progress"
    />
  );
};

export default ScrollProgressBar;
