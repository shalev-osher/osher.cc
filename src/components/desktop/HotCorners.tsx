import { useEffect, useRef } from "react";
import { useWindows } from "./WindowManager";

/** Trigger actions when the cursor dwells in a screen corner. */
const HotCorners = () => {
  const { state, minimize } = useWindows();
  const timer = useRef<number | null>(null);
  const activeCorner = useRef<string | null>(null);

  useEffect(() => {
    const SIZE = 6;
    const DWELL = 450;

    const trigger = (corner: string) => {
      switch (corner) {
        case "tl": window.dispatchEvent(new CustomEvent("toggle-launchpad")); break;
        case "tr": window.dispatchEvent(new CustomEvent("toggle-notification-center")); break;
        case "bl": {
          // Show desktop — minimize all
          Object.values(state.windows).forEach((w) => {
            if (!w.minimized) minimize(w.id);
          });
          break;
        }
        case "br":
          // Mission Control via keyboard event
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "F3" }));
          break;
      }
    };

    const onMove = (e: MouseEvent) => {
      const W = window.innerWidth, H = window.innerHeight;
      let corner: string | null = null;
      if (e.clientX <= SIZE && e.clientY <= SIZE) corner = "tl";
      else if (e.clientX >= W - SIZE && e.clientY <= SIZE) corner = "tr";
      else if (e.clientX <= SIZE && e.clientY >= H - SIZE) corner = "bl";
      else if (e.clientX >= W - SIZE && e.clientY >= H - SIZE) corner = "br";

      if (corner !== activeCorner.current) {
        activeCorner.current = corner;
        if (timer.current) { clearTimeout(timer.current); timer.current = null; }
        if (corner) {
          timer.current = window.setTimeout(() => {
            trigger(corner!);
            activeCorner.current = null;
          }, DWELL);
        }
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state.windows, minimize]);

  return null;
};

export default HotCorners;