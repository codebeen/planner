"use client";
import { useState } from "react";
import { NotebookPen, Plus, X } from "lucide-react";

export type Note = { id: number; title: string; body: string; color: string };
const COLORS = ["bg-pink-50", "bg-rose-50", "bg-fuchsia-50", "bg-purple-50", "bg-pink-100"];

interface Props {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function Notes({ notes, setNotes }: Props) {
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const openNew = () => {
    setEditing({ id: 0, title: "", body: "", color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    setTitle(""); setBody("");
  };

  const save = () => {
    if (!title.trim() && !body.trim()) { setEditing(null); return; }
    if (editing!.id === 0) {
      setNotes(prev => [...prev, { ...editing!, id: Date.now(), title, body }]);
    } else {
      setNotes(prev => prev.map(n => n.id === editing!.id ? { ...n, title, body } : n));
    }
    setEditing(null);
  };

  const remove = (id: number) => setNotes(prev => prev.filter(n => n.id !== id));
  const openEdit = (n: Note) => { setEditing(n); setTitle(n.title); setBody(n.body); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-pink-700 font-semibold text-lg flex items-center gap-2"><NotebookPen size={18} /> Notes</h2>
        <button onClick={openNew} className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl font-medium flex items-center gap-1.5"><Plus size={14} /> New Note</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 border border-pink-100">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..."
              className="w-full text-lg font-semibold text-pink-800 border-b border-pink-100 pb-2 mb-3 outline-none placeholder-pink-300" />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your note here..." rows={6}
              className="w-full text-sm text-pink-700 outline-none resize-none placeholder-pink-300" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-pink-400 hover:text-pink-600">Cancel</button>
              <button onClick={save} className="px-4 py-2 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium">Save</button>
            </div>
          </div>
        </div>
      )}

      {notes.length === 0 && (
        <div className="text-center text-pink-300 py-16">
          <NotebookPen size={40} className="mx-auto mb-2 text-pink-200" />
          <p className="text-sm">No notes yet. Create one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {notes.map(n => (
          <div key={n.id} className={`${n.color} rounded-2xl p-4 border border-pink-100 group relative cursor-pointer`} onClick={() => openEdit(n)}>
            <button onClick={e => { e.stopPropagation(); remove(n.id); }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500"><X size={13} /></button>
            {n.title && <h3 className="font-semibold text-pink-800 text-sm mb-1 pr-4">{n.title}</h3>}
            <p className="text-pink-600 text-xs line-clamp-4 whitespace-pre-wrap">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
