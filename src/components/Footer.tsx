import { Github, Linkedin, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/shalev-osher/", label: "LinkedIn" },
    { icon: Facebook, href: "https://www.facebook.com/Mr.ShalevOsher/", label: "Facebook" },
    { icon: Github, href: "https://github.com/Shalev-osher", label: "GitHub" },
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 py-4 border-t border-border/50 bg-background/80 backdrop-blur-xl" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="flex items-center gap-3" aria-label="Social media links">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            ))}
          </nav>

          <p className="text-muted-foreground text-sm">{t("footer.rights")}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
