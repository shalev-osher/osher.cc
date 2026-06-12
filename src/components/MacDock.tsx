import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockItem {
  label: string;
  href: string;
  /** Tailwind gradient classes for the colorful icon tile */
  gradient: string;
  /** Emoji/glyph rendered on the tile (macOS-app-icon style) */
  glyph: string;
  onClick?: () => void;
  external?: boolean;
}

const MacDock = () => {
  const { lang } = useLanguage();

  const items: DockItem[] = [
    { label: "Finder",   href: "#home",     gradient: "from-[#3FA9FF] to-[#1E5FCB]", glyph: "🙂" },
    { label: "Mail",     href: "#contact",  gradient: "from-[#7AC0FF] to-[#1466E0]", glyph: "✉️" },
    { label: "Messages", href: "#",         gradient: "from-[#5EE269] to-[#15A52B]", glyph: "💬",
      onClick: () => window.dispatchEvent(new CustomEvent("open-telegram-chat")) },
    { label: "Safari",   href: "https://github.com/Shalev-osher", gradient: "from-[#E8F0FE] to-[#3A8DDE]", glyph: "🧭", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/shalev-osher/", gradient: "from-[#0A66C2] to-[#08407A]", glyph: "in", external: true },
    { label: "Facebook", href: "https://www.facebook.com/Mr.ShalevOsher/", gradient: "from-[#4D8BF6] to-[#1B4FCE]", glyph: "f", external: true },
    { label: "GitHub",   href: "https://github.com/Shalev-osher", gradient: "from-[#3A3A3C] to-[#0A0A0A]", glyph: "🐙", external: true },
    { label: lang === "he" ? "מסך כניסה" : "Spotlight", href: "#", gradient: "from-[#9D9DA1] to-[#4A4A4D]", glyph: "🔍",
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
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-end gap-1.5 px-2.5 py-1.5
                 rounded-[22px] border border-white/15 bg-white/10 backdrop-blur-2xl
                 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]"
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
        className={`group relative rounded-[14px] flex items-center justify-center
                    bg-gradient-to-b ${item.gradient}
                    shadow-[0_6px_14px_-4px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.25)]
                    text-white font-bold select-none`}
      >
        <span className="text-[24px] leading-none drop-shadow-sm" aria-hidden="true">{item.glyph}</span>
        {/* tooltip */}
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                         transition-opacity bg-black/80 text-white text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap">
          {item.label}
        </span>
      </motion.a>
    </>
  );
};

export default MacDock;