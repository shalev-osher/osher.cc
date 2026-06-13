import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Note { id: string; title: string; body: string; updated: number; }
const KEY = "osher-os-notes-v1";

const load = (): Note[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const save = (n: Note[]) => { try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} };

const NotesApp = () => {
  const [notes, setNotes] = useState<Note[]>(() => load());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && notes[0]) setActiveId(notes[0].id);
  }, [notes, activeId]);

  useEffect(() => { save(notes); }, [notes]);

  const active = notes.find((n) => n.id === activeId) ?? null;

  const create = () => {
    const n: Note = { id: crypto.randomUUID(), title: "Untitled", body: "", updated: Date.now() };
    setNotes([n, ...notes]);
    setActiveId(n.id);
  };
  const update = (patch: Partial<Note>) => {
    if (!active) return;
    setNotes(notes.map((n) => n.id === active.id ? { ...n, ...patch, updated: Date.now() } : n));
  };
  const remove = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <div className="h-full w-full flex bg-gradient-to-br from-[#1a1610] to-[#0e0c08] text-white">
      <aside className="w-56 border-e border-white/10 flex flex-col">
        <button
          onClick={create}
          className="m-2 flex items-center justify-center gap-2 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-sm font-medium border border-primary/30"
        >
          <Plus size={14} /> New Note
        </button>
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 && (
            <p className="text-center text-white/50 text-xs mt-8 px-3">No notes yet. Create one above.</p>
          )}
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`group w-full text-left px-3 py-2 border-b border-white/5 hover:bg-white/5
                          ${activeId === n.id ? "bg-primary/15" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{n.title || "Untitled"}</span>
                <Trash2
                  size={12}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:text-[#ff5f57]"
                  onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                />
              </div>
              <div className="text-[11px] text-white/50 truncate mt-0.5">
                {n.body.split("\n")[0] || "No additional text"}
              </div>
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        {active ? (
          <>
            <input
              value={active.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Title"
              className="bg-transparent border-b border-white/10 px-4 py-2 text-lg font-display font-semibold outline-none"
            />
            <textarea
              value={active.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder="Start writing…"
              className="flex-1 bg-transparent p-4 outline-none resize-none text-sm leading-relaxed font-mono"
            />
            <div className="px-4 py-1.5 text-[10px] text-white/40 border-t border-white/10">
              Saved · {new Date(active.updated).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm">
            Select or create a note
          </div>
        )}
      </main>
    </div>
  );
};

export default NotesApp;