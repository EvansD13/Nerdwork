import React from 'react';
import { Card, Badge } from 'react-bootstrap';

import { useNavigate } from 'react-router';

const BookCard = ({ book, isSelected }) => {

  const { title, img, author, genres, owner, rating } = book;
  // Convert numerical rating to stars
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < Math.floor(rating) ? 'text-warning' : 'text-secondary'}>
      ★
    </span>
  ));

  // Ensure genres is an array before mapping
  const genreBadges = genres && Array.isArray(genres) ? genres.map((genre, index) => (
    <Badge key={index} pill bg="secondary" className="mr-1" color='tertiary'>
      {genre}
    </Badge>
  )) : null;
  function displayUser(id){
    navigate(`/BookDetail/${id}`,{state: { book }})
  }
  return (
    <Card className={`h-100 w-60 shadow-sm bg-white rounded ${isSelected ? 'selected-book' : ''}`} style={{maxHeight:"300px", minHeight: "300px", maxWidth: "250px", minWidth: "250px"}}>

    
      <Card.Img variant="top" src={img} alt={`Cover of the book ${title}`} className="p-3" />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-0 font-weight-bold">{title}</Card.Title>
        <Card.Text className="text-secondary">{author}</Card.Text>

        <Card.Text>{genreBadges}</Card.Text>

        <div className="mt-auto">
          <div className="small text-muted">Owner: {owner}</div>
          <div>{stars}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
