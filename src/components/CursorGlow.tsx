import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const TRAIL_LENGTH = 14;
const SPARKLE_LIFETIME = 700;

// Safari-safe HSL color helper
const hslColor = (opacity: number) => `hsla(var(--primary-h, 45), var(--primary-s, 93%), var(--primary-l, 58%), ${opacity})`;

const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number; angle: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number; dx: number; dy: number; size: number }[]>([]);
  const trailIdRef = useRef(0);
  const sparkleIdRef = useRef(0);
  const [primaryColor, setPrimaryColor] = useState({ h: 45, s: 93, l: 58 });

  const springConfig = { stiffness: 150, damping: 20 };
  const trailConfig = { stiffness: 80, damping: 30 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  // Read actual primary HSL values from CSS
  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const raw = style.getPropertyValue("--primary").trim();
    const parts = raw.split(/\s+/);
    if (parts.length >= 3) {
      setPrimaryColor({
        h: parseFloat(parts[0]) || 45,
        s: parseFloat(parts[1]) || 93,
        l: parseFloat(parts[2]) || 58,
      });
    }

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const s = getComputedStyle(document.documentElement);
      const r = s.getPropertyValue("--primary").trim();
      const p = r.split(/\s+/);
      if (p.length >= 3) {
        setPrimaryColor({
          h: parseFloat(p[0]) || 45,
          s: parseFloat(p[1]) || 93,
          l: parseFloat(p[2]) || 58,
        });
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const hsla = useCallback((opacity: number) => {
    return `hsla(${primaryColor.h}, ${primaryColor.s}%, ${primaryColor.l}%, ${opacity})`;
  }, [primaryColor]);

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
        const angleDeg = (point.angle * 180) / Math.PI;
        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              left: point.x,
              top: point.y,
              width: size * 1.6,
              height: size,
              transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
              background: `linear-gradient(90deg, ${hsla(opacity * 0.3)}, ${hsla(opacity)})`,
              boxShadow: `0 0 ${size * 2.5}px ${hsla(opacity * 0.6)}`,
            }}
          />
        );
      })}

      {/* Sparkles - tiny bursts on fast movement */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, x: s.dx, y: s.dy }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPARKLE_LIFETIME / 1000, ease: "easeOut" }}
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              transform: "translate(-50%, -50%)",
              background: hsla(1),
              boxShadow: `0 0 ${s.size * 4}px ${hsla(0.8)}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Outer trail glow - slow follow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: trailX,
          top: trailY,
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          filter: "blur(160px)",
          background: hsla(0.04),
        }}
      />
      {/* Main glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: springX,
          top: springY,
          width: 400,
          height: 400,
          transform: "translate(-50%, -50%)",
          filter: "blur(120px)",
          background: hsla(0.07),
        }}
        animate={{
          scale: isHovering ? 1.15 : 1,
        }}
        transition={{ duration: 0.5 }}
      />
      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: springX,
          top: springY,
          width: 150,
          height: 150,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          background: hsla(0.12),
        }}
        animate={{
          scale: isHovering ? 1.3 : 1,
          opacity: isHovering ? 1 : 0.7,
        }}
        transition={{ duration: 0.4 }}
      />
      {/* Ring effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: springX,
          top: springY,
          width: 80,
          height: 80,
          transform: "translate(-50%, -50%)",
          border: `1px solid ${hsla(0.1)}`,
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
