import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Moon, Sun, Underline, MousePointer2, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface A11ySettings {
  fontSize: number; // 0 = normal, 1 = large, 2 = xl
  highContrast: boolean;
  underlineLinks: boolean;
  bigCursor: boolean;
  pauseAnimations: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: 0,
  highContrast: false,
  underlineLinks: false,
  bigCursor: false,
  pauseAnimations: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(() => {
    try {
      const saved = localStorage.getItem("a11y-settings");
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const applySettings = useCallback((s: A11ySettings) => {
    const root = document.documentElement;

    // Font size
    const sizes = ["100%", "115%", "130%"];
    root.style.fontSize = sizes[s.fontSize] || "100%";

    // High contrast
    root.classList.toggle("a11y-high-contrast", s.highContrast);

    // Underline links
    root.classList.toggle("a11y-underline-links", s.underlineLinks);

    // Big cursor
    root.classList.toggle("a11y-big-cursor", s.bigCursor);

    // Pause animations
    root.classList.toggle("a11y-pause-animations", s.pauseAnimations);
  }, []);

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
  }, [settings, applySettings]);

  const update = (key: keyof A11ySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setSettings(defaultSettings);
  };

  const fontLabel = ["רגיל", "גדול", "גדול מאוד"][settings.fontSize];

  return (
    <>
      {/* Wheelchair FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="פתח תפריט נגישות"
        title="נגישות"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
          <path d="M12 7.5V12" />
          <path d="M8 10h8" />
          <path d="M9 12l-1.5 5.5" />
          <path d="M15 12l1.5 5.5" />
          <path d="M7.5 17.5a3 3 0 1 0 4 1" />
          <path d="M12.5 18.5a3 3 0 1 0 4-1" />
        </svg>
      </button>

      {/* Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-6 right-6 z-[100] w-[320px] max-h-[80vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="dialog"
              aria-label="תפריט נגישות"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M12 7.5V12" />
                    <path d="M8 10h8" />
                    <path d="M9 12l-1.5 5.5" />
                    <path d="M15 12l1.5 5.5" />
                    <path d="M7.5 17.5a3 3 0 1 0 4 1" />
                    <path d="M12.5 18.5a3 3 0 1 0 4-1" />
                  </svg>
                  נגישות
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="סגור תפריט נגישות"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                {/* Font Size */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm font-medium">גודל טקסט: {fontLabel}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => update("fontSize", Math.max(0, settings.fontSize - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                      disabled={settings.fontSize === 0}
                      aria-label="הקטן טקסט"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => update("fontSize", Math.min(2, settings.fontSize + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                      disabled={settings.fontSize === 2}
                      aria-label="הגדל טקסט"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* High Contrast */}
                <ToggleOption
                  icon={settings.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  label="ניגודיות גבוהה"
                  active={settings.highContrast}
                  onClick={() => update("highContrast", !settings.highContrast)}
                />

                {/* Underline Links */}
                <ToggleOption
                  icon={<Underline className="w-4 h-4" />}
                  label="הדגשת קישורים"
                  active={settings.underlineLinks}
                  onClick={() => update("underlineLinks", !settings.underlineLinks)}
                />

                {/* Big Cursor */}
                <ToggleOption
                  icon={<MousePointer2 className="w-4 h-4" />}
                  label="סמן גדול"
                  active={settings.bigCursor}
                  onClick={() => update("bigCursor", !settings.bigCursor)}
                />

                {/* Pause Animations */}
                <ToggleOption
                  icon={settings.pauseAnimations ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  label="עצירת אנימציות"
                  active={settings.pauseAnimations}
                  onClick={() => update("pauseAnimations", !settings.pauseAnimations)}
                />

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  איפוס הגדרות
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const ToggleOption = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      active
        ? "bg-primary/15 text-primary border border-primary/30"
        : "bg-secondary/50 text-foreground hover:bg-secondary border border-transparent"
    }`}
    role="switch"
    aria-checked={active}
  >
    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-primary/20" : "bg-muted"}`}>
      {icon}
    </span>
    {label}
    <span className={`mr-auto w-9 h-5 rounded-full relative transition-colors duration-200 ${active ? "bg-primary" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-all duration-200 ${active ? "right-0.5" : "right-[calc(100%-18px)]"}`} />
    </span>
  </button>
);

export default AccessibilityWidget;
