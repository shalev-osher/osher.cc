import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="pt-3 pb-24 border-t border-border/50 relative" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
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
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
