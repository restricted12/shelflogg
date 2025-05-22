import React, { useState, useContext, useEffect } from 'react';
import { BookContext } from '../store/BookContext';
import { useNavigate } from 'react-router-dom';

const BookForm = ({ initialData = null }) => {
  const { addBook, updateBook } = useContext(BookContext);
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',
    status: 'to-read',
    notes: [], // Changed to array to match backend schema
  });
  const [notesInput, setNotesInput] = useState(''); // Separate state for textarea input
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      // Normalize initialData.notes to array of objects
      const notesArray = Array.isArray(initialData.notes)
        ? initialData.notes.map((note) => ({
            content: note.content || note,
            createdAt: note.createdAt,
            _id: note._id,
          }))
        : [];
      setBook({
        title: initialData.title || '',
        author: initialData.author || '',
        category: initialData.category || '',
        status: initialData.status || 'to-read',
        notes: notesArray,
      });
      setNotesInput(notesArray.map((note) => note.content).join('\n'));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notes') {
      setNotesInput(value);
      const notesArray = value
        .split('\n')
        .filter((note) => note.trim() !== '')
        .map((note, index) => {
          const existingNote = book.notes[index] || {};
          return {
            content: note,
            ...(existingNote._id && { _id: existingNote._id }),
            ...(existingNote.createdAt && { createdAt: existingNote.createdAt }),
          };
        });
      setBook((prev) => ({ ...prev, notes: notesArray }));
    } else {
      setBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateBook(initialData._id, book);
        setSuccessMessage('Book updated successfully!');
      } else {
        await addBook(book);
        setSuccessMessage('Book added successfully!');
        setBook({
          title: '',
          author: '',
          category: '',
          status: 'to-read',
          notes: [],
        });
        setNotesInput('');
      }
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 2000);
    } catch (err) {
      setSuccessMessage('');
      console.error('Error submitting book:', err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4 fw-bold text-primary">
            {initialData ? 'Edit Book' : 'Add New Book'}
          </h3>

          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={book.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Author</label>
              <input
                type="text"
                name="author"
                className="form-control"
                value={book.author}
                onChange={handleChange}
                required
                placeholder="Enter author's name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={book.category}
                onChange={handleChange}
                placeholder="E.g., Fiction, Biography"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                name="status"
                className="form-select"
                value={book.status}
                onChange={handleChange}
              >
                <option value="to-read">To Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Notes</label>
              <textarea
                name="notes"
                className="form-control"
                rows="4"
                value={notesInput}
                onChange={handleChange}
                placeholder="Add any notes about the book (one per line)..."
              ></textarea>
            </div>

            <div className="d-grid gap-2 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary shadow-sm">
                {initialData ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;