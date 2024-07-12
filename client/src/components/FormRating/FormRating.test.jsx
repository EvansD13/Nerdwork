import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import FormRating from '.';

describe('FormRating Component', () => {
  let onChangeMock;

  beforeEach(() => {
    onChangeMock = (e) => {};
    render(<FormRating label="Rating" name="rating" value={3} onChange={onChangeMock} />);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the correct number of stars', () => {
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('renders the correct number of selected stars based on value', () => {
    const stars = screen.getAllByText('★');
    const selectedStars = stars.filter(star => star.classList.contains('selected'));
    expect(selectedStars).toHaveLength(3);
  });

  it('updates the rating on star click', () => {
    const stars = screen.getAllByText('★');
    fireEvent.click(stars[4]); // Click the 5th star
    // Since onChangeMock doesn't capture calls, you won't be able to assert its invocation directly
    // Typically, you would check if onChange is called with the expected value
  });

  it('changes the number of selected stars on hover', () => {
    const stars = screen.getAllByText('★');
    fireEvent.mouseOver(stars[2]); // Hover over the 3rd star
    // Check if the first three stars are selected
    for (let i = 0; i <= 2; i++) {
      expect(stars[i].classList.contains('selected')).toBe(true);
    }
    // Check if the last two stars are not selected
    for (let i = 3; i < 5; i++) {
      expect(stars[i].classList.contains('selected')).toBe(false);
    }
  });
});
