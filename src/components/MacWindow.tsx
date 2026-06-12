import type { ReactNode } from "react";
import MacTrafficLights from "./MacTrafficLights";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  app?: ReactNode; // small icon/text shown in toolbar (e.g. "Mail", "Settings")
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** When provided, the green light toggles fullscreen, the others do nothing visual */
  variant?: "default" | "finder" | "settings" | "mail" | "photos" | "calendar" | "terminal";
}

const variantBg: Record<NonNullable<Props["variant"]>, string> = {
  default: "bg-background/85",
  finder: "bg-background/85",
  settings: "bg-background/85",
  mail: "bg-background/85",
  photos: "bg-background/85",
  calendar: "bg-background/85",
  terminal: "bg-[hsl(0_0%_8%/0.92)] text-[hsl(60_20%_92%)]",
};

/**
 * macOS-style window chrome: traffic lights + title bar + body.
 * Use as a presentational wrapper around section content.
 */
const MacWindow = ({
  title,
  subtitle,
  app,
  children,
  className,
  bodyClassName,
  variant = "default",
}: Props) => {
  return (
    <div
      className={cn(
        "mac-window rounded-2xl overflow-hidden border border-border/40 shadow-2xl backdrop-blur-sm",
        variantBg[variant],
        className,
      )}
    >
      <div className="relative flex items-center gap-3 px-3.5 py-2 border-b border-border/40 bg-gradient-to-b from-white/[0.04] to-transparent">
        <MacTrafficLights size="sm" />
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 max-w-[70%]">
            {app && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-mono">
                {app}
              </span>
            )}
            <span className="text-[11px] font-medium text-foreground/80 truncate">
              {title}
              {subtitle && (
                <span className="text-muted-foreground"> — {subtitle}</span>
              )}
            </span>
          </div>
        </div>
        <span className="ms-auto w-[42px]" />
      </div>
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
};

export default MacWindow;