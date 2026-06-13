import type { AppId } from "./WindowManager";

/**
 * Premium macOS-style app icon set.
 * Each icon: squircle background with gradient, inset highlight, outer shadow, and a
 * unique vector glyph. Rendered at the container's full size — drop them inside any
 * square container (Dock, Launchpad, Desktop icons, Mission Control thumbnails…).
 */

const Squircle = ({
  gradient, children, ringTint = "rgba(255,255,255,0.22)",
}: { gradient: string; children: React.ReactNode; ringTint?: string }) => (
  <div
    className="relative w-full h-full"
    style={{
      borderRadius: "22.5%",
      background: gradient,
      boxShadow:
        "0 10px 22px -8px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.25), " +
        `inset 0 1px 0 ${ringTint}, inset 0 -2px 4px rgba(0,0,0,0.22)`,
    }}
  >
    {/* top sheen */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: "22.5%",
        background:
          "radial-gradient(120% 60% at 50% -10%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)",
      }}
    />
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ borderRadius: "22.5%" }}
    >
      {children}
    </div>
  </div>
);

const Glyph = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full"
  >
    {children}
  </svg>
);

/* ───────────────────────── Icons ───────────────────────── */

const FinderIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#7cc7ff 0%,#3486db 55%,#1f63b8 100%)">
    <Glyph>
      {/* Two profile silhouettes back-to-back, classic Finder hint */}
      <defs>
        <linearGradient id="fnDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c3a78" />
          <stop offset="1" stopColor="#08234a" />
        </linearGradient>
      </defs>
      <path
        d="M50 18c-13 0-22 13-22 32s9 32 22 32V62c-5-1-9-6-9-12s4-11 9-12V18z"
        fill="url(#fnDark)"
      />
      <path
        d="M50 18c13 0 22 13 22 32S63 82 50 82V62c5-1 9-6 9-12s-4-11-9-12V18z"
        fill="#ffffff"
      />
      {/* Eyes */}
      <circle cx="42" cy="42" r="2.4" fill="#ffffff" />
      <circle cx="58" cy="42" r="2.4" fill="#0c3a78" />
      {/* Smile */}
      <path
        d="M38 60 Q 50 70 62 60"
        stroke="#0c3a78" strokeWidth="2" fill="none" strokeLinecap="round"
      />
    </Glyph>
  </Squircle>
);

const HomeIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#ff8a5b 0%,#e64a32 60%,#b3270f 100%)">
    <Glyph>
      <path
        d="M22 50 L50 24 L78 50 L72 50 L72 78 L56 78 L56 60 L44 60 L44 78 L28 78 L28 50 Z"
        fill="#ffffff"
      />
      <path d="M50 18 L20 46 L26 52 L50 30 L74 52 L80 46 Z" fill="#ffffff" />
    </Glyph>
  </Squircle>
);

const AboutIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#f7d36b 0%,#d49b2a 55%,#a06b10 100%)">
    <Glyph>
      {/* Profile card */}
      <rect x="18" y="26" width="64" height="48" rx="6" fill="#ffffff" />
      <circle cx="38" cy="46" r="8" fill="#d49b2a" />
      <path d="M28 64 c2-6 8-9 10-9 h0 c2 0 8 3 10 9 v2 H28 z" fill="#d49b2a" />
      <rect x="54" y="40" width="20" height="3" rx="1.5" fill="#bd8c25" />
      <rect x="54" y="48" width="20" height="3" rx="1.5" fill="#bd8c25" />
      <rect x="54" y="56" width="14" height="3" rx="1.5" fill="#bd8c25" />
    </Glyph>
  </Squircle>
);

const SkillsIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#7a8cff 0%,#4254e0 55%,#23288f 100%)">
    <Glyph>
      {/* </> brackets + slash */}
      <path
        d="M30 36 L18 50 L30 64"
        stroke="#ffffff" strokeWidth="6" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M70 36 L82 50 L70 64"
        stroke="#ffffff" strokeWidth="6" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M58 30 L42 70"
        stroke="#ffffff" strokeWidth="6" fill="none" strokeLinecap="round"
      />
    </Glyph>
  </Squircle>
);

const ProjectsIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#3a3a3f 0%,#1d1d22 55%,#0a0a0d 100%)" ringTint="rgba(255,255,255,0.15)">
    <Glyph>
      {/* Xcode-style hammer */}
      <defs>
        <linearGradient id="hammerHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8db8ff" />
          <stop offset="1" stopColor="#2f7be2" />
        </linearGradient>
      </defs>
      <rect x="46" y="40" width="6" height="38" rx="2" fill="#cfcfd6" />
      <path
        d="M28 22 C38 16 60 16 70 22 L74 32 C64 28 36 28 26 32 Z"
        fill="url(#hammerHead)"
      />
      <rect x="32" y="30" width="36" height="10" rx="2" fill="url(#hammerHead)" />
      <circle cx="49" cy="35" r="2" fill="#ffffff" opacity="0.7" />
    </Glyph>
  </Squircle>
);

const ExperienceIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#5fd6c2 0%,#1c9d8a 55%,#0d5e51 100%)">
    <Glyph>
      {/* Document */}
      <rect x="22" y="16" width="56" height="68" rx="5" fill="#ffffff" />
      {/* Timeline dots + lines */}
      <circle cx="32" cy="32" r="3" fill="#0d5e51" />
      <rect x="40" y="30" width="32" height="4" rx="2" fill="#bfe5dd" />
      <circle cx="32" cy="46" r="3" fill="#0d5e51" />
      <rect x="40" y="44" width="32" height="4" rx="2" fill="#bfe5dd" />
      <circle cx="32" cy="60" r="3" fill="#0d5e51" />
      <rect x="40" y="58" width="24" height="4" rx="2" fill="#bfe5dd" />
      <circle cx="32" cy="74" r="3" fill="#1c9d8a" />
      <rect x="40" y="72" width="20" height="4" rx="2" fill="#bfe5dd" />
      {/* timeline rail */}
      <line x1="32" y1="36" x2="32" y2="70" stroke="#1c9d8a" strokeWidth="1.5" />
    </Glyph>
  </Squircle>
);

const EducationIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#fff1c2 0%,#f5c344 55%,#b0791b 100%)">
    <Glyph>
      {/* Medal with ribbon */}
      <path d="M30 18 L42 50 L34 50 L30 32 Z" fill="#d7493f" />
      <path d="M70 18 L58 50 L66 50 L70 32 Z" fill="#d7493f" />
      <circle cx="50" cy="62" r="22"
        fill="url(#medalGrad)"
        stroke="#9a6610" strokeWidth="2"
      />
      <defs>
        <radialGradient id="medalGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#fff5cf" />
          <stop offset="0.6" stopColor="#e3a824" />
          <stop offset="1" stopColor="#9a6610" />
        </radialGradient>
      </defs>
      <path
        d="M50 50 L53 60 L63 60 L55 66 L58 76 L50 70 L42 76 L45 66 L37 60 L47 60 Z"
        fill="#ffffff"
      />
    </Glyph>
  </Squircle>
);

const ContactIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#79d0ff 0%,#1e8ed8 55%,#0b5fa6 100%)">
    <Glyph>
      {/* Envelope */}
      <rect x="18" y="30" width="64" height="42" rx="5" fill="#ffffff" />
      <path
        d="M18 34 L50 56 L82 34"
        stroke="#0b5fa6" strokeWidth="3" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M18 68 L42 50" stroke="#cfe5f7" strokeWidth="2" fill="none" />
      <path d="M82 68 L58 50" stroke="#cfe5f7" strokeWidth="2" fill="none" />
    </Glyph>
  </Squircle>
);

const TerminalIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#2a2a2e 0%,#111114 55%,#050506 100%)" ringTint="rgba(255,255,255,0.12)">
    <Glyph>
      {/* Window chrome */}
      <rect x="14" y="18" width="72" height="64" rx="6" fill="#1c1c20" />
      <rect x="14" y="18" width="72" height="12" rx="6" fill="#2b2b30" />
      <circle cx="22" cy="24" r="2" fill="#ff5f57" />
      <circle cx="30" cy="24" r="2" fill="#febc2e" />
      <circle cx="38" cy="24" r="2" fill="#28c840" />
      {/* Prompt > _ */}
      <path
        d="M24 50 L34 58 L24 66"
        stroke="#3ddc84" strokeWidth="3.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="40" y="62" width="20" height="3.5" rx="1.5" fill="#3ddc84" />
    </Glyph>
  </Squircle>
);

const CalculatorIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#2c2c2e 0%,#161618 55%,#0a0a0c 100%)" ringTint="rgba(255,255,255,0.14)">
    <Glyph>
      <rect x="14" y="12" width="72" height="22" rx="3" fill="#000" />
      <text x="82" y="29" textAnchor="end" fontFamily="ui-sans-serif, -apple-system, system-ui" fontSize="16" fill="#fff" fontWeight="200">0</text>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => {
          const x = 14 + c * 18, y = 38 + r * 10.4;
          const isOp = c === 3;
          const isFn = r === 0 && c < 3;
          return (
            <rect key={`${r}-${c}`} x={x} y={y} width="14" height="8.4" rx="2.5"
              fill={isOp ? "#ff9f0a" : isFn ? "#a5a5a5" : "#505050"} />
          );
        })
      )}
    </Glyph>
  </Squircle>
);

const NotesIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#fdfdfd 0%,#e6e6e6 100%)" ringTint="rgba(255,255,255,0.6)">
    <Glyph>
      <rect x="16" y="14" width="68" height="72" rx="5" fill="#fff7b3" />
      <rect x="16" y="14" width="68" height="14" fill="#ffd23a" />
      <rect x="16" y="28" width="68" height="2" fill="#d4a017" opacity="0.5" />
      <line x1="24" y1="40" x2="76" y2="40" stroke="#d6b85a" strokeWidth="1.2" />
      <line x1="24" y1="50" x2="76" y2="50" stroke="#d6b85a" strokeWidth="1.2" />
      <line x1="24" y1="60" x2="76" y2="60" stroke="#d6b85a" strokeWidth="1.2" />
      <line x1="24" y1="70" x2="76" y2="70" stroke="#d6b85a" strokeWidth="1.2" />
      <line x1="24" y1="80" x2="60" y2="80" stroke="#d6b85a" strokeWidth="1.2" />
    </Glyph>
  </Squircle>
);

const SettingsIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#9aa1ab 0%,#5a626e 55%,#2a2e36 100%)" ringTint="rgba(255,255,255,0.22)">
    <Glyph>
      <defs>
        <radialGradient id="gearMain" cx="50%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fafbfd" />
          <stop offset="0.7" stopColor="#b9bfca" />
          <stop offset="1" stopColor="#6e7682" />
        </radialGradient>
        <radialGradient id="gearSmall" cx="50%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f4f5f9" />
          <stop offset="1" stopColor="#8a92a0" />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x="-4.5" y="-38" width="9" height="12" rx="2.5"
            fill="url(#gearMain)" transform={`rotate(${i * 36})`} />
        ))}
        <circle r="26" fill="url(#gearMain)" stroke="#3a3f47" strokeWidth="1" />
        <circle r="9" fill="#2a2e36" />
      </g>
      <g transform="translate(74 74)">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-2" y="-13" width="4" height="5" rx="1"
            fill="url(#gearSmall)" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="9" fill="url(#gearSmall)" stroke="#3a3f47" strokeWidth="0.8" />
        <circle r="3" fill="#2a2e36" />
      </g>
    </Glyph>
  </Squircle>
);

/* ───────── Registry ───────── */

const HomelabIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#3d4a5c 0%,#1c2532 55%,#0a1018 100%)" ringTint="rgba(255,255,255,0.18)">
    <Glyph>
      <defs>
        <linearGradient id="rackMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfd5de" />
          <stop offset="1" stopColor="#7d8694" />
        </linearGradient>
      </defs>
      {/* Rack frame */}
      <rect x="20" y="14" width="60" height="72" rx="5" fill="url(#rackMetal)" />
      <rect x="24" y="18" width="52" height="64" rx="3" fill="#0e141d" />
      {/* 4 server units with LEDs */}
      {[0,1,2,3].map((i) => {
        const y = 22 + i * 15;
        return (
          <g key={i}>
            <rect x="26" y={y} width="48" height="12" rx="1.5" fill="#1b2532" stroke="#2a3645" />
            {/* vents */}
            <rect x="44" y={y+3} width="14" height="2" rx="1" fill="#0a0f17" />
            <rect x="44" y={y+7} width="14" height="2" rx="1" fill="#0a0f17" />
            {/* LEDs */}
            <circle cx="30" cy={y+6} r="1.2" fill="#3ddc84" />
            <circle cx="34" cy={y+6} r="1.2" fill="#f5a623" />
            <circle cx="70" cy={y+6} r="1.2" fill="#3ddc84" opacity={i===2?0.3:1} />
          </g>
        );
      })}
    </Glyph>
  </Squircle>
);

const GithubIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#2b2b32 0%,#0e0e12 55%,#040406 100%)" ringTint="rgba(255,255,255,0.14)">
    <Glyph>
      {/* Octocat-inspired silhouette */}
      <path
        fill="#ffffff"
        d="M50 18c-15 0-27 12-27 27 0 12 7.8 22.2 18.6 25.8 1.4.3 1.9-.6 1.9-1.3 0-.6 0-2.3-.04-4.5-7.6 1.6-9.2-3.6-9.2-3.6-1.2-3.2-3-4-3-4-2.4-1.6.2-1.6.2-1.6 2.7.2 4.1 2.8 4.1 2.8 2.4 4.1 6.3 2.9 7.9 2.2.2-1.8.9-2.9 1.6-3.6-6-.7-12.4-3-12.4-13.5 0-3 1.1-5.4 2.8-7.3-.3-.7-1.2-3.5.3-7.2 0 0 2.3-.7 7.5 2.8 2.2-.6 4.5-.9 6.8-.9s4.6.3 6.8.9c5.2-3.5 7.5-2.8 7.5-2.8 1.5 3.7.6 6.5.3 7.2 1.8 1.9 2.8 4.3 2.8 7.3 0 10.5-6.4 12.8-12.5 13.5 1 .8 1.8 2.4 1.8 4.9 0 3.5-.03 6.4-.03 7.2 0 .7.5 1.6 1.9 1.3C69.2 67.2 77 57 77 45c0-15-12-27-27-27z"
      />
    </Glyph>
  </Squircle>
);

const SafariIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#e9eef5 0%,#cfd6e2 60%,#a9b3c2 100%)" ringTint="rgba(255,255,255,0.55)">
    <Glyph>
      <defs>
        <radialGradient id="safariFace" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#5fb6ff" />
          <stop offset="0.6" stopColor="#1f7ed1" />
          <stop offset="1" stopColor="#0c4f8a" />
        </radialGradient>
      </defs>
      {/* Outer ring with tick marks */}
      <circle cx="50" cy="50" r="36" fill="#e8edf3" stroke="#8a93a3" strokeWidth="1.2" />
      <g stroke="#3a4150" strokeWidth="1.2">
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6) * Math.PI / 180;
          const r1 = i % 5 === 0 ? 30 : 32;
          const r2 = 35;
          return (
            <line key={i}
              x1={50 + Math.cos(a) * r1} y1={50 + Math.sin(a) * r1}
              x2={50 + Math.cos(a) * r2} y2={50 + Math.sin(a) * r2}
              opacity={i % 5 === 0 ? 0.9 : 0.4}
            />
          );
        })}
      </g>
      <g fontFamily="ui-sans-serif, system-ui" fontSize="6" fill="#3a4150" fontWeight="700" textAnchor="middle">
        <text x="50" y="23">N</text>
        <text x="78" y="52">E</text>
        <text x="50" y="83">S</text>
        <text x="22" y="52">W</text>
      </g>
      {/* Dial face */}
      <circle cx="50" cy="50" r="26" fill="url(#safariFace)" />
      {/* Compass needle */}
      <g transform="translate(50 50) rotate(35)">
        <polygon points="0,-22 5,0 0,4 -5,0" fill="#e74c3c" />
        <polygon points="0,22 5,0 0,-4 -5,0" fill="#ffffff" />
        <circle r="2.4" fill="#1a1a1f" />
      </g>
    </Glyph>
  </Squircle>
);

export const APP_ICONS: Record<AppId, React.FC> = {
  finder: FinderIcon,
  home: HomeIcon,
  about: AboutIcon,
  skills: SkillsIcon,
  projects: ProjectsIcon,
  experience: ExperienceIcon,
  education: EducationIcon,
  contact: ContactIcon,
  terminal: TerminalIcon,
  calculator: CalculatorIcon,
  notes: NotesIcon,
  settings: SettingsIcon,
  homelab: HomelabIcon,
  safari: SafariIcon,
};

/** Extra icons that aren't backed by a window (e.g. external shortcuts). */
export const EXTRA_ICONS: Record<string, React.FC> = {
  github: GithubIcon,
};

export const AppIcon = ({ id }: { id: AppId | string }) => {
  const Cmp = (APP_ICONS as Record<string, React.FC>)[id] || EXTRA_ICONS[id];
  return Cmp ? <Cmp /> : null;
};