import React from 'react';
import "./bookCard.css"
import { useNavigate } from 'react-router-dom';
import Genre from '../Genre'
import Rating from '../Rating';

export default function BookSearchCard ({ item }){
    const { title, author, img, rating, genre } = item;
    const navigate = useNavigate();
    function displayUser(id){
       navigate(`/BookDetail/${id}`)
    }
    console.log("item" , item)
    return (
        <div id="book-card" className="book-card" onClick={() => displayUser(item.item_id)}>
          <div className='image-frame'>
            <img src={img} alt={title} className='insert-image'/> 
          </div>
          <div className='info'>
            <div className='title'>
              <p style={{borderTop: "20px"}}>{title}</p>
            </div>
            <div className='author'>
              <p> {author}</p>
            </div>
            {/* <div className="genres">
              {genre.map((genre, index) => (
                <span key={index} className="genre">{genre}</span>
              ))}
            </div> */}
            <div className="rating">
              <Rating value={rating} />
            </div>
          </div>
            
        </div>
    );
};

