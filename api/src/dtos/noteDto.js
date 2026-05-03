class NoteDto {
    constructor(note) {
        this.id = note.note_id;
        this.title = note.title;
        this.content = note.content;
        this.userId = note.user_id;
    }

    static map(notes) {
        if (Array.isArray(notes)) {
            return notes.map(note => new NoteDto(note));
        }
        return new NoteDto(notes);
    }
}

module.exports = NoteDto;
