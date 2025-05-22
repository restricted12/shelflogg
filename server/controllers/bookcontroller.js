const Book = require('../models/Book');
const mongoose = require('../config/db');

exports.addBook = async (req, res) => {
    const { title, author, category = 'General', status = 'to-read', notes = [] } = req.body;
    try {
        if (!title) return res.status(400).json({ message: 'Title is required' });
        if (!author) return res.status(400).json({ message: 'Author is required' });

        const notesArray = Array.isArray(notes) ? notes : [];

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const newBook = new Book({ title, author, category, status, notes: notesArray });
        const savedBook = await newBook.save({ timeoutMS: 15000 });
        res.status(201).json({ message: 'Book added successfully', book: savedBook });
    } catch (error) {
        console.error('Error adding book:', error);
        if (error.name === 'MongoNetworkError' || error.message.includes('timed out')) {
            return res.status(503).json({
                message: 'Database connection timed out',
                error: 'Check MongoDB Atlas status or network',
            });
        }
        res.status(500).json({ message: 'Error adding book', error: error.message });
    }
};

exports.editBook = async (req, res) => {
    const { id } = req.params;
    const allowedUpdates = ['title', 'author', 'category', 'status','notes'];
    const updates = {};

    for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.notes && !Array.isArray(updates.notes)) {
        return res.status(400).json({ message: 'Notes must be an array' });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            timeoutMS: 15000,
        });

        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const deletedBook = await Book.findByIdAndDelete(id, { timeoutMS: 15000 });

        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    const { status, category, title } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (title) filter.title = { $regex: title, $options: 'i' };

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const books = await Book.find(filter);
        res.json({ count: books.length, books });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
};

exports.getAllBooksUnfiltered = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const books = await Book.find({});
        res.json({ count: books.length, books });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
};

exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not ready, please try again' });
        }

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error: error.message });
    }
};
