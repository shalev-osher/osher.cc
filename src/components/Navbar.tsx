import { useState, useEffect, useMemo } from "react";
import { Menu, X, Download } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";
import useActiveSection from "@/hooks/useActiveSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCvDownload } from "@/lib/trackCvDownload";

const navButtonHover = {
  scale: 1.07,
  y: -2,
  transition: { type: "spring" as const, stiffness: 400, damping: 15 },
};
const navButtonTap = { scale: 0.95 };

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const sectionIds = useMemo(() => ["about", "skills", "experience", "education", "contact"], []);
  const activeSection = useActiveSection(sectionIds);

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
        className="fixed top-0 inset-x-0 z-[200] bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="font-display text-xl sm:text-2xl font-bold text-gradient" aria-label="Shalev Osher - Home">
              {lang === "he" ? "שליו אושר" : "Shalev Osher"}
            </a>
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <MagneticButton key={link.href} strength={0.25} radius={40}>
                  <motion.a
                    href={link.href}
                    whileHover={navButtonHover}
                    whileTap={navButtonTap}
                    className={`text-sm font-bold font-display px-3 py-1.5 rounded-lg border transition-colors duration-300 ${
                      activeSection === link.id
                        ? "bg-primary/25 text-primary border-primary/40 shadow-sm shadow-primary/10"
                        : "bg-primary/10 text-foreground/80 border-border/60 hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                    }`}
                    aria-current={activeSection === link.id ? "true" : undefined}
                  >
                    {link.label}
                  </motion.a>
                </MagneticButton>
              ))}
              <MagneticButton strength={0.25} radius={40}>
                <motion.a
                  href="/cv/shalev-osher-cv.pdf"
                  download
                  onClick={() => trackCvDownload(lang)}
                  whileHover={navButtonHover}
                  whileTap={navButtonTap}
                  className="text-sm font-bold font-display px-3 py-1.5 rounded-lg border border-border/60 bg-primary/10 text-foreground/80 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-300"
                  aria-label="Download CV"
                >
                  CV
                </motion.a>
              </MagneticButton>
              <MagneticButton strength={0.25} radius={40}>
                <motion.button
                  onClick={toggleLang}
                  whileHover={navButtonHover}
                  whileTap={navButtonTap}
                  className="text-sm font-bold font-display px-3 py-1.5 rounded-lg border border-border/60 bg-primary/10 text-foreground/80 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-300"
                  aria-label={`Switch to ${lang === "en" ? "Hebrew" : "English"}`}
                >
                  {lang === "en" ? "HE" : "EN"}
                </motion.button>
              </MagneticButton>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleLang}
                className="w-9 h-9 rounded-lg border border-border/50 bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-bold"
                aria-label={`Switch to ${lang === "en" ? "Hebrew" : "English"}`}
              >
                {lang === "en" ? "HE" : "EN"}
              </button>
              <a
                href="/cv/shalev-osher-cv.pdf"
                download
                onClick={() => trackCvDownload(lang)}
                className="w-9 h-9 rounded-lg border border-border/50 bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Download CV"
              >
                <Download size={16} />
              </a>
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="w-9 h-9 rounded-lg border border-border/50 bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 transition-all duration-300 md:hidden ${
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
            className={`font-display text-2xl sm:text-3xl font-semibold transition-all duration-300 px-6 py-2 rounded-xl ${
              activeSection === link.id
                ? "text-primary bg-primary/10"
                : "text-foreground hover:text-primary hover:bg-primary/5"
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
