import { useWindows, type AppId } from "./WindowManager";
import { Folder, User, Wrench, Briefcase, Award, Mail, Terminal as TerminalIcon, Github } from "lucide-react";

const ICONS: { id: AppId; label: string; Icon: typeof Folder }[] = [
  { id: "finder",     label: "Finder",      Icon: Folder },
  { id: "about",      label: "About Me",    Icon: User },
  { id: "skills",     label: "Skills",      Icon: Wrench },
  { id: "projects",   label: "Projects",    Icon: Github },
  { id: "experience", label: "Experience",  Icon: Briefcase },
  { id: "education",  label: "Certs",       Icon: Award },
  { id: "contact",    label: "Contact",     Icon: Mail },
  { id: "terminal",   label: "Terminal",    Icon: TerminalIcon },
];

const DesktopIcons = () => {
  const { open } = useWindows();
  return (
    <div className="absolute top-10 end-4 flex flex-col gap-3 z-10" dir="ltr">
      {ICONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onDoubleClick={() => open(id)}
          onClick={() => open(id)}
          className="group flex flex-col items-center gap-1 w-[72px] py-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={`Open ${label}`}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 backdrop-blur flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
            <Icon size={22} className="text-primary" />
          </div>
          <span className="text-[11px] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)] leading-tight text-center">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons;
