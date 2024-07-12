import React from 'react';
import { Form } from 'react-bootstrap';

const FormInput = ({ label, name, value, type, placeholder, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default FormInput;
