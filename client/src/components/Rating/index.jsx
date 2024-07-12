import React from 'react';

export default function Rating({ value }) {
  return (
    <div className="rating-stars" >
      {'★'.repeat(value)}
      {'☆'.repeat(5 - value)}
    </div>
  );
}