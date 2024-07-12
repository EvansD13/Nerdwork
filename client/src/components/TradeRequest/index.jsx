import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const TradeRequest = ({ onTradeRequest, books }) => {
  // State to keep track of the form values
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // This function handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form fields
    if (!selectedBook || !selectedDate) {
      // Show an alert if validation fails
      setShowAlert(true);
    } else {
      // Hide the alert and proceed with the trade request
      setShowAlert(false);
      // Call the onTradeRequest prop with the selected book and date
      onTradeRequest(selectedBook, selectedDate);
      // Reset the form fields
      setSelectedBook('');
      setSelectedDate('');
    }
  };

  // Update state when the book selection changes
  const handleBookChange = (e) => {
    setSelectedBook(e.target.value);
  };

  // Update state when the date selection changes
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Container className="trade-request my-3">
      <Row className="justify-content-center">
        <Col lg={6}>
          <h2>Request a trade</h2>
          {showAlert && (
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
              Please select a book and a date to make a trade request.
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="book-select" className="mb-3">
              <Form.Label>Choose a book to trade:</Form.Label>
              <Form.Control as="select" name="book" value={selectedBook} onChange={handleBookChange} className="mb-3">
                <option value="" disabled>Select here...</option>
                {books?.map((book) => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="trade-date" className="mb-3">
              <Form.Label>Suggested Swap Date:</Form.Label>
              <Form.Control type="date" name="trade-date" value={selectedDate} onChange={handleDateChange} />
            </Form.Group>

            <div className="d-grid gap-2 text-center">
              <Button variant="primary" type="submit" className="mt-4">
                Make Request
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TradeRequest;
