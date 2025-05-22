import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookContext } from '../store/BookContext';
import BookForm from '../components/BookForm';

const BookDetails = () => {
  const { id } = useParams();
  const { books, deleteBook } = useContext(BookContext);
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const foundBook = books.find(b => b._id === id);
    setBook(foundBook);
  }, [id, books]);

  const handleDelete = async () => {
    await deleteBook(id);
    navigate('/');
  };

  if (!book) return <p>Book not found</p>;

  if (isEditing) {
    return <BookForm initialData={book} />;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Status:</strong> {book.status}</p>
      <p><strong>Notes:</strong> {book.notes}</p>

      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
    </div>
  );
};

export default BookDetails;
