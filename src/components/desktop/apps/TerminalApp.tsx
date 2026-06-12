import { useEffect, useRef, useState } from "react";
import { useWindows, type AppId } from "../WindowManager";

interface Line { kind: "in" | "out"; text: string; }

const HELP = `Available commands:
  help        Show this help
  whoami      About the operator
  projects    Open the Projects app
  about       Open About Me
  skills      Open Skills
  experience  Open Experience
  contact     Open Contact
  finder      Open Finder
  clear       Clear the screen
  date        Show current date/time
  echo <txt>  Print text`;

const WHOAMI = `shalev@osher.cc
System Administrator · DevOps · Technical Support
Voicenter · Ashkelon, IL
Certs: MCSA, Linux Essentials, CHCSS`;

const TerminalApp = () => {
  const { open } = useWindows();
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "Last login: " + new Date().toLocaleString() },
    { kind: "out", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const next: Line[] = [...lines, { kind: "in", text: cmd }];
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const openApp = (id: AppId) => { open(id); next.push({ kind: "out", text: `Opening ${id}…` }); };
    switch (name) {
      case "": break;
      case "help": next.push({ kind: "out", text: HELP }); break;
      case "whoami": next.push({ kind: "out", text: WHOAMI }); break;
      case "date": next.push({ kind: "out", text: new Date().toString() }); break;
      case "echo": next.push({ kind: "out", text: arg }); break;
      case "clear": setLines([]); setInput(""); return;
      case "projects": openApp("projects"); break;
      case "about": openApp("about"); break;
      case "skills": openApp("skills"); break;
      case "experience": openApp("experience"); break;
      case "contact": openApp("contact"); break;
      case "finder": openApp("finder"); break;
      default: next.push({ kind: "out", text: `zsh: command not found: ${name}` });
    }
    setLines(next);
    setInput("");
  };

  return (
    <div
      className="h-full w-full p-3 font-mono text-[13px] leading-[1.5]"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {l.kind === "in" ? (
            <><span className="text-[#7CD992]">shalev@osher</span><span className="opacity-70">:~$ </span>{l.text}</>
          ) : l.text}
        </div>
      ))}
      <div className="flex">
        <span className="text-[#7CD992]">shalev@osher</span>
        <span className="opacity-70">:~$&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") run(input); }}
          className="flex-1 bg-transparent outline-none text-inherit"
          spellCheck={false}
          autoCapitalize="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default TerminalApp;
