import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, type ComponentType } from "react";
import {
  Home, Mail, MessageCircle, Compass, Linkedin, Facebook, Github,
  Search, FolderOpen, User, Briefcase, GraduationCap, Code2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockItem {
  label: string;
  href: string;
  /** Tailwind gradient classes for the colorful icon tile */
  gradient: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: () => void;
  external?: boolean;
}

const MacDock = () => {
  const { lang } = useLanguage();

  const items: DockItem[] = [
    { label: "Finder",   href: "#home",        gradient: "from-[#5BB8FF] via-[#2E8BFF] to-[#0A56D6]", Icon: FolderOpen },
    { label: lang === "he" ? "אודות" : "About", href: "#about", gradient: "from-[#FFB36B] via-[#FF7E3F] to-[#D94C1A]", Icon: User },
    { label: lang === "he" ? "מיומנויות" : "Skills", href: "#skills", gradient: "from-[#7B61FF] via-[#5A3DFF] to-[#2A1FAE]", Icon: Code2 },
    { label: lang === "he" ? "פרויקטים" : "Projects", href: "#projects", gradient: "from-[#E0E5EE] via-[#9BA6B8] to-[#3C4658]", Icon: Github },
    { label: lang === "he" ? "ניסיון" : "Experience", href: "#experience", gradient: "from-[#FFD66B] via-[#F5A623] to-[#B26B00]", Icon: Briefcase },
    { label: lang === "he" ? "השכלה" : "Education", href: "#education", gradient: "from-[#FF7DB1] via-[#E83F8B] to-[#8E1A55]", Icon: GraduationCap },
    { label: "Mail", href: "#contact", gradient: "from-[#9CD3FF] via-[#3E9CFF] to-[#0E5BD6]", Icon: Mail },
    { label: lang === "he" ? "הודעות" : "Messages", href: "#", gradient: "from-[#7CE890] via-[#34C759] to-[#0E8A2E]", Icon: MessageCircle,
      onClick: () => window.dispatchEvent(new CustomEvent("open-telegram-chat")) },
    { label: "Safari", href: "https://github.com/Shalev-osher", gradient: "from-[#F0F4FF] via-[#5AA9FF] to-[#1B5EBC]", Icon: Compass, external: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/shalev-osher/", gradient: "from-[#3B8BD9] via-[#0A66C2] to-[#063E78]", Icon: Linkedin, external: true },
    { label: "Facebook", href: "https://www.facebook.com/Mr.ShalevOsher/", gradient: "from-[#5A9BFF] via-[#1877F2] to-[#0B4AB0]", Icon: Facebook, external: true },
    { label: "GitHub", href: "https://github.com/Shalev-osher", gradient: "from-[#5B5F66] via-[#24292F] to-[#0A0C10]", Icon: Github, external: true },
    { label: lang === "he" ? "חיפוש" : "Spotlight", href: "#", gradient: "from-[#BFC4CC] via-[#7C8290] to-[#3A3F48]", Icon: Search,
      onClick: () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true })) },
  ];

  const mouseX = useMotionValue<number | null>(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(null)}
      dir="ltr"
      style={{ left: "50%", transform: "translateX(-50%)" }}
      className="fixed bottom-3 z-40 flex items-end gap-1.5 px-2.5 py-1.5
                 rounded-[22px] border border-white/15 bg-white/10 backdrop-blur-2xl
                 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2)]
                 max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
      aria-label="Dock"
    >
      {items.map((item, i) => (
        <DockIcon key={item.label} item={item} mouseX={mouseX} dividerBefore={i === items.length - 1} />
      ))}
    </motion.nav>
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
  const sizeRaw = useTransform(distance, [0, 70, 150], [62, 48, 42]);
  const size = useSpring(sizeRaw, { stiffness: 240, damping: 18, mass: 0.4 });

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
        whileTap={{ scale: 0.85 }}
        className={`group relative rounded-[22%] flex items-center justify-center
                    bg-gradient-to-br ${item.gradient}
                    shadow-[0_8px_18px_-6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.28)]
                    text-white select-none ring-1 ring-white/10`}
      >
        {/* glossy highlight */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22%] bg-gradient-to-b from-white/30 via-white/5 to-transparent" />
        <item.Icon className="relative w-[55%] h-[55%] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]" strokeWidth={2.2} />
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