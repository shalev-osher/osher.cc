import { Github, Linkedin, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/shalev-osher/", label: "LinkedIn" },
    { icon: Facebook, href: "https://www.facebook.com/Mr.ShalevOsher/", label: "Facebook" },
    { icon: Github, href: "https://github.com/Shalev-osher", label: "GitHub" },
  ];

  return (
    <footer className="py-12 border-t border-border/50 relative" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <a href="#" className="font-display text-2xl font-bold text-gradient-warm" aria-label="Shalev Osher - Back to top">
              Shalev Osher
            </a>
            <p className="text-muted-foreground text-sm mt-2">
              © 2026 All rights reserved
            </p>
          </div>

          <nav className="flex items-center gap-3" aria-label="Social media links">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <link.icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
