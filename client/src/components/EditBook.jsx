import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BookContext } from '../store/BookContext';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBook, setFilterStatus, setFilterCategory, setFilterTitle } = useContext(BookContext);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    category: '',
    status: '',
    notes: [],
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchBookById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching book with ID:', id);
      const res = await axios.get(`/api/${id}`);
      console.log('API Response:', res.data);
      const fetchedBook = res.data;

      const normalizedBook = {
        title: fetchedBook.title || '',
        author: fetchedBook.author || '',
        category: fetchedBook.category || '',
        status: fetchedBook.status || '',
        notes: Array.isArray(fetchedBook.notes) ? fetchedBook.notes : [],
      };

      setSelectedBook(normalizedBook);
      setBookData(normalizedBook);
    } catch (err) {
      console.error('Fetch Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Book ID from params:', id);
    if (id) {
      fetchBookById(id);
    } else {
      setError('No book ID provided in URL');
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotesChange = (e) => {
    const text = e.target.value;
    const newNotes = text
      .split('\n')
      .filter((note) => note.trim() !== '')
      .map((note, index) => {
        const existingNote = bookData.notes[index];
        return {
          content: note,
          ...(existingNote?._id && { _id: existingNote._id }),
          ...(existingNote?.createdAt && { createdAt: existingNote.createdAt }),
        };
      });
    setBookData((prev) => ({
      ...prev,
      notes: newNotes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      console.log('Submitting updated book data:', JSON.stringify(bookData, null, 2));
      const response = await axios.put(`/api/edit/${id}`, bookData);
      console.log('Update Response:', response.data);

      updateBook(id, response.data);
      setFilterStatus('');
      setFilterCategory('');
      setFilterTitle('');
      alert('Book updated successfully!');
      // navigate('/');s
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update book';
      console.error('Update Error Details:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (loading) return <p>Loading book data...</p>;
  if (!selectedBook) return <p>No book data available.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>Edit Book</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: '600', color: '#444' }}>Title:</label><br />
          <input
            type="text"
            name="title"
            value={bookData.title || ''}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: '600', color: '#444' }}>Author:</label><br />
          <input
            type="text"
            name="author"
            value={bookData.author || ''}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: '600', color: '#444' }}>Category:</label><br />
          <input
            type="text"
            name="category"
            value={bookData.category || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: '600', color: '#444' }}>Status:</label><br />
          <select
            name="status"
            value={bookData.status || ''}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
          >
            <option value="">Select status</option>
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: '600', color: '#444' }}>Notes:</label><br />
          <textarea
            name="notes"
            value={bookData.notes.map((n) => n.content).join('\n') || ''}
            onChange={handleNotesChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', minHeight: '100px' }}
          />
        </div>

        {saveError && <p style={{ color: 'red' }}>{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
        >
          {saving ? 'Saving...' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;