import React from 'react';
import { Form, Button } from 'react-bootstrap';

const FormMultiSelect = ({ label, name, selected, options, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div>
        {options.map((option) => (
          <Button 
            key={option}
            variant={selected.includes(option) ? 'primary' : 'secondary'}
            onClick={() => onChange(option)}
            className="m-1"
          >
            {option}
          </Button>
        ))}
      </div>
    </Form.Group>
  );
};

export default FormMultiSelect;
