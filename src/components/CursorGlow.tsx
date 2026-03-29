import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_LENGTH = 8;

const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const trailConfig = { stiffness: 80, damping: 30 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  const updateTrail = useCallback((x: number, y: number) => {
    trailIdRef.current += 1;
    setTrail((prev) => {
      const next = [...prev, { x, y, id: trailIdRef.current }];
      return next.slice(-TRAIL_LENGTH);
    });
  }, []);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    let lastX = 0;
    let lastY = 0;
    let frameCount = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);

      // Only add trail point every 3 frames for performance
      frameCount++;
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 15 && frameCount % 2 === 0) {
        updateTrail(x, y);
        lastX = x;
        lastY = y;
      }
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => {
      setIsHovering(false);
      setTrail([]);
    };

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseenter", handleEnter);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseenter", handleEnter);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY, updateTrail]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Trail particles */}
      {trail.map((point, i) => {
        const opacity = ((i + 1) / trail.length) * 0.35;
        const size = 6 + ((i + 1) / trail.length) * 10;
        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              width: size,
              height: size,
              background: `hsl(var(--primary) / ${opacity})`,
              boxShadow: `0 0 ${size * 2}px hsl(var(--primary) / ${opacity * 0.5})`,
            }}
          />
        );
      })}

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
