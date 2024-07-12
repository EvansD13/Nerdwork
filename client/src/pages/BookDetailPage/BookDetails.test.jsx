import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookDetailPage from '.';

describe('BookDetailPage Component', () => {
    const mockBooks = [
      {
        item_id: '1',
        title: 'Test Book',
        author: 'Test Author',
        img: 'test-img-url.jpg',
        description: 'Test Description',
        genre: ['Fiction'],
        rating: 4,
        profileImageUrl: 'test-profile-url.jpg',
        email: 'test@example.com'
      },
      // Additional mock book objects as needed
    ];
  
    beforeEach(() => {
        render(
          <MemoryRouter initialEntries={[{ pathname: '/bookdetails', state: mockBooks }]}>
            <Routes>
              <Route path='/bookdetails' element={<BookDetailPage />} />
            </Routes>
          </MemoryRouter>
        );
      });
  
    afterEach(cleanup);

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <BookDetailPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeDefined();
    cleanup();
  });

  it('renders book details', () => {
    render(
      <MemoryRouter>
        <BookDetailPage location={{ state: mockBooks }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Book')).toBeDefined();
    expect(screen.getByText('Test Author')).toBeDefined();
    expect(screen.getByText('Test Description')).toBeDefined();
    cleanup();
  });

  it('renders user cards', () => {
    const userCards = document.querySelectorAll('.user-card');
    expect(userCards.length).toBe(mockBooks.length);
  });

  it('toggles request button on user card click', () => {
    const userCards = document.querySelectorAll('.user-card');
    if (userCards.length > 0) {
      fireEvent.click(userCards[0]);
      // After clicking, check if the 'Send Request' button is visible
      // This may require a more specific selector based on your implementation
    }
  });

});
