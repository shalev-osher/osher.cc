import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { iosIcons, type IosIconKey } from "./ios/iconSet";

interface DockItem {
  label: string;
  href: string;
  icon: IosIconKey;
  onClick?: () => void;
  external?: boolean;
}

const MacDock = () => {
  const { lang } = useLanguage();

  const items: DockItem[] = [
    { label: "Finder",   href: "#home",        icon: "finder" },
    { label: lang === "he" ? "אודות" : "About",       href: "#about",      icon: "about" },
    { label: lang === "he" ? "מיומנויות" : "Skills",   href: "#skills",     icon: "skills" },
    { label: lang === "he" ? "פרויקטים" : "Projects",  href: "#projects",   icon: "projects" },
    { label: lang === "he" ? "ניסיון" : "Experience",  href: "#experience", icon: "experience" },
    { label: lang === "he" ? "השכלה" : "Education",    href: "#education",  icon: "education" },
    { label: "Mail",     href: "#contact",     icon: "mail" },
    { label: lang === "he" ? "הודעות" : "Messages",    href: "#", icon: "messages",
      onClick: () => window.dispatchEvent(new CustomEvent("open-telegram-chat")) },
    { label: lang === "he" ? "גלול למעלה" : "Scroll to top", href: "#", icon: "scrollUp",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: lang === "he" ? "סקשן הבא" : "Next section", href: "#", icon: "scrollDown",
      onClick: () => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
        const cur = window.scrollY + window.innerHeight * 0.25;
        const next = sections.find((s) => s.offsetTop > cur + 1);
        if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      } },
    { label: lang === "he" ? "הגדרות" : "Settings",    href: "#", icon: "settings",
      onClick: () => window.dispatchEvent(new CustomEvent("toggle-control-center")) },
    { label: "LinkedIn", href: "https://linkedin.com/in/shalev-osher/",   icon: "linkedin", external: true },
    { label: "Facebook", href: "https://www.facebook.com/Mr.ShalevOsher/", icon: "facebook", external: true },
    { label: "GitHub",   href: "https://github.com/Shalev-osher",         icon: "github",   external: true },
    { label: lang === "he" ? "חיפוש" : "Spotlight",    href: "#", icon: "spotlight",
      onClick: () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true })) },
  ];

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div
      dir="ltr"
      className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-3"
      aria-hidden="false"
    >
      <motion.nav
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
        className="pointer-events-auto flex items-end gap-1.5 px-2.5 py-1.5
                   rounded-[22px] border border-white/15 bg-white/10 backdrop-blur-2xl
                   shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]
                   max-w-full overflow-x-auto no-scrollbar"
        aria-label="Dock"
      >
        {items.map((item, i) => (
          <DockIcon key={item.label} item={item} mouseX={mouseX} dividerBefore={i === items.length - 1} />
        ))}
      </motion.nav>
    </div>
  );
};

const DockIcon = ({
  item, mouseX, dividerBefore,
}: { item: DockItem; mouseX: ReturnType<typeof useMotionValue<number | null>>; dividerBefore?: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (mx) => {
    if (mx === null || !ref.current) return 9999;
    const rect = ref.current.getBoundingClientRect();
    return Math.abs(mx - (rect.left + rect.width / 2));
  });
  const sizeRaw = useTransform(distance, [0, 70, 150], [62, 50, 44]);
  const size = useSpring(sizeRaw, { stiffness: 240, damping: 18, mass: 0.4 });
  const Icon = iosIcons[item.icon];

  return (
    <>
      {dividerBefore && <span className="w-px h-10 mx-1 bg-white/20 self-center" aria-hidden="true" />}
      <motion.a
        ref={ref}
        href={item.href}
        onClick={(e) => {
          if (item.onClick) { e.preventDefault(); item.onClick(); }
        }}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        aria-label={item.label}
        title={item.label}
        style={{ width: size, height: size }}
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="group relative flex items-end justify-center"
      >
        <motion.div style={{ width: size, height: size }}>
          <Icon />
        </motion.div>
        {/* tooltip */}
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                         transition-opacity bg-black/85 text-white text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap font-medium">
          {item.label}
        </span>
      </motion.a>
    </>
  );
};

export default MacDock;