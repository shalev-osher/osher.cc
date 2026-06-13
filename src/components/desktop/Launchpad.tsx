import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows, type AppId } from "./WindowManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppIcon } from "./AppIcons";

interface LpApp { id: AppId; label: string; }

const Launchpad = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { open: openApp } = useWindows();
  const { lang } = useLanguage();

  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F4") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("toggle-launchpad", toggle);
    window.addEventListener("close-launchpad", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("toggle-launchpad", toggle);
      window.removeEventListener("close-launchpad", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const apps: LpApp[] = [
    { id: "finder",     label: "Finder" },
    { id: "home",       label: lang === "he" ? "בית" : "Home" },
    { id: "about",      label: lang === "he" ? "אודות" : "About" },
    { id: "skills",     label: lang === "he" ? "מיומנויות" : "Skills" },
    { id: "projects",   label: lang === "he" ? "פרויקטים" : "Projects" },
    { id: "experience", label: lang === "he" ? "ניסיון" : "Experience" },
    { id: "education",  label: lang === "he" ? "תעודות" : "Certifications" },
    { id: "contact",    label: "Mail" },
    { id: "notes",      label: lang === "he" ? "פתקים" : "Notes" },
    { id: "calculator", label: lang === "he" ? "מחשבון" : "Calculator" },
    { id: "terminal",   label: "Terminal" },
    { id: "settings",   label: lang === "he" ? "הגדרות" : "Settings" },
  ];

  const filtered = useMemo(
    () => apps.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [apps, query]
  );

  const launch = (id: AppId) => { setOpen(false); openApp(id); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[260] flex flex-col items-center pt-20 px-8"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(28px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: "rgba(8,6,4,0.55)" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Launchpad"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl flex flex-col items-center">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "he" ? "חיפוש" : "Search"}
              className="mb-10 w-72 text-center bg-white/10 border border-white/20 backdrop-blur-xl
                         rounded-full px-4 py-2 text-white placeholder-white/50 outline-none
                         focus:border-primary/60"
            />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-10 gap-y-8 w-full">
              {filtered.map((a, i) => {
                return (
                  <motion.button
                    key={a.id}
                    onClick={() => launch(a.id)}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025, type: "spring", stiffness: 280, damping: 22 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                      <AppIcon id={a.id} />
                    </div>
                    <span className="text-[12px] font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                      {a.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-12 text-[11px] text-white/60">
              {lang === "he" ? "Launchpad · F4 לפתיחה · ESC לסגירה" : "Launchpad · F4 to toggle · ESC to close"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Launchpad;