import { Github, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/shalev-osher/", label: "LinkedIn" },
    { icon: Facebook, href: "https://www.facebook.com/Mr.ShalevOsher/", label: "Facebook" },
    { icon: Github, href: "https://github.com/Shalev-osher", label: "GitHub" },
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 py-4 pointer-events-none" role="contentinfo">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-2 text-center pointer-events-auto">
          <nav className="flex items-center gap-3" aria-label="Social media links">
            {socialLinks.map((link) => (
              <a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors duration-200"
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </nav>

          <p className="text-muted-foreground text-sm">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
