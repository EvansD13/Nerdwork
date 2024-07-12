import { useState } from "react";
import "./App.css";
import * as Pages from "./pages";

import { Routes, Route, useNavigate } from "react-router-dom";

import { NavigationBar, Bookshelf } from "./components";

import React from "react";


function App() {  
  const [books, setBooks] = useState([]);
  
  function LayoutWithHeader({ children }) {
    return (
      <div>
        <NavigationBar />
        {children}
      </div>
    );
  }


  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
      <Routes>
        <Route path="/" element={<Pages.LoginPage />} />
        <Route path="/signup" element={<Pages.SignupPage />} />
        <Route element={<LayoutWithHeader />}>
          <Route path="/Home" element={<Pages.HomePage/>} /> 
          <Route path="/BookSearch" element={<Pages.BookSearchPage/>} /> 
          <Route path="/ComicSearch" element={<Pages.ComicSearchPage/>} /> 
          <Route path="/GameSearch" element={<Pages.GameSearchPage/>} /> 

          <Route path="/Profile" element={<Pages.ProfilePage onAddBook={handleAddBook}/>} /> 
          <Route path ="/profile/bookshelf" element={<Pages.MyBookshelfPage onAddBook={handleAddBook}/>} />

          <Route path="/request/:id" element={<Pages.RequestPage />} />
          <Route path="/BookDetail/:id" element={<Pages.BookDetailPage />} />

          <Route path="/forms" element={<Pages.FormsPage onAddBook={handleAddBook} />} />
          <Route path="/books" element={<Pages.BookshelfPage books={books} />} />

          {/* <Route path="/books" element={<Bookshelf />} /> */}

          <Route path="/communities" element={<Pages.CommunityPage />} />
          <Route path="/communities/threads/:id" element={<Pages.ThreadsPage />} />
          <Route path="/post/:thread_id" element={<Pages.PostPage />} />


        </Route>
      </Routes>
  );
}


export default App;
