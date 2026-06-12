import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** iOS-style squircle tile with gradient background + centered glyph. */
const AppIcon = ({
  gradient,
  children,
  className,
  size,
}: {
  gradient: string; // CSS linear-gradient value
  children: ReactNode; // inner SVG glyph
  className?: string;
  size?: number;
}) => (
  <div
    className={cn(
      "relative flex items-center justify-center text-white select-none",
      "shadow-[0_8px_20px_-6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.25)]",
      className,
    )}
    style={
      size != null
        ? {
            width: size,
            height: size,
            borderRadius: size * 0.225,
            background: gradient,
          }
        : {
            width: "100%",
            height: "100%",
            borderRadius: "22.5%",
            background: gradient,
          }
    }
  >
    {/* glossy top highlight */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        borderRadius: "inherit",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.04) 38%, transparent 60%)",
      }}
    />
    <div className="relative" style={{ width: "60%", height: "60%" }}>
      {children}
    </div>
  </div>
);

export default AppIcon;