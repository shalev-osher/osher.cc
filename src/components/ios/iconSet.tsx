import AppIcon from "./AppIcon";

/**
 * Original iOS-inspired app icon set.
 * Squircle tiles with custom SVG glyphs — not copies of Apple's artwork.
 */

type IconProps = { size?: number };

const S = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// === Glyphs ===
const MailGlyph = () => (
  <S>
    <rect x="3" y="6" width="18" height="13" rx="2.5" fill="white" stroke="none" />
    <path d="M4 8l8 6 8-6" stroke="#1e6fd9" strokeWidth={1.7} />
  </S>
);

const MessagesGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 3c-5 0-9 3.4-9 7.6 0 2.5 1.5 4.7 3.8 6.1L5 21l4.5-2.2c.8.2 1.6.3 2.5.3 5 0 9-3.4 9-7.5S17 3 12 3z" fill="white" />
  </svg>
);

const SafariGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="12" r="9.2" fill="#f6f8fb" />
    <circle cx="12" cy="12" r="7" fill="#1f7fdb" />
    {[...Array(12)].map((_, i) => (
      <line key={i} x1="12" y1="3" x2="12" y2="4.5" stroke="white" strokeWidth="0.6" transform={`rotate(${i * 30} 12 12)`} />
    ))}
    <path d="M12 6 L13.4 12 L18 13.5 L10.6 12.6 Z" fill="white" />
    <path d="M12 18 L10.6 12.6 L6 10.5 L13.4 12 Z" fill="#ff4f3a" />
  </svg>
);

const PhotosGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    {[
      { c: "#ffd028", x: 12, y: 6 },
      { c: "#ff5e62", x: 16.5, y: 9 },
      { c: "#ff32b1", x: 16.5, y: 15 },
      { c: "#5b86ff", x: 12, y: 18 },
      { c: "#3ad0ff", x: 7.5, y: 15 },
      { c: "#5ce06b", x: 7.5, y: 9 },
    ].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="3.6" fill={p.c} opacity="0.92" style={{ mixBlendMode: "screen" }} />
    ))}
  </svg>
);

const SettingsGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="12" r="9" fill="#3a3a3c" />
    {[...Array(8)].map((_, i) => (
      <rect key={i} x="11" y="2.5" width="2" height="4.5" rx="1" fill="#cfd2d6" transform={`rotate(${i * 45} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="3" fill="#3a3a3c" stroke="#cfd2d6" strokeWidth="1.4" />
  </svg>
);

const MusicGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M9 17.5a2.5 2.5 0 1 1-2.5-2.5c.6 0 1 .1 1.5.4V6.5L17 4v11a2.5 2.5 0 1 1-2.5-2.5c.6 0 1 .1 1.5.4V6.8L9 8.5v9z" fill="white" />
  </svg>
);

const PhoneGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M6.5 4h3l1.8 4.2-2.2 1.6c1 2.3 2.6 3.9 4.9 4.9l1.6-2.2L20 14.3v3a2.7 2.7 0 0 1-2.9 2.7C9.3 19.6 4.4 14.7 4 7A2.7 2.7 0 0 1 6.5 4z" fill="white" />
  </svg>
);

const FinderGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    {/* Friendly face */}
    <ellipse cx="9" cy="11" rx="1" ry="2" fill="white" />
    <ellipse cx="15" cy="11" rx="1" ry="2" fill="white" />
    <path d="M8 15c1.2 1.4 2.6 2 4 2s2.8-.6 4-2" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

const UserGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="9" r="3.6" fill="white" />
    <path d="M5 20c1.4-3.6 4-5.5 7-5.5s5.6 1.9 7 5.5" fill="white" />
  </svg>
);

const CodeGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 8 4 12l5 4" />
    <path d="M15 8l5 4-5 4" />
    <path d="M13.5 6l-3 12" />
  </svg>
);

const BriefcaseGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect x="3" y="8" width="18" height="11" rx="2" fill="white" />
    <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" stroke="white" strokeWidth="1.6" fill="none" />
    <rect x="11" y="12" width="2" height="3" fill="#b26b00" />
  </svg>
);

const GradCapGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 4L2 9l10 5 10-5-10-5z" fill="white" />
    <path d="M6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" stroke="white" strokeWidth="1.6" fill="none" />
    <path d="M21 9v5" stroke="white" strokeWidth="1.6" />
  </svg>
);

const GithubGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="white" d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z"/>
  </svg>
);

const LinkedinGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect x="3" y="9" width="3.5" height="11" fill="white" />
    <circle cx="4.75" cy="5.5" r="2" fill="white" />
    <path d="M9 9h3.3v1.6h.05c.46-.85 1.6-1.75 3.3-1.75 3.5 0 4.15 2.3 4.15 5.3V20h-3.5v-4.9c0-1.2 0-2.7-1.65-2.7s-1.9 1.3-1.9 2.6V20H9V9z" fill="white"/>
  </svg>
);

const FacebookGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path fill="white" d="M14.5 8.5h2.3V5.2h-2.7c-2.6 0-4.1 1.6-4.1 4.1V11H8v3.3h2v6.7h3.4v-6.7h2.5l.4-3.3h-2.9V9.5c0-.7.4-1 1.1-1z"/>
  </svg>
);

const SpotlightGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="6" />
    <path d="M16 16l4 4" />
  </svg>
);

const ArrowUpGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V6" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);

const ArrowDownGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v13" />
    <path d="M6 13l6 6 6-6" />
  </svg>
);

// === Exported icon wrappers ===
export const iosIcons = {
  finder:    (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #5BB8FF 0%, #2E8BFF 55%, #0A56D6 100%)"><FinderGlyph /></AppIcon>,
  about:     (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #FFB36B 0%, #FF7E3F 55%, #D94C1A 100%)"><UserGlyph /></AppIcon>,
  skills:    (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #8E7BFF 0%, #5A3DFF 55%, #2A1FAE 100%)"><CodeGlyph /></AppIcon>,
  projects:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #4A4F58 0%, #24292F 60%, #0A0C10 100%)"><GithubGlyph /></AppIcon>,
  experience:(p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #FFD66B 0%, #F5A623 55%, #B26B00 100%)"><BriefcaseGlyph /></AppIcon>,
  education: (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #FF7DB1 0%, #E83F8B 55%, #8E1A55 100%)"><GradCapGlyph /></AppIcon>,
  mail:      (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #9CD3FF 0%, #3E9CFF 55%, #0E5BD6 100%)"><MailGlyph /></AppIcon>,
  messages:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #7CE890 0%, #34C759 55%, #0E8A2E 100%)"><MessagesGlyph /></AppIcon>,
  safari:    (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #F0F4FF 0%, #5AA9FF 55%, #1B5EBC 100%)"><SafariGlyph /></AppIcon>,
  photos:    (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #2a2a2c 0%, #0c0c0e 100%)"><PhotosGlyph /></AppIcon>,
  settings:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #c9ccd1 0%, #6e7178 100%)"><SettingsGlyph /></AppIcon>,
  music:     (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #FF6A88 0%, #FF2D55 55%, #C2185B 100%)"><MusicGlyph /></AppIcon>,
  phone:     (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #5ee884 0%, #34c759 55%, #1d9241 100%)"><PhoneGlyph /></AppIcon>,
  linkedin:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #3B8BD9 0%, #0A66C2 55%, #063E78 100%)"><LinkedinGlyph /></AppIcon>,
  facebook:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #5A9BFF 0%, #1877F2 55%, #0B4AB0 100%)"><FacebookGlyph /></AppIcon>,
  github:    (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #4A4F58 0%, #24292F 60%, #0A0C10 100%)"><GithubGlyph /></AppIcon>,
  spotlight: (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #BFC4CC 0%, #7C8290 55%, #3A3F48 100%)"><SpotlightGlyph /></AppIcon>,
  scrollUp:  (p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #f5d678 0%, #d4aa50 55%, #8a6614 100%)"><ArrowUpGlyph /></AppIcon>,
  scrollDown:(p: IconProps) => <AppIcon size={p.size} gradient="linear-gradient(180deg, #f5d678 0%, #d4aa50 55%, #8a6614 100%)"><ArrowDownGlyph /></AppIcon>,
};

export type IosIconKey = keyof typeof iosIcons;