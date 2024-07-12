import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, render, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import Bookshelf from '.'; // Ensure the path is correct for your project structure

expect.extend(matchers);

// Sample data
const booksData = [
  {
    author: "Roald Dahl",
    category: "book",
    description: "The legendary Roald Dahl story with full-colour illustrations by Quentin Blake throughout...",
    email: "jim@jimmy.com",
    genre: ["Adventure"],
    img: "http://books.google.com/books/content?id=hp_7DAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    issue_num: 1,
    item_id: 1,
    rating: 4,
    title: "Fantastic Mr. Fox",
    tradeable: true
  },
  // Add more books as needed for testing
];

describe('Bookshelf Component', () => {
  beforeEach(() => {
    render(<Bookshelf items={booksData} />);
  });

  afterEach(cleanup);

  it('should render the correct number of BookCard components', () => {
    const bookCards = screen.getAllByTestId('book-card');
    expect(bookCards).toHaveLength(booksData.length);
  });

  it('should display the correct title for each book', () => {
    booksData.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
  });

  it('should display the correct author for each book', () => {
    booksData.forEach(book => {
      expect(screen.getByText(book.author)).toBeInTheDocument();
    });
  });

  // Add more tests for other properties like genres, owner, and rating if needed
});
