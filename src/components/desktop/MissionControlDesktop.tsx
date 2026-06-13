import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowManager";
import { APP_META } from "./Desktop";
import { AppIcon } from "./AppIcons";
import { useLanguage } from "@/contexts/LanguageContext";

const MissionControlDesktop = () => {
  const { state, focus } = useWindows();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F3" || (e.ctrlKey && e.key === "ArrowUp")) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const wins = state.order.map((id) => state.windows[id]).filter(Boolean);
  const W = typeof window !== "undefined" ? window.innerWidth : 1440;
  const H = typeof window !== "undefined" ? window.innerHeight : 900;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[270] flex items-center justify-center p-10"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(28px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.22 }}
          style={{ background: "rgba(6,4,2,0.55)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Mission Control"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl">
            {wins.length === 0 ? (
              <p className="text-center text-white/80 text-lg">
                {lang === "he" ? "אין חלונות פתוחים" : "No open windows"}
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {wins.map((w, i) => {
                  const meta = APP_META[w.id];
                  // Mini preview frame proportional to actual window
                  const previewW = 320;
                  const previewH = Math.max(150, Math.round((w.h / w.w) * previewW));
                  return (
                    <motion.button
                      key={w.id}
                      onClick={() => { focus(w.id); setOpen(false); }}
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 22 }}
                      whileHover={{ scale: 1.04 }}
                      className={`group flex flex-col items-center gap-2 ${state.focus === w.id ? "ring-2 ring-primary rounded-2xl p-2" : "p-2"}`}
                    >
                      <div
                        style={{ width: previewW, height: previewH }}
                        className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-xl
                                   shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] overflow-hidden relative"
                      >
                        <div className="h-6 bg-white/10 border-b border-white/10 flex items-center gap-1.5 px-2">
                          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pt-6 pointer-events-none">
                          <div className="w-16 h-16 opacity-90">
                            <AppIcon id={w.id} />
                          </div>
                        </div>
                        {w.minimized && (
                          <span className="absolute top-1.5 end-2 text-[10px] uppercase tracking-wider text-white/70">min</span>
                        )}
                      </div>
                      <span className="text-[12px] font-medium text-white">{meta?.title ?? w.id}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}
            <p className="text-center text-[11px] text-white/60 mt-8">
              {lang === "he" ? "Mission Control · F3 לפתיחה · ESC לסגירה" : "Mission Control · F3 toggle · ESC close"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MissionControlDesktop;