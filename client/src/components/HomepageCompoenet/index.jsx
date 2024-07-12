import React from 'react';
import './HomePageCard.css'; 
import penguin from "../../assest/icons/penguin.png"
const HomePageCard = () => {
  return (
    <div className="home-page-card">
      <div className="home-page-header">
        <img src = {penguin} alt="Header Icon" className="home-page-icon" />
        <h2>Home</h2>  
        </div>
        <div className='form-discription'>
          <p>Your personal Community FrontPage. Come here to check in with your favorite communities.</p>
        </div> 
      
      <button className="home-page-button create-community">Create Community</button>
    </div>
  );
};

export default HomePageCard;