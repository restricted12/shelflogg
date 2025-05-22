import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookContext } from '../store/BookContext';

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ') : '';

const HomePage = () => {
  const {
    books,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    filterTitle,
    setFilterTitle,
    loading,
    error,
    deleteBook,
  } = useContext(BookContext);

  const [showFilter, setShowFilter] = useState(false);
  const [visibleNotes, setVisibleNotes] = useState({});
  const [likedBooks, setLikedBooks] = useState({}); // State to track liked books
  const navigate = useNavigate();

  const editBook = (id) => {
    navigate(`/edit_book/${id}`);
  };

  const viewBook = (id) => {
    navigate(`/view_book/${id}`);
  };

  const toggleNotes = (bookId) => {
    setVisibleNotes((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  // Toggle like state for a book
  const toggleLike = (bookId) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const statuses = ['', 'to-read', 'reading', 'completed'];
  const categories = ['', 'Fiction', 'Science', 'History', 'Biography', 'General'];

  const clearFilters = () => {
    setFilterStatus('');
    setFilterCategory('');
    setFilterTitle('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'to-read':
        return 'bi-bookmark-star';
      case 'reading':
        return 'bi-book-half';
      case 'completed':
        return 'bi-check-circle';
      default:
        return '';
    }
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'to-read':
        return 'bg-warning text-dark';
      case 'reading':
        return 'bg-info text-white';
      case 'completed':
        return 'bg-success text-white';
      default:
        return 'bg-secondary';
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesStatus = filterStatus ? book.status === filterStatus : true;
    const matchesCategory = filterCategory ? book.category === filterCategory : true;
    const matchesTitle = filterTitle
      ? book.title.toLowerCase().includes(filterTitle.toLowerCase())
      : true;
    return matchesStatus && matchesCategory && matchesTitle;
  });

  return (
    <div className="container my-5">
      <style>
        {`
          .collapse {
            transition: height 0.3s ease;
            overflow: hidden;
          }
          .collapsing {
            transition: height 0.3s ease;
          }
          .notes-container {
            background-color: #f8f9fa;
            padding: 10px;
            border-top: 1px solid #dee2e6;
            margin-top: 10px;
          }
          .card-title, .card-text, .card-subtitle {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .like-icon {
            cursor: pointer;
            color: #dc3545;
          }
          .status-badge {
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            border-radius: 0.25rem;
          }
        `}
      </style>

      <h1 className="mb-4 text-center">My Book Shelf</h1>

      {/* Hamburger button for mobile */}
      <div className="d-md-none mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowFilter(true)}
        >
          <i className="bi bi-filter-left me-2"></i> Filters
        </button>
      </div>

      {/* Filter Offcanvas for small screens */}
      <div
        className={`offcanvas offcanvas-start ${showFilter ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: showFilter ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filter Books</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowFilter(false)}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label className="form-label">Filter by Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.slice(1).map((status) => (
                <option key={status} value={status}>
                  {capitalize(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Filter by Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Filter by Title</label>
            <input
              type="text"
              className="form-control"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              placeholder="Search by title"
            />
          </div>

          <button className="btn btn-secondary w-100" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Filters visible on medium and larger screens */}
      <div className="d-none d-md-flex row mb-4 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.slice(1).map((status) => (
              <option key={status} value={status}>
                {capitalize(status)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Filter by Category</label>
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Filter by Title</label>
          <input
            type="text"
            className="form-control"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            placeholder="Search by title"
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-secondary w-100" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center">Loading books...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Book Cards */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <p className="text-center fs-4">
              No books found. Please add some books or{' '}
              <button className="btn btn-link p-0" onClick={clearFilters}>
                clear filters
              </button>.
            </p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {filteredBooks.map((book) => (
                <div key={book._id} className="col">
                  <div className="card h-100 shadow">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        <i className="bi bi-book me-2"></i> {book.title}
                        <i
                          className={`bi ${
                            likedBooks[book._id] ? 'bi-heart-fill' : 'bi-heart'
                          } like-icon ms-auto`}
                          onClick={() => toggleLike(book._id)}
                          title={likedBooks[book._id] ? 'Unlike' : 'Like'}
                        ></i>
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        <i className="bi bi-person me-2"></i> by {book.author}
                      </h6>
                      <p className="card-text">
                        <i className="bi bi-bookshelf me-2"></i> <strong>Category:</strong> {book.category}
                      </p>
                      <p className="card-text">
                        <i className={`bi ${getStatusIcon(book.status)} me-2`}></i>
                        <strong>Status:</strong> {capitalize(book.status)}
                        <span className={`status-badge ${getStatusBadgeColor(book.status)} ms-2`}>
                          {capitalize(book.status)}
                        </span>
                      </p>
                      <button
                        className="btn btn-outline-secondary mb-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#notes-${book._id}`}
                        aria-expanded={visibleNotes[book._id] ? 'true' : 'false'}
                        aria-controls={`notes-${book._id}`}
                        onClick={() => toggleNotes(book._id)}
                      >
                        <i className={`bi ${visibleNotes[book._id] ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
                        {visibleNotes[book._id] ? 'Hide Notes' : 'Show Notes'}
                      </button>
                      <div
                        className={`collapse ${visibleNotes[book._id] ? 'show' : ''}`}
                        id={`notes-${book._id}`}
                      >
                        <div className="notes-container">
                          {book.notes && book.notes.length > 0 ? (
                            <ul className="list-group list-group-flush">
                              {book.notes.map((note, index) => (
                                <li key={index} className="list-group-item">
                                  {note.content || 'No content'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted">No notes available.</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-info text-white"
                          onClick={() => viewBook(book._id)}
                        >
                          <i className="bi bi-eye-fill me-1"></i> View
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => editBook(book._id)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteBook(book._id)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;