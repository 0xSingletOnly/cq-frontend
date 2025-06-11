import React, { useState, useEffect, useRef } from 'react';

const Spreadsheet = () => {
  const initialStudentsData = [
    { id: 1, firstName: "John", lastName: "Wick", major: "Psychology" },
    { id: 2, firstName: "Ethan", lastName: "Hunt", major: "Deception" },
    { id: 3, firstName: "Rami", lastName: "Malek", major: "Programmer" },
  ];

  const initialColumns = [
    { key: 'firstName', header: 'First Name', type: 'text' },
    { key: 'lastName', header: 'Last Name', type: 'text' },
    { key: 'major', header: 'Major', type: 'text' },
  ];

  const [data, setData] = useState(initialStudentsData);
  const [columns, setColumns] = useState(initialColumns);
  const [editingCell, setEditingCell] = useState(null); // { rowIndex: number, columnKey: string }
  const [editingHeader, setEditingHeader] = useState(null); // { columnKey: string }
  const [editInputValue, setEditInputValue] = useState('');
  const [nextRowId, setNextRowId] = useState(
    initialStudentsData.length > 0 ? Math.max(...initialStudentsData.map(r => r.id)) + 1 : 1
  );

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetRowId: null, targetColumnKey: null, targetType: null });

  const inputRef = useRef(null);

  // Effect to focus and select text in the input field when editing starts
  useEffect(() => {
    if ((editingCell || editingHeader) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell, editingHeader]);

  // --- Column Management ---
  const handleAddColumn = () => {
    const newKey = `newCol_${columns.length}_${Date.now()}`; // Unique key for the new column
    const newColumn = { key: newKey, header: 'New Column', type: 'text' };
    
    setColumns(prevColumns => [...prevColumns, newColumn]);
    setData(prevData =>
      prevData.map(row => ({
        ...row,
        [newKey]: '', // Add empty cell for new column in existing rows
      }))
    );
  };

  // --- Row Management ---
  const handleAddRow = () => {
    const newRow = { id: nextRowId };
    columns.forEach(col => {
      newRow[col.key] = ''; // Initialize all cells in new row as empty
    });
    setData(prevData => [...prevData, newRow]);
    setNextRowId(prevId => prevId + 1);
  };

  // --- Delete Handlers ---
  const handleDeleteRow = (rowIdToDelete) => {
    setData(prevData => prevData.filter(row => row.id !== rowIdToDelete));
  };

  const handleDeleteColumn = (columnKeyToDelete) => {
    setColumns(prevColumns => prevColumns.filter(col => col.key !== columnKeyToDelete));
    setData(prevData =>
      prevData.map(row => {
        const newRow = { ...row };
        delete newRow[columnKeyToDelete];
        return newRow;
      })
    );
    // Cancel edit if the deleted column was being edited
    if (editingHeader?.columnKey === columnKeyToDelete) {
      setEditingHeader(null);
      setEditInputValue('');
    }
    if (editingCell?.columnKey === columnKeyToDelete) {
      setEditingCell(null);
      setEditInputValue('');
    }
    setContextMenu({ visible: false }); // Close context menu if it was open for this column
  };

  const handleOpenContextMenu = (e, type, rowId = null, columnKey = null) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetRowId: rowId,
      targetColumnKey: columnKey,
      targetType: type,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false });
  };

  // Effect to close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.visible) {
        // A more robust check would be to see if the click is outside the menu DOM element
        handleCloseContextMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // --- Editing Handlers ---
  const startCellEdit = (rowIndex, columnKey) => {
    if (editingCell?.rowIndex === rowIndex && editingCell?.columnKey === columnKey) return;
    setEditingHeader(null); // Ensure header editing is stopped
    setEditingCell({ rowIndex, columnKey });
    setEditInputValue(data[rowIndex][columnKey] || '');
  };

  const startHeaderEdit = (columnKey) => {
    if (editingHeader?.columnKey === columnKey) return;
    setEditingCell(null); // Ensure cell editing is stopped
    const currentHeader = columns.find(c => c.key === columnKey)?.header || '';
    setEditingHeader({ columnKey });
    setEditInputValue(currentHeader);
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const saveEdit = () => {
    if (editingCell) {
      const { rowIndex, columnKey } = editingCell;
      setData(prevData => {
        const newData = [...prevData];
        newData[rowIndex] = { ...newData[rowIndex], [columnKey]: editInputValue };
        return newData;
      });
      setEditingCell(null);
    } else if (editingHeader) {
      const { columnKey } = editingHeader;
      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.key === columnKey ? { ...col, header: editInputValue } : col
        )
      );
      setEditingHeader(null);
    }
  };

  const handleInputBlur = () => {
    saveEdit();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditingHeader(null);
      setEditInputValue(''); // Clear temporary input value
    }
  };

  // --- CSS Styles ---
  const styles = `
    .spreadsheet-container {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .spreadsheet-container table {
      border-collapse: collapse;
      width: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      table-layout: fixed; /* Helps with consistent column widths */
    }
    .spreadsheet-container th, .spreadsheet-container td {
      border: 1px solid #ddd;
      padding: 0; /* Remove padding, input will handle it */
      text-align: left;
      vertical-align: middle; /* Changed from top to middle */
      min-width: 120px; /* Minimum width for columns */
      height: 36px; /* Fixed height for cells */
      box-sizing: border-box;
    }
    .spreadsheet-container thead th {
      background-color: #f8f9fa;
      font-weight: bold;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .spreadsheet-container .row-number-header, .spreadsheet-container .row-number {
      background-color: #f8f9fa;
      text-align: center;
      color: #6c757d;
      font-weight: normal;
      min-width: 50px;
      width: 50px; /* Fixed width for row numbers */
      user-select: none;
      padding: 8px 10px; /* Add padding back for non-input display */
    }
    .spreadsheet-container .row-number {
      font-size: 0.9em;
    }
    .spreadsheet-container td.data-cell { /* Class for data cells */
      cursor: cell;
      padding: 8px 10px; /* Add padding back for non-input display */
    }
    .spreadsheet-container input.cell-editor-input,
    .spreadsheet-container input.header-editor-input {
      width: 100%;
      height: 100%;
      border: 2px solid #007bff; /* Blue border for active edit */
      padding: 0 8px; /* Adjusted padding for input */
      font-size: inherit;
      font-family: inherit;
      box-sizing: border-box;
      outline: none;
    }
    .spreadsheet-container input.header-editor-input {
      background-color: #fff; /* Ensure input is visible on header bg */
    }
    .spreadsheet-container .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between; /* Pushes icon to the right */
      padding: 8px 10px; /* Add padding back for non-input display */
      cursor: text;
    }
    .spreadsheet-container .col-type-icon {
      margin-left: 8px;
      cursor: pointer;
      font-weight: bold;
      color: #4a5568; /* Subtler color for icon */
      user-select: none;
      font-size: 0.8em;
      padding: 2px 4px;
      border-radius: 3px;
    }
    .spreadsheet-container .col-type-icon:hover {
      background-color: #e2e8f0;
    }
    .spreadsheet-container .add-column-header {
      text-align: center;
      min-width: 120px; /* Consistent with other columns */
      width: 120px;
      padding: 0; /* Button will fill */
    }
    .spreadsheet-container .add-column-header button,
    .spreadsheet-container .add-row-button {
      background-color: #e9ecef; /* Lighter, less prominent button */
      color: #495057;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
      transition: background-color 0.2s;
    }
    .spreadsheet-container .add-column-header button {
        width: 100%;
        height: 100%;
        border-radius: 0; /* No radius for button inside cell */
        border-left: 1px solid #ddd; /* Separator */
    }
    .spreadsheet-container .add-column-header button:hover,
    .spreadsheet-container .add-row-button:hover {
      background-color: #ced4da;
    }
    .spreadsheet-container .add-row-button {
      margin-top: 15px;
      display: inline-block;
    }
    .spreadsheet-container tbody tr:hover td.data-cell {
      background-color: #f0f4f8; /* Light blue hover */
    }
    .spreadsheet-container .row-actions-cell {
        min-width: 120px; /* Keep for alignment */
        width: 120px; /* Keep for alignment */
        /* Content removed, styling might be adjusted or removed later if cell is no longer needed */
    }
    /* Removed .delete-row-btn, .header-icons, .delete-column-btn styles */
    .context-menu {
      position: fixed;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
      z-index: 1000;
      padding: 8px 0;
      border-radius: 4px;
      min-width: 150px;
    }
    .context-menu-item {
      padding: 8px 16px;
      cursor: pointer;
      font-size: 0.9em;
    }
    .context-menu-item:hover {
      background-color: #f0f0f0;
    }
  `;

  return (
    <div className="spreadsheet-container">
      <style>{styles}</style>
      <table>
        <thead>
          <tr>
            <th className="row-number-header">#</th>
            {columns.map(col => (
              <th key={col.key}>
                {editingHeader?.columnKey === col.key ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    className="header-editor-input"
                  />
                ) : (
                  <div className="header-content" 
                       onDoubleClick={() => startHeaderEdit(col.key)}
                       onContextMenu={(e) => handleOpenContextMenu(e, 'header', null, col.key)}>
                    <span>{col.header}</span>
                    <span className="col-type-icon" title="Edit Header" onClick={() => startHeaderEdit(col.key)}>T</span>
                  </div>
                )}
              </th>
            ))}
            <th className="add-column-header">
              <button onClick={handleAddColumn}>+ Add Column</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="row-number">{rowIndex + 1}</td>
              {columns.map(col => (
                <td
                  key={col.key}
                  onClick={() => startCellEdit(rowIndex, col.key)}
                  onContextMenu={(e) => handleOpenContextMenu(e, 'cell', row.id, col.key)}
                  className="data-cell"
                >
                  {editingCell?.rowIndex === rowIndex && editingCell?.columnKey === col.key ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleInputKeyDown}
                      className="cell-editor-input"
                    />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <td className="row-actions-cell"></td> {/* Kept for alignment, content removed */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-button" onClick={handleAddRow}>+ New Row</button>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} // Prevent click inside menu from closing it immediately
        >
          {contextMenu.targetType === 'cell' && (
            <div className="context-menu-item" onClick={() => { handleDeleteRow(contextMenu.targetRowId); handleCloseContextMenu(); }}>
              Delete Row
            </div>
          )}
          {(contextMenu.targetType === 'cell' || contextMenu.targetType === 'header') && (
            <div className="context-menu-item" onClick={() => { handleDeleteColumn(contextMenu.targetColumnKey); handleCloseContextMenu(); }}>
              Delete Column
            </div>
          )}
          {/* Add more context menu items here if needed */}
        </div>
      )}
    </div>
  );
};

export default Spreadsheet; // Assuming it might be used in a module system
