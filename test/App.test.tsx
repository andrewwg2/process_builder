
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  it('renders the palette and trash containers', () => {
    render(<App />);
    // Both lists have data-testid attributes
    const addRow = screen.getByText('Add Row');
    const clearAll = screen.getByText('Clear All');
    const workArea = screen.getByTestId('workArea');
    expect(addRow).toBeInTheDocument();
    expect(clearAll).toBeInTheDocument();
    expect(workArea).toBeInTheDocument();
  });
});