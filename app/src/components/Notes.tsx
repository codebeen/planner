"use client";
import { useState, useEffect, useCallback } from "react";
import { NotebookPen, Plus, X, Loader2 } from "lucide-react";
import NoteEditor from "./NoteEditor";
import { useUser } from "@/src/hooks/useUser";
import { apiFetch } from "@/src/lib/api";

export type Note = {
  note_id: string;
  title: string;
  content: string;
  user_id: string;
  color?: string;
};

const COLORS = [
  "bg-pink-50",
  "bg-rose-50",
  "bg-fuchsia-50",
  "bg-purple-50",
  "bg-pink-100",
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalColor, setModalColor] = useState(COLORS[0]);

  // ── Fetch all notes ──────────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data: Note[] = await apiFetch(`/api/notes?user_id=${user.user_id}`);
      // Attach a random color for display purposes
      setNotes(
        data.map((n) => ({
          ...n,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── Open new note modal ──────────────────────────────────────────────────
  const openNew = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setModalColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setIsModalOpen(true);
  };

  // ── Open edit modal ──────────────────────────────────────────────────────
  const openEdit = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title ?? "");
    setContent(n.content ?? "");
    setModalColor(n.color ?? COLORS[0]);
    setIsModalOpen(true);
  };

  // ── Save (create or update) ──────────────────────────────────────────────
  const save = async () => {
    if (!user) return;
    if (!title.trim() && !content.trim()) {
      setIsModalOpen(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (!editingNote) {
        // CREATE
        const created: Note = await apiFetch("/api/notes", {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            user_id: user.user_id,
          }),
        });
        setNotes((prev) => [{ ...created, color: modalColor }, ...prev]);
      } else {
        // UPDATE
        const updated: Note = await apiFetch(`/api/notes/${editingNote.note_id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        });
        setNotes((prev) =>
          prev.map((n) =>
            n.note_id === editingNote.note_id
              ? { ...updated, color: n.color }
              : n
          )
        );
      }
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const remove = async (noteId: string) => {
    setError(null);
    try {
      await apiFetch(`/api/notes/${noteId}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.note_id !== noteId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-pink-700 font-semibold text-lg flex items-center gap-2">
          <NotebookPen size={18} /> Notes
        </h2>
        <button
          onClick={openNew}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus size={14} /> New Note
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-5 border border-pink-100">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-lg font-semibold text-pink-800 border-b border-pink-100 pb-2 mb-3 outline-none placeholder-pink-300"
            />
            <NoteEditor
              content={content}
              onChange={setContent}
              placeholder="Write your note here..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="px-4 py-2 text-sm text-pink-400 hover:text-pink-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center items-center py-16 text-pink-300">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!loading && notes.length === 0 && (
        <div className="text-center text-pink-300 py-16">
          <NotebookPen size={40} className="mx-auto mb-2 text-pink-200" />
          <p className="text-sm">No notes yet. Create one!</p>
        </div>
      )}

      {/* ── Note cards ────────────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.map((n) => (
            <div
              key={n.note_id}
              className="bg-white rounded-2xl p-4 border border-pink-200 group relative cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openEdit(n)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(n.note_id);
                }}
                className="absolute top-3 right-3 text-pink-400 hover:text-pink-600"
              >
                <X size={13} />
              </button>
              {n.title && (
                <h3 className="font-semibold text-pink-800 text-sm mb-1 pr-4">
                  {n.title}
                </h3>
              )}
              <div 
                className="text-pink-600 text-xs line-clamp-4 whitespace-pre-wrap prose-preview"
                dangerouslySetInnerHTML={{ __html: n.content }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
