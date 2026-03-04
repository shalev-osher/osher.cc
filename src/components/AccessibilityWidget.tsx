import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Sun, Moon, Underline, MousePointer2, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface A11ySettings {
  fontSize: number;
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
    const sizes = ["100%", "115%", "130%"];
    root.style.fontSize = sizes[s.fontSize] || "100%";
    root.classList.toggle("a11y-high-contrast", s.highContrast);
    root.classList.toggle("a11y-underline-links", s.underlineLinks);
    root.classList.toggle("a11y-big-cursor", s.bigCursor);
    root.classList.toggle("a11y-pause-animations", s.pauseAnimations);
  }, []);

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem("a11y-settings", JSON.stringify(settings));
  }, [settings, applySettings]);

  const update = (key: keyof A11ySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setSettings(defaultSettings);

  const fontLabel = ["Normal", "Large", "Extra Large"][settings.fontSize];

  return (
    <>
      {/* Wheelchair FAB - always blue */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
        }}
        aria-label="Open accessibility menu"
        title="Accessibility"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1a5 5 0 1 0 5.9 5.9h-2.07z" />
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
              aria-label="Accessibility menu"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#2563eb" }}>
                    <circle cx="12" cy="4" r="2" />
                    <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1a5 5 0 1 0 5.9 5.9h-2.07z" />
                  </svg>
                  Accessibility
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="Close accessibility menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                {/* Font Size */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm font-medium">Font Size: {fontLabel}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => update("fontSize", Math.max(0, settings.fontSize - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                      disabled={settings.fontSize === 0}
                      aria-label="Decrease font size"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => update("fontSize", Math.min(2, settings.fontSize + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                      disabled={settings.fontSize === 2}
                      aria-label="Increase font size"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <ToggleOption
                  icon={settings.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  label="High Contrast"
                  active={settings.highContrast}
                  onClick={() => update("highContrast", !settings.highContrast)}
                />

                <ToggleOption
                  icon={<Underline className="w-4 h-4" />}
                  label="Highlight Links"
                  active={settings.underlineLinks}
                  onClick={() => update("underlineLinks", !settings.underlineLinks)}
                />

                <ToggleOption
                  icon={<MousePointer2 className="w-4 h-4" />}
                  label="Large Cursor"
                  active={settings.bigCursor}
                  onClick={() => update("bigCursor", !settings.bigCursor)}
                />

                <ToggleOption
                  icon={settings.pauseAnimations ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  label="Stop Animations"
                  active={settings.pauseAnimations}
                  onClick={() => update("pauseAnimations", !settings.pauseAnimations)}
                />

                <button
                  onClick={reset}
                  className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  Reset Settings
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
    <span className={`ml-auto w-9 h-5 rounded-full relative transition-colors duration-200 ${active ? "bg-primary" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-all duration-200 ${active ? "right-0.5" : "left-0.5"}`} />
    </span>
  </button>
);

export default AccessibilityWidget;
