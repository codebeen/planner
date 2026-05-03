class NoteService {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }

    async getNotesByUserId(userId) {
        return await this.noteRepository.getByUserId(userId);
    }

    async getNoteById(noteId) {
        const notes = await this.noteRepository.getByNoteId(noteId);
        return notes.length > 0 ? notes[0] : null;
    }

    async createNote(userId, body) {
        return await this.noteRepository.create({ user_id: userId, ...body });
    }

    async updateNote(noteId, body) {
        return await this.noteRepository.update(noteId, body);
    }

    async deleteNote(noteId) {
        return await this.noteRepository.delete(noteId);
    }
}

module.exports = NoteService;
