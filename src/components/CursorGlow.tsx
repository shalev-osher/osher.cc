import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { stiffness: 150, damping: 20 };
  const trailConfig = { stiffness: 80, damping: 30 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Trail (delayed follower)
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseenter", handleEnter);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseenter", handleEnter);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Outer trail glow - slow follow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: trailX,
          top: trailY,
          background: "hsl(var(--primary) / 0.04)",
        }}
      />
      {/* Main glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: springX,
          top: springY,
          background: "hsl(var(--primary) / 0.07)",
        }}
        animate={{
          scale: isHovering ? 1.15 : 1,
        }}
        transition={{ duration: 0.5 }}
      />
      {/* Inner bright core */}
      <motion.div
        className="absolute w-[150px] h-[150px] rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: springX,
          top: springY,
          background: "hsl(var(--primary) / 0.12)",
        }}
        animate={{
          scale: isHovering ? 1.3 : 1,
          opacity: isHovering ? 1 : 0.7,
        }}
        transition={{ duration: 0.4 }}
      />
      {/* Ring effect */}
      <motion.div
        className="absolute w-[80px] h-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 border border-primary/10"
        style={{
          left: springX,
          top: springY,
        }}
        animate={{
          scale: isHovering ? [1, 2.5] : 1,
          opacity: isHovering ? [0.4, 0] : 0,
        }}
        transition={{
          duration: 1.2,
          repeat: isHovering ? Infinity : 0,
          ease: "easeOut",
        }}
      />
    </div>
  );
};

export default CursorGlow;
