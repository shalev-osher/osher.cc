import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  size?: "sm" | "md";
}

/**
 * macOS-style window traffic lights.
 * Glyphs (×, −, +/⤢) appear only when the group is hovered, exactly like Mac.
 * Dots become inactive (greyed) when no handler is supplied.
 */
const MacTrafficLights = ({
  onClose,
  onMinimize,
  onMaximize,
  className,
  size = "md",
}: Props) => {
  const [hover, setHover] = useState(false);
  const dim = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  const text = size === "sm" ? "text-[7px]" : "text-[9px]";

  const baseDot =
    "rounded-full grid place-items-center font-bold leading-none select-none outline-none focus:outline-none focus-visible:outline-none transition-[filter] duration-150";

  const dot = (
    color: string,
    glyph: string,
    handler: (() => void) | undefined,
    label: string,
  ) => {
    const active = !!handler;
    return (
      <button
        type="button"
        onClick={handler}
        disabled={!active}
        aria-label={active ? label : undefined}
        tabIndex={-1}
        className={cn(
          baseDot,
          dim,
          text,
          active ? "hover:brightness-110" : "opacity-60 cursor-default",
        )}
        style={{
          background: active ? color : "hsl(0 0% 50% / 0.55)",
          boxShadow: "inset 0 0 0 0.5px hsl(0 0% 0% / 0.3)",
          color: "hsl(0 0% 0% / 0.65)",
        }}
      >
        <span
          aria-hidden
          style={{
            opacity: hover && active ? 1 : 0,
            transition: "opacity 120ms ease",
          }}
        >
          {glyph}
        </span>
      </button>
    );
  };

  return (
    <div
      className={cn("flex items-center gap-1.5 select-none", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {dot("hsl(6 74% 58%)", "×", onClose, "Close")}
      {dot("hsl(42 85% 55%)", "−", onMinimize, "Minimize")}
      {dot("hsl(132 55% 48%)", "+", onMaximize, "Maximize")}
    </div>
  );
};

export default MacTrafficLights;