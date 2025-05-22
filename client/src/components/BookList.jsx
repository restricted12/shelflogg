// src/components/BookList.jsx

import React, { useContext } from 'react';
import { BookContext } from '../store/BookContext';

const BookList = () => {
  const { books, deleteBook } = useContext(BookContext);

  return (
    <div>
      <h2>My Books</h2>
      {books.map((book) => (
        <div key={book._id} style={{ border: '1px solid gray', margin: 8, padding: 8 }}>
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
          <p>Status: {book.status}</p>
          <button onClick={() => deleteBook(book._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BookList;
