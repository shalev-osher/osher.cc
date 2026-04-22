import confetti from "canvas-confetti";

const GOLD = ["#D4AF37", "#FFD700", "#F5C518", "#B8860B", "#FFF8DC"];

/**
 * Premium gold-themed confetti burst for success moments.
 * Two staggered cannons for a richer effect.
 */
export function celebrate() {
  const defaults = {
    spread: 70,
    ticks: 80,
    gravity: 0.9,
    decay: 0.94,
    startVelocity: 35,
    colors: GOLD,
    disableForReducedMotion: true,
  };

  confetti({ ...defaults, particleCount: 60, origin: { x: 0.2, y: 0.8 } });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.8, y: 0.8 } });
  }, 150);
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 80, spread: 110, origin: { x: 0.5, y: 0.6 } });
  }, 300);
}

/**
 * Subtle UI sound utility using Web Audio API.
 * No external assets required. Respects prefers-reduced-motion as a proxy for "quiet" preference.
 */
let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function isMuted(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return localStorage.getItem("ui-sound") === "off";
  } catch {
    return false;
  }
}

export function playTone(freq = 880, duration = 0.08, type: OscillatorType = "sine", volume = 0.06) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // ignore
  }
}

export const sounds = {
  click: () => playTone(660, 0.05, "triangle", 0.04),
  success: () => {
    playTone(523, 0.09, "sine", 0.06);
    setTimeout(() => playTone(784, 0.12, "sine", 0.06), 90);
    setTimeout(() => playTone(1046, 0.16, "sine", 0.06), 200);
  },
  error: () => playTone(220, 0.18, "sawtooth", 0.04),
  hover: () => playTone(1200, 0.03, "sine", 0.02),
};

export function hapticTap() {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  } catch {
    // ignore
  }
}
