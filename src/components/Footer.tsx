import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/shalev-osher/", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <a href="#" className="font-display text-2xl font-bold text-gradient">
              Shalev Osher
            </a>
            <p className="text-muted-foreground text-sm mt-2">
              © 2024 כל הזכויות שמורות
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
