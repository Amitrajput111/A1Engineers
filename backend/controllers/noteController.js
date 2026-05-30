const mongoose = require('mongoose');
const Note = require('../models/Note');
const { notes: memoryNotes, generateId } = require('../utils/memoryDb');

const VALID_CATEGORIES = ['DSA', 'Web Development', 'AI/ML'];

const DEFAULT_NOTE_TEMPLATE = `# Summary
[Write a concise 2-3 sentence overview of this concept]

# Detailed Explanation
[Explain the core mechanics, formulas, or runtime behaviors in detail]

# Examples
\`\`\`javascript
// Write a commented code implementation or case scenario
\`\`\`

# Key Points
- Core takeaway 1
- Core takeaway 2

# Revision Section
[List 2-3 quick questions or self-check bullet items for later study review]`;

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const userId = req.user.id;

    let notesList = [];

    if (mongoose.connection.readyState === 1) {
      let query = { userId };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      notesList = await Note.find(query).sort({ updatedAt: -1 });
    } else {
      // Memory DB fallback
      notesList = Array.from(memoryNotes.values()).filter(note => note.userId.toString() === userId.toString());
      
      if (category && category !== 'All') {
        notesList = notesList.filter(note => note.category === category);
      }
      
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        notesList = notesList.filter(note => searchRegex.test(note.title));
      }
      
      // Sort by updatedAt desc
      notesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    res.status(200).json({ success: true, count: notesList.length, notes: notesList });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note with a standard engineering study template
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res, next) => {
  try {
    const { title, category } = req.body;

    const selectedCategory = VALID_CATEGORIES.includes(category) ? category : 'DSA';
    const noteTitle = title || `New ${selectedCategory} Note`;

    let note;

    if (mongoose.connection.readyState === 1) {
      note = await Note.create({
        userId: req.user.id,
        title: noteTitle,
        content: DEFAULT_NOTE_TEMPLATE,
        category: selectedCategory,
      });
    } else {
      // Memory DB fallback
      const newId = generateId();
      note = {
        _id: newId,
        userId: req.user.id,
        title: noteTitle,
        content: DEFAULT_NOTE_TEMPLATE,
        category: selectedCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryNotes.set(newId, note);
    }

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    let note;

    if (mongoose.connection.readyState === 1) {
      note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ success: false, error: 'Note not found' });
      }

      // Verify user ownership
      if (note.userId.toString() !== req.user.id.toString()) {
        return res.status(401).json({ success: false, error: 'Not authorized to update this note' });
      }

      if (title) note.title = title;
      if (content !== undefined) note.content = content;
      if (category && VALID_CATEGORIES.includes(category)) note.category = category;

      await note.save();
    } else {
      // Memory DB fallback
      note = memoryNotes.get(req.params.id);
      if (!note) {
        return res.status(404).json({ success: false, error: 'Note not found' });
      }

      // Verify user ownership
      if (note.userId.toString() !== req.user.id.toString()) {
        return res.status(401).json({ success: false, error: 'Not authorized to update this note' });
      }

      if (title) note.title = title;
      if (content !== undefined) note.content = content;
      if (category && VALID_CATEGORIES.includes(category)) note.category = category;
      
      note.updatedAt = new Date();
      memoryNotes.set(req.params.id, note);
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    let note;

    if (mongoose.connection.readyState === 1) {
      note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ success: false, error: 'Note not found' });
      }

      // Verify user ownership
      if (note.userId.toString() !== req.user.id.toString()) {
        return res.status(401).json({ success: false, error: 'Not authorized to delete this note' });
      }

      await note.deleteOne();
    } else {
      // Memory DB fallback
      note = memoryNotes.get(req.params.id);
      if (!note) {
        return res.status(404).json({ success: false, error: 'Note not found' });
      }

      // Verify user ownership
      if (note.userId.toString() !== req.user.id.toString()) {
        return res.status(401).json({ success: false, error: 'Not authorized to delete this note' });
      }

      memoryNotes.delete(req.params.id);
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
