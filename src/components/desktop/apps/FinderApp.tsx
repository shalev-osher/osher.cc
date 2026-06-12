import { useState } from "react";
import { useWindows, type AppId } from "../WindowManager";
import { Folder, FileText, ChevronRight } from "lucide-react";

interface Entry { name: string; app: AppId; desc: string; }

const FOLDERS: Record<string, Entry[]> = {
  Portfolio: [
    { name: "About Me",   app: "about",      desc: "Personal profile & background" },
    { name: "Skills",     app: "skills",     desc: "Stack & proficiencies" },
    { name: "Projects",   app: "projects",   desc: "GitHub & case studies" },
    { name: "Experience", app: "experience", desc: "Career timeline" },
    { name: "Education",  app: "education",  desc: "Certifications" },
    { name: "Contact",    app: "contact",    desc: "Reach out" },
  ],
  System: [
    { name: "Terminal",   app: "terminal",   desc: "zsh shell" },
    { name: "Home",       app: "home",       desc: "Hero / welcome" },
  ],
};

const FinderApp = () => {
  const { open } = useWindows();
  const [folder, setFolder] = useState<keyof typeof FOLDERS>("Portfolio");
  const entries = FOLDERS[folder];

  return (
    <div className="flex h-full">
      <aside className="w-48 shrink-0 border-e border-border/40 bg-background/60 p-3 text-[13px]">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">Favorites</div>
        {Object.keys(FOLDERS).map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f as keyof typeof FOLDERS)}
            className={"flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-start " +
              (folder === f ? "bg-primary/15 text-foreground" : "hover:bg-muted/50 text-foreground/80")}
          >
            <Folder size={14} className="text-primary" />
            {f}
          </button>
        ))}
      </aside>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <span>Finder</span><ChevronRight size={12} /><span className="text-foreground">{folder}</span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
          {entries.map((e) => (
            <button
              key={e.app}
              onDoubleClick={() => open(e.app)}
              onClick={() => open(e.app)}
              title={e.desc}
              className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText size={26} className="text-primary" />
              </div>
              <span className="text-[12px] text-center leading-tight">{e.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinderApp;
