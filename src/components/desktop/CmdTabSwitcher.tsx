import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowManager";
import { APP_META } from "./Desktop";
import { AppIcon } from "./AppIcons";

/** macOS ⌘Tab application switcher. Hold ⌘, tap Tab to cycle, release ⌘ to commit. */
const CmdTabSwitcher = () => {
  const { state, open } = useWindows();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const listRef = useRef<string[]>([]);

  useEffect(() => {
    const buildList = () => {
      // Most-recently focused first
      const ordered = [...state.order].sort((a, b) => state.windows[b]!.z - state.windows[a]!.z);
      listRef.current = ordered;
    };

    const onDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Tab") {
        e.preventDefault();
        if (!active) {
          buildList();
          if (listRef.current.length === 0) return;
          setActive(true);
          setIndex(e.shiftKey ? listRef.current.length - 1 : Math.min(1, listRef.current.length - 1));
        } else {
          setIndex((i) => {
            const n = listRef.current.length;
            return (i + (e.shiftKey ? -1 : 1) + n) % n;
          });
        }
      } else if (active && e.key === "Escape") {
        setActive(false);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (active && (e.key === "Meta" || e.key === "Control")) {
        const id = listRef.current[index];
        if (id) open(id as any);
        setActive(false);
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [active, index, state.order, state.windows, open]);

  const items = listRef.current.map((id) => ({ id, meta: APP_META[id] }));

  return (
    <AnimatePresence>
      {active && items.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[295] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl
                          border border-white/15 bg-[hsl(220_15%_12%/0.85)] backdrop-blur-2xl
                          shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            {items.map(({ id, meta }, i) => {
              return (
                <div key={id} className="flex flex-col items-center gap-1">
                  <div className={`w-16 h-16 rounded-2xl p-1 transition-all
                                  ${i === index ? "bg-white/15 ring-2 ring-primary" : "bg-transparent"}`}>
                    <AppIcon id={id as any} />
                  </div>
                  {i === index && (
                    <span className="text-[11px] text-white font-medium">{meta?.title ?? id}</span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CmdTabSwitcher;