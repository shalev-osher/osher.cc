import { useState, useEffect, useMemo } from "react";
import { Menu, X, Download, Globe } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import useActiveSection from "@/hooks/useActiveSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const sectionIds = useMemo(() => ["about", "skills", "experience", "education", "contact"], []);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const navLinks = [
    { href: "#about", label: t("nav.about"), id: "about" },
    { href: "#skills", label: t("nav.skills"), id: "skills" },
    { href: "#experience", label: t("nav.experience"), id: "experience" },
    { href: "#education", label: t("nav.certifications"), id: "education" },
    { href: "#contact", label: t("nav.contact"), id: "contact" },
  ];

  const toggleLang = () => setLang(lang === "en" ? "he" : "en");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="font-display text-2xl font-bold text-gradient" aria-label="Shalev Osher - Home">
              Shalev Osher
            </a>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                    activeSection === link.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  aria-current={activeSection === link.id ? "true" : undefined}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute -bottom-1 start-0 end-0 h-0.5 rounded-full bg-primary animate-fade-in" />
                  )}
                </a>
              ))}
              <a
                href="/cv/shalev-osher-cv.pdf"
                download
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                aria-label="Download CV"
              >
                <Download className="w-4 h-4" />
                CV
              </a>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                aria-label={`Switch to ${lang === "en" ? "Hebrew" : "English"}`}
              >
                <Globe className="w-4 h-4" />
                {lang === "en" ? "HE" : "EN"}
              </button>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleLang}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors text-xs font-bold"
                aria-label={`Switch to ${lang === "en" ? "Hebrew" : "English"}`}
              >
                {lang === "en" ? "HE" : "EN"}
              </button>
              <a
                href="/cv/shalev-osher-cv.pdf"
                download
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Download CV"
              >
                <Download size={18} />
              </a>
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsMobileOpen(false)}
            className={`font-display text-3xl font-semibold transition-colors duration-300 ${
              activeSection === link.id ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            style={{ transitionDelay: isMobileOpen ? `${i * 50}ms` : "0ms" }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;
