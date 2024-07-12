import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from '.';

describe('NavigationBar Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
  });

  afterEach(cleanup);

  const links = [
    { to: '/Communities', text: 'Communities' },
    { to: '/booksearch', text: 'Books' },
    { to: '/comicsearch', text: 'Comics' },
    { to: '/gamesearch', text: 'Games' },
    { to: '/profile', text: 'Profile' },
    { to: '/', text: 'Logout' }
  ];

  links.forEach(link => {
    it(`should have a link to ${link.text}`, () => {
      const linkElement = screen.getByText(link.text).closest('a');
      expect(linkElement.getAttribute('href')).toBe(link.to);
    });
  });

  // Additional tests can be added here if necessary.
});

