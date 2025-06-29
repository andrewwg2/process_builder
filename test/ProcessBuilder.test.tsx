// src/ProcessBuilderWithHistory.test.tsx
import React from 'react';
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProcessBuilderWithHistory from '../src/ProcessBuilder';

// Minimal DataTransfer stub
function createDataTransfer() {
  const data: Record<string, string> = {};
  return {
    setData: (_type: string, val: string) => { data[_type] = val; },
    getData: (_type: string) => data[_type] || '',
    effectAllowed: '',
  } as unknown as DataTransfer;
}

describe('ProcessBuilderWithHistory Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial state: one row, 4 palette items, empty slots and trash', () => {
    render(<ProcessBuilderWithHistory />);
    // Palette items
    const palette = screen.getByTestId('row-1::palette');
    const items = within(palette).getAllByText(/^(map|filter|reduce|compress)$/);
    expect(items).toHaveLength(4);
    // Slots empty
    ['slot-1-1','slot-1-2','slot-1-3'].forEach(slotId => {
      const slot = screen.getByTestId(`row-1::${slotId}`);
      expect(within(slot).getByText(/Drop here/)).toBeInTheDocument();
    });
    // Trash empty
    const trash = screen.getByTestId('row-1::trash');
    expect(within(trash).queryAllByText(/^(map|filter|reduce|compress)$/)).toHaveLength(0);
    // Undo should be disabled, redo disabled
    expect(screen.getByTestId('undo-button')).toBeDisabled();
    expect(screen.getByTestId('redo-button')).toBeDisabled();
  });

  it('adds a second row when Add Row clicked', () => {
    render(<ProcessBuilderWithHistory />);
    fireEvent.click(screen.getByTestId('add-row-button'));
    // New row appears
    const palette2 = screen.getByTestId('row-2::palette');
    const items2 = within(palette2).getAllByText(/^(map|filter|reduce|compress)$/);
    expect(items2).toHaveLength(4);
    // Row-2 slots empty
    ['slot-2-1','slot-2-2','slot-2-3'].forEach(slotId => {
      const slot = screen.getByTestId(`row-2::${slotId}`);
      expect(within(slot).getByText(/Drop here/)).toBeInTheDocument();
    });
  });

  it('drag & drop moves an item and updates history', () => {
    render(<ProcessBuilderWithHistory />);
    const palette = screen.getByTestId('row-1::palette');
    const slot = screen.getByTestId('row-1::slot-1-1');

    // Perform drag
    const item = within(palette).getByText('map');
    const dt = createDataTransfer();
    fireEvent.dragStart(item, { dataTransfer: dt });
    fireEvent.dragOver(slot, { dataTransfer: dt });
    fireEvent.drop(slot, { dataTransfer: dt });

    // Slot contains map
    expect(within(slot).getByTestId('row-1::slot-1-1::map')).toBeInTheDocument();
    // Undo enabled, redo disabled
    expect(screen.getByTestId('undo-button')).not.toBeDisabled();
    expect(screen.getByTestId('redo-button')).toBeDisabled();
  });

  it('undo reverts the last action', () => {
    render(<ProcessBuilderWithHistory />);
    const palette = screen.getByTestId('row-1::palette');
    const slot = screen.getByTestId('row-1::slot-1-1');
    const dt = createDataTransfer();
    fireEvent.dragStart(within(palette).getByText('map'), { dataTransfer: dt });
    fireEvent.dragOver(slot, { dataTransfer: dt });
    fireEvent.drop(slot, { dataTransfer: dt });
    // Undo
    fireEvent.click(screen.getByTestId('undo-button'));
    expect(within(slot).getByText(/Drop here/)).toBeInTheDocument();
    // Redo now enabled
    expect(screen.getByTestId('redo-button')).not.toBeDisabled();
  });

  it('redo reapplies the undone action', () => {
    render(<ProcessBuilderWithHistory />);
    const palette = screen.getByTestId('row-1::palette');
    const slot = screen.getByTestId('row-1::slot-1-1');
    const dt = createDataTransfer();
    fireEvent.dragStart(within(palette).getByText('map'), { dataTransfer: dt });
    fireEvent.dragOver(slot, { dataTransfer: dt });
    fireEvent.drop(slot, { dataTransfer: dt });
    fireEvent.click(screen.getByTestId('undo-button'));
    fireEvent.click(screen.getByTestId('redo-button'));
    expect(within(slot).getByTestId('row-1::slot-1-1::map')).toBeInTheDocument();
  });

  it('clear resets to initial state', () => {
    render(<ProcessBuilderWithHistory />);
    // add row and move one
    fireEvent.click(screen.getByTestId('add-row-button'));
    const palette = screen.getByTestId('row-2::palette');
    const trashSlot = screen.getByTestId('row-2::trash');
    const dt = createDataTransfer();
    fireEvent.dragStart(within(palette).getByText('compress'), { dataTransfer: dt });
    fireEvent.dragOver(trashSlot, { dataTransfer: dt });
    fireEvent.drop(trashSlot, { dataTransfer: dt });
    // Clear
    fireEvent.click(screen.getByTestId('clear-button'));
    // Only row-1 exists
    expect(screen.queryByTestId('row-2::container')).toBeNull();
    const palette1 = screen.getByTestId('row-1::palette');
    expect(within(palette1).getAllByText(/^(map|filter|reduce|compress)$/)).toHaveLength(4);
  });

  it('persists across rerenders via localStorage', () => {
    const { unmount } = render(<ProcessBuilderWithHistory />);
    const palette = screen.getByTestId('row-1::palette');
    const slot = screen.getByTestId('row-1::slot-1-1');
    const dt = createDataTransfer();
    fireEvent.dragStart(within(palette).getByText('map'), { dataTransfer: dt });
    fireEvent.dragOver(slot, { dataTransfer: dt });
    fireEvent.drop(slot, { dataTransfer: dt });
    // unmount and remount
    unmount();
    render(<ProcessBuilderWithHistory />);
    const restoredSlot = screen.getByTestId('row-1::slot-1-1');
    expect(within(restoredSlot).getByTestId('row-1::slot-1-1::map')).toBeInTheDocument();
  });
});
