import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import useActiveSection from "@/hooks/useActiveSection";
import { useLanguage } from "@/contexts/LanguageContext";

const navButtonHover = {
  scale: 1.07,
  y: -2,
  transition: { type: "spring" as const, stiffness: 400, damping: 15 },
};
const navButtonTap = { scale: 0.95 };

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { lang, t } = useLanguage();

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
            <div className="flex items-center gap-2">
              <MagneticButton strength={0.25} radius={40}>
                <motion.button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  whileHover={navButtonHover}
                  whileTap={navButtonTap}
                  className="w-10 h-10 rounded-lg border border-border/60 bg-primary/10 flex items-center justify-center text-foreground/80 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors"
                  aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileOpen}
                >
                  {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
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
