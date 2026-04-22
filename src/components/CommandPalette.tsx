import { useEffect, useState, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Download,
  Sun,
  Moon,
  Languages,
  Home,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCvDownload } from "@/lib/trackCvDownload";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Listen for custom event so other components (e.g. floating button) can open
  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener("open-command-palette", open);
    return () => window.removeEventListener("open-command-palette", open);
  }, []);

  const go = useCallback((id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const external = useCallback((url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const downloadCV = useCallback(() => {
    setOpen(false);
    trackCvDownload(lang);
    const a = document.createElement("a");
    a.href = "/cv/shalev-osher-cv.pdf";
    a.download = "shalev-osher-cv.pdf";
    a.click();
  }, [lang]);

  const toggleTheme = useCallback(() => {
    setOpen(false);
    document.documentElement.classList.toggle("dark");
    try {
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, []);

  const switchLang = useCallback(() => {
    setLang(lang === "en" ? "he" : "en");
    setOpen(false);
  }, [lang, setLang]);

  const openChat = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-telegram-chat"));
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={lang === "he" ? "חפש פעולה או סקשן..." : "Search actions or sections..."}
      />
      <CommandList>
        <CommandEmpty>{lang === "he" ? "לא נמצאו תוצאות." : "No results found."}</CommandEmpty>

        <CommandGroup heading={lang === "he" ? "ניווט" : "Navigation"}>
          <CommandItem onSelect={() => go("hero")}>
            <Home className="me-2 h-4 w-4" />
            <span>{lang === "he" ? "דף הבית" : "Home"}</span>
          </CommandItem>
          <CommandItem onSelect={() => go("about")}>
            <User className="me-2 h-4 w-4" />
            <span>{t("nav.about")}</span>
          </CommandItem>
          <CommandItem onSelect={() => go("skills")}>
            <Wrench className="me-2 h-4 w-4" />
            <span>{t("nav.skills")}</span>
          </CommandItem>
          <CommandItem onSelect={() => go("experience")}>
            <Briefcase className="me-2 h-4 w-4" />
            <span>{t("nav.experience")}</span>
          </CommandItem>
          <CommandItem onSelect={() => go("education")}>
            <GraduationCap className="me-2 h-4 w-4" />
            <span>{t("nav.certifications")}</span>
          </CommandItem>
          <CommandItem onSelect={() => go("contact")}>
            <Mail className="me-2 h-4 w-4" />
            <span>{t("nav.contact")}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={lang === "he" ? "פעולות" : "Actions"}>
          <CommandItem onSelect={downloadCV}>
            <Download className="me-2 h-4 w-4" />
            <span>{t("hero.downloadCV")}</span>
            <CommandShortcut>PDF</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={openChat}>
            <MessageCircle className="me-2 h-4 w-4" />
            <span>{lang === "he" ? "פתח צ'אט AI" : "Open AI Chat"}</span>
          </CommandItem>
          <CommandItem onSelect={toggleTheme}>
            <Sun className="me-2 h-4 w-4 dark:hidden" />
            <Moon className="me-2 h-4 w-4 hidden dark:inline-block" />
            <span>{lang === "he" ? "החלף ערכת נושא" : "Toggle theme"}</span>
          </CommandItem>
          <CommandItem onSelect={switchLang}>
            <Languages className="me-2 h-4 w-4" />
            <span>{lang === "he" ? "Switch to English" : "החלף לעברית"}</span>
            <CommandShortcut>{lang === "en" ? "HE" : "EN"}</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={lang === "he" ? "קישורים חיצוניים" : "External Links"}>
          <CommandItem onSelect={() => external("https://github.com/Shalev-osher")}>
            <Github className="me-2 h-4 w-4" />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => external("https://linkedin.com/in/shalev-osher/")}>
            <Linkedin className="me-2 h-4 w-4" />
            <span>LinkedIn</span>
          </CommandItem>
          <CommandItem onSelect={() => external("mailto:shalev@osher.cc")}>
            <Mail className="me-2 h-4 w-4" />
            <span>shalev@osher.cc</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={lang === "he" ? "ביצי פסחא 🥚" : "Easter Eggs 🥚"}>
          <CommandItem onSelect={() => { setOpen(false); window.dispatchEvent(new CustomEvent("trigger-snake")); }}>
            <Sparkles className="me-2 h-4 w-4" />
            <span>{lang === "he" ? "שחק Snake 🐍" : "Play Snake 🐍"}</span>
          </CommandItem>
          <CommandItem onSelect={() => { setOpen(false); window.dispatchEvent(new CustomEvent("trigger-matrix")); }}>
            <Sparkles className="me-2 h-4 w-4" />
            <span>{lang === "he" ? "גשם מטריקס מוזהב" : "Golden Matrix Rain"}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
