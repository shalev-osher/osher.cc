import { useWindows, type AppId } from "./WindowManager";
import { AppIcon } from "./AppIcons";

const ICONS: { id: AppId; label: string }[] = [
  { id: "finder",     label: "Finder" },
  { id: "about",      label: "About Me" },
  { id: "skills",     label: "Skills" },
  { id: "projects",   label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education",  label: "Certs" },
  { id: "contact",    label: "Contact" },
  { id: "terminal",   label: "Terminal" },
];

const DesktopIcons = () => {
  const { open } = useWindows();
  return (
    <div className="absolute top-10 end-4 flex flex-col gap-3 z-10" dir="ltr">
      {ICONS.map(({ id, label }) => (
        <button
          key={id}
          onDoubleClick={() => open(id)}
          onClick={() => open(id)}
          className="group flex flex-col items-center gap-1 w-[72px] py-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={`Open ${label}`}
        >
          <div className="w-12 h-12 group-hover:scale-105 transition-transform">
            <AppIcon id={id} />
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
