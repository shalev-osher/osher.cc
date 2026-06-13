import { useWindows, type AppId } from "./WindowManager";
import { AppIcon } from "./AppIcons";

type IconDef =
  | { kind: "app"; id: AppId; label: string }
  | { kind: "external"; key: string; label: string; href: string };

const ICONS: IconDef[] = [
  { kind: "app", id: "about",      label: "About Shalev" },
  { kind: "app", id: "projects",   label: "Projects" },
  { kind: "app", id: "homelab",    label: "Homelab" },
  { kind: "external", key: "github", label: "GitHub", href: "https://github.com/shalev-osher" },
  { kind: "app", id: "experience", label: "Experience" },
  { kind: "app", id: "contact",    label: "Contact" },
  { kind: "app", id: "terminal",   label: "Terminal" },
];

const DesktopIcons = () => {
  const { open } = useWindows();
  return (
    <div className="absolute top-10 end-4 flex flex-col gap-3 z-10" dir="ltr">
      {ICONS.map((ic) => {
        const label = ic.label;
        const handle = () => {
          if (ic.kind === "app") open(ic.id);
          else window.open(ic.href, "_blank", "noopener,noreferrer");
        };
        return (
          <button
            key={ic.kind === "app" ? ic.id : ic.key}
            onDoubleClick={handle}
            onClick={handle}
            className="group flex flex-col items-center gap-1 w-[78px] py-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={`Open ${label}`}
          >
            <div className="w-14 h-14 group-hover:scale-105 transition-transform">
              <AppIcon id={ic.kind === "app" ? ic.id : (ic.key as AppId)} />
            </div>
            <span className="text-[11px] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)] leading-tight text-center">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DesktopIcons;
