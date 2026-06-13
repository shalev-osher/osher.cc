import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowManager";
import { APP_META } from "./Desktop";
import { useLanguage } from "@/contexts/LanguageContext";

const ForceQuitDialog = () => {
  const { state, close } = useWindows();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey && e.altKey && e.key === "Escape") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const wins = state.order.map((id) => ({ id, meta: APP_META[id] }));
  const t = (en: string, he: string) => (lang === "he" ? he : en);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[290] flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-[420px] rounded-2xl border border-white/15 bg-[hsl(220_15%_12%/0.94)]
                       backdrop-blur-2xl text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="font-display text-base font-semibold">
                {t("Force Quit Applications", "סגירה כפויה של אפליקציות")}
              </h2>
              <p className="text-[12px] text-white/70 mt-1">
                {t("Select an app to force quit.", "בחר אפליקציה לסגירה כפויה.")}
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {wins.length === 0 && (
                <p className="text-center text-white/60 text-sm py-6">
                  {t("No applications running.", "אין אפליקציות פעילות.")}
                </p>
              )}
              {wins.map(({ id, meta }) => (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm
                              ${selected === id ? "bg-primary/30" : "hover:bg-white/10"}`}
                >
                  <span className="font-medium">{meta?.title ?? id}</span>
                  {state.focus === id && (
                    <span className="text-[10px] text-white/60 uppercase tracking-wider">{t("active","פעיל")}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2 bg-black/20">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-md text-sm hover:bg-white/10"
              >
                {t("Cancel", "ביטול")}
              </button>
              <button
                disabled={!selected}
                onClick={() => { if (selected) { close(selected as any); setSelected(null); setOpen(false); } }}
                className="px-3 py-1.5 rounded-md text-sm bg-[#ff5f57] text-white font-medium
                           disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              >
                {t("Force Quit", "סגור בכוח")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForceQuitDialog;