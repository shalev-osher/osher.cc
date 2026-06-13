import { lazy, Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Plus, Lock, Share, Sidebar as SidebarIcon } from "lucide-react";

const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const GitHubProjects = lazy(() => import("@/components/GitHubProjects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Contact = lazy(() => import("@/components/Contact"));
const Hero = lazy(() => import("@/components/Hero"));

type Bookmark =
  | { kind: "internal"; key: string; title: string; url: string; render: () => JSX.Element; favicon: string }
  | { kind: "external"; key: string; title: string; url: string; favicon: string };

const BOOKMARKS: Bookmark[] = [
  { kind: "internal", key: "home",       title: "Start",         url: "osher://start",       favicon: "🏠", render: () => <Hero /> },
  { kind: "internal", key: "about",      title: "About Shalev",  url: "osher://about",       favicon: "👤", render: () => <About /> },
  { kind: "internal", key: "skills",     title: "Skills",        url: "osher://skills",      favicon: "⚡", render: () => <Skills /> },
  { kind: "internal", key: "projects",   title: "Projects",      url: "osher://projects",    favicon: "🛠", render: () => <GitHubProjects /> },
  { kind: "internal", key: "experience", title: "Experience",    url: "osher://experience",  favicon: "💼", render: () => <Experience /> },
  { kind: "internal", key: "education",  title: "Certifications",url: "osher://education",   favicon: "🎓", render: () => <Education /> },
  { kind: "internal", key: "contact",    title: "Contact",       url: "osher://contact",     favicon: "✉️", render: () => <Contact /> },
  { kind: "external", key: "github",     title: "GitHub",        url: "https://github.com/Shalev-osher", favicon: "🐙" },
  { kind: "external", key: "amazonhaosher", title: "amazonhaosher", url: "https://amazonhaosher.com", favicon: "🛒" },
];

const SafariApp = () => {
  const [historyStack, setHistoryStack] = useState<string[]>(["home"]);
  const [idx, setIdx] = useState(0);
  const [urlBar, setUrlBar] = useState(BOOKMARKS[0].url);
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebar, setSidebar] = useState(true);

  const currentKey = historyStack[idx];
  const current = BOOKMARKS.find(b => b.key === currentKey) ?? BOOKMARKS[0];

  const go = (key: string) => {
    const bm = BOOKMARKS.find(b => b.key === key);
    if (!bm) return;
    const next = historyStack.slice(0, idx + 1).concat(key);
    setHistoryStack(next);
    setIdx(next.length - 1);
    setUrlBar(bm.url);
  };

  const back = () => { if (idx > 0) { setIdx(idx - 1); setUrlBar(BOOKMARKS.find(b => b.key === historyStack[idx - 1])!.url); } };
  const fwd  = () => { if (idx < historyStack.length - 1) { setIdx(idx + 1); setUrlBar(BOOKMARKS.find(b => b.key === historyStack[idx + 1])!.url); } };

  const submitUrl = () => {
    const v = urlBar.trim().toLowerCase();
    const match = BOOKMARKS.find(b => b.url.toLowerCase() === v || v.includes(b.key));
    if (match) go(match.key);
    else setUrlBar(current.url);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1c1c1f] text-white" dir="ltr">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-b from-[#2a2a2e] to-[#1f1f22]">
        <button onClick={() => setSidebar(s => !s)} className="p-1.5 rounded hover:bg-white/10" aria-label="Sidebar"><SidebarIcon className="w-4 h-4" /></button>
        <button onClick={back} disabled={idx === 0} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" aria-label="Back"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={fwd} disabled={idx >= historyStack.length - 1} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30" aria-label="Forward"><ArrowRight className="w-4 h-4" /></button>
        <div className="flex-1 flex items-center gap-2 bg-white/[0.08] border border-white/10 rounded-lg px-3 py-1 text-[13px]">
          <Lock className="w-3 h-3 text-white/50" />
          <input
            value={urlBar}
            onChange={(e) => setUrlBar(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitUrl()}
            className="flex-1 bg-transparent outline-none placeholder-white/40"
            spellCheck={false}
            aria-label="Address bar"
          />
        </div>
        <button onClick={() => setReloadKey(k => k + 1)} className="p-1.5 rounded hover:bg-white/10" aria-label="Reload"><RotateCw className="w-4 h-4" /></button>
        <button className="p-1.5 rounded hover:bg-white/10" aria-label="Share"><Share className="w-4 h-4" /></button>
        <button className="p-1.5 rounded hover:bg-white/10" aria-label="New tab"><Plus className="w-4 h-4" /></button>
      </div>

      {/* Tabs row (single tab placeholder) */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/10 bg-[#26262a]">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-[12px] max-w-[260px] truncate">
          <span>{current.favicon}</span>
          <span className="truncate">{current.title}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {sidebar && (
          <aside className="w-56 border-e border-white/10 bg-[#222226] overflow-y-auto py-3 text-[13px]">
            <div className="px-3 text-[11px] uppercase tracking-wider text-white/40 mb-1">Favorites · Internal</div>
            {BOOKMARKS.filter(b => b.kind === "internal").map(b => (
              <button key={b.key} onClick={() => go(b.key)}
                className={`w-full text-start flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 ${current.key === b.key ? "bg-white/10" : ""}`}>
                <span>{b.favicon}</span><span className="truncate">{b.title}</span>
              </button>
            ))}
            <div className="px-3 mt-3 text-[11px] uppercase tracking-wider text-white/40 mb-1">External</div>
            {BOOKMARKS.filter(b => b.kind === "external").map(b => (
              <button key={b.key} onClick={() => go(b.key)}
                className={`w-full text-start flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 ${current.key === b.key ? "bg-white/10" : ""}`}>
                <span>{b.favicon}</span><span className="truncate">{b.title}</span>
              </button>
            ))}
          </aside>
        )}

        <main key={reloadKey} className="flex-1 overflow-auto bg-background text-foreground">
          {current.kind === "internal" ? (
            <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
              <div className="min-h-full">{current.render()}</div>
            </Suspense>
          ) : (
            <ExternalFrame url={current.url} title={current.title} />
          )}
        </main>
      </div>
    </div>
  );
};

const ExternalFrame = ({ url, title }: { url: string; title: string }) => {
  const [blocked, setBlocked] = useState(false);
  return (
    <div className="relative w-full h-full">
      <iframe
        src={url}
        title={title}
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setBlocked(true)}
        referrerPolicy="no-referrer"
      />
      {blocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background text-foreground p-8 text-center">
          <p className="text-lg font-semibold">This site refuses to load inside Safari.</p>
          <a href={url} target="_blank" rel="noreferrer" className="underline text-primary">Open {title} in a new tab ↗</a>
        </div>
      )}
    </div>
  );
};

export default SafariApp;