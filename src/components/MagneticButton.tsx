import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, MouseEvent, useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  /** Strength of the magnetic pull (0–1). Default 0.3 */
  strength?: number;
  /** Distance in px from center where the magnet activates. Default 80 */
  radius?: number;
  className?: string;
}

/**
 * Wraps any element with a magnetic hover effect — the element gently
 * follows the cursor when it's nearby, then springs back on leave.
 */
const MagneticButton = ({
  children,
  strength = 0.35,
  radius = 80,
  className = "inline-block",
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    // Only pull when cursor is within the activation radius
    if (dist < rect.width / 2 + radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
