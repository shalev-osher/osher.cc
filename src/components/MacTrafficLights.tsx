import { cn } from "@/lib/utils";

interface Props {
  onClose?: () => void;
  className?: string;
}

/**
 * macOS-style window traffic lights (close / minimize / maximize).
 * Decorative — only the red dot is interactive when onClose is supplied.
 */
const MacTrafficLights = ({ onClose, className }: Props) => {
  return (
    <div
      className={cn("flex items-center gap-1.5 select-none", className)}
      aria-hidden={!onClose}
    >
      <button
        type="button"
        onClick={onClose}
        tabIndex={onClose ? 0 : -1}
        aria-label={onClose ? "Close" : undefined}
        className="w-3 h-3 rounded-full bg-[hsl(6_74%_58%)] shadow-[inset_0_0_0_0.5px_hsl(0_0%_0%/0.25)] hover:brightness-110 transition"
      />
      <span className="w-3 h-3 rounded-full bg-[hsl(42_85%_55%)] shadow-[inset_0_0_0_0.5px_hsl(0_0%_0%/0.25)]" />
      <span className="w-3 h-3 rounded-full bg-[hsl(132_55%_48%)] shadow-[inset_0_0_0_0.5px_hsl(0_0%_0%/0.25)]" />
    </div>
  );
};

export default MacTrafficLights;