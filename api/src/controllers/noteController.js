const NoteRepository = require('../repository/noteRepository');
const NoteService = require('../services/noteService');
const NoteDto = require('../dtos/noteDto');
const ApiResponse = require('../dtos/apiResponse');

class NoteController {
    constructor() {
        this.noteRepository = new NoteRepository();
        this.noteService = new NoteService(this.noteRepository);
    }

    getNotes = async (req, res) => {
        try {
            const notes = await this.noteService.getNotesByUserId(req.user.id);
            res.json(ApiResponse.success(NoteDto.map(notes)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    getNoteById = async (req, res) => {
        try {
            const note = await this.noteService.getNoteById(req.params.id);
            if (!note) return res.status(404).json(ApiResponse.error('Note not found', 'Not Found'));
            res.json(ApiResponse.success(NoteDto.map(note)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    createNote = async (req, res) => {
        try {
            const note = await this.noteService.createNote(req.user.id, req.body);
            res.status(201).json(ApiResponse.success(NoteDto.map(note[0]), 'Note created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    updateNote = async (req, res) => {
        try {
            const note = await this.noteService.updateNote(req.params.id, req.body);
            res.json(ApiResponse.success(NoteDto.map(note[0]), 'Note updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    deleteNote = async (req, res) => {
        try {
            await this.noteService.deleteNote(req.params.id);
            res.status(200).json(ApiResponse.success(null, 'Note deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };
}

module.exports = new NoteController();
