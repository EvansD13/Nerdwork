import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Genre,Rating} from '../../components';
import { useLocation } from 'react-router-dom';
import penguin from "../../assest/icons/penguin.png"


import "./bookDetails.css"

const apiURL = "https://nerdwork-qlxa.onrender.com
"
const siteURL = "https://nerdwork.onrender.com/"
const localURL = "http://localhost:5173/"

export default function BookDetailPage(){
  
  const location = useLocation();
  const books = location.state;
  const data  = books["0"]
  const navigate = useNavigate()

  async function handleOwnerClick(bookId, ownerEmail) {
      const requesterEmail = localStorage.getItem('email')
      console.log(bookId, ownerEmail, requesterEmail)
      
      try {
        const response = await fetch('https://nerdwork-qlxa.onrender.com
/trade/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email_request: requesterEmail,
            user_email_requestie: ownerEmail,
            wanted_item_id : bookId,
            rejected_by_requestie: false 
          }),
        });
  
        if (!response.ok) {
          const errorBody = await response.json(); 
          throw new Error(`HTTP error! status: ${response.status}, Message: ${errorBody.message}`);
        }
  } catch(e){
    console.log(e)
  }
}
  
const backArrow = () => {
  console.log(data.category)
  if (data.category == 'book') {
    navigate('/booksearch')
  } else if (data.category == 'comic book') {
    navigate('/comicsearch')
  } else if (data.category == 'game') {
    navigate('/gamesearch')
  } 
}
  
  if (!data) {
    return <div>Loading...</div>;
  }
  const UserCard = ({ user }) => {
    const [showRequestButton, setShowRequestButton] = useState(false);

    const toggleRequestButton = () => {
      setShowRequestButton(!showRequestButton);
    };
    return (
      <div className="user-card" onClick={toggleRequestButton}>
        <img src={user.profileImageUrl || penguin} alt={`${user.email}'s profile`} className="profile-icon" />
        <div>{user.email}</div>
        {showRequestButton && (
          <button className="send-request-btn" onClick={() => handleOwnerClick(user.item_id, user.email)}>
            Send Request
          </button>
        )}
      </div>
      
    );
  };
  
  return (
    <div className="book-detail-page">
      <div className="container" style={{width: "100%"}}>
        <div className='flexbox-container'>
          <div className='flexbox-container' style={{justifyContent: "flex-start", width: "50%"}}>
            
              <i className="material-symbols-outlined bell-ikon" style={{marginRight: "200px"}} onClick={() => backArrow()}>
                arrow_back_ios
              </i>
           
            
          </div>
          <div className='flexbox-container' style={{width: "600px"}}>
            <h1 className="page-title">{data.title}</h1>
          </div>

        </div>
        <h3 className='page-author'> {data.author}</h3>
        <div className="image-container">
          <img src={data.img} alt={data.title} className="book-image"/>
        </div>
        <div className="text-content">
          <h3 className='description-title'> Description : </h3>
          <div className='description'>
            <p>{data.description}</p>
          </div>
          <div className="genres">
            <Genre genres={data.genre} />
          </div>
          <div className="rating">
            <Rating value={data.rating} />
          </div>
        </div>
      </div>
      <div className="owners-section">
      <h2>Users Email</h2>
      <div className="owners-list">
        {books?.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </div>
    </div>
    </div>
  );
}


  