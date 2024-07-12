import React from 'react';
import "./genre.css"
export default function Genre({ genres }) {
  return (
    <ul className='no-bullets'>
      {genres.map((genre, index) => (
        <li key={index}>{genre}</li>
      ))}
    </ul>
  );
}
