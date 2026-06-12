import { useEffect, useState } from "react";
import { Battery, Wifi, Search, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/** macOS-style top menu bar: brand glyph + menu items on the start, status + clock on the end. */
const MacMenuBar = () => {
  const { lang } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const appName = lang === "he" ? "שליו" : "Shalev";
  const menus = lang === "he"
    ? [appName, "קובץ", "עריכה", "תצוגה", "חלון", "עזרה"]
    : [appName, "File", "Edit", "View", "Window", "Help"];

  return (
    <div
      className="fixed top-0 inset-x-0 z-[210] h-7 flex items-center px-3 text-[12px]
                 bg-black/55 backdrop-blur-2xl border-b border-white/10 text-white/90 select-none"
      role="presentation"
    >
      {/* Brand glyph (generic, not Apple) */}
      <button
        onClick={() => (window.location.hash = "#home")}
        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/10"
        aria-label="Home"
      >
        <Sparkles size={13} className="text-primary" />
      </button>

      {/* Menus */}
      <div className="flex items-center gap-0.5 ms-1">
        {menus.map((m, i) => (
          <button
            key={m + i}
            className={`px-2 py-0.5 rounded hover:bg-white/10 transition-colors ${i === 0 ? "font-semibold" : "font-normal"}`}
            tabIndex={-1}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Status cluster + clock */}
      <div className="ms-auto flex items-center gap-1 text-white/85">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-control-center"))}
          className="hover:bg-white/10 rounded p-1 flex items-center gap-1.5"
          aria-label="Control Center"
        >
          <Battery size={16} className="opacity-90" />
          <Wifi size={13} className="opacity-90" />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="hover:bg-white/10 rounded p-1"
          aria-label="Spotlight"
        >
          <Search size={13} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-notification-center"))}
          className="hover:bg-white/10 rounded px-2 py-0.5 tabular-nums tracking-tight"
          aria-label="Notifications"
        >
          {date}  {time}
        </button>
      </div>
    </div>
  );
};

export default MacMenuBar;