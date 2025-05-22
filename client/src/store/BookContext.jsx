import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all books without filters
  const fetchAllBooksUnfiltered = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/all-unfiltered');
      setBooks(res.data.books);
    } catch (err) {
      setError('Failed to fetch all books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books with filters
  const fetchBooksWithFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (filterStatus) query.append('status', filterStatus);
      if (filterCategory) query.append('category', filterCategory);
      if (filterTitle) query.append('title', filterTitle);

      const res = await axios.get(`/api/all?${query.toString()}`);
      setBooks(res.data.books);
    } catch (err) {
      setError('Failed to fetch books with filters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single book by ID
  const fetchBookById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/${id}`);
      setSelectedBook(res.data);
    } catch (err) {
      setError('Failed to fetch book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add book
  const addBook = async (book) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/add', book);
      setBooks((prev) => [...prev, res.data]);
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update book in state (no API call, just update state)
  const updateBook = (id, updatedData) => {
    setBooks((prev) =>
      prev.map((book) => (book._id === id ? { ...book, ...updatedData } : book))
    );
  };

  // Delete book
  const deleteBook = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/delete/${id}`);
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on filter change (status, category, title)
  useEffect(() => {
    if (filterStatus || filterCategory || filterTitle) {
      fetchBooksWithFilters();
    } else {
      fetchAllBooksUnfiltered();
    }
  }, [filterStatus, filterCategory, filterTitle]);

  return (
    <BookContext.Provider
      value={{
        books,
        selectedBook,
        fetchBookById,
        addBook,
        updateBook,
        deleteBook,
        filterStatus,
        setFilterStatus,
        filterCategory,
        setFilterCategory,
        filterTitle,
        setFilterTitle,
        loading,
        error,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};