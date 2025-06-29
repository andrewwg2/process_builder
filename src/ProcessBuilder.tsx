// src/ProcessBuilder.tsx
// Version 1.06.06A
import { useState, useCallback, useEffect } from 'react';

// A mapping of slot IDs to the function assigned, or null if empty
interface SlotState {
  [slotId: string]: string | null;
}

// State for each row: unique ID, available functions (palette), assigned slots, and trash
interface RowState {
  rowId: string;
  palette: string[];
  slots: SlotState;
  trash: string[];
}

// Key for persisting history in localStorage
const STORAGE_KEY = 'processbuilderhistory';
// All functions available to be dragged
const ALL_FUNCTIONS = ['map', 'filter', 'reduce', 'compress'];

// Load history snapshots from localStorage, or return empty array on error
function loadHistory(): RowState[][] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as RowState[][];
  } catch {
    return [];
  }
}

// Save current history snapshots to localStorage
function saveHistory(history: RowState[][]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Main component managing rows with undo/redo and drag-drop
export default function ProcessBuilderWithHistory() {
  // Initial row setup with empty slots and full palette
  const initialRows: RowState[] = [
    {
      rowId: 'row-1',
      palette: [...ALL_FUNCTIONS],
      slots: { 'slot-1-1': null, 'slot-1-2': null, 'slot-1-3': null },
      trash: []
    }
  ];

  // History of row arrays, loaded from storage or set to initial
  const [history, setHistory] = useState<RowState[][]>(() => {
    const loaded = loadHistory();
    return loaded.length ? loaded : [initialRows];
  });
  // Current index in history for undo/redo
  const [index, setIndex] = useState(history.length - 1);
  // Current set of rows to display
  const rows = history[index];

  // Persist history whenever it changes
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Apply a new state: discard future redo states, append, and move index
  const apply = useCallback((newRows: RowState[]) => {
    setHistory(prev => {
      const truncated = prev.slice(0, index + 1);
      return [...truncated, newRows];
    });
    setIndex(i => i + 1);
  }, [index]);

  // Undo to previous history index
  const undo = useCallback(() => {
    if (index > 0) setIndex(i => i - 1);
  }, [index]);

  // Redo to next history index
  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex(i => i + 1);
  }, [history.length, index]);

  // Clear all history and reset to initial state
  const clearAll = useCallback(() => {
    setHistory([initialRows]);
    setIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Add a new empty row at the bottom
  const addRow = useCallback(() => {
    const newRowIndex = rows.length + 1;
    const newId = `row-${newRowIndex}`;
    const newSlots: SlotState = {
      [`slot-${newRowIndex}-1`]: null,
      [`slot-${newRowIndex}-2`]: null,
      [`slot-${newRowIndex}-3`]: null,
    };
    const newRows = [
      ...rows,
      { rowId: newId, palette: [...ALL_FUNCTIONS], slots: newSlots, trash: [] }
    ];
    apply(newRows);
  }, [rows, apply]);

  // Begin drag: store row ID, source container, and function name
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, rowId: string, container: string, fn: string) => {
      e.dataTransfer.setData('text/plain', `${rowId}:${container}::${fn}`);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  // Handle dropping a function into a container (palette, slot, or trash)
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, rowIdx: number, dest: string) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const [srcRow, srcContainer, empty, fn] = raw.split(':');
      console.log(`raw ${raw} ${empty}`);
      if (rows[rowIdx].rowId !== srcRow || srcContainer === dest) return;

      // Update only the row being modified
      const newRows = rows.map((r, idx) => {
        if (idx !== rowIdx) return r;
        const updated: RowState = {
          rowId: r.rowId,
          palette: [...r.palette],
          slots: { ...r.slots },
          trash: [...r.trash],
        };
        // Remove the function from its source
        if (srcContainer === 'palette') {
          updated.palette = updated.palette.filter(item => item !== fn);
        } else if (srcContainer.startsWith('slot-')) {
          updated.slots[srcContainer] = null;
        } else {
          updated.trash = updated.trash.filter(item => item !== fn);
        }
        // Add or swap into destination
        if (dest.startsWith('slot-')) {
          const existing = updated.slots[dest];
          if (existing) {
            updated.slots[dest] = fn;
            if (srcContainer.startsWith('slot-')) {
              updated.slots[srcContainer] = existing;
            } else if (srcContainer === 'palette') {
              updated.palette.push(existing);
            } else {
              updated.trash.push(existing);
            }
          } else {
            updated.slots[dest] = fn;
          }
        } else if (dest === 'palette') {
          updated.palette.push(fn);
        } else {
          updated.trash.push(fn);
        }
        return updated;
      });

      apply(newRows);
    },
    [rows, apply]
  );

  // Allow drop by preventing default behavior
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Render UI: controls and rows
  return (
    <div className="p-3">N
      <div className="flex gap-2 mb-4 p-3" data-testid="workArea">
        <button data-testid="undo-button" className="px-3 py-1 bg-gray-200 rounded" onClick={undo} disabled={index === 0}>Undo</button>
        <button data-testid="redo-button" className="px-3 py-1 bg-gray-200 rounded" onClick={redo} disabled={index >= history.length - 1}>Redo</button>
        <button data-testid="add-row-button" className="px-3 py-1 bg-green-200 rounded" onClick={addRow}>Add Row</button>
        <button data-testid="clear-button" className="px-3 py-1 bg-red-200 rounded" onClick={clearAll}>Clear All</button>
      </div>
      {rows.map((r, i) => (
        <div key={r.rowId} data-testid={`${r.rowId}::container`} className="flex gap-4 mb-6 text-slate-800 border-2 border-gray-300 p-3">
          <div className="w-1/4">
            <h4 className="mb-2">Palette ({r.rowId})</h4>
            <div data-testid={`${r.rowId}::palette`} className="border-2 border-gray-300 bg-gray-50 p-2 rounded w-31 h-48" onDragOver={allowDrop} onDrop={e => handleDrop(e, i, 'palette')}>
              {r.palette.map(fn => (
                <div
                  key={fn}
                  data-testid={`${r.rowId}::palette::${fn}`}
                  draggable
                  onDragStart={e => handleDragStart(e, r.rowId, 'palette', fn)}
                  className="mb-2 px-3 py-1 bg-white border rounded shadow cursor-move select-none "
                >
                  {fn}
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/4">
            <h4 className="mb-2">Slots</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(r.slots).map(([slotKey, val]) => (
                <div
                  key={slotKey}
                  data-testid={`${r.rowId}::${slotKey}`}
                  onDragOver={allowDrop}
                  onDrop={e => handleDrop(e, i, slotKey)}
                  className="h-20 border-2 border-blue-300 bg-blue-50 p-3 rounded gap-4 flex items-center justify-center text-center"
                >
                  {val ? (
                    <div data-testid={`${r.rowId}::${slotKey}::${val}`}>{val}</div>
                  ) : (
                    'Drop here'
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/4">
            <h4 className="mb-2">Trash</h4>
            <div
              data-testid={`${r.rowId}::trash`}
              className="border-2 border-red-300 bg-red-100 p-2 rounded w-31 h-48"
              onDragOver={allowDrop}
              onDrop={e => handleDrop(e, i, 'trash')}
            >
              {r.trash.map(fn => (
                <div
                  key={fn}
                  draggable
                  onDragStart={e => handleDragStart(e, r.rowId, 'trash', fn)}
                  className="px-3 py-1 bg-white border rounded shadow cursor-move select-none"
                >
                  {fn}
                </div>
              ))}
            </div>
            </div>
        </div>
      ))}
    </div>
  );
}
