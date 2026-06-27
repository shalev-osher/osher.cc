import { useEffect, useRef, useState } from "react";

const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const updateReduce = () => setEnabled(!reduceMq.matches);
    const updateMobile = () => setIsMobile(mobileMq.matches);
    updateReduce();
    updateMobile();
    reduceMq.addEventListener("change", updateReduce);
    mobileMq.addEventListener("change", updateMobile);
    return () => {
      reduceMq.removeEventListener("change", updateReduce);
      mobileMq.removeEventListener("change", updateMobile);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let last = 0;
    const frameInterval = isMobile ? 1000 / 30 : 0; // cap to 30fps on mobile

    type P = { x: number; y: number; vx: number; vy: number };
    let points: P[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = isMobile
        ? Math.min(28, Math.floor((width * height) / 28000))
        : Math.min(110, Math.floor((width * height) / 16000));
      points = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const tick = (now?: number) => {
      raf = requestAnimationFrame(tick);
      if (frameInterval) {
        const t = now ?? performance.now();
        if (t - last < frameInterval) return;
        last = t;
      }
      ctx.clearRect(0, 0, width, height);

      // Move
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Lines
      const maxDist = isMobile ? 110 : 130;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `hsl(42 85% 60% / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      ctx.fillStyle = "hsl(42 90% 65% / 0.75)";
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    init();
    tick();

    const onResize = () => {
      cancelAnimationFrame(raf);
      last = 0;
      init();
      tick();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled, isMobile]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5] opacity-70"
    />
  );
};

export default NetworkBackground;