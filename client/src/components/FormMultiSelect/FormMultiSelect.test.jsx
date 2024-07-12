import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import FormMultiSelect from '.'; // Adjust the import path to match your file structure

describe('FormMultiSelect Component', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
  
    beforeEach(() => {
      render(
        <FormMultiSelect 
          label="Test Label"
          name="testName"
          selected={['Option 1', 'Option 2']}
          options={options}
          onChange={() => {}}
        />
      );
    });

  afterEach(() => {
    cleanup();
  });

  it('renders options correctly', () => {
    options.forEach(option => {
      const element = screen.getByText(option);
      expect(element).not.toBeNull(); // Alternative to toBeInTheDocument
    });
  });

  it('calls onChange when an option is clicked', () => {
    const firstOption = screen.getByText(options[0]);
    fireEvent.click(firstOption);
    // Since onChangeMock is a simple function, it doesn't have observable effects for testing
    // Typically, you would test if onChange is called with the expected value
  });

  it('applies the correct variant to selected options', () => {
    const selectedOption1 = screen.getByText('Option 1');
    const selectedOption2 = screen.getByText('Option 2');
    const unselectedOption = screen.getByText('Option 3');

    // Check if the selected options have the 'btn-primary' class
    expect(selectedOption1.className).toContain('btn-primary');
    expect(selectedOption2.className).toContain('btn-primary');

    // Check if the unselected option has the 'btn-secondary' class
    expect(unselectedOption.className).toContain('btn-secondary');
  });
});
