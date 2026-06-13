import { useEffect, useRef, useState } from "react";
import { Battery, Wifi, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/** macOS-style top menu bar: brand glyph + menu items on the start, status + clock on the end. */
const MacMenuBar = () => {
  const { lang, t } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());
  const [focusedApp, setFocusedApp] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  // On desktop OS, the active "app name" comes from the focused window
  useEffect(() => {
    const onFocus = (e: Event) => setFocusedApp(((e as CustomEvent).detail as string) ?? null);
    window.addEventListener("desktop-focus-change", onFocus);
    return () => window.removeEventListener("desktop-focus-change", onFocus);
  }, []);

  const locale = lang === "he" ? "he-IL" : "en-US";
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const sections: { id: string; label: string }[] = [
    { id: "home", label: lang === "he" ? "בית" : "Home" },
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "projects", label: lang === "he" ? "פרויקטים" : "Projects" },
    { id: "experience", label: t("nav.experience") },
    { id: "education", label: t("nav.certifications") },
    { id: "contact", label: t("nav.contact") },
  ];

  // Track which section is currently in view → becomes the bold "app name"
  const [activeId, setActiveId] = useState<string>("home");
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const APP_LABELS: Record<string, string> = {
    finder: "Finder", terminal: "Terminal", home: lang === "he" ? "בית" : "Home",
    about: t("nav.about"), skills: t("nav.skills"),
    projects: lang === "he" ? "פרויקטים" : "Projects",
    experience: t("nav.experience"), education: t("nav.certifications"),
    contact: t("nav.contact"),
    calculator: lang === "he" ? "מחשבון" : "Calculator",
    notes: lang === "he" ? "פתקים" : "Notes",
    settings: lang === "he" ? "הגדרות" : "Settings",
  };
  const activeLabel = focusedApp
    ? APP_LABELS[focusedApp] ?? sections[0].label
    : sections.find((s) => s.id === activeId)?.label ?? sections[0].label;

  // Are we inside the desktop OS shell? (affects menu behavior)
  const isDesktopOS = typeof document !== "undefined" && !!document.getElementById("desktop-root");

  // --- Tiny dropdown system ---
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!menuRootRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", esc); };
  }, []);
  const fire = (event: string) => { window.dispatchEvent(new CustomEvent(event)); setOpenMenu(null); };
  const openApp = (id: string) => { window.dispatchEvent(new CustomEvent("open-app", { detail: id })); setOpenMenu(null); };

  const goTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      data-menu-bar
      className="fixed top-0 inset-x-0 z-[210] h-7 flex items-center px-3 text-[12px]
                 bg-transparent text-white/90 select-none
                 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
      role="presentation"
    >
      <div ref={menuRootRef} className="flex items-center">
        {/* Brand wordmark — Apple-style menu */}
        <div className="relative">
          <button
            onClick={() => isDesktopOS ? setOpenMenu(openMenu === "brand" ? null : "brand") : goTo("home")}
            className="flex items-center justify-center px-2 h-6 rounded-md hover:bg-white/10 font-display font-black tracking-[0.04em] text-white text-[14px] leading-none"
            aria-label="Apple menu"
          >
            SO
          </button>
          {openMenu === "brand" && isDesktopOS && (
            <BrandMenu onClose={() => setOpenMenu(null)} openApp={openApp} fire={fire} />
          )}
        </div>

        {/* Section / App menus */}
        <div className="flex items-center gap-0.5 ms-1">
          {/* Active "app name" — dropdown on desktop, scroll trigger on mobile */}
          <div className="relative">
            <button
              key={focusedApp ?? activeId}
              onClick={() => isDesktopOS ? setOpenMenu(openMenu === "app" ? null : "app") : undefined}
              className="px-2 py-0.5 font-display font-bold tracking-tight animate-fade-in rounded hover:bg-white/10"
            >
              {activeLabel}
            </button>
            {openMenu === "app" && isDesktopOS && (
              <AppMenu focusedApp={focusedApp} fire={fire} lang={lang} />
            )}
          </div>
          {/* On mobile show scroll-to-section nav */}
          {!isDesktopOS && sections
            .filter((s) => s.id !== activeId)
            .map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className="px-2 py-0.5 rounded hover:bg-white/10 transition-colors font-display font-medium tracking-tight"
              >
                {s.label}
              </button>
            ))}
          {/* On desktop add Window + Help menus */}
          {isDesktopOS && (
            <>
              <DropdownTrigger label={lang === "he" ? "חלון" : "Window"} id="window" openMenu={openMenu} setOpenMenu={setOpenMenu}>
                <MenuLine onClick={() => fire("toggle-launchpad")} shortcut="F4">{lang === "he" ? "Launchpad" : "Launchpad"}</MenuLine>
                <MenuLine onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "F3" }))} shortcut="F3">Mission Control</MenuLine>
                <Sep />
                <MenuLine onClick={() => openApp("finder")}>New Finder Window</MenuLine>
                <MenuLine onClick={() => openApp("terminal")}>Open Terminal</MenuLine>
                <MenuLine onClick={() => openApp("notes")}>Open Notes</MenuLine>
                <MenuLine onClick={() => openApp("calculator")}>Open Calculator</MenuLine>
              </DropdownTrigger>
              <DropdownTrigger label={lang === "he" ? "עזרה" : "Help"} id="help" openMenu={openMenu} setOpenMenu={setOpenMenu}>
                <MenuLine onClick={() => fire("open-command-palette")} shortcut="⌘K">Spotlight Search…</MenuLine>
                <Sep />
                <MenuLine onClick={() => window.open("https://github.com/Shalev-osher", "_blank")}>GitHub Profile ↗</MenuLine>
                <MenuLine onClick={() => window.open("mailto:shalev@osher.cc")}>Contact Support ↗</MenuLine>
              </DropdownTrigger>
            </>
          )}
        </div>
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

