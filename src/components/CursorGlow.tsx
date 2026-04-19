import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const TRAIL_LENGTH = 14;
const SPARKLE_LIFETIME = 700;

const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number; angle: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number; dx: number; dy: number; size: number }[]>([]);
  const trailIdRef = useRef(0);
  const sparkleIdRef = useRef(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const trailConfig = { stiffness: 80, damping: 30 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  const updateTrail = useCallback((x: number, y: number, angle: number) => {
    trailIdRef.current += 1;
    setTrail((prev) => {
      const next = [...prev, { x, y, id: trailIdRef.current, angle }];
      return next.slice(-TRAIL_LENGTH);
    });
  }, []);

  const spawnSparkle = useCallback((x: number, y: number) => {
    sparkleIdRef.current += 1;
    const id = sparkleIdRef.current;
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 30;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const size = 2 + Math.random() * 3;
    setSparkles((prev) => [...prev, { x, y, id, dx, dy, size }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, SPARKLE_LIFETIME);
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

      frameCount++;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      if (dist > 12 && frameCount % 2 === 0) {
        updateTrail(x, y, angle);
        // Occasional sparkle on faster movement
        if (dist > 25 && Math.random() > 0.7) spawnSparkle(x, y);
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
  }, [mouseX, mouseY, updateTrail, spawnSparkle]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Trail particles - elongated golden droplets */}
      {trail.map((point, i) => {
        const progress = (i + 1) / trail.length;
        const opacity = progress * 0.45;
        const size = 4 + progress * 8;
        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              width: size * 1.6,
              height: size,
              background: `linear-gradient(90deg, hsl(var(--primary) / ${opacity * 0.3}), hsl(var(--primary) / ${opacity}))`,
              boxShadow: `0 0 ${size * 2.5}px hsl(var(--primary) / ${opacity * 0.6})`,
              transform: `translate(-50%, -50%) rotate(${point.angle}rad)`,
            }}
          />
        );
      })}

      {/* Sparkles - tiny bursts on fast movement */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, x: s.dx, y: s.dy }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPARKLE_LIFETIME / 1000, ease: "easeOut" }}
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              background: "hsl(var(--primary))",
              boxShadow: `0 0 ${s.size * 4}px hsl(var(--primary) / 0.8)`,
            }}
          />
        ))}
      </AnimatePresence>

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
