import { Github, Linkedin, Facebook, Mail, Home, MessageCircle } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, lang } = useLanguage();

  const dockItems = [
    { icon: Home, label: lang === "he" ? "בית" : "Home", href: "#home" },
    { icon: Mail, label: "Mail", href: "mailto:shalev@osher.cc" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/shalev-osher/" },
    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/Mr.ShalevOsher/" },
    { icon: Github, label: "GitHub", href: "https://github.com/Shalev-osher" },
    {
      icon: MessageCircle,
      label: lang === "he" ? "צ'אט AI" : "AI Chat",
      href: "#",
      onClick: () => window.dispatchEvent(new CustomEvent("open-telegram-chat")),
    },
  ];

  return (
    <footer className="pt-3 pb-2 border-t border-border/50 relative" role="contentinfo">
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

          <Dock items={dockItems} />
        </motion.div>
      </div>
    </footer>
  );
};

interface DockItem {
  icon: any;
  label: string;
  href: string;
  onClick?: () => void;
}

const Dock = ({ items }: { items: DockItem[] }) => {
  const mouseX = useMotionValue<number | null>(null);

  return (
    <nav
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
      className="flex items-end gap-2 px-4 py-2 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl"
      aria-label="Dock"
    >
      {items.map((item) => (
        <DockIcon key={item.label} item={item} mouseX={mouseX} />
      ))}
    </nav>
  );
};

const DockIcon = ({ item, mouseX }: { item: DockItem; mouseX: ReturnType<typeof useMotionValue<number | null>> }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (mx) => {
    if (mx === null || !ref.current) return 9999;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(mx - (rect.left + rect.width / 2));
  });
  const sizeRaw = useTransform(distance, [0, 80, 160], [56, 44, 40]);
  const size = useSpring(sizeRaw, { stiffness: 220, damping: 18, mass: 0.4 });

  const isExternal = item.href.startsWith("http") || item.href.startsWith("mailto:");

  return (
    <motion.a
      ref={ref}
      href={item.href}
      onClick={item.onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={item.label}
      title={item.label}
      style={{ width: size, height: size }}
      className="rounded-2xl flex items-center justify-center bg-gradient-to-b from-primary/15 to-primary/5 border border-primary/20 text-foreground hover:text-primary transition-colors"
    >
      <item.icon className="w-1/2 h-1/2" aria-hidden="true" />
    </motion.a>
  );
};

export default Footer;
