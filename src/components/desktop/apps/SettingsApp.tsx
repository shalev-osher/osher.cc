import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const WALLPAPERS = [
  { id: "gold-dusk", name: "Gold Dusk", bg: "radial-gradient(120% 100% at 30% 10%, #2a1f0a 0%, #14100a 45%, #050403 80%)" },
  { id: "midnight",  name: "Midnight",  bg: "radial-gradient(120% 100% at 70% 20%, #0a1530 0%, #060a18 50%, #02030a 85%)" },
  { id: "graphite",  name: "Graphite",  bg: "radial-gradient(120% 100% at 50% 0%, #2a2a2e 0%, #131316 55%, #060608 90%)" },
  { id: "ember",     name: "Ember",     bg: "radial-gradient(120% 100% at 20% 90%, #3a1208 0%, #18080a 55%, #050203 90%)" },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6">
    <h3 className="text-[11px] uppercase tracking-[0.14em] text-white/50 font-semibold mb-2">{title}</h3>
    <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur p-4 space-y-3">{children}</div>
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-white/80">{label}</span>
    {children}
  </div>
);

const SettingsApp = () => {
  const { lang, setLang } = useLanguage();
  const [current, setCurrent] = useState<string>(() => localStorage.getItem("osher-os-wallpaper") || "gold-dusk");

  const pickWallpaper = (id: string) => {
    const w = WALLPAPERS.find((x) => x.id === id);
    if (!w) return;
    document.documentElement.style.setProperty("--os-wallpaper", w.bg);
    localStorage.setItem("osher-os-wallpaper", id);
    setCurrent(id);
    toast.success(`Wallpaper: ${w.name}`);
  };

  const resetEverything = () => {
    ["osher-os-windows-v1", "osher-os-wallpaper", "osher-os-widgets-v1", "osher-os-notes-v1"].forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem("osher-os-welcomed");
    toast.message("Resetting OS…");
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#15110a] to-[#08070a] text-white p-6">
      <h1 className="font-display text-2xl font-bold mb-1">System Settings</h1>
      <p className="text-sm text-white/60 mb-6">Personalise your osher.cc OS experience.</p>

      <Section title="Wallpaper">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              onClick={() => pickWallpaper(w.id)}
              className={`group rounded-lg overflow-hidden border-2 transition-all
                          ${current === w.id ? "border-primary scale-[1.02]" : "border-white/10 hover:border-white/30"}`}
            >
              <div className="aspect-video" style={{ background: w.bg }} />
              <div className="px-2 py-1.5 text-xs font-medium bg-black/40">{w.name}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Language">
        <Row label="Interface language">
          <div className="flex rounded-md overflow-hidden border border-white/15">
            {(["en", "he"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs font-medium ${lang === l ? "bg-primary text-primary-foreground" : "hover:bg-white/10"}`}
              >
                {l === "en" ? "English" : "עברית"}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Screen">
        <Row label="Lock screen now">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("lock-screen"))}
            className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20"
          >Lock</button>
        </Row>
      </Section>

      <Section title="About">
        <Row label="System"><span className="text-white/60">osher.cc OS · build 27.1</span></Row>
        <Row label="Author"><span className="text-white/60">Shalev Osher</span></Row>
        <Row label="Stack"><span className="text-white/60">React · Vite · Framer Motion</span></Row>
      </Section>

      <Section title="Reset">
        <Row label="Restore all defaults">
          <button
            onClick={resetEverything}
            className="px-3 py-1 text-xs rounded-md bg-[#ff5f57]/80 hover:bg-[#ff5f57] text-white font-medium"
          >Reset OS</button>
        </Row>
      </Section>
    </div>
  );
};

export default SettingsApp;