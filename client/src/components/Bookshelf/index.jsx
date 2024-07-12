import React from 'react';
import BookCard from '../../components/BookCard';
import { Container, Row, Col } from 'react-bootstrap';

const Bookshelf = ({ items }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        {items.map((book) => (  // Use the renamed constant here
          <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Bookshelf;
