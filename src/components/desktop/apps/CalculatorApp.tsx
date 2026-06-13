import { useEffect, useState } from "react";

const KEYS: { l: string; cls?: string; val: string }[] = [
  { l: "AC", val: "ac", cls: "bg-white/15 text-white" },
  { l: "±",  val: "neg", cls: "bg-white/15 text-white" },
  { l: "%",  val: "pct", cls: "bg-white/15 text-white" },
  { l: "÷",  val: "/", cls: "bg-primary text-primary-foreground" },
  { l: "7",  val: "7" }, { l: "8", val: "8" }, { l: "9", val: "9" },
  { l: "×",  val: "*", cls: "bg-primary text-primary-foreground" },
  { l: "4",  val: "4" }, { l: "5", val: "5" }, { l: "6", val: "6" },
  { l: "−",  val: "-", cls: "bg-primary text-primary-foreground" },
  { l: "1",  val: "1" }, { l: "2", val: "2" }, { l: "3", val: "3" },
  { l: "+",  val: "+", cls: "bg-primary text-primary-foreground" },
  { l: "0",  val: "0", cls: "col-span-2" }, { l: ".", val: "." },
  { l: "=",  val: "=", cls: "bg-primary text-primary-foreground" },
];

const CalculatorApp = () => {
  const [acc, setAcc] = useState("0");
  const [op, setOp] = useState<string | null>(null);
  const [prev, setPrev] = useState<number | null>(null);
  const [justEvaled, setJustEvaled] = useState(false);

  const compute = (a: number, b: number, o: string) => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const press = (v: string) => {
    if (/^[0-9]$/.test(v)) {
      setAcc(justEvaled || acc === "0" ? v : acc + v);
      setJustEvaled(false);
    } else if (v === ".") {
      if (!acc.includes(".")) setAcc(acc + ".");
    } else if (v === "ac") {
      setAcc("0"); setOp(null); setPrev(null);
    } else if (v === "neg") {
      setAcc((parseFloat(acc) * -1).toString());
    } else if (v === "pct") {
      setAcc((parseFloat(acc) / 100).toString());
    } else if (["+","-","*","/"].includes(v)) {
      if (prev !== null && op && !justEvaled) {
        const r = compute(prev, parseFloat(acc), op);
        setPrev(r); setAcc(String(r));
      } else setPrev(parseFloat(acc));
      setOp(v); setJustEvaled(true);
    } else if (v === "=") {
      if (op !== null && prev !== null) {
        const r = compute(prev, parseFloat(acc), op);
        setAcc(String(r)); setPrev(null); setOp(null); setJustEvaled(true);
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9.]$/.test(e.key)) press(e.key);
      else if (["+","-","*","/"].includes(e.key)) press(e.key);
      else if (e.key === "Enter" || e.key === "=") press("=");
      else if (e.key === "Backspace") setAcc((a) => (a.length <= 1 ? "0" : a.slice(0, -1)));
      else if (e.key === "Escape") press("ac");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const display = acc.length > 12 ? parseFloat(acc).toExponential(6) : acc;

  return (
    <div className="h-full w-full p-4 flex flex-col gap-3 bg-gradient-to-b from-[#0d0d10] to-[#16161a]">
      <div className="flex-1 min-h-[80px] rounded-xl bg-black/40 border border-white/10 flex items-end justify-end p-4">
        <span className="text-white text-5xl font-light tabular-nums tracking-tight truncate">
          {display}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <button
            key={k.l}
            onClick={() => press(k.val)}
            className={`h-12 rounded-xl font-medium text-lg active:brightness-125 transition
                        ${k.cls ?? "bg-white/[0.08] text-white hover:bg-white/15"}`}
          >
            {k.l}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;