const ParallaxBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft static gold glows — top start and bottom end */}
      <div
        className="absolute -top-40 -start-40 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -end-40 h-[560px] w-[560px] rounded-full blur-[160px]"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.14), transparent 70%)" }}
      />

      {/* Subtle dot grid, masked to center */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />
    </div>
  );
};

export default ParallaxBackground;