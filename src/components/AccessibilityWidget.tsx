import { useState, useEffect, useCallback } from "react";
import {
  X, ZoomIn, ZoomOut, Sun, Moon, Underline, MousePointer2,
  Pause, Play, Type, AlignCenter, Eye, Minus, RotateCcw,
  MonitorSmartphone, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface A11ySettings {
  fontSize: number;        // 0=normal, 1=large, 2=xl
  highContrast: boolean;
  underlineLinks: boolean;
  bigCursor: boolean;
  pauseAnimations: boolean;
  dyslexiaFont: boolean;
  textSpacing: boolean;
  saturation: number;      // 0=normal, 1=low, 2=grayscale
  highlightFocus: boolean;
  readableFont: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: 0,
  highContrast: false,
  underlineLinks: false,
  bigCursor: false,
  pauseAnimations: false,
  dyslexiaFont: false,
  textSpacing: false,
  saturation: 0,
  highlightFocus: false,
  readableFont: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(() => {
    try {
      const saved = localStorage.getItem("a11y-settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const applySettings = useCallback((s: A11ySettings) => {
    const root = document.documentElement;

    // Font size
    const sizes = ["100%", "115%", "130%"];
    root.style.fontSize = sizes[s.fontSize] || "100%";

    // Classes
    root.classList.toggle("a11y-high-contrast", s.highContrast);
    root.classList.toggle("a11y-underline-links", s.underlineLinks);
    root.classList.toggle("a11y-big-cursor", s.bigCursor);
    root.classList.toggle("a11y-pause-animations", s.pauseAnimations);
    root.classList.toggle("a11y-dyslexia-font", s.dyslexiaFont);
    root.classList.toggle("a11y-text-spacing", s.textSpacing);
    root.classList.toggle("a11y-highlight-focus", s.highlightFocus);
    root.classList.toggle("a11y-readable-font", s.readableFont);

    // Saturation
    root.classList.toggle("a11y-low-saturation", s.saturation === 1);
    root.classList.toggle("a11y-grayscale", s.saturation === 2);
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
  const saturationLabel = ["Normal", "Low", "Grayscale"][settings.saturation];

  const activeCount = Object.entries(settings).filter(([key, val]) => {
    if (key === "fontSize") return val !== 0;
    if (key === "saturation") return val !== 0;
    return val === true;
  }).length;

  return (
    <>
      {/* Wheelchair FAB */}
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1a5 5 0 1 0 5.9 5.9h-2.07z" />
        </svg>
        {activeCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: "#ef4444", color: "#fff" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* Menu */}
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
              className="fixed bottom-6 right-6 z-[100] w-[340px] max-h-[85vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="dialog"
              aria-label="Accessibility menu"
              aria-modal="true"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card rounded-t-2xl">
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
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {/* === Content Adjustments === */}
                <SectionLabel>Content Adjustments</SectionLabel>

                {/* Font Size */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Type className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium">Text Size: {fontLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SmallBtn onClick={() => update("fontSize", Math.max(0, settings.fontSize - 1))} disabled={settings.fontSize === 0} label="Decrease">
                      <ZoomOut className="w-3.5 h-3.5" />
                    </SmallBtn>
                    <SmallBtn onClick={() => update("fontSize", Math.min(2, settings.fontSize + 1))} disabled={settings.fontSize === 2} label="Increase">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </SmallBtn>
                  </div>
                </div>

                <ToggleOption icon={<AlignCenter className="w-4 h-4" />} label="Text Spacing" active={settings.textSpacing} onClick={() => update("textSpacing", !settings.textSpacing)} />
                <ToggleOption icon={<BookOpen className="w-4 h-4" />} label="Readable Font" active={settings.readableFont} onClick={() => update("readableFont", !settings.readableFont)} />
                <ToggleOption icon={<Type className="w-4 h-4" />} label="Dyslexia Friendly" active={settings.dyslexiaFont} onClick={() => update("dyslexiaFont", !settings.dyslexiaFont)} />

                {/* === Visual Adjustments === */}
                <SectionLabel>Visual Adjustments</SectionLabel>

                <ToggleOption
                  icon={settings.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  label="High Contrast"
                  active={settings.highContrast}
                  onClick={() => update("highContrast", !settings.highContrast)}
                />

                {/* Saturation */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium">Saturation: {saturationLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SmallBtn onClick={() => update("saturation", Math.max(0, settings.saturation - 1))} disabled={settings.saturation === 0} label="More color">
                      <Minus className="w-3.5 h-3.5" />
                    </SmallBtn>
                    <SmallBtn onClick={() => update("saturation", Math.min(2, settings.saturation + 1))} disabled={settings.saturation === 2} label="Less color">
                      <Eye className="w-3.5 h-3.5" />
                    </SmallBtn>
                  </div>
                </div>

                {/* === Navigation === */}
                <SectionLabel>Navigation</SectionLabel>

                <ToggleOption icon={<Underline className="w-4 h-4" />} label="Highlight Links" active={settings.underlineLinks} onClick={() => update("underlineLinks", !settings.underlineLinks)} />
                <ToggleOption icon={<MousePointer2 className="w-4 h-4" />} label="Large Cursor" active={settings.bigCursor} onClick={() => update("bigCursor", !settings.bigCursor)} />
                <ToggleOption icon={<MonitorSmartphone className="w-4 h-4" />} label="Focus Highlight" active={settings.highlightFocus} onClick={() => update("highlightFocus", !settings.highlightFocus)} />
                <ToggleOption
                  icon={settings.pauseAnimations ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  label="Stop Animations"
                  active={settings.pauseAnimations}
                  onClick={() => update("pauseAnimations", !settings.pauseAnimations)}
                />

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Settings
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2 pb-1 px-1">{children}</p>
);

const SmallBtn = ({ onClick, disabled, label, children }: { onClick: () => void; disabled: boolean; label: string; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
    aria-label={label}
  >
    {children}
  </button>
);

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
    className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      active
        ? "bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30"
        : "bg-secondary/50 text-foreground hover:bg-secondary border border-transparent"
    }`}
    role="switch"
    aria-checked={active}
  >
    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-[#2563eb]/20" : "bg-muted"}`}>
      {icon}
    </span>
    {label}
    <span className={`ml-auto w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ${active ? "bg-[#2563eb]" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-all duration-200 ${active ? "right-0.5" : "left-0.5"}`} />
    </span>
  </button>
);

export default AccessibilityWidget;
