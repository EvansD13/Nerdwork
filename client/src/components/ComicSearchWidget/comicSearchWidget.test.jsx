import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComicSearchWidget from '.';

describe('ComicSearchWidget Component', () => {
  let container = null;

  beforeEach(() => {
    const rendered = render(
      <MemoryRouter>
        <ComicSearchWidget />
      </MemoryRouter>
    );
    container = rendered.container;
  });

  afterEach(cleanup);

  it('renders the search form', () => {
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeDefined();
  });

  it('renders book cards container', () => {
    const cardsContainer = container.querySelector('.cards-container');
    expect(cardsContainer).toBeDefined();
  });

  // Additional tests can be added here
});
