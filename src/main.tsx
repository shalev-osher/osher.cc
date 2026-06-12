import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force dark mode permanently (theme toggle removed per design)
try {
  document.documentElement.classList.add("dark");
  localStorage.removeItem("theme");
} catch {}

// Hard cache-bust: if the build ID changed since last visit, force a fresh reload once.
try {
  const KEY = "__app_build_id";
  const prev = localStorage.getItem(KEY);
  if (prev && prev !== __BUILD_ID__) {
    localStorage.setItem(KEY, __BUILD_ID__);
    // Avoid infinite reload loops with a session sentinel
    if (!sessionStorage.getItem("__app_build_reloaded")) {
      sessionStorage.setItem("__app_build_reloaded", "1");
      location.reload();
    }
  } else {
    localStorage.setItem(KEY, __BUILD_ID__);
    sessionStorage.removeItem("__app_build_reloaded");
  }
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
