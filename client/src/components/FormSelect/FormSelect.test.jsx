import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import FormSelect from '.';

describe('FormSelect Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  beforeEach(() => {
    render(
      <FormSelect
        label="Test Select"
        name="testSelect"
        value=""
        options={options}
        onChange={() => {}}
      />
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the select element with correct options', () => {
    const select = screen.getByLabelText('Test Select');
    expect(select).toBeDefined(); // Alternative to toBeInTheDocument
    expect(select.children).toHaveLength(options.length + 1); // +1 for the default 'Select...' option
  });

  it('disables the select element if disabled prop is true', () => {
    cleanup();
    render(
      <FormSelect
        label="Test Select"
        name="testSelect"
        value=""
        options={options}
        onChange={() => {}}
        disabled={true}
      />
    );
    const select = screen.getByLabelText('Test Select');
    expect(select.disabled).toBe(true); // Alternative to toBeDisabled
  });
});
