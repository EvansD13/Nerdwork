
import React , { useState } from "react";
import "./carousel.css"
import { useNavigate } from 'react-router-dom';


export default function HomePage(){
    const navigate = useNavigate()
    const mockBooks = [
        { id: 1, title: "Book One", owner: "Alice", author: "Author A" },
        { id: 2, title: "Book Two", owner: "Bob", author: "Author B" },
        { id: 3, title: "Book Three", owner: "Charlie", author: "Author C" },
        { id: 4, title: "Book Four", owner: "David", author: "Author D" },
        { id: 5, title: "Book Five", owner: "Eve", author: "Author E" }
      ];
      
      // Mock data for forums
      const mockForums = [
        { id: 1, title: "Forum One", members: 123 },
        { id: 2, title: "Forum Two", members: 456 },
        { id: 3, title: "Forum Three", members: 789 },
        { id: 4, title: "Forum Four", members: 234 },
        { id: 5, title: "Forum Five", members: 567 }
      ];

    const [books] = useState(mockBooks);
    const [forums] = useState(mockForums);
  
    function handleCardClick(id){
        navigate(`/request/${id}`)
      };



  return (
    <div className="main-container">
    <h2>Top 5 Books</h2>
    <div className="grid-container">
      {mockBooks.map(book => (
        <div className="grid-item" key={book.id} onClick={() => handleCardClick(book.id)}>
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
          <p>Owner: {book.owner}</p>
        </div>
      ))}
    </div>

    <h2>Top 5 Community Forums</h2>
    <div className="grid-container">
      {mockForums.map(forum => (
        <div className="grid-item" key={forum.id}>
          <h3>{forum.title}</h3>
          <p>Members: {forum.members}</p>
        </div>
      ))}
    </div>
  </div>
  );
}
