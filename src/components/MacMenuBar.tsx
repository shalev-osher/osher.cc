import { useEffect, useState } from "react";
import { Battery, Wifi, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/** macOS-style top menu bar: brand glyph + menu items on the start, status + clock on the end. */
const MacMenuBar = () => {
  const { lang, t } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const appName = lang === "he" ? "שליו אושר" : "Shalev Osher";
  const sections: { id: string; label: string }[] = [
    { id: "home", label: appName },
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "projects", label: lang === "he" ? "פרויקטים" : "Projects" },
    { id: "experience", label: t("nav.experience") },
    { id: "education", label: t("nav.certifications") },
    { id: "contact", label: t("nav.contact") },
  ];

  const goTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="fixed top-0 inset-x-0 z-[210] h-7 flex items-center px-3 text-[12px]
                 bg-transparent text-white/90 select-none
                 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
      role="presentation"
    >
      {/* Brand wordmark */}
      <button
        onClick={() => goTo("home")}
        className="flex items-center justify-center px-1.5 h-6 rounded-md hover:bg-white/10 font-display font-black tracking-[0.04em] text-white text-[14px] leading-none"
        aria-label="Home"
      >
        SO
      </button>

      {/* Section menus */}
      <div className="flex items-center gap-0.5 ms-1">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            className={`px-2 py-0.5 rounded hover:bg-white/10 transition-colors font-display tracking-tight ${i === 0 ? "font-bold" : "font-medium"}`}
          >
            {s.label}
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