/* ───────── Menu primitives ───────── */

const MenuPanel = ({ children }: { children: React.ReactNode }) => (
  <div
    onMouseDown={(e) => e.stopPropagation()}
    className="absolute top-full start-0 mt-1 min-w-[220px] py-1.5 rounded-xl
               border border-white/15 bg-[hsl(220_15%_12%/0.92)] backdrop-blur-2xl
               shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] text-white text-[12px] z-[260]"
  >
    {children}
  </div>
);

const MenuLine = ({
  children, onClick, shortcut, danger,
}: { children: React.ReactNode; onClick: () => void; shortcut?: string; danger?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full text-start px-3 py-1.5 flex items-center justify-between transition-colors
                ${danger ? "hover:bg-[#ff5f57]/40" : "hover:bg-primary/30"}`}
  >
    <span>{children}</span>
    {shortcut && <span className="text-white/50 text-[11px] ms-4 tabular-nums">{shortcut}</span>}
  </button>
);

const Sep = () => <div className="my-1 mx-2 h-px bg-white/10" />;

const DropdownTrigger = ({
  label, id, openMenu, setOpenMenu, children,
}: {
  label: string; id: string;
  openMenu: string | null; setOpenMenu: (v: string | null) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <button
      onClick={() => setOpenMenu(openMenu === id ? null : id)}
      className="px-2 py-0.5 rounded hover:bg-white/10 transition-colors font-display font-medium tracking-tight"
    >
      {label}
    </button>
    {openMenu === id && <MenuPanel>{children}</MenuPanel>}
  </div>
);

const BrandMenu = ({
  onClose, openApp, fire,
}: { onClose: () => void; openApp: (id: string) => void; fire: (event: string) => void }) => (
  <MenuPanel>
    <div className="px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/40">osher.cc OS · 27.1</div>
    <Sep />
    <MenuLine onClick={() => openApp("settings")} shortcut="⌘,">System Settings…</MenuLine>
    <MenuLine onClick={() => openApp("about")}>About this Site</MenuLine>
    <Sep />
    <MenuLine onClick={() => fire("lock-screen")} shortcut="⌃⌘Q">Lock Screen</MenuLine>
    <MenuLine onClick={() => { onClose(); window.location.reload(); }}>Restart…</MenuLine>
    <Sep />
    <MenuLine onClick={() => window.open("https://github.com/Shalev-osher", "_blank")}>Visit GitHub ↗</MenuLine>
  </MenuPanel>
);

const AppMenu = ({
  focusedApp, fire, lang,
}: { focusedApp: string | null; fire: (event: string) => void; lang: string }) => {
  const dispatch = (event: string, detail?: any) =>
    window.dispatchEvent(new CustomEvent(event, { detail }));
  return (
    <MenuPanel>
      <MenuLine onClick={() => dispatch("open-app", focusedApp ?? "home")}>
        {lang === "he" ? "פתח חלון חדש" : "New Window"}
      </MenuLine>
      <Sep />
      <MenuLine
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "w", metaKey: true }))}
        shortcut="⌘W"
      >
        {lang === "he" ? "סגור חלון" : "Close Window"}
      </MenuLine>
      <MenuLine
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "m", metaKey: true }))}
        shortcut="⌘M"
      >
        {lang === "he" ? "מזער" : "Minimize"}
      </MenuLine>
      <Sep />
      <MenuLine
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", metaKey: true, altKey: true }))}
        shortcut="⌥⌘⎋"
        danger
      >
        {lang === "he" ? "סגירה כפויה…" : "Force Quit…"}
      </MenuLine>
    </MenuPanel>
  );
};