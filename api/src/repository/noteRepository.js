const { supabaseAdmin } = require("../config/supabase.js");

class NoteRepository {
    // Get all notes for a specific user
    async getByUserId(userId) {
        const { data, error } = await supabaseAdmin
            .from("Notes")
            .select("note_id, title, content, color, user_id")
            .eq("user_id", userId);

        if (error) throw error;
        return data;
    }

    // Get a single note by id
    async getByNoteId(noteId) {
        const { data, error } = await supabaseAdmin
            .from("Notes")
            .select("note_id, title, content, color, user_id")
            .eq("note_id", noteId);
        
        if (error) throw error;
        return data; // return the first match
    }

    // Create a note
    async create(note) {
        const { data, error } = await supabaseAdmin
            .from("Notes")
            .insert([note])
            .select("note_id, title, content, color, user_id");

        if (error) throw error;
        return data;
    }

    // Update a note
    async update(noteId, updatedFields) {
        const { data, error } = await supabaseAdmin
            .from("Notes")
            .update(updatedFields)
            .eq("note_id", noteId)
            .select("note_id, title, content, color, user_id");

        if (error) throw error;
        return data; // return the first match
    }

    // Delete a note
    async delete(noteId) {
        const { data, error } = await supabaseAdmin
            .from("Notes")
            .delete()
            .eq("note_id", noteId);
        
        if (error) throw error;
        return data; // return the first match
    }
}

module.exports = NoteRepository;
