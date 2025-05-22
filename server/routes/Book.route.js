const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookcontroller');

// POST: Add book
router.post('/add', bookController.addBook);

// PUT: Edit book
router.put('/edit/:id', bookController.editBook);

// DELETE: Delete book
router.delete('/delete/:id', bookController.deleteBook);

// GET: Get all books (filtered)
router.get('/all', bookController.getAllBooks);

// GET: Get all books (unfiltered)
router.get('/all-unfiltered', bookController.getAllBooksUnfiltered);

// GET: Get book by ID
router.get('/:id', bookController.getBookById);

module.exports = router;
