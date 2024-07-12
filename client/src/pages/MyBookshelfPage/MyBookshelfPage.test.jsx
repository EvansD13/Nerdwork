import React from 'react';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyBookshelfPage from '.';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Manual mock for fetch
function mockFetch(data) {
  return function(url) {
    return new Promise((resolve) => {
      resolve({
        json: () => Promise.resolve(data)
      });
    });
  };
}

describe('MyBookshelfPage Component', () => {
  beforeEach(() => {
    // Set up necessary localStorage items
    window.localStorage.setItem('shelf', 'book');
    window.localStorage.setItem('email', 'test@example.com');
    window.localStorage.setItem('token', 'fakeToken');
  
    // Mock fetch with desired response
    global.fetch = mockFetch({ username: 'testUser', items: [] });
  
    render(
      <MemoryRouter>
        <MyBookshelfPage />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    delete global.fetch;
  });

  it('renders the bookshelf container', () => {
    const bookshelfContainer = screen.getByTestId('bookshelf-container');
    expect(bookshelfContainer).toBeDefined();
  });
});