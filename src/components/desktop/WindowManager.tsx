import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type AppId =
  | "home" | "about" | "skills" | "projects"
  | "experience" | "education" | "contact"
  | "finder" | "terminal" | "calculator";

export interface WindowState {
  id: AppId;
  x: number; y: number;
  w: number; h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number };
}

interface Store {
  windows: Record<string, WindowState>;
  order: AppId[];
  focus: AppId | null;
  zTop: number;
}

type Action =
  | { type: "open"; id: AppId; defaults: { w: number; h: number } }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "maximize"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; w: number; h: number };

const STORAGE_KEY = "osher-os-windows-v1";

const empty: Store = { windows: {}, order: [], focus: null, zTop: 10 };

const loadInitial = (): Store => {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Store;
    // Clamp to viewport so a stale position can't park a window off-screen
    const W = window.innerWidth, H = window.innerHeight;
    Object.values(parsed.windows || {}).forEach((w) => {
      w.x = Math.min(Math.max(0, w.x), Math.max(0, W - 200));
      w.y = Math.min(Math.max(28, w.y), Math.max(28, H - 120));
    });
    return { ...empty, ...parsed };
  } catch { return empty; }
};

function reducer(state: Store, a: Action): Store {
  switch (a.type) {
    case "open": {
      const existing = state.windows[a.id];
      const zTop = state.zTop + 1;
      if (existing) {
        return {
          ...state,
          zTop,
          focus: a.id,
          windows: { ...state.windows, [a.id]: { ...existing, minimized: false, z: zTop } },
        };
      }
      const count = state.order.length;
      const baseX = Math.max(40, Math.round(window.innerWidth / 2 - a.defaults.w / 2)) + (count % 6) * 28;
      const baseY = Math.max(48, Math.round(window.innerHeight / 2 - a.defaults.h / 2) - 40) + (count % 6) * 22;
      const win: WindowState = {
        id: a.id, x: baseX, y: baseY, w: a.defaults.w, h: a.defaults.h,
        z: zTop, minimized: false, maximized: false,
      };
      return { ...state, zTop, focus: a.id, order: [...state.order, a.id], windows: { ...state.windows, [a.id]: win } };
    }
    case "close": {
      const next = { ...state.windows };
      delete next[a.id];
      const order = state.order.filter((x) => x !== a.id);
      return { ...state, windows: next, order, focus: order[order.length - 1] ?? null };
    }
    case "focus": {
      const w = state.windows[a.id];
      if (!w) return state;
      const zTop = state.zTop + 1;
      return { ...state, zTop, focus: a.id, windows: { ...state.windows, [a.id]: { ...w, z: zTop, minimized: false } } };
    }
    case "minimize": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, focus: state.focus === a.id ? null : state.focus, windows: { ...state.windows, [a.id]: { ...w, minimized: true } } };
    }
    case "maximize": {
      const w = state.windows[a.id];
      if (!w) return state;
      if (w.maximized && w.prev) {
        return { ...state, windows: { ...state.windows, [a.id]: { ...w, ...w.prev, maximized: false, prev: undefined } } };
      }
      const prev = { x: w.x, y: w.y, w: w.w, h: w.h };
      return {
        ...state,
        windows: {
          ...state.windows,
          [a.id]: { ...w, prev, maximized: true, x: 8, y: 36, w: window.innerWidth - 16, h: window.innerHeight - 110 },
        },
      };
    }
    case "move": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, windows: { ...state.windows, [a.id]: { ...w, x: a.x, y: a.y } } };
    }
    case "resize": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, windows: { ...state.windows, [a.id]: { ...w, w: a.w, h: a.h } } };
    }
  }
}

interface Ctx {
  state: Store;
  open: (id: AppId, defaults?: { w?: number; h?: number }) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  maximize: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, w: number, h: number) => void;
}

const WindowCtx = createContext<Ctx | null>(null);

export const WindowManagerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, empty, loadInitial);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Notify menu bar / others about focus changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("desktop-focus-change", { detail: state.focus }));
  }, [state.focus]);

  // External callers (CommandPalette, etc.) can open apps via an event
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent).detail as AppId | undefined;
      if (!id) return;
      dispatch({ type: "open", id, defaults: { w: 920, h: 620 } });
    };
    window.addEventListener("open-app", onOpen);
    return () => window.removeEventListener("open-app", onOpen);
  }, []);

  const open = useCallback((id: AppId, d?: { w?: number; h?: number }) => {
    dispatch({ type: "open", id, defaults: { w: d?.w ?? 920, h: d?.h ?? 620 } });
  }, []);
  const close = useCallback((id: AppId) => dispatch({ type: "close", id }), []);
  const focus = useCallback((id: AppId) => dispatch({ type: "focus", id }), []);
  const minimize = useCallback((id: AppId) => dispatch({ type: "minimize", id }), []);
  const maximize = useCallback((id: AppId) => dispatch({ type: "maximize", id }), []);
  const move = useCallback((id: AppId, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);
  const resize = useCallback((id: AppId, w: number, h: number) => dispatch({ type: "resize", id, w, h }), []);

  const value = useMemo(() => ({ state, open, close, focus, minimize, maximize, move, resize }),
    [state, open, close, focus, minimize, maximize, move, resize]);

  return <WindowCtx.Provider value={value}>{children}</WindowCtx.Provider>;
};

export const useWindows = () => {
  const ctx = useContext(WindowCtx);
  if (!ctx) throw new Error("useWindows must be used inside WindowManagerProvider");
  return ctx;
};
