import { useEffect, useMemo, useState } from "react";

interface ParticlesProps {
  count?: number;
  className?: string;
}

const Particles = ({ count = 30, className = "" }: ParticlesProps) => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
    const updateIsLowPower = () => setIsLowPower(mediaQuery.matches);

    updateIsLowPower();
    mediaQuery.addEventListener("change", updateIsLowPower);

    return () => mediaQuery.removeEventListener("change", updateIsLowPower);
  }, []);

  const effectiveCount = isLowPower ? Math.min(10, count) : count;

  const particles = useMemo(
    () =>
      Array.from({ length: effectiveCount }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        drift: (Math.random() - 0.5) * 40,
      })),
    [effectiveCount]
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-primary particle-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: `0 0 ${p.size * 4}px hsl(var(--primary) / 0.8)`,
            ["--drift" as any]: `${p.drift}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
};

export default Particles;