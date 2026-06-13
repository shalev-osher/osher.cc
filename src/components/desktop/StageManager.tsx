import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowManager";
import { APP_META } from "./Desktop";
import { iosIcons, type IosIconKey } from "@/components/ios/iconSet";

const ICON_MAP: Record<string, IosIconKey> = {
  finder: "finder", home: "about", about: "about", skills: "skills",
  projects: "projects", experience: "experience", education: "education",
  contact: "mail", terminal: "settings",
};

/** macOS Sonoma Stage Manager — strip of non-focused / minimized windows on the start edge. */
const StageManager = () => {
  const { state, open } = useWindows();
  const others = state.order.filter((id) => id !== state.focus && state.windows[id]);

  return (
    <div
      dir="ltr"
      className="fixed start-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence>
        {others.map((id) => {
          const w = state.windows[id];
          const meta = APP_META[id];
          const Icon = iosIcons[ICON_MAP[id] ?? "about"];
          return (
            <motion.button
              key={id}
              layout
              initial={{ opacity: 0, x: -40, scale: 0.85 }}
              animate={{ opacity: w.minimized ? 0.55 : 0.85, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.85 }}
              whileHover={{ opacity: 1, x: 6, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={() => open(id)}
              className="pointer-events-auto w-[120px] h-[78px] rounded-lg overflow-hidden
                         border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02]
                         backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
                         flex flex-col"
              aria-label={`Focus ${meta?.title ?? id}`}
              title={meta?.title ?? id}
            >
              <div className="h-3 bg-white/10 border-b border-white/10 flex items-center gap-1 px-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 px-2">
                <div className="w-7 h-7"><Icon /></div>
                <span className="text-[10px] text-white/90 truncate font-medium">{meta?.title ?? id}</span>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default StageManager;