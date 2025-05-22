import React, { useState, useContext, useEffect } from 'react';
import { BookContext } from '../store/BookContext';

const NoteForm = ({ bookId, initialNote }) => {
  const { updateBook } = useContext(BookContext);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialNote) setNote(initialNote);
  }, [initialNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateBook(bookId, { notes: note });
    alert("Note updated!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Note</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        cols={40}
      />
      <br />
      <button type="submit">Save Note</button>
    </form>
  );
};

export default NoteForm;
