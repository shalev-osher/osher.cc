import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[4px] z-[60] origin-left"
      style={{
        transform: `scaleX(${progress})`,
        background: "var(--gradient-gold)",
        boxShadow: "0 0 8px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.2)",
        willChange: "transform",
      }}
      role="progressbar"
      aria-label="Scroll progress"
    />
  );
};

export default ScrollProgressBar;
