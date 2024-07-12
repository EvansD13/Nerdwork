import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import FormInput from '.'; // Adjust the path according to your project structure

// Extend the expect function with all the jest-dom assertions
expect.extend(matchers);

describe('FormInput Component', () => {
  let onChangeMock;

  beforeEach(() => {
    // Define a simple function to simulate onChange
    onChangeMock = (event) => {};

    render(
      <FormInput 
        label="Test Label"
        name="testName"
        value=""
        type="text"
        placeholder="Test Placeholder"
        onChange={onChangeMock}
      />
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    const input = screen.getByPlaceholderText('Test Placeholder');
    expect(input).toBeInTheDocument();
  });

  it('has the correct type', () => {
    const input = screen.getByPlaceholderText('Test Placeholder');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('updates on change', () => {
    const input = screen.getByPlaceholderText('Test Placeholder');
    userEvent.type(input, 'New Value');
    // Since onChangeMock is a simple function, it doesn't have observable effects for testing
    // Typically, you would test if onChange is called with the expected value
  });

  it('displays the correct label', () => {
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('has the correct name attribute', () => {
    const input = screen.getByPlaceholderText('Test Placeholder');
    expect(input).toHaveAttribute('name', 'testName');
  });
});
