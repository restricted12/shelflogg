import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BookProvider } from './store/BookContext'
import BookForm from './components/BookForm';
import Header from './components/Header';
import Footer from './components/footer';
import BookEdit from './components/EditBook';
import ViewBookPage from './pages/viewbookpage';
// import BookList from './components/BookList'
import Home from './pages/Home'
const App = () => {
  return (
    <BookProvider>
      <Router>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-book" element={<BookForm />} />
          <Route path="/edit_book/:id" element={<BookEdit />} />
          <Route path="/view_book/:id" element={<ViewBookPage />} />
          {/* <Route path="/booklist" element={<BookList />} /> */}
        
          
        </Routes>
        <Footer/>
      </Router>
      
    </BookProvider>
  )
}

export default App;
