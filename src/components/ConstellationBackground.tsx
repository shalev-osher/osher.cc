import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

interface ConstellationBackgroundProps {
  /** Number of stars. Auto-scaled down on mobile. Default 70 */
  starCount?: number;
  /** Max distance in px to draw a connecting line between two stars. Default 130 */
  linkDistance?: number;
  /** Distance in px from cursor to influence stars. Default 180 */
  mouseInfluence?: number;
  className?: string;
}

/**
 * Animated canvas of floating stars that connect with lines when near
 * each other and react to the cursor (gentle attraction + brighter links).
 */
const ConstellationBackground = ({
  starCount = 70,
  linkDistance = 130,
  mouseInfluence = 180,
  className = "",
}: ConstellationBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion preference
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(starCount * 0.5) : starCount;
    const stars: Star[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.4 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.3,
        });
      }
    };

    const readPrimary = () => {
      const styles = getComputedStyle(document.documentElement);
      const raw = styles.getPropertyValue("--primary").trim();
      // Fallback to warm gold if read fails
      return raw || "42 75% 55%";
    };
    let primary = readPrimary();

    // Re-read primary when theme changes
    const themeObserver = new MutationObserver(() => {
      primary = readPrimary();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update + draw stars
      for (const s of stars) {
        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0 || s.x > width) s.vx *= -1;
          if (s.y < 0 || s.y > height) s.vy *= -1;

          // Cursor attraction
          if (mouse.active) {
            const dx = mouse.x - s.x;
            const dy = mouse.y - s.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouseInfluence) {
              const force = (1 - dist / mouseInfluence) * 0.4;
              s.x += (dx / dist) * force;
              s.y += (dy / dist) * force;
            }
          }
        }

        // Boost alpha if near cursor
        let alpha = s.baseAlpha;
        if (mouse.active) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseInfluence) {
            alpha = Math.min(1, alpha + (1 - dist / mouseInfluence) * 0.6);
          }
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${primary} / ${alpha})`;
        ctx.shadowColor = `hsl(${primary} / ${alpha * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw connecting lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            let lineAlpha = (1 - dist / linkDistance) * 0.25;

            // Boost lines near cursor
            if (mouse.active) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const md = Math.hypot(mouse.x - mx, mouse.y - my);
              if (md < mouseInfluence) {
                lineAlpha += (1 - md / mouseInfluence) * 0.5;
              }
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsl(${primary} / ${Math.min(lineAlpha, 0.7)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    initStars();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initStars();
    });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
    };
  }, [starCount, linkDistance, mouseInfluence]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default ConstellationBackground;
