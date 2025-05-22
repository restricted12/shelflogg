import React, { useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookContext } from '../store/BookContext';

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ') : '';

const ViewBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBookById, selectedBook, loading, error } = useContext(BookContext);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      console.log('Fetching book with ID:', id);
      fetchBookById(id);
      hasFetched.current = true;
    }
  }, [id, fetchBookById]);

  useEffect(() => {
    console.log('Current selectedBook:', selectedBook);
    console.log('Current loading state:', loading);
    console.log('Current error state:', error);
  }, [selectedBook, loading, error]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'to-read':
        return 'bi-bookmark-star';
      case 'reading':
        return 'bi-book-half';
      case 'completed':
        return 'bi-check-circle';
      default:
        return 'bi-question-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Error formatting date:', dateString, err);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 text-muted">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <p className="text-danger fs-5">{error || 'An error occurred while fetching book details.'}</p>
          <div className="mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => {
                hasFetched.current = false;
                fetchBookById(id);
              }}
              aria-label="Retry fetching book"
            >
              <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i> Retry
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              aria-label="Return to homepage"
            >
              <i className="bi bi-arrow-left me-2" aria-hidden="true"></i> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBook || !selectedBook._id) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <p className="text-muted fs-5">No book data available for this ID.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate('/')}
            aria-label="Return to homepage"
          >
            <i className="bi bi-arrow-left me-2" aria-hidden="true"></i> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <style>
        {`
          .book-card {
            max-width: 600px;
            margin: 0 auto;
            font-family: 'Arial', sans-serif;
          }
          .book-details, .notes-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .book-details div, .notes-container li {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .notes-container {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }
          .notes-container li {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .notes-container li:last-child {
            border-bottom: none;
          }
          .timestamp {
            font-size: 0.85rem;
            color: #6c757d;
            margin-left: auto;
          }
          .card-header {
            background-color: #4CAF50;
          }
          .card-footer {
            background-color: #f8f9fa;
          }
        `}
      </style>

      <div className="book-card">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-book me-2" aria-hidden="true"></i>
              <span>{selectedBook.title || 'Untitled'}</span>
            </h2>
          </div>
          <div className="card-body book-details">
            <div>
              <i className="bi bi-person me-2" aria-hidden="true"></i>
              <strong>Author:</strong> <span>{selectedBook.author || 'Unknown'}</span>
            </div>
            <div>
              <i className="bi bi-bookshelf me-2" aria-hidden="true"></i>
              <strong>Category:</strong> <span>{selectedBook.category || 'N/A'}</span>
            </div>
            <div>
              <i className={`bi ${getStatusIcon(selectedBook.status)} me-2`} aria-hidden="true"></i>
              <strong>Status:</strong> <span>{capitalize(selectedBook.status) || 'N/A'}</span>
            </div>
            <div className="notes-container">
              <h5 className="d-flex align-items-center gap-2">
                <i className="bi bi-journal-text me-2" aria-hidden="true"></i> Notes
              </h5>
              {selectedBook.notes && selectedBook.notes.length > 0 ? (
                <ul className="list-group list-group-flush" aria-label="Notes for the book">
                  {selectedBook.notes.map((note, index) => (
                    <li key={index} className="list-group-item">
                      <span>{note.content || 'No content'}</span>
                      {note.createdAt && (
                        <span className="timestamp">{formatDate(note.createdAt)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No notes available.</p>
              )}
            </div>
            <div>
              <i className="bi bi-calendar me-2" aria-hidden="true"></i>
              <strong>Created:</strong> <span>{formatDate(selectedBook.createdAt)}</span>
            </div>
            <div>
              <i className="bi bi-calendar-check me-2" aria-hidden="true"></i>
              <strong>Updated:</strong> <span>{formatDate(selectedBook.updatedAt)}</span>
            </div>
          </div>
          <div className="card-footer text-end">
            <button
              className="btn btn-warning me-2"
              onClick={() => navigate(`/edit_book/${id}`)}
              aria-label="Edit book"
            >
              <i className="bi bi-pencil-square me-2" aria-hidden="true"></i> Edit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              aria-label="Return to homepage"
            >
              <i className="bi bi-arrow-left me-2" aria-hidden="true"></i> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookPage;