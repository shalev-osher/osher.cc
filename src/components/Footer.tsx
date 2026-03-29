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
    <footer className="pt-4 pb-3 border-t border-border/50 relative" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <a href="#" className="font-display text-2xl font-bold text-gradient-warm" aria-label="Shalev Osher - Back to top">
              {lang === "he" ? "שליו אושר" : "Shalev Osher"}
            </a>
            <p className="text-muted-foreground text-sm mt-2">{t("footer.rights")}</p>
          </div>

          <nav className="flex items-center gap-3" aria-label="Social media links">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            ))}
          </nav>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
