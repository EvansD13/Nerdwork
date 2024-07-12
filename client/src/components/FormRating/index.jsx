import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import './StarRating.css'; // Assuming the CSS file is named StarRating.css

const Star = ({ selected, onMouseOver, onMouseOut, onClick }) => (
  <span
    className={`star ${selected ? 'selected' : ''}`}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    onClick={onClick}
  >
    &#9733;
  </span>
);

const StarRating = ({ totalStars, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleChange = (newValue) => {
    onChange({ target: { name: 'rating', value: newValue } });
  };

  return (
    <div>
      {[...Array(totalStars)].map((n, i) => (
        <Star
          key={i}
          selected={hoverValue !== undefined ? i < hoverValue : i < value}
          onMouseOver={() => setHoverValue(i + 1)}
          onMouseOut={() => setHoverValue(undefined)}
          onClick={() => handleChange(i + 1)}
        />
      ))}
    </div>
  );
};

const FormRating = ({ label, name, value, onChange }) => {
  const handleRatingChange = (e) => {
    onChange(e);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <StarRating
        totalStars={5}
        value={value}
        onChange={handleRatingChange}
      />
    </Form.Group>
  );
};

export default FormRating;
