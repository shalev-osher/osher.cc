import { useEffect, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from "react";
import { motion } from "framer-motion";
import { useWindows, type AppId } from "./WindowManager";
import { cn } from "@/lib/utils";

interface Props {
  id: AppId;
  title: string;
  app?: string;
  children: ReactNode;
  dark?: boolean;
}

const MIN_W = 380;
const MIN_H = 280;

const DesktopWindow = ({ id, title, app, children, dark }: Props) => {
  const { state, close, focus, minimize, maximize, move, resize } = useWindows();
  const w = state.windows[id];
  const focused = state.focus === id;
  const ref = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (!resizing || !w) return;
    const onMove = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const newW = Math.max(MIN_W, e.clientX - rect.left);
      const newH = Math.max(MIN_H, e.clientY - rect.top);
      resize(id, newW, newH);
    };
    const onUp = () => setResizing(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [resizing, w, id, resize]);

  if (!w || w.minimized) return null;

  const onHandleDown = (e: RPointerEvent) => {
    if (w.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: w.x, oy: w.y };
    if (!focused) focus(id);
  };
  const onHandleMove = (e: RPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    const nx = Math.max(-w.w + 140, Math.min(window.innerWidth - 140, dragRef.current.ox + dx));
    const ny = Math.max(28, Math.min(window.innerHeight - 60, dragRef.current.oy + dy));
    move(id, nx, ny);
  };
  const onHandleUp = (e: RPointerEvent) => {
    dragRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      onPointerDown={() => !focused && focus(id)}
      style={{
        position: "fixed",
        left: w.x, top: w.y, width: w.w, height: w.h,
        zIndex: w.z,
      }}
      data-window
      className={cn(
        "rounded-xl overflow-hidden border shadow-2xl backdrop-blur-2xl flex flex-col",
        dark
          ? "bg-[hsl(0_0%_8%/0.94)] text-[hsl(60_20%_92%)] border-white/10"
          : "bg-background/85 border-border/40",
        focused ? "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" : "shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)]",
      )}
    >
      <div
        onPointerDown={onHandleDown}
        onPointerMove={onHandleMove}
        onPointerUp={onHandleUp}
        onPointerCancel={onHandleUp}
        onDoubleClick={() => maximize(id)}
        className="relative flex items-center gap-3 px-3 py-2 border-b border-border/40 bg-gradient-to-b from-white/[0.06] to-transparent select-none cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); close(id); }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 hover:brightness-110"
            aria-label="Close"
          />
          <button
            onClick={(e) => { e.stopPropagation(); minimize(id); }}
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 hover:brightness-110"
            aria-label="Minimize"
          />
          <button
            onClick={(e) => { e.stopPropagation(); maximize(id); }}
            className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 hover:brightness-110"
            aria-label="Maximize"
          />
        </div>
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 max-w-[70%]">
            {app && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-mono">
                {app}
              </span>
            )}
            <span className={cn("text-[12px] font-medium truncate", focused ? "text-foreground" : "text-foreground/60")}>
              {title}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto">
        {children}
      </div>

      {!w.maximized && (
        <button
          aria-label="Resize"
          onPointerDown={(e) => { e.preventDefault(); setResizing(true); }}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-50 hover:opacity-100 z-10"
          style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.35) 50%)" }}
        />
      )}
    </motion.div>
  );
};

export default DesktopWindow;
