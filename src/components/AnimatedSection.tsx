import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType = "fadeUp" | "fadeDown" | "slideLeft" | "slideRight" | "scaleUp" | "blur" | "rotate";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
}

const animations: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeDown: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideRight: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blur: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  rotate: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

const AnimatedSection = ({ children, className = "", delay = 0, animation = "fadeUp" }: AnimatedSectionProps) => {
  const variant = animations[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variant}
      transition={{ duration: 0.35, delay: Math.min(delay, 0.04), ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
