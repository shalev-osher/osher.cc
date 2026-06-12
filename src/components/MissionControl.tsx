import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const sections = [
  { id: "home", icon: "🏠" },
  { id: "about", icon: "👤" },
  { id: "skills", icon: "🛠️" },
  { id: "experience", icon: "💼" },
  { id: "projects", icon: "📁" },
  { id: "education", icon: "🎓" },
  { id: "contact", icon: "✉️" },
];

const labels: Record<string, { en: string; he: string }> = {
  home: { en: "Home", he: "בית" },
  about: { en: "About", he: "אודות" },
  skills: { en: "Skills", he: "כישורים" },
  experience: { en: "Experience", he: "ניסיון" },
  projects: { en: "Projects", he: "פרויקטים" },
  education: { en: "Certifications", he: "תעודות" },
  contact: { en: "Contact", he: "צור קשר" },
};

/**
 * Mission Control overlay (F3 or ⌃↑). Opens with the F3 key.
 * Shows section thumbnails in a grid; click to jump.
 */
const MissionControl = () => {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F3" || (e.ctrlKey && e.key === "ArrowUp")) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] bg-background/85 backdrop-blur-2xl flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Mission Control"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {sections.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => jump(s.id)}
                className="group aspect-[4/3] rounded-2xl border border-border/40 bg-gradient-to-br from-card to-background/60 shadow-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:scale-[1.04] transition-all"
                initial={{ opacity: 0, scale: 0.85, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-5xl">{s.icon}</span>
                <span className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                  {labels[s.id][lang as "en" | "he"]}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="fixed bottom-6 inset-x-0 text-center text-xs text-muted-foreground">
            {lang === "he" ? "Mission Control · F3 לפתיחה · ESC לסגירה" : "Mission Control · F3 to toggle · ESC to close"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MissionControl;