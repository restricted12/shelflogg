import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white shadow-sm py-4 sticky-top z-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to='/' className="text-white text-decoration-none">
          <h2 className="m-0 fw-bold">📚 ShelfLog</h2>
        </Link>

        <div className="d-flex gap-3 align-items-center">
          <Link to="/add-book" className="btn btn-success fw-semibold">
            ➕ Add Book
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